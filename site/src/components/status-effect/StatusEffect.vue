<script setup lang="ts">
import GameItemDisplayDesc from '@/components/gameitem/GameItemDisplayDesc.vue';

import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { getGameItemImage } from '@/utils/resolveGameItemImg';
import { STATUS_EFFECTS_PATH, statusEffectPath } from '@/utils/statusEffectSeo';
import type { StatusEffect } from '@/types/statusEffect';

const props = defineProps<{
    statusEffect: StatusEffect;
    // Named in the URL (/status-effects/haste), so it's highlighted
    open?: boolean;
    // Smaller, for showing inside another display
    compact?: boolean;
}>();

const route = useRoute();

// The whole card is a link. On the status effects page, clicking selects this status effect (its own
// URL) or, when it's already selected, goes back to the plain list, keeping the query (?side=Killer).
// It replaces rather than pushes there, so Back leaves the page instead of stepping through every
// highlight. Compact cards (inside another display) just link to the status effect's page.
const toggleLink = computed(() =>
    props.compact
        ? { path: statusEffectPath(props.statusEffect) }
        : { path: props.open ? STATUS_EFFECTS_PATH : statusEffectPath(props.statusEffect), query: route.query }
);

const sideLabel = props.statusEffect.side === 'All' ? 'Killers & Survivors' : `${props.statusEffect.side}s`;
</script>

<template>
    <RouterLink
        :id="props.compact ? undefined : `status-effect-${props.statusEffect.id}`"
        :to="toggleLink"
        :replace="!props.compact"
        class="status-effect"
        :class="[
            `status-effect-${props.statusEffect.type.toLowerCase()}`,
            { open: props.open, compact: props.compact },
        ]"
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
    </RouterLink>
</template>

<style scoped>
.status-effect {
    --accent: var(--status-effect-buff);

    display: flex;
    flex-direction: row;
    align-items: flex-start;
    gap: 1.5rem;
    padding: 1.25rem 1.5rem;
    background-color: var(--dark-2);
    border: 1px solid var(--dark-5);
    border-left: 4px solid var(--accent);
    border-radius: 1rem;
    color: inherit;
    text-decoration: none;
    transition: var(--site-transition);

    &:hover {
        background-color: var(--dark-3);
    }
}
.status-effect.compact {
    --gd-desc-size: 0.9rem;

    gap: 1rem;
    padding: 0.75rem 1rem;
    border-radius: 0.75rem;

    .status-effect-icon {
        height: 3.5rem;
        width: 3.5rem;
    }

    .status-effect-name {
        font-size: 1.15rem;
    }
}
.status-effect.open {
    border-color: var(--accent);
    background: color-mix(in srgb, var(--accent) 10%, transparent);
}
.status-effect-debuff {
    --accent: var(--status-effect-debuff);
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
