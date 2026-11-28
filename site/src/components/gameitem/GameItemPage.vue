<script setup lang="ts">
import ListToolbar from '@/components/list/ListToolbar.vue';
import ListNoResults from '@/components/list/ListNoResults.vue';
import GameItemModal from '@/components/gameitem/GameItemModal.vue';
import GameItemDisplay from '@/components/gameitem/GameItemDisplay.vue';
import Modal from '@/components/Modal.vue';

import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import getRarityColor from '@/utils/getRarityColor';
import { gameItemBasePath, gameItemPath } from '@/utils/gameItemSeo';
import { useListControls } from '@/composables/useListControls';
import { addOnListConfig, perkListConfig } from '@/utils/listConfigs/gameItems';
import type { GameItem } from '@/types/gameItem';

const props = defineProps<{
    type: 'perk' | 'add-on';
    gameItems: GameItem[];
    // From the URL: /perks/agitation opens Agitation over the list
    openId?: string | string[];
}>();

const route = useRoute();
const router = useRouter();

/* --- Item modal -----------------------------------------------------------
   Each perk and add-on has its own URL so search engines can index it. Clicking a card
   navigates there and this one modal shows whatever the URL names, which also lets a
   shared or searched link open straight onto an item that isn't in the rendered batch. */
const listPath = gameItemBasePath(props.type === 'perk' ? 'Perk' : 'Add-On');
const openGameItem = computed(() => props.gameItems.find((gameItem) => gameItem.id === props.openId));

// Kept after closing so the modal still has content while its leave transition plays
const shownGameItem = ref<GameItem | undefined>(openGameItem.value);
watch(openGameItem, (gameItem) => {
    if (gameItem) {
        shownGameItem.value = gameItem;
    }
});
// Perks have no rarity, so they keep the default modal color
const shownColor = computed(() =>
    shownGameItem.value?.rarity ? getRarityColor(shownGameItem.value.rarity) : 'var(--very-rare-rarity)'
);

// Keeps the query (?side=Killer), which the filter is reset from whenever it changes
function cardLink(gameItem: GameItem) {
    return { path: gameItemPath(gameItem), query: route.query };
}

function closeGameItem() {
    // Opened from the list in this tab: step back, so the browser's Back doesn't reopen it.
    // Arrived on the item's URL directly: swap to the list without leaving the site.
    const back = window.history.state?.back;
    if (typeof back === 'string' && router.resolve(back).path === listPath) {
        router.back();
    } else {
        router.replace({ path: listPath, query: route.query });
    }
}

// Filters, search, and order all live in the toolbar's config; ?side=Killer preselects a side
const listConfig = props.type === 'perk' ? perkListConfig : addOnListConfig;
const { state: listState, results: filteredAndSortedGameItems } = useListControls(() => props.gameItems, listConfig);

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

watch(
    renderedGameItems,
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
        <ListToolbar
            v-model="listState"
            :config="listConfig"
            :count="filteredAndSortedGameItems.length"
        />
        <div class="display-cards-container">
            <ListNoResults v-if="filteredAndSortedGameItems.length === 0" />
            <GameItemModal
                v-for="gameItem in renderedGameItems"
                :key="gameItem.id"
                :game-item="gameItem"
                :to="cardLink(gameItem)"
            />
        </div>
        <div
            ref="sentinel"
            class="render-sentinel"
        />
        <Modal
            :visible="!!openGameItem"
            :color="shownColor"
            transition="scale"
            @close="closeGameItem"
        >
            <GameItemDisplay
                v-if="shownGameItem"
                :game-item="shownGameItem"
            />
        </Modal>
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
</style>
