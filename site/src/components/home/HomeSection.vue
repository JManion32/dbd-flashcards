<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import type { GameItem } from '@/types/GameItem';
import GameItemCarousel from '../gameitem/GameItemCarousel.vue';

const props = defineProps<{
    title: string;
    id: string;
    gameItems: GameItem[];
}>();

const sectionRef = ref<HTMLElement | null>(null);
const isVisible = ref(false);

let observer: IntersectionObserver | null = null;

onMounted(() => {
    observer = new IntersectionObserver(
        ([entry]) => {
            if (entry.isIntersecting) {
                isVisible.value = true;
                observer?.unobserve(entry.target);
            }
        },
        {
            threshold: 0.15,
        }
    );

    if (sectionRef.value) {
        observer.observe(sectionRef.value);
    }
});

onUnmounted(() => {
    observer?.disconnect();
});
</script>
<template>
    <section
        :id="props.id"
        ref="sectionRef"
        class="home-section-container"
        :class="{ visible: isVisible }"
    >
        <div class="section-header-container">
            <h2 class="section-header">
                {{ props.title }}
            </h2>
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

    opacity: 0;
    transform: translateY(2rem);
    transition:
        opacity 0.6s ease,
        transform 0.6s ease;
}
.home-section-container.visible {
    opacity: 1;
    transform: translateY(0);
}
.section-header-container {
    display: flex;
    flex-direction: row;
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
</style>
