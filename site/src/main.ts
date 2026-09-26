import { createApp } from 'vue';
import { createWebHistory, createRouter } from 'vue-router';
import { useData } from '@/data/useData.ts';

import HomePage from '@/components/home/HomePage.vue';
import StudyPage from '@/components/study/StudyPage.vue';
import GameItemPage from '@/components/gameitem/GameItemPage.vue';

import App from '@/App.vue';

const { combinedPerks, combinedAddOns } = useData();

const routes = [
    {
        path: '/',
        component: HomePage,
    },
    { path: '/study', component: StudyPage, props: () => ({ config: history.state?.config }) },
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
