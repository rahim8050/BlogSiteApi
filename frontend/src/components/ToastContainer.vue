<script setup lang="ts">
import { useToastStore } from '@/stores/toast';

const toastStore = useToastStore();
</script>

<template>
    <div class="toast-container">
        <TransitionGroup name="toast">
            <div
                v-for="toast in toastStore.toasts"
                :key="toast.id"
                class="toast"
                :class="[`toast-${toast.type}`]"
                @click="toastStore.remove(toast.id)"
            >
                <span class="toast-icon">
                    <template v-if="toast.type === 'success'">&#10003;</template>
                    <template v-else-if="toast.type === 'error'">&#10007;</template>
                    <template v-else>&#9432;</template>
                </span>
                <span class="toast-message">{{ toast.message }}</span>
            </div>
        </TransitionGroup>
    </div>
</template>

<style scoped>
.toast-container {
    position: fixed;
    top: 80px;
    right: 20px;
    z-index: 1000;
    display: flex;
    flex-direction: column;
    gap: 10px;
    max-width: 400px;
}

.toast {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 18px;
    border-radius: 8px;
    cursor: pointer;
    box-shadow: 0 4px 12px rgb(0 0 0 / 40%);
    font-size: 14px;
    font-weight: 500;
}

.toast-success {
    background: #166534;
    color: #dcfce7;
    border: 1px solid #22c55e;
}

.toast-error {
    background: #991b1b;
    color: #fecaca;
    border: 1px solid #ef4444;
}

.toast-info {
    background: #1e3a5f;
    color: #dbeafe;
    border: 1px solid #3b82f6;
}

.toast-icon {
    font-size: 16px;
    flex-shrink: 0;
}

.toast-message {
    flex: 1;
}

.toast-enter-active {
    animation: slide-in 0.3s ease-out;
}

.toast-leave-active {
    animation: slide-out 0.3s ease-in;
}

@keyframes slide-in {
    from {
        opacity: 0;
        transform: translateX(100%);
    }

    to {
        opacity: 1;
        transform: translateX(0);
    }
}

@keyframes slide-out {
    from {
        opacity: 1;
        transform: translateX(0);
    }

    to {
        opacity: 0;
        transform: translateX(100%);
    }
}
</style>