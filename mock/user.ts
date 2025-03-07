import { MockMethod } from 'vite-plugin-mock-dev-server'

const tokens: Record<string, string> = {
  admin: 'admin-token',
  editor: 'editor-token'
}

const users: Record<string, any> = {
  'admin-token': {
    id: 1,
    username: 'admin',
    password: '123456',
    nickname: '管理员',
    avatar: 'https://avatars.githubusercontent.com/u/1?v=4',
    roles: ['admin']
  },
  'editor-token': {
    id: 2,
    username: 'editor',
    password: '123456',
    nickname: '编辑者',
    avatar: 'https://avatars.githubusercontent.com/u/2?v=4',
    roles: ['editor']
  }
}

export default [
  {
    url: '/dev-api/auth/login',
    method: 'post',
    response: ({ body }) => {
      const { username, password } = body
      const token = tokens[username]
      if (!token) {
        return {
          code: 1,
          message: '用户名或密码错误'
        }
      }
      return {
        code: 0,
        data: {
          token
        }
      }
    }
  },
  {
    url: '/dev-api/user/info',
    method: 'get',
    response: ({ headers }) => {
      const token = headers['authorization']?.replace('Bearer ', '')
      const info = users[token]
      if (!info) {
        return {
          code: 1,
          message: '获取用户信息失败'
        }
      }
      return {
        code: 0,
        data: info
      }
    }
  }
] as MockMethod[] 