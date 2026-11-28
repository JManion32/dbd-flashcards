<script setup lang="ts">
import ListToolbar from '@/components/list/ListToolbar.vue';
import ListNoResults from '@/components/list/ListNoResults.vue';
import OwnerDisplay from '@/components/owners/OwnerDisplay.vue';

import { useData } from '@/stores/useData';
import { useListControls } from '@/composables/useListControls';
import { itemListConfig } from '@/utils/listConfigs/owners';
import itemDescriptions from '@/data/item-descriptions.json';

// items.json is just the item types (Flashlight, Toolbox, ...); there's no Universal entry
const { items, survivorItems, survivorAddOns } = useData();
const { state, results } = useListControls(items, itemListConfig);

const itemsOf = (owner: string) => survivorItems.filter((item) => item.owner === owner);
// What each item type is in general; the item rows below give each variant's specifics
const descriptionOf = (owner: string): string | undefined => (itemDescriptions as Record<string, string>)[owner];
const addOnsOf = (owner: string) => survivorAddOns.value.filter((addOn) => addOn.owner === owner);
</script>

<template>
    <div>
        <ListToolbar
            v-model="state"
            :config="itemListConfig"
            :count="results.length"
        />
        <ListNoResults v-if="results.length === 0" />
        <div class="owner-list">
            <OwnerDisplay
                v-for="item in results"
                :key="item"
                :name="item"
                :description="descriptionOf(item)"
                main-title="Items"
                :main-items="itemsOf(item)"
                :add-ons="addOnsOf(item)"
            />
        </div>
    </div>
</template>

<style scoped>
.owner-list {
    display: flex;
    flex-direction: column;
    gap: 3rem;
    padding: 1rem 1rem 2.5rem;
    align-items: center;
}
</style>
