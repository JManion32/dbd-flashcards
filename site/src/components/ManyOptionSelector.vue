<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{
    label: string;
    items: string[];
    activeValues: string[];
}>();

const emit = defineEmits<{
    selected: [values: string[]];
}>();

// Collapsed by default; these lists are long
const open = ref(false);

function toggleItem(item: string) {
    const values = props.activeValues.includes(item)
        ? props.activeValues.filter((value) => value !== item)
        : [...props.activeValues, item];
    emit('selected', values);
}
</script>

<template>
    <div class="option-group">
        <div class="option-header">
            <button
                class="option-toggle"
                :aria-expanded="open"
                @click="open = !open"
            >
                <span
                    class="chevron"
                    :class="{ open }"
                    >&#9656;</span
                >
                <span class="option-label">{{ props.label }}</span>
                <span
                    v-if="props.activeValues.length"
                    class="selected-count"
                    >{{ props.activeValues.length }} selected</span
                >
            </button>
            <button
                v-if="props.activeValues.length"
                class="clear-btn"
                @click="emit('selected', [])"
            >
                Clear
            </button>
        </div>
        <div
            v-if="open"
            class="chips"
        >
            <button
                v-for="item in props.items"
                :key="item"
                class="chip"
                :class="{ active: props.activeValues.includes(item) }"
                :aria-pressed="props.activeValues.includes(item)"
                @click="toggleItem(item)"
            >
                {{ item }}
            </button>
        </div>
    </div>
</template>

<style scoped>
.option-group {
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
}
.option-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
}
.option-toggle {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    padding: 0;
    border: none;
    background: none;
    font-family: inherit;
    cursor: pointer;
}
.chevron {
    color: var(--inactive-text);
    font-size: 1rem;
    transition: var(--site-transition);
}
.chevron.open {
    rotate: 90deg;
}
.option-label {
    color: var(--inactive-text);
    font-size: 0.95rem;
    font-weight: 800;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    transition: var(--site-transition);
}
.option-toggle:hover .option-label,
.option-toggle:hover .chevron {
    color: var(--standard-white);
}
.selected-count {
    color: var(--standard-gold);
    font-size: 0.9rem;
    font-weight: 700;
    font-style: italic;
}
.clear-btn {
    padding: 0;
    border: none;
    background: none;
    color: var(--standard-dim);
    font-family: inherit;
    font-size: 0.95rem;
    font-weight: 700;
    font-style: italic;
    transition: var(--site-transition);
}
.clear-btn:hover {
    cursor: pointer;
    color: var(--standard-white);
}
.chips {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.4rem;
    padding: 0.5rem;
    border-radius: 0.85rem;
    background: var(--site-bg);
    border: 1px solid var(--dark-222);
}
.chip {
    padding: 0.35rem 0.75rem;
    border: 1px solid transparent;
    border-radius: 0.6rem;
    background: none;
    color: var(--standard-dim);
    font-family: inherit;
    font-size: 1rem;
    font-weight: 700;
    transition: var(--site-transition);
}
.chip:hover {
    cursor: pointer;
    color: var(--standard-white);
    background: var(--secondary-bg);
}
.chip.active {
    color: var(--standard-white);
    background: color-mix(in srgb, var(--standard-gold) 10%, transparent);
    border-color: color-mix(in srgb, var(--standard-gold) 60%, transparent);
}
</style>
