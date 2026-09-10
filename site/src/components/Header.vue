<script setup lang="ts">
import siteLogo from '../assets/logo-512.png';
import StartStudyModal from '../components/modal/StartStudyModal.vue';
</script>

<template>
    <div class="header-filler-container" />
    <div class="header-container">
        <div class="header-home-container">
            <RouterLink to="/">
                <img
                    :src="siteLogo"
                    class="site-logo"
                    to="/"
                />
            </RouterLink>
            <!--<h1 class="header-header">DBD Flashcards</h1>-->
            <nav class="nav-link-container">
                <RouterLink
                    class="nav-link"
                    to="/perks"
                >
                    Perks
                </RouterLink>
                <RouterLink
                    class="nav-link"
                    to="/add-ons"
                >
                    Add-Ons
                </RouterLink>
            </nav>
        </div>
        <StartStudyModal />
    </div>
</template>

<style scoped>
.header-filler-container {
    width: 100%;
    height: 4rem;
}
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
    height: 2.7rem;
    transition: var(--site-transition);
}
.site-logo:hover {
    scale: 1.1;
    cursor: pointer;
}
.nav-link-container {
    display: flex;
    flex-direction: row;
    gap: 2rem;
    margin-left: 1.5rem;
}
.nav-link {
    text-decoration: none;
    font-size: 1.2rem;
    color: var(--inactive-text);
    font-weight: 800;
    transition: var(--site-transition);
    padding: 0.5rem 1rem;
    border-radius: 1rem;
}
.nav-link:hover {
    color: var(--standard-white);
    background: var(--nav-link-hover-bg);
    text-shadow: var(--site-text-shadow);
}
.nav-link.router-link-exact-active {
    color: var(--standard-white);
    background: var(--nav-link-active-bg);
    text-shadow: var(--site-text-shadow);
}
</style>
