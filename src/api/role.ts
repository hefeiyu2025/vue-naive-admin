import request from '@/utils/request'

export interface Role {
  id: number
  name: string
  code: string
  status: boolean
  remark: string
  createTime: string
}

export interface RoleListResult {
  list: Role[]
  total: number
}

export interface RoleListParams {
  page?: number
  pageSize?: number
  keyword?: string
}

export interface SimpleRole {
  id: number
  name: string
  code: string
}

export function getRoleList(params: RoleListParams) {
  return request.get<RoleListResult>('/role/list', { params })
}

export function getAllRoles() {
  return request.get<SimpleRole[]>('/role/all')
}

export function createRole(data: Omit<Role, 'id'>) {
  return request.post('/role/create', data)
}

export function updateRole(id: number, data: Partial<Role>) {
  return request.put(`/role/${id}`, data)
}

export function deleteRole(id: number) {
  return request.delete(`/role/${id}`)
} 