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
    routes: [],
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
    },
  },

  actions: {
    async getMenus() {
      try {
        const menus = await getAllPermissions()
        this.menus = menus
        return Promise.resolve(menus)
      }
      catch (error) {
        return Promise.reject(error)
      }
    },

    generateRoutes() {
      const generateRoutesFromMenus = (menus: MenuPermission[]): RouteRecordRaw[] => {
        return menus.map(menu => {
          const route: RouteRecordRaw & { redirect?: string } = {
            path: menu.code.toLowerCase(),
            name: menu.code,
            component: menu.children && menu.children.length > 0
              ? () => import('@/layout/index.vue')
              : () => import(`@/views/${menu.code.toLowerCase()}/index.vue`),
            meta: {
              title: menu.name,
              icon: iconMap[menu.code.toLowerCase()],
            },
          }

          if (menu.children && menu.children.length > 0) {
            route.redirect = `${route.path}/${menu.children[0].code.toLowerCase()}`
            route.children = generateRoutesFromMenus(menu.children)
          }

          return route
        })
      }

      const accessRoutes = generateRoutesFromMenus(this.menus)
      this.routes = accessRoutes
      return accessRoutes
    },

    resetPermission() {
      this.menus = []
      this.routes = []
    },
  },
}) 