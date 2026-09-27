<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { GameItem } from '@/types/GameItem';
import GameItemDisplay from '@/components/gameitem/GameItemDisplay.vue';
import FlashcardTop from '@/components/study/FlashcardTop.vue';
import type { StudyConfig } from '@/types/StudyConfig';
const props = defineProps<{
    gameItems: GameItem[];
    config: StudyConfig;
    completed: number;
}>();

const flipped = ref(false);

function flipCard() {
    flipped.value = !flipped.value;
}

function handleKeydown(event: KeyboardEvent) {
    if (event.key === ' ') {
        flipCard();
    }
}

onMounted(() => {
    window.addEventListener('keydown', handleKeydown);
});
</script>
<template>
    <div class="flashcard-page-container">
        <div
            class="flashcard-container"
            @click="flipCard()"
        >
            <div
                class="flashcard-inner"
                :class="{ flipped }"
            >
                <!-- FRONT -->
                <div
                    v-if="props.completed < gameItems.length"
                    class="flashcard-side flashcard-front"
                >
                    <FlashcardTop
                        :game-item="gameItems[props.completed]"
                        :config="props.config"
                    />
                </div>

                <!-- BACK -->
                <div
                    v-if="props.completed < gameItems.length"
                    class="flashcard-side flashcard-back"
                >
                    <GameItemDisplay
                        :game-item="gameItems[props.completed]"
                        flashcard
                    />
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped>
.flashcard-page-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.flashcard-container {
    height: var(--flashcard-height);
    width: var(--flashcard-width);
    perspective: 1000px;
}

.flashcard-container:hover {
    cursor: pointer;
}

.flashcard-inner {
    position: relative;
    width: 100%;
    height: 100%;
    transition: transform 0.5s ease;
    transform-style: preserve-3d;
    padding: 2rem;
}

.flashcard-inner.flipped {
    transform: rotateX(180deg);
}

.flashcard-side {
    position: absolute;
    inset: 0;
    padding: var(--flashcard-side-padding);

    border-radius: 2rem;
    background: var(--secondary-bg);

    backface-visibility: hidden;
}

.flashcard-front {
    transform: rotateX(0deg);
    display: flex;
    align-items: center;
    justify-content: center;
}

.flashcard-back {
    transform: rotateX(180deg);
}
</style>
