<script setup lang="ts">
import ListToolbar from '@/components/list/ListToolbar.vue';
import ListNoResults from '@/components/list/ListNoResults.vue';
import StatusEffect from '@/components/status-effect/StatusEffect.vue';

import { nextTick, onMounted, watch } from 'vue';
import { useData } from '@/stores/useData';
import { defaultListState, useListControls } from '@/composables/useListControls';
import { statusEffectListConfig } from '@/utils/listConfigs/statusEffects';

const props = defineProps<{
    // From the URL: /status-effects/haste scrolls to Haste and highlights it
    openId?: string | string[];
}>();

const { statusEffects } = useData();
const { state, results } = useListControls(statusEffects, statusEffectListConfig);

async function scrollToOpen() {
    const id = props.openId;
    if (typeof id !== 'string') return;

    // A shared link should land on its status effect even if the search or filters would hide it
    if (!results.value.some((statusEffect) => statusEffect.id === id)) {
        state.value = defaultListState(statusEffectListConfig);
        await nextTick();
    }
    // Only scroll when it's off screen, so clicking a card on the page doesn't move it
    const card = document.getElementById(`status-effect-${id}`);
    const rect = card?.getBoundingClientRect();
    const HEADER_HEIGHT = 64;
    if (rect && (rect.top < HEADER_HEIGHT || rect.bottom > window.innerHeight)) {
        card?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

onMounted(scrollToOpen);
watch(() => props.openId, scrollToOpen, { flush: 'post' });
</script>

<template>
    <div>
        <ListToolbar
            v-model="state"
            :config="statusEffectListConfig"
            :count="results.length"
        />
        <ListNoResults v-if="results.length === 0" />
        <div class="status-effects-list">
            <StatusEffect
                v-for="statusEffect in results"
                :key="statusEffect.id"
                :status-effect="statusEffect"
                :open="statusEffect.id === props.openId"
            />
        </div>
    </div>
</template>

<style scoped>
.status-effects-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 100%;
    max-width: 60rem;
    margin: 0 auto;
    padding: 1rem 1rem 2.5rem;
}
</style>
