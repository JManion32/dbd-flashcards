<script setup lang="ts">
import HomeBanner from '../components/HomeBanner.vue';
import HomeSection from '../components/HomeSection.vue';
import TestKnowledge from '../components/TestKnowledge.vue';
</script>
<template>
    <div class="home-container">
        <HomeBanner/>
        <HomeSection
          title="Survivor Perks"
          id="survivor-perks"
        />
        <HomeSection
          title="Survivor Add-ons"
          id="survivor-addons"
        />
        <HomeSection
          title="Killer Perks"
          id="killer-perks"
        />
        <HomeSection
          title="Killer Add-ons"
          id="killer-addons"
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
