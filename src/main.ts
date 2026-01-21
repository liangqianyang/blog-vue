import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import lazyLoad from './directives/lazyLoad'
import '@/assets/styles/main.scss'

const app = createApp(App)

// 注册全局指令
app.directive('lazy', lazyLoad)

// 注册插件
app.use(createPinia())
app.use(router)

// 路由守卫 - 页面加载进度提示
router.beforeEach((_to, _from, next) => {
  // 可以在这里添加 NProgress 等加载进度条
  next()
})

router.afterEach(() => {
  // 页面加载完成
})

app.mount('#app')
