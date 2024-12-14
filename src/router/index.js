import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: () => import('../views/Login.vue'),
    },
    {
      path: '/info',
      name: 'info',
      component: () => import('../views/Info.vue'),
    },
    //视频
    {
      path: '/video',
      name: 'video',
      redirect: '/video/upload',
      children: [
        {
          path: 'upload',
          name: 'video-upload',
          component: () => import('../views/video/VideoUpload.vue'), // 上传视频页面组件
        },
        {
          path: 'list',
          name: 'video-list',
          component: () => import('../views/video/VideoList.vue'), // 视频列表页面组件
        },
      ],
    },
    //商品
    {
      path: '/product',
      name: 'product',
      redirect: '/product/list',
      children: [
        {
          path: 'list',
          name: 'product-list',
          component: () => import('../views/product/ProductList.vue'), // 商品列表页面组件
        },
        {
          path: 'add',
          name: 'product-add',
          component: () => import('../views/product/AddProduct.vue'), //添加商品页面组件
        },
        {
          path: 'add/batch',
          name: 'product-add-batch',
          component: () => import('../views/product/AddProductBatch.vue'), //批量添加商品页面组件
        },
        {
          path: 'edit/:id',
          name: 'product-edit',
          component: () => import('../views/product/EditProduct.vue'), //编辑商品页面组件
        },
      ],
    },
    {
      path: '/category',
      name: 'category',
      redirect: '/category/list',
      children: [
        {
          path: 'list',
          name: 'category-list',
          component: () => import('../views/category/CategoryList.vue'), // 分类列表页面组件
        },
      ],
    },
    {
      path: '/time',
      name: 'time',
      component: () => import('../views/Time.vue'),
    },
  ],
})

export default router
