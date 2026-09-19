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
    padding: 0.25rem 1.25rem;
    background: var(--dark-222);
    font-size: 1.05rem;
    border-radius: 0.5rem;
    border: none;
    font-weight: 700;
    transition: var(--site-transition);
}
.filter-btn:hover {
    scale: 1.05;
    cursor: pointer;
    background: var(--dark-333);
}
</style>
