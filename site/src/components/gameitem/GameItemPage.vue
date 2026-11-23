<script setup lang="ts">
import GameItemFilter from '@/components/gameitem/GameItemFilter.vue';
import GameItemSort from '@/components/gameitem/GameItemSort.vue';
import GameItemModal from '@/components/gameitem/GameItemModal.vue';
import cursedImage from '@/assets/cursed-image.png';

import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import { GameItemFilterDefault, type GameItemFilter as GameItemFilterType } from '@/types/gameItemFilter';
import { GameItemSortDefault, type GameItemSort as GameItemSortType } from '@/types/gameItemSort';
import type { GameItem } from '@/types/gameItem';

const props = defineProps<{
    type: 'perk' | 'add-on';
    gameItems: GameItem[];
}>();

const route = useRoute();

// Links can preselect a side with ?side=Killer or ?side=Survivor.
function initialFilter(): GameItemFilterType {
    const side = route.query.side;
    return {
        ...GameItemFilterDefault,
        side: side === 'Killer' || side === 'Survivor' ? side : 'All',
    };
}
const filter = ref<GameItemFilterType>(initialFilter());

const sort = ref<GameItemSortType>({ ...GameItemSortDefault });

// The router reuses this page when only the query changes (e.g. /perks?side=Killer -> /perks),
// so reset the filter and remount GameItemFilter, which only copies its filter prop on creation.
const filterKey = ref(0);
watch(
    () => route.query.side,
    () => {
        filter.value = initialFilter();
        filterKey.value++;
    }
);

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
        const survivorOwners = props.type === 'perk' ? filter.value.survivors : filter.value.items;
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

function updateSort(newSort: GameItemSortType) {
    sort.value = newSort;
}

// Ascending rarity runs Common -> Visceral. Perks have no rarity, so they all tie.
const RARITY_ORDER = ['Common', 'Uncommon', 'Rare', 'Very Rare', 'Visceral'];

function rarityRank(gameItem: GameItem) {
    return gameItem.rarity ? RARITY_ORDER.indexOf(gameItem.rarity) : -1;
}

// Sorts are layered: group by owner first, then rarity within that, then name as the tiebreaker.
// Anything switched off ties, so the store's original (alphabetical) order shows through.
const filteredAndSortedGameItems = computed(() => {
    const { alphaAsc, rarityAsc, rarityDesc, groupByOwner } = sort.value;

    return [...filteredGameItems.value].sort((a, b) => {
        if (groupByOwner) {
            const byOwner = a.owner.localeCompare(b.owner);
            if (byOwner !== 0) {
                return byOwner;
            }
        }

        if (rarityAsc || rarityDesc) {
            const byRarity = rarityRank(a) - rarityRank(b);
            if (byRarity !== 0) {
                return rarityAsc ? byRarity : -byRarity;
            }
        }

        const byName = a.name.localeCompare(b.name);
        return alphaAsc ? byName : -byName;
    });
});

// Render a batch at a time instead of all at once.
const BATCH_SIZE = 60;
const renderCount = ref(BATCH_SIZE);
const renderedGameItems = computed(() => filteredAndSortedGameItems.value.slice(0, renderCount.value));
const hasMore = computed(() => renderCount.value < filteredAndSortedGameItems.value.length);

// A new filter or sort starts back at the first batch.
watch(filteredAndSortedGameItems, () => {
    renderCount.value = BATCH_SIZE;
});

const sentinel = ref<HTMLElement | null>(null);
let observer: IntersectionObserver | null = null;

onMounted(() => {
    observer = new IntersectionObserver(
        (entries) => {
            if (entries.some((entry) => entry.isIntersecting) && hasMore.value) {
                renderCount.value += BATCH_SIZE;
            }
        },
        { rootMargin: '0px 0px 1200px 0px' }
    );
    if (sentinel.value) {
        observer.observe(sentinel.value);
    }
});

// The observer only fires on a change, so if the sentinel is still in range after a batch
// renders (tall screens, short cards), re-observe to get a fresh callback and keep filling.
watch(
    renderCount,
    () => {
        if (observer && sentinel.value) {
            observer.unobserve(sentinel.value);
            observer.observe(sentinel.value);
        }
    },
    { flush: 'post' }
);

onUnmounted(() => {
    observer?.disconnect();
});
</script>
<template>
    <div class="card-displays-container">
        <GameItemFilter
            :key="filterKey"
            :type="props.type"
            :filter="filter"
            @filter="updateFilter"
        />
        <GameItemSort
            :filtered-count="filteredGameItems.length"
            :type="props.type"
            :sort="sort"
            @sort="updateSort"
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
                v-for="gameItem in renderedGameItems"
                :key="gameItem.id"
                :game-item="gameItem"
            />
        </div>
        <div
            ref="sentinel"
            class="render-sentinel"
        />
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
.render-sentinel {
    height: 1px;
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
    color: var(--dim-text);
    font-style: italic;
    font-size: 1.2rem;
    font-weight: 700;
}
</style>
