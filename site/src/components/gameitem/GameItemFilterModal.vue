<script setup lang="ts">
import '@/styles/modal.css';
import type { Option } from '@/types/options';
import { useData } from '@/stores/useData';
import { computed, ref } from 'vue';
import { GameItemFilterDefault, type GameItemFilter } from '@/types/gameItemFilter';
import Modal from '@/components/Modal.vue';
import OptionSelector from '@/components/OptionSelector.vue';
import ManyOptionSelector from '@/components/ManyOptionSelector.vue';
import { SlidersHorizontal } from 'lucide-vue-next';

const props = defineProps<{
    type: 'perk' | 'add-on';
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
        class="filter-btn open-filter-btn"
        @click="visible = true"
    >
        <SlidersHorizontal :size="18" />
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
                    label="Side"
                    :options="sideOptions"
                    :active-value="props.filter.side"
                    @selected="(newValue) => setFilter('side', newValue)"
                />
                <ManyOptionSelector
                    v-if="props.type === 'perk' && (props.filter.side === 'All' || props.filter.side === 'Survivor')"
                    label="Survivors"
                    :items="survivors"
                    :active-values="props.filter.survivors"
                    @selected="(newValues) => setFilter('survivors', newValues)"
                />
                <ManyOptionSelector
                    v-if="props.type === 'add-on'"
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
    background: var(--dark-4);
    transition: var(--site-transition);
    color: var(--standard-white);
    border-radius: 0.5rem;
    border: none;
    font-size: 16px;
    font-weight: 700;
    padding: 0.5rem 1rem;

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

    background: var(--filter-selected-btn);
    color: var(--standard-white);
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
