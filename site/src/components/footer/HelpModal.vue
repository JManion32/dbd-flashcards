<script setup lang="ts">
import { ref } from 'vue';

import '@/styles/footer.css';
import '@/styles/modal.css';

import Modal from '@/components/Modal.vue';

const visible = ref(false);
</script>
<template>
    <a
        class="footer-link"
        @click="visible = true"
    >
        Help
    </a>
    <Modal
        :visible="visible"
        transition="slide-up"
        height="short"
        @close="visible = false"
    >
        <div class="modal-content">
            <h2>Help</h2>
        </div>
    </Modal>
</template>
<style scoped></style>
