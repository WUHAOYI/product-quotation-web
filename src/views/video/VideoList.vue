<template>
  <div
    class="container"
    v-loading="loading"
    :element-loading-text="loadingText"
  >
    <el-table :data="videoList" style="width: 100%" stripe v-if="!loading">
      <el-table-column label="视频名称" prop="videoName"></el-table-column>
      <el-table-column label="视频链接">
        <template #default="{ row }">
          <div v-html="formatUrl(row, null, row.videoLink)"></div>
        </template>
      </el-table-column>
      <el-table-column
        label="创建时间"
        prop="createTime"
        :formatter="formatDate"
      ></el-table-column>
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button
            type="danger"
            size="small"
            @click="confirmDelete(row.videoId)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      v-if="!loading"
      :current-page="currentPage"
      :page-size="pageSize"
      :total="totalVideos"
      @current-change="handlePageChange"
      layout="prev, pager, next, jumper"
    ></el-pagination>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { getVideoList, deleteVideoById } from '@/utils/api' // 假设你有这些 API 方法
import * as notification from '@/utils/notification' // 用于显示通知
import { ElMessageBox, ElNotification } from 'element-plus'

export default {
  setup() {
    const loading = ref(true) // 控制加载状态
    const loadingText = ref('正在加载视频列表...') // 加载时的文本
    const videoList = ref([]) // 存储视频列表数据
    const currentPage = ref(1) // 当前页码
    const pageSize = ref(10) // 每页显示的视频数
    const totalVideos = ref(0) // 总视频数

    // 获取视频列表
    const fetchVideos = async (page = 1) => {
      try {
        loading.value = true
        const res = await getVideoList({ page, size: pageSize.value })
        videoList.value = res.data.videos
        totalVideos.value = res.data.total
      } catch (error) {
        notification.notifyError('加载视频列表失败', error)
      } finally {
        loading.value = false
      }
    }

    // 弹出确认删除对话框
    const confirmDelete = async id => {
      try {
        // 使用 ElMessageBox 询问是否确认删除
        await ElMessageBox.confirm('您确定要删除该视频吗？', '删除确认', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })

        // 如果确认，执行删除操作
        deleteVideo(id)
      } catch (error) {
        // 取消删除时，不做任何操作
        if (error === 'cancel') {
          console.log('用户取消了删除操作')
        }
      }
    }

    // 删除视频
    const deleteVideo = async id => {
      try {
        loadingText.value = '正在删除视频...'
        loading.value = true
        const res = await deleteVideoById(id)
        if (res.code == 20023) {
          ElNotification({
            title: '删除成功',
            message: '视频已成功删除。',
            type: 'success',
          })
          fetchVideos(currentPage.value) // 删除成功后刷新视频列表
        } else {
          ElNotification({
            title: '删除失败',
            message: res.message || '删除视频时发生错误',
            type: 'error',
          })
        }
      } catch (error) {
        ElNotification({
          title: '删除失败',
          message: error || '删除视频时发生错误',
          type: 'error',
        })
      } finally {
        loading.value = false
        loadingText.value = '正在加载视频列表...'
      }
    }

    const formatUrl = (row, column, cellValue) => {
      // 确保链接是有效的
      if (cellValue) {
        return `<a href="${cellValue}" target="_blank" style="color: #409EFF;">点击观看</a>`
      } else {
        return '无链接'
      }
    }

    // 格式化创建时间
    const formatDate = row => {
      const date = new Date(row.createTime)
      return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
    }

    // 处理分页变化
    const handlePageChange = page => {
      currentPage.value = page
      fetchVideos(page) // 获取新页的数据
    }

    // 初始化加载视频列表
    onMounted(() => {
      fetchVideos() // 默认加载第一页
    })

    return {
      loading,
      loadingText,
      videoList,
      currentPage,
      pageSize,
      totalVideos,
      fetchVideos,
      confirmDelete,
      deleteVideo,
      formatUrl,
      formatDate,
      handlePageChange,
    }
  },
}
</script>

<style scoped>
.container {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 20px;
}

.el-table {
  margin-bottom: 20px;
}
</style>
