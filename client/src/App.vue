<script setup lang="ts">
import { RouterView } from 'vue-router';
</script>

<template>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Roboto+Mono:wght@400;500&display=swap" rel="stylesheet">
  <RouterView />
</template>

<style>
html, body {
  font-family: 'Inter', -apple-system, sans-serif;
  font-size: 16px;
  line-height: 1.5;
}

main {
  height: 100vh;
  width: 100vw;
}
</style>
