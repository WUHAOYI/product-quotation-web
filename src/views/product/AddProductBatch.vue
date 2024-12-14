<template>
  <div
    class="batch-upload"
    :element-loading-text="loadingText"
    v-loading="loading"
  >
    <el-card>
      <h2>批量上传商品</h2>

      <el-form :model="form" label-width="120px">
        <!-- 选择商品种类 -->
        <el-form-item label="商品种类" prop="categoryPath">
          <el-cascader
            v-model="category.path"
            :options="categoryOptions"
            :props="categoryProps"
            :show-all-levels="false"
            clearable
            change-on-select
            placeholder="请选择商品目录"
            @change="handleCategoryChange"
          />
        </el-form-item>
        <el-form-item label="文件夹路径" prop="folderPath">
          <!-- 显示选择的文件夹路径 -->
          <el-input
            v-model="form.folderPath"
            placeholder="请选择文件夹"
            readonly
          />
          <!-- 隐藏的input用于选择文件夹 -->
          <input
            type="file"
            id="folderInput"
            ref="folderInput"
            style="display: none"
            webkitdirectory
            @change="handleFolderSelect"
          />
          <el-button
            @click="selectFolder"
            type="success"
            style="margin-top: 10px"
            >选择文件夹</el-button
          >
        </el-form-item>
      </el-form>

      <div v-if="subFolders.length" class="sub-folders">
        <h3>解析结果：</h3>
        <ul>
          <li v-for="(folder, index) in subFolders" :key="index">
            <strong>{{ folder.name }}</strong
            ><br />
            <span
              >封面图:
              <a :href="folder.coverImage.imageUrl" target="_blank">{{
                folder.coverImage.imageUrl
              }}</a> </span
            ><br />
            <span>
              详情图:
              <ul>
                <li v-for="(image, i) in folder.detailImages" :key="i">
                  <a :href="image.imageUrl" target="_blank">{{
                    image.imageUrl
                  }}</a>
                </li>
              </ul>
            </span>
          </li>
        </ul>
      </div>

      <el-button
        @click="handleAddProducts"
        type="primary"
        style="margin-top: 20px"
      >
        上传商品
      </el-button>

      <!-- Log section -->
      <div class="log-section">
        <h3>上传日志</h3>
        <ul>
          <li v-for="(log, index) in logs" :key="index" :class="log.type">
            {{ index + 1 }}. {{ log.message }}
          </li>
        </ul>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { addProduct, saveProductImages, getCategories } from '@/utils/api'

const form = ref({
  folderPath: '',
})

const loading = ref(false)
const loadingText = ref('正在加载数据')
const loadingDetail = ref(false) // 上传商品的loading状态
const loadingImage = ref(false) // 上传图片的loading状态
const category = ref({
  path: '', // 商品目录路径
  data: null, // 商品目录数据
}) // 商品种类
const categoryOptions = ref([])
const categoryProps = ref({
  value: 'id',
  label: 'categoryName',
  children: 'children',
  disabled: node => !node.isLeaf,
})
const categoryData = ref([])
const subFolders = ref([])

// Logs array to store messages with type (success, skip, error)
const logs = ref([])

// 选择文件夹按钮点击事件
const selectFolder = () => {
  const folderInput = document.getElementById('folderInput')
  folderInput.click() // 模拟点击input标签，打开文件夹选择器
}

// 处理文件夹选择并解析子文件夹
const handleFolderSelect = event => {
  const files = event.target.files
  const folderData = []

  // 遍历选择的文件夹中的所有文件，解析子文件夹和文件
  Array.from(files).forEach(file => {
    const folderPath = file.webkitRelativePath
    const pathParts = folderPath.split('/') // 分割路径
    const subFolderName = pathParts[1] // 获取文件的第一个部分，即子文件夹名称

    // 如果没有该子文件夹，则添加
    let folder = folderData.find(f => f.name === subFolderName)
    if (!folder) {
      folder = { name: subFolderName, images: [] }
      folderData.push(folder)
    }

    // 为每个文件生成临时 URL
    const imageUrl = URL.createObjectURL(file) // 生成文件的临时 URL
    file.imageUrl = imageUrl // 将 URL 存储到文件对象

    // 将文件加入子文件夹的图片列表
    folder.images.push(file)
  })

  // 为每个子文件夹选择封面图和详情图
  subFolders.value = folderData.map(folder => {
    const coverImage = folder.images[0] // 第一张图片作为封面图
    const detailImages = folder.images.slice(1) // 其余图片作为详情图
    return {
      name: folder.name, // 商品名称与描述使用子文件夹名称
      coverImage,
      detailImages,
    }
  })

  form.value.folderPath = files[0].webkitRelativePath.split('/')[0] // 显示选择的文件夹路径
}

// 获取所有商品种类信息
const fetchCategories = async () => {
  try {
    loading.value = true
    const response = await getCategories()
    if (response.code === 20004) {
      categoryData.value = response.data
      convertToCascaderOptions(categoryData.value, categoryOptions.value)
    }
  } catch (error) {
    console.error('获取商品目录失败', error)
  } finally {
    loading.value = false
  }
}

const convertToCascaderOptions = (data, options, level = 1) => {
  data.forEach(item => {
    const cascaderItem = {
      id: item.id,
      categoryName: item.categoryName,
      isLeaf: level === 3 || (item.children && item.children.length !== 0),
    }
    if (item.children && item.children.length > 0 && level < 3) {
      cascaderItem.children = []
      convertToCascaderOptions(item.children, cascaderItem.children, level + 1)
    }
    options.push(cascaderItem)
  })
}

// 处理商品目录改变事件
const handleCategoryChange = value => {
  if (value.length === 1) {
  } else if (value.length === 2) {
  } else if (value.length === 3) {
    category.value.data = value[2]
    category.value.path = value
  }
}

onMounted(() => {
  fetchCategories()
})

// 批量上传商品（每个子文件夹为一个商品）
const handleAddProducts = async () => {
  // Clear logs before starting
  logs.value = []

  for (const folder of subFolders.value) {
    // Skip uploading if no cover image is present
    if (!folder.coverImage) {
      logs.value.push({
        message: `商品 [${folder.name}] 没有封面图，跳过上传。`,
        type: 'skip',
      })
      continue
    }

    const formData = new FormData()
    formData.append('categoryId', category.value.data)
    formData.append('productName', folder.name) // 商品名称来自子文件夹名称
    formData.append('productIntro', folder.name) // 商品描述同样使用子文件夹名称
    formData.append('productLowPrice', 0) // 商品价格为0
    formData.append('productHighPrice', 0) // 商品价格为0

    // 上传封面图（如果有）
    formData.append('image', folder.coverImage)

    try {
      loadingDetail.value = true
      const response = await addProduct(formData, {
        'Content-Type': 'multipart/form-data', // 设置请求头为表单数据类型
      })

      if (response.code === 20009) {
        logs.value.push({
          message: `商品 [${folder.name}] 上传成功`,
          type: 'success',
        })

        // 获取商品 ID 后上传详情图
        const productId = response.data.productId
        if (folder.detailImages.length === 0) {
          logs.value.push({
            message: `商品 [${folder.name}] 没有详情图，跳过详情图上传。`,
            type: 'skip',
          })
        } else {
          await handleSaveProductImages(productId, folder)
        }
      } else {
        logs.value.push({
          message: `商品 [${folder.name}] 上传失败: ${response.message}`,
          type: 'error',
        })
      }
    } catch (error) {
      logs.value.push({
        message: `商品 [${folder.name}] 上传出错: ${error}`,
        type: 'error',
      })
    } finally {
      loadingDetail.value = false
    }
  }
}

// 上传商品详情图
const handleSaveProductImages = async (productId, folder) => {
  const formData = new FormData()
  formData.append('productId', productId)
  folder.detailImages.forEach(image => {
    formData.append('images', image)
  })
  try {
    loadingImage.value = true
    const response = await saveProductImages(formData)
    if (response.code === 20015) {
      logs.value.push({
        message: `商品 [${folder.name}] 详情图上传成功`,
        type: 'success',
      })
    } else {
      logs.value.push({
        message: `商品 [${folder.name}] 详情图上传失败: ${response.message}`,
        type: 'error',
      })
    }
  } catch (error) {
    logs.value.push({
      message: `商品 [${folder.name}] 详情图上传出错: ${error}`,
      type: 'error',
    })
  } finally {
    loadingImage.value = false
  }
}
</script>

<style scoped>
.batch-upload {
  width: 80%;
  display: flex;
  flex-direction: column;
  padding: 20px;
  height: auto;
  overflow-y: auto;
  box-sizing: border-box;
  position: absolute;
  top: 10%;
}

.sub-folders {
  max-height: 300px;
  overflow-y: auto;
  margin-top: 20px;
}

.log-section {
  max-height: 300px;
  overflow-y: auto;
  margin-top: 20px;
}
.log-section ul {
  list-style-type: none;
  padding: 0;
}

.log-section li {
  margin-bottom: 5px;
}

.log-section .success {
  color: green;
}

.log-section .skip {
  color: orange;
}

.log-section .error {
  color: red;
}
</style>
