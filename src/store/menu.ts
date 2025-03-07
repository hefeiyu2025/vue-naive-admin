import { defineStore } from 'pinia'
import type { MenuOption } from 'naive-ui'
import {
  DashboardOutlined,
  SettingOutlined,
  TeamOutlined,
  FileTextOutlined,
  ProfileOutlined,
} from '@vicons/antd'
import { h } from 'vue'
import { NIcon } from 'naive-ui'

function renderIcon(icon: any) {
  return () => h(NIcon, null, { default: () => h(icon) })
}

export interface Breadcrumb {
  title: string
  path: string
}

export const useMenuStore = defineStore('menu', {
  state: () => ({
    activeKey: '/dashboard',
    menuOptions: [
      {
        label: '仪表盘',
        key: '/dashboard',
        icon: renderIcon(DashboardOutlined),
        children: [
          {
            label: '系统概览',
            key: '/dashboard/overview',
          },
          {
            label: '工作台',
            key: '/dashboard/workplace',
          },
        ],
      },
      {
        label: '系统管理',
        key: '/system',
        icon: renderIcon(SettingOutlined),
        children: [
          {
            label: '用户管理',
            key: '/system/user',
          },
          {
            label: '角色管理',
            key: '/system/role',
          },
          {
            label: '权限管理',
            key: '/system/permission',
          },
        ],
      },
      {
        label: '用户中心',
        key: '/user',
        icon: renderIcon(TeamOutlined),
        children: [
          {
            label: '个人中心',
            key: '/user/profile',
          },
          {
            label: '消息中心',
            key: '/user/message',
          },
        ],
      },
      {
        label: '内容管理',
        key: '/content',
        icon: renderIcon(FileTextOutlined),
        children: [
          {
            label: '文章管理',
            key: '/content/article',
          },
          {
            label: '分类管理',
            key: '/content/category',
          },
          {
            label: '标签管理',
            key: '/content/tag',
          },
        ],
      },
    ] as MenuOption[],
  }),
  getters: {
    breadcrumbs(): Breadcrumb[] {
      const breadcrumbs: Breadcrumb[] = []
      const findPath = (options: MenuOption[], key: string) => {
        for (const option of options) {
          if (option.key === key) {
            breadcrumbs.push({
              title: option.label as string,
              path: option.key as string,
            })
            return true
          }
          if (option.children) {
            const found = findPath(option.children, key)
            if (found) {
              breadcrumbs.unshift({
                title: option.label as string,
                path: option.key as string,
              })
              return true
            }
          }
        }
        return false
      }
      findPath(this.menuOptions, this.activeKey)
      return breadcrumbs
    },
  },
  actions: {
    setActiveKey(key: string) {
      this.activeKey = key
    },
  },
}) 