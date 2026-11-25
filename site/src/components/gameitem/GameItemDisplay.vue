<script setup lang="ts">
import '@/styles/modal.css';

import survivorIcon from '@/assets/survivor-icon.webp';
import killerIcon from '@/assets/killer-icon.webp';

import GameItemDisplayDesc from '@/components/gameitem/GameItemDisplayDesc.vue';
import GameItemDisplayTags from '@/components/gameitem/GameItemDisplayTags.vue';
import StatusEffect from '@/components/status-effect/StatusEffect.vue';
import { ChevronDown } from 'lucide-vue-next';

import getRarityColor from '@/utils/getRarityColor';
import { getGameItemImage } from '@/utils/resolveGameItemImg';
import { mentionedStatusEffects } from '@/utils/mentionedStatusEffects';

import type { GameItem } from '@/types/gameItem';
import { computed, ref, watch } from 'vue';

const props = defineProps<{
    gameItem: GameItem;
}>();

const ownerLabel = computed(() => {
    const { side, owner } = props.gameItem;
    return side === 'Killer' && owner !== 'Universal' ? `The ${owner}` : owner;
});

// More Info: the status effects this item mentions, collapsed until asked for
const statusEffects = computed(() => mentionedStatusEffects(props.gameItem));
const moreInfoOpen = ref(false);
// The perks page reuses one display for every item it opens, so start each one collapsed
watch(
    () => props.gameItem.id,
    () => {
        moreInfoOpen.value = false;
    }
);
</script>
<template>
    <div class="game-item-display-container">
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
                        {{ ownerLabel }}
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
        <GameItemDisplayDesc
            :desc="props.gameItem.description"
            style="margin-top: 1.25rem"
        />
        <div
            v-if="props.gameItem.tags.length > 0"
            style="margin-top: 1.25rem"
        >
            <GameItemDisplayTags
                :tags="props.gameItem.tags"
                :color="getRarityColor(props.gameItem.rarity)"
            />
        </div>
        <div
            v-if="statusEffects.length > 0"
            class="more-info"
        >
            <button
                class="more-info-btn"
                :aria-expanded="moreInfoOpen"
                @click="moreInfoOpen = !moreInfoOpen"
            >
                <span>Status Effect Info</span>
                <ChevronDown
                    class="more-info-chevron"
                    :class="{ open: moreInfoOpen }"
                    :size="18"
                />
            </button>
            <div
                v-show="moreInfoOpen"
                class="more-info-list"
            >
                <StatusEffect
                    v-for="statusEffect in statusEffects"
                    :key="statusEffect.id"
                    :status-effect="statusEffect"
                    compact
                />
            </div>
        </div>
        <p
            v-if="props.gameItem.quote"
            class="game-item-display-quote"
        >
            {{ props.gameItem.quote }}
        </p>
        <div class="game-item-footer">
            <span v-if="props.gameItem.lastUpdated"> Last Updated: {{ props.gameItem.lastUpdated }} </span>
            <span>•</span>
            <span> v{{ props.gameItem.version }} </span>
        </div>
        <img
            class="gid-side-icon"
            :src="props.gameItem.side === 'Killer' ? killerIcon : survivorIcon"
        />
    </div>
</template>
<style scoped>
.game-item-display-container {
    position: relative;
    display: flex;
    flex-direction: column;
    flex: 1;
    min-height: 0;
    overflow-y: scroll;
    padding: 0.5rem 2rem 0.5rem 1rem;
}
.game-item-header-container {
    display: flex;
    flex-direction: row;
    width: 100%;
    gap: 2rem;
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
.game-item-display-container h3 {
    color: var(--standard-white);
    font-weight: 900;
    font-size: var(--game-item-h3-size);
    margin: 0;
    margin-top: 2rem;
}
.metadata-container {
    display: flex;
    flex-direction: row;
    gap: 0.75rem;
    flex-wrap: wrap;
}
.rarity-container {
    display: flex;
    flex-direction: row;
    gap: 1rem;
}
.metadata-text {
    font-style: italic;
    color: var(--dim-text);
    font-weight: 700;
    font-size: 1rem;
}
.card-rarity {
    font-style: italic;
    font-weight: 700;
    font-size: 1rem;
}
.more-info {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    margin-top: 1.5rem;
}
.more-info-btn {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    align-self: flex-start;
    padding: 0;
    border: none;
    background: none;

    color: var(--dim-text);
    font-size: 1rem;
    font-style: italic;
    font-weight: 700;
    transition: var(--site-transition);
    cursor: pointer;

    &:hover {
        color: var(--standard-white);
        text-shadow: var(--small-text-glow);
    }
}
.more-info-chevron {
    transition: var(--site-transition);
}
.more-info-chevron.open {
    rotate: 180deg;
}
.more-info-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}
.game-item-display-quote {
    margin-top: 3rem;
    color: var(--dim-text);
    font-style: italic;
}
.game-item-footer {
    display: flex;
    flex-direction: row;
    gap: 1rem;
    margin-top: auto;
    padding-top: 2.5rem;
    align-self: center;

    color: var(--dim-text);
    font-weight: 700;
    font-size: 0.85rem;
}
.gid-side-icon {
    height: 20rem;
    width: 20rem;
    position: absolute;
    bottom: 0;
    right: 0;
    opacity: 1.5%;
    pointer-events: none;
}
</style>
