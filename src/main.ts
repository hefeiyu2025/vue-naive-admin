import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './styles/global.css'
import i18n from './locales'

// 判断是否需要启用 mock
if (import.meta.env.VITE_APP_MOCK === 'true' && import.meta.env.PROD) {
  // 动态导入 mock 服务器
  import('../mock/index').then(({ setupProdMockServer }) => {
    setupProdMockServer()
  })
}

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(i18n)

app.mount('#app')
