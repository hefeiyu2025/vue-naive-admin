import { defineMock } from 'vite-plugin-mock-dev-server'

export default defineMock([
  {
    url: '/api/auth/login',
    method: 'POST',
    body: ({ body }) => {
      const { username, password } = body
      if (username === 'admin' && password === '123456') {
        return {
          code: 0,
          data: {
            token: 'mock-token',
            userInfo: {
              id: 1,
              username: 'admin',
              avatar: '',
              role: 'admin',
            },
          },
          message: '登录成功',
        }
      }
      return {
        code: 1,
        message: '用户名或密码错误',
      }
    },
  },
  {
    url: '/api/auth/logout',
    method: 'POST',
    body: () => {
      return {
        code: 0,
        data: null,
        message: '退出登录成功',
      }
    },
  },
  {
    url: '/api/user/list',
    method: 'GET',
    body: ({ query }) => {
      const { page = 1, pageSize = 10 } = query
      const total = 100
      const list = Array.from({ length: pageSize }, (_, index) => {
        const id = (page - 1) * pageSize + index + 1
        return {
          id,
          username: `user${id}`,
          role: id === 1 ? '管理员' : '普通用户',
          status: true,
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
]) 