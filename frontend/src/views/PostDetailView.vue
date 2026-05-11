<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { posts, comments } from '@/services/api';
import { useAuthStore } from '@/stores/auth';

const route = useRoute();
const auth = useAuthStore();

interface Post {
    id: number;
    title: string;
    body: string;
    slug: string;
    cover_image: string | null;
    user: { id: number; name: string };
    category: { id: number; name: string };
    tags: { id: number; name: string }[];
    comments: { id: number; body: string; user: { id: number; name: string }; created_at: string }[];
    created_at: string;
}

const post = ref<Post | null>(null);
const loading = ref(true);
const newComment = ref('');
const submitting = ref(false);
const error = ref('');

async function fetchPost() {
    try {
        const response = await posts.getOne(Number(route.params.id));
        post.value = response.data;
    } catch {
        error.value = 'Failed to load post';
    } finally {
        loading.value = false;
    }
}

async function addComment() {
    if (!newComment.value.trim()) return;
    submitting.value = true;
    try {
        await comments.create(post.value!.id, { body: newComment.value });
        newComment.value = '';
        await fetchPost();
    } catch {
        error.value = 'Failed to add comment';
    } finally {
        submitting.value = false;
    }
}

async function deleteComment(commentId: number) {
    if (!confirm('Delete this comment?')) return;
    try {
        await comments.delete(commentId);
        await fetchPost();
    } catch {
        error.value = 'Failed to delete comment';
    }
}

function canDeleteComment(comment: { user: { id: number } }) {
    return auth.isAuthenticated && (auth.user?.id === comment.user.id || auth.isAdmin);
}

onMounted(fetchPost);
</script>

<template>
    <div class="post-detail">
        <div class="back-link">
            <router-link to="/">← Back to Posts</router-link>
        </div>

        <div v-if="loading" class="loading">Loading...</div>
        <div v-else-if="error" class="error">{{ error }}</div>

        <article v-if="post" class="post">
            <img v-if="post.cover_image" :src="`http://localhost:8010/storage/${post.cover_image}`" :alt="post.title" class="cover-image" />
            <div class="post-header">
                <span class="category">{{ post.category?.name }}</span>
                <h1>{{ post.title }}</h1>
                <div class="meta">
                    <span>By {{ post.user?.name }}</span>
                    <span>{{ new Date(post.created_at).toLocaleDateString() }}</span>
                </div>
                <div class="tags">
                    <span v-for="tag in post.tags" :key="tag.id" class="tag">{{ tag.name }}</span>
                </div>
            </div>
            <div class="post-body">{{ post.body }}</div>
        </article>

        <section class="comments">
            <h3>Comments</h3>

            <div v-if="auth.isAuthenticated" class="add-comment">
                <textarea v-model="newComment" placeholder="Write a comment..." rows="3"></textarea>
                <button @click="addComment" :disabled="submitting">
                    {{ submitting ? 'Posting...' : 'Post Comment' }}
                </button>
            </div>
            <div v-else class="login-prompt">
                <router-link to="/login">Login</router-link> to leave a comment.
            </div>

            <div class="comment-list">
                <div v-for="comment in post?.comments" :key="comment.id" class="comment">
                    <div class="comment-header">
                        <strong>{{ comment.user?.name }}</strong>
                        <span>{{ new Date(comment.created_at).toLocaleDateString() }}</span>
                        <button v-if="canDeleteComment(comment)" @click="deleteComment(comment.id)" class="delete-btn">Delete</button>
                    </div>
                    <p>{{ comment.body }}</p>
                </div>
                <p v-if="!post?.comments?.length">No comments yet.</p>
            </div>
        </section>
    </div>
</template>

<style scoped>
.post-detail { max-width: 800px; margin: 0 auto; }
.back-link { margin-bottom: 20px; }
.back-link a { text-decoration: none; font-weight: 500; }
.post { margin-bottom: 40px; background: var(--bg-primary); padding: 24px; border-radius: 8px; border: 1px solid var(--border); }
.cover-image { width: 100%; max-height: 400px; object-fit: cover; border-radius: 8px; margin-bottom: 20px; background: var(--bg-tertiary); }
.category { background: var(--bg-tertiary); color: var(--text-secondary); padding: 4px 10px; border-radius: 4px; font-size: 12px; font-weight: 500; }
.post-header h1 { margin: 16px 0; font-size: 28px; color: var(--text-primary); }
.meta { color: var(--text-secondary); font-size: 14px; display: flex; gap: 16px; }
.tags { display: flex; gap: 6px; margin-top: 12px; }
.tag { background: var(--bg-tertiary); color: var(--text-secondary); padding: 3px 10px; border-radius: 4px; font-size: 12px; }
.post-body { line-height: 1.8; margin-top: 24px; white-space: pre-wrap; color: var(--text-secondary); }
.comments { border-top: 1px solid var(--border); padding-top: 24px; }
.add-comment { margin-bottom: 20px; }
.add-comment textarea { width: 100%; }
.add-comment button { margin-top: 10px; }
.login-prompt { margin-bottom: 20px; color: var(--text-secondary); }
.comment { border: 1px solid var(--border); padding: 16px; margin-bottom: 12px; border-radius: 6px; background: var(--bg-primary); }
.comment-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; font-size: 14px; }
.comment-header span { color: var(--text-muted); }
.delete-btn { background: #ef4444; color: white; border: none; padding: 4px 10px; border-radius: 4px; cursor: pointer; font-size: 12px; }
.delete-btn:hover { background: #dc2626; }
.loading, .error { text-align: center; padding: 40px; color: var(--text-muted); }
.error { color: #ef4444; }
</style>