<script setup lang="ts">
import DisplayCard from '../components/modal/DisplayCardModal.vue';

import { useData } from '../data/useData.ts';
const { combinedPerks } = useData();
</script>
<template>
    <div class="display-cards-container">
        <div
            v-for="perk in combinedPerks"
            :key="perk.name"
        >
            <DisplayCard
                :name="perk.name"
                :type="perk.type"
                :character="perk.character"
                :description="perk.description"
                :tags="perk.tags"
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
