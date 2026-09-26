<script setup lang="ts">
import ResultSplit from '@/components/study/ResultSplit.vue';
import Flashcard from '@/components/study/Flashcard.vue';
import Choice from '@/components/study/Choice.vue';
import ProgressBar from '@/components/study/ProgressBar.vue';
import type { StudyConfig } from '@/types/StudyConfig';
const props = defineProps<{
    config: StudyConfig;
}>();
console.log(props.config);
</script>
<template>
    <div class="study-page-container">
        <ProgressBar />
        <ResultSplit />
        <Flashcard />
        <Choice />
    </div>
</template>
<style scoped>
.study-page-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1.5rem;
    width: 100%;
    height: 85vh;
    margin-top: 1rem;
}
</style>
