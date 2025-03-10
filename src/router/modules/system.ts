import type { RouteRecordRaw } from 'vue-router'

const systemRoute: RouteRecordRaw = {
  path: '/system',
  component: () => import('@/layouts/BasicLayout.vue'),
  redirect: '/system/user',
  name: 'System',
  meta: {
    title: 'common.system',
    icon: 'setting',
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
}

export default systemRoute 