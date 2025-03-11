import { defineStore } from 'pinia'
import { getAllPermissions } from '@/api/permission'
import type { MenuPermission } from '@/api/permission'
import type { RouteRecordRaw } from 'vue-router'

// 自定义菜单选项类型，避免无限递归
interface CustomMenuOption {
  label: string | (() => string)
  key: string
  icon?: () => any
  children?: CustomMenuOption[]
}

interface PermissionState {
  menus: MenuPermission[]
  routes: RouteRecordRaw[]
  accessedRoutes: RouteRecordRaw[]
  menuOptions: CustomMenuOption[]
  hasInitialized: boolean
}

// 扩展 RouteRecordRaw 的 meta 类型
declare module 'vue-router' {
  interface RouteMeta {
    icon?: () => any
  }
}

export const usePermissionStore = defineStore('permission', {
  state: (): PermissionState => ({
    menus: [],
    routes: [],
    accessedRoutes: [],
    menuOptions: [],
    hasInitialized: false
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
        // 检查 response 是否是一个包含 data 字段的对象
        if (response && response.data) {
          this.menus = response.data
          return response.data
        }
        // 如果 response 本身就是数组，也支持
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

    // 根据角色过滤路由
    async generateRoutes(role: string) {
      try {
        // 从router/modules中获取菜单路由
        const modules = import.meta.glob('../../router/modules/**/*.ts', { eager: true })
        const menuModules: RouteRecordRaw[] = []
        
        // 加载路由模块
        Object.keys(modules).forEach((key) => {
          const mod = (modules[key] as any).default || {}
          const modList = Array.isArray(mod) ? [...mod] : [mod]
          menuModules.push(...modList)
        })
        
        // 按照order排序
        menuModules.sort((a, b) => {
          const orderA = (a.meta?.order as number) || 0
          const orderB = (b.meta?.order as number) || 0
          return orderA - orderB
        })
        
        // 如果是管理员，返回所有菜单路由，否则根据角色过滤
        const accessedRoutes = role === 'admin' 
          ? menuModules 
          : filterAsyncRoutes(menuModules, role)
        
        this.accessedRoutes = accessedRoutes
        this.generateMenuOptions(accessedRoutes)
        this.hasInitialized = true
        
        return accessedRoutes
      } catch (error) {
        console.error('生成路由时出错:', error)
        return []
      }
    },

    // 根据路由生成菜单选项
    generateMenuOptions(routes: RouteRecordRaw[]) {
      try {
        const menuOptions: CustomMenuOption[] = []
        
        routes.forEach(route => {
          if (route.meta?.hidden) return
          
          const menuOption: CustomMenuOption = {
            label: (route.meta?.title || route.name || '').toString(),
            key: route.path,
            icon: route.meta?.icon,
          }
          
          // 处理子菜单
          if (route.children && route.children.length > 0) {
            const childrenOptions = this.getChildrenMenuOptions(route.children, route.path)
            
            // 如果有子菜单且设置了 alwaysShow，或者子菜单数量大于 0，则添加子菜单
            if (route.meta?.alwaysShow || childrenOptions.length > 0) {
              menuOption.children = childrenOptions
            }
            
            // 如果只有一个子菜单且没有设置 alwaysShow，则直接显示子菜单
            if (childrenOptions.length === 1 && !route.meta?.alwaysShow) {
              return menuOptions.push(childrenOptions[0])
            }
          }
          
          menuOptions.push(menuOption)
        })
        
        this.menuOptions = menuOptions
      } catch (error) {
        console.error('生成菜单选项时出错:', error)
        this.menuOptions = []
      }
    },
    
    // 获取子菜单选项
    getChildrenMenuOptions(routes: RouteRecordRaw[], parentPath: string): CustomMenuOption[] {
      const childrenOptions: CustomMenuOption[] = []
      
      routes.forEach(route => {
        if (route.meta?.hidden) return
        
        // 修复路径拼接问题，避免出现双斜杠
        const path = route.path.startsWith('/') 
          ? route.path 
          : parentPath === '/' 
            ? `${parentPath}${route.path}` 
            : `${parentPath}/${route.path}`
        
        const menuOption: CustomMenuOption = {
          label: (route.meta?.title || route.name || '').toString(),
          key: path,
          icon: route.meta?.icon,
        }
        
        // 处理子菜单
        if (route.children && route.children.length > 0) {
          const subChildrenOptions = this.getChildrenMenuOptions(route.children, path)
          if (subChildrenOptions.length > 0) {
            menuOption.children = subChildrenOptions
          }
        }
        
        childrenOptions.push(menuOption)
      })
      
      return childrenOptions
    },

    resetPermission() {
      this.menus = []
      this.routes = []
      this.accessedRoutes = []
      this.menuOptions = []
      this.hasInitialized = false
    }
  }
})

// 根据角色过滤路由
function filterAsyncRoutes(routes: RouteRecordRaw[], role: string): RouteRecordRaw[] {
  const res: RouteRecordRaw[] = []
  
  routes.forEach(route => {
    const tmp = { ...route }
    
    // 检查是否有权限访问该路由
    if (hasPermission(tmp, role)) {
      // 如果有子路由，递归过滤
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, role)
      }
      res.push(tmp)
    }
  })
  
  return res
}

// 检查用户是否有权限访问路由
function hasPermission(route: RouteRecordRaw, role: string): boolean {
  if (route.meta?.roles) {
    return (route.meta.roles as string[]).includes(role)
  }
  // 如果没有设置权限，则默认允许访问
  return true
} 