<script setup lang="ts">
import ResultSplit from '@/components/study/ResultSplit.vue';
import Flashcard from '@/components/study/Flashcard.vue';
import Choice from '@/components/study/Choice.vue';
import type { StudyConfig } from '@/types/StudyConfig';
const props = defineProps<{
    config: StudyConfig;
}>();
console.log(props.config);
</script>
<template>
    <div class="study-page-container">
        <ResultSplit />
        <Flashcard />
        <Choice />
        <p class="remaining-cards">24 remaining</p>
    </div>
</template>
<style scoped>
.study-page-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 1rem;
}
.remaining-cards {
    size: 1rem;
    color: var(--standard-dim);
    font-style: italic;
    font-weight: 700;
}
</style>
