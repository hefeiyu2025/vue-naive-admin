import { defineStore } from 'pinia'
import type { MenuOption } from 'naive-ui'
import {
  AppsOutline,
  SettingsOutline,
  PeopleOutline,
  DocumentTextOutline,
  PersonOutline,
} from '@vicons/ionicons5'
import { renderIcon } from '@/components/icons'

export interface Breadcrumb {
  title: string
  path: string
}

export const useMenuStore = defineStore('menu', {
  state: () => ({
    activeKey: '/dashboard',
    menuOptions: [
      {
        label: 'common.dashboard',
        key: '/dashboard',
        icon: renderIcon(AppsOutline),
        children: [
          {
            label: 'dashboard.overview',
            key: '/dashboard/overview',
          },
          {
            label: 'dashboard.workplace',
            key: '/dashboard/workplace',
          },
        ],
      },
      {
        label: 'common.system',
        key: '/system',
        icon: renderIcon(SettingsOutline),
        children: [
          {
            label: 'common.user',
            key: '/system/user',
          },
          {
            label: 'common.role',
            key: '/system/role',
          },
          {
            label: 'common.permission',
            key: '/system/permission',
          },
        ],
      },
      {
        label: 'common.profile',
        key: '/user',
        icon: renderIcon(PeopleOutline),
        children: [
          {
            label: 'common.profile',
            key: '/user/profile',
          },
          {
            label: 'common.notification',
            key: '/user/message',
          },
        ],
      },
      {
        label: 'content.title',
        key: '/content',
        icon: renderIcon(DocumentTextOutline),
        children: [
          {
            label: 'content.article',
            key: '/content/article',
          },
          {
            label: 'content.category',
            key: '/content/category',
          },
          {
            label: 'content.tag',
            key: '/content/tag',
          },
        ],
      },
    ] as MenuOption[],
  }),

  getters: {
    breadcrumbs: (state): Breadcrumb[] => {
      const breadcrumbs: Breadcrumb[] = []
      const findBreadcrumb = (options: MenuOption[], path: string) => {
        for (const option of options) {
          if (option.key === path) {
            breadcrumbs.push({
              title: option.label as string,
              path: option.key as string,
            })
            return true
          }
          if (option.children) {
            if (findBreadcrumb(option.children, path)) {
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
      findBreadcrumb(state.menuOptions, state.activeKey)
      return breadcrumbs
    },
  },

  actions: {
    setActiveKey(key: string) {
      this.activeKey = key
    },
  },
}) 