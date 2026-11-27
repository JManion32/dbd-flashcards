<script setup lang="ts">
import Sidebar from '@/components/Sidebar.vue';
import StartStudyModal from '@/components/study/StartStudyModal.vue';
import { useStudy } from '@/stores/useStudy';

import { useRoute } from 'vue-router';
const route = useRoute();

const { studyConfig } = useStudy();
</script>

<template>
    <div class="header-filler-container" />
    <div class="header-container">
        <Sidebar />
        <StartStudyModal v-if="route.path !== '/study'" />
        <p
            v-if="route.path === '/study' && studyConfig"
            class="study-info"
        >
            {{ studyConfig.side }} {{ studyConfig.type }}s ({{ studyConfig.preset }})
        </p>
    </div>
</template>

<style scoped>
.header-filler-container {
    width: 100%;
    height: 4rem;
    flex-shrink: 0;
}
.header-container {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 10;

    background: var(--header-bg);
    width: 100%;
    height: 4rem;
    padding: 0.5rem 1rem;

    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    border-radius: 0.15rem;
}
.header-header {
    color: var(--standard-white);
    margin: 0;
}
.study-info {
    color: var(--standard-white);
    margin: 0;
    font-weight: 800;
    font-size: 1.05rem;
}
</style>
