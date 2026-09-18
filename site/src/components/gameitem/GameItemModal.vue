<script setup lang="ts">
import '@/styles/modal.css';
import { ref } from 'vue';

import Modal from '@/components/Modal.vue';
import GameItemDisplay from '@/components/gameitem/GameItemDisplay.vue';

import type { GameItem } from '@/types/GameItem.ts';

import { getGameItemImage } from '@/utils/GameItemImages';

const props = defineProps<{
    gameItem: GameItem;
}>();

const visible = ref(false);
</script>
<template>
    <div
        class="display-card"
        @click="visible = true"
    >
        <img
            class="display-card-img"
            :src="getGameItemImage(props.gameItem.id)"
        />
        <span class="display-card-title">{{ props.gameItem.name }}</span>
    </div>
    <Modal
        :visible="visible"
        transition="scale"
        @close="visible = false"
    >
        <!-- A little prop drilling never hurt anyone right? -->
        <GameItemDisplay :game-item="props.gameItem" />
    </Modal>
</template>
<style scoped>
.display-card {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    align-items: center;
    width: 12rem;
    height: 10rem;
    background: var(--secondary-bg);
    border-radius: 1rem;
    transition: var(--site-transition);
    overflow: hidden;
    opacity: 60%;
    padding: 1rem;
}
.display-card:hover {
    cursor: pointer;
    scale: 1.05;
    opacity: 100%;
}
.display-card-img {
    width: 5rem;
    height: 5rem;
    object-fit: contain;
}
.display-card-title {
    color: var(--standard-white);
    font-weight: 800;
    text-align: center;
}
.card-modal-content {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow-y: scroll;
    padding: 0.5rem 2rem 0.5rem 1rem;
}
.card-modal-content h2 {
    color: var(--standard-white);
    font-weight: 900;
    font-size: 2.5rem;
    margin: 0;
    margin-bottom: 0.75rem;
    text-shadow: var(--large-text-glow);
}
.card-modal-content h3 {
    color: var(--standard-white);
    font-weight: 900;
    font-size: 1.5rem;
    margin: 0;
    margin-top: 2rem;
    text-shadow: var(--small-text-glow);
}
.metadata-container {
    display: flex;
    flex-direction: row;
    gap: 1rem;
}
.rarity-container {
    display: flex;
    flex-direction: row;
    gap: 1rem;
}
.metadata-text {
    font-style: italic;
    color: var(--standard-dim);
    font-weight: 700;
}
.card-rarity {
    font-style: italic;
    font-weight: 700;
}
</style>
