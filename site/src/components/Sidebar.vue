<script setup lang="ts">
import StartStudyModal from '@/components/study/StartStudyModal.vue';
import { Menu } from 'lucide-vue-next';
import { computed, ref } from 'vue';
import siteLogo from '/favicon-192.png';

import { useRoute } from 'vue-router';
const route = useRoute();

// Keyed by the first part of the path, so /perks/agitation still shows "Perks"
const pageTitles: Record<string, string> = {
    '/': 'Home',
    '/killers': 'Killers',
    '/survivors': 'Survivors',
    '/items': 'Items',
    '/perks': 'Perks',
    '/add-ons': 'Add-Ons',
    '/status-effects': 'Status Effects',
    '/study': 'Study',
};
const pageTitle = computed(() => pageTitles['/' + route.path.split('/')[1]] ?? '');

const open = ref(false);

function close() {
    open.value = false;
}
</script>

<template>
    <!-- The page title is part of the button, so clicking either opens the menu -->
    <button
        class="menu-btn"
        aria-label="Open menu"
        @click="open = true"
    >
        <Menu :size="28" />
        <span
            v-if="pageTitle"
            class="page-title"
        >
            {{ pageTitle }}
        </span>
    </button>
    <Transition name="sidebar-fade">
        <div
            v-if="open"
            class="sidebar-backdrop"
            @click="close"
        />
    </Transition>
    <Transition name="sidebar-slide">
        <div
            v-show="open"
            class="sidebar"
        >
            <div class="sidebar-header-container">
                <hr />
                <img :src="siteLogo" />
                <span>DBD Flashcards</span>
                <hr />
            </div>
            <nav class="sidebar-nav">
                <RouterLink
                    class="sidebar-link"
                    to="/"
                    @click="close"
                >
                    Home
                </RouterLink>
                <RouterLink
                    class="sidebar-link"
                    to="/killers"
                    @click="close"
                >
                    Killers
                </RouterLink>
                <RouterLink
                    class="sidebar-link"
                    to="/survivors"
                    @click="close"
                >
                    Survivors
                </RouterLink>
                <RouterLink
                    class="sidebar-link"
                    to="/items"
                    @click="close"
                >
                    Items
                </RouterLink>
                <RouterLink
                    class="sidebar-link"
                    to="/perks"
                    @click="close"
                >
                    Perks
                </RouterLink>
                <RouterLink
                    class="sidebar-link"
                    to="/add-ons"
                    @click="close"
                >
                    Add-Ons
                </RouterLink>
                <RouterLink
                    class="sidebar-link"
                    to="/status-effects"
                    @click="close"
                >
                    Status Effects
                </RouterLink>
            </nav>
            <div
                class="sidebar-study"
                @click="close"
            >
                <StartStudyModal
                    v-if="route.path !== '/study'"
                    sidebar
                />
            </div>
        </div>
    </Transition>
</template>

<style scoped>
.menu-btn {
    display: flex;
    align-items: center;
    gap: 1.25rem;
    padding: 0.4rem 0.75rem 0.4rem 0.4rem;
    border: none;
    border-radius: 0.5rem;
    background: none;
    color: var(--standard-white);
    cursor: pointer;
    transition: var(--site-transition);

    &:hover {
        background: var(--dark-2);
    }
}
.page-title {
    font-size: 1.3rem;
    font-weight: 900;
    text-shadow: var(--small-text-glow);
}
.sidebar-backdrop {
    position: fixed;
    inset: 0;
    z-index: 20;
    background: rgb(0 0 0 / 60%);
}
.sidebar {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    z-index: 21;
    width: 24rem;
    height: 98%;
    margin: auto 0;
    padding: 3.5rem 2rem;
    background: var(--header-bg);
    border: 2px solid var(--dark-3);
    border-radius: 0 2rem 2rem 0;
    display: flex;
    flex-direction: column;
}
.sidebar-header-container {
    display: flex;
    flex-direction: row;
    margin-bottom: 2rem;
    align-items: center;
}
.sidebar-header-container span {
    font-size: 1rem;
    font-weight: 800;
    color: var(--inactive-text);
    margin-left: 0.5rem;
}
.sidebar-header-container img {
    height: 1.5rem;
}
.sidebar-header-container hr {
    border: none;
    border-bottom: 0.75px solid var(--inactive-text);
    width: 4rem;
}
.sidebar-content-container {
    display: flex;
    flex-direction: column;
    height: 100%;
}
/* Pushed to the bottom of the sidebar by the auto top margin */
.sidebar-study {
    margin-top: auto;
    display: flex;
    justify-content: center;
}
.sidebar-nav {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}
.sidebar-link {
    text-decoration: none;
    font-size: 1.75rem;
    color: var(--inactive-text);
    font-weight: 800;
    transition: var(--site-transition);
    padding: 0.75rem 1rem;
    border-radius: 1rem;
    border: 1px solid transparent;

    &:hover {
        color: var(--standard-white);
        text-shadow: var(--small-text-shadow);
        background: var(--dark-3);
    }

    &.router-link-active {
        color: var(--standard-white);
        background: color-mix(in srgb, var(--standard-gold) 10%, transparent);
        border-color: color-mix(in srgb, var(--standard-gold) 60%, transparent);
    }
}

.sidebar-fade-enter-active,
.sidebar-fade-leave-active {
    transition: opacity 0.3s ease;
}
.sidebar-fade-enter-from,
.sidebar-fade-leave-to {
    opacity: 0;
}
.sidebar-slide-enter-active,
.sidebar-slide-leave-active {
    transition: transform 0.3s ease;
}
.sidebar-slide-enter-from,
.sidebar-slide-leave-to {
    transform: translateX(-100%);
}
</style>
