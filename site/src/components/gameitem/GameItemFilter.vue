<script setup lang="ts">
import { ref } from 'vue';
import type { GameItemFilter } from '@/types/gameItemFilter';
import GameItemFilterModal from '@/components/gameitem/GameItemFilterModal.vue';
import { Search } from 'lucide-vue-next';

const props = defineProps<{
    type: 'perks' | 'add-ons';
    filter: GameItemFilter;
}>();

const filter = ref<GameItemFilter>({ ...props.filter });

function updateFilter() {
    emit('filter', filter.value);
}

// The modal sends back a whole new filter (side, survivors, killers, tags)
function applyModalFilter(newFilter: GameItemFilter) {
    filter.value = newFilter;
    updateFilter();
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
                    class="quick-select-btn"
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
                    <Search
                        class="search-icon"
                        :size="18"
                    />
                    <input
                        v-model="filter.search"
                        class="filter-search"
                        :placeholder="`Search ${props.type}...`"
                        @input="emit('filter', filter)"
                    />
                    <button
                        v-if="filter.search"
                        class="search-clear-btn"
                        aria-label="Clear search"
                        @click="clearSearch"
                    >
                        X
                    </button>
                </div>
                <GameItemFilterModal
                    :type="props.type"
                    :filter="filter"
                    @selected="applyModalFilter"
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
    margin-top: var(--filter-hr-top);
    border-bottom: solid 1px var(--dark-5);
}
.filter-container {
    display: flex;
    flex-direction: var(--filter-container-dir);
    gap: 1.25rem;
    align-items: center;
    justify-content: space-between;
}
.left-filter-container {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 0.75rem;

    background: #1a1a1a;
    border-radius: 0.75rem;
    padding: 0.25rem;
}
.right-filter-container {
    display: flex;
    flex-direction: var(--right-container-dir);
    gap: 1rem;
}
.advanced-filters-container {
    display: flex;
    flex-direction: row;
    gap: 1rem;
    align-items: center;
}
.clear-filters-btn {
    font-size: 16px;
    font-style: italic;
    color: var(--dim-text);
    font-weight: 700;
    transition: var(--site-transition);

    &:hover {
        color: var(--standard-white);
        cursor: pointer;
    }
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
    background: var(--dark-4);
    padding: 0.5rem 2.5rem 0.5rem 2.8rem;
    font-weight: 600;
    font-size: 16px;
    width: 20rem;
}
.search-icon {
    position: absolute;
    left: 0.75rem;
    color: var(--dim-text);
    pointer-events: none;
}
.filter-search::placeholder {
    font-style: italic;
    color: var(--inactive-text);
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

    color: var(--dim-text);
    font-size: 16px;
    font-weight: 900;
    line-height: 1;
    transition: var(--site-transition);
    cursor: pointer;
}

.search-clear-btn:hover {
    color: var(--standard-white);
}
.quick-select-btn {
    color: var(--dim-text);
    background: transparent;
    transition: var(--site-transition);
    padding: 0.5rem 1.5rem;
    font-size: 16px;
    border-radius: 0.5rem;
    border: none;
    font-weight: 800;
    align-items: center;
}
.quick-select-btn:hover {
    color: var(--standard-white);
    text-shadow: var(--small-text-shadow);
    cursor: pointer;
    background: var(--dark-4);
}
.quick-select-btn.active {
    color: var(--standard-white);
    background: var(--filter-selected-btn);
}
</style>
