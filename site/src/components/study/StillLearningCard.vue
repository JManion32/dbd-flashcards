<script setup lang="ts">
import { getGameItemImage } from '@/utils/resolveGameItemImg';

const props = defineProps<{
    id: string;
    name: string;
}>();
</script>

<template>
    <div class="still-learning-card">
        <img :src="getGameItemImage(props.id)" />
        <span>
            {{ props.name }}
        </span>
    </div>
</template>

<style scoped>
.still-learning-card {
    width: 100%;
    border-radius: 1rem;
    background: var(--dark-222);
    height: 3.5rem;
    padding: 0.5rem;
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 2rem;
}
.still-learning-card img {
    height: 3.5rem;
    width: 3.5rem;
    border: none;
}
.still-learning-card span {
    font-size: 1.25rem;
    font-weight: 800;
    color: var(--standard-white);
}
</style>
