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
        About
    </a>
    <Modal
        :visible="visible"
        transition="slide-up"
        @close="visible = false"
    >
        <div class="modal-content">
            <h2>About</h2>
            <p>An unofficial Dead by Daylight study tool!</p>
            <p>
                Dead by Daylight has 330 perks and over 800 add-ons across killer and survivor. It has become nearly
                impossible for casual players to be familiar with all of them.
            </p>
            <hr />
            <h4>Contributing</h4>
            <p>A common problem with DBD trivia is keeping it up to date.</p>
            <p>To address this problem, I have decided to open-source DBD Flashcards.</p>
            <hr />
            <h4>Disclaimer</h4>
            <p>
                <i
                    >Dead by Daylight Flashcards is an unofficial, fan-made project and is not affiliated with, endorsed
                    by, or sponsored by Behaviour Interactive. Dead by Daylight and related trademarks and assets are
                    the property of their respective owners.</i
                >
            </p>
            <hr />
            <h4>Connect</h4>
            <p>Have ideas or feedback? Enjoy DBD? Consider checking out my Twitch!</p>
            <a href="https://www.twitch.tv/the_jman32"> twitch.tv/the_jman32 </a>
            <hr />
            <!--TODO: Hook this into page edits.-->
            <p class="modal-last-updated">Last updated: 09-06-2026</p>
        </div>
    </Modal>
</template>
<style scoped></style>
