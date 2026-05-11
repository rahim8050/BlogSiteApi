<script setup lang="ts">
import { RouterView, RouterLink, useRoute } from 'vue-router';
import { computed } from 'vue';
import { useAuthStore } from '@/stores/auth';
import ToastContainer from '@/components/ToastContainer.vue';

const route = useRoute();
const auth = useAuthStore();

const isAuthPage = computed(() => route.name === 'login' || route.name === 'register');

function handleLogout() {
    auth.logout();
}
</script>

<template>
    <div class="app">
        <ToastContainer />
        <header v-if="!isAuthPage" class="header">
            <div class="header-content">
                <RouterLink to="/" class="logo">
                    <span class="logo-icon">B</span>
                    <span class="logo-text">BlogSite</span>
                </RouterLink>

                <button class="mobile-menu-btn" @click="() => {}" aria-label="Toggle menu">
                    <span></span>
                    <span></span>
                    <span></span>
                </button>

                <nav class="nav">
                    <RouterLink to="/" class="nav-link">Home</RouterLink>
                    <RouterLink to="/posts" class="nav-link">Posts</RouterLink>
                    <template v-if="auth.isAuthenticated">
                        <RouterLink to="/dashboard" class="nav-link">Dashboard</RouterLink>
                        <RouterLink v-if="auth.isAuthor || auth.isEditor || auth.isAdmin" to="/dashboard/posts/create" class="nav-link">New Post</RouterLink>
                        <span class="user-info">{{ auth.user?.name }}</span>
                        <button class="logout-btn" @click="handleLogout">Logout</button>
                    </template>
                    <template v-else>
                        <RouterLink to="/login" class="nav-link">Login</RouterLink>
                        <RouterLink to="/register" class="nav-link btn-primary">Sign Up</RouterLink>
                    </template>
                </nav>
            </div>
        </header>

        <main class="main-content">
            <RouterView />
        </main>

        <footer v-if="!isAuthPage" class="footer">
            <p>&copy; 2026 BlogSite. All rights reserved.</p>
        </footer>
    </div>
</template>

<style>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

:root {
    --primary: #9ca3af;
    --primary-hover: #d1d5db;
    --bg-primary: #0a0a0a;
    --bg-secondary: #0a0a0a;
    --bg-tertiary: #171717;
    --text-primary: #fff;
    --text-secondary: #a3a3a3;
    --text-muted: #525252;
    --border: #262626;
    --border-light: #171717;
    --shadow: 0 1px 3px rgb(0 0 0 / 50%);
    --shadow-lg: 0 4px 6px rgb(0 0 0 / 50%);
}

html, body {
    min-height: 100vh;
    width: 100%;
    margin: 0;
    padding: 0;
    background-color: #000 !important;
    overflow-x: hidden;
}

#app {
    width: 100vw;
    max-width: 100vw;
    margin: 0;
    padding: 0;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
    line-height: 1.6;
    color: var(--text-primary);
    background-color: var(--bg-secondary);
}

.app {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    width: 100vw;
    max-width: 100vw;
    margin: 0;
    padding: 0;
    background-color: #000;
}

.header {
    width: 100%;
    background: #000;
    border-bottom: 1px solid var(--border);
    position: sticky;
    top: 0;
    z-index: 100;
    margin: 0;
    padding: 0;
}

.header-content {
    width: 100%;
    max-width: 100%;
    margin: 0 auto;
    padding: 12px 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
}

@media (width >= 640px) {
    .header-content {
        padding: 12px 32px;
        gap: 24px;
    }
}

.logo {
    display: flex;
    align-items: center;
    gap: 8px;
    text-decoration: none;
    font-weight: 700;
    font-size: 20px;
    color: var(--text-primary);
}

.logo-icon {
    width: 32px;
    height: 32px;
    background: var(--primary);
    color: white;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.logo-text {
    display: none;
}

@media (width >= 640px) {
    .logo-text {
        display: inline;
    }
}

.nav {
    display: flex;
    align-items: center;
    gap: 16px;
}

.nav-link {
    color: var(--text-secondary);
    text-decoration: none;
    font-weight: 500;
    padding: 8px 12px;
    border-radius: 6px;
    transition: all 0.2s;
    font-size: 14px;
}

.nav-link:hover {
    color: var(--text-primary);
    background: var(--bg-tertiary);
}

.nav-link.router-link-active {
    color: var(--primary);
}

.btn-primary {
    background: var(--primary);
    color: white;
    padding: 8px 16px;
}

.btn-primary:hover {
    background: var(--primary-hover);
    color: white;
}

.user-info {
    font-size: 14px;
    color: var(--text-secondary);
    padding: 8px 12px;
    display: none;
}

@media (width >= 640px) {
    .user-info {
        display: block;
    }
}

.logout-btn {
    padding: 8px 16px;
    font-size: 14px;
    background: transparent;
    color: var(--text-secondary);
    border: 1px solid var(--border);
}

.logout-btn:hover {
    background: var(--bg-tertiary);
    color: var(--text-primary);
}

.mobile-menu-btn {
    flex-direction: column;
    gap: 4px;
    padding: 8px;
    background: none;
    border: none;
    cursor: pointer;
    display: none;
}

.mobile-menu-btn span {
    width: 20px;
    height: 2px;
    background: var(--text-primary);
    border-radius: 2px;
}

@media (width <= 768px) {
    .mobile-menu-btn {
        display: flex;
    }

    .nav {
        display: none;
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: var(--bg-primary);
        flex-direction: column;
        padding: 16px;
        border-bottom: 1px solid var(--border);
        box-shadow: var(--shadow-lg);
    }

    .nav.open {
        display: flex;
    }
}

.main-content {
    flex: 1;
    width: 100%;
    max-width: 100%;
    margin: 0;
    padding: 16px;
    min-height: calc(100vh - 140px);
    background-color: #000;
}

@media (width >= 640px) {
    .main-content {
        padding: 24px 32px;
    }
}

@media (width >= 1024px) {
    .main-content {
        padding: 32px 48px;
    }
}

.footer {
    width: 100%;
    background: #000;
    border-top: 1px solid var(--border);
    padding: 24px 20px;
    text-align: center;
    color: var(--text-muted);
    font-size: 14px;
    margin: 0;
}

a {
    color: var(--primary);
    text-decoration: none;
    transition: color 0.2s;
}

a:hover {
    color: var(--primary-hover);
}

button {
    background-color: var(--primary);
    color: white;
    border: none;
    border-radius: 6px;
    padding: 10px 20px;
    font-size: 14px;
    cursor: pointer;
    transition: background-color 0.2s;
}

button:hover {
    background-color: var(--primary-hover);
}

button:disabled {
    background-color: #d1d5db;
    cursor: not-allowed;
}

input, select, textarea {
    width: 100%;
    padding: 10px 12px;
    border: 1px solid var(--border);
    border-radius: 6px;
    font-size: 14px;
    background-color: var(--bg-tertiary);
    color: var(--text-primary);
    transition: border-color 0.2s, box-shadow 0.2s;
}

input:focus, select:focus, textarea:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 2px rgb(156 163 175 / 20%);
}

input::placeholder, textarea::placeholder {
    color: var(--text-muted);
}

label {
    display: block;
    margin-bottom: 6px;
    font-weight: 500;
    color: var(--text-secondary);
}
</style>