<template>
  <div
    class="container"
    v-loading="loading"
    :element-loading-text="loadingText"
  >
    <div>
      <form @submit.prevent="submitVideoForm" class="video-upload">
        <!-- 阻止默认提交行为 -->
        <div class="video-section">
          <input
            type="file"
            accept="video/*"
            @change="handleVideoChange"
            style="display: none"
            ref="videoInput"
          />
          <div class="video-uploader" @click="selectVideoFile">
            <!-- 点击显示文件选择框 -->
            <div v-if="videoName" class="video-name">{{ videoName }}</div>
            <div v-else class="video-hint">点击上传视频</div>
          </div>
          <p v-if="videoError" class="error-message">{{ videoError }}</p>
          <!-- 显示错误提示 -->
        </div>

        <!-- 视频预览区域 -->
        <div v-if="videoUrl" class="video-preview">
          <video :src="videoUrl" controls width="400"></video>
          <!-- 控制播放的视频 -->
        </div>

        <div class="info-section">
          <el-input
            style="width: 300px"
            :rows="5"
            type="textarea"
            v-model="videoTitle"
            placeholder="输入视频简介"
            required
          />
        </div>

        <el-button
          type="primary"
          native-type="submit"
          style="width: 100px; margin-top: 30px"
          >提交</el-button
        >
      </form>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import * as notification from '@/utils/notification'
import { uploadVideo } from '@/utils/api'

export default {
  setup() {
    const videoTitle = ref('') // 默认视频名称
    const videoFile = ref(null) // 存储上传的视频文件
    const videoName = ref('') // 存储上传的视频文件名
    const videoUrl = ref('') // 存储视频预览URL
    const videoError = ref('') // 存储视频上传错误信息
    const loading = ref(false) // 加载状态
    const loadingText = ref('') // 加载文本

    // 选择文件并更新视频预览
    const handleVideoChange = event => {
      const file = event.target.files[0] // 获取上传的文件
      if (file) {
        if (file.size > 1024 * 1024 * 1024) {
          // 限制视频大小为 1GB
          videoError.value = '视频文件大小不能超过 1GB'
          videoFile.value = null
          videoName.value = ''
          videoUrl.value = '' // 清除视频预览
        } else {
          videoFile.value = file // 存储上传的文件
          videoName.value = file.name // 获取文件名称
          // videoTitle.value = file.name.split('.')[0] // 默认视频名称为文件名
          videoUrl.value = URL.createObjectURL(file) // 生成视频的临时 URL 用于预览
          videoError.value = '' // 清除错误信息
        }
      }
    }

    // 显示文件选择框
    const selectVideoFile = () => {
      const videoInput = document.querySelector('input[type="file"]') // 获取文件输入框
      videoInput.click() // 触发点击事件，打开文件选择对话框
    }

    // 提交视频表单
    const submitVideoForm = async () => {
      if (!videoFile.value) {
        videoError.value = '请选择要上传的视频文件'
        return
      }

      const formData = new FormData()
      formData.append('fileName', videoTitle.value)
      formData.append('videoFile', videoFile.value) // 添加上传的视频文件

      try {
        loading.value = true
        loadingText.value = '正在上传视频...'
        await uploadVideo(formData, {
          'Content-Type': 'multipart/form-data', // 设置请求头为表单数据类型
        })
        notification.notifySuccess('视频上传成功', '')
      } catch (error) {
        notification.notifyError('视频上传失败', error)
      } finally {
        loading.value = false
        loadingText.value = ''
        videoFile.value = null
        videoTitle.value = ''
        videoName.value = ''
        videoUrl.value = '' // 清除视频预览
      }
    }

    return {
      videoTitle,
      videoFile,
      videoName,
      videoUrl,
      videoError,
      loading,
      loadingText,
      handleVideoChange,
      selectVideoFile,
      submitVideoForm,
    }
  },
}
</script>

<style scoped>
.video-upload {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.video-section {
  margin-bottom: 20px;
  position: relative;
}

.video-uploader {
  width: 200px;
  height: 100px;
  border: 4px dashed #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  text-align: center;
}

.video-name {
  font-weight: bold;
}

.video-hint {
  color: #999;
}

.video-preview {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

.error-message {
  color: red;
  margin-top: 5px;
}

.info-section {
  display: flex;
  align-items: center;
  margin-top: 20px;
}

.el-input {
  width: 200px;
  margin-right: 10px;
}
</style>
