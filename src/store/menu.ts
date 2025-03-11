import { defineStore } from 'pinia'
import type { MenuOption as NaiveMenuOption } from 'naive-ui'
import {
  AppsOutline,
  SettingsOutline,
  PeopleOutline,
  DocumentTextOutline,
} from '@vicons/ionicons5'
import { renderIcon } from '@/components/icons'

export interface Breadcrumb {
  title: string
  path: string
}

// 扩展 naive-ui 的 MenuOption 类型
interface MenuOption extends Omit<NaiveMenuOption, 'children'> {
  key: string
  label: string
  children?: MenuOption[]
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
      // 简单的迭代方法查找路径
      const findMenuPath = (menuOptions: MenuOption[], targetKey: string): Breadcrumb[] => {
        // 先检查第一级菜单
        for (const menu of menuOptions) {
          if (menu.key === targetKey) {
            return [{
              title: menu.label as string,
              path: menu.key as string
            }];
          }
          
          // 检查子菜单
          if (menu.children) {
            for (const subMenu of menu.children) {
              if (subMenu.key === targetKey) {
                return [
                  {
                    title: menu.label as string,
                    path: menu.key as string
                  },
                  {
                    title: subMenu.label as string,
                    path: subMenu.key as string
                  }
                ];
              }
              
              // 检查三级菜单（如果需要更深层次，可以继续添加嵌套循环）
              if (subMenu.children) {
                for (const thirdMenu of subMenu.children) {
                  if (thirdMenu.key === targetKey) {
                    return [
                      {
                        title: menu.label as string,
                        path: menu.key as string
                      },
                      {
                        title: subMenu.label as string,
                        path: subMenu.key as string
                      },
                      {
                        title: thirdMenu.label as string,
                        path: thirdMenu.key as string
                      }
                    ];
                  }
                }
              }
            }
          }
        }
        
        return [];
      };
      
      return findMenuPath(state.menuOptions, state.activeKey);
    },
  },

  actions: {
    setActiveKey(key: string) {
      this.activeKey = key
    },
  },
}) 