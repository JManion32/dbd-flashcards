import '@fontsource-variable/inter';

import { createApp } from 'vue';
import { createWebHistory, createRouter, type RouteLocationNormalized } from 'vue-router';
import { useData } from '@/stores/useData';
import { applyPageMeta } from '@/utils/pageMeta';
import { routeMeta, type PageMeta } from '@/routeMeta';
import { StudyConfigDefault } from '@/types/studyConfig';
import { gameItemMeta } from '@/utils/gameItemSeo';
import { STATUS_EFFECTS_PATH, statusEffectMeta } from '@/utils/statusEffectSeo';
import type { GameItem } from '@/types/gameItem';

import HomePage from '@/components/home/HomePage.vue';
import StudyPage from '@/components/study/StudyPage.vue';
import GameItemPage from '@/components/gameitem/GameItemPage.vue';
import StatusEffectPage from '@/components/status-effect/StatusEffectPage.vue';
import KillersPage from '@/components/characters/KillersPage.vue';
import SurvivorsPage from '@/components/characters/SurvivorsPage.vue';

import App from '@/App.vue';

const { combinedPerks, combinedAddOns, statusEffects } = useData();

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

function findOpenStatusEffect(route: RouteLocationNormalized) {
    const id = route.params.id;
    if (typeof id !== 'string' || !route.path.startsWith(STATUS_EFFECTS_PATH)) return undefined;
    return statusEffects.find((statusEffect) => statusEffect.id === id);
}

function findOpenGameItem(route: RouteLocationNormalized) {
    const id = route.params.id;
    if (typeof id !== 'string') return undefined;
    if (!route.path.startsWith('/perks') && !route.path.startsWith('/add-ons')) return undefined;
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
    {
        path: '/killers',
        component: KillersPage,
        meta: routeMeta['/killers'],
    },
    {
        path: '/survivors',
        component: SurvivorsPage,
        meta: routeMeta['/survivors'],
    },
    gameItemRoute('/perks', 'perk', () => combinedPerks.value),
    gameItemRoute('/add-ons', 'add-on', () => combinedAddOns.value),
    // `/status-effects/haste` is the list scrolled to Haste, highlighted. An unknown id drops back to the list.
    {
        path: `${STATUS_EFFECTS_PATH}/:id?`,
        component: StatusEffectPage,
        props: (route: RouteLocationNormalized) => ({ openId: route.params.id }),
        meta: routeMeta[STATUS_EFFECTS_PATH],
        beforeEnter: (to: RouteLocationNormalized) => {
            const id = to.params.id;
            if (id && !statusEffects.some((statusEffect) => statusEffect.id === id)) {
                return { path: STATUS_EFFECTS_PATH, query: to.query };
            }
        },
    },
];

export const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior(to, from, savedPosition) {
        // StatusEffectPage scrolls to the named status effect itself, once its card exists
        if (findOpenStatusEffect(to)) {
            return false;
        }
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
    // An open perk, add-on, or status effect is its own page as far as search engines are concerned
    const openGameItem = findOpenGameItem(to);
    const openStatusEffect = findOpenStatusEffect(to);
    const meta = openGameItem
        ? gameItemMeta(openGameItem)
        : openStatusEffect
          ? statusEffectMeta(openStatusEffect)
          : (to.meta as unknown as PageMeta);
    applyPageMeta(meta, to.path);
});

const app = createApp(App);
app.use(router);
app.mount('#app');
