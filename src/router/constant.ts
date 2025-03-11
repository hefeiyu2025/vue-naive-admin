import type { RouteRecordRaw } from 'vue-router'
import { NotificationsOutline, PersonOutline } from '@vicons/ionicons5'
import { renderIcon } from '@/components/icons'

// 不需要权限的基础路由
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
    path: '/403',
    name: 'Forbidden',
    component: () => import('@/views/error/403.vue'),
    meta: {
      title: '403',
      hidden: true,
    },
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

// 不显示在菜单中的路由
export const hiddenRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/layouts/BasicLayout.vue'),
    children: [
      {
        path: 'notification',
        name: 'Notification',
        component: () => import('@/views/notification/index.vue'),
        meta: {
          title: 'common.notification',
          icon: renderIcon(NotificationsOutline),
          hidden: true,
        },
      },
      {
        path: 'profile',
        name: 'Profile',
        component: () => import('@/views/profile/index.vue'),
        meta: {
          title: 'common.profile',
          icon: renderIcon(PersonOutline),
          hidden: true,
        },
      },
      {
        path: 'password',
        name: 'Password',
        component: () => import('@/views/password/index.vue'),
        meta: {
          title: 'common.password',
          icon: () => 'i-carbon:password',
          hidden: true,
        },
      },
    ],
  },
] 