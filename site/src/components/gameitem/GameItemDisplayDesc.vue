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
            <p v-if="block.type === 'text'">
                {{ block.content }}
            </p>

            <ul v-else-if="block.type === 'list'">
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
