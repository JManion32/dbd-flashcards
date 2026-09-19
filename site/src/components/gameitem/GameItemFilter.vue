<script setup lang="ts">
import { ref } from 'vue';
import type GameItemFilter from '@/types/GameItemFilter.ts';

import survivorIcon from '@/assets/survivor-icon.webp';
import killerIcon from '@/assets/killer-icon.webp';

const props = defineProps<{
    type: 'perks' | 'add-ons';
}>();
function getDefaultFilter(): GameItemFilter {
    return {
        side: 'All',
        search: '',
        tags: [],
    };
}

const filter = ref<GameItemFilter>(getDefaultFilter());

function updateFilter() {
    emit('filter', filter.value);
}

function clearSearch() {
    filter.value.search = '';
    emit('filter', filter.value);
}

const emit = defineEmits<{
    filter: [value: GameItemFilter];
}>();
</script>

<template>
    <div class="filter-component-container">
        <div class="filter-container">
            <div class="left-filter-container">
                <button
                    class="quick-select-btn"
                    :class="{ active: filter.side === 'Killer' }"
                    @click="
                        filter.side = 'Killer';
                        updateFilter();
                    "
                >
                    Killer
                </button>
                <button
                    class="qsb-mobile"
                    :class="{ active: filter.side === 'Killer' }"
                    @click="
                        filter.side = 'Killer';
                        updateFilter();
                    "
                >
                    <img :src="killerIcon" />
                </button>

                <button
                    class="quick-select-btn"
                    :class="{ active: filter.side === 'Survivor' }"
                    @click="
                        filter.side = 'Survivor';
                        updateFilter();
                    "
                >
                    Survivor
                </button>
                <button
                    class="qsb-mobile"
                    :class="{ active: filter.side === 'Survivor' }"
                    @click="
                        filter.side = 'Survivor';
                        updateFilter();
                    "
                >
                    <img :src="survivorIcon" />
                </button>

                <button
                    class="quick-select-btn-all"
                    :class="{ active: filter.side === 'All' }"
                    @click="
                        filter.side = 'All';
                        updateFilter();
                    "
                >
                    All
                </button>
            </div>
            <div class="right-filter-container">
                <div class="search-field">
                    <input
                        v-model="filter.search"
                        class="filter-search"
                        :placeholder="`Search ${props.type}...`"
                        @keyup.enter="emit('filter', filter)"
                    />
                    <button
                        v-if="filter.search"
                        class="search-clear-btn"
                        aria-label="Clear search"
                        @click="clearSearch"
                    >
                        ×
                    </button>
                </div>
            </div>
        </div>
        <hr />
    </div>
</template>

<style scoped>
.filter-component-container {
    display: flex;
    flex-direction: column;
    width: 100%;
    padding: 0 2rem;
    margin-top: 3rem;
}
.filter-component-container hr {
    width: 100%;
    border: none;
    margin-top: 1rem;
    border-bottom: solid 1px var(--standard-gray);
}
.filter-container {
    display: flex;
    flex-direction: var(--filter-container-dir);
    gap: 1rem;
    align-items: center;
    justify-content: space-between;
}
.left-filter-container {
    display: flex;
    flex-direction: row;
    gap: 1rem;
    height: 2rem;
}
.right-filter-container {
    display: flex;
    flex-direction: row;
    gap: 0.75rem;
    height: 2rem;
}
.search-field {
    position: relative;
    display: flex;
    align-items: center;
}
.filter-search {
    border-radius: 0.5rem;
    border: none;
    color: var(--standard-white);
    background: var(--dark-222);
    padding: 0.5rem 2.5rem 0.5rem 0.75rem;
    font-weight: 700;
    font-size: 1rem;
    width: 16rem;
}
.filter-search::placeholder {
    font-style: italic;
}
.filter-search:focus {
    outline: none;
}
.search-clear-btn {
    position: absolute;
    top: 50%;
    right: 0.75rem;
    transform: translateY(-50%);

    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    border: none;
    background: none;

    color: var(--standard-dim);
    font-size: 1.25rem;
    line-height: 1;
    transition: var(--site-transition);
    cursor: pointer;
}

.search-clear-btn:hover {
    color: var(--standard-white);
}
.quick-select-btn-all,
.quick-select-btn,
.qsb-mobile {
    color: var(--standard-dim);
    background: transparent;
    transition: var(--site-transition);
    padding: 0.25rem 0.5rem;
    font-size: 1rem;
    border-radius: 0.5rem;
    border: none;
    font-weight: 700;
    align-items: center;
    font-size: 1.05rem;
}
.quick-select-btn {
    display: var(--qsb-display);
}
.qsb-mobile {
    display: var(--qsb-mobile-display);
}
.qsb-mobile img {
    height: 1.75rem;
    width: 1.75rem;
}
.quick-select-btn-all:hover,
.qsb-mobile:hover,
.quick-select-btn:hover {
    color: var(--standard-white);
    text-shadow: var(--small-text-shadow);
    cursor: pointer;
    background: var(--dark-222);
}
.quick-select-btn-all.active,
.qsb-mobile.active,
.quick-select-btn.active {
    color: var(--standard-white);
    background: var(--dark-333);
}
</style>
