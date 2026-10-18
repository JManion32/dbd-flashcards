<script setup lang="ts">
import '@/styles/footer.css';
import '@/styles/modal.css';

import { ref } from 'vue';
import Modal from '@/components/Modal.vue';
import UpdateBlock from '@/components/footer/UpdateBlock.vue';

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
            <!--TODO: Populate this by pulling from a changelog txt/json file.-->
            <div class="updates-container">
                <UpdateBlock
                    title="Welcome to DBD Flashcards!"
                    desc="Featuring ALL killer and survivor perks as of version 10.2.0. Killer add-ons are coming soon!"
                    date="2026-10-15"
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
