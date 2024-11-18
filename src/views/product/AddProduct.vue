<template>
  <div
    class="product-edit-container"
    v-loading="loading"
    :element-loading-text="loadingText"
  >
    <!--返回商品列表-->
    <el-button
      type="warning"
      style="width: 120px; align-self: flex-start; margin-left: 30px"
      @click="goBack"
      >返回商品列表</el-button
    >

    <h2 class="product-title">商品详情信息:</h2>
    <!-- 商品详情表单 -->
    <el-form
      :model="productDetail"
      :rules="productRules"
      ref="productForm"
      label-width="100px"
      v-loading="loadingDetail"
      :element-loading-text="loadingDetailText"
    >
      <!-- 商品名称 -->
      <el-form-item label="商品名称" prop="name">
        <el-input
          v-model="productDetail.name"
          placeholder="请输入商品名称"
          size="large"
        />
      </el-form-item>

      <!-- 商品描述 -->
      <el-form-item label="商品描述" prop="description">
        <el-input
          v-model="productDetail.description"
          placeholder="请输入商品描述"
          size="large"
        />
      </el-form-item>

      <!-- 商品目录选择 -->
      <el-form-item label="商品种类" prop="categoryPath">
        <el-cascader
          v-model="productDetail.categoryPath"
          :options="categoryOptions"
          :props="categoryProps"
          :show-all-levels="false"
          clearable
          change-on-select
          placeholder="请选择商品目录"
          @change="handleCategoryChange"
        />
      </el-form-item>
      <!-- 商品价格 -->
      <el-form-item
        label="商品最低价"
        v-if="productDetail.specs.length !== 0"
        prop="lowPrice"
        type="number"
      >
        <el-input
          v-model="productDetail.lowPrice"
          size="large"
          :disabled="showProductDetail"
          type="number"
        />
      </el-form-item>

      <el-form-item
        label="商品最高价"
        v-if="productDetail.specs.length !== 0"
        prop="lowPrice"
      >
        <el-input
          v-model="productDetail.highPrice"
          size="large"
          :disabled="showProductDetail"
          type="number"
        />
      </el-form-item>

      <el-form-item
        label="商品价格"
        v-if="productDetail.specs.length === 0"
        prop="lowPrice"
      >
        <el-input
          v-model="productDetail.lowPrice"
          size="large"
          :disabled="showProductDetail"
        />
      </el-form-item>

      <!-- 商品封面图 -->
      <el-form-item label="商品封面图" prop="avatar">
        <div>
          <div>
            <input
              type="file"
              accept="image/*"
              @change="handleAvatarChange"
              style="display: none"
              ref="AvatarFileInput"
            />
            <div class="avatar-uploader">
              <!-- 点击显示文件选择框 -->
              <img
                v-if="avatarUrl"
                :src="avatarUrl"
                style="width: 100px; height: 100px"
                alt="Avatar"
              />
            </div>
            <el-button
              type="primary"
              @click="selectAvatarFile"
              v-if="showAddButton"
              >点击上传头像</el-button
            >
          </div>
        </div>
      </el-form-item>

      <!-- 添加商品按钮 -->
      <el-button
        @click="handleAddProduct"
        type="success"
        class="button-save"
        v-if="showAddButton"
        >添加商品</el-button
      >
    </el-form>

    <!--其他商品信息-->
    <div v-if="showProductDetail" class="product-detail">
      <h2 class="product-title">商品图片信息:</h2>
      <!-- 商品图片管理 -->
      <div
        class="image-section"
        v-loading="loadingImage"
        :element-loading-text="loadingImageText"
      >
        <el-empty
          v-if="productDetail.images.length === 0"
          description="暂无商品详情图信息"
        />
        <el-form-item v-if="productDetail.images.length !== 0">
          <div class="image-list">
            <div
              v-for="(image, index) in productDetail.images"
              :key="index"
              class="image-item"
            >
              <img
                :src="image"
                alt="商品图片"
                style="width: 80px; height: 80px; margin-bottom: 10px"
              />
              <el-button
                @click="removeProductImage(image)"
                size="small"
                type="danger"
                >删除</el-button
              >
            </div>
          </div>
        </el-form-item>

        <div class="button-action">
          <el-upload
            :show-file-list="false"
            :multiple="true"
            :auto-upload="false"
            :on-change="handleProductImagesChange"
            accept=".jpg, .png, .JPG, .PNG, .jpeg, .JPEG"
          >
            <el-button type="primary" class="button-save">添加详情图</el-button>
          </el-upload>
          <el-button
            type="success"
            class="button-save"
            style="margin-left: 40px"
            @click="handleSaveProductImages"
            >确认上传</el-button
          >
        </div>
      </div>

      <h2 class="product-title">商品规格信息:</h2>
      <!-- 商品规格管理 -->
      <el-form
        class="spec-section"
        v-loading="loadingSpec"
        :element-loading-text="loadingSpecText"
      >
        <el-empty
          v-if="productDetail.specs.length === 0"
          description="暂无商品规格信息"
        />
        <div v-if="productDetail.specs.length !== 0">
          <div
            v-for="(spec, index) in productDetail.specs"
            :key="index"
            class="spec-option-item"
          >
            <el-input
              v-model="spec.name"
              placeholder="规格名称"
              size="default"
            />
            <el-input
              v-model="spec.value"
              placeholder="规格值"
              size="default"
              type="number"
            />
            <div>
              <el-button
                @click="HandleDeleteProductSpec(spec)"
                size="default"
                type="danger"
                >删除</el-button
              >
              <el-button
                v-if="spec.originName !== ''"
                @click="handleUpdateProductSpec(spec)"
                size="default"
                type="success"
                >更新</el-button
              >
            </div>
          </div>
        </div>

        <div class="button-action">
          <el-button
            class="button-save"
            @click="addProductSpec"
            size="default"
            type="primary"
            >添加商品规格</el-button
          >
          <el-button
            class="button-save"
            @click="handleSaveProductSpec"
            size="default"
            type="success"
            >保存商品规格</el-button
          >
        </div>
      </el-form>

      <h2 class="product-title">商品自定义选项信息:</h2>
      <!-- 商品自定义选项管理 -->
      <div
        class="option-section"
        v-loading="loadingOpt"
        :element-loading-text="loadingOptText"
      >
        <el-empty
          v-if="productDetail.options.length === 0"
          description="暂无商品自定义选项信息"
        />
        <el-form-item v-if="productDetail.options.length !== 0">
          <div
            v-for="(option, index) in productDetail.options"
            :key="index"
            class="spec-option-item"
          >
            <el-input
              v-model="option.name"
              placeholder="选项名称"
              size="default"
            />
            <el-input
              v-model="option.info"
              placeholder="选项值"
              size="default"
            />
            <div>
              <el-button
                @click="handleDeleteProductOption(option)"
                size="default"
                type="danger"
                >删除</el-button
              >
              <el-button
                v-if="option.originName !== ''"
                @click="handleUpdateProductOption(option)"
                size="default"
                type="primary"
                >更新</el-button
              >
            </div>
          </div>
        </el-form-item>
        <div class="button-action" style="margin-bottom: 100px">
          <el-button
            class="button-save"
            @click="addProductOption"
            size="default"
            type="primary"
            >添加商品自定义选项</el-button
          >
          <el-button
            @click="handleSaveProductOptions"
            type="success"
            class="button-save"
            >保存商品自定义选项</el-button
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import * as notification from '@/utils/notification'
import {
  getProductById,
  addProduct,
  deleteProductImage,
  saveProductImages,
  updateProductSpec,
  deleteProductSpec,
  saveProductSpecs,
  updateProductOption,
  deleteProductOption,
  saveProductOptions,
  getCategories,
} from '@/utils/api'

export default {
  name: 'ProductEdit',
  setup() {
    const productForm = ref(null)
    const showProductDetail = ref(false)
    const showAddButton = ref(true)
    const productRules = ref({
      name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
      description: [
        { required: true, message: '请输入商品描述', trigger: 'blur' },
      ],
      lowPrice: [
        { required: true, message: '请输入商品价格', trigger: 'blur' },
        {
          pattern: /^[0-9]*$/,
          message: '价格只能输入数字',
          trigger: 'blur',
        },
      ],
      avatar: [
        { required: true, message: '请上传商品封面图', trigger: 'change' },
      ],
      categoryPath: [
        { required: true, message: '请选择商品种类', trigger: 'change' },
      ],
    })
    const router = useRouter()
    const loading = ref(false)
    const loadingText = ref('正在加载数据')
    const categoryData = ref([])
    // 将商品目录数据转换为 cascader 组件所需的格式
    const categoryOptions = ref([])
    const categoryProps = ref({
      value: 'id',
      label: 'categoryName',
      children: 'children',
      disabled: node => !node.isLeaf,
    })
    const avatarUrl = ref('') // 封面图URL
    const avatarFile = ref(null) // 存储上传的封面图文件
    const avatarFileName = ref('') // 存储上传的封面图文件名
    const imageFiles = ref([]) // 存储上传的封面图文件
    const loadingDetail = ref(false) // 加载商品详情状态
    const loadingImage = ref(false) // 加载商品图片状态
    const loadingSpec = ref(false) // 加载商品规格状态
    const loadingOpt = ref(false) // 加载商品自定义选项状态
    const loadingDetailText = ref('正在添加商品')
    const loadingImageText = ref('正在保存商品图片')
    const loadingSpecText = ref('正在保存商品规格')
    const loadingOptText = ref('正在保存商品自定义选项')

    const productDetail = ref({
      id: null,
      name: '',
      description: '',
      categoryId: 6,
      lowPrice: 0,
      images: [],
      specs: [],
      options: [],
      avatar: '', // 商品封面图字段
      categoryPath: [], // 商品目录路径
    })

    // 返回商品列表
    const goBack = () => {
      router.push('/product/list')
    }

    // 获取所有商品种类信息
    const fetchCategories = async () => {
      try {
        loading.value = true
        const response = await getCategories()
        if (response.code === 20004) {
          categoryData.value = response.data
          convertToCascaderOptions(categoryData.value, categoryOptions.value)
          setCategoryPath(productDetail.value.categoryId, categoryOptions.value)
        }
      } catch (error) {
        console.error('获取商品目录失败', error)
      } finally {
        loading.value = false
      }
    }

    // 获取商品详情
    const loadProductDetail = async productId => {
      try {
        loading.value = true
        const response = await getProductById(productId)
        if (response.code === 20012) {
          console.log(response.data)
          productDetail.value = response.data
          avatarUrl.value = productDetail.value.avatar
          handleMetrics(productDetail)
          notification.notifySuccess('获取商品详情成功', '')
          showAddButton.value = false
          showProductDetail.value = true
          setCategoryPath(productDetail.value.categoryId, categoryOptions.value)
        } else {
          notification.notifyError('获取商品详情失败', response.message)
          console.error('获取商品详情失败')
        }
      } catch (error) {
        notification.notifyError('获取商品详情失败', error)
        console.error('获取商品详情出错', error)
      } finally {
        loading.value = false
      }
    }

    // 添加商品
    const handleAddProduct = async () => {
      productForm.value.validate(async valid => {
        if (!valid) {
          return
        }
        const formData = new FormData()
        formData.append('productId', productDetail.value.id)
        formData.append('categoryId', productDetail.value.categoryId)
        formData.append('productName', productDetail.value.name)
        formData.append('productIntro', productDetail.value.description)
        //初始增加商品时，商品价格为最低价
        formData.append('productLowPrice', productDetail.value.lowPrice)
        formData.append('productHighPrice', productDetail.value.lowPrice)

        if (avatarFile.value) {
          formData.append('image', avatarFile.value)
        }

        try {
          loadingDetail.value = true
          const response = await addProduct(formData, {
            'Content-Type': 'multipart/form-data', // 设置请求头为表单数据类型
          })
          if (response.code === 20009) {
            notification.notifySuccess('商品添加成功', '')
            console.log('商品添加成功')
            loadProductDetail(response.data.productId)
          } else {
            notification.notifyError('商品添加失败', response.message)
            console.error('添加商品失败')
          }
        } catch (error) {
          notification.notifyError('商品添加失败', error)
          console.error('添加商品出错', error)
        } finally {
          loadingDetail.value = false
        }
      })
    }

    // 格式化处理商品详情数据
    const handleMetrics = productDetail => {
      // 处理商品规格
      if (productDetail.value.specs !== null) {
        productDetail.value.specs = productDetail.value.specs.map(spec => {
          return {
            name: spec.name.toString(),
            value: spec.value.toString(),
            originName: spec.name.toString(),
          }
        })
        productDetail.value.minMax = productDetail.value.specs.reduce(
          (acc, cur) => {
            if (acc.min === null || acc.min > cur.value) {
              acc.min = cur.value
            }
            if (acc.max === null || acc.max < cur.value) {
              acc.max = cur.value
            }
            return acc
          },
          { min: null, max: null },
        )
      } else {
        productDetail.value.specs = []
      }
      // 处理商品自定义选项
      if (productDetail.value.options !== null) {
        productDetail.value.options = productDetail.value.options.map(
          option => {
            return {
              name: option.name.toString(),
              info: option.info.toString(),
              originName: option.name.toString(),
            }
          },
        )
      } else {
        productDetail.value.options = []
      }

      if (productDetail.value.images === null) {
        productDetail.value.images = []
      }
    }

    //添加商品详情图
    const handleProductImagesChange = (file, fileList) => {
      if (fileList.length > 100) {
        alert('单次上传文件最大数量为100')
        fileList.splice(0, fileList.length - 100)
      }
      productDetail.value.images.push(URL.createObjectURL(file.raw))
      imageFiles.value.push(file)
      console.log(productDetail.value.images)
    }

    // 添加商品图
    const handleSaveProductImages = async () => {
      try {
        loadingImage.value = true
        const formData = new FormData()
        formData.append('productId', productDetail.value.id)
        imageFiles.value.forEach(file => {
          formData.append('images', file.raw)
        })
        const response = await saveProductImages(formData)
        if (response.code === 20015) {
          notification.notifySuccess('商品图片更新成功', '')
          console.log('商品图片更新成功')
        } else {
          notification.notifyError('商品图片更新失败', response.message)
          console.error('更新商品图片失败')
        }
      } catch (error) {
        notification.notifyError('商品图片更新失败', error)
        console.error('更新商品图片出错', error)
      } finally {
        loadingImage.value = false
      }
    }

    // 删除商品详情图
    const removeProductImage = async image => {
      let prefix = image.split(':')[0]
      if (prefix === 'blob') {
        productDetail.value.images = productDetail.value.images.filter(
          img => img !== image,
        )
        return
      }
      let imageName = image.split('/').pop()
      try {
        loadingImage.value = true
        loadingImageText.value = '正在删除商品图片'
        const response = await deleteProductImage({
          productId: productDetail.value.id,
          imageName: imageName,
        })
        if (response.code === 20016) {
          productDetail.value.images = productDetail.value.images.filter(
            img => img !== image,
          )
          notification.notifySuccess('删除图片成功', '')
          console.log('删除图片成功')
        } else {
          notification.notifyError('删除图片失败', response.message)
          console.error('删除图片失败')
        }
      } catch (error) {
        notification.notifyError('删除图片失败', error)
        console.error('删除图片失败', error)
      } finally {
        loadingImage.value = false
        loadingImageText.value = '正在保存商品图片'
      }
    }

    // 添加商品规格
    const addProductSpec = () => {
      productDetail.value.specs.push({ name: '', value: '', originName: '' })
    }

    // 更新商品规格
    const handleUpdateProductSpec = async spec => {
      const oldSpecName = spec.originName
      try {
        loadingSpec.value = true
        loadingSpecText.value = '正在更新商品规格'
        const response = await updateProductSpec({
          productId: productDetail.value.id,
          productSpecOldName: oldSpecName,
          productSpecName: spec.name,
          productSpecValue: spec.value,
        })
        if (response.code === 20019) {
          notification.notifySuccess('商品规格更新成功', '')
          console.log('商品规格更新成功')
          loadProductDetail(productDetail.value.id)
        } else {
          notification.notifyError('商品规格更新失败', response.message)
          console.error('更新商品规格失败')
        }
      } catch (error) {
        notification.notifyError('商品规格更新失败', error)
        console.error('更新商品规格失败', error)
      } finally {
        loadingSpec.value = false
        loadingSpecText.value = '正在保存商品规格'
      }
    }

    // 保存商品规格
    const handleSaveProductSpec = async () => {
      let specs = productDetail.value.specs
      let productSpecs = []
      specs.forEach(spec => {
        if (spec.originName === '') {
          productSpecs.push({
            productId: productDetail.value.id,
            productSpecName: spec.name,
            productSpecValue: spec.value,
          })
        }
      })
      try {
        loadingSpec.value = true
        const response = await saveProductSpecs({
          productSpecs: productSpecs,
        })
        if (response.code === 20017) {
          notification.notifySuccess('商品规格添加成功', '')
          console.log('商品规格添加成功')
          loadProductDetail(productDetail.value.id)
        } else {
          notification.notifyError('商品规格添加失败', response.message)
          console.error('添加商品规格失败')
        }
      } catch (error) {
        notification.notifyError('商品规格添加失败', error)
        console.error('添加商品规格出错', error)
      } finally {
        loadingSpec.value = false
      }
    }

    // 删除商品规格
    const HandleDeleteProductSpec = async (spec, index) => {
      const specName = spec.name
      const originName = spec.originName
      if (originName === '') {
        productDetail.value.specs = productDetail.value.specs.filter(
          spec => spec.name !== specName,
        )
        return
      }
      try {
        loadingSpec.value = true
        loadingSpecText.value = '正在删除商品规格'
        const response = await deleteProductSpec({
          productId: productDetail.value.id,
          productSpecName: specName,
          productSpecValue: spec.value,
        })
        if (response.code === 20018) {
          notification.notifySuccess('商品规格删除成功', '')
          console.log('商品规格删除成功')
          productDetail.value.specs = productDetail.value.specs.filter(
            spec => spec.name !== specName,
          )
          loadProductDetail(productDetail.value.id)
        } else {
          notification.notifyError('商品规格删除失败', response.message)
          console.error('删除商品规格失败')
        }
      } catch (error) {
        notification.notifyError('商品规格删除失败', error)
        console.error('删除商品规格失败', error)
      } finally {
        loadingSpec.value = false
        loadingSpecText.value = '正在保存商品规格'
      }
    }

    // 添加自定义选项
    const addProductOption = () => {
      productDetail.value.options.push({ name: '', info: '', originName: '' })
    }

    // 更新自定义选项
    const handleUpdateProductOption = async option => {
      const oldOptionName = option.originName
      try {
        loadingOpt.value = true
        loadingOptText.value = '正在更新商品自定义选项'
        const response = await updateProductOption({
          productId: productDetail.value.id,
          productOptionOldName: oldOptionName,
          productOptionName: option.name,
          productOptionInfo: option.info,
        })
        if (response.code === 20022) {
          console.log('商品自定义选项更新成功')
        } else {
          console.error('更新商品自定义选项失败')
        }
      } catch (error) {
        console.error('更新商品自定义选项失败', error)
      } finally {
        loadingOpt.value = false
        loadingOptText.value = '正在保存商品自定义选项'
      }
    }

    // 保存商品自定义选项
    const handleSaveProductOptions = async () => {
      let options = productDetail.value.options
      let productOptions = []
      options.forEach(option => {
        if (option.originName === '') {
          productOptions.push({
            productId: productDetail.value.id,
            productOptionName: option.name,
            productOptionInfo: option.info,
          })
        }
      })
      try {
        loadingOpt.value = true
        const response = await saveProductOptions({
          productOptions: productOptions,
        })
        if (response.code === 20020) {
          notification.notifySuccess('商品自定义选项添加成功', '')
          console.log('商品自定义选项添加成功')
          handleMetrics(productDetail)
        } else {
          notification.notifyError('商品自定义选项添加失败', response.message)
          console.error('添加商品自定义选项失败')
        }
      } catch (error) {
        notification.notifyError('商品自定义选项添加失败', error)
        console.error('添加商品自定义选项失败', error)
      } finally {
        loadingOpt.value = false
      }
    }

    // 删除自定义选项
    const handleDeleteProductOption = async option => {
      const oldOptionName = option.originName
      if (oldOptionName === '') {
        productDetail.value.options = productDetail.value.options.filter(
          opt => opt.name !== option.name,
        )
        return
      }
      try {
        loadingOpt.value = true
        loadingOptText.value = '正在删除商品自定义选项'
        const response = await deleteProductOption({
          productId: productDetail.value.id,
          productOptionName: option.name,
        })
        if (response.code === 20021) {
          notification.notifySuccess('商品自定义选项删除成功', '')
          console.log('商品自定义选项删除成功')
          productDetail.value.options = productDetail.value.options.filter(
            opt => opt.name !== option.name,
          )
        } else {
          notification.notifyError('商品自定义选项删除失败', response.message)
          console.error('删除商品自定义选项失败')
        }
      } catch (error) {
        notification.notifyError('商品自定义选项删除失败', error)
        console.error('删除商品自定义选项失败', error)
      } finally {
        loadingOpt.value = false
        loadingOptText.value = '正在保存商品自定义选项'
      }
    }

    // 初始化页面数据
    onMounted(() => {
      fetchCategories()
    })

    const convertToCascaderOptions = (data, options, level = 1) => {
      data.forEach(item => {
        const cascaderItem = {
          id: item.id,
          categoryName: item.categoryName,
          isLeaf: level === 3 || (item.children && item.children.length !== 0),
        }
        if (item.children && item.children.length > 0 && level < 3) {
          cascaderItem.children = []
          convertToCascaderOptions(
            item.children,
            cascaderItem.children,
            level + 1,
          )
        }
        options.push(cascaderItem)
      })
    }

    // 处理商品目录改变事件
    const handleCategoryChange = value => {
      if (value.length === 1) {
      } else if (value.length === 2) {
      } else if (value.length === 3) {
        productDetail.value.categoryPath = value
        productDetail.value.categoryId = value[2]
      }
    }

    const findCategoryPath = (id, options) => {
      for (const option of options) {
        if (option.id === id) return [option.id]
        if (option.children) {
          const path = findCategoryPath(id, option.children)
          if (path) return [option.id, ...path]
        }
      }
      return null
    }

    const setCategoryPath = (id, options) => {
      const path = findCategoryPath(id, options)
      if (path) {
        productDetail.value.categoryPath = path
      }
    }

    // 显示封面图文件选择框
    const selectAvatarFile = () => {
      const AvatarFileInput = document.querySelector('input[type="file"]') // 获取文件输入框
      AvatarFileInput.click() // 触发点击事件，打开文件选择对话框
    }

    // 选择文件并更新封面图预览
    const handleAvatarChange = event => {
      const file = event.target.files[0] // 获取上传的文件
      if (file) {
        avatarFile.value = file // 存储上传的文件
        avatarUrl.value = URL.createObjectURL(file) // 生成封面图的临时 URL
        productDetail.value.avatar = avatarUrl
        avatarFileName.value = file.name // 获取文件名称
      }
    }

    return {
      showProductDetail,
      showAddButton,
      productRules,
      productForm,
      productDetail,
      avatarUrl,
      loading,
      loadingText,
      loadingDetail,
      loadingImage,
      loadingSpec,
      loadingOpt,
      loadingDetailText,
      loadingImageText,
      loadingSpecText,
      loadingOptText,
      categoryOptions,
      categoryProps,
      goBack,
      handleAddProduct,
      handleProductImagesChange,
      handleSaveProductImages,
      handleSaveProductSpec,
      handleUpdateProductSpec,
      handleSaveProductOptions,
      removeProductImage,
      HandleDeleteProductSpec,
      addProductSpec,
      handleDeleteProductOption,
      addProductOption,
      selectAvatarFile,
      handleAvatarChange,
      handleUpdateProductOption,
      handleCategoryChange,
    }
  },
}
</script>

<style scoped>
.product-edit-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 20px;
}
.product-title {
  align-self: flex-start;
  margin-top: 20px;
  margin-bottom: 30px;
  margin-left: 30px;
}
.el-form {
  width: 80%;
  display: flex;
  flex-direction: column;
  align-self: center;
}

.image-list {
  display: flex;
  flex-wrap: wrap;
}

.image-item {
  display: flex;
  flex-direction: column;
  margin-right: 20px;
  margin-bottom: 10px;
}
.spec-option-item {
  margin: 20px;
}
.spec-option-item .el-input,
.spec-option-item > div {
  margin-top: 10px;
}
.product-detail {
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
}

.cover-image-section,
.image-section,
.spec-section,
.option-section {
  margin-bottom: 30px;
  width: 80%;
  display: flex;
  flex-direction: column;
  align-self: center;
}

.button-save {
  width: 200px;
  align-self: center;
}
.button-action {
  display: flex;
  align-self: center;
}
</style>
