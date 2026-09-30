<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';

import type { GameItem } from '@/types/GameItem';
import type { StudyConfig } from '@/types/StudyConfig';
import FlashcardContent from '@/components/study/FlashcardContent.vue';
const props = defineProps<{
    gameItems: GameItem[];
    config: StudyConfig;
    correct: number;
    incorrect: number;
    completed: number;
}>();

const flipped = ref(false);

const answerAnimation = ref<'correct' | 'incorrect' | null>(null);

// The card the user is looking at. Tracked locally because `completed` has already
// advanced to the next card by the time the answer watchers run.
const shownIndex = ref(props.completed);

// The card flying off screen, snapshotted so it keeps its own face and flip state.
const exitingIndex = ref<number | null>(null);
const exitingFlipped = ref(false);

// Bumped on every answer so a rapid second answer restarts the exit animation.
const animationRun = ref(0);

const currentItem = computed(() => props.gameItems[shownIndex.value] ?? null);
const exitingItem = computed(() =>
    exitingIndex.value === null ? null : (props.gameItems[exitingIndex.value] ?? null)
);

function startExit(answer: 'correct' | 'incorrect') {
    exitingIndex.value = shownIndex.value;
    exitingFlipped.value = flipped.value;
    answerAnimation.value = answer;
    animationRun.value += 1;

    shownIndex.value = props.completed;
    flipped.value = false;
}

function endExit(event: AnimationEvent) {
    // The badge animates too, and animationend bubbles.
    if (event.target !== event.currentTarget) {
        return;
    }

    exitingIndex.value = null;
    answerAnimation.value = null;
}

watch(
    () => props.correct,
    (newValue, oldValue) => {
        if (newValue > oldValue) {
            startExit('correct');
        }
    }
);

watch(
    () => props.incorrect,
    (newValue, oldValue) => {
        if (newValue > oldValue) {
            startExit('incorrect');
        }
    }
);

watch(
    () => props.completed,
    (newValue, oldValue) => {
        if (newValue === 0 && oldValue !== 0) {
            shownIndex.value = 0;
            flipped.value = false;
            answerAnimation.value = null;
        }
    }
);

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

onUnmounted(() => {
    window.removeEventListener('keydown', handleKeydown);
});
</script>
<template>
    <div class="flashcard-page-container">
        <div class="flashcard-stack">
            <!-- LIVE CARD: already sitting in place, so an exiting card just uncovers it -->
            <div
                v-if="currentItem"
                :key="`card-${shownIndex}`"
                class="flashcard-layer flashcard-layer-live"
                @click="flipCard()"
            >
                <div
                    class="flashcard-inner"
                    :class="{ flipped }"
                >
                    <!-- FRONT -->
                    <div class="flashcard-side flashcard-front">
                        <FlashcardContent
                            :game-item="currentItem"
                            :config="props.config"
                            side="front"
                        />
                    </div>

                    <!-- BACK -->
                    <div class="flashcard-side flashcard-back">
                        <FlashcardContent
                            :game-item="currentItem"
                            :config="props.config"
                            side="back"
                        />
                    </div>
                </div>
            </div>

            <!-- ANSWERED CARD: only mounted while it animates away, so a plain flip
                 never has a second card showing underneath it -->
            <div
                v-if="exitingItem && answerAnimation"
                :key="`exit-${animationRun}`"
                class="flashcard-layer flashcard-layer-exit"
                :class="`flashcard-layer-${answerAnimation}`"
                @animationend="endExit"
            >
                <div
                    class="flashcard-inner"
                    :class="{ flipped: exitingFlipped }"
                >
                    <!-- FRONT -->
                    <div class="flashcard-side flashcard-front">
                        <FlashcardContent
                            :game-item="exitingItem"
                            :config="props.config"
                            side="front"
                        />
                    </div>

                    <!-- BACK -->
                    <div class="flashcard-side flashcard-back">
                        <FlashcardContent
                            :game-item="exitingItem"
                            :config="props.config"
                            side="back"
                        />
                    </div>
                </div>

                <div class="answer-badge">
                    {{ answerAnimation === 'correct' ? 'Known' : 'Still Learning' }}
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

    /* Keeps the exiting card from ever growing the horizontal scroll area.
       `clip` (unlike `hidden`) leaves the vertical axis visible, so the card
       can still lift above the progress bar. */
    overflow-x: clip;
}

.flashcard-stack {
    position: relative;
    height: var(--flashcard-height);
    width: var(--flashcard-width);

    --flashcard-exit-time: 0.43s;
    --answer-color: var(--standard-gold);
}

.flashcard-layer {
    position: absolute;
    inset: 0;
    perspective: 1000px;
}

.flashcard-layer-live {
    z-index: 1;
}

.flashcard-layer-live:hover {
    cursor: pointer;
}

.flashcard-layer-exit {
    z-index: 2;
    /* Clicks fall through to the new card underneath */
    pointer-events: none;
    animation: flashcard-exit-correct var(--flashcard-exit-time) cubic-bezier(0.3, 0, 0.5, 1) forwards;
}

.flashcard-layer-incorrect {
    animation-name: flashcard-exit-incorrect;
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

/* --- Answer feedback --- */

.flashcard-layer-incorrect {
    --answer-color: var(--standard-dim);
}

.flashcard-layer-exit .flashcard-side {
    box-shadow:
        0 0 0 0.2rem var(--answer-color),
        0 0 30px color-mix(in srgb, var(--answer-color) 30%, transparent);
}

.flashcard-layer-exit .flashcard-side > * {
    animation: flashcard-content-recede 0.18s ease-out both;
}

.answer-badge {
    position: absolute;
    top: 50%;
    left: 50%;
    z-index: 1;
    transform: translate(-50%, -50%);

    padding: 0.75rem 2.25rem;
    border: 0.2rem solid var(--answer-color);
    border-radius: 1rem;
    background: var(--site-bg);

    color: var(--answer-color);
    font-size: 2rem;
    font-weight: 900;
    white-space: nowrap;
    text-shadow: 0 0 12px color-mix(in srgb, var(--answer-color) 45%, transparent);
    box-shadow: 0 0 20px color-mix(in srgb, var(--answer-color) 25%, transparent);

    animation: answer-badge-in 0.18s ease-out both;
}

/* Lift and tilt toward the correct button (right), then travel that way,
   staying opaque long enough to read the badge before it fades.
   The 47% keyframe is the rise/fly-off split: rise takes 47% of
   --flashcard-exit-time, the fly-off the remaining 53%. */
@keyframes flashcard-exit-correct {
    0% {
        transform: translate(0, 0) rotate(0deg) scale(1);
        opacity: 1;
    }
    47% {
        transform: translate(0, -4%) rotate(3deg) scale(1.02);
        opacity: 1;
    }
    70% {
        opacity: 1;
    }
    100% {
        transform: translate(17%, -22%) rotate(11deg) scale(0.9);
        opacity: 0;
    }
}

/* Mirrored, toward the incorrect button (left) */
@keyframes flashcard-exit-incorrect {
    0% {
        transform: translate(0, 0) rotate(0deg) scale(1);
        opacity: 1;
    }
    47% {
        transform: translate(0, -4%) rotate(-3deg) scale(1.02);
        opacity: 1;
    }
    70% {
        opacity: 1;
    }
    100% {
        transform: translate(-17%, -22%) rotate(-11deg) scale(0.9);
        opacity: 0;
    }
}

@keyframes flashcard-content-recede {
    from {
        opacity: 1;
    }
    to {
        opacity: 0.05;
    }
}

@keyframes answer-badge-in {
    from {
        opacity: 0;
        transform: translate(-50%, -50%) scale(0.85);
    }
    to {
        opacity: 1;
        transform: translate(-50%, -50%) scale(1);
    }
}

@media (prefers-reduced-motion: reduce) {
    .flashcard-inner {
        transition: none;
    }

    /* Collapsed rather than removed so `animationend` still advances the card */
    .flashcard-stack {
        --flashcard-exit-time: 0.001s;
    }

    .answer-badge {
        animation: none;
    }
}
</style>
