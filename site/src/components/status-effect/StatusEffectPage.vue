<script setup lang="ts">
import ListToolbar from '@/components/list/ListToolbar.vue';
import ListNoResults from '@/components/list/ListNoResults.vue';
import StatusEffect from '@/components/status-effect/StatusEffect.vue';

import { useData } from '@/stores/useData';
import { useListControls } from '@/composables/useListControls';
import { statusEffectListConfig } from '@/utils/listConfigs/statusEffects';

const { statusEffects } = useData();
const { state, results } = useListControls(statusEffects, statusEffectListConfig);
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
