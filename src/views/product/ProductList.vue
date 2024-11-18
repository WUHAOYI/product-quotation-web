<template>
  <div class="container">
    <!-- 筛选表单 -->
    <el-form
      :inline="true"
      :model="filterParams"
      class="filter-form"
      style="margin-bottom: 20px"
    >
      <el-form-item label="商品目录ID">
        <el-input
          v-model="filterParams.categoryId"
          placeholder="请输入商品目录ID"
          size="large"
        />
      </el-form-item>
      <el-form-item label="商品名称">
        <el-input
          v-model="filterParams.productName"
          placeholder="请输入商品名称"
          size="large"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="large" @click="applyFilter"
          >筛选</el-button
        >
        <el-button type="default" size="large" @click="clearFilter"
          >清除筛选</el-button
        >
      </el-form-item>
    </el-form>

    <!-- 加载状态 -->
    <el-table
      :data="productList"
      style="width: 100%"
      v-loading="loading"
      element-loading-text="正在加载商品数据"
      border
      size="medium"
    >
      <el-table-column label="商品名称" prop="productName" align="center" />
      <el-table-column label="商品简介" prop="productIntro" align="center" />
      <el-table-column label="商品价格" prop="productLowPrice" align="center">
        <template #default="{ row }"> ¥{{ row.productLowPrice }} </template>
      </el-table-column>
      <el-table-column label="商品封面图" align="center">
        <template #default="{ row }">
          <img
            :src="row.productAvatar"
            alt="商品图片"
            style="width: 80px; height: 80px"
          />
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template #default="{ row }">
          <el-button @click="editProduct(row)" type="primary" size="small"
            >编辑</el-button
          >
          <el-button @click="deleteProduct(row.id)" type="danger" size="small"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页位置调整 -->
    <div class="pagination">
      <el-pagination
        @current-change="handlePageChange"
        :current-page="page"
        :page-size="pageSize"
        :total="totalItems"
        layout="prev, pager, next, jumper"
      />
      <div style="margin-left: 30px">总商品数：{{ totalItems }}</div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  ElTable,
  ElTableColumn,
  ElButton,
  ElPagination,
  ElContainer,
  ElMain,
  ElForm,
  ElFormItem,
  ElInput,
} from 'element-plus'
import { getProducts } from '@/utils/api'

export default {
  name: 'ProductList',
  components: {
    ElTable,
    ElTableColumn,
    ElButton,
    ElPagination,
    ElContainer,
    ElMain,
    ElForm,
    ElFormItem,
    ElInput,
  },
  setup() {
    const router = useRouter()
    const productList = ref([])
    const totalItems = ref(0)
    const page = ref(1) // 当前页
    const pageSize = ref(10) // 每页条数
    const newFlag = ref(0) // 固定为0
    const loading = ref(false) // 加载状态

    // 筛选参数
    const filterParams = ref({
      categoryId: '',
      productName: '',
    })

    // 请求商品列表数据
    const getProductList = async () => {
      loading.value = true // 启用加载状态
      try {
        const response = await getProducts({
          page: page.value,
          size: pageSize.value,
          newFlag: newFlag.value,
          categoryId: filterParams.value.categoryId,
          productName: filterParams.value.productName,
        })
        if (response.data && response.data.products) {
          productList.value = response.data.products
          totalItems.value = response.data.total // 假设接口返回数据中包含总数
        }
      } catch (error) {
        console.error('获取商品列表失败:', error)
      } finally {
        loading.value = false // 完成加载后关闭加载状态
      }
    }

    // 应用筛选条件
    const applyFilter = () => {
      page.value = 1 // 筛选时重置为第一页
      getProductList() // 获取根据筛选条件的商品数据
    }

    // 清除筛选条件
    const clearFilter = () => {
      filterParams.value.categoryId = '' // 清空目录ID
      filterParams.value.productName = '' // 清空商品名称
      page.value = 1 // 重置为第一页
      getProductList() // 获取所有商品数据
    }

    // 分页变更处理
    const handlePageChange = newPage => {
      page.value = newPage
      getProductList() // 获取新的分页数据
    }

    // 编辑商品方法
    const editProduct = product => {
      console.log('编辑商品:', product)
      router.push({ name: 'product-edit', params: { id: product.id } })
    }

    // 删除商品
    const deleteProduct = productId => {
      console.log('删除商品 ID:', productId)
      // 在这里可以实现删除功能，例如调用删除接口
    }

    // 页面加载时获取商品数据
    onMounted(() => {
      getProductList()
    })

    return {
      productList,
      totalItems,
      page,
      pageSize,
      loading,
      filterParams,
      getProductList,
      handlePageChange,
      applyFilter,
      clearFilter,
      editProduct,
      deleteProduct,
    }
  },
}
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.el-form {
  margin-top: 30px;
  margin-left: 30px;
  align-self: flex-start;
}

/* 表格行间距调整 */
.el-table .el-table__row {
  padding: 10px 0; /* 增加行间距 */
}

/* 表格内容居中 */
.el-table .el-table__cell {
  text-align: center;
}
.pagination {
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.filter-form {
  margin-bottom: 20px;
}
.total-info {
  font-size: 16px;
  color: #333;
  margin-top: 10px;
}
</style>
