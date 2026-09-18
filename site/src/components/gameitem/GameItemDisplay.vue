<script setup lang="ts">
import '../../styles/modal.css';
//import randomIcon from '../../assets/random.webp';
import { getRarityColor } from '../../utils/GameItemFormatter.ts';
import type { GameItem } from '../../types/GameItem.ts';

const props = defineProps<{
    gameItem: GameItem;
}>();
</script>
<template>
    <div class="card-modal-content">
        <h2 class="card-name">
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
        <h3>Description</h3>
        <GameItemDisplayDesc :desc="props.gameItem.description" />
        <h3>Tags</h3>
        <GameItemDisplayTags :tags="props.gameItem.tags" />
    </div>
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
