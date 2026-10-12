<script setup lang="ts">
import GameItemFilter from '@/components/gameitem/GameItemFilter.vue';
import GameItemModal from '@/components/gameitem/GameItemModal.vue';
import cursedImage from '@/assets/cursed-image.png';

import { ref, computed } from 'vue';
import { GameItemFilterDefault } from '@/types/gameItemFilter';
import type { GameItemFilter as GameItemFilterType } from '@/types/gameItemFilter';
import type { GameItem } from '@/types/gameItem';

const props = defineProps<{
    type: 'perks' | 'add-ons';
    gameItems: GameItem[];
}>();

const filter = ref<GameItemFilterType>({ ...GameItemFilterDefault });

function updateFilter(newFilter: GameItemFilterType) {
    filter.value = newFilter;
}

const filteredGameItems = computed(() => {
    return props.gameItems.filter((gameItem) => {
        // Filter by side.
        if (filter.value.side !== 'All' && gameItem.side !== filter.value.side) {
            return false;
        }

        // Filter by owner. Each list only matches its own side, so 'Universal' in one doesn't pull in the other.
        // Survivor perks belong to survivors, survivor add-ons to items; only the list shown for this page counts.
        const { killers, tags } = filter.value;
        const survivorOwners = props.type === 'perks' ? filter.value.survivors : filter.value.items;
        if (survivorOwners.length || killers.length) {
            const owners = gameItem.side === 'Survivor' ? survivorOwners : killers;
            if (!owners.includes(gameItem.owner)) {
                return false;
            }
        }

        // Filter by tags: matches items that have every selected tag.
        if (!tags.every((tag) => gameItem.tags.includes(tag))) {
            return false;
        }

        if (filter.value.search) {
            const search = filter.value.search.toLowerCase();

            const matchesDescription = gameItem.description.some((block) => {
                if (block.type === 'text') {
                    return block.content.toLowerCase().includes(search);
                }

                if (block.type === 'list') {
                    return block.items.some((item) => item.toLowerCase().includes(search));
                }

                return false;
            });

            const matchesSearch =
                gameItem.name.toLowerCase().includes(search.toLowerCase()) ||
                gameItem.rarity?.toLowerCase().includes(search.toLowerCase()) ||
                gameItem.owner.toLowerCase().includes(search.toLowerCase()) ||
                matchesDescription;

            if (!matchesSearch) {
                return false;
            }
        }

        return true;
    });
});
</script>
<template>
    <div class="card-displays-container">
        <GameItemFilter
            :type="props.type"
            :filter="filter"
            @filter="updateFilter"
        />
        <div class="display-cards-container">
            <div
                v-if="filteredGameItems.length === 0"
                class="no-match-container"
            >
                <img
                    class="no-match-img"
                    :src="cursedImage"
                />
                <p class="no-matches">No results found...</p>
            </div>
            <GameItemModal
                v-for="gameItem in filteredGameItems"
                :key="gameItem.id"
                :game-item="gameItem"
            />
        </div>
    </div>
</template>
<style scoped>
.card-displays-container {
    display: flex;
    flex-direction: column;
}
.display-cards-container {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    padding: 1rem 1rem 2.5rem 1rem;
    gap: 0.8rem;
    width: 100%;
    justify-content: center;
}
.no-match-container {
    margin-top: 3rem;
    display: flex;
    flex-direction: column;
    align-items: center;
}
.no-match-img {
    height: 20rem;
    width: 20rem;
}
.no-matches {
    color: var(--standard-dim);
    font-style: italic;
    font-size: 1.2rem;
    font-weight: 700;
}
</style>
