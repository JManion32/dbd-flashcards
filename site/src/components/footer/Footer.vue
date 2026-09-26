<script setup lang="ts">
import '@/styles/footer.css';
import AboutModal from '@/components/footer/AboutModal.vue';
import HelpModal from '@/components/footer/HelpModal.vue';
import PrivacyPolicyModal from '@/components/footer/PrivacyPolicyModal.vue';
import WhatsNewModal from '@/components/footer/WhatsNewModal.vue';
import TwitchLink from '@/components/footer/TwitchLink.vue';

import { useRoute } from 'vue-router';

const route = useRoute();
</script>
<template>
    <div
        class="footer-container"
        :style="route.path === '/study' ? { flexDirection: 'row', padding: '0.5rem 1rem' } : {}"
    >
        <div
            v-if="route.path !== '/study'"
            class="footer-links-container"
        >
            <AboutModal />
            <span>•</span>
            <PrivacyPolicyModal />
            <span>•</span>
            <WhatsNewModal />
            <span>•</span>
            <a
                class="footer-link"
                href="https://github.com/JManion32/dbd-flashcards"
                target="_blank"
            >
                GitHub
            </a>
        </div>
        <HelpModal v-if="route.path === '/study'" />
        <TwitchLink />
    </div>
</template>
