<script setup lang="ts">
import '@/styles/footer.css';
import '@/styles/modal.css';
import { computed } from 'vue';
import type { GameItem } from '@/types/GameItem.ts';
import Modal from '@/components/Modal.vue';
import StillLearningCard from '@/components/study/StillLearningCard.vue';

const props = defineProps<{
    visible: boolean;
    correct: number;
    incorrect: number;
    total: number;
    stillLearning: GameItem[];
}>();

const emit = defineEmits<{
    retry: [];
    restart: [];
}>();

const visible = props.visible;

const percentage = computed(() => {
    if (props.total === 0) {
        return 0;
    }

    return Math.round((props.correct / props.total) * 100);
});

const resultMsg = computed(() => {
    if (percentage.value <= 50) {
        return 'The Entity hungers...';
    }
    if (percentage.value <= 75) {
        return 'The Fog clears...';
    }
    if (percentage.value < 100) {
        return 'The Entity is pleased...';
    }
    return 'The Fog holds no secrets...';
});
</script>
<template>
    <Modal
        :visible="props.visible"
        transition="scale"
        required
        @close="visible = false"
    >
        <div class="modal-content">
            <h2 style="font-size: 2.6rem">
                {{ resultMsg }}
            </h2>
            <p>
                You knew <span class="highlight-metric-gold">{{ props.correct }}</span> of the
                <span class="highlight-metric">{{ props.total }}</span> flashcards. That's
                <span class="highlight-metric-gold">{{ percentage }}%</span>!
            </p>
            <hr />

            <h3>Still Learning ({{ props.incorrect }}):</h3>
            <div class="still-learning-container">
                <StillLearningCard
                    v-for="gameItem in stillLearning"
                    :id="gameItem.id"
                    :key="gameItem.id"
                    :name="gameItem.name"
                />
                <span
                    v-if="props.stillLearning.length === 0"
                    class="nothing-left"
                    >Nothing left to study. Nice work!</span
                >
            </div>
            <hr />
            <div class="end-study-btn-container">
                <button
                    v-if="props.stillLearning.length > 0"
                    @click="emit('retry')"
                >
                    Retry <i>(Still Learning)</i>
                </button>
                <button @click="emit('restart')">Restart <i>(Same Configuration)</i></button>
                <RouterLink
                    to="/"
                    class="end-study-btn"
                >
                    Home
                </RouterLink>
            </div>
        </div>
    </Modal>
</template>
<style scoped>
.highlight-metric-gold {
    color: var(--standard-gold);
    font-weight: 800;
}
.highlight-metric {
    font-weight: 800;
}
.end-study-btn {
    width: 50%;
}
.end-study-btn-container {
    margin-top: 2rem;
    display: flex;
    flex-direction: column;
    width: 100%;
    align-items: center;
    justify-content: center;
    gap: 1rem;
}
.end-study-btn-container i {
    margin-left: 0.5rem;
}
.end-study-btn-container button,
.end-study-btn {
    width: var(--end-btn-width);
    padding: 0.5rem;
    border-radius: 0.5rem;
    border: none;
    color: var(--standard-white);
    font-weight: 700;
    font-size: 1rem;
    background: var(--dark-222);
    transition: var(--site-transition);
    display: flex;
    align-items: center;
    justify-content: center;
    text-decoration: none;
}
.end-study-btn-container button:hover,
.end-study-btn:hover {
    cursor: pointer;
    background: var(--dark-333);
}
.still-learning-container {
    margin-top: 1rem;
    min-height: 16rem;
    overflow-y: scroll;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding-right: 0.5rem;
}
.still-learning-container > * {
    flex-shrink: 0;
}
.nothing-left {
    font-style: italic;
    color: var(--standard-dim);
    font-weight: 700;
    margin: 3rem auto;
}
</style>
