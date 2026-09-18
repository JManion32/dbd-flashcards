<script setup lang="ts">
import type { DescriptionBlock } from '@/types/GameItem.ts';

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
            <p v-if="block.type === 'text'" class="game-item-desc-txt">
                {{ block.content }}
            </p>

            <ul v-else-if="block.type === 'list'" class="game-item-desc-txt">
                <li
                    v-for="(item, itemIndex) in block.items"
                    :key="itemIndex"
                >
                    {{ item }}
                </li>
            </ul>
        </template>
    </div>
</template>
<style scoped>
.game-item-desc-txt {
    color: var(--standard-white);
    font-weight: 700;
}
</style>
