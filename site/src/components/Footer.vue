<script setup lang="ts">
import twitchLogo from '../assets/twitch-logo.webp';
</script>
<template>
    <div class="footer-container">
        <div class="footer-links-container">
            <a> About </a>
            <span>•</span>
            <a> Privacy Policy </a>
            <span>•</span>
            <a> What's New? </a>
            <span>•</span>
            <a
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
                href="https://www.twitch.tv/the_jman32"
                target="_blank"
                >The_JMan32</a
            >
        </div>
    </div>
</template>
<style scoped>
.footer-container {
    display: flex;
    align-items: center;
    width: 100%;
    height: 2rem;
    padding: 0.5rem 1rem;

    background: var(--header-bg);
}
.footer-links-container {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 1rem;
    color: var(--header-text);
}
.footer-container a {
    cursor: pointer;
    font-weight: 800;
    color: #999;
    text-decoration: none;
}
.footer-container a:hover {
    color: var(--standard-white);
    text-decoration: underline;
}
.twitch-link-container {
    display: flex;
    align-items: center;
    margin-left: auto;

    color: var(--standard-white);
    font-weight: 800;
}
.twitch-link-container {
    color: #999;
}
.twitch-logo {
    height: 1rem;
    margin: 0 0.25rem 0 0.5rem;
}
</style>
