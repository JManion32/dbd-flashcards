<script setup lang="ts">
import ListToolbar from '@/components/list/ListToolbar.vue';
import ListNoResults from '@/components/list/ListNoResults.vue';

import { useData } from '@/stores/useData';
import { useListControls } from '@/composables/useListControls';
import { itemListConfig } from '@/utils/listConfigs/owners';

// items.json is just the item types (Flashlight, Toolbox, ...); there's no Universal entry
const { items } = useData();
const { state, results } = useListControls(items, itemListConfig);
</script>

<template>
    <div>
        <ListToolbar
            v-model="state"
            :config="itemListConfig"
            :count="results.length"
        />
        <ListNoResults v-if="results.length === 0" />
        <!-- Placeholder cards until there's item data -->
        <div class="owner-list">
            <div
                v-for="item in results"
                :key="item"
                class="owner-card"
            >
                {{ item }}
            </div>
        </div>
    </div>
</template>

<style scoped>
.owner-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.8rem;
    padding: 1rem 1rem 2.5rem;
}
.owner-card {
    padding: 1rem 1.5rem;
    color: var(--standard-white);
    font-weight: 800;
    background: var(--dark-2);
    border: 1px solid var(--dark-5);
    border-radius: 0.5rem;
}
</style>
