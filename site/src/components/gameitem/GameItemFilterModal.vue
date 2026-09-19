<script setup lang="ts">
import '@/styles/footer.css';
import '@/styles/modal.css';

import { ref } from 'vue';
import Modal from '@/components/Modal.vue';

const visible = ref(false);
</script>
<template>
    <button
        class="filter-btn"
        @click="visible = true"
    >
        Filters
    </button>
    <Modal
        :visible="visible"
        transition="fade"
        height="short"
        @close="visible = false"
    >
        <div class="modal-content">
            <h2>Filters</h2>
        </div>
    </Modal>
</template>
<style scoped>
.filter-btn {
    color: var(--standard-white);
    background: none;
    padding: 0.25rem 1.25rem;
    font-size: 1rem;
    border-radius: 0.5rem;
    border: none;
    font-weight: 700;
    transition: var(--site-transition);
}
.filter-btn:hover {
    scale: 1.05;
    cursor: pointer;
    text-shadow: var(--small-text-glow);
}
</style>
