import '@fontsource-variable/inter';

import { createApp } from 'vue';
import { createWebHistory, createRouter, type RouteLocationNormalized } from 'vue-router';
import { useData } from '@/stores/useData';
import { applyPageMeta } from '@/utils/pageMeta';
import { routeMeta, type PageMeta } from '@/routeMeta';
import { StudyConfigDefault } from '@/types/studyConfig';
import { gameItemMeta } from '@/utils/gameItemSeo';
import type { GameItem } from '@/types/gameItem';

import HomePage from '@/components/home/HomePage.vue';
import StudyPage from '@/components/study/StudyPage.vue';
import GameItemPage from '@/components/gameitem/GameItemPage.vue';

import App from '@/App.vue';

const { combinedPerks, combinedAddOns } = useData();

// `/perks/agitation` is the perks page with Agitation's modal open. An id that doesn't exist
// (renamed, typo) drops back to the list rather than showing an empty page.
function gameItemRoute(path: '/perks' | '/add-ons', type: 'perk' | 'add-on', gameItems: () => GameItem[]) {
    return {
        path: `${path}/:id?`,
        component: GameItemPage,
        props: (route: RouteLocationNormalized) => ({ type, gameItems: gameItems(), openId: route.params.id }),
        meta: routeMeta[path],
        beforeEnter: (to: RouteLocationNormalized) => {
            const id = to.params.id;
            if (id && !gameItems().some((gameItem) => gameItem.id === id)) {
                return { path, query: to.query };
            }
        },
    };
}

function findOpenGameItem(route: RouteLocationNormalized) {
    const id = route.params.id;
    if (typeof id !== 'string') return undefined;
    const gameItems = route.path.startsWith('/perks') ? combinedPerks.value : combinedAddOns.value;
    return gameItems.find((gameItem) => gameItem.id === id);
}

const routes = [
    {
        path: '/',
        component: HomePage,
        meta: routeMeta['/'],
    },
    {
        path: '/study',
        component: StudyPage,
        // Fill in defaults so a config saved in history before a field existed still works.
        props: () => ({ config: history.state?.config && { ...StudyConfigDefault, ...history.state.config } }),
        meta: routeMeta['/study'],
    },
    gameItemRoute('/perks', 'perk', () => combinedPerks.value),
    gameItemRoute('/add-ons', 'add-on', () => combinedAddOns.value),
];

export const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior(to, from, savedPosition) {
        // Opening or closing an item's modal changes the URL, but the list behind it shouldn't move
        if (to.matched[0] && to.matched[0] === from.matched[0] && to.params.id !== from.params.id) {
            return false;
        }
        if (savedPosition) {
            return savedPosition;
        }
        return { top: 0, behavior: 'smooth' };
    },
});

router.afterEach((to) => {
    // Unknown routes have no meta, so keep whatever is already in the head.
    if (!to.meta.title) {
        return;
    }
    // An open perk or add-on is its own page as far as search engines are concerned
    const openGameItem = findOpenGameItem(to);
    applyPageMeta(openGameItem ? gameItemMeta(openGameItem) : (to.meta as unknown as PageMeta), to.path);
});

const app = createApp(App);
app.use(router);
app.mount('#app');
