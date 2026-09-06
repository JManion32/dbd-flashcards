<script setup lang="ts">
import HomeBanner from '../components/HomeBanner.vue';
import HomeSection from '../components/HomeSection.vue';
import TestKnowledge from '../components/TestKnowledge.vue';
</script>
<template>
    <div class="home-container">
        <HomeBanner />
        <HomeSection
            id="survivor-perks"
            title="Survivor Perks"
        />
        <HomeSection
            id="survivor-addons"
            title="Survivor Add-ons"
        />
        <HomeSection
            id="killer-perks"
            title="Killer Perks"
        />
        <HomeSection
            id="killer-addons"
            title="Killer Add-ons"
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
