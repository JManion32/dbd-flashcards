<script setup lang="ts" generic="T extends string | number">
import type { Option } from '@/types/options';

const props = defineProps<{
    label: string;
    options: Option<T>[];
    activeValue: T;
}>();

const emit = defineEmits<{
    selected: [value: T];
}>();
</script>

<template>
    <div class="option-group">
        <span class="option-label">{{ props.label }}</span>
        <div class="segmented">
            <button
                v-for="option in options"
                :key="option.value"
                :class="{ active: props.activeValue === option.value }"
                :aria-pressed="props.activeValue === option.value"
                @click="emit('selected', option.value)"
            >
                {{ option.label }}
            </button>
        </div>
    </div>
</template>

<style scoped>
.option-group {
    display: flex;
    flex-direction: column;
    gap: 0.45rem;
}
.option-label {
    color: var(--inactive-text);
    font-size: 0.95rem;
    font-weight: 800;
    letter-spacing: 0.12em;
    text-transform: uppercase;
}
.segmented {
    display: flex;
    gap: 0.35rem;
    padding: 0.35rem;
    border-radius: 0.85rem;
    background: var(--site-bg);
    border: 1px solid var(--dark-222);
}
.segmented button {
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.15rem;

    padding: 0.45rem 1rem;
    border: 1px solid transparent;
    border-radius: 0.6rem;
    background: none;

    color: var(--standard-dim);
    font-family: inherit;
    font-size: 1.2rem;
    font-weight: 800;
    transition: var(--site-transition);
}
.segmented button:not(.segment-with-hint) {
    flex-direction: row;
    gap: 0.5rem;
}
.segmented button:hover {
    cursor: pointer;
    color: var(--standard-white);
    background: var(--secondary-bg);
}
.segmented button.active {
    color: var(--standard-white);
    background: color-mix(in srgb, var(--standard-gold) 10%, transparent);
    border-color: color-mix(in srgb, var(--standard-gold) 60%, transparent);
}
.segmented button.active {
    color: var(--standard-dim);
}
</style>
