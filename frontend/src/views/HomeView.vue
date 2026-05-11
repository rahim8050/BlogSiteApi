<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { posts } from '@/services/api';

interface Post {
    id: number;
    title: string;
    slug: string;
    body: string;
    cover_image: string | null;
    user: { id: number; name: string };
    category: { id: number; name: string };
    tags: { id: number; name: string }[];
    created_at: string;
}

const router = useRouter();
const loading = ref(false);
const postsList = ref<Post[]>([]);
const search = ref('');
const page = ref(1);
const meta = ref({ current_page: 1, last_page: 1, per_page: 10 });

async function fetchPosts() {
    loading.value = true;
    try {
        const response = await posts.getAll({ search: search.value || undefined, page: page.value });
        postsList.value = response.data.data;
        meta.value = response.data.meta;
    } finally {
        loading.value = false;
    }
}

function goToPage(p: number) {
    if (p >= 1 && p <= meta.value.last_page) {
        page.value = p;
        fetchPosts();
    }
}

function viewPost(post: Post) {
    router.push({ name: 'post-detail', params: { id: post.id } });
}

onMounted(fetchPosts);
</script>

<template>
    <div class="home">
        <div class="page-header">
            <h1>Blog Posts</h1>
        </div>

        <div class="search-bar">
            <input
                v-model="search"
                type="text"
                placeholder="Search posts..."
                @keyup.enter="page = 1; fetchPosts()"
            />
            <button @click="page = 1; fetchPosts()">Search</button>
        </div>

        <div v-if="loading" class="loading">Loading...</div>

        <div v-else class="posts-grid">
            <article v-for="post in postsList" :key="post.id" class="post-card" @click="viewPost(post)">
                <img v-if="post.cover_image" :src="`http://localhost:8010/storage/${post.cover_image}`" :alt="post.title" class="post-image" />
                <div class="post-content">
                    <span class="category">{{ post.category?.name }}</span>
                    <h2>{{ post.title }}</h2>
                    <p class="excerpt">{{ post.body.substring(0, 150) }}...</p>
                    <div class="meta">
                        <span>By {{ post.user?.name }}</span>
                        <span>{{ new Date(post.created_at).toLocaleDateString() }}</span>
                    </div>
                    <div class="tags">
                        <span v-for="tag in post.tags" :key="tag.id" class="tag">{{ tag.name }}</span>
                    </div>
                </div>
            </article>
        </div>

        <div v-if="meta.last_page > 1" class="pagination">
            <button :disabled="page === 1" @click="goToPage(page - 1)">Previous</button>
            <span>Page {{ page }} of {{ meta.last_page }}</span>
            <button :disabled="page === meta.last_page" @click="goToPage(page + 1)">Next</button>
        </div>
    </div>
</template>

<style scoped>
.home { width: 100%; }
.page-header { margin-bottom: 24px; }
.page-header h1 { font-size: 28px; font-weight: 700; color: var(--text-primary); }
.search-bar { display: flex; gap: 12px; margin-bottom: 24px; flex-wrap: wrap; }
.search-bar input { flex: 1; min-width: 200px; }
.posts-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px; width: 100%; }
.post-card { border: 1px solid var(--border); border-radius: 8px; overflow: hidden; cursor: pointer; transition: transform 0.2s, box-shadow 0.2s; background: var(--bg-primary); }
.post-card:hover { transform: translateY(-2px); box-shadow: var(--shadow-lg); }
.post-image { width: 100%; height: 180px; object-fit: cover; background: var(--bg-tertiary); }
.post-content { padding: 16px; }
.category { background: var(--bg-tertiary); color: var(--text-secondary); padding: 4px 10px; border-radius: 4px; font-size: 12px; font-weight: 500; }
.post-content h2 { margin: 12px 0; font-size: 18px; font-weight: 600; color: var(--text-primary); }
.excerpt { color: var(--text-secondary); font-size: 14px; }
.meta { display: flex; justify-content: space-between; font-size: 13px; color: var(--text-muted); margin: 12px 0; }
.tags { display: flex; gap: 6px; flex-wrap: wrap; }
.tag { background: var(--bg-tertiary); color: var(--text-secondary); padding: 3px 10px; border-radius: 4px; font-size: 12px; }
.pagination { display: flex; justify-content: center; align-items: center; gap: 16px; margin-top: 24px; }
.loading { text-align: center; padding: 60px; color: var(--text-muted); }
</style>