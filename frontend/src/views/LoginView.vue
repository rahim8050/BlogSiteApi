<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const auth = useAuthStore();

const email = ref('');
const password = ref('');
const error = ref('');

async function handleLogin() {
    error.value = '';
    try {
        await auth.login({ email: email.value, password: password.value }, router);
    } catch (e: unknown) {
        error.value = e instanceof Error ? e.message : 'Login failed';
    }
}
</script>

<template>
    <div class="login-page">
        <div class="login-form">
            <h1>Login</h1>
            <form @submit.prevent="handleLogin">
                <div class="form-group">
                    <label for="email">Email</label>
                    <input id="email" v-model="email" type="email" required />
                </div>
                <div class="form-group">
                    <label for="password">Password</label>
                    <input id="password" v-model="password" type="password" required />
                </div>
                <div v-if="error" class="error">{{ error }}</div>
                <button type="submit" :disabled="auth.loading">
                    {{ auth.loading ? 'Logging in...' : 'Login' }}
                </button>
            </form>
            <p>Don't have an account? <router-link to="/register">Register</router-link></p>
        </div>
    </div>
</template>

<style scoped>
.login-page { display: flex; justify-content: center; align-items: center; min-height: 80vh; padding: 20px; }
.login-form { width: 100%; max-width: 400px; padding: 32px; border: 1px solid var(--border); border-radius: 8px; background: var(--bg-primary); box-shadow: var(--shadow); }
.login-form h1 { text-align: center; margin-bottom: 24px; font-size: 24px; color: var(--text-primary); }
.form-group { margin-bottom: 16px; }
button { width: 100%; padding: 12px; font-size: 15px; font-weight: 500; }
.error { color: #ef4444; margin-bottom: 12px; font-size: 14px; }
p { text-align: center; margin-top: 16px; color: var(--text-secondary); }
</style>