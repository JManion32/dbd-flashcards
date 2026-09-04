<script setup lang="ts">
import siteBanner from '../assets/site-banner.png';
</script>

<template>
    <div class="header-container">
        <img :src="siteBanner" class="site-banner"/>
    </div>
</template>

<style scoped>
    .header-container {
        background: rgb(29, 29, 29);
        width: 100%;
        height: 6rem;
        padding: 0.5rem;
    }
    .site-banner {
        height: 5rem;
    }
</style>