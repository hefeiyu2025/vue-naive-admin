import type { RouteRecordRaw } from 'vue-router'

const workspaceRoute: RouteRecordRaw = {
  path: '/',
  component: () => import('@/layouts/BasicLayout.vue'),
  redirect: 'dashboard',
  children: [
    {
      path: 'dashboard',
      name: 'dashboard',
      component: () => import('@/views/dashboard/index.vue'),
      meta: {
        title: 'common.dashboard', // 显示为"工作台"
        icon: 'dashboard',
        order: 0, // 菜单排序
        affix: true, // 固定显示在页签
      },
    },
  ],
}

export default workspaceRoute 