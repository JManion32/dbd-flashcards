<script setup lang="ts"></script>
<template>
    <div class="test-knowledge-container">
        <h2 class="ready-header">Ready to test your knowledge?</h2>
        <button style="margin-left: auto">Study</button>
    </div>
</template>
<style scoped>
.test-knowledge-container {
    margin: 4rem 0;
    border-radius: 1.5rem;
    height: 5rem;
    width: 40%;
    background: var(--secondary-bg);
    font-family: var(--site-font);

    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 1rem 2rem;
}
.ready-header {
    font-size: 1.75rem;
    font-weight: 900;
    color: var(--standard-white);
    margin: 0;
}
</style>
