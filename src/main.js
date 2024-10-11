//引入全局样式
import './assets/main.css'
import './assets/global.css'

//创建Vue实例
import { createApp } from 'vue'
import App from './App.vue'
const app = createApp(App)

//引入状态管理库 Pinia
import { createPinia } from 'pinia'
//引入路由
import router from './router'
// 引入 Element Plus 和样式
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css' // 引入 Element Plus 的 CSS 样式
//引入axios
import axios from 'axios'
//引入Element Plus的国际化
import locale from 'element-plus/es/locale/lang/zh-cn'
//引入Element Plus的图标
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

//将插件挂载到 Vue 应用
app.use(createPinia())
app.use(router)
app.use(ElementPlus, { locale })
app.config.globalProperties.$axios = axios

//挂载Vue实例到DOM
app.mount('#app')
