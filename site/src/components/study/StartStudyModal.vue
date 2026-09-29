<script setup lang="ts">
import '@/styles/footer.css';
import '@/styles/modal.css';
import type { StudyConfig } from '@/types/StudyConfig.ts';
import { StudyConfigDefault } from '@/types/StudyConfig.ts';

import { ref } from 'vue';
import { useRouter } from 'vue-router';
import Modal from '@/components/Modal.vue';

const visible = ref(false);
const router = useRouter();

const config = ref<StudyConfig>({ ...StudyConfigDefault });

function setConfig<K extends keyof StudyConfig>(key: K, value: StudyConfig[K]) {
    config.value[key] = value;
}

function startStudy() {
    visible.value = false;

    router.push({
        path: '/study',
        state: {
            config: { ...config.value },
        },
    });
}

function restoreDefaults() {
    config.value = { ...StudyConfigDefault };
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
            <p style="margin-bottom: 3rem">
                <i> Configure your study session, then begin! </i>
            </p>
            <div
                class="selection-container"
                style="margin-top: 1rem"
            >
                <h3>Side:</h3>
                <div class="selection-btns-container">
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
            </div>
            <hr />
            <div class="selection-container">
                <h3>Type:</h3>
                <div class="selection-btns-container">
                    <button
                        :class="{ active: config.type === 'Perk' }"
                        @click="setConfig('type', 'Perk')"
                    >
                        Perks
                    </button>
                    <button
                        :class="{ active: config.type === 'Add-On' }"
                        @click="setConfig('type', 'Add-On')"
                    >
                        Add-Ons
                    </button>
                </div>
            </div>
            <hr />
            <div class="selection-container">
                <h3>Preset:</h3>
                <div class="selection-btns-container">
                    <button
                        :class="{ active: config.preset === 'Names / Icons' }"
                        @click="setConfig('preset', 'Names / Icons')"
                    >
                        Icons and Names
                    </button>
                    <button
                        :class="{ active: config.preset === 'Icons' }"
                        @click="setConfig('preset', 'Icons')"
                    >
                        Icons Only
                    </button>
                    <button
                        :class="{ active: config.preset === 'Descriptions' }"
                        @click="setConfig('preset', 'Descriptions')"
                    >
                        Description Only
                    </button>
                </div>
            </div>
            <hr />
            <div class="selection-container">
                <h3>Length:</h3>
                <div class="selection-btns-container">
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
.study-actions-container {
    display: flex;
    flex-direction: row;
    gap: 2rem;
    width: 100%;
    justify-content: right;
    margin-top: 2.5rem;
    padding-bottom: 1rem;
}
.selection-container {
    display: grid;
    grid-template-columns: 1fr 2fr;
    gap: 2rem;
    align-items: center;
}
.selection-btns-container {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    gap: 1rem;
}
.selection-btns-container button {
    border-radius: 0.75rem;
    border: none;
    font-size: 1.25rem;
    font-weight: 900;
    padding: 0.35rem 0.85rem;
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
    background: color-mix(in srgb, var(--standard-gold) 10%, transparent);
    border-color: color-mix(in srgb, var(--standard-gold) 60%, transparent);
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
