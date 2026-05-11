<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { posts, categories, tags } from '@/services/api';

interface Category { id: number; name: string }
interface Tag { id: number; name: string }

const router = useRouter();

const title = ref('');
const body = ref('');
const categoryId = ref<number | null>(null);
const selectedTags = ref<number[]>([]);
const coverImage = ref<File | null>(null);

const categoriesList = ref<Category[]>([]);
const tagsList = ref<Tag[]>([]);
const loading = ref(false);
const error = ref('');

async function fetchData() {
    try {
        const [catRes, tagRes] = await Promise.all([categories.getAll(), tags.getAll()]);
        categoriesList.value = catRes.data;
        tagsList.value = tagRes.data;
    } catch {
        error.value = 'Failed to load data';
    }
}

function handleFileChange(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files?.[0]) {
        coverImage.value = target.files[0];
    }
}

async function createPost() {
    if (!title.value || !body.value || !categoryId.value) {
        error.value = 'Please fill all required fields';
        return;
    }

    loading.value = true;
    error.value = '';

    const formData = new FormData();
    formData.append('title', title.value);
    formData.append('body', body.value);
    formData.append('category_id', String(categoryId.value));
    if (coverImage.value) {
        formData.append('cover_image', coverImage.value);
    }
    selectedTags.value.forEach((id) => formData.append('tags[]', String(id)));

    try {
        await posts.create(formData);
        router.push('/dashboard');
    } catch {
        error.value = 'Failed to create post';
    } finally {
        loading.value = false;
    }
}

onMounted(fetchData);
</script>

<template>
    <div class="create-post">
        <div class="back-link">
            <router-link to="/dashboard">← Back to Dashboard</router-link>
        </div>

        <h1>Create New Post</h1>

        <div v-if="error" class="error">{{ error }}</div>

        <form @submit.prevent="createPost">
            <div class="form-group">
                <label for="title">Title *</label>
                <input id="title" v-model="title" type="text" required />
            </div>

            <div class="form-group">
                <label for="category">Category *</label>
                <select id="category" v-model="categoryId" required>
                    <option :value="null" disabled>Select a category</option>
                    <option v-for="cat in categoriesList" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
                </select>
            </div>

            <div class="form-group">
                <label for="body">Content *</label>
                <textarea id="body" v-model="body" rows="15" required></textarea>
            </div>

            <div class="form-group">
                <label for="cover_image">Cover Image</label>
                <input id="cover_image" type="file" accept="image/*" @change="handleFileChange" />
            </div>

            <div class="form-group">
                <label>Tags</label>
                <div class="tags-select">
                    <label v-for="tag in tagsList" :key="tag.id" class="tag-checkbox">
                        <input type="checkbox" :value="tag.id" v-model="selectedTags" />
                        {{ tag.name }}
                    </label>
                </div>
            </div>

            <button type="submit" :disabled="loading">
                {{ loading ? 'Creating...' : 'Create Post' }}
            </button>
        </form>
    </div>
</template>

<style scoped>
.create-post { max-width: 800px; margin: 0 auto; padding: 24px; background: var(--bg-primary); border-radius: 8px; border: 1px solid var(--border); }
.back-link { margin-bottom: 20px; }
.back-link a { text-decoration: none; font-weight: 500; }
h1 { margin-bottom: 24px; font-size: 24px; color: var(--text-primary); }
.form-group { margin-bottom: 20px; }
.form-group textarea { resize: vertical; min-height: 200px; }
.tags-select { display: flex; flex-wrap: wrap; gap: 12px; }
.tag-checkbox { display: flex; align-items: center; gap: 6px; cursor: pointer; padding: 6px 12px; background: var(--bg-tertiary); border-radius: 4px; font-size: 14px; }
.tag-checkbox:hover { background: var(--border); }
button { padding: 12px 24px; font-size: 15px; font-weight: 500; }
.error { color: #ef4444; margin-bottom: 16px; font-size: 14px; }
</style>