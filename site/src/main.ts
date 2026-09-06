import { createApp } from 'vue';
import { createWebHistory, createRouter } from 'vue-router';

import HomePage from './pages/HomePage.vue';
import FlashcardPage from './pages/FlashcardPage.vue';
import PerkPage from './pages/PerkPage.vue';
import AddonPage from './pages/AddonPage.vue';

import App from './App.vue';

const routes = [
    { path: '/', component: HomePage },
    { path: '/study', component: FlashcardPage },
    { path: '/perks', component: PerkPage },
    { path: '/add-ons', component: AddonPage },
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
