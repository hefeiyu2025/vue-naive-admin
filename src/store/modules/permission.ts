import { defineStore } from 'pinia'
import { getAllPermissions } from '@/api/permission'
import type { MenuPermission } from '@/api/permission'
import type { RouteRecordRaw } from 'vue-router'

interface PermissionState {
  menus: MenuPermission[]
  routes: RouteRecordRaw[]
}

// 图标映射
const iconMap: Record<string, any> = {
  dashboard: () => import('@vicons/ionicons5').then(m => m.GridOutline),
  user: () => import('@vicons/ionicons5').then(m => m.PersonOutline),
  role: () => import('@vicons/ionicons5').then(m => m.PeopleOutline),
  permission: () => import('@vicons/ionicons5').then(m => m.KeyOutline),
  setting: () => import('@vicons/ionicons5').then(m => m.SettingsOutline),
}

export const usePermissionStore = defineStore('permission', {
  state: (): PermissionState => ({
    menus: [],
    routes: []
  }),

  getters: {
    hasPermission: (state) => (code: string) => {
      const findPermission = (menus: MenuPermission[]): boolean => {
        return menus.some((menu) => {
          if (menu.code === code) return true
          if (menu.children) return findPermission(menu.children)
          return false
        })
      }
      return findPermission(state.menus)
    }
  },

  actions: {
    async getMenus() {
      try {
        const response = await getAllPermissions()
        // 确保response是一个数组
        if (Array.isArray(response)) {
          this.menus = response
          return response
        }
        throw new Error('Invalid menu data')
      } catch (error) {
        console.error('Failed to get menus:', error)
        throw error
      }
    },

    generateRoutes() {
      // 不再生成动态路由，直接返回空数组
      this.routes = []
      return []
    },

    resetPermission() {
      this.menus = []
      this.routes = []
    }
  }
}) 