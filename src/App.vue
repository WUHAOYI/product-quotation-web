<script setup>
import { reactive, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { RouterView } from 'vue-router'
import Menu from '@/components/Menu.vue'

const route = useRoute()
const router = useRouter()

const state = reactive({
  isLoggedIn: false,
})

onMounted(() => {
  const storedIsLoggedIn = localStorage.getItem('isLoggedIn')
  if (storedIsLoggedIn === 'true') {
    state.isLoggedIn = true
  }
})

function handleLoginSuccess() {
  state.isLoggedIn = true
  localStorage.setItem('isLoggedIn', 'true')
}

function clearCacheAndLogout() {
  state.isLoggedIn = false
  localStorage.removeItem('isLoggedIn')
}

watch(
  route,
  newRoute => {
    if (newRoute.path === '/') {
      clearCacheAndLogout()
    }
  },
  { immediate: true },
)
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
