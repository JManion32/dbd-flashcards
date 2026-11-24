<script setup lang="ts">
import Sidebar from '@/components/Sidebar.vue';
import StartStudyModal from '@/components/study/StartStudyModal.vue';
import { useStudy } from '@/stores/useStudy';

import { computed } from 'vue';
import { useRoute } from 'vue-router';
const route = useRoute();

const { studyConfig } = useStudy();

// Keyed by the first part of the path, so /perks/agitation still shows "Perks"
const pageTitles: Record<string, string> = {
    '/': 'Home',
    '/killers': 'Killers',
    '/survivors': 'Survivors',
    '/perks': 'Perks',
    '/add-ons': 'Add-Ons',
    '/status-effects': 'Status Effects',
    '/study': 'Study',
};
const pageTitle = computed(() => pageTitles['/' + route.path.split('/')[1]] ?? '');
</script>

<template>
    <div class="header-filler-container" />
    <div class="header-container">
        <div class="header-home-container">
            <Sidebar />
            <p class="page-title">
                {{ pageTitle }}
            </p>
        </div>
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
}
.header-home-container {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 0.75rem;
}
.header-header {
    color: var(--standard-white);
    margin: 0;
}
.page-title {
    color: var(--standard-white);
    margin: 0;
    font-size: 1.3rem;
    font-weight: 900;
    text-shadow: var(--small-text-glow);
}
.study-info {
    color: var(--standard-white);
    margin: 0;
    font-weight: 800;
    font-size: 1.05rem;
}
</style>
