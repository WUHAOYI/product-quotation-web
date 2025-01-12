<template>
  <div class="container">
    <!-- 上传按钮 -->
    <el-button @click="handleFileUpload" style="align-self: flex-start"
      >选择 Excel 文件</el-button
    >
    <input
      type="file"
      ref="fileInput"
      @change="handleFileChange"
      style="display: none"
      accept=".xlsx, .xls"
    />

    <!-- 表格预览 -->
    <el-table
      :data="pagedData"
      border
      style="margin-top: 20px"
      v-loading="uploading"
    >
      <el-table-column prop="index" label="序号" width="80">
        <template #default="scope">
          {{ (currentPage - 1) * pageSize + scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column prop="username" label="用户名" />
      <el-table-column label="操作" width="100">
        <template #default="scope">
          <el-button type="danger" size="small" @click="handleDelete(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      v-model:current-page="currentPage"
      :page-size="pageSize"
      :total="filteredData.length"
      background
      layout="prev, pager, next"
      style="margin-top: 20px"
    />

    <!-- 上传按钮 -->
    <el-button
      type="success"
      @click="handleUpload"
      style="margin-top: 20px; width: 200px"
      >上传</el-button
    >

    <!-- 响应信息 -->
    <div v-if="result" style="margin-top: 20px">
      <p>总共上传数据：{{ result.sumCount }} 条</p>
      <p>成功：{{ result.successCount }} 条</p>
      <p>失败：{{ result.failureCount }} 条</p>
    </div>
  </div>
</template>
<script>
import { ref, reactive, computed } from 'vue'
import { ElMessage } from 'element-plus'
import * as XLSX from 'xlsx'
import axios from 'axios'
import { addAllowedUserBatch } from '@/utils/api'

export default {
  setup() {
    const fileInput = ref(null)
    const data = ref([])
    const currentPage = ref(1)
    const pageSize = 10
    const loading = ref(false)
    const uploading = ref(false)
    const result = ref(null)

    const filteredData = computed(() =>
      data.value.map((item, index) => ({
        index,
        username: item.username,
      })),
    )

    const pagedData = computed(() => {
      const start = (currentPage.value - 1) * pageSize
      return filteredData.value.slice(start, start + pageSize)
    })

    const handleFileUpload = () => {
      fileInput.value.click()
    }

    const handleFileChange = event => {
      const file = event.target.files[0]
      if (!file) return

      const reader = new FileReader()
      reader.onload = e => {
        const dataArr = new Uint8Array(e.target.result)
        const workbook = XLSX.read(dataArr, { type: 'array' })
        const sheetName = workbook.SheetNames[0]
        const sheet = workbook.Sheets[sheetName]
        const jsonData = XLSX.utils.sheet_to_json(sheet)

        data.value = jsonData.map(row => ({
          username: row[Object.keys(row)[0]], // 获取第一列的数据
        }))
      }
      reader.readAsArrayBuffer(file)

      event.target.value = ''
    }

    const handleDelete = row => {
      const index = data.value.findIndex(item => item.username === row.username)
      if (index > -1) {
        data.value.splice(index, 1)
      }
    }

    const handleUpload = async () => {
      if (data.value.length === 0) {
        ElMessage({
          message: '没有数据可上传，请先选择一个 Excel 文件。',
          type: 'warning',
        })
        return
      }
      uploading.value = true
      console.log(data.value)
      try {
        const response = await addAllowedUserBatch(data.value)
        result.value = response.data
        if (response.data.successCount === 0) {
          ElMessage.warning('上传成功的数据条数为0,请检查数据是否正确')
        } else {
          ElMessage.success(response.message)
        }
        data.value = []
        currentPage.value = 1
      } catch (error) {
        ElMessage.error(response.message || '上传失败')
      } finally {
        uploading.value = false
      }
    }

    return {
      fileInput,
      data,
      currentPage,
      pageSize,
      loading,
      uploading,
      result,
      filteredData,
      pagedData,
      handleFileUpload,
      handleFileChange,
      handleDelete,
      handleUpload,
    }
  },
}
</script>
<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 50%;
  height: 100vh;
}
</style>
