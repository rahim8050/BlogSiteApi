import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { auth } from '@/services/api';
import { useToastStore } from '@/stores/toast';
import type { Router } from 'vue-router';

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
}

export const useAuthStore = defineStore('auth', () => {
    const user = ref<User | null>(null);
    const token = ref<string | null>(localStorage.getItem('token'));
    const loading = ref(false);

    const isAuthenticated = computed(() => !!token.value);
    const isAdmin = computed(() => user.value?.role === 'admin');
    const isEditor = computed(() => user.value?.role === 'editor');
    const isAuthor = computed(() => user.value?.role === 'author');

    function setToken(tokenValue: string) {
        token.value = tokenValue;
        localStorage.setItem('token', tokenValue);
    }

    async function login(credentials: { email: string; password: string }, router?: Router) {
        loading.value = true;
        const toast = useToastStore();
        try {
            const response = await auth.login(credentials);
            setToken(response.data.token);
            setUserWithStorage(response.data.user);
            toast.success('Login successful!');
            if (router) router.push('/');
        } finally {
            loading.value = false;
        }
    }

    async function register(data: { name: string; email: string; password: string; password_confirmation: string; role: string }, router?: Router) {
        loading.value = true;
        const toast = useToastStore();
        try {
            const response = await auth.register(data);
            setToken(response.data.token);
            setUserWithStorage(response.data.user);
            toast.success('Registration successful!');
            if (router) router.push('/');
        } finally {
            loading.value = false;
        }
    }

    async function logout(router?: Router) {
        const toast = useToastStore();
        try {
            await auth.logout();
            toast.success('Logged out successfully');
        } finally {
            token.value = null;
            user.value = null;
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            if (router) router.push('/login');
        }
    }

    function init() {
        if (token.value && !user.value) {
            // Token exists but no user data yet - need to fetch user from API
            // For now, we need to store user data in localStorage on login/register
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                user.value = JSON.parse(storedUser);
            }
        }
    }

    function setUserWithStorage(userData: User) {
        user.value = userData;
        localStorage.setItem('user', JSON.stringify(userData));
    }

    return {
        user,
        token,
        loading,
        isAuthenticated,
        isAdmin,
        isEditor,
        isAuthor,
        login,
        register,
        logout,
        init,
    };
});