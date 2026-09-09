<script setup lang="ts">
const props = defineProps<{
    title: string;
    id: string;
}>();
//import emblaCarouselVue from 'embla-carousel-vue';
//const [emblaRef] = emblaCarouselVue();
</script>
<template>
    <section
        :id="props.id"
        class="home-section-container"
    >
        <div class="section-header-container">
            <h2 class="section-header">
                {{ props.title }}
            </h2>
            <input class="section-search" />
        </div>
        <!--
        <div
            ref="emblaRef"
            class="embla"
        >
            <div class="embla__container">
                <div
                    v-for="perk in perks"
                    :key="perk.id"
                    class="embla__slide"
                >
                    <PerkCard :perk="perk" />
                </div>
            </div>
        </div>
        -->
    </section>
</template>
<style scoped>
.home-section-container {
    scroll-margin-top: 6rem;
    margin-top: 3rem;
    height: 32rem;
    width: 70%;
}
.section-header-container {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    width: 100%;
}
.section-header {
    margin: 0;
    color: var(--standard-white);
    font-size: 2.5rem;
    font-weight: 900;
    display: inline-block;
    text-shadow: var(--site-text-shadow);
}
.section-search {
    margin: 0 0 0 auto;
    height: 2rem;
    border-radius: 0.5rem;
    border: none;
    background: var(--secondary-bg);
}
</style>
