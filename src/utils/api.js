import { get, post, put, del } from '@/utils/request'
// const baseUrl = 'http://47.121.176.15:8888'
// const baseUrl = 'http://localhost:8888'
const baseUrl = 'http://ljwzcc2.tpddns.cn:8888'

//个人信息
export const getUserInfo = p => get(baseUrl + '/user')
export const updateUserInfo = (p, header) => put(baseUrl + '/user', p, header)
export const uploadVideo = (p, header) => post(baseUrl + '/video', p, header)
//视频
export const getVideoList = p => get(baseUrl + '/video', p)
export const deleteVideoById = p => del(baseUrl + '/video/' + p)
//上新
export const getTime = () => get(baseUrl + '/time')
export const updateTime = p => put(baseUrl + '/time/' + p)

//目录
export const getCategories = p => get(baseUrl + '/category', p) //获取目录列表
export const addCategory = p => post(baseUrl + '/category', p) // 添加目录
export const updateCategory = p => put(baseUrl + '/category', p) // 更新目录
export const deleteCategoryById = p => del(baseUrl + '/category/' + p) //删除目录

//商品
export const getProducts = p => get(baseUrl + '/product/query', p)
export const getProductById = p => get(baseUrl + '/product/' + p) //获取商品详情
export const addProduct = (p, header) => post(baseUrl + '/product', p, header) //添加商品
export const updateProduct = (p, header) => put(baseUrl + '/product', p, header) //更新商品信息
export const deleteProductById = p => del(baseUrl + '/product/' + p) //删除商品

export const deleteProductImage = p => del(baseUrl + '/product/image', p) //删除商品图片
export const saveProductImages = (p, header) =>
  post(baseUrl + '/product/image', p, header) //添加商品图片

export const updateProductSpec = (p, header) =>
  put(baseUrl + '/product/spec', p, header) //更新商品规格信息
export const deleteProductSpec = p => del(baseUrl + '/product/spec', p) //删除商品规格信息
export const saveProductSpecs = (p, header) =>
  post(baseUrl + '/product/spec', p, header) //添加商品规格信息

export const updateProductOption = (p, header) =>
  put(baseUrl + '/product/option', p, header) //更新商品自定义选项
export const deleteProductOption = p => del(baseUrl + '/product/option', p) //删除商品自定义选项
export const saveProductOptions = (p, header) =>
  post(baseUrl + '/product/option', p, header) //添加商品自定义选项

//授权
export const getAllowedUser = p => get(baseUrl + '/user/allowedUser', p)
export const getAllowedUserByUsername = p =>
  get(baseUrl + '/user/allowedUser/' + p)
export const addAllowedUser = p => post(baseUrl + '/user/allowedUser', p)
export const addAllowedUserBatch = p =>
  post(baseUrl + '/user/allowedUserList', p)
export const deleteAllowedUser = p => del(baseUrl + '/user/allowedUser/' + p)
