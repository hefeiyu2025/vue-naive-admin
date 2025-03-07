import { defineStore } from 'pinia'
import { login as userLogin, logout as userLogout } from '@/api/auth'

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
        const { token, userInfo } = await userLogin({ username, password })
        this.token = token
        this.userInfo = userInfo
        localStorage.setItem('token', token)
        return Promise.resolve(userInfo)
      }
      catch (error) {
        return Promise.reject(error)
      }
    },

    async logout() {
      try {
        await userLogout()
        this.token = ''
        this.userInfo = null
        localStorage.removeItem('token')
        return Promise.resolve()
      }
      catch (error) {
        return Promise.reject(error)
      }
    },
  },
}) 