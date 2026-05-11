<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { posts, categories, tags } from '@/services/api';
import { useAuthStore } from '@/stores/auth';

interface Post {
    id: number;
    title: string;
    slug: string;
    user: { id: number } | null;
    category: { id: number; name: string };
    created_at: string;
}

const auth = useAuthStore();

const myPosts = ref<Post[]>([]);
const loading = ref(true);
const error = ref('');
const activeTab = ref<'posts' | 'categories' | 'tags'>('posts');

const categoryName = ref('');
const tagName = ref('');

async function fetchMyPosts() {
    try {
        const response = await posts.getAll();
        if (auth.isAuthor) {
            myPosts.value = response.data.data.filter((p: Post) => p.user?.id === auth.user?.id);
        } else {
            myPosts.value = response.data.data;
        }
    } catch {
        error.value = 'Failed to load posts';
    } finally {
        loading.value = false;
    }
}

async function deletePost(id: number) {
    if (!confirm('Are you sure you want to delete this post?')) return;
    try {
        await posts.delete(id);
        await fetchMyPosts();
    } catch {
        error.value = 'Failed to delete post';
    }
}

async function createCategory() {
    if (!categoryName.value.trim()) return;
    try {
        await categories.create({ name: categoryName.value });
        categoryName.value = '';
    } catch {
        error.value = 'Failed to create category';
    }
}

async function createTag() {
    if (!tagName.value.trim()) return;
    try {
        await tags.create({ name: tagName.value });
        tagName.value = '';
    } catch {
        error.value = 'Failed to create tag';
    }
}

onMounted(fetchMyPosts);
</script>

<template>
    <div class="dashboard">
        <div class="page-header">
            <h1>Dashboard</h1>
            <p class="role-info">Role: {{ auth.user?.role }}</p>
        </div>

        <nav class="tabs">
            <button :class="{ active: activeTab === 'posts' }" @click="activeTab = 'posts'">Posts</button>
            <button v-if="auth.isAdmin || auth.isEditor" :class="{ active: activeTab === 'categories' }" @click="activeTab = 'categories'">Categories</button>
            <button v-if="auth.isAdmin || auth.isEditor" :class="{ active: activeTab === 'tags' }" @click="activeTab = 'tags'">Tags</button>
        </nav>

        <div v-if="error" class="error">{{ error }}</div>

        <div v-if="activeTab === 'posts'" class="tab-content">
            <div class="actions">
                <router-link v-if="auth.isAuthor || auth.isEditor || auth.isAdmin" to="/dashboard/posts/create" class="btn-primary">
                    Create New Post
                </router-link>
            </div>
            <div v-if="loading" class="loading">Loading...</div>
            <table v-else class="posts-table">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Category</th>
                        <th>Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="post in myPosts" :key="post.id">
                        <td>{{ post.title }}</td>
                        <td>{{ post.category?.name }}</td>
                        <td>{{ new Date(post.created_at).toLocaleDateString() }}</td>
                        <td class="actions">
                            <router-link :to="`/posts/${post.id}`">View</router-link>
                            <router-link :to="`/dashboard/posts/${post.id}/edit`">Edit</router-link>
                            <a href="#" @click.prevent="deletePost(post.id)">Delete</a>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div v-if="activeTab === 'categories'" class="tab-content">
            <form @submit.prevent="createCategory" class="create-form">
                <input v-model="categoryName" type="text" placeholder="Category name" />
                <button type="submit">Create Category</button>
            </form>
            <p>Manage categories here (future implementation)</p>
        </div>

        <div v-if="activeTab === 'tags'" class="tab-content">
            <form @submit.prevent="createTag" class="create-form">
                <input v-model="tagName" type="text" placeholder="Tag name" />
                <button type="submit">Create Tag</button>
            </form>
            <p>Manage tags here (future implementation)</p>
        </div>
    </div>
</template>

<style scoped>
.dashboard { width: 100%; }
.page-header { margin-bottom: 24px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; }
.page-header h1 { font-size: 28px; font-weight: 700; color: var(--text-primary); }
.role-info { color: var(--text-secondary); font-size: 14px; text-transform: capitalize; }
.tabs { display: flex; gap: 8px; margin-bottom: 24px; border-bottom: 1px solid var(--border); overflow-x: auto; }
.tabs button { padding: 12px 20px; background: none; border: none; cursor: pointer; border-bottom: 2px solid transparent; color: var(--text-secondary); }
.tabs button:hover { color: var(--text-primary); }
.tabs button.active { border-bottom-color: var(--primary); color: var(--primary); }
.actions { margin-bottom: 16px; }
.btn-primary { background: var(--primary); color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-weight: 500; }
.btn-primary:hover { background: var(--primary-hover); }
.posts-table { width: 100%; border-collapse: collapse; background: var(--bg-primary); border-radius: 8px; overflow: hidden; }
.posts-table th, .posts-table td { padding: 14px 16px; text-align: left; border-bottom: 1px solid var(--border); }
.posts-table th { background: var(--bg-tertiary); font-weight: 600; color: var(--text-secondary); }
.posts-table tr:hover { background: var(--bg-secondary); }
.posts-table .actions { display: flex; gap: 12px; }
.posts-table .actions a { text-decoration: none; font-weight: 500; }
.posts-table .actions a:last-child { color: #ef4444; }
.create-form { display: flex; gap: 12px; margin-bottom: 20px; }
.create-form input { flex: 1; }
.create-form button { padding: 10px 20px; }
.error { color: #ef4444; margin-bottom: 16px; font-size: 14px; }
.loading { text-align: center; padding: 40px; color: var(--text-muted); }
</style>