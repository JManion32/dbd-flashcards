<script setup lang="ts">
import StartStudyModal from '@/components/study/StartStudyModal.vue';
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
    font-family: var(--site-font);

    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 2rem;

    background:
        radial-gradient(
            circle at 100% 50%,
            color-mix(in srgb, var(--standard-gold) 18%, transparent) 0%,
            transparent 60%
        ),
        color-mix(in srgb, var(--standard-gold) 7%, transparent);
    border: 1px solid color-mix(in srgb, var(--standard-gold) 12%, transparent);
    box-shadow:
        inset 0 1px 0 color-mix(in srgb, var(--standard-gold) 8%, transparent),
        0 0 2rem color-mix(in srgb, var(--standard-gold) 5%, transparent);
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
