<script setup lang="ts">
import StartStudyModal from './modal/StartStudyModal.vue';
</script>
<template>
    <div class="test-knowledge-container">
        <h2 class="ready-header">Ready to test your knowledge?</h2>
        <StartStudyModal />
    </div>
</template>
<style scoped>
.test-knowledge-container {
    margin: 4rem 0;
    border-radius: 1.5rem;
    height: 5rem;
    width: var(--test-knowledge-width);
    background: var(--secondary-bg);
    font-family: var(--site-font);

    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 1rem 2rem;
}
.ready-header {
    font-size: var(--test-knowledge-title);
    font-weight: 900;
    color: var(--standard-white);
    margin: 0;
    text-shadow: var(--large-text-glow);
    margin-right: 2rem;
}
</style>
