<template>
  <el-menu
    :default-active="activeMenu"
    class="sidebar-menu"
    @select="handleSelect"
  >
    <el-menu-item index="/info">个人信息</el-menu-item>

    <!-- 视频管理目录，包含子目录 -->
    <el-sub-menu index="/video">
      <template #title>视频管理</template>
      <el-menu-item index="/video/upload">上传视频</el-menu-item>
      <el-menu-item index="/video/list">视频列表</el-menu-item>
    </el-sub-menu>

    <el-sub-menu index="/category">
      <template #title>目录管理</template>
      <el-menu-item index="/category/list">目录列表</el-menu-item>
    </el-sub-menu>

    <el-sub-menu index="/product">
      <template #title>商品管理</template>
      <el-menu-item index="/product/list">商品列表</el-menu-item>
      <el-menu-item index="/product/add">上传商品</el-menu-item>
      <el-menu-item index="/product/add/batch">批量上传</el-menu-item>
    </el-sub-menu>
    <el-menu-item index="/time">商品上新</el-menu-item>
  </el-menu>
</template>

<script>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'

export default {
  setup() {
    const router = useRouter()
    const activeMenu = ref(router.currentRoute.value.path)

    const handleSelect = index => {
      activeMenu.value = index
      router.push(index)
    }

    watch(
      () => router.currentRoute.value.path,
      newPath => {
        activeMenu.value = newPath
      },
    )

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
