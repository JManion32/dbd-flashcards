<script setup lang="ts">
import '@/styles/footer.css';
import '@/styles/modal.css';
import '@/styles/study-btn.css';

import type { StudyConfig } from '@/types/studyConfig';
import type { Option } from '@/types/options';
import { StudyConfigDefault } from '@/types/studyConfig';

import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import Modal from '@/components/Modal.vue';
import OptionSelector from '@/components/OptionSelector.vue';
import { useData } from '@/stores/useData';

const visible = ref(false);
const router = useRouter();
const { combinedGameItems } = useData();

const config = ref<StudyConfig>({ ...StudyConfigDefault });

const sideOptions: Option<StudyConfig['side']>[] = [
    { value: 'Killer', label: 'Killer' },
    { value: 'Survivor', label: 'Survivor' },
    { value: 'All', label: 'Both' },
];

const typeOptions: Option<StudyConfig['type']>[] = [
    { value: 'Perk', label: 'Perks' },
    { value: 'Add-On', label: 'Add-Ons' },
];

// `hint` describes what each side of the card shows: front → back
const presetOptions: Option<StudyConfig['preset']>[] = [
    { value: 'Names / Icons', label: 'Name/Icon' },
    { value: 'Icons', label: 'Icon' },
    { value: 'Descriptions', label: 'Desc' },
];

const lengthOptions: Option<StudyConfig['length']>[] = [
    { value: 10, label: '10' },
    { value: 25, label: '25' },
    { value: 50, label: '50' },
    { value: 100, label: '100' },
    { value: 'All', label: 'All' },
];

// Same filter StudyPage applies, so the summary matches the session
const poolSize = computed(() => {
    return combinedGameItems.value.filter((gameItem) => {
        if (gameItem.side !== config.value.side && config.value.side !== 'All') {
            return false;
        }

        return gameItem.type === config.value.type;
    }).length;
});

const sessionSize = computed(() => {
    return config.value.length === 'All' ? poolSize.value : Math.min(config.value.length, poolSize.value);
});

const sessionSummary = computed(() => {
    const typeLabel = config.value.type === 'Perk' ? 'perks' : 'add-ons';
    const sideLabel = config.value.side === 'All' ? '' : `${config.value.side.toLowerCase()} `;

    return `${sessionSize.value} of ${poolSize.value} ${sideLabel}${typeLabel}`;
});

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

/*
function restoreDefaults() {
    config.value = { ...StudyConfigDefault };
}
*/
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
            <p class="start-study-subtitle">
                <i>Configure your study session, then begin!</i>
            </p>

            <div class="option-groups">
                <OptionSelector
                    label="Side"
                    :options="sideOptions"
                    :active-value="config.side"
                    @selected="(newValue) => setConfig('side', newValue)"
                />
                <OptionSelector
                    label="Type"
                    :options="typeOptions"
                    :active-value="config.type"
                    @selected="(newValue) => setConfig('type', newValue)"
                />
                <OptionSelector
                    label="Card Front"
                    :options="presetOptions"
                    :active-value="config.preset"
                    @selected="(newValue) => setConfig('preset', newValue)"
                />
                <OptionSelector
                    label="Card Count"
                    :options="lengthOptions"
                    :active-value="config.length"
                    @selected="(newValue) => setConfig('length', newValue)"
                />
            </div>
            <div class="study-actions-container">
                <!--
                <button
                    class="clear-selection-btn"
                    @click="restoreDefaults()"
                >
                    Restore Defaults
                </button>
                -->
                <span class="session-summary">{{ sessionSummary }}</span>
                <button
                    class="study-btn"
                    :disabled="sessionSize === 0"
                    @click="startStudy()"
                >
                    Start!
                </button>
            </div>
        </div>
    </Modal>
</template>
<style scoped>
.modal-content .start-study-subtitle {
    margin: 0.25rem 0 0;
    color: var(--dim-text);
}
.option-groups {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    margin: 2.5rem 0 2rem 0;
}
.study-actions-container {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: 1.5rem;
    width: 100%;
    margin-top: auto;
    padding: 1.5rem 0 0;
}
.session-summary {
    color: var(--inactive-text);
    font-size: 1rem;
    font-weight: 700;
    font-style: italic;
}
.study-actions-container .study-btn:disabled {
    opacity: 0.4;
    pointer-events: none;
}
.clear-selection-btn {
    padding: 0;
    background: none;
    color: var(--dim-text);
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
