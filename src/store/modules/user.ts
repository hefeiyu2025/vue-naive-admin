import { defineStore } from 'pinia'
import { login as userLogin, logout as userLogout } from '@/api/auth'
import { usePermissionStore } from '@/store'

interface UserState {
  token: string
  userInfo: {
    id: number
    username: string
    avatar: string
    role: string
  } | null
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    token: localStorage.getItem('token') || '',
    userInfo: null,
  }),

  getters: {
    isLogin(): boolean {
      return !!this.token
    },
  },

  actions: {
    async login(username: string, password: string) {
      try {
        const result = await userLogin({ username, password })
        // 确保响应数据的结构正确
        if (result && result.data) {
          const { token, userInfo } = result.data
          this.token = token
          this.userInfo = userInfo
          localStorage.setItem('token', token)
          
          // 登录成功后立即获取权限菜单
          const permissionStore = usePermissionStore()
          await permissionStore.getMenus()
          
          return userInfo
        }
        throw new Error('Invalid login response')
      }
      catch (error) {
        // 登录失败时清除token
        this.token = ''
        this.userInfo = null
        localStorage.removeItem('token')
        return Promise.reject(error)
      }
    },

    async logout() {
      try {
        await userLogout()
      }
      finally {
        // 无论是否成功都清除本地状态
        this.token = ''
        this.userInfo = null
        localStorage.removeItem('token')
        // 清除权限状态
        const permissionStore = usePermissionStore()
        permissionStore.resetPermission()
      }
    },
  },
}) 