<template>
  <div
    class="container"
    v-loading="loading"
    :element-loading-text="loadingText"
  >
    <h2>新增授权用户</h2>
    <el-row class="input-container">
      <el-col :span="24">
        <el-card>
          <el-form
            :model="newUser"
            @submit.prevent="addUser"
            style="display: flex; flex-direction: column; align-items: center"
          >
            <el-form-item label="新增用户">
              <el-input
                style="width: 400px"
                v-model="newUser.username"
                placeholder="输入用户名"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="success" @click="addUser">新增用户</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>

    <h2 style="margin-top: 50px">已授权用户列表</h2>

    <!-- 查询用户输入框和按钮 -->
    <el-row class="search-container">
      <el-col :span="12" :offset="6" class="search-container-el-col">
        <el-input
          v-model="queryUsername"
          placeholder="请输入用户名查询"
          style="width: 500px"
        />
        <el-button
          type="primary"
          @click="handleQueryUser"
          style="margin-left: 10px"
        >
          查询
        </el-button>

        <el-button type="success" @click="reset" style="margin-left: 10px">
          重置
        </el-button>
      </el-col>
    </el-row>
    <el-row class="table-container">
      <el-table :data="paginatedUsers" border>
        <el-table-column
          prop="username"
          label="用户名"
          align="center"
        ></el-table-column>
        <el-table-column label="操作" align="center">
          <template #default="scope">
            <el-button
              type="danger"
              size="mini"
              @click="deleteUser(scope.row.username)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        style="margin-top: 20px; align-self: center"
        background
        layout="prev, pager, next"
        :total="allowedUsers.length"
        :page-size="pageSize"
        :current-page="currentPage"
        @current-change="handlePageChange"
      />
    </el-row>
  </div>
</template>
<script>
import { ref, onMounted, computed } from 'vue'
import { ElMessage } from 'element-plus'
import {
  getAllowedUser,
  addAllowedUser,
  deleteAllowedUser,
  getAllowedUserByUsername,
} from '@/utils/api'

export default {
  name: 'AuthorizedUsers',
  setup() {
    const loading = ref(false)
    const loadingText = ref('正在加载数据')

    const allowedUsers = ref([])
    const newUser = ref({ username: '' })
    const queryUsername = ref('') // 用于存储查询的用户名
    const currentPage = ref(1)
    const pageSize = ref(10)

    const paginatedUsers = computed(() => {
      const start = (currentPage.value - 1) * pageSize.value
      const end = start + pageSize.value
      return allowedUsers.value.slice(start, end)
    })

    const fetchAllowedUsers = async () => {
      try {
        loading.value = true
        const response = await getAllowedUser()
        if (response.code === 20026) {
          allowedUsers.value = response.data
        } else {
          ElMessage.error(response.message || '获取用户失败')
        }
      } catch (error) {
        ElMessage.error('获取用户失败')
      } finally {
        loading.value = false
      }
    }

    const handleQueryUser = async () => {
      if (!queryUsername.value.trim()) {
        ElMessage.warning('请输入用户名进行查询')
        return
      }
      try {
        loading.value = true
        const response = await getAllowedUserByUsername(queryUsername.value)
        if (response.code === 20026) {
          allowedUsers.value = response.data
        } else if (response.code === 40026) {
          ElMessage.warning(response.message)
          allowedUsers.value = []
        } else {
          ElMessage.error(response.message || '查询用户失败')
        }
      } catch (error) {
        ElMessage.error('查询用户失败')
      } finally {
        loading.value = false
      }
    }

    const reset = () => {
      queryUsername.value = ''
      fetchAllowedUsers()
    }

    const addUser = async () => {
      if (!newUser.value.username) {
        ElMessage.warning('请输入用户名')
        return
      }
      try {
        loading.value = true
        loadingText.value = '正在添加用户'
        const response = await addAllowedUser({
          username: newUser.value.username,
        })
        if (response.code === 20025) {
          ElMessage.success(response.message)
          newUser.value.username = ''
          fetchAllowedUsers()
        } else {
          ElMessage.error(response.message || '添加用户失败')
        }
      } catch (error) {
        ElMessage.error('添加用户失败')
      } finally {
        loading.value = false
        loadingText.value = '正在加载数据'
      }
    }

    const deleteUser = async userId => {
      try {
        loading.value = true
        loadingText.value = '正在删除用户'
        const response = await deleteAllowedUser(userId)
        if (response.code === 20027) {
          ElMessage.success(response.message)
          fetchAllowedUsers()
        } else {
          ElMessage.error(response.message || '删除用户失败')
        }
      } catch (error) {
        ElMessage.error('删除用户失败')
      } finally {
        loading.value = false
        loadingText.value = '正在加载数据'
      }
    }

    const handlePageChange = page => {
      currentPage.value = page
    }

    onMounted(fetchAllowedUsers)

    return {
      loading,
      loadingText,
      allowedUsers,
      newUser,
      queryUsername, // 返回查询的用户名
      currentPage,
      pageSize,
      paginatedUsers,
      addUser,
      deleteUser,
      handlePageChange,
      handleQueryUser, // 返回查询用户的方法
      reset,
    }
  },
}
</script>
<style scoped>
.container {
  position: absolute;
  top: 10%;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100vh;
}
.input-container {
  width: 50%;
}

.table-container {
  display: flex;
  flex-direction: column;
  width: 70%;
  align-items: center;
}
.el-col {
  padding: 20px;
}
.search-container {
  display: flex;
  flex-direction: row;
  margin-top: 20px;
  align-self: flex-start;
  margin-left: 60px;

  .search-container-el-col {
    display: flex;
    flex-direction: row;
  }
}
</style>
