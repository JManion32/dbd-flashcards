<script setup lang="ts">
import GameItemDisplayDesc from '@/components/gameitem/GameItemDisplayDesc.vue';
import { computed } from 'vue';
import getRarityColor from '@/utils/getRarityColor';
import { getGameItemImage } from '@/utils/resolveGameItemImg';
import { getTintStyle } from '@/utils/tintStyle';
import type { GameItem } from '@/types/gameItem';

const props = defineProps<{
    gameItem: GameItem;
}>();

const accent = computed(() =>
    props.gameItem.rarity ? getRarityColor(props.gameItem.rarity) : 'var(--very-rare-rarity)'
);
</script>

<template>
    <article
        class="owner-main-item"
        :style="{ ...getTintStyle(accent), '--accent': accent }"
    >
        <img
            class="owner-main-item-icon"
            :src="getGameItemImage(props.gameItem.id)"
            :alt="props.gameItem.name"
            loading="lazy"
            decoding="async"
        />
        <div class="owner-main-item-body">
            <div class="owner-main-item-header">
                <h4 class="owner-main-item-name">
                    {{ props.gameItem.name }}
                </h4>
                <span class="owner-main-item-meta">
                    <template v-if="props.gameItem.rarity">
                        <span class="owner-main-item-rarity">{{ props.gameItem.rarity }}</span>
                    </template>
                </span>
            </div>
            <GameItemDisplayDesc :desc="props.gameItem.description" />
            <p
                v-if="props.gameItem.quote"
                class="owner-main-item-quote"
            >
                {{ props.gameItem.quote }}
            </p>
        </div>
    </article>
</template>

<style scoped>
.owner-main-item {
    --gd-desc-size: 1rem;

    display: flex;
    flex-direction: row;
    align-items: flex-start;
    gap: 1.5rem;
    padding: 1.25rem 1.5rem;
    /* Background and border come from getTintStyle, the same rarity tint as the item popup */
    border-radius: 1rem;
}
.owner-main-item-icon {
    flex-shrink: 0;
    height: 5rem;
    width: 5rem;
}
.owner-main-item-body {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    min-width: 0;
}
.owner-main-item-header {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: baseline;
    column-gap: 1rem;
    row-gap: 0.25rem;
}
.owner-main-item-name {
    margin: 0;
    color: var(--standard-white);
    font-weight: 900;
    font-size: var(--game-item-h3-size);
    text-shadow: var(--large-text-glow);
}
.owner-main-item-meta {
    display: flex;
    gap: 0.5rem;
    color: var(--dim-text);
    font-style: italic;
    font-weight: 700;
    font-size: 0.95rem;
}
.owner-main-item-rarity {
    color: var(--accent);
}
.owner-main-item-quote {
    margin: 0;
    color: var(--dim-text);
    font-style: italic;
}
</style>
