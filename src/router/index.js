import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'info',
      component: () => import('../views/Info.vue'),
    },
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

    {
      path: '/product',
      name: 'product',
      component: () => import('../views/Product.vue'),
    },
    {
      path: '/category',
      name: 'category',
      component: () => import('../views/Category.vue'),
    },
    {
      path: '/time',
      name: 'time',
      component: () => import('../views/Time.vue'),
    },
  ],
})

export default router
