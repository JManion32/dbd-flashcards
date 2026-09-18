<script setup lang="ts">
import DisplayCard from '../components/gameitem/GameItemModal.vue';

import { useData } from '../data/useData.ts';
const { combinedAddOns } = useData();
</script>
<template>
    <div class="display-cards-container">
        <div
            v-for="addon in combinedAddOns"
            :key="addon.id"
        >
            <DisplayCard :game-item="addon" />
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
