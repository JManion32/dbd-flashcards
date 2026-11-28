<script setup lang="ts">
import '@/styles/colors.css';
import '@/styles/scaling.css';
import '@/styles/theme.css';
import '@/styles/base.css';

import Header from '@/components/Header.vue';
import Footer from '@/components/footer/Footer.vue';
import UpdatePrompt from '@/components/UpdatePrompt.vue';
</script>

<template>
    <Header />
    <main>
        <!-- Keyed by route record: /perks and /add-ons share GameItemPage, so without this the router
             reuses one instance and keeps the old list's state. /perks/:id stays the same record. -->
        <RouterView v-slot="{ Component, route }">
            <component
                :is="Component"
                :key="route.matched[0]?.path"
            />
        </RouterView>
    </main>
    <Footer />
    <UpdatePrompt />
</template>
