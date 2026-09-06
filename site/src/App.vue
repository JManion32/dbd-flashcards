<script setup lang="ts">
import './styles/index.css';
import './styles/styles.css';
import './styles/colors.css';
import './styles/scaling.css';

import Header from './components/Header.vue';
import Footer from './components/Footer.vue';
</script>

<template>
    <Header />
    <RouterView />
    <Footer />
</template>
