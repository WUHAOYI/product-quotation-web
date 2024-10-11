<template>
  <div class="container">
    <div>
      <form @submit.prevent="submitForm" class="profile-edit">
        <!-- 阻止默认提交行为 -->
        <div class="avatar-section">
          <input
            type="file"
            accept="image/*"
            @change="handleAvatarChange"
            style="display: none"
            ref="fileInput"
          />
          <div class="avatar-uploader" @click="selectFile">
            <!-- 点击显示文件选择框 -->
            <img
              v-if="avatarUrl"
              :src="avatarUrl"
              class="avatar"
              alt="Avatar"
            />
          </div>
          <div class="avatar-hint">点击上传头像</div>
        </div>

        <div class="username-section">
          <div>用户名：&nbsp;</div>
          <el-input v-model="username" placeholder="输入用户名" required />
        </div>

        <el-button
          type="primary"
          native-type="submit"
          style="width: 100px; margin-top: 30px"
          >提交</el-button
        >
      </form>
      <p v-if="fileName" style="margin-top: 30px">
        上传的文件名称：{{ fileName }}
      </p>
      <!-- 显示文件名称 -->
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import axios from 'axios'

export default {
  setup() {
    const username = ref('John Doe') // 默认用户名
    const isEditing = ref(false) // 编辑状态
    const avatarUrl = ref(
      'http://54.251.36.109:8888/1727770998579_test2024.png',
    ) // 头像URL
    const avatarFile = ref(null) // 存储上传的文件
    const fileName = ref('') // 存储上传的文件名

    const handleBlur = () => {
      isEditing.value = false
    }

    // 选择文件并更新头像预览
    const handleAvatarChange = event => {
      const file = event.target.files[0] // 获取上传的文件
      if (file) {
        avatarFile.value = file // 存储上传的文件
        avatarUrl.value = URL.createObjectURL(file) // 生成头像的临时 URL
        fileName.value = file.name // 获取文件名称
      }
    }

    // 显示文件选择框
    const selectFile = () => {
      const fileInput = document.querySelector('input[type="file"]') // 获取文件输入框
      fileInput.click() // 触发点击事件，打开文件选择对话框
    }

    // 提交表单
    const submitForm = async () => {
      const formData = new FormData()
      formData.append('username', username.value)
      if (avatarFile.value) {
        formData.append('avatarFile', avatarFile.value) // 添加上传的头像文件
        formData.append('fileName', fileName.value) // 添加上传的文件名
      }

      try {
        const response = await axios.put(
          'http://54.251.36.109:8888/user',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data', // 设置请求头为表单数据类型
            },
          },
        )
        console.log('提交成功:', response.data)
      } catch (error) {
        console.error('提交失败:', error)
      }
    }

    return {
      username,
      isEditing,
      avatarUrl,
      avatarFile,
      fileName,
      handleBlur,
      handleAvatarChange,
      selectFile,
      submitForm,
    }
  },
}
</script>

<style scoped>
.profile-edit {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.avatar-section {
  margin-bottom: 20px;
  position: relative; /* 为绝对定位做准备 */
}

.avatar-uploader {
  width: 100px; /* 头像宽度 */
  height: 100px; /* 头像高度 */
  border-radius: 50%; /* 圆形头像 */
  overflow: hidden; /* 隐藏超出部分 */
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer; /* 鼠标悬停显示手指光标 */
}

.avatar {
  width: 100%; /* 头像占满容器 */
  height: 100%; /* 头像占满容器 */
  object-fit: cover; /* 保持图片比例 */
}
.avatar-hint {
  text-align: center;
  margin-top: 10px;
  color: #999;
}
.username-section {
  display: flex;
  align-items: center;
  margin-top: 30px;
}

.el-input {
  width: 200px; /* 输入框宽度 */
  margin-right: 10px;
}
</style>
