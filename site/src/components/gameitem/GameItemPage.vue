<script setup lang="ts">
import GameItemFilter from '@/components/gameitem/GameItemFilter.vue';
import GameItemModal from '@/components/gameitem/GameItemModal.vue';
import type { GameItem } from '@/types/GameItem.ts';

const props = defineProps<{
    gameItems: GameItem[];
}>();
</script>
<template>
    <div class="card-displays-container">
        <GameItemFilter />
        <div class="display-cards-container">
            <GameItemModal
                v-for="gameItem in props.gameItems"
                :key="gameItem.id"
                :game-item="gameItem"
            />
        </div>
    </div>
</template>
<style scoped>
.card-displays-container {
    display: flex;
    flex-direction: column;
}
.display-cards-container {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    padding: 1rem;
    gap: 0.8rem;
    width: 100%;
    justify-content: center;
}
</style>
