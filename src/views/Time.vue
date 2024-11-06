<template>
  <div
    class="container"
    v-loading="loading"
    :element-loading-text="loadingText"
  >
    <div>
      请输入上新时间范围，单位为天（例如输入20表示今天到20天前这段时间范围内的商品为上新商品）
    </div>
    <el-input v-model="days" placeholder="请输入天数" type="number"></el-input>

    <el-button
      type="primary"
      @click="updateNewTime"
      :loading="loading"
      :disabled="!days"
    >
      更新上新时间
    </el-button>

    <!-- 显示更新后的上新时间 -->
    <div v-if="newTime" class="result">
      <p>上新起始时间：{{ newTime }}</p>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import * as notification from '@/utils/notification'
import { ElMessage } from 'element-plus' // 用于弹出消息框
import { getTime, updateTime } from '@/utils/api'

export default {
  setup() {
    const loading = ref(false) // 控制加载状态
    const loadingText = ref('正在加载上新时间...') // 加载时的文本
    const days = ref('') // 用户输入的天数
    const newTime = ref(null) // 存储计算出的上新时间

    // 获取上新时间
    onMounted(async () => {
      try {
        const res = await getTime()
        days.value = res
        newTime.value = caculateNewDate(res)
        notification.notifySuccess('加载上新时间成功', '')
      } catch (error) {
        notification.notifyError('加载上新时间失败', error)
      } finally {
        loading.value = false
      }
    })

    // 更新上新时间
    const updateNewTime = async () => {
      try {
        loading.value = true
        loadingText.value = '正在更新上新时间...'
        const res = await updateTime(days.value)
        if (res.code == 20024) {
          newTime.value = caculateNewDate(days.value)
          // 显示成功通知
          notification.notifySuccess('上新时间更新成功')
        } else {
          notification.notifyError('更新上新时间失败')
        }
      } catch (error) {
        notification.notifyError(error.message || '更新上新时间失败')
      } finally {
        loading.value = false
      }
    }

    const caculateNewDate = days => {
      // 计算上新时间
      const newDate = new Date()
      newDate.setDate(newDate.getDate() - days)
      // 格式化新时间
      const formattedNewTime = formatDate(newDate)
      return formattedNewTime
    }

    // 格式化日期时间
    const formatDate = date => {
      return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date
        .getDate()
        .toString()
        .padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date
        .getMinutes()
        .toString()
        .padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`
    }

    return {
      loading,
      loadingText,
      days,
      newTime,
      updateNewTime,
    }
  },
}
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.el-input {
  margin-top: 30px;
  width: 200px;
}
.el-button {
  margin-top: 30px;
}

.result {
  margin-top: 30px;
  margin-top: 20px;
  font-size: 18px;
  font-weight: bold;
  color: #409eff;
}
</style>
