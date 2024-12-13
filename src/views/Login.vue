<template>
  <div class="login-container">
    <el-card class="login-card">
      <h2 class="login-title">登录</h2>
      <el-form :model="form" :rules="rules" ref="loginForm" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input
            v-model="form.username"
            placeholder="请输入用户名"
            clearable
          />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="form.password"
            type="password"
            placeholder="请输入密码"
            clearable
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleLogin">登录</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import { defineEmits } from 'vue'

const emit = defineEmits(['login-success'])

const router = useRouter()

const form = reactive({
  username: '',
  password: '',
})

const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
}

const loginForm = ref(null)

const handleLogin = () => {
  loginForm.value.validate(valid => {
    if (valid) {
      if (form.username === 'admin' && form.password === 'ljwzcc') {
        ElMessage.success('登录成功！')
        // 通知父组件登录成功
        emit('login-success')
        router.push('/info')
      } else {
        ElMessage.error('用户名或密码错误！')
      }
    } else {
      ElMessage.error('请修正表单中的错误后再试！')
    }
  })
}

const resetForm = () => {
  loginForm.value.resetFields()
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100%;
}

.login-card {
  width: 400px;
  padding: 20px;
}

.login-title {
  text-align: center;
  margin-bottom: 20px;
  font-size: 20px;
  color: #333;
}
</style>
