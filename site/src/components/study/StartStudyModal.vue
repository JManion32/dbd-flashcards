<script setup lang="ts">
import '@/styles/footer.css';
import '@/styles/modal.css';
import type { StudyConfig } from '@/types/StudyConfig.ts';
import { StudyConfigDefault } from '@/types/StudyConfig.ts';

import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import Modal from '@/components/Modal.vue';
import { useData } from '@/stores/useData';

const visible = ref(false);
const router = useRouter();
const { combinedGameItems } = useData();

const config = ref<StudyConfig>({ ...StudyConfigDefault });

const sideOptions: { value: StudyConfig['side']; label: string; icon?: string }[] = [
    { value: 'Killer', label: 'Killer' },
    { value: 'Survivor', label: 'Survivor' },
    { value: 'All', label: 'Both' },
];

const typeOptions: { value: StudyConfig['type']; label: string }[] = [
    { value: 'Perk', label: 'Perks' },
    { value: 'Add-On', label: 'Add-Ons' },
];

// `hint` describes what each side of the card shows: front → back
const presetOptions: { value: StudyConfig['preset']; label: string }[] = [
    { value: 'Names / Icons', label: 'Name/Icon' },
    { value: 'Icons', label: 'Icon' },
    { value: 'Descriptions', label: 'Desc' },
];

const lengthOptions: StudyConfig['length'][] = [10, 25, 50, 100, 'All'];

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
                <div class="option-group">
                    <span class="option-label">Side</span>
                    <div class="segmented">
                        <button
                            v-for="option in sideOptions"
                            :key="option.value"
                            :class="{ active: config.side === option.value }"
                            :aria-pressed="config.side === option.value"
                            @click="setConfig('side', option.value)"
                        >
                            {{ option.label }}
                        </button>
                    </div>
                </div>

                <div class="option-group">
                    <span class="option-label">Type</span>
                    <div class="segmented">
                        <button
                            v-for="option in typeOptions"
                            :key="option.value"
                            :class="{ active: config.type === option.value }"
                            :aria-pressed="config.type === option.value"
                            @click="setConfig('type', option.value)"
                        >
                            {{ option.label }}
                        </button>
                    </div>
                </div>

                <div class="option-group">
                    <span class="option-label">Card Front</span>
                    <div class="segmented">
                        <button
                            v-for="option in presetOptions"
                            :key="option.value"
                            class="segment-with-hint"
                            :class="{ active: config.preset === option.value }"
                            :aria-pressed="config.preset === option.value"
                            @click="setConfig('preset', option.value)"
                        >
                            {{ option.label }}
                        </button>
                    </div>
                </div>

                <div class="option-group">
                    <span class="option-label">Cards</span>
                    <div class="segmented">
                        <button
                            v-for="option in lengthOptions"
                            :key="option"
                            :class="{ active: config.length === option }"
                            :aria-pressed="config.length === option"
                            @click="setConfig('length', option)"
                        >
                            {{ option }}
                        </button>
                    </div>
                </div>
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
    color: var(--standard-dim);
}
.option-groups {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    margin: 2.5rem 0 2rem 0;
}
.option-group {
    display: flex;
    flex-direction: column;
    gap: 0.45rem;
}
.option-label {
    color: var(--inactive-text);
    font-size: 0.95rem;
    font-weight: 800;
    letter-spacing: 0.12em;
    text-transform: uppercase;
}

/* One connected track per option; each choice sized to its content */
.segmented {
    display: flex;
    gap: 0.35rem;
    padding: 0.35rem;
    border-radius: 0.85rem;
    background: var(--site-bg);
    border: 1px solid var(--dark-222);
}
.segmented button {
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.15rem;

    padding: 0.45rem 1rem;
    border: 1px solid transparent;
    border-radius: 0.6rem;
    background: none;

    color: var(--standard-dim);
    font-family: inherit;
    font-size: 1.2rem;
    font-weight: 800;
    transition: var(--site-transition);
}
.segmented button:not(.segment-with-hint) {
    flex-direction: row;
    gap: 0.5rem;
}
.segmented button:hover {
    cursor: pointer;
    color: var(--standard-white);
    background: var(--secondary-bg);
}
.segmented button.active {
    color: var(--standard-white);
    background: color-mix(in srgb, var(--standard-gold) 10%, transparent);
    border-color: color-mix(in srgb, var(--standard-gold) 60%, transparent);
}
.segmented button.active {
    color: var(--standard-dim);
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
