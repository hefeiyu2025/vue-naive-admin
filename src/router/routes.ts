import type { RouteRecordRaw } from 'vue-router'

export const constantRoutes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
    meta: {
      title: 'login.title',
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
          title: 'common.dashboard',
          icon: 'dashboard',
          affix: true,
        },
      },
      {
        path: 'notification',
        name: 'Notification',
        component: () => import('@/views/notification/index.vue'),
        meta: {
          title: 'common.notification',
          icon: 'notifications-outline',
          requiresAuth: true,
        },
      },
      {
        path: 'profile',
        name: 'Profile',
        component: () => import('@/views/profile/index.vue'),
        meta: {
          title: 'common.profile',
          hidden: true,
        },
      },
      {
        path: 'password',
        name: 'Password',
        component: () => import('@/views/password/index.vue'),
        meta: {
          title: 'common.password',
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
      title: 'common.system',
      icon: 'setting',
    },
    children: [
      {
        path: 'user',
        name: 'User',
        component: () => import('@/views/system/user/index.vue'),
        meta: {
          title: 'common.user',
          icon: 'user',
        },
      },
      {
        path: 'role',
        name: 'Role',
        component: () => import('@/views/system/role/index.vue'),
        meta: {
          title: 'common.role',
          icon: 'role',
        },
      },
      {
        path: 'permission',
        name: 'Permission',
        component: () => import('@/views/system/permission/index.vue'),
        meta: {
          title: 'common.permission',
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