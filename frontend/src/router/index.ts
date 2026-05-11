import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: () => import('../views/HomeView.vue'),
        },
        {
            path: '/posts',
            name: 'posts',
            component: () => import('../views/HomeView.vue'),
        },
        {
            path: '/login',
            name: 'login',
            component: () => import('../views/LoginView.vue'),
            meta: { guest: true },
        },
        {
            path: '/register',
            name: 'register',
            component: () => import('../views/RegisterView.vue'),
            meta: { guest: true },
        },
        {
            path: '/posts/:id',
            name: 'post-detail',
            component: () => import('../views/PostDetailView.vue'),
        },
        {
            path: '/dashboard',
            name: 'dashboard',
            component: () => import('../views/DashboardView.vue'),
            meta: { requiresAuth: true },
        },
        {
            path: '/dashboard/posts/create',
            name: 'post-create',
            component: () => import('../views/PostCreateView.vue'),
            meta: { requiresAuth: true, roles: ['admin', 'editor', 'author'] },
        },
        {
            path: '/dashboard/posts/:id/edit',
            name: 'post-edit',
            component: () => import('../views/PostEditView.vue'),
            meta: { requiresAuth: true },
        },
    ],
});

router.beforeEach((to, _from, next) => {
    const auth = useAuthStore();
    auth.init();

    if (to.meta.requiresAuth && !auth.isAuthenticated) {
        return next({ name: 'login', query: { redirect: to.fullPath } });
    }

    if (to.meta.guest && auth.isAuthenticated) {
        return next({ name: 'home' });
    }

    if (to.meta.roles && auth.user) {
        const roles = to.meta.roles as string[];
        if (!roles.includes(auth.user.role)) {
            return next({ name: 'home' });
        }
    }

    next();
});

export default router;