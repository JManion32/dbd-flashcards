<script setup lang="ts">
import type { StudyConfig } from '@/types/StudyConfig';
const props = defineProps<{
    config: StudyConfig;
}>();
</script>
<template>
    <button>{{ props.config.side }}</button>
</template>
<style scoped></style>
