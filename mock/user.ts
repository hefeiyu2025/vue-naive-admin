import { MockMethod } from 'vite-plugin-mock'

export default [
  {
    url: '/api/auth/login',
    method: 'post',
    response: ({ body }) => {
      const { username, password } = body
      if (username === 'admin' && password === '123456') {
        return {
          code: 0,
          data: {
            token: 'mock-token',
            userInfo: {
              id: 1,
              username: 'admin',
              nickname: '系统管理员',
              avatar: 'https://avatars.githubusercontent.com/u/1?v=4',
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
    method: 'post',
    response: () => {
      return {
        code: 0,
        data: null,
        message: '退出登录成功',
      }
    },
  },
  {
    url: '/api/user/list',
    method: 'get',
    response: ({ query }) => {
      const { page = 1, pageSize = 10 } = query
      const total = 100
      const list = Array.from({ length: pageSize }, (_, index) => {
        const id = (page - 1) * pageSize + index + 1
        return {
          id,
          username: `user${id}`,
          role: id === 1 ? '管理用户' : '普通用户',
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
  {
    url: '/api/user/info',
    method: 'get',
    response: () => {
      return {
        code: 0,
        data: {
          id: 1,
          username: 'admin',
          nickname: '系统管理员',
          avatar: 'https://avatars.githubusercontent.com/u/1?v=4',
          role: 'admin',
          email: 'admin@example.com',
          phone: '13800138000',
          bio: '系统管理员',
        },
        message: 'ok',
      }
    },
  },
  {
    url: '/api/user/update',
    method: 'put',
    response: ({ body }) => {
      return {
        code: 0,
        data: body,
        message: '更新成功',
      }
    },
  },
  {
    url: '/api/user/password',
    method: 'put',
    response: () => {
      return {
        code: 0,
        data: null,
        message: '修改成功',
      }
    },
  },
  {
    url: '/api/user/avatar',
    method: 'post',
    response: () => {
      return {
        code: 0,
        data: {
          url: 'https://avatars.githubusercontent.com/u/1?v=4',
        },
        message: '上传成功',
      }
    },
  },
] as MockMethod[] 
