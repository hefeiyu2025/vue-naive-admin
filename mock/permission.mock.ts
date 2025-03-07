import { defineMock } from 'vite-plugin-mock-dev-server'

export default defineMock([
  {
    url: '/api/permission/list',
    method: 'GET',
    body: ({ query }) => {
      const { page = 1, pageSize = 10 } = query
      const total = 20
      const list = Array.from({ length: pageSize }, (_, index) => {
        const id = (page - 1) * pageSize + index + 1
        return {
          id,
          name: `权限${id}`,
          code: `PERMISSION_${id}`,
          type: id % 2 === 0 ? '菜单' : '按钮',
          status: true,
          remark: `这是权限${id}的描述信息`,
          createTime: '2024-03-07 12:00:00',
        }
      })
      return {
        code: 0,
        data: {
          list,
          total,
        },
        message: 'ok',
      }
    },
  },
  {
    url: '/api/permission/all',
    method: 'GET',
    body: () => {
      return [
        {
          id: 1,
          name: '仪表盘',
          code: 'dashboard',
          type: 'menu',
        },
        {
          id: 2,
          name: '系统管理',
          code: 'system',
          type: 'menu',
          children: [
            {
              id: 3,
              name: '用户管理',
              code: 'user',
              type: 'menu',
            },
            {
              id: 4,
              name: '角色管理',
              code: 'role',
              type: 'menu',
            },
            {
              id: 5,
              name: '权限管理',
              code: 'permission',
              type: 'menu',
            },
          ],
        },
      ]
    },
  },
]) 