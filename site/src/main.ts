import '@fontsource-variable/inter';

import { createApp } from 'vue';
import { createWebHistory, createRouter } from 'vue-router';
import { useData } from '@/stores/useData';
import { applyPageMeta, type PageMeta } from '@/utils/pageMeta';

import HomePage from '@/components/home/HomePage.vue';
import StudyPage from '@/components/study/StudyPage.vue';
import GameItemPage from '@/components/gameitem/GameItemPage.vue';

import App from '@/App.vue';

const { combinedPerks, combinedAddOns } = useData();

const routes = [
    {
        path: '/',
        component: HomePage,
        meta: {
            title: 'DBD Flashcards | Dead by Daylight Perk & Add-On Study Tool',
            description:
                'Learn every Dead by Daylight perk and add-on with free flashcards. Browse Killer and Survivor perks and add-ons, then quiz yourself to test your knowledge.',
        },
    },
    {
        path: '/study',
        component: StudyPage,
        props: () => ({ config: history.state?.config }),
        meta: {
            title: 'Study | DBD Flashcards',
            description: 'Quiz yourself on Dead by Daylight perks and add-ons with flashcards.',
            noindex: true,
        },
    },
    {
        path: '/perks',
        component: GameItemPage,
        props: () => ({ type: 'perks', gameItems: combinedPerks.value }),
        meta: {
            title: 'All Dead by Daylight Perks | DBD Flashcards',
            description:
                'Browse every Killer and Survivor perk in Dead by Daylight, with descriptions and tags. Filter by character and study them as flashcards.',
        },
    },
    {
        path: '/add-ons',
        component: GameItemPage,
        props: () => ({ type: 'add-ons', gameItems: combinedAddOns.value }),
        meta: {
            title: 'All Dead by Daylight Add-Ons | DBD Flashcards',
            description:
                'Browse every Killer and Survivor add-on in Dead by Daylight, with rarities and effects. Filter by killer or item and study them as flashcards.',
        },
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
