<template>
  <div
    class="category-container"
    v-loading="loading"
    :element-loading-text="loadingText"
  >
    <!-- 新增目录按钮 -->
    <div style="width: 700px">
      <el-button
        type="primary"
        @click="openAddDialog"
        style="margin-bottom: 20px; align-self: flex-start"
        >新增目录</el-button
      >
    </div>

    <!-- 目录树展示 -->
    <el-tree
      :data="directoryData"
      :props="treeProps"
      @node-click="handleNodeClick"
      :highlight-current="true"
    >
      <template #default="{ node, data }">
        <span>{{ data.categoryName }}</span>
        <div class="button-action">
          <el-button
            size="small"
            type="success"
            @click.stop="openEditDialog(data)"
            >编辑</el-button
          >
          <el-button
            size="small"
            type="danger"
            @click.stop="openDeleteDialog(data)"
            >删除</el-button
          >
        </div>
      </template>
    </el-tree>

    <!-- 编辑/新增目录弹窗 -->
    <el-dialog
      :title="formData.id ? '编辑目录' : '新增目录'"
      v-model="dialogVisible"
      width="400px"
      @close="resetDialog"
    >
      <el-form
        :model="formData"
        label-width="80px"
        ref="categoryForm"
        :rules="categoryRules"
      >
        <el-form-item label="目录名称" prop="name">
          <el-input
            v-model="formData.name"
            placeholder="请输入目录名称"
          ></el-input>
        </el-form-item>

        <el-form-item label="目录等级" prop="categotyLevel">
          <el-select v-model="formData.level" placeholder="请选择目录等级">
            <el-option label="一级目录" value="1"></el-option>
            <el-option label="二级目录" value="2"></el-option>
            <el-option label="三级目录" value="3"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item
          label="上级目录"
          v-if="formData.level > 1"
          prop="superiorId"
        >
          <el-select v-model="formData.superiorId" placeholder="请选择上级目录">
            <el-option
              v-for="node in filteredDirectories"
              :key="node.id"
              :label="node.categoryName"
              :value="node.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="resetDialog">取消</el-button>
        <el-button type="primary" @click="saveDirectory">保存</el-button>
      </span>
    </el-dialog>

    <!-- 删除目录确认弹窗 -->
    <el-dialog
      title="确认删除"
      v-model="deleteDialogVisible"
      width="600px"
      @close="resetDeleteDialog"
    >
      <span>删除目录将会删除其下的所有子目录以及商品, 请谨慎选择!</span>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="resetDeleteDialog">取消</el-button>
          <el-button type="primary" @click="deleteDirectory">删除</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted } from 'vue'
import {
  ElButton,
  ElDialog,
  ElForm,
  ElFormItem,
  ElInput,
  ElSelect,
  ElOption,
  ElTree,
} from 'element-plus'
import {
  getCategories,
  addCategory,
  updateCategory,
  deleteCategoryById,
} from '@/utils/api'
import * as notification from '@/utils/notification'

export default {
  name: 'DirectoryManagement',
  components: {
    ElButton,
    ElDialog,
    ElForm,
    ElFormItem,
    ElInput,
    ElSelect,
    ElOption,
    ElTree,
  },
  setup() {
    const loading = ref(false) // 加载状态
    const loadingText = ref('正在加载目录信息') // 加载文本
    const categoryForm = ref(null)
    const categoryRules = ref({
      name: [{ required: true, message: '请输入目录名称', trigger: 'blur' }],
      level: [{ required: true, message: '请选择目录等级', trigger: 'change' }],
      superiorId: [
        {
          required: true,
          message: '请选择上级目录',
          trigger: 'change',
        },
      ],
    })
    const directoryData = ref([]) // 目录数据
    const allDirectories = ref([]) // 所有目录，用于选择上级目录
    const dialogVisible = ref(false) // 控制新增/编辑弹窗的显示
    const deleteDialogVisible = ref(false) // 控制删除弹窗的显示
    const selectedNode = ref(null) // 当前选中的节点
    const formData = reactive({
      id: null,
      name: '',
      level: 1,
      superiorId: null,
    }) // 表单数据

    const treeProps = reactive({
      children: 'children',
      label: 'categoryName',
    })

    // 获取所有目录数据
    const fetchDirectories = async () => {
      try {
        loading.value = true
        const response = await getCategories()
        if (response.code === 20004) {
          notification.notifySuccess('获取目录数据成功', '')
          directoryData.value = response.data
          allDirectories.value = flattenDirectories(response.data)
        } else {
          notification.notifyError('获取目录数据失败', response.message)
        }
      } catch (error) {
        notification.notifyError('错误', error)
      } finally {
        loading.value = false
      }
    }

    // 解嵌套，将所有目录信息存储到一个数组中
    const flattenDirectories = data => {
      let result = []
      data.forEach(item => {
        result.push(item)
        if (item.children) {
          result = result.concat(flattenDirectories(item.children))
        }
      })
      return result
    }

    // 过滤可用的上级目录
    const filteredDirectories = computed(() => {
      console.log(allDirectories.value)
      if (formData.level == 2) {
        // 二级目录只能选择一级目录
        return allDirectories.value.filter(item => item.categoryLevel == 1)
      }
      if (formData.level == 3) {
        // 三级目录只能选择二级目录
        return allDirectories.value.filter(item => item.categoryLevel == 2)
      }
      return allDirectories.value // 一级目录没有上级目录选择
    })

    // 选择目录节点
    const handleNodeClick = node => {
      selectedNode.value = node
    }

    // 打开新增弹窗
    const openAddDialog = () => {
      resetDialog()
      dialogVisible.value = true
    }

    // 打开编辑弹窗
    const openEditDialog = data => {
      console.log(data)
      formData.id = data.id
      formData.name = data.categoryName
      formData.level = data.categoryLevel
      dialogVisible.value = true
    }

    // 重置弹窗表单
    const resetDialog = () => {
      formData.id = null
      formData.name = ''
      formData.level = 1
      formData.superiorId = null
    }

    // 保存目录
    const saveDirectory = () => {
      if (formData.id) {
        // 更新操作
        updateDirectory(formData)
      } else {
        // 新增操作
        addDirectory(formData)
      }
    }

    // 新增目录
    const addDirectory = async formData => {
      categoryForm.value.validate(async valid => {
        if (!valid) {
          return
        }
        try {
          loadingText.value = '正在创建目录'
          loading.value = true
          delete formData.id // 新增操作不需要 id
          const response = await addCategory({
            name: formData.name,
            level: parseInt(formData.level),
            superiorId: formData.superiorId === null ? 0 : formData.superiorId,
          })
          if (response.code === 20005) {
            notification.notifySuccess('新增目录成功', '')
            fetchDirectories()
          } else {
            notification.notifyError('新增目录失败', response.message)
          }
          dialogVisible.value = false
        } catch (error) {
          notification.notifyError('错误', error)
          dialogVisible.value = false
        } finally {
          loadingText.value = '正在加载目录信息'
          loading.value = false
        }
      })
    }

    // 更新目录
    const updateDirectory = formData => {
      categoryForm.value.validate(async valid => {
        if (!valid) {
          return
        }
        try {
          loadingText.value = '正在更新目录'
          loading.value = true
          const response = await updateCategory({
            id: formData.id,
            name: formData.name,
            level: parseInt(formData.level),
            superiorId: formData.superiorId === null ? 0 : formData.superiorId,
          })
          if (response.code === 20006) {
            notification.notifySuccess('更新目录成功', '')
            fetchDirectories()
          } else {
            notification.notifyError('更新目录失败', response.message)
          }
          dialogVisible.value = false
        } catch (error) {
          notification.notifyError('错误', error)
          dialogVisible.value = false
        } finally {
          loadingText.value = '正在加载目录信息'
          loading.value = false
        }
      })
    }

    // 打开删除弹窗
    const openDeleteDialog = data => {
      selectedNode.value = data
      deleteDialogVisible.value = true
    }

    // 重置删除弹窗
    const resetDeleteDialog = () => {
      deleteDialogVisible.value = false
    }

    // 删除目录
    const deleteDirectory = () => {
      loadingText.value = '正在删除目录'
      loading.value = true
      deleteCategoryById(selectedNode.value.id)
        .then(response => {
          if (response.code === 20007) {
            notification.notifySuccess('删除目录成功', '')
            fetchDirectories()
          } else {
            notification.notifyError('删除目录失败', response.message)
          }
          deleteDialogVisible.value = false
        })
        .catch(error => {
          notification.notifyError('错误', error)
          deleteDialogVisible.value = false
        })
        .finally(() => {
          loadingText.value = '正在加载目录信息'
          loading.value = false
        })
    }

    // 页面加载时获取目录数据
    onMounted(() => {
      fetchDirectories()
    })

    return {
      loading,
      loadingText,
      directoryData,
      allDirectories,
      categoryForm,
      categoryRules,
      dialogVisible,
      deleteDialogVisible,
      selectedNode,
      formData,
      treeProps,
      filteredDirectories,
      handleNodeClick,
      openAddDialog,
      openEditDialog,
      resetDialog,
      saveDirectory,
      addDirectory,
      updateDirectory,
      openDeleteDialog,
      resetDeleteDialog,
      deleteDirectory,
    }
  },
}
</script>

<style scoped>
.category-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  justify-content: center;
  align-items: center;
}
.button-action {
  margin-left: 300px;

  .el-button {
    margin-left: 10px;
  }
}

.el-tree {
  padding: 40px;
  width: 700px;
  border: 2px solid #ebeef5;
}

::v-deep(.el-tree-node) {
  margin-top: 10px;
}
</style>
