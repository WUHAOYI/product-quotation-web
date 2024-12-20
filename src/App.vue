<script setup>
import { reactive, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { RouterView } from 'vue-router'
import Menu from '@/components/Menu.vue'

const route = useRoute()
const router = useRouter()

const state = reactive({
  isLoggedIn: false,
  initialLoad: true, // 添加初始加载标志
})

function shouldShowMenu() {
  return state.isLoggedIn && route.path !== '/'
}

onMounted(() => {
  const storedIsLoggedIn = localStorage.getItem('isLoggedIn')
  if (storedIsLoggedIn === 'true') {
    state.isLoggedIn = true
  }

  // 确保 onMounted 中的代码执行
  console.log('onMounted executed, storedIsLoggedIn:', storedIsLoggedIn)

  // 监听路由变化
  watch(
    () => route.path,
    newRoute => {
      // 在初始加载完成后才检查路径
      if (!state.initialLoad) {
        console.log('Route changed to:', newRoute)
        if (newRoute === '/') {
          console.log('clear cache and logout')
          clearCacheAndLogout()
        }
      }
    },
    { immediate: true },
  )

  // 初始加载完成
  state.initialLoad = false
})

function handleLoginSuccess() {
  state.isLoggedIn = true
  localStorage.setItem('isLoggedIn', 'true')
}

function clearCacheAndLogout() {
  state.isLoggedIn = false
  localStorage.removeItem('isLoggedIn')
}
</script>

<template>
  <Menu v-if="shouldShowMenu()" />
  <div id="app">
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
