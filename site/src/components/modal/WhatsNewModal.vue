<script setup lang="ts">
import '../../styles/footer.css';
import '../../styles/modal.css';

import { ref } from 'vue';
import Modal from './Modal.vue';
import UpdateBlock from '../UpdateBlock.vue';

const visible = ref(false);
</script>
<template>
    <a
        class="footer-link"
        @click="visible = true"
    >
        What's New?
    </a>
    <Modal
        :visible="visible"
        transition="slide-up"
        @close="visible = false"
    >
        <div class="modal-content">
            <h2>What's New?</h2>
            <div class="updates-container">
                <UpdateBlock
                    title="Welcome!"
                    desc="Welcome to DBD Flashcards!"
                    date="09-06-2026"
                />
            </div>
        </div>
    </Modal>
</template>
<style scoped>
.updates-container {
    margin-top: 2rem;
    display: flex;
    flex-direction: column;
}
</style>
