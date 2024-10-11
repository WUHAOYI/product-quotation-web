<template>
  <el-menu
    :default-active="activeMenu"
    class="sidebar-menu"
    @select="handleSelect"
  >
    <el-menu-item index="1">个人信息</el-menu-item>
    <el-menu-item index="2">视频管理</el-menu-item>
    <el-menu-item index="3">目录管理</el-menu-item>
    <el-menu-item index="4">商品管理</el-menu-item>
  </el-menu>
</template>

<script>
import { ref, watch } from 'vue'

export default {
  setup() {
    const activeMenu = ref('1') // 当前激活的菜单项

    const handleSelect = index => {
      activeMenu.value = index // 更新激活菜单项
      console.log(`选择的菜单项: ${index}`)
      // 这里可以添加导航逻辑
    }

    // 监听 activeMenu 的变化
    watch(activeMenu, newIndex => {
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
