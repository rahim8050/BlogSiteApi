<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { posts, categories, tags } from '@/services/api';
import { useAuthStore } from '@/stores/auth';
import { useToastStore } from '@/stores/toast';

interface Post {
    id: number;
    title: string;
    slug: string;
    user: { id: number } | null;
    category: { id: number; name: string };
    created_at: string;
}

interface Category {
    id: number;
    name: string;
    slug: string;
}

interface Tag {
    id: number;
    name: string;
    slug: string;
}

const auth = useAuthStore();
const toast = useToastStore();

const myPosts = ref<Post[]>([]);
const allCategories = ref<Category[]>([]);
const allTags = ref<Tag[]>([]);
const loading = ref(true);
const activeTab = ref<'posts' | 'categories' | 'tags'>('categories');

const categoryName = ref('');
const editingCategory = ref<number | null>(null);
const editCategoryName = ref('');

const tagName = ref('');
const editingTag = ref<number | null>(null);
const editTagName = ref('');

const isAuthorOrHigher = computed(() => auth.isAuthor || auth.isEditor || auth.isAdmin);

async function fetchMyPosts() {
    try {
        const response = await posts.getAll();
        if (auth.isAuthor) {
            myPosts.value = response.data.data.filter((p: Post) => p.user?.id === auth.user?.id);
        } else {
            myPosts.value = response.data.data;
        }
    } catch {
        toast.error('Failed to load posts');
    }
}

async function fetchCategories() {
    try {
        const response = await categories.getAll();
        allCategories.value = response.data;
    } catch {
        toast.error('Failed to load categories');
    }
}

async function fetchTags() {
    try {
        const response = await tags.getAll();
        allTags.value = response.data;
    } catch {
        toast.error('Failed to load tags');
    }
}

async function deletePost(id: number) {
    if (!confirm('Are you sure you want to delete this post?')) return;
    try {
        await posts.delete(id);
        await fetchMyPosts();
        toast.success('Post deleted successfully');
    } catch {
        toast.error('Failed to delete post');
    }
}

async function createCategory() {
    if (!categoryName.value.trim()) return;
    try {
        await categories.create({ name: categoryName.value });
        categoryName.value = '';
        await fetchCategories();
        toast.success('Category created successfully');
    } catch {
        toast.error('Failed to create category');
    }
}

function startEditCategory(category: Category) {
    editingCategory.value = category.id;
    editCategoryName.value = category.name;
}

async function saveEditCategory() {
    if (!editingCategory.value || !editCategoryName.value.trim()) return;
    try {
        await categories.update(editingCategory.value, { name: editCategoryName.value });
        editingCategory.value = null;
        editCategoryName.value = '';
        await fetchCategories();
        toast.success('Category updated successfully');
    } catch {
        toast.error('Failed to update category');
    }
}

function cancelEditCategory() {
    editingCategory.value = null;
    editCategoryName.value = '';
}

async function deleteCategory(id: number) {
    if (!confirm('Are you sure you want to delete this category?')) return;
    try {
        await categories.delete(id);
        await fetchCategories();
        toast.success('Category deleted successfully');
    } catch {
        toast.error('Failed to delete category');
    }
}

async function createTag() {
    if (!tagName.value.trim()) return;
    try {
        await tags.create({ name: tagName.value });
        tagName.value = '';
        await fetchTags();
        toast.success('Tag created successfully');
    } catch {
        toast.error('Failed to create tag');
    }
}

function startEditTag(tag: Tag) {
    editingTag.value = tag.id;
    editTagName.value = tag.name;
}

async function saveEditTag() {
    if (!editingTag.value || !editTagName.value.trim()) return;
    try {
        await tags.update(editingTag.value, { name: editTagName.value });
        editingTag.value = null;
        editTagName.value = '';
        await fetchTags();
        toast.success('Tag updated successfully');
    } catch {
        toast.error('Failed to update tag');
    }
}

function cancelEditTag() {
    editingTag.value = null;
    editTagName.value = '';
}

async function deleteTag(id: number) {
    if (!confirm('Are you sure you want to delete this tag?')) return;
    try {
        await tags.delete(id);
        await fetchTags();
        toast.success('Tag deleted successfully');
    } catch {
        toast.error('Failed to delete tag');
    }
}

onMounted(async () => {
    loading.value = true;
    await Promise.all([fetchMyPosts(), fetchCategories(), fetchTags()]);
    loading.value = false;
});
</script>

<template>
    <div class="dashboard">
        <div class="page-header">
            <h1>Dashboard</h1>
            <p class="role-info">Role: {{ auth.user?.role }}</p>
        </div>

        <nav class="tabs">
            <button v-if="auth.isAuthor || auth.isEditor || auth.isAdmin" :class="{ active: activeTab === 'posts' }" @click="activeTab = 'posts'">Posts</button>
            <button v-if="auth.isAdmin || auth.isEditor" :class="{ active: activeTab === 'categories' }" @click="activeTab = 'categories'">Categories</button>
            <button v-if="auth.isAdmin || auth.isEditor" :class="{ active: activeTab === 'tags' }" @click="activeTab = 'tags'">Tags</button>
        </nav>

        <div v-if="loading" class="loading">Loading...</div>

        <div v-else-if="activeTab === 'posts'" class="tab-content">
            <div class="actions">
                <router-link v-if="isAuthorOrHigher" to="/dashboard/posts/create" class="btn-primary">
                    Create New Post
                </router-link>
            </div>
            <table v-if="myPosts.length" class="posts-table">
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
            <p v-else class="empty-state">No posts yet.</p>
        </div>

        <div v-else-if="activeTab === 'categories'" class="tab-content">
            <form @submit.prevent="createCategory" class="create-form">
                <input v-model="categoryName" type="text" placeholder="Category name" />
                <button type="submit" class="btn-primary">Create Category</button>
            </form>

            <div v-if="allCategories.length" class="items-list">
                <div v-for="category in allCategories" :key="category.id" class="item-row">
                    <template v-if="editingCategory === category.id">
                        <input v-model="editCategoryName" type="text" class="edit-input" @keyup.enter="saveEditCategory" />
                        <button @click="saveEditCategory" class="btn-save">Save</button>
                        <button @click="cancelEditCategory" class="btn-cancel">Cancel</button>
                    </template>
                    <template v-else>
                        <span class="item-name">{{ category.name }}</span>
                        <div class="item-actions">
                            <button @click="startEditCategory(category)" class="btn-edit">Edit</button>
                            <button @click="deleteCategory(category.id)" class="btn-delete">Delete</button>
                        </div>
                    </template>
                </div>
            </div>
            <p v-else class="empty-state">No categories yet.</p>
        </div>

        <div v-else-if="activeTab === 'tags'" class="tab-content">
            <form @submit.prevent="createTag" class="create-form">
                <input v-model="tagName" type="text" placeholder="Tag name" />
                <button type="submit" class="btn-primary">Create Tag</button>
            </form>

            <div v-if="allTags.length" class="items-list">
                <div v-for="tag in allTags" :key="tag.id" class="item-row">
                    <template v-if="editingTag === tag.id">
                        <input v-model="editTagName" type="text" class="edit-input" @keyup.enter="saveEditTag" />
                        <button @click="saveEditTag" class="btn-save">Save</button>
                        <button @click="cancelEditTag" class="btn-cancel">Cancel</button>
                    </template>
                    <template v-else>
                        <span class="item-name">{{ tag.name }}</span>
                        <div class="item-actions">
                            <button @click="startEditTag(tag)" class="btn-edit">Edit</button>
                            <button @click="deleteTag(tag.id)" class="btn-delete">Delete</button>
                        </div>
                    </template>
                </div>
            </div>
            <p v-else class="empty-state">No tags yet.</p>
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
.btn-primary { background: var(--primary); color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-weight: 500; border: none; cursor: pointer; }
.btn-primary:hover { background: var(--primary-hover); }
.posts-table { width: 100%; border-collapse: collapse; background: var(--bg-primary); border-radius: 8px; overflow: hidden; }
.posts-table th, .posts-table td { padding: 14px 16px; text-align: left; border-bottom: 1px solid var(--border); }
.posts-table th { background: var(--bg-tertiary); font-weight: 600; color: var(--text-secondary); }
.posts-table tr:hover { background: var(--bg-secondary); }
.posts-table .actions { display: flex; gap: 12px; }
.posts-table .actions a { text-decoration: none; font-weight: 500; }
.posts-table .actions a:last-child { color: #ef4444; }
.create-form { display: flex; gap: 12px; margin-bottom: 24px; }
.create-form input { flex: 1; padding: 10px 14px; border: 1px solid var(--border); border-radius: 6px; background: var(--bg-primary); color: var(--text-primary); }
.items-list { display: flex; flex-direction: column; gap: 8px; }
.item-row { display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; background: var(--bg-primary); border-radius: 8px; border: 1px solid var(--border); }
.item-name { font-weight: 500; color: var(--text-primary); }
.item-actions { display: flex; gap: 8px; }
.edit-input { padding: 8px 12px; border: 1px solid var(--primary); border-radius: 6px; background: var(--bg-secondary); color: var(--text-primary); flex: 1; margin-right: 8px; }
.btn-save { background: #22c55e; color: white; padding: 6px 12px; border: none; border-radius: 4px; cursor: pointer; }
.btn-cancel { background: var(--text-muted); color: white; padding: 6px 12px; border: none; border-radius: 4px; cursor: pointer; }
.btn-edit { background: var(--primary); color: white; padding: 6px 12px; border: none; border-radius: 4px; cursor: pointer; }
.btn-delete { background: #ef4444; color: white; padding: 6px 12px; border: none; border-radius: 4px; cursor: pointer; }
.empty-state { text-align: center; padding: 40px; color: var(--text-muted); }
.loading { text-align: center; padding: 40px; color: var(--text-muted); }
</style>