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
                    title="Add-Ons and Sorting"
                    desc="All 880 Killer Add-Ons have been added alongside advanced sorting! Still to come: advanced quiz settings, Killer powers, status effects, and more!"
                    date="2026-10-25"
                />
                <UpdateBlock
                    title="Added Colors!"
                    desc="Purple for perks (we don't do tiers 1 or 2), variable for add-ons. We are up to 16/44 Killer Add-On sets! Once complete, I will be adding  more sorting options, advanced quiz settings, and Killer powers."
                    date="2026-10-22"
                />
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
