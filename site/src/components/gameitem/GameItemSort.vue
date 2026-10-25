<script setup lang="ts">
import { ref } from 'vue';
import { ArrowDownAZ, ArrowDownZA, ArrowUp, ArrowDown, SquareUserRound } from 'lucide-vue-next';
import type { GameItemSort } from '@/types/gameItemSort';
const props = defineProps<{
    filteredCount: number;
    type: 'perks' | 'add-ons';
    sort: GameItemSort;
}>();

const emit = defineEmits<{
    sort: [value: GameItemSort];
}>();

const sort = ref<GameItemSort>({ ...props.sort });

function handleSortEmit(btn: string) {
    switch (btn) {
        case 'rarity':
            if (sort.value.rarityDesc) {
                sort.value.rarityDesc = false;
                sort.value.rarityAsc = true;
            } else if (sort.value.rarityAsc) {
                sort.value.rarityAsc = false;
            } else if (!sort.value.rarityAsc && !sort.value.rarityDesc) {
                sort.value.rarityDesc = true;
            }
            break;

        case 'alpha':
            sort.value.alphaAsc = !sort.value.alphaAsc;
            break;

        case 'owner':
            sort.value.groupByOwner = !sort.value.groupByOwner;
            break;
    }
    emit('sort', sort.value);
}
</script>

<template>
    <div class="sort-cards-container">
        <span class="sort-amount">{{ props.filteredCount }} {{ props.type }}</span>
        <div class="sort-card-btns-container">
            <!-- Rarity -->
            <button
                class="sort-btn"
                :class="{ selected: props.sort.rarityAsc || props.sort.rarityDesc }"
                title="Order by Rarity"
                @click="handleSortEmit('rarity')"
            >
                <span>Rarity</span>
                <ArrowDown v-if="props.sort.rarityDesc || !props.sort.rarityAsc" />
                <ArrowUp v-if="props.sort.rarityAsc" />
            </button>
            <!-- Alphabetical -->
            <button
                class="sort-btn selected"
                title="Alphabetical Ordering"
                @click="handleSortEmit('alpha')"
            >
                <ArrowDownAZ v-if="props.sort.alphaAsc" />
                <ArrowDownZA v-if="!props.sort.alphaAsc" />
            </button>
            <!-- Group by Owner -->
            <button
                class="sort-btn"
                title="Group by Owner"
                :class="{ selected: props.sort.groupByOwner }"
                @click="handleSortEmit('owner')"
            >
                <SquareUserRound />
            </button>
        </div>
    </div>
</template>
<style scoped>
.sort-cards-container {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 0.75rem 2rem;
}
.sort-card-btns-container {
    display: flex;
    flex-direction: row;
    gap: 1rem;
}
.sort-amount {
    color: var(--inactive-text);
    font-weight: 700;
    font-style: italic;
}
.sort-btn {
    display: flex;
    flex-direction: row;
    gap: 0.5rem;
    align-items: center;

    font-size: 1rem;
    font-weight: 700;
    color: var(--standard-white);
    padding: 0.25rem 0.75rem;
    background: var(--dark-4);
    border: none;
    border-radius: 0.5rem;
    transition: var(--site-transition);

    &:hover {
        cursor: pointer;
        background: var(--dark-5);
    }
}
.sort-btn.selected {
    background: var(--filter-selected-btn);
}
</style>
