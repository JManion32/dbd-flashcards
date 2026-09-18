<script setup lang="ts">
import DisplayCard from '../components/modal/GameItemModal.vue';

import { useData } from '../data/useData.ts';
const { combinedAddOns } = useData();
</script>
<template>
    <div class="display-cards-container">
        <div
            v-for="addon in combinedAddOns"
            :key="addon.id"
        >
            <DisplayCard
                :id="addon.id"
                :name="addon.name"
                :side="addon.side"
                :type="addon.type"
                :rarity="addon.rarity"
                :owner="addon.owner"
                :description="addon.description"
                :quote="addon.quote"
                :tags="addon.tags"
            />
        </div>
    </div>
</template>
<style scoped>
.display-cards-container {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    padding: 1rem;
    gap: 0.8rem;
    width: 100%;
    justify-content: center;
}
</style>
