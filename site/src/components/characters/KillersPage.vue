<script setup lang="ts">
import ListToolbar from '@/components/list/ListToolbar.vue';
import ListNoResults from '@/components/list/ListNoResults.vue';

import { useData } from '@/stores/useData';
import { useListControls } from '@/composables/useListControls';
import { killerListConfig } from '@/utils/listConfigs/characters';

// Universal owns shared add-ons and perks; it isn't a Killer
const killers = useData().killers.filter((killer) => killer !== 'Universal');
const { state, results } = useListControls(killers, killerListConfig);
</script>

<template>
    <div>
        <ListToolbar
            v-model="state"
            :config="killerListConfig"
            :count="results.length"
        />
        <ListNoResults v-if="results.length === 0" />
        <!-- Placeholder cards until there's character data -->
        <div class="character-list">
            <div
                v-for="killer in results"
                :key="killer"
                class="character-card"
            >
                {{ killer }}
            </div>
        </div>
    </div>
</template>

<style scoped>
.character-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.8rem;
    padding: 1rem 1rem 2.5rem;
}
.character-card {
    padding: 1rem 1.5rem;
    color: var(--standard-white);
    font-weight: 800;
    background: var(--dark-2);
    border: 1px solid var(--dark-5);
    border-radius: 0.5rem;
}
</style>
