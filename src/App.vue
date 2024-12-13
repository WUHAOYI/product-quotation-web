<script setup>
import { reactive } from 'vue'
import { RouterView } from 'vue-router'
import Menu from '@/components/Menu.vue'

const state = reactive({
  isLoggedIn: false,
})

function handleLoginSuccess() {
  state.isLoggedIn = true
}
</script>

<template>
  <div id="app">
    <Menu v-if="state.isLoggedIn" />

    <RouterView @login-success="handleLoginSuccess" />
  </div>
</template>

<style scoped>
#app {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
}
</style>
