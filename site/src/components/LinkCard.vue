<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
    href: string;
    img: string;
    title: string;
    desc: string;
    color: string;
}>();

const backgroundColor = computed(() => `${props.color}12`);
</script>

<template>
    <a
        :href="href"
        target="_blank"
        rel="noopener noreferrer"
        class="link-card"
        :style="{
            '--link-color': color,
            '--link-bg-color': backgroundColor,
        }"
    >
        <img
            class="link-card-img"
            :src="img"
            :alt="title"
        />
        <div class="link-card-content">
            <p class="link-card-title">{{ title }}</p>
            <p class="link-card-desc">{{ desc }}</p>
        </div>
    </a>
</template>

<style scoped>
.link-card {
    display: flex;
    flex-direction: row;
    flex-shrink: 0;

    width: var(--link-card-width);
    height: 7rem;
    padding: 1rem;
    gap: 2rem;
    margin: 2rem auto 0;

    text-decoration: none;
    border: 2px solid var(--link-color);
    background: var(--link-bg-color);
    border-radius: 1rem;

    transition: var(--site-transition);
}

.link-card:hover {
    scale: 1.05;
    box-shadow: 0 0 1.5rem var(--link-color);
}

.link-card-img {
    border-radius: 1rem;
}

.link-card-content {
    color: var(--standard-white);
}

.link-card-title {
    margin: 0;
    font-size: var(--link-card-title);
}

.link-card-desc {
    margin: 0.75rem 0 0;
}
</style>
