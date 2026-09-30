<script setup lang="ts">
import { ref, computed } from 'vue';

import ResultSplit from '@/components/study/ResultSplit.vue';
import Flashcard from '@/components/study/Flashcard.vue';
import Choice from '@/components/study/Choice.vue';
import ProgressBar from '@/components/study/ProgressBar.vue';
import EndStudyModal from '@/components/study/EndStudyModal.vue';

import type { GameItem } from '@/types/GameItem';
import type { StudyConfig } from '@/types/StudyConfig';
import { StudyConfigDefault } from '@/types/StudyConfig';
import { useData } from '@/stores/useData';
import { useStudy } from '@/stores/useStudy';
import { shuffle } from '@/utils/shuffleFlashcards';

const { combinedGameItems } = useData();
const props = withDefaults(
    defineProps<{
        config?: StudyConfig;
    }>(),
    {
        config: () => ({ ...StudyConfigDefault }),
    }
);

const { studyConfig } = useStudy();

studyConfig.value = props.config;

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

const total = computed(() => {
    return studyGameItems.value.length;
});

const isFinished = computed(() => {
    return completed.value === total.value;
});

const stillLearning = ref<GameItem[]>([]);

function handleCorrect() {
    if (isFinished.value) {
        return;
    }

    correct.value++;
}

function handleIncorrect() {
    if (isFinished.value) {
        return;
    }

    stillLearning.value.push(studyGameItems.value[completed.value]);
    incorrect.value++;
}

function handleRetry() {
    const retryGameItems = shuffle([...stillLearning.value]);
    studyGameItems.value = retryGameItems;
    correct.value = 0;
    incorrect.value = 0;
    stillLearning.value = [];
}

function handleRestart() {
    const shuffled = shuffle([...filteredGameItems.value]);

    studyGameItems.value = props.config.length === 'All' ? shuffled : shuffled.slice(0, props.config.length);
    correct.value = 0;
    incorrect.value = 0;
    stillLearning.value = [];
}
</script>
<template>
    <div class="study-page-container">
        <EndStudyModal
            :visible="isFinished"
            :correct="correct"
            :incorrect="incorrect"
            :total="total"
            :still-learning="stillLearning"
            @retry="handleRetry"
            @restart="handleRestart"
        />
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
        <Flashcard
            :game-items="studyGameItems"
            :config="props.config"
            :correct="correct"
            :incorrect="incorrect"
            :completed="completed"
        />
        <Choice
            @correct="handleCorrect()"
            @incorrect="handleIncorrect()"
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
    height: 100%;
}
</style>
