import type { RouteRecordRaw } from 'vue-router'

export const constantRoutes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
    meta: {
      title: '登录',
      hidden: true,
    },
  },
  {
    path: '/',
    name: 'Layout',
    component: () => import('@/layouts/BasicLayout.vue'),
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        meta: {
          title: '仪表盘',
          icon: 'dashboard',
          affix: true,
        },
      },
      {
        path: 'notification',
        name: 'Notification',
        component: () => import('@/views/notification/index.vue'),
        meta: {
          title: '通知列表',
          icon: 'notifications-outline',
          requiresAuth: true,
        },
      },
      {
        path: 'profile',
        name: 'Profile',
        component: () => import('@/views/profile/index.vue'),
        meta: {
          title: '个人中心',
          hidden: true,
        },
      },
      {
        path: 'password',
        name: 'Password',
        component: () => import('@/views/password/index.vue'),
        meta: {
          title: '修改密码',
          icon: 'i-carbon:password',
        },
      },
    ],
  },
  {
    path: '/system',
    name: 'System',
    component: () => import('@/layouts/BasicLayout.vue'),
    redirect: '/system/user',
    meta: {
      title: '系统管理',
      icon: 'setting',
    },
    children: [
      {
        path: 'user',
        name: 'User',
        component: () => import('@/views/system/user/index.vue'),
        meta: {
          title: '用户管理',
          icon: 'user',
        },
      },
      {
        path: 'role',
        name: 'Role',
        component: () => import('@/views/system/role/index.vue'),
        meta: {
          title: '角色管理',
          icon: 'role',
        },
      },
      {
        path: 'permission',
        name: 'Permission',
        component: () => import('@/views/system/permission/index.vue'),
        meta: {
          title: '权限管理',
          icon: 'permission',
        },
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/error/404.vue'),
    meta: {
      title: '404',
      hidden: true,
    },
  },
]

// 动态路由，基于用户权限动态加载
export const asyncRoutes: RouteRecordRaw[] = []

export default constantRoutes 