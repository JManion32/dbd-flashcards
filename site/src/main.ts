import { createApp } from 'vue';
import { createWebHistory, createRouter } from 'vue-router';

import HomePage from './pages/HomePage.vue';
import FlashcardPage from './pages/FlashcardPage.vue';

import App from './App.vue';

const routes = [
    { path: '/', component: HomePage },
    { path: '/study', component: FlashcardPage },
];

export const router = createRouter({
    history: createWebHistory(),
    routes,
});

const app = createApp(App);
app.use(router);
app.mount('#app');
