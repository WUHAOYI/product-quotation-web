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
      component: () => import('../views/Video.vue'),
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
  ],
})

export default router
