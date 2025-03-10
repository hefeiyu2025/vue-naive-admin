import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw, RouteLocationNormalized } from 'vue-router'
import { useUserStore, usePermissionStore } from '@/store'
import { getUserInfo } from '@/api/user'
import { constantRoutes, hiddenRoutes } from './constant'
import i18n from '@/locales'

// 自动导入modules文件夹下的路由模块
const modules = import.meta.glob('./modules/**/*.ts', { eager: true })
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

// 所有路由
export const allRoutes = [...menuModules, ...hiddenRoutes, ...constantRoutes]

const router = createRouter({
  history: createWebHistory(),
  routes: allRoutes,
  scrollBehavior: () => ({ left: 0, top: 0 }),
})

// 白名单路由
const whiteList = ['/login']

router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()
  const permissionStore = usePermissionStore()

  // 设置页面标题
  const title = to.meta.title as string
  document.title = title ? `${i18n.global.t(title)} - Vue Naive Admin` : 'Vue Naive Admin'

  if (userStore.isLogin) {
    if (to.path === '/login') {
      next({ path: '/' })
    } else {
      // 判断是否已经有用户信息和权限信息
      if (!userStore.userInfo || !permissionStore.hasInitialized) {
        try {
          // 获取用户信息
          const { data } = await getUserInfo()
          userStore.setUserInfo(data)
          
          // 获取用户权限菜单并生成路由
          await permissionStore.getMenus()
          const accessRoutes = await permissionStore.generateRoutes(userStore.userInfo?.role || '')
          
          // 动态添加可访问路由
          accessRoutes.forEach(route => {
            router.addRoute(route)
          })
          
          // 重定向到目标页面，确保路由已经添加完成
          next({ ...to, replace: true })
        } catch (error) {
          // 获取用户信息失败，可能是token过期，清除token并跳转到登录页
          userStore.logout()
          next(`/login?redirect=${to.path}`)
        }
      } else {
        // 检查用户是否有权限访问该路由
        if (hasPermission(to, userStore.userInfo?.role || '')) {
          next()
        } else {
          next('/403')
        }
      }
    }
  } else {
    if (whiteList.includes(to.path)) {
      next()
    } else {
      next(`/login?redirect=${to.path}`)
    }
  }
})

// 检查用户是否有权限访问路由
function hasPermission(route: RouteLocationNormalized, role: string): boolean {
  if (route.meta?.roles) {
    return (route.meta.roles as string[]).includes(role)
  }
  // 如果没有设置权限，则默认允许访问
  return true
}

export default router 