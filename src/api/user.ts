import request from '@/utils/request'

export interface User {
  id: number
  username: string
  role: string
  status: boolean
  createTime: string
}

export interface UserListResult {
  list: User[]
  total: number
}

export interface UserListParams {
  page?: number
  pageSize?: number
}

export function getUserList(params: UserListParams) {
  return request.get<UserListResult>('/user/list', { params })
}

export function createUser(data: Omit<User, 'id'>) {
  return request.post('/user/create', data)
}

export function updateUser(id: number, data: Partial<User>) {
  return request.put(`/user/${id}`, data)
}

export function deleteUser(id: number) {
  return request.delete(`/user/${id}`)
}

export interface LoginParams {
  username: string
  password: string
}

export interface UserInfo {
  id: number
  username: string
  nickname: string
  avatar: string
  roles: string[]
}

export function login(data: LoginParams) {
  return request({
    url: '/auth/login',
    method: 'post',
    data
  })
}

export function getUserInfo() {
  return request({
    url: '/user/info',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/auth/logout',
    method: 'post'
  })
} 