<script setup lang="ts">
import { ref, computed } from 'vue';

import ResultSplit from '@/components/study/ResultSplit.vue';
import Flashcard from '@/components/study/Flashcard.vue';
import Choice from '@/components/study/Choice.vue';
import ProgressBar from '@/components/study/ProgressBar.vue';

import type { StudyConfig } from '@/types/StudyConfig';
import { StudyConfigDefault } from '@/types/StudyConfig';
import { useData } from '@/data/useData.ts';
import { shuffle } from '@/utils/FlashcardShuffler.ts';

const { combinedGameItems } = useData();
const props = withDefaults(
    defineProps<{
        config?: StudyConfig;
    }>(),
    {
        config: () => ({ ...StudyConfigDefault }),
    }
);

const filteredGameItems = computed(() => {
    return combinedGameItems.value.filter((gameItem) => {
        if (gameItem.side !== props.config.side && props.config.side !== 'All') {
            return false;
        }

        if (gameItem.type !== props.config.type) {
            return false;
        }

        return true;
    });
});

const shuffledGameItems = shuffle([...filteredGameItems.value]);

const studyGameItems = ref(
    props.config.length === 'All' ? shuffledGameItems : shuffledGameItems.slice(0, props.config.length)
);

const correct = ref(0);
const incorrect = ref(0);
const completed = computed(() => {
    return correct.value + incorrect.value;
});
const total = studyGameItems.value.length;
</script>
<template>
    <div class="study-page-container">
        <ProgressBar
            :completed="completed"
            :total="total"
        />
        <ResultSplit
            :correct="correct"
            :incorrect="incorrect"
            :completed="completed"
            :total="total"
        />
        <Flashcard :game-items="studyGameItems" />
        <Choice
            @correct="correct++"
            @incorrect="incorrect++"
        />
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
