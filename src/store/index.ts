import { createPinia } from 'pinia'

const store = createPinia()

export { store }

// 导出组合式 API
export { useUserStore } from './modules/user'
export { usePermissionStore } from './modules/permission'

export default store 