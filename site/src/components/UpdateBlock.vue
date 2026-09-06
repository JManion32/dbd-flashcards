<script setup lang="ts">
const props = defineProps<{
    title: string;
    desc: string;
    date: string;
}>();
</script>
<template>
    <div class="update-block-container">
        <div class="update-block-header">
            <h3 class="update-header-title">
                {{ props.title }}
            </h3>
            <p class="update-header-date">
                {{ props.date }}
            </p>
        </div>
        <p class="update-block-desc">
            {{ props.desc }}
        </p>
    </div>
</template>
<style scoped>
.update-block-container {
    border-bottom: 1px solid var(--secondary-bg);
    width: 100%;
}
.update-block-header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
}
.update-header-title {
    color: var(--standard-white);
    font-size: 1.25rem;
    margin: 0;
}
.update-header-date {
    margin: 0;
}
.update-block-desc {
}
</style>
