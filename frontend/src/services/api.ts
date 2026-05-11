import axios from 'axios';
import { useToastStore } from '@/stores/toast';

const api = axios.create({
    baseURL: 'http://localhost:8010/api',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        const toast = useToastStore();
        const status = error.response?.status;
        const data = error.response?.data;

        if (status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
            toast.error('Session expired. Please login again.');
        } else if (status === 422) {
            const messages = data?.errors
                ? Object.values(data.errors).flat().join(', ')
                : data?.message || 'Validation error';
            toast.error(messages);
        } else if (status === 403) {
            toast.error('You do not have permission to perform this action.');
        } else if (status === 404) {
            toast.error('Resource not found.');
        } else if (status === 500) {
            toast.error('Server error. Please try again later.');
        } else if (data?.message) {
            toast.error(data.message);
        } else {
            toast.error('An error occurred. Please try again.');
        }

        return Promise.reject(error);
    }
);

export const auth = {
    register: (data: { name: string; email: string; password: string; password_confirmation: string; role: string }) =>
        api.post('/register', data),
    login: (data: { email: string; password: string }) =>
        api.post('/login', data),
    logout: () => api.post('/logout'),
};

export const posts = {
    getAll: (params?: { search?: string; page?: number }) => api.get('/posts', { params }),
    getOne: (id: number) => api.get(`/posts/${id}`),
    create: (data: FormData) => api.post('/posts', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
    update: (id: number, data: FormData) => api.post(`/posts/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
    delete: (id: number) => api.delete(`/posts/${id}`),
};

export const categories = {
    getAll: () => api.get('/categories'),
    create: (data: { name: string }) => api.post('/categories', data),
    update: (id: number, data: { name: string }) => api.put(`/categories/${id}`, data),
    delete: (id: number) => api.delete(`/categories/${id}`),
};

export const tags = {
    getAll: () => api.get('/tags'),
    create: (data: { name: string }) => api.post('/tags', data),
    update: (id: number, data: { name: string }) => api.put(`/tags/${id}`, data),
    delete: (id: number) => api.delete(`/tags/${id}`),
};

export const comments = {
    getByPost: (postId: number) => api.get(`/posts/${postId}/comments`),
    create: (postId: number, data: { body: string }) => api.post(`/posts/${postId}/comments`, data),
    delete: (id: number) => api.delete(`/comments/${id}`),
};

export default api;