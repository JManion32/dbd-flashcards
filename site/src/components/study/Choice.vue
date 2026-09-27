<script setup lang="ts">
import { onMounted } from 'vue';

const emit = defineEmits<{
    correct: [];
    incorrect: [];
}>();

function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'ArrowLeft') {
        emit('incorrect');
    }
    if (event.key === 'ArrowRight') {
        emit('correct');
    }
}

onMounted(() => {
    window.addEventListener('keydown', handleKeydown);
});
</script>
<template>
    <div class="choice-container">
        <button
            class="incorrect-btn"
            aria-label="Incorrect"
            @click="emit('incorrect')"
        >
            <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
            >
                <path d="M6 6L18 18M18 6L6 18" />
            </svg>
        </button>

        <button
            class="correct-btn"
            aria-label="Correct"
            @click="emit('correct')"
        >
            <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
            >
                <path d="M5 12L10 17L19 7" />
            </svg>
        </button>
    </div>
</template>
<style scoped>
.choice-container {
    display: flex;
    flex-direction: row;
    justify-content: center;
    gap: 3rem;
    width: var(--flashcard-width);
}
.correct-btn,
.incorrect-btn {
    font-size: 1.75rem;
    border-radius: 1rem;
    padding: 0.5rem 1.75rem;
    transition: var(--site-transition);
    border: none;
    display: flex;
    align-items: center;
    background: var(--dark-222);
}
.correct-btn svg,
.incorrect-btn svg {
    width: 1.75rem;
    height: 1.75rem;
    fill: none;
    stroke: currentColor;
    stroke-width: 2.5;
    stroke-linecap: round;
    stroke-linejoin: round;
}
.correct-btn:hover,
.incorrect-btn:hover {
    cursor: pointer;
    background: var(--dark-333);
    scale: 1.02;
}
.correct-btn {
    color: var(--standard-gold);
}
.incorrect-btn {
    color: var(--standard-dim);
}
</style>
