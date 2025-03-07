import { defineMock } from 'vite-plugin-mock-dev-server'

export default defineMock([
  {
    url: '/api/role/list',
    method: 'GET',
    body: ({ query }) => {
      const { page = 1, pageSize = 10 } = query
      const total = 10
      const list = Array.from({ length: pageSize }, (_, index) => {
        const id = (page - 1) * pageSize + index + 1
        return {
          id,
          name: id === 1 ? '超级管理员' : `角色${id}`,
          code: id === 1 ? 'SUPER_ADMIN' : `ROLE_${id}`,
          status: true,
          remark: `这是角色${id}的描述信息`,
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
    url: '/api/role/all',
    method: 'GET',
    body: () => {
      return {
        code: 0,
        data: [
          {
            id: 1,
            name: '超级管理员',
            code: 'SUPER_ADMIN',
          },
          {
            id: 2,
            name: '普通管理员',
            code: 'ADMIN',
          },
          {
            id: 3,
            name: '普通用户',
            code: 'USER',
          },
        ],
        message: 'ok',
      }
    },
  },
]) 