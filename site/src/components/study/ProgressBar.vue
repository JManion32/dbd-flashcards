<script setup lang="ts">
const props = withDefaults(
    defineProps<{
        correct?: number;
        incorrect?: number;
        total?: number;
    }>(),
    {
        correct: 5,
        incorrect: 0,
        total: 50,
    }
);
const completed = props.correct + props.incorrect;
const progress = (completed / props.total) * 100;
</script>
<template>
    <div class="progress-bar">
        <div
            class="progress-bar-fill"
            :style="{ width: `${progress}%` }"
        />
    </div>
</template>
<style scoped>
.progress-bar {
    margin-bottom: var(--progress-bottom);
    width: 50%;
    height: 0.3rem;
    background: var(--dark-222);
    border-radius: 1rem;
    overflow: visible;
}

.progress-bar-fill {
    height: 100%;
    background: var(--standard-gold);
    box-shadow:
        0 0 10px color-mix(in srgb, var(--standard-gold) 46%, transparent),
        0 0 20px color-mix(in srgb, var(--standard-gold) 31%, transparent);
    border-radius: inherit;
    transition: width 0.3s ease;
}
</style>
