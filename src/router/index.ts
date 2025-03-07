import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useUserStore, usePermissionStore } from '@/store'
import { getUserInfo } from '@/api/user'
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
  document.title = `${to.meta.title || ''} - Vue Naive Admin`

  if (userStore.isLogin) {
    if (to.path === '/login') {
      next({ path: '/' })
    } else {
      // 判断是否已经有用户信息
      if (!userStore.userInfo) {
        try {
          // 获取用户信息
          const { data } = await getUserInfo()
          userStore.setUserInfo(data)
          // 获取用户权限菜单
          await permissionStore.getMenus()
          next({ ...to, replace: true })
        } catch (error) {
          // 获取用户信息失败，可能是token过期，清除token并跳转到登录页
          userStore.logout()
          next(`/login?redirect=${to.path}`)
        }
      } else {
        next()
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

export default router 