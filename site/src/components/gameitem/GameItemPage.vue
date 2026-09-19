<script setup lang="ts">
import GameItemFilter from '@/components/gameitem/GameItemFilter.vue';
import GameItemModal from '@/components/gameitem/GameItemModal.vue';

import { ref, computed } from 'vue';
import type GameItemFilterType from '@/types/GameItemFilter.ts';
import type { GameItem } from '@/types/GameItem.ts';

const props = defineProps<{
    type: 'perks' | 'add-ons';
    gameItems: GameItem[];
}>();

function getDefaultFilter(): GameItemFilterType {
    return {
        side: 'All',
        search: '',
        tags: [],
    };
}

const filter = ref<GameItemFilterType>(getDefaultFilter());

function updateFilter(newFilter: GameItemFilterType) {
    filter.value = newFilter;
}

const filteredGameItems = computed(() => {
    return props.gameItems.filter((gameItem) => {
        // Filter by side.
        if (filter.value.side !== 'All' && gameItem.side !== filter.value.side) {
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
            @filter="updateFilter"
        />
        <div class="display-cards-container">
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
    padding: 1rem;
    gap: 0.8rem;
    width: 100%;
    justify-content: center;
}
</style>
