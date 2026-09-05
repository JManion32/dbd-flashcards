<script setup lang="ts">
import HomeSection from '../components/HomeSection.vue';
import TestKnowledge from '../components/TestKnowledge.vue';
</script>
<template>
    <div class="home-container">
        <HomeSection />
        <HomeSection />
        <HomeSection />
        <HomeSection />
        <TestKnowledge />
    </div>
</template>
<style scoped>
.home-container {
    margin: 2rem 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2rem;
    width: 100%;
}
</style>
