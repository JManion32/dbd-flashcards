<script setup lang="ts">
const props = defineProps<{
    correct: number;
    incorrect: number;
    completed: number;
    total: number;
}>();
</script>
<template>
    <div class="result-split-container">
        <div class="result-container">
            <span class="incorrect-score-btn">
                {{ props.incorrect }}
            </span>
            <span class="incorrect-score-txt"> Learning </span>
        </div>
        <span class="remaining-cards"> {{ props.completed }} / {{ props.total }} </span>
        <div class="result-container">
            <span class="correct-score-txt"> Know </span>
            <span class="correct-score-btn">
                {{ props.correct }}
            </span>
        </div>
    </div>
</template>
<style scoped>
.result-split-container {
    width: var(--flashcard-width);

    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    align-items: center;
}

.result-split-container > div:first-child {
    justify-self: start;
}

.remaining-cards {
    justify-self: center;

    color: var(--standard-white);
    font-weight: 700;
    font-size: 1.25rem;
}

.result-split-container > div:last-child {
    justify-self: end;
}
.result-container {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 1rem;
}
.incorrect-score-btn,
.correct-score-btn {
    border-radius: 1rem;
    font-size: 1.1rem;
    font-weight: 700;
    padding: 0.25rem 0.5rem;
    width: 3rem;
    display: flex;
    justify-content: center;
    color: var(--standard-white);
}
.correct-score-btn {
    background: color-mix(in srgb, var(--correct-green) 10%, transparent);
    border: 1px solid var(--correct-green);
    color: var(--correct-green);
}
.incorrect-score-btn {
    background: color-mix(in srgb, var(--incorrect-red) 10%, transparent);
    border: 1px solid var(--incorrect-red);
    color: var(--incorrect-red);
}
.incorrect-score-txt,
.correct-score-txt {
    font-size: 1rem;
    font-weight: 700;
    font-style: italic;
}
.correct-score-txt {
    color: var(--correct-green);
}
.incorrect-score-txt {
    color: var(--incorrect-red);
}
</style>
