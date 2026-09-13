<script setup lang="ts">
import '../../styles/modal.css';
import randomIcon from '../../assets/random.webp';
import { ref } from 'vue';
import Modal from './Modal.vue';

const props = defineProps<{
    name: string;
    type: string;
    item?: string;
    rarity?: string;
    character?: string;
    description: string | Array<string>;
    tags: Array<string>;
}>();

const visible = ref(false);
</script>
<template>
    <div
        class="display-card"
        @click="visible = true"
    >
        <img
            class="display-card-img"
            :src="randomIcon"
        />
        <span class="display-card-title">{{ props.name }}</span>
    </div>
    <Modal
        :visible="visible"
        transition="scale"
        @close="visible = false"
    >
        <div class="card-modal-content">
            <h2 class="card-name">
                {{ props.name }}
            </h2>
            <p
                v-if="props.rarity"
                class="card-rarity"
            >
                {{ props.rarity }}
            </p>
            <p
                v-if="props.character"
                class="card-character"
            >
                {{ props.character }}
            </p>
            <h3>Description</h3>
            <div>
                {{ props.description }}
            </div>
            <h3>Tags</h3>
            <p>{{ props.tags }}</p>
        </div>
    </Modal>
</template>
<style scoped>
.display-card {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    align-items: center;
    width: 12rem;
    height: 10rem;
    background: var(--secondary-bg);
    border-radius: 1rem;
    transition: var(--site-transition);
    overflow: hidden;
    opacity: 60%;
    padding: 1rem;
}
.display-card:hover {
    cursor: pointer;
    scale: 1.05;
    opacity: 100%;
}
.display-card-img {
    width: 6rem;
    height: 6rem;
    object-fit: contain;
}
.display-card-title {
    color: var(--standard-white);
    font-weight: 800;
    text-align: center;
}
.card-modal-content {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow-y: scroll;
    padding: 0.5rem 2rem 0.5rem 1rem;
}
.card-modal-content h2 {
    color: var(--standard-white);
    font-weight: 900;
    font-size: 2.5rem;
    margin: 0;
    text-shadow: var(--large-text-glow);
}
.card-modal-content h3 {
    color: var(--standard-white);
    font-weight: 900;
    font-size: 1.5rem;
    margin: 0;
    text-shadow: var(--small-text-glow);
}
.card-character,
.card-rarity {
    font-style: italic;
    font-weight: 700;
    color: var(--standard-dim);
    margin: 0.5rem 0;
}
</style>
