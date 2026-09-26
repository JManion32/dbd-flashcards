<script setup lang="ts">
import type { GameItem } from '@/types/GameItem';
const props = defineProps<{
    gameItems: GameItem[];
}>();
</script>
<template>
    <div class="flashcard-page-container">
        <div class="flashcard-container">
            {{ props.gameItems[0] }}
        </div>
    </div>
</template>
<style scoped>
.flashcard-page-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
}
.flashcard-container {
    border-radius: 2rem;
    height: var(--flashcard-height);
    width: var(--flashcard-width);
    background: var(--secondary-bg);
}
.flashcard-container:hover {
    cursor: pointer;
}
</style>
