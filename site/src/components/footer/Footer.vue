<script setup lang="ts">
import '@/styles/footer.css';
import AboutModal from '@/components/footer/AboutModal.vue';
import PrivacyPolicyModal from '@/components/footer/PrivacyPolicyModal.vue';
import WhatsNewModal from '@/components/footer/WhatsNewModal.vue';
import twitchLogo from '@/assets/twitch-logo.webp';
</script>
<template>
    <div class="footer-container">
        <div class="footer-links-container">
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
        <a
            class="twitch-link-container footer-link"
            href="https://www.twitch.tv/the_jman32"
            target="_blank"
        >
            <span>Made with <span style="color: #b01e28">❤︎</span> by</span>
            <img
                class="twitch-logo"
                :src="twitchLogo"
            />
            <span> The_JMan32 </span>
        </a>
    </div>
</template>
