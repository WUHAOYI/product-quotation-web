<script setup>
import { RouterLink, RouterView } from 'vue-router'
import Menu from '@/components/Menu.vue'
</script>

<template>
  <div id="app">
    <Menu></Menu>
    <RouterView />
  </div>
</template>

<style scoped></style>
