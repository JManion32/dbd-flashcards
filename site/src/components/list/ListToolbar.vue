<script setup lang="ts" generic="T">
import ListFilterModal from '@/components/list/ListFilterModal.vue';
import { Search } from 'lucide-vue-next';
import type { ListConfig, ListState } from '@/types/listConfig';

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
        <div class="list-divider">
            <hr />
            <span class="list-count">
                {{ props.count }} {{ props.count === 1 ? props.config.noun[0] : props.config.noun[1] }}
            </span>
            <hr />
        </div>
    </div>
</template>

<style scoped>
.list-toolbar {
    display: flex;
    flex-direction: column;
    width: 100%;
    margin-top: 3rem;
    padding: 0 2rem;
}
.list-divider {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 1rem;
    margin: var(--filter-divider-top) 0 1.5rem;
    width: 100%;
}
.list-divider hr {
    border: none;
    border-bottom: solid 1px var(--dark-5);
    width: 100%;
}
.filter-container {
    display: flex;
    flex-direction: var(--filter-container-dir);
    gap: 1.25rem;
    align-items: center;
    justify-content: space-between;
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
    margin-right: var(--right-filter-right-margin);
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

    &::placeholder {
        color: var(--inactive-text);
    }

    &:focus {
        outline: none;
    }
}
.search-icon {
    position: absolute;
    left: 0.75rem;
    color: var(--dim-text);
    pointer-events: none;
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

    &:hover {
        color: var(--standard-white);
    }
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

    &:hover {
        color: var(--standard-white);
        text-shadow: var(--small-text-shadow);
        cursor: pointer;
        background: var(--dark-3);
    }

    &.active {
        color: var(--standard-white);
        background: color-mix(in srgb, var(--standard-gold) 10%, transparent);
        border-color: color-mix(in srgb, var(--standard-gold) 60%, transparent);
    }
}
.list-count {
    color: var(--inactive-text);
    font-weight: 700;
    white-space: nowrap;
}
</style>
