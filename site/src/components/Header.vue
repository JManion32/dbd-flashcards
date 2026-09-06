<script setup lang="ts">
import siteLogo from '../assets/logo-512.png';
</script>

<template>
    <div class="header-container">
        <div class="header-home-container">
            <img
                :src="siteLogo"
                class="site-logo"
            />
            <!--<h1 class="header-header">DBD Flashcards</h1>-->
            <div>
                
            </div>
        </div>
    </div>
</template>

<style scoped>
.header-container {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 10;

    background: var(--header-bg);
    width: 100%;
    height: 4rem;
    padding: 0.5rem 1rem;

    display: flex;
    flex-direction: row;
    align-items: center;
}
.header-home-container {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 1rem;
}
.header-header {
    color: var(--standard-white);
    margin: 0;
}
.site-logo {
    height: 3rem;
}
</style>
