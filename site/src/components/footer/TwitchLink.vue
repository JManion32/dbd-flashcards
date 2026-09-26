<script setup lang="ts">
import twitchLogo from '@/assets/twitch-logo.webp';
</script>
<template>
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
</template>
<style scoped></style>
