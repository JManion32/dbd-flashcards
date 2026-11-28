<script setup lang="ts">
import { computed } from 'vue';

import GameItemModal from '@/components/gameitem/GameItemModal.vue';
import GameItemDisplayText from '@/components/gameitem/GameItemDisplayText.vue';
import OwnerMainItem from '@/components/owners/OwnerMainItem.vue';
import rarityOrder from '../../../../data/validation/rarities.json';

import type { GameItem } from '@/types/gameItem';

const props = defineProps<{
    name: string;
    description?: string;
    // Heading for the main section, e.g. 'Items' or 'Perks'
    mainTitle: string;
    mainItems: GameItem[];
    addOns?: GameItem[];
}>();

// Rarest first (rarities.json runs Visceral -> Common), then A-Z within a rarity
function byRarity(gameItems: GameItem[]) {
    const rank = (gameItem: GameItem) => {
        const index = rarityOrder.indexOf(gameItem.rarity ?? '');
        return index === -1 ? rarityOrder.length : index;
    };
    return [...gameItems].sort((a, b) => rank(a) - rank(b) || a.name.localeCompare(b.name));
} /* A full-width row for an owner's main game items: each item variant on /items (Sport Flashlight,
   ...), and later a character's perks. Shows the whole description inline, so there's no modal.
   Accented by rarity; perks have none, so they keep the default accent. */

const mainItems = computed(() => byRarity(props.mainItems));
const addOns = computed(() => byRarity(props.addOns ?? []));
</script>

<template>
    <section class="owner-display-container">
        <header class="owner-header">
            <h2 class="owner-title">
                {{ props.name }}
            </h2>
            <p
                v-if="props.description"
                class="owner-desc"
            >
                <GameItemDisplayText :text="props.description" />
            </p>
        </header>
        <div
            v-if="mainItems.length > 0"
            class="owner-section"
        >
            <h3 class="owner-section-title">
                {{ props.mainTitle }}
                <span class="owner-section-count">{{ mainItems.length }}</span>
            </h3>
            <div class="owner-main-items">
                <OwnerMainItem
                    v-for="gameItem in mainItems"
                    :key="gameItem.id"
                    :game-item="gameItem"
                />
            </div>
        </div>
        <div
            v-if="addOns.length > 0"
            class="owner-section"
        >
            <h3 class="owner-section-title">
                Add-Ons
                <span class="owner-section-count">{{ addOns.length }}</span>
            </h3>
            <div class="owner-cards">
                <GameItemModal
                    v-for="gameItem in addOns"
                    :key="gameItem.id"
                    :game-item="gameItem"
                />
            </div>
        </div>
    </section>
</template>

<style scoped>
.owner-display-container {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    padding: 2rem;
    border-radius: 1rem;
    background: var(--dark-1);
    border: 1px solid var(--dark-4);
    width: var(--owner-display-width);
}
.owner-header {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}
.owner-title {
    margin: 0;
    color: var(--standard-white);
    font-size: 3rem;
    font-weight: 900;
    text-shadow: var(--large-text-glow);
}
.owner-desc {
    margin: 0;
    max-width: 60rem;
    color: var(--dim-text);
    font-size: 0.95rem;
    font-weight: 600;
}
.owner-section {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}
.owner-section-title {
    display: flex;
    align-items: baseline;
    gap: 0.6rem;
    margin: 0;
    color: var(--standard-white);
    font-size: var(--game-item-h3-size);
    font-weight: 900;
}
.owner-section-count {
    color: var(--dim-text);
    font-size: 1rem;
    font-weight: 700;
}
.owner-main-items {
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
}
/* As many columns as fit at the card's usual 12rem, then stretched so the rows span the box exactly */
.owner-cards {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(12rem, 1fr));
    gap: 0.8rem;

    & :deep(.display-card) {
        width: 100%;
    }
}
</style>
