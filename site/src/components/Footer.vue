<script setup lang="ts">
import '../styles/footer.css';
import AboutModal from './modal/AboutModal.vue';
import PrivacyPolicyModal from './modal/PrivacyPolicyModal.vue';
import WhatsNewModal from './modal/WhatsNewModal.vue';
import twitchLogo from '../assets/twitch-logo.webp';
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
        <div class="twitch-link-container">
            <span>Made with <span style="color: #b01e28">❤︎</span> by</span>
            <img
                class="twitch-logo"
                :src="twitchLogo"
            />
            <a
                class="footer-link"
                href="https://www.twitch.tv/the_jman32"
                target="_blank"
                >The_JMan32</a
            >
        </div>
    </div>
</template>
