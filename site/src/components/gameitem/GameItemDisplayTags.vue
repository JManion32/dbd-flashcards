<script setup lang="ts">
defineProps<{
    tags: string[];
}>();
</script>

<template>
    <div class="game-item-tags">
        <button
            v-for="tag in tags"
            :key="tag"
            class="game-item-tag"
        >
            {{ tag }}
        </button>
    </div>
</template>
<style scoped>
.game-item-tags {
    margin-top: 1rem;
    display: flex;
    flex-direction: row;
    gap: 1rem;
}
.game-item-tag {
    background: var(--secondary-bg);
    border-radius: 1rem;
    border: none;
    color: var(--standard-white);
    font-weight: 700;
    font-size: 1rem;
    padding: 0.5rem 1rem;
}
</style>
