<script setup lang="ts">
import { ref } from 'vue';
import { useRevealOnScroll } from '@/composables/useRevealOnScroll';

import AboutModal from '@/components/footer/AboutModal.vue';

const props = defineProps<{
    id: string;
}>();

const sectionRef = ref<HTMLElement | null>(null);
const isVisible = useRevealOnScroll(sectionRef);
</script>
<template>
    <section
        :id="props.id"
        ref="sectionRef"
        class="home-about-container reveal"
        :class="{ visible: isVisible }"
    >
        <div class="home-about-header">
            <h2>About</h2>
            <AboutModal v-slot="{ open }">
                <button
                    type="button"
                    class="home-about-link"
                    @click="open"
                >
                    Learn more ➞
                </button>
            </AboutModal>
        </div>

        <div class="home-about-cards">
            <div class="home-about-card">
                <h3>What is DBD Flashcards?</h3>
                <p>
                    An unofficial Dead by Daylight study tool. Quiz yourself on more than 1,200 up-to-date perks and
                    add-ons across killer and survivor.
                </p>
            </div>
            <div class="home-about-card">
                <h3>Contributing</h3>
                <p>This project is open source, which allows anyone to view, modify, and distribute it.</p>
                <a
                    class="home-about-link"
                    href="https://github.com/JManion32/dbd-flashcards"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    View on GitHub ➞
                </a>
            </div>
            <div class="home-about-card">
                <h3>Connect</h3>
                <p>Have ideas or feedback? Enjoy Dead by Daylight? Consider checking out my Twitch!</p>
                <a
                    class="home-about-link"
                    href="https://www.twitch.tv/the_jman32"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Watch on Twitch ➞
                </a>
            </div>
        </div>

        <p class="home-about-disclaimer">
            DBD Flashcards is an unofficial fan project. Dead by Daylight assets © Behaviour Interactive.
        </p>
    </section>
</template>
<style scoped>
.home-about-container {
    scroll-margin-top: 6rem;
    margin-top: 3rem;
    width: var(--home-section-width);
    display: flex;
    flex-direction: column;
    margin-bottom: 7rem;
}

.home-about-header {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;

    & h2 {
        margin: 0;
        color: var(--standard-white);
        font-size: var(--home-section-header);
        font-weight: 900;
        text-shadow: var(--large-text-glow);
    }
}

.home-about-cards {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1.5rem;
    margin-top: 1.5rem;

    @media (width >= 1024px) {
        grid-template-columns: repeat(3, 1fr);
    }
}

.home-about-card {
    display: flex;
    flex-direction: column;
    padding: 1.5rem;
    border-radius: 1rem;
    background: var(--dark-2);
    border: 1px solid var(--dark-4);

    & h3 {
        margin: 0;
        color: var(--standard-white);
        font-size: 1.35rem;
        font-weight: 900;
    }

    & > p {
        margin: 0.75rem 0 0;
        color: var(--inactive-text);
        font-weight: 600;
        font-size: 1rem;
        line-height: 1.5;
    }

    /* Push the link to the bottom so links line up across the row */
    & .home-about-link {
        margin-top: auto;
        padding-top: 1.25rem;
        align-self: flex-start;
    }
}

.home-about-link {
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    font: inherit;
    font-weight: 700;
    font-size: 1rem;
    transition: var(--site-transition);
    color: var(--dim-text);
    text-decoration: none;

    &:hover {
        scale: 1.05;
        color: var(--standard-white);
        text-shadow: var(--small-text-glow);
    }
}

.home-about-disclaimer {
    margin: 1.5rem 0 0;
    text-align: center;
    font-size: 0.85rem;
    font-style: italic;
    color: var(--inactive-text);
}
</style>
