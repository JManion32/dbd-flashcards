<script setup lang="ts">
import GameItemDisplayText from '@/components/gameitem/GameItemDisplayText.vue';

import type { DescriptionBlock } from '@/types/gameItem';

defineProps<{
    desc: DescriptionBlock[];
}>();
</script>

<template>
    <div class="game-item-description">
        <template
            v-for="(block, index) in desc"
            :key="index"
        >
            <p
                v-if="block.type === 'text'"
                class="game-item-desc-txt"
            >
                <GameItemDisplayText :text="block.content" />
            </p>

            <ul
                v-else-if="block.type === 'list'"
                class="game-item-desc-txt"
            >
                <li
                    v-for="(item, itemIndex) in block.items"
                    :key="itemIndex"
                >
                    <GameItemDisplayText :text="item" />
                </li>
            </ul>
        </template>
    </div>
</template>

<style scoped>
.game-item-description {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 0.5rem;
}
.game-item-desc-txt {
    color: var(--standard-white);
    font-size: var(--gd-desc-size);
    margin: 0;
}
</style>
