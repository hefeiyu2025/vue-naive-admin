import { defineStore } from 'pinia'

interface UserState {
  token: string | null
  userInfo: {
    id: number
    username: string
    avatar: string
    role: string
  } | null
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    token: null,
    userInfo: null,
  }),
  actions: {
    setToken(token: string) {
      this.token = token
    },
    setUserInfo(userInfo: UserState['userInfo']) {
      this.userInfo = userInfo
    },
    logout() {
      this.token = null
      this.userInfo = null
    },
  },
}) 