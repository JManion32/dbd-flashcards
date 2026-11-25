<script setup lang="ts">
import StatusEffect from '@/components/status-effect/StatusEffect.vue';

import { useData } from '@/stores/useData';

const { statusEffects } = useData();
</script>

<template>
    <div class="status-effects-page">
        <StatusEffect
            v-for="statusEffect in statusEffects"
            :key="statusEffect.id"
            :status-effect="statusEffect"
        />
    </div>
</template>

<style scoped>
.status-effects-page {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 100%;
    max-width: 60rem;
    margin: 0 auto;
    padding: 2rem 1rem 2.5rem;
}
</style>
