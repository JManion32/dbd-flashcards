<script setup lang="ts">
import bannerBg from '../assets/banner-bg.png';
</script>

<template>
    <section class="home-banner">
        <img
            :src="bannerBg"
            class="banner-bg"
            alt=""
        />

        <div class="banner-content">
            <h1 class="banner-header">DBD Flashcards</h1>

            <p class="banner-desc">
                An unofficial Dead by Daylight study tool!
            </p>
        </div>

        <div class="home-h-links">
            <a href="#survivor-perks">Survivor Perks</a>
            <a href="#survivor-addons">Survivor Addons</a>
            <a href="#killer-perks">Killer Perks</a>
            <a href="#killer-addons">Killer Addons</a>
        </div>
    </section>
</template>

<style scoped>
.home-banner {
    position: relative;

    width: 100%;
    height: 24rem;
    padding: 1rem;
    margin-top: 4rem;

    display: flex;
    align-items: center;
    justify-content: center;

    overflow: hidden;
    background: #111;
}

.banner-bg {
    position: absolute;
    inset: 0;

    width: 100%;
    height: 100%;

    object-fit: cover;
    object-position: center;

    filter: grayscale(1);
}

.home-banner::after {
    content: '';

    position: absolute;
    inset: 0;

    background:
        linear-gradient(
            to bottom,
            rgba(17, 17, 17, 0.1),
            rgba(17, 17, 17, 0.65)
        ),
        radial-gradient(
            circle at center,
            transparent 30%,
            rgba(0, 0, 0, 0.6) 100%
        );

    pointer-events: none;
}

.banner-content {
    position: relative;
    z-index: 1;

    display: flex;
    flex-direction: column;
    align-items: center;

    text-align: center;
    margin-bottom: 3rem;
}

.banner-header {
    margin: 0;
    color: var(--standard-white);
    font-size: 6rem;
    font-weight: 900;
}

.banner-desc {
    margin: 0;
    color: var(--standard-white);
    font-size: 1.1rem;
    font-weight: 800;
    font-style: italic;
}

.home-h-links {
    position: absolute;
    bottom: 2rem;
    left: 50%;
    z-index: 1;

    display: flex;
    gap: 3rem;

    font-size: 1.1rem;

    transform: translateX(-50%);
    white-space: nowrap;
}

.home-h-links a {
    color: #bbbbbb;
    font-weight: 800;
    text-decoration: none;
}

.home-h-links a:hover {
    color: var(--standard-white);
    text-decoration: underline;

    cursor: pointer;
}
</style>