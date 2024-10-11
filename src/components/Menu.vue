<template>
  <el-menu
    :default-active="activeMenu"
    class="sidebar-menu"
    @select="handleSelect"
  >
    <el-menu-item index="/">个人信息</el-menu-item>
    <el-menu-item index="/video">视频管理</el-menu-item>
    <el-menu-item index="/category">目录管理</el-menu-item>
    <el-menu-item index="/product">商品管理</el-menu-item>
  </el-menu>
</template>

<script>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'

export default {
  setup() {
    const activeMenu = ref('/')
    const router = useRouter()

    const handleSelect = index => {
      activeMenu.value = index
    }

    watch(activeMenu, newIndex => {
      router.push(newIndex)
      console.log(`当前选择的菜单项: ${newIndex}`)
    })

    return {
      activeMenu,
      handleSelect,
    }
  },
}
</script>

<style>
.sidebar-menu {
  position: fixed;
  width: 200px;
  height: 100%;
  left: 0;
  top: 0;
}
</style>
