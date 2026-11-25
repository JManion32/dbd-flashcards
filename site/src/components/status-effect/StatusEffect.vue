<script setup lang="ts">
import GameItemDisplayDesc from '@/components/gameitem/GameItemDisplayDesc.vue';

import { getGameItemImage } from '@/utils/resolveGameItemImg';
import type { StatusEffect } from '@/types/statusEffect';

const props = defineProps<{
    statusEffect: StatusEffect;
}>();

const sideLabel = props.statusEffect.side === 'All' ? 'Killers & Survivors' : `${props.statusEffect.side}s`;
</script>

<template>
    <article
        class="status-effect"
        :class="`status-effect-${props.statusEffect.type.toLowerCase()}`"
    >
        <img
            class="status-effect-icon"
            :src="getGameItemImage(props.statusEffect.id)"
            :alt="props.statusEffect.name"
        />
        <div class="status-effect-body">
            <div class="status-effect-header">
                <h2 class="status-effect-name">
                    {{ props.statusEffect.name }}
                </h2>
                <span class="status-effect-meta">
                    <span class="status-effect-type">{{ props.statusEffect.type }}</span>
                    <span> • </span>
                    <span>{{ sideLabel }}</span>
                </span>
            </div>
            <GameItemDisplayDesc :desc="props.statusEffect.description" />
        </div>
    </article>
</template>

<style scoped>
.status-effect {
    --accent: #d4af37;

    display: flex;
    flex-direction: row;
    align-items: flex-start;
    gap: 1.5rem;
    padding: 1.25rem 1.5rem;
    background-color: var(--dark-2);
    border: 1px solid var(--dark-5);
    border-left: 4px solid var(--accent);
    border-radius: 1rem;
}
.status-effect-debuff {
    --accent: #c82828;
}
.status-effect-icon {
    flex-shrink: 0;
    height: 5rem;
    width: 5rem;
}
.status-effect-body {
    display: flex;
    flex-direction: column;
    min-width: 0;
}
.status-effect-header {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: baseline;
    column-gap: 1rem;
    row-gap: 0.25rem;
}
.status-effect-name {
    margin: 0;
    color: var(--standard-white);
    font-weight: 900;
    font-size: var(--game-item-h3-size);
    text-shadow: var(--large-text-glow);
}
.status-effect-meta {
    display: flex;
    gap: 0.5rem;
    color: var(--dim-text);
    font-style: italic;
    font-weight: 700;
    font-size: 0.95rem;
}
.status-effect-type {
    color: var(--accent);
}
.status-effect-body :deep(.game-item-desc-txt) {
    margin: 0.5rem 0 0;
}
</style>
