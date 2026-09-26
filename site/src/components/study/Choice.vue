<script setup lang="ts">
const emit = defineEmits<{
    correct: [];
    incorrect: [];
}>();
</script>
<template>
    <div class="choice-container">
        <button
            class="incorrect-btn"
            @click.self="emit('incorrect')"
        >
            &#10007;
        </button>
        <button
            class="correct-btn"
            @click.self="emit('correct')"
        >
            &#10004;
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
    padding: 0.25rem 1.75rem;
    transition: var(--site-transition);
    border: none;
}
.correct-btn:hover,
.incorrect-btn:hover {
    cursor: pointer;
    background: var(--dark-333);
}
.correct-btn {
    background: var(--dark-222);
    color: var(--correct-green);
}
.incorrect-btn {
    background: var(--dark-222);
    color: var(--incorrect-red);
}
</style>
