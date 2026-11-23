<script setup lang="ts">
import { computed, ref } from 'vue';

const props = defineProps<{
    label: string;
    items: string[];
    activeValues: string[];
    // Start expanded, e.g. when already tucked inside another collapsible section
    defaultOpen?: boolean;
    // The same items in release order. When given, a toggle switches between it and `items` (A–Z).
    releaseItems?: string[];
}>();

const emit = defineEmits<{
    selected: [values: string[]];
}>();

// Collapsed by default; these lists are long
const open = ref(props.defaultOpen ?? false);

// Release order is the default wherever it's available
const byRelease = ref(true);
const displayedItems = computed(() => (props.releaseItems && byRelease.value ? props.releaseItems : props.items));

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
            <div class="header-actions">
                <div
                    v-if="open && props.releaseItems"
                    class="sort-switch"
                    role="group"
                    aria-label="Sort order"
                >
                    <button
                        class="sort-option"
                        :class="{ active: byRelease }"
                        :aria-pressed="byRelease"
                        @click="byRelease = true"
                    >
                        Release
                    </button>
                    <button
                        class="sort-option"
                        :class="{ active: !byRelease }"
                        :aria-pressed="!byRelease"
                        @click="byRelease = false"
                    >
                        A–Z
                    </button>
                </div>
                <button
                    v-if="props.activeValues.length"
                    class="header-btn"
                    @click="emit('selected', [])"
                >
                    Clear
                </button>
            </div>
        </div>
        <div
            v-if="open"
            class="chips"
        >
            <button
                v-for="item in displayedItems"
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
.header-actions {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.sort-switch {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.2rem;
    padding: 0.2rem;
    border-radius: 0.6rem;
    background: var(--dark-0);
    border: 1px solid var(--dark-4);
}
/* Same fade-in highlight as OptionSelector's segments, just smaller */
.sort-option {
    padding: 0.2rem 0.7rem;
    border: 1px solid transparent;
    border-radius: 0.45rem;
    background: none;
    color: var(--dim-text);
    font-family: inherit;
    font-size: 0.85rem;
    font-weight: 700;
    transition: var(--site-transition);
    cursor: pointer;
}
.sort-option:hover {
    color: var(--standard-white);
    background: var(--dark-3);
}
.sort-option.active {
    color: var(--standard-white);
    background: color-mix(in srgb, var(--standard-gold) 10%, transparent);
    border-color: color-mix(in srgb, var(--standard-gold) 60%, transparent);
}
.header-btn {
    padding: 0;
    border: none;
    background: none;
    color: var(--dim-text);
    font-family: inherit;
    font-size: 0.95rem;
    font-weight: 700;
    font-style: italic;
    transition: var(--site-transition);
}
.header-btn:hover {
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
    background: var(--dark-0);
    border: 1px solid var(--dark-4);
}
.chip {
    padding: 0.35rem 0.75rem;
    border: 1px solid transparent;
    border-radius: 0.6rem;
    background: none;
    color: var(--dim-text);
    font-family: inherit;
    font-size: 1rem;
    font-weight: 700;
    transition: var(--site-transition);
}
.chip:hover {
    cursor: pointer;
    color: var(--standard-white);
    background: var(--dark-3);
}
.chip.active {
    color: var(--standard-white);
    background: color-mix(in srgb, var(--standard-gold) 10%, transparent);
    border-color: color-mix(in srgb, var(--standard-gold) 60%, transparent);
}
</style>
