<script setup lang="ts" generic="T">
import ListFilterModal from '@/components/list/ListFilterModal.vue';
import { Search } from 'lucide-vue-next';
import type { ListConfig, ListState, SortControl, SortValue } from '@/types/listConfig';

const props = defineProps<{
    config: ListConfig<T>;
    // How many items pass the filters, for "12 perks"
    count: number;
}>();

// The page owns the state (see useListControls); every change replaces it whole
const state = defineModel<ListState>({ required: true });

function setSearch(search: string) {
    state.value = { ...state.value, search };
}

function setQuick(quick: string) {
    state.value = { ...state.value, quick };
}

const NEXT_SORT: Record<SortControl<T>['mode'], Record<SortValue, SortValue>> = {
    direction: { asc: 'desc', desc: 'asc', off: 'asc' },
    toggle: { asc: 'off', desc: 'off', off: 'asc' },
};

function stepSort(sort: SortControl<T>) {
    const next = NEXT_SORT[sort.mode][state.value.sorts[sort.key] ?? 'off'];
    state.value = { ...state.value, sorts: { ...state.value.sorts, [sort.key]: next } };
}
</script>

<template>
    <div class="list-toolbar">
        <div class="filter-container">
            <div
                v-if="props.config.quickSelect"
                class="quick-select-container"
            >
                <button
                    v-for="option in props.config.quickSelect.options"
                    :key="option.value"
                    class="quick-select-btn"
                    :class="{ active: state.quick === option.value }"
                    :aria-pressed="state.quick === option.value"
                    @click="setQuick(option.value)"
                >
                    {{ option.label }}
                </button>
            </div>
            <div class="right-filter-container">
                <div class="search-field">
                    <Search
                        class="search-icon"
                        :size="18"
                    />
                    <input
                        :value="state.search"
                        class="filter-search"
                        :placeholder="`Search ${props.config.noun[1]}...`"
                        @input="setSearch(($event.target as HTMLInputElement).value)"
                    />
                    <button
                        v-if="state.search"
                        class="search-clear-btn"
                        aria-label="Clear search"
                        @click="setSearch('')"
                    >
                        X
                    </button>
                </div>
                <ListFilterModal
                    v-if="props.config.filters?.length"
                    v-model="state"
                    :config="props.config"
                />
            </div>
        </div>
        <hr />
        <div class="sort-container">
            <span class="sort-amount">
                {{ props.count }} {{ props.count === 1 ? props.config.noun[0] : props.config.noun[1] }}
            </span>
            <div class="sort-btns-container">
                <button
                    v-for="sort in props.config.sorts"
                    :key="sort.key"
                    class="sort-btn"
                    :class="{ selected: state.sorts[sort.key] !== 'off' }"
                    :title="sort.title"
                    @click="stepSort(sort)"
                >
                    <span v-if="sort.label">{{ sort.label }}</span>
                    <component :is="sort.icon(state.sorts[sort.key] ?? 'off')" />
                </button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.list-toolbar {
    display: flex;
    flex-direction: column;
    width: 100%;
    margin-top: 3rem;
}
.list-toolbar hr {
    width: calc(100% - 4rem);
    border: none;
    margin: var(--filter-hr-top) 2rem 0;
    border-bottom: solid 1px var(--dark-5);
}
.filter-container {
    display: flex;
    flex-direction: var(--filter-container-dir);
    gap: 1.25rem;
    align-items: center;
    justify-content: space-between;
    padding: 0 2rem;
}
.quick-select-container {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 0.35rem;

    /* Same track and highlight as OptionSelector in the modals */
    background: var(--dark-0);
    border: 1px solid var(--dark-4);
    border-radius: 0.85rem;
    padding: 0.35rem;
}
.right-filter-container {
    display: flex;
    flex-direction: var(--right-container-dir);
    gap: 1rem;
    margin-left: auto;
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
    padding: 0.75rem 2.5rem 0.75rem 3rem;
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
    border-radius: 0.6rem;
    border: 1px solid transparent;
    font-weight: 800;
    align-items: center;
}
.quick-select-btn:hover {
    color: var(--standard-white);
    text-shadow: var(--small-text-shadow);
    cursor: pointer;
    background: var(--dark-3);
}
.quick-select-btn.active {
    color: var(--standard-white);
    background: color-mix(in srgb, var(--standard-gold) 10%, transparent);
    border-color: color-mix(in srgb, var(--standard-gold) 60%, transparent);
}
.sort-container {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 0.75rem 2rem;
}
.sort-btns-container {
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
    border: 1px solid transparent;
    border-radius: 0.5rem;
    transition: var(--site-transition);

    &:hover {
        cursor: pointer;
        background: var(--dark-5);
    }
}
/* Same highlight as the selectors in the modals */
.sort-btn.selected {
    background: color-mix(in srgb, var(--standard-gold) 10%, transparent);
    border-color: color-mix(in srgb, var(--standard-gold) 60%, transparent);
}
</style>
