<script setup lang="ts">
import HomeBanner from '@/components/home/HomeBanner.vue';
import HomeAbout from '@/components/home/HomeAbout.vue';
import HomeSection from '@/components/home/HomeSection.vue';
import TestKnowledge from '@/components/home/TestKnowledge.vue';
import { useData } from '@/stores/useData';

const { killerPerks, killerAddOns, survivorPerks, survivorAddOns } = useData();
</script>
<template>
    <div class="home-container">
        <HomeBanner />
        <HomeSection
            id="killer-perks"
            title="Killer Perks"
            side="Killer"
            type="perk"
            :game-items="killerPerks"
        />
        <hr class="home-bottom-divider" />
        <HomeSection
            id="killer-addons"
            title="Killer Add-Ons"
            side="Killer"
            type="add-on"
            :game-items="killerAddOns"
        />
        <hr class="home-bottom-divider" />
        <HomeSection
            id="survivor-perks"
            title="Survivor Perks"
            side="Survivor"
            type="perk"
            :game-items="survivorPerks"
        />
        <hr class="home-bottom-divider" />
        <HomeSection
            id="survivor-addons"
            title="Survivor Add-Ons"
            side="Survivor"
            type="add-on"
            :game-items="survivorAddOns"
        />
        <hr class="home-bottom-divider" />
        <TestKnowledge />
        <hr class="home-bottom-divider" />
        <HomeAbout id="home-about" />
    </div>
</template>
<style scoped>
.home-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    gap: 2rem;
}
.home-bottom-divider {
    border: none;
    border-bottom: 1px solid var(--dark-4);
    /* Match the content above/below instead of spanning the page */
    width: var(--home-section-width);
    margin: 0;
}
</style>
