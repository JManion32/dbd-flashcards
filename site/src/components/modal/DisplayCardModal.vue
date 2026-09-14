<script setup lang="ts">
import '../../styles/modal.css';
import randomIcon from '../../assets/random.webp';
import { ref } from 'vue';
import Modal from './Modal.vue';
import { getRarityColor } from '../../utils/GameItemFormatter.ts';

const props = defineProps<{
    name: string;
    id: string;
    side: string;
    type: string;
    item?: string;
    rarity?: string;
    owner: string;
    description: string | Array<string>;
    quote?: string | undefined;
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
            <div class="metadata-container">
                <span
                    v-if="props.owner"
                    class="metadata-text"
                >
                    {{ props.owner }}
                </span>
                <span class="metadata-text"> • </span>
                <span class="metadata-text">
                    {{ props.type }}
                </span>
                <div
                    v-if="props.rarity"
                    class="rarity-container"
                >
                    <span class="metadata-text"> • </span>
                    <span
                        class="card-rarity"
                        :style="{ color: getRarityColor(props.rarity) }"
                    >
                        {{ props.rarity }}
                    </span>
                </div>
            </div>
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
    width: 5rem;
    height: 5rem;
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
    margin-bottom: 0.75rem;
    text-shadow: var(--large-text-glow);
}
.card-modal-content h3 {
    color: var(--standard-white);
    font-weight: 900;
    font-size: 1.5rem;
    margin: 0;
    margin-top: 2rem;
    text-shadow: var(--small-text-glow);
}
.metadata-container {
    display: flex;
    flex-direction: row;
    gap: 1rem;
}
.rarity-container {
    display: flex;
    flex-direction: row;
    gap: 1rem;
}
.metadata-text {
    font-style: italic;
    color: var(--standard-dim);
    font-weight: 700;
}
.card-rarity {
    font-style: italic;
    font-weight: 700;
}
</style>
