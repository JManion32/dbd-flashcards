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
    /* #ffd700 is localized to study and since the transparency
    is being adjusted in multiple places, it's better to not
    make it a variable. */
    border: 2px solid #ffd700;
    background: #ffd70005;
    color: #ffd700;
    box-shadow: 1px 1px 10px #ffd70070;

    border-radius: 0.5rem;
    margin-left: auto;
    font-size: 1.25rem;
    font-weight: 900;
    padding: 0.5rem 1.5rem;
    transition: var(--site-transition);
}

.study-btn:hover {
    background: #ffd700;
    color: var(--standard-black);
    box-shadow: 0 0 20px #ffd700;

    cursor: pointer;
    scale: 1.08;
}
</style>
