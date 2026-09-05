<script setup lang="ts">
import siteBanner from '../assets/site-banner.png';
</script>

<template>
    <div class="header-container">
        <img :src="siteBanner" class="site-banner" />
        <button class="start-btn">Study</button>
    </div>
</template>

<style scoped>
.header-container {
    background: #1d1d1d;
    width: 100%;
    height: 5rem;
    padding: 0.5rem 1rem;

    display: flex;
    flex-direction: row;
    align-items: center;
}
.site-banner {
    height: 4rem;
}
.start-btn {
    margin-left: auto;
    height: 2.5rem;
    padding: 0.25rem 0.75rem;
    font-size: 1.1rem;

    border: solid 1px white;
    border-radius: 0.75rem;
    background: transparent;
    color: white;
    font-weight: bold;
    cursor: pointer;
}
</style>
