import request from '@/utils/request'

export interface Permission {
  id: number
  name: string
  code: string
  type: string
  status: boolean
  remark: string
  createTime: string
}

export interface PermissionListResult {
  list: Permission[]
  total: number
}

export interface PermissionListParams {
  page?: number
  pageSize?: number
}

export interface MenuPermission {
  id: number
  name: string
  code: string
  type: string
  children?: MenuPermission[]
}

export function getPermissionList(params: PermissionListParams) {
  return request.get<PermissionListResult>('/permission/list', { params })
}

export function getAllPermissions() {
  return request.get<MenuPermission[]>('/permission/all')
}

export function createPermission(data: Omit<Permission, 'id'>) {
  return request.post('/permission/create', data)
}

export function updatePermission(id: number, data: Partial<Permission>) {
  return request.put(`/permission/${id}`, data)
}

export function deletePermission(id: number) {
  return request.delete(`/permission/${id}`)
} 