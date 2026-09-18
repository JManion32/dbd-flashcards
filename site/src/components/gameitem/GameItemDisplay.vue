<script setup lang="ts">
import '@/styles/modal.css';

import survivorIcon from '@/assets/survivor-icon.webp';
import killerIcon from '@/assets/killer-icon.webp';

import GameItemDisplayDesc from '@/components/gameitem/GameItemDisplayDesc.vue';
import GameItemDisplayTags from '@/components/gameitem/GameItemDisplayTags.vue';

import { getRarityColor } from '@/utils/GameItemFormatter.ts';
import { getGameItemImage } from '@/utils/GameItemImages';

import type { GameItem } from '@/types/GameItem.ts';

const props = defineProps<{
    gameItem: GameItem;
}>();
</script>
<template>
    <div class="card-modal-content">
        <div class="game-item-header-container">
            <div class="game-item-title-meta">
                <h2 class="game-item-header">
                    {{ props.gameItem.name }}
                </h2>
                <div class="metadata-container">
                    <span
                        v-if="props.gameItem.owner"
                        class="metadata-text"
                    >
                        {{ props.gameItem.owner }}
                    </span>
                    <span class="metadata-text"> • </span>
                    <span class="metadata-text">
                        {{ props.gameItem.type }}
                    </span>
                    <div
                        v-if="props.gameItem.rarity"
                        class="rarity-container"
                    >
                        <span class="metadata-text"> • </span>
                        <span
                            class="card-rarity"
                            :style="{ color: getRarityColor(props.gameItem.rarity) }"
                        >
                            {{ props.gameItem.rarity }}
                        </span>
                    </div>
                </div>
            </div>
            <img
                class="game-item-icon"
                :src="getGameItemImage(props.gameItem.id)"
            />
        </div>
        <h3>Description</h3>
        <GameItemDisplayDesc :desc="props.gameItem.description" />
        <h3 v-if="props.gameItem.tags.length > 0">Tags</h3>
        <GameItemDisplayTags :tags="props.gameItem.tags" />
        <p
            v-if="props.gameItem.quote"
            class="game-item-display-quote"
        >
            {{ props.gameItem.quote }}
        </p>
        <img
            class="gid-side-icon"
            :src="props.gameItem.side === 'Killer' ? killerIcon : survivorIcon"
        />
    </div>
</template>
<style scoped>
.card-modal-content {
    position: relative;
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow-y: scroll;
    padding: 0.5rem 2rem 0.5rem 1rem;
}
.game-item-header-container {
    display: flex;
    flex-direction: row;
    width: 100%;
}
.game-item-title-meta {
    display: flex;
    flex-direction: column;
}
.game-item-header {
    color: var(--standard-white);
    font-weight: 900;
    font-size: var(--game-item-h2-size);
    margin: 0 1rem 0.75rem 0;
    text-shadow: var(--large-text-glow);
}
.game-item-icon {
    margin-left: auto;
    height: 5rem;
    width: 5rem;
    border: none;
}
.card-modal-content h3 {
    color: var(--standard-white);
    font-weight: 900;
    font-size: var(--game-item-h3-size);
    margin: 0;
    margin-top: 2rem;
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
.game-item-display-quote {
    margin-top: 3rem;
    color: var(--standard-dim);
    font-weight: 700%;
    font-style: italic;
}
.gid-side-icon {
    height: 20rem;
    width: 20rem;
    position: absolute;
    bottom: 0;
    right: 0;
    opacity: 1%;
}
</style>
