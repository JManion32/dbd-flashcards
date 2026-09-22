<script setup lang="ts">
import '@/styles/footer.css';
import '@/styles/modal.css';
import type { StudyConfig } from '@/types/StudyConfig.ts';

import { ref } from 'vue';
import { useRouter } from 'vue-router';
import Modal from '@/components/Modal.vue';

const visible = ref(false);
const router = useRouter();

function getDefaultStudyConfig(): StudyConfig {
    return {
        side: 'All',
        type: 'Perks',
        preset: 'name-and-icon',
        length: 50,
    };
}

const config = ref<StudyConfig>(getDefaultStudyConfig());

function setConfig<K extends keyof StudyConfig>(key: K, value: StudyConfig[K]) {
    config.value[key] = value;
}

function startStudy() {
    visible.value = false;

    router.push({
        path: '/study',
        state: {
            config: config.value,
        },
    });
}

function restoreDefaults() {
    config.value = getDefaultStudyConfig();
}
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
            <h2>Start Flashcards</h2>
            <p>
                <i> Configure your study session, then begin! </i>
            </p>
            <h3 style="margin-top: 3rem">Side</h3>
            <div class="selection-container">
                <button
                    :class="{ active: config.side === 'Killer' }"
                    @click="setConfig('side', 'Killer')"
                >
                    Killer
                </button>
                <button
                    :class="{ active: config.side === 'Survivor' }"
                    @click="setConfig('side', 'Survivor')"
                >
                    Survivor
                </button>
                <button
                    :class="{ active: config.side === 'All' }"
                    @click="setConfig('side', 'All')"
                >
                    All
                </button>
            </div>
            <hr />
            <h3>Type</h3>
            <div class="selection-container">
                <button
                    :class="{ active: config.type === 'Perks' }"
                    @click="setConfig('type', 'Perks')"
                >
                    Perks
                </button>
                <button
                    :class="{ active: config.type === 'Add-Ons' }"
                    @click="setConfig('type', 'Add-Ons')"
                >
                    Add-Ons
                </button>
            </div>
            <hr />
            <h3>Presets</h3>
            <div class="selection-container">
                <button
                    :class="{ active: config.preset === 'name-and-icon' }"
                    @click="setConfig('preset', 'name-and-icon')"
                >
                    Icons and Names
                </button>
                <button
                    :class="{ active: config.preset === 'icon-only' }"
                    @click="setConfig('preset', 'icon-only')"
                >
                    Icons Only
                </button>
                <button
                    :class="{ active: config.preset === 'desc-only' }"
                    @click="setConfig('preset', 'desc-only')"
                >
                    Description Only
                </button>
            </div>
            <hr />
            <h3>Length</h3>
            <div class="selection-container">
                <button
                    :class="{ active: config.length === 10 }"
                    @click="setConfig('length', 10)"
                >
                    10
                </button>
                <button
                    :class="{ active: config.length === 25 }"
                    @click="setConfig('length', 25)"
                >
                    25
                </button>
                <button
                    :class="{ active: config.length === 50 }"
                    @click="setConfig('length', 50)"
                >
                    50
                </button>
                <button
                    :class="{ active: config.length === 100 }"
                    @click="setConfig('length', 100)"
                >
                    100
                </button>
                <button
                    :class="{ active: config.length === 'All' }"
                    @click="setConfig('length', 'All')"
                >
                    All
                </button>
            </div>
            <hr />
            <div class="study-actions-container">
                <button
                    class="clear-selection-btn"
                    @click="restoreDefaults()"
                >
                    Restore Defaults
                </button>
                <button
                    class="study-btn"
                    @click="startStudy()"
                >
                    Start!
                </button>
            </div>
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
    text-decoration: none;

    border-radius: 0.5rem;
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
.study-actions-container {
    display: flex;
    flex-direction: row;
    gap: 2rem;
    width: 100%;
    justify-content: right;
    margin-top: 1.5rem;
    padding-bottom: 1rem;
}
.selection-container {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-top: 1rem;
}
.selection-container button {
    border-radius: 1rem;
    border: none;
    font-size: 1.3rem;
    font-weight: 900;
    padding: 1rem;
    background: none;
    border: 2px solid var(--dark-333);
    color: var(--standard-dim);
    transition: var(--site-transition);
}
.selection-container button:hover {
    cursor: pointer;
    color: var(--standard-white);
    background: #191919;
}
.selection-container button.active {
    color: var(--standard-white);
    background: #ffd70010;
    border-color: #ffd70060;
}
.clear-selection-btn {
    background: none;
    color: var(--standard-dim);
    font-style: italic;
    border: none;
    font-size: 1rem;
    font-weight: 700;
    transition: var(--site-transition);
}
.clear-selection-btn:hover {
    scale: 1.05;
    cursor: pointer;
    text-shadow: var(--small-text-glow);
    color: var(--standard-white);
}
</style>
