import { createApp } from 'vue';
import { createWebHistory, createRouter } from 'vue-router';
import { useData } from '@/data/useData.ts';

import HomePage from '@/components/home/HomePage.vue';
import FlashcardPage from '@/components/flashcard/FlashcardPage.vue';
import GameItemPage from '@/components/gameitem/GameItemPage.vue';

import App from '@/App.vue';

const { combinedPerks, combinedAddOns, killerPerks, killerAddOns, survivorPerks, survivorAddOns } = useData();

const routes = [
    {
        path: '/',
        component: HomePage,
        props: () => ({
            killerPerks: killerPerks,
            killerAddOns: killerAddOns,
            survivorPerks: survivorPerks,
            survivorAddOns: survivorAddOns,
        }),
    },
    { path: '/study', component: FlashcardPage },
    {
        path: '/perks',
        component: GameItemPage,
        props: () => ({ type: 'perks', gameItems: combinedPerks.value }),
    },
    {
        path: '/add-ons',
        component: GameItemPage,
        props: () => ({ type: 'add-ons', gameItems: combinedAddOns.value }),
    },
];

export const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior() {
        return { top: 0, behavior: 'smooth' };
    },
});

const app = createApp(App);
app.use(router);
app.mount('#app');
