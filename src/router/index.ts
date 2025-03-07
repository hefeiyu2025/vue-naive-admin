import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useUserStore, usePermissionStore } from '@/store'
import constantRoutes from './routes'

const router = createRouter({
  history: createWebHistory(),
  routes: constantRoutes,
  scrollBehavior: () => ({ left: 0, top: 0 }),
})

// 白名单路由
const whiteList = ['/login']

router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()
  const permissionStore = usePermissionStore()

  // 设置页面标题
  document.title = `${to.meta.title} - Vue Naive Admin`

  if (userStore.isLogin) {
    if (to.path === '/login') {
      next({ path: '/' })
    }
    else {
      // 判断是否已经获取用户权限菜单
      if (permissionStore.menus.length === 0) {
        try {
          // 获取用户菜单权限
          await permissionStore.getMenus()
          // 生成动态路由
          const accessRoutes = permissionStore.generateRoutes()
          // 添加动态路由
          accessRoutes.forEach((route: RouteRecordRaw) => {
            router.addRoute(route)
          })
          // 重新进入当前路由
          next({ ...to, replace: true })
        }
        catch (error) {
          // 如果获取权限失败，则登出
          await userStore.logout()
          next(`/login?redirect=${to.path}`)
        }
      }
      else {
        next()
      }
    }
  }
  else {
    if (whiteList.includes(to.path)) {
      next()
    }
    else {
      next(`/login?redirect=${to.path}`)
    }
  }
})

export default router 