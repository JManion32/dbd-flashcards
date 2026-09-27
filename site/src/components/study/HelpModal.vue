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
        @close="visible = false"
    >
        <div class="modal-content">
            <h2>Help</h2>
            <p>The front of the flashcard is one of the following presets:</p>
            <ul>
                <li>Icon Only</li>
                <li>Name and Icon</li>
                <li>Description Only</li>
            </ul>
            <p>Click on the flashcard to flip it. The back will contain name, icon, description, and other metadata.</p>
            <p>
                If you knew the answer, click the check button beneath the flashcard to mark it as "Known". If you
                didn't, click the x button to mark it as "Still Learning".
            </p>
            <p>
                You will have the option to retry all flashcards marked as "Still Learning" at the end of the current
                session.
            </p>
            <hr />
            <h3>Hotkeys</h3>
            <p><b>SPACE</b>: Flip flashcard.</p>
            <p><b>LEFT ARROW</b>: Mark flashcard as "Still Learning".</p>
            <p><b>RIGHT ARROW</b>: Mark flashcard as "Known".</p>
            <hr />
            <h3>Additional Notes</h3>
            <p>
                Please note that reloading the page at any time will discard all progress in your current session, and
                start a new session with the default study configuration. This is by design, and may be reevaluated in
                the futue.
            </p>
        </div>
    </Modal>
</template>
<style scoped></style>
