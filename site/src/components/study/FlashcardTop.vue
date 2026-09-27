<script setup lang="ts">
import '@/styles/modal.css';

import GameItemDisplayDesc from '@/components/gameitem/GameItemDisplayDesc.vue';
import { getGameItemImage } from '@/utils/resolveGameItemImg';

import type { GameItem } from '@/types/GameItem.ts';
import type { StudyConfig } from '@/types/StudyConfig.ts';

const props = defineProps<{
    gameItem: GameItem;
    config: StudyConfig;
}>();
</script>
<template>
    <div class="flashcard-top-container">
        <img
            v-if="props.config.preset === 'Names / Icons' || props.config.preset === 'Icons'"
            class="flashcard-top-img"
            :src="getGameItemImage(props.gameItem.id)"
        />
        <h2
            v-if="props.config.preset === 'Names / Icons'"
            class="flashcard-top-name"
        >
            {{ props.gameItem.name }}
        </h2>
        <GameItemDisplayDesc
            v-if="props.config.preset === 'Descriptions'"
            :desc="gameItem.description"
        />
    </div>
</template>
<style scoped>
.flashcard-top-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
}
.flashcard-top-img {
    height: 12rem;
    width: 12rem;
}
.flashcard-top-name {
    color: var(--standard-white);
    font-size: var(--fc-top-name-size);
    font-weight: 900;
}
</style>
