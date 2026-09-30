<script setup lang="ts">
import '@/styles/modal.css';

import GameItemDisplayDesc from '@/components/gameitem/GameItemDisplayDesc.vue';
import { getGameItemImage } from '@/utils/resolveGameItemImg';

import type { GameItem } from '@/types/GameItem.ts';
import type { StudyConfig } from '@/types/StudyConfig.ts';

const props = defineProps<{
    gameItem: GameItem;
    config: StudyConfig;
    side: 'front' | 'back';
}>();
</script>
<template>
    <!-- Icon Only -->
    <div
        v-if="props.config.preset === 'Icons' && props.side === 'front'"
        class="flashcard-content-container"
    >
        <img :src="getGameItemImage(props.gameItem.id)" />
    </div>

    <!-- Name and Icon -->
    <div
        v-if="
            (props.config.preset === 'Names / Icons' && props.side === 'front') ||
            (props.config.preset === 'Descriptions' && props.side === 'back')
        "
        class="flashcard-content-container"
    >
        <img :src="getGameItemImage(props.gameItem.id)" />
        <h2>
            {{ props.gameItem.name }}
        </h2>
    </div>

    <!-- Description Only -->
    <div
        v-if="
            (props.config.preset === 'Names / Icons' && props.side === 'back') ||
            (props.config.preset === 'Descriptions' && props.side === 'front')
        "
        class="flashcard-content-container"
    >
        <GameItemDisplayDesc :desc="gameItem.description" />
    </div>

    <!-- Name and Description -->
    <div
        v-if="props.config.preset === 'Icons' && props.side === 'back'"
        class="flashcard-content-container"
    >
        <h2>
            {{ props.gameItem.name }}
        </h2>
        <GameItemDisplayDesc :desc="gameItem.description" />
    </div>
</template>
<style scoped>
.flashcard-content-container {
    display: flex;
    width: 100%;
    height: 100%;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
}
.flashcard-content-container img {
    height: 12rem;
    width: 12rem;
}
.flashcard-content-container h2 {
    color: var(--standard-white);
    font-size: var(--fc-top-name-size);
    font-weight: 900;
}
</style>
