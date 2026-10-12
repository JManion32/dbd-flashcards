<script setup lang="ts">
import '@/styles/modal.css';
import type { Option } from '@/types/options';
import { useData } from '@/stores/useData';
import { computed, ref } from 'vue';
import { GameItemFilterDefault, type GameItemFilter } from '@/types/gameItemFilter';
import Modal from '@/components/Modal.vue';
import OptionSelector from '@/components/OptionSelector.vue';
import ManyOptionSelector from '@/components/ManyOptionSelector.vue';

const props = defineProps<{
    type: 'perks' | 'add-ons';
    filter: GameItemFilter;
}>();

// Emits a whole new filter on every change; the parent owns the state
const emit = defineEmits<{
    selected: [filter: GameItemFilter];
}>();

const visible = ref(false);
const { tags, survivors, killers, items } = useData();

const sideOptions: Option<GameItemFilter['side']>[] = [
    { value: 'Killer', label: 'Killer' },
    { value: 'Survivor', label: 'Survivor' },
    { value: 'All', label: 'Both' },
];

const activeCount = computed(
    () =>
        props.filter.survivors.length +
        props.filter.killers.length +
        props.filter.items.length +
        props.filter.tags.length
);

function setFilter<K extends keyof GameItemFilter>(key: K, value: GameItemFilter[K]) {
    emit('selected', { ...props.filter, [key]: value });
}

// Keeps the search box; it lives outside this modal
function clearFilters() {
    emit('selected', { ...GameItemFilterDefault, search: props.filter.search });
}
</script>
<template>
    <button
        class="filter-btn"
        @click="visible = true"
    >
        Filter<span v-if="activeCount"> ({{ activeCount }})</span>
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
                    label="Side"
                    :options="sideOptions"
                    :active-value="props.filter.side"
                    @selected="(newValue) => setFilter('side', newValue)"
                />
                <ManyOptionSelector
                    v-if="props.type === 'perks' && (props.filter.side === 'All' || props.filter.side === 'Survivor')"
                    label="Survivors"
                    :items="survivors"
                    :active-values="props.filter.survivors"
                    @selected="(newValues) => setFilter('survivors', newValues)"
                />
                <ManyOptionSelector
                    v-if="props.type === 'add-ons'"
                    label="Items"
                    :items="items"
                    :active-values="props.filter.items"
                    @selected="(newValues) => setFilter('items', newValues)"
                />
                <ManyOptionSelector
                    v-if="props.filter.side === 'All' || props.filter.side === 'Killer'"
                    label="Killers"
                    :items="killers"
                    :active-values="props.filter.killers"
                    @selected="(newValues) => setFilter('killers', newValues)"
                />
                <ManyOptionSelector
                    label="Tags"
                    :items="tags"
                    :active-values="props.filter.tags"
                    @selected="(newValues) => setFilter('tags', newValues)"
                />
            </div>
            <div class="filter-actions-container">
                <button
                    class="clear-selection-btn"
                    @click="clearFilters()"
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
    background: var(--dark-222);
    transition: var(--site-transition);
    color: var(--standard-white);
    border-radius: 0.5rem;
    border: none;
    font-size: 16px;
    font-weight: 700;
    padding: 0.5rem 1rem;

    &:hover {
        background: var(--dark-333);
        cursor: pointer;
    }
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
    color: var(--standard-dim);
    font-style: italic;
    border: none;
    font-size: 1rem;
    font-weight: 700;
    transition: var(--site-transition);
}
.clear-selection-btn:hover {
    scale: 1.05;
    cursor: pointer;
    text-shadow: var(--small-text-glow);
    color: var(--standard-white);
}
</style>
