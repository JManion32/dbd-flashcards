<script setup lang="ts">
import '@/styles/footer.css';
import '@/styles/modal.css';

import { ref } from 'vue';
import Modal from '@/components/Modal.vue';
import UpdateBlock from '@/components/footer/UpdateBlock.vue';
import updates from '@/data/whats-new.json';

// Newest first, whatever order the JSON is in. ISO dates sort correctly as strings.
const sortedUpdates = [...updates].sort((a, b) => b.date.localeCompare(a.date));

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
                    v-for="update in sortedUpdates"
                    :key="update.date + update.title"
                    :title="update.title"
                    :desc="update.desc"
                    :date="update.date"
                />
            </div>
        </div>
    </Modal>
</template>
<style scoped>
.updates-container {
    display: flex;
    flex-direction: column;
    padding-right: 1rem;
}
</style>
