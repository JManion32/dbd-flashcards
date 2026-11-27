<script setup lang="ts" generic="T">
import '@/styles/modal.css';
import { computed, ref } from 'vue';
import Modal from '@/components/Modal.vue';
import OptionSelector from '@/components/OptionSelector.vue';
import SearchSelector from '@/components/SearchSelector.vue';
import { SlidersHorizontal } from 'lucide-vue-next';
import { activeFilterCount, clearListFilters } from '@/composables/useListControls';
import type { ListConfig, ListState } from '@/types/listConfig';

const props = defineProps<{
    config: ListConfig<T>;
}>();

// The page owns the state; every change replaces it whole
const state = defineModel<ListState>({ required: true });

const visible = ref(false);

const activeCount = computed(() => activeFilterCount(props.config, state.value));
const shownFilters = computed(() =>
    (props.config.filters ?? []).filter((group) => !group.visible || group.visible(state.value))
);

function setFilter(key: string, value: string | string[]) {
    state.value = { ...state.value, filters: { ...state.value.filters, [key]: value } };
}
</script>
<template>
    <button
        class="filter-btn open-filter-btn"
        aria-label="Filters"
        @click="visible = true"
    >
        <SlidersHorizontal :size="22" />
        <span
            v-if="activeCount"
            class="filter-count"
        >
            {{ activeCount }}
        </span>
    </button>
    <Modal
        :visible="visible"
        transition="fade"
        @close="visible = false"
    >
        <div
            class="modal-content"
            style="height: 50rem"
        >
            <h2>Filters</h2>
            <div class="filter-choices-container">
                <OptionSelector
                    v-if="props.config.quickSelect"
                    :label="props.config.quickSelect.label"
                    :options="props.config.quickSelect.options"
                    :active-value="state.quick"
                    @selected="(value) => (state = { ...state, quick: value })"
                />
                <template
                    v-for="group in shownFilters"
                    :key="group.key"
                >
                    <OptionSelector
                        v-if="group.kind === 'single'"
                        :label="group.label"
                        :options="group.options"
                        :active-value="state.filters[group.key] as string"
                        @selected="(value) => setFilter(group.key, value)"
                    />
                    <SearchSelector
                        v-else
                        :label="group.label"
                        :items="group.items"
                        :active-values="state.filters[group.key] as string[]"
                        @selected="(values) => setFilter(group.key, values)"
                    />
                </template>
            </div>
            <div class="filter-actions-container">
                <button
                    class="clear-selection-btn"
                    @click="state = clearListFilters(props.config, state)"
                >
                    Clear Filters
                </button>
                <button
                    class="filter-btn"
                    @click="visible = false"
                >
                    Done
                </button>
            </div>
        </div>
    </Modal>
</template>
<style scoped>
.filter-btn {
    background: var(--dark-4);
    transition: var(--site-transition);
    color: var(--standard-white);
    border-radius: 0.5rem;
    border: none;
    font-size: 1.25rem;
    font-weight: 700;
    padding: 0.5rem 2rem;

    &:hover {
        background: var(--dark-5);
        cursor: pointer;
    }
}
.open-filter-btn {
    position: relative;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}
.filter-count {
    position: absolute;
    top: 0;
    right: 0;
    transform: translate(40%, -40%);

    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 1.25rem;
    height: 1.25rem;
    padding: 0 0.3rem;
    border-radius: 999px;

    color: var(--standard-white);
    background: color-mix(in srgb, var(--standard-gold) 10%, var(--dark-2));
    border: 1px solid color-mix(in srgb, var(--standard-gold) 60%, transparent);
    font-size: 12px;
    font-weight: 800;
    line-height: 1;
}
.filter-choices-container {
    display: flex;
    flex-direction: column;
    margin: 2rem 0;
    gap: 3rem;
}
.filter-actions-container {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: 1.5rem;
    width: 100%;
    margin-top: auto;
    padding: 1.5rem 0 0;
}
.clear-selection-btn {
    padding: 0;
    background: none;
    color: var(--dim-text);
    border: none;
    font-size: 1rem;
    font-weight: 700;
    transition: var(--site-transition);

    &:hover {
        scale: 1.05;
        cursor: pointer;
        text-shadow: var(--small-text-glow);
        color: var(--standard-white);
    }
}
</style>
