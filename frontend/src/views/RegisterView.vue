<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const auth = useAuthStore();

const name = ref('');
const email = ref('');
const password = ref('');
const passwordConfirmation = ref('');
const role = ref('reader');
const error = ref('');

const roles = [
    { value: 'reader', label: 'Reader' },
    { value: 'author', label: 'Author' },
    { value: 'editor', label: 'Editor' },
    { value: 'admin', label: 'Admin' },
];

async function handleRegister() {
    error.value = '';
    if (password.value !== passwordConfirmation.value) {
        error.value = 'Passwords do not match';
        return;
    }
    try {
        await auth.register({
            name: name.value,
            email: email.value,
            password: password.value,
            password_confirmation: passwordConfirmation.value,
            role: role.value,
        }, router);
    } catch (e: unknown) {
        error.value = e instanceof Error ? e.message : 'Registration failed';
    }
}
</script>

<template>
    <div class="register-page">
        <div class="register-form">
            <h1>Register</h1>
            <form @submit.prevent="handleRegister">
                <div class="form-group">
                    <label for="name">Name</label>
                    <input id="name" v-model="name" type="text" required />
                </div>
                <div class="form-group">
                    <label for="email">Email</label>
                    <input id="email" v-model="email" type="email" required />
                </div>
                <div class="form-group">
                    <label for="password">Password</label>
                    <input id="password" v-model="password" type="password" required />
                </div>
                <div class="form-group">
                    <label for="password_confirmation">Confirm Password</label>
                    <input id="password_confirmation" v-model="passwordConfirmation" type="password" required />
                </div>
                <div class="form-group">
                    <label for="role">Role</label>
                    <select id="role" v-model="role">
                        <option v-for="r in roles" :key="r.value" :value="r.value">{{ r.label }}</option>
                    </select>
                </div>
                <div v-if="error" class="error">{{ error }}</div>
                <button type="submit" :disabled="auth.loading">
                    {{ auth.loading ? 'Registering...' : 'Register' }}
                </button>
            </form>
            <p>Already have an account? <router-link to="/login">Login</router-link></p>
        </div>
    </div>
</template>

<style scoped>
.register-page { display: flex; justify-content: center; align-items: center; min-height: 80vh; padding: 20px; }
.register-form { width: 100%; max-width: 400px; padding: 32px; border: 1px solid var(--border); border-radius: 8px; background: var(--bg-primary); box-shadow: var(--shadow); }
.register-form h1 { text-align: center; margin-bottom: 24px; font-size: 24px; color: var(--text-primary); }
.form-group { margin-bottom: 16px; }
button { width: 100%; padding: 12px; font-size: 15px; font-weight: 500; }
.error { color: #ef4444; margin-bottom: 12px; font-size: 14px; }
p { text-align: center; margin-top: 16px; color: var(--text-secondary); }
</style>