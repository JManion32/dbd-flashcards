<script setup lang="ts"></script>
<template>
    <div class="flashcard-page-container">
        <div class="flashcard-container" />
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
