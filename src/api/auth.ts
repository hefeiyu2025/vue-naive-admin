import request from '@/utils/request'

interface LoginParams {
  username: string
  password: string
}

interface LoginResult {
  token: string
  userInfo: {
    id: number
    username: string
    avatar: string
    role: string
  }
}

export function login(data: LoginParams) {
  return request.post<LoginResult>('/auth/login', data)
}

export function logout() {
  return request.post('/auth/logout')
} 