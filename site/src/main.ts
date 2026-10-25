import '@fontsource-variable/inter';

import { createApp } from 'vue';
import { createWebHistory, createRouter } from 'vue-router';
import { useData } from '@/stores/useData';
import { applyPageMeta } from '@/utils/pageMeta';
import { routeMeta, type PageMeta } from '@/routeMeta';

import HomePage from '@/components/home/HomePage.vue';
import StudyPage from '@/components/study/StudyPage.vue';
import GameItemPage from '@/components/gameitem/GameItemPage.vue';

import App from '@/App.vue';

const { combinedPerks, combinedAddOns } = useData();

const routes = [
    {
        path: '/',
        component: HomePage,
        meta: routeMeta['/'],
    },
    {
        path: '/study',
        component: StudyPage,
        props: () => ({ config: history.state?.config }),
        meta: routeMeta['/study'],
    },
    {
        path: '/perks',
        component: GameItemPage,
        props: () => ({ type: 'perk', gameItems: combinedPerks.value }),
        meta: routeMeta['/perks'],
    },
    {
        path: '/add-ons',
        component: GameItemPage,
        props: () => ({ type: 'add-on', gameItems: combinedAddOns.value }),
        meta: routeMeta['/add-ons'],
    },
];

export const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior() {
        return { top: 0, behavior: 'smooth' };
    },
});

router.afterEach((to) => {
    // Unknown routes have no meta, so keep whatever is already in the head.
    if (!to.meta.title) {
        return;
    }
    applyPageMeta(to.meta as unknown as PageMeta, to.path);
});

const app = createApp(App);
app.use(router);
app.mount('#app');
