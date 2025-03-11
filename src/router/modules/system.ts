import type { RouteRecordRaw } from 'vue-router'
import { renderIcon } from '@/components/icons'
import {
  SettingsSharp,
  PersonOutline,
  PeopleOutline,
  KeyOutline,
  MenuOutline,
  BookOutline,
  NotificationsOutline,
} from '@vicons/ionicons5'

const systemRoute: RouteRecordRaw = {
  path: '/system',
  component: () => import('@/layouts/BasicLayout.vue'),
  redirect: '/system/user',
  name: 'System',
  meta: {
    title: 'common.system',
    icon: renderIcon(SettingsSharp),
    order: 100, // 菜单排序
    alwaysShow: true, // 始终显示根路由
  },
  children: [
    {
      path: 'user',
      name: 'User',
      component: () => import('@/views/system/user/index.vue'),
      meta: {
        title: 'common.user',
        icon: renderIcon(PersonOutline),
      },
    },
    {
      path: 'role',
      name: 'Role',
      component: () => import('@/views/system/role/index.vue'),
      meta: {
        title: 'common.role',
        icon: renderIcon(PeopleOutline),
      },
    },
    {
      path: 'permission',
      name: 'Permission',
      component: () => import('@/views/system/permission/index.vue'),
      meta: {
        title: 'common.permission',
        icon: renderIcon(KeyOutline),
      },
    },
    {
      path: 'department',
      name: 'Department',
      component: () => import('@/views/system/department/index.vue'),
      meta: {
        title: 'common.department',
        icon: renderIcon(PeopleOutline),
      },
    },
    {
      path: 'menu',
      name: 'Menu',
      component: () => import('@/views/system/menu/index.vue'),
      meta: {
        title: 'common.menu',
        icon: renderIcon(MenuOutline),
      },
    },
    {
      path: 'dict',
      name: 'Dict',
      component: () => import('@/views/system/dict/index.vue'),
      meta: {
        title: 'common.dict',
        icon: renderIcon(BookOutline),
      },
    },
    {
      path: 'config',
      name: 'Config',
      component: () => import('@/views/system/config/index.vue'),
      meta: {
        title: 'common.config',
        icon: renderIcon(SettingsSharp),
      },
    },
    {
      path: 'notice',
      name: 'Notice',
      component: () => import('@/views/system/notice/index.vue'),
      meta: {
        title: 'common.notice',
        icon: renderIcon(NotificationsOutline),
      },
    },
  ],
}

export default systemRoute 