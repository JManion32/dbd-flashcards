<script setup lang="ts">
/* Multi-select with type-ahead: picked values sit in the box as removable chips, the input filters the rest. */
import { X } from 'lucide-vue-next';
import { computed, nextTick, ref, useId } from 'vue';

const props = defineProps<{
    label: string;
    items: string[];
    activeValues: string[];
}>();

const emit = defineEmits<{
    selected: [values: string[]];
}>();

const query = ref('');
const focused = ref(false);
const highlighted = ref(0);
const input = ref<HTMLInputElement>();
const list = ref<HTMLUListElement>();
const listId = useId();

// Unpicked items containing the query, names that start with it first
const suggestions = computed(() => {
    const q = query.value.trim().toLowerCase();
    const unpicked = props.items.filter((item) => !props.activeValues.includes(item));
    if (!q) {
        return unpicked;
    }
    const matches = unpicked.filter((item) => item.toLowerCase().includes(q));
    const starts = matches.filter((item) => item.toLowerCase().startsWith(q));
    const rest = matches.filter((item) => !item.toLowerCase().startsWith(q));
    return [...starts, ...rest];
});

const showSuggestions = computed(() => focused.value && suggestions.value.length > 0);

function add(item: string) {
    emit('selected', [...props.activeValues, item]);
    query.value = '';
    highlighted.value = 0;
    input.value?.focus();
}

function remove(item: string) {
    emit(
        'selected',
        props.activeValues.filter((value) => value !== item)
    );
}

function onInput(value: string) {
    query.value = value;
    highlighted.value = 0;
    scrollToHighlighted();
}

// Keep the keyboard-highlighted row visible inside the scrolling list
function scrollToHighlighted() {
    nextTick(() => {
        list.value?.children[highlighted.value]?.scrollIntoView({ block: 'nearest' });
    });
}

function onKeydown(event: KeyboardEvent) {
    const count = suggestions.value.length;
    switch (event.key) {
        case 'ArrowDown':
            event.preventDefault();
            highlighted.value = count ? (highlighted.value + 1) % count : 0;
            scrollToHighlighted();
            break;
        case 'ArrowUp':
            event.preventDefault();
            highlighted.value = count ? (highlighted.value - 1 + count) % count : 0;
            scrollToHighlighted();
            break;
        case 'Enter': {
            const item = suggestions.value[highlighted.value];
            if (showSuggestions.value && item) {
                event.preventDefault();
                add(item);
            }
            break;
        }
        case 'Escape':
            // Close the list first; a second Escape reaches the modal
            if (showSuggestions.value) {
                event.stopPropagation();
                input.value?.blur();
            }
            break;
        case 'Backspace': {
            const last = props.activeValues.at(-1);
            if (!query.value && last) {
                remove(last);
            }
            break;
        }
    }
}
</script>

<template>
    <div class="search-selector">
        <div class="search-selector-header">
            <span class="search-selector-label">{{ props.label }}</span>
            <button
                v-if="props.activeValues.length"
                class="clear-btn"
                @click="emit('selected', [])"
            >
                Clear
            </button>
        </div>
        <div class="search-anchor">
            <!-- Clicking anywhere in the box (not just the input) starts typing -->
            <div
                class="search-box"
                @click="input?.focus()"
            >
                <span
                    v-for="value in props.activeValues"
                    :key="value"
                    class="selected-chip"
                >
                    {{ value }}
                    <button
                        class="chip-remove"
                        :aria-label="`Remove ${value}`"
                        @click.stop="remove(value)"
                    >
                        <X :size="14" />
                    </button>
                </span>
                <input
                    ref="input"
                    :value="query"
                    class="search-input"
                    role="combobox"
                    autocomplete="off"
                    :aria-expanded="showSuggestions"
                    :aria-controls="listId"
                    :aria-label="`Search ${props.label}`"
                    :placeholder="props.activeValues.length ? '' : `Search ${props.label.toLowerCase()}...`"
                    @input="onInput(($event.target as HTMLInputElement).value)"
                    @focus="focused = true"
                    @blur="focused = false"
                    @keydown="onKeydown"
                />
            </div>
            <Transition name="suggestions">
                <ul
                    v-if="showSuggestions"
                    :id="listId"
                    ref="list"
                    class="suggestions"
                    role="listbox"
                >
                    <!-- mousedown.prevent keeps focus in the input, so the list doesn't close before the click lands -->
                    <li
                        v-for="(item, i) in suggestions"
                        :key="item"
                        class="suggestion"
                        :class="{ highlighted: i === highlighted }"
                        role="option"
                        :aria-selected="i === highlighted"
                        @mousedown.prevent
                        @mouseenter="highlighted = i"
                        @click="add(item)"
                    >
                        {{ item }}
                    </li>
                </ul>
            </Transition>
        </div>
    </div>
</template>

<style scoped>
.search-selector {
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
}
.search-selector-label {
    color: var(--inactive-text);
    font-size: 0.95rem;
    font-weight: 800;
    letter-spacing: 0.12em;
    text-transform: uppercase;
}
.search-selector-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
}
.clear-btn {
    padding: 0;
    border: none;
    background: none;
    color: var(--dim-text);
    font-family: inherit;
    font-size: 0.95rem;
    font-weight: 700;
    cursor: pointer;
    transition: var(--site-transition);

    &:hover {
        color: var(--standard-white);
    }
}
.search-anchor {
    position: relative;
}
.search-box {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.4rem;
    padding: 0.5rem;
    border-radius: 0.85rem;
    background: var(--dark-0);
    border: 1px solid var(--dark-4);
    cursor: text;
    transition: var(--site-transition);
}
.selected-chip {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    padding: 0.3rem 0.4rem 0.3rem 0.75rem;
    border-radius: 0.6rem;
    color: var(--standard-white);
    background: color-mix(in srgb, var(--standard-gold) 10%, transparent);
    border: 1px solid color-mix(in srgb, var(--standard-gold) 60%, transparent);
    font-size: 1rem;
    font-weight: 700;
}
.chip-remove {
    display: flex;
    padding: 0.1rem;
    border: none;
    border-radius: 0.35rem;
    background: none;
    color: var(--dim-text);
    cursor: pointer;
    transition: var(--site-transition);

    &:hover {
        color: var(--standard-white);
        background: var(--dark-3);
    }
}
.search-input {
    flex: 1;
    min-width: 8rem;
    padding: 0.3rem 0.5rem;
    border: none;
    outline: none;
    background: none;
    color: var(--standard-white);
    font-family: inherit;
    font-weight: 600;
    font-size: 16px;
    height: 2rem;
}
.suggestions {
    position: absolute;
    top: calc(100% + 0.35rem);
    left: 0;
    right: 0;
    z-index: 5;
    /* Five rows tall (row = line-height + padding), the rest scrolls */
    max-height: calc(5 * 2.25rem + 0.7rem + 2px);
    overflow-y: auto;
    margin: 0;
    padding: 0.35rem;
    list-style: none;
    border-radius: 0.85rem;
    background: var(--dark-2);
    border: 1px solid var(--dark-4);
    box-shadow: 0 0.5rem 1.5rem rgb(0 0 0 / 50%);
    transition: var(--site-transition);
}
.suggestion {
    transition: var(--site-transition);
    padding: 0.5rem 0.75rem;
    border-radius: 0.6rem;
    color: var(--dim-text);
    font-size: 1rem;
    line-height: 1.25rem;
    font-weight: 700;
    cursor: pointer;

    &.highlighted {
        color: var(--standard-white);
        background: var(--dark-4);
    }
}
.suggestions-enter-active,
.suggestions-leave-active {
    transition: var(--site-transition);
}
.suggestions-enter-from,
.suggestions-leave-to {
    opacity: 0;
    transform: translateY(-0.25rem);
}
</style>
