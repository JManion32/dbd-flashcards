<script setup lang="ts">
import HomeBanner from '@/components/home/HomeBanner.vue';
import HomeSection from '@/components/home/HomeSection.vue';
import TestKnowledge from '@/components/home/TestKnowledge.vue';
import { useData } from '@/data/useData.ts';

const { killerPerks, killerAddOns, survivorPerks, survivorAddOns } = useData();
</script>
<template>
    <div class="home-container">
        <HomeBanner />
        <HomeSection
            id="killer-perks"
            title="Killer Perks"
            type="perks"
            :game-items="killerPerks"
        />
        <HomeSection
            id="killer-addons"
            title="Killer Add-Ons"
            type="add-ons"
            :game-items="killerAddOns"
        />
        <HomeSection
            id="survivor-perks"
            title="Survivor Perks"
            type="perks"
            :game-items="survivorPerks"
        />
        <HomeSection
            id="survivor-addons"
            title="Survivor Add-Ons"
            type="add-ons"
            :game-items="survivorAddOns"
        />
        <TestKnowledge />
    </div>
</template>
<style scoped>
.home-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
}
</style>
