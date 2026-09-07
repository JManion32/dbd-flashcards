<script setup lang="ts">
import { ref } from 'vue';

import '../../styles/footer.css';
import '../../styles/modal.css';
import me2023 from '../../assets/me.png';
import ghWhite from '../../assets/github_white.png';

import Modal from './Modal.vue';
import LinkCard from '../LinkCard.vue';

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
                Dead by Daylight has 330 perks and over 800 add-ons across killer and survivor. With the game constantly
                evolving and continuously adding more, it has become nearly impossible for casual players to be familiar
                with all of them.
            </p>
            <p>
                DBD Flashcards takes you back to the joy of studying for a high school science test. Become a Dead by
                Daylight expert in no time with quick feedback and repetition across more than 1,200 perks and add-ons.
            </p>
            <hr />
            <h3>Contributing</h3>
            <p>
                A common problem with Dead by Daylight trivia is keeping it up to date. To address this, I have decided
                to open-source DBD Flashcards.
            </p>
            <h4>What does this mean?</h4>
            <p>
                The source code of this project is publicly accessible, allowing anyone to view, modify, and distribute
                it. If you are interested in keeping this site up to date or adding new features, check out the GitHub
                repository!
            </p>
            <LinkCard
                href="https://www.twitch.tv/the_jman32"
                :img="ghWhite"
                title="JManion32/dbd-flashcards"
                desc="An unofficial Dead by Daylight study tool!"
                color="#24292E"
            />
            <hr />
            <h3>Disclaimer</h3>
            <p>
                <i
                    >Dead by Daylight Flashcards is an unofficial, fan-made project and is not affiliated with, endorsed
                    by, or sponsored by Behaviour Interactive. Dead by Daylight and related trademarks and assets are
                    the property of their respective owners.</i
                >
            </p>
            <hr />
            <h3>Connect</h3>
            <p>Have ideas or feedback? Enjoy Dead by Daylight? Consider checking out my Twitch!</p>
            <LinkCard
                href="https://www.twitch.tv/the_jman32"
                :img="me2023"
                title="The_JMan32"
                desc="Consistently mid, occasionally great. Thanks for watching :)"
                color="#9146FF"
            />
            <hr />
            <!--TODO: Hook this into page edits.-->
            <p class="modal-last-updated">Last updated: 09-06-2026</p>
        </div>
    </Modal>
</template>
<style scoped></style>
