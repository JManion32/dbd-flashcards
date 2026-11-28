<script setup lang="ts">
import { ref } from 'vue';
import { useRevealOnScroll } from '@/composables/useRevealOnScroll';
import type { GameItem } from '@/types/gameItem.ts';
import GameItemCarousel from '../gameitem/GameItemCarousel.vue';

const props = defineProps<{
    title: string;
    id: string;
    side?: string;
    type: 'perk' | 'add-on';
    gameItems: GameItem[];
}>();

const sectionRef = ref<HTMLElement | null>(null);
const isVisible = useRevealOnScroll(sectionRef);
</script>
<template>
    <section
        :id="props.id"
        ref="sectionRef"
        class="home-section-container reveal"
        :class="{ visible: isVisible }"
    >
        <div class="section-header-container">
            <h2 class="section-header">
                {{ props.title }}
            </h2>
            <RouterLink
                class="full-page-link"
                :to="{ path: `/${props.type}s`, query: props.side ? { side: props.side } : {} }"
            >
                See All ➞
            </RouterLink>
        </div>
        <GameItemCarousel :game-items="props.gameItems" />
    </section>
</template>
<style scoped>
.home-section-container {
    scroll-margin-top: 6rem;
    margin-top: 3rem;
    height: 20rem;
    width: var(--home-section-width);
}
.section-header-container {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 100%;
}
.section-header {
    margin: 0;
    color: var(--standard-white);
    font-size: var(--home-section-header);
    font-weight: 900;
    display: inline-block;
    text-shadow: var(--large-text-glow);
    margin-right: 2rem;
}
.full-page-link {
    text-decoration: none;
    font-weight: 700;
    font-size: 1rem;
    transition: var(--site-transition);
    color: var(--dim-text);

    &:hover {
        scale: 1.05;
        color: var(--standard-white);
        text-shadow: var(--small-text-glow);
    }
}
</style>
