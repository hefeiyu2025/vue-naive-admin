import { MockMethod } from 'vite-plugin-mock'

// 生成菜单树形结构数据
const generateMenuTree = (keyword?: string, type?: string) => {
  const menus = [
    {
      id: 1,
      name: '系统管理',
      parentId: 0,
      path: '/system',
      component: 'layouts/BasicLayout',
      redirect: '/system/user',
      icon: 'setting',
      title: '系统管理',
      hidden: false,
      keepAlive: true,
      type: '目录',
      permission: '',
      orderNum: 1,
      status: true,
      createTime: '2024-03-01 12:00:00',
      updateTime: '2024-03-01 12:00:00',
      children: [
        {
          id: 2,
          name: '用户管理',
          parentId: 1,
          path: 'user',
          component: 'system/user/index',
          redirect: '',
          icon: 'user',
          title: '用户管理',
          hidden: false,
          keepAlive: true,
          type: '菜单',
          permission: 'system:user:list',
          orderNum: 1,
          status: true,
          createTime: '2024-03-01 12:00:00',
          updateTime: '2024-03-01 12:00:00',
          children: [
            {
              id: 7,
              name: '用户新增',
              parentId: 2,
              path: '',
              component: '',
              redirect: '',
              icon: '',
              title: '用户新增',
              hidden: false,
              keepAlive: false,
              type: '按钮',
              permission: 'system:user:add',
              orderNum: 1,
              status: true,
              createTime: '2024-03-01 12:00:00',
              updateTime: '2024-03-01 12:00:00',
            },
            {
              id: 8,
              name: '用户编辑',
              parentId: 2,
              path: '',
              component: '',
              redirect: '',
              icon: '',
              title: '用户编辑',
              hidden: false,
              keepAlive: false,
              type: '按钮',
              permission: 'system:user:edit',
              orderNum: 2,
              status: true,
              createTime: '2024-03-01 12:00:00',
              updateTime: '2024-03-01 12:00:00',
            },
            {
              id: 9,
              name: '用户删除',
              parentId: 2,
              path: '',
              component: '',
              redirect: '',
              icon: '',
              title: '用户删除',
              hidden: false,
              keepAlive: false,
              type: '按钮',
              permission: 'system:user:delete',
              orderNum: 3,
              status: true,
              createTime: '2024-03-01 12:00:00',
              updateTime: '2024-03-01 12:00:00',
            }
          ]
        },
        {
          id: 3,
          name: '角色管理',
          parentId: 1,
          path: 'role',
          component: 'system/role/index',
          redirect: '',
          icon: 'role',
          title: '角色管理',
          hidden: false,
          keepAlive: true,
          type: '菜单',
          permission: 'system:role:list',
          orderNum: 2,
          status: true,
          createTime: '2024-03-01 12:00:00',
          updateTime: '2024-03-01 12:00:00',
        },
        {
          id: 4,
          name: '权限管理',
          parentId: 1,
          path: 'permission',
          component: 'system/permission/index',
          redirect: '',
          icon: 'permission',
          title: '权限管理',
          hidden: false,
          keepAlive: true,
          type: '菜单',
          permission: 'system:permission:list',
          orderNum: 3,
          status: true,
          createTime: '2024-03-01 12:00:00',
          updateTime: '2024-03-01 12:00:00',
        },
        {
          id: 5,
          name: '部门管理',
          parentId: 1,
          path: 'department',
          component: 'system/department/index',
          redirect: '',
          icon: 'team',
          title: '部门管理',
          hidden: false,
          keepAlive: true,
          type: '菜单',
          permission: 'system:department:list',
          orderNum: 4,
          status: true,
          createTime: '2024-03-01 12:00:00',
          updateTime: '2024-03-01 12:00:00',
        },
        {
          id: 6,
          name: '菜单管理',
          parentId: 1,
          path: 'menu',
          component: 'system/menu/index',
          redirect: '',
          icon: 'menu',
          title: '菜单管理',
          hidden: false,
          keepAlive: true,
          type: '菜单',
          permission: 'system:menu:list',
          orderNum: 5,
          status: true,
          createTime: '2024-03-01 12:00:00',
          updateTime: '2024-03-01 12:00:00',
        }
      ]
    }
  ]

  // 过滤菜单类型
  if (type) {
    const filterMenusByType = (menuList: any[]) => {
      return menuList.filter(menu => {
        if (menu.children && menu.children.length > 0) {
          menu.children = filterMenusByType(menu.children)
        }
        return menu.type === type
      })
    }
    return filterMenusByType(JSON.parse(JSON.stringify(menus)))
  }

  // 搜索菜单
  if (keyword) {
    const searchMenus = (menuList: any[]) => {
      return menuList.filter(menu => {
        const match = menu.name.includes(keyword) || menu.path.includes(keyword)
        if (menu.children && menu.children.length > 0) {
          menu.children = searchMenus(menu.children)
          return match || menu.children.length > 0
        }
        return match
      })
    }
    return searchMenus(JSON.parse(JSON.stringify(menus)))
  }

  return menus
}

// 图标列表
const iconList = [
  'home-outline', 'settings-outline', 'people-outline', 'person-outline',
  'document-text-outline', 'documents-outline', 'list-outline', 'grid-outline',
  'apps-outline', 'menu-outline', 'options-outline', 'build-outline',
  'key-outline', 'lock-closed-outline', 'shield-outline', 'alert-outline',
  'analytics-outline', 'bar-chart-outline', 'pie-chart-outline', 'stats-chart-outline',
  'calendar-outline', 'time-outline', 'mail-outline', 'chatbubble-outline',
  'notifications-outline', 'heart-outline', 'star-outline', 'bookmark-outline',
  'cloud-outline', 'download-outline', 'upload-outline', 'share-outline',
  'link-outline', 'globe-outline', 'location-outline', 'map-outline',
  'search-outline', 'add-outline', 'remove-outline', 'close-outline',
  'checkmark-outline', 'arrow-back-outline', 'arrow-forward-outline', 'refresh-outline',
]

export default [
  {
    url: '/api/system/menu/tree',
    method: 'get',
    response: ({ query }) => {
      const { keyword, type } = query
      return {
        code: 0,
        data: generateMenuTree(keyword, type),
        message: 'ok',
      }
    },
  },
  {
    url: '/api/system/menu/list',
    method: 'get',
    response: ({ query }) => {
      const { keyword, type } = query
      // 这里简化处理，实际项目中可能需要扁平化处理树形结构
      const menus = generateMenuTree(keyword, type)
      return {
        code: 0,
        data: {
          list: menus,
          total: menus.length,
        },
        message: 'ok',
      }
    },
  },
  {
    url: '/api/system/menu/:id',
    method: 'get',
    response: (options) => {
      const id = options.query?.id || '1'
      // 简单模拟，实际项目中需要根据ID查找对应菜单
      return {
        code: 0,
        data: {
          id: Number(id),
          name: `菜单${id}`,
          parentId: 0,
          path: `/menu${id}`,
          component: `views/menu${id}/index`,
          redirect: '',
          icon: 'menu-outline',
          title: `菜单${id}`,
          hidden: false,
          keepAlive: true,
          type: '菜单',
          permission: `system:menu${id}:list`,
          orderNum: 1,
          status: true,
          createTime: '2024-03-01 12:00:00',
          updateTime: '2024-03-01 12:00:00',
        },
        message: 'ok',
      }
    },
  },
  {
    url: '/api/system/menu',
    method: 'post',
    response: ({ body }) => {
      return {
        code: 0,
        data: {
          id: 100,
          ...body,
          createTime: '2024-03-10 12:00:00',
          updateTime: '2024-03-10 12:00:00',
        },
        message: '新增成功',
      }
    },
  },
  {
    url: '/api/system/menu/:id',
    method: 'put',
    response: (options) => {
      const id = options.query?.id || '1'
      return {
        code: 0,
        data: {
          ...options.body,
          id: Number(id),
          updateTime: '2024-03-10 12:00:00',
        },
        message: '更新成功',
      }
    },
  },
  {
    url: '/api/system/menu/:id',
    method: 'delete',
    response: () => {
      return {
        code: 0,
        data: null,
        message: '删除成功',
      }
    },
  },
  {
    url: '/api/system/menu/icons',
    method: 'get',
    response: () => {
      return {
        code: 0,
        data: iconList,
        message: 'ok',
      }
    },
  },
] as MockMethod[] 