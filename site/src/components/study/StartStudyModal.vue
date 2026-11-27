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
import SearchSelector from '@/components/SearchSelector.vue';
import { filterStudyPool } from '@/utils/filterStudyPool';
import { useData } from '@/stores/useData';

const props = defineProps<{
    sidebar?: boolean;
}>();

const visible = ref(false);
// Owner pickers live in a collapsed section so the main options don't shift as Side/Type change
const advancedOpen = ref(false);
const router = useRouter();
const { combinedGameItems, survivors, killers, items } = useData();

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
const poolSize = computed(() => filterStudyPool(combinedGameItems.value, config.value).length);

const sessionSize = computed(() => {
    return config.value.length === 'All' ? poolSize.value : Math.min(config.value.length, poolSize.value);
});

const sessionSummary = computed(() => {
    const typeLabel = config.value.type === 'Perk' ? 'perks' : 'add-ons';
    const sideLabel = config.value.side === 'All' ? '' : `${config.value.side.toLowerCase()} `;

    return `${sessionSize.value} of ${poolSize.value} ${sideLabel}${typeLabel}`;
});

// Which owner pickers show for the current Side/Type, matching filterStudyPool
const showSurvivors = computed(() => config.value.type === 'Perk' && config.value.side !== 'Killer');
const showItems = computed(() => config.value.type === 'Add-On' && config.value.side !== 'Killer');
const showKillers = computed(() => config.value.side !== 'Survivor');

function setConfig<K extends keyof StudyConfig>(key: K, value: StudyConfig[K]) {
    config.value[key] = value;
}

function startStudy() {
    visible.value = false;

    router.push({
        path: '/study',
        // history.state is structured-cloned, which rejects Vue's reactive arrays, so copy them out
        state: {
            config: {
                ...config.value,
                survivors: [...config.value.survivors],
                killers: [...config.value.killers],
                items: [...config.value.items],
            },
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
        :class="{ 'study-btn-sidebar': props.sidebar }"
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
            <h2 style="font-size: 2.5rem">Start Flashcards</h2>
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
                <div class="advanced">
                    <button
                        class="advanced-toggle"
                        :aria-expanded="advancedOpen"
                        @click="advancedOpen = !advancedOpen"
                    >
                        <span
                            class="chevron"
                            :class="{ open: advancedOpen }"
                            >&#9656;</span
                        >
                        <span class="advanced-label">Advanced</span>
                    </button>
                    <div
                        v-if="advancedOpen"
                        class="advanced-options"
                    >
                        <SearchSelector
                            v-if="showSurvivors"
                            label="Survivors"
                            :items="survivors"
                            :active-values="config.survivors"
                            @selected="(newValues) => setConfig('survivors', newValues)"
                        />
                        <SearchSelector
                            v-if="showItems"
                            label="Items"
                            :items="items"
                            :active-values="config.items"
                            @selected="(newValues) => setConfig('items', newValues)"
                        />
                        <SearchSelector
                            v-if="showKillers"
                            label="Killers"
                            :items="killers"
                            :active-values="config.killers"
                            @selected="(newValues) => setConfig('killers', newValues)"
                        />
                    </div>
                    <div
                        v-if="advancedOpen"
                        class="advanced-end"
                    />
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
.study-btn-sidebar {
    width: 80%;
    font-size: 1.5rem;
    padding: 0.85rem;
    border-radius: 1rem;

    &:hover {
        scale: 1.03;
    }
}
.modal-content .start-study-subtitle {
    margin: 0.25rem 0 0;
    color: var(--dim-text);
}
.option-groups {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    margin: 1.75rem 0;
}
.advanced {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
}
.advanced-toggle {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    width: 100%;
    padding: 0;
    border: none;
    background: none;
    font-family: inherit;
    cursor: pointer;

    /* Divider lines either side of the label: ──── ▸ ADVANCED ──── */
    &::before,
    &::after {
        content: '';
        flex: 1;
        height: 1px;
        background: var(--dark-4);
    }

    &::before {
        margin-right: 0.4rem;
    }

    &::after {
        margin-left: 0.4rem;
    }

    &:hover .advanced-label,
    &:hover .chevron {
        color: var(--standard-white);
    }
}
.chevron {
    color: var(--inactive-text);
    font-size: 1rem;
    transition: var(--site-transition);

    &.open {
        rotate: 90deg;
    }
}
.advanced-label {
    color: var(--inactive-text);
    font-size: 0.95rem;
    font-weight: 800;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    transition: var(--site-transition);
}
/* Closes the section while it's open, so the options don't run into the Start row */
.advanced-end {
    height: 1px;
    background: var(--dark-4);
}
.advanced-options {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
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

    & .study-btn:disabled {
        opacity: 0.4;
        pointer-events: none;
    }
}
.session-summary {
    color: var(--inactive-text);
    font-size: 1rem;
    font-weight: 700;
    font-style: italic;
}
.clear-selection-btn {
    padding: 0;
    background: none;
    color: var(--dim-text);
    border: none;
    font-size: 1rem;
    font-weight: 700;
    transition: var(--site-transition);

    &:hover {
        scale: 1.05;
        cursor: pointer;
        text-shadow: var(--small-text-glow);
        color: var(--standard-white);
    }
}
</style>
