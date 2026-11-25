<script setup lang="ts">
import ListToolbar from '@/components/list/ListToolbar.vue';
import ListNoResults from '@/components/list/ListNoResults.vue';

import { useData } from '@/stores/useData';
import { useListControls } from '@/composables/useListControls';
import { survivorListConfig } from '@/utils/listConfigs/owners';

// Universal owns shared add-ons and perks; it isn't a Survivor
const survivors = useData().survivors.filter((survivor) => survivor !== 'Universal');
const { state, results } = useListControls(survivors, survivorListConfig);
</script>

<template>
    <div>
        <ListToolbar
            v-model="state"
            :config="survivorListConfig"
            :count="results.length"
        />
        <ListNoResults v-if="results.length === 0" />
        <!-- Placeholder cards until there's owner data -->
        <div class="owner-list">
            <div
                v-for="survivor in results"
                :key="survivor"
                class="owner-card"
            >
                {{ survivor }}
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
