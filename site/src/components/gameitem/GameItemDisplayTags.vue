<script setup lang="ts">
defineProps<{
    tags: string[];
}>();
</script>

<template>
    <div class="game-item-tags">
        <span
            v-for="tag in tags"
            :key="tag"
            class="game-item-tag"
        >
            {{ tag }}
        </span>
    </div>
</template>
