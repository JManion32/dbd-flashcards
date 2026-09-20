<script setup lang="ts">
import HomeBanner from '@/components/home/HomeBanner.vue';
import HomeSection from '@/components/home/HomeSection.vue';
import TestKnowledge from '@/components/home/TestKnowledge.vue';

import type { GameItem } from '@/types/GameItem';

const props = defineProps<{
    killerPerks: GameItem[];
    killerAddOns: GameItem[];
    survivorPerks: GameItem[];
    survivorAddOns: GameItem[];
}>();
</script>
<template>
    <div class="home-container">
        <HomeBanner />
        <HomeSection
            id="killer-perks"
            title="Killer Perks"
            :game-items="props.killerPerks"
        />
        <HomeSection
            id="killer-addons"
            title="Killer Add-ons"
            :game-items="props.killerAddOns"
        />
        <HomeSection
            id="survivor-perks"
            title="Survivor Perks"
            :game-items="props.survivorPerks"
        />
        <HomeSection
            id="survivor-addons"
            title="Survivor Add-ons"
            :game-items="props.survivorAddOns"
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
