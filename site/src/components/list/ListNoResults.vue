<script setup lang="ts">
import cursedImage from '@/assets/cursed-image.png';
</script>

<template>
    <div class="no-match-container">
        <img
            class="no-match-img"
            :src="cursedImage"
        />
        <p class="no-matches">No results found...</p>
    </div>
</template>

<style scoped>
.no-match-container {
    margin-top: 3rem;
    display: flex;
    flex-direction: column;
    align-items: center;
}
.no-match-img {
    height: 20rem;
    width: 20rem;
}
.no-matches {
    color: var(--dim-text);
    font-style: italic;
    font-size: 1.2rem;
    font-weight: 700;
}
</style>
