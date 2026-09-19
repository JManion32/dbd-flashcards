<script setup lang="ts">
import GameFilterModal from '@/components/gameitem/GameItemFilterModal.vue';
import { ref } from 'vue';

type SideFilter = 'killer' | 'survivor' | 'all';
const selectedSide = ref<SideFilter>('all');

const props = defineProps<{
    type: 'perks' | 'add-ons';
}>();
</script>

<template>
    <div class="filter-component-container">
        <div class="filter-container">
            <div class="left-filter-container">
                <button
                    class="quick-select-btn"
                    :class="{ active: selectedSide === 'killer' }"
                    @click="selectedSide = 'killer'"
                >
                    Killer
                </button>

                <button
                    class="quick-select-btn"
                    :class="{ active: selectedSide === 'survivor' }"
                    @click="selectedSide = 'survivor'"
                >
                    Survivor
                </button>

                <button
                    class="quick-select-btn"
                    :class="{ active: selectedSide === 'all' }"
                    @click="selectedSide = 'all'"
                >
                    All
                </button>
            </div>
            <div class="right-filter-container">
                <button class="clear-btn-inactive">Clear</button>
                <GameFilterModal />
                <input
                    class="filter-search"
                    :placeholder="`Search ${props.type}...`"
                />
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
    gap: 1.5rem;
    height: 2rem;
}
.clear-btn-inactive,
.clear-btn-active {
    background: none;
    color: var(--standard-dim);
    transition: var(--site-transition);
    border: none;
    font-weight: 700;
    font-style: italic;
    font-size: 1rem;
}
.clear-btn-inactive {
    color: var(--standard-gray);
}
.clear-btn-active {
    color: var(--standard-dim);
}
.clear-btn-active:hover {
    color: var(--standard-white);
    cursor: pointer;
}
.filter-search {
    border-radius: 0.5rem;
    border: none;
    color: var(--standard-white);
    background: var(--dark-222);
    padding: 0.5rem 0.75rem;
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
.quick-select-btn {
    color: var(--standard-dim);
    background: transparent;
    transition: var(--site-transition);
    padding: 0.25rem 1.25rem;
    font-size: 1rem;
    border-radius: 0.5rem;
    border: none;
    font-weight: 700;
}
.quick-select-btn:hover {
    color: var(--standard-white);
    text-shadow: var(--small-text-shadow);
    cursor: pointer;
    background: var(--dark-222);
}
.quick-select-btn.active {
    color: var(--standard-white);
    background: var(--dark-333);
}
</style>
