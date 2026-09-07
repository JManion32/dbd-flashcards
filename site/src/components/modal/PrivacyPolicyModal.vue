<script setup lang="ts">
import '../../styles/footer.css';
import '../../styles/modal.css';

import { ref } from 'vue';
import Modal from './Modal.vue';

const visible = ref(false);
</script>
<template>
    <a
        class="footer-link"
        @click="visible = true"
    >
        Privacy Policy
    </a>
    <Modal
        :visible="visible"
        transition="slide-up"
        @close="visible = false"
    >
        <div class="modal-content">
            <h2>Privacy Policy</h2>
            <p>
                DBD Flashcards does not require an account and does not directly collect personal information such as
                your name, email address, or password.
            </p>
            <hr />
            <h3>Analytics</h3>
            <p>
                DBD Flashcards uses Google Analytics to understand general site traffic and usage. Google Analytics may
                collect information such as your device and browser type, pages visited, and approximate location.
            </p>
            <hr />
            <h3>Local Storage</h3>
            <p>
                DBD Flashcards uses your browser's local storage to save things such as preferences and flashcard
                progress. This information is stored on your device and is not sent to DBD Flashcards.
            </p>
            <hr />
            <h3>Third-Party Links</h3>
            <p>
                The site may contain links to third-party websites such as GitHub and Twitch. Those websites have their
                own privacy practices and policies.
            </p>
            <hr />
            <h3>Changes</h3>
            <p>This policy may be updated if the site's features or data practices change.</p>
            <hr />
            <h3>Contact</h3>
            <p>Questions about privacy can be submitted through the DBD Flashcards GitHub repository.</p>
            <hr />
            <p class="modal-last-updated">Last updated: 09-06-2026</p>
        </div>
    </Modal>
</template>
<style scoped></style>
