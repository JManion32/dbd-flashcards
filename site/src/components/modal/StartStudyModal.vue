<script setup lang="ts">
import '../../styles/footer.css';
import '../../styles/modal.css';

import { ref } from 'vue';
import Modal from './Modal.vue';

const visible = ref(false);
</script>
<template>
    <button
        class="study-btn"
        @click="visible = true"
    >
        Study
    </button>
    <Modal
        :visible="visible"
        transition="fade"
        @close="visible = false"
    >
        <div class="modal-content">
            <h2>Study</h2>
        </div>
    </Modal>
</template>
<style scoped>
.study-btn {
    border: 2px solid var(--standard-gold);
    border-radius: 0.5rem;

    background: color-mix(in srgb, var(--standard-gold) 5%, transparent);

    color: var(--standard-gold);
    margin-left: auto;

    font-size: 1.25rem;
    font-weight: 900;
    padding: 0.5rem 1.5rem;

    box-shadow: 0 0 0.75rem color-mix(in srgb, var(--standard-gold) 20%, transparent);

    transition: var(--site-transition);
}

.study-btn:hover {
    cursor: pointer;
    scale: 1.08;

    background: var(--standard-gold);
    color: var(--standard-black);

    box-shadow:
        0 0 1rem color-mix(in srgb, var(--standard-gold) 60%, transparent),
        0 0 2rem color-mix(in srgb, var(--standard-gold) 25%, transparent);
}
</style>
