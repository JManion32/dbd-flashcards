<script setup lang="ts">
import GameFilterModal from '@/components/gameitem/GameItemFilterModal.vue';
</script>

<template>
    <div class="filter-component-container">
        <div class="filter-container">
            <div class="left-filter-container">
                <button class="quick-select-btn">Killer</button>
                <button class="quick-select-btn">Survivor</button>
                <button class="quick-select-btn">All</button>
            </div>
            <div class="right-filter-container">
                <button class="clear-filters-btn">Clear Filters</button>
                <GameFilterModal />
                <input
                    class="filter-search"
                    placeholder="Search perks..."
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
    flex-direction: row;
}
.left-filter-container {
    display: flex;
    flex-direction: row;
    gap: 1rem;
}
.right-filter-container {
    display: flex;
    flex-direction: row;
    gap: 1.5rem;
    margin-left: auto;
}
.clear-filters-btn {
    background: none;
    color: var(--standard-white);
    transition: var(--site-transition);
    border: none;
    font-weight: 700;
    font-style: italic;
    font-size: 1rem;
}
.clear-filters-btn:hover {
    scale: 1.05;
    text-shadow: var(--small-text-glow);
    cursor: pointer;
}
.filter-search {
    border-radius: 0.5rem;
    border: none;
    color: var(--standard-white);
    background: var(--dark-333);
    padding: 0.5rem 0.75rem;
    font-weight: 700;
    font-size: 1rem;
}
.filter-search::placeholder {
    font-style: italic;
}
.filter-search:focus {
    outline: none;
}
.quick-select-btn {
    color: var(--standard-dim);
    border: 2px solid var(--nav-link-active-bg);
    background: transparent;
    transition: var(--site-transition);
    font-weight: 700;
    border-radius: 0.5rem;
    padding: 0 1rem;
    font-size: 1rem;
}
.quick-select-btn:hover {
    color: var(--standard-white);
    text-shadow: var(--small-text-shadow);
    cursor: pointer;
    background: var(--nav-link-active-bg);
}
</style>
