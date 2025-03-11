import request from '@/utils/request'

export interface Department {
  id: number;
  name: string;         // 部门名称
  code: string;         // 部门编码
  parentId: number;     // 上级部门ID
  path: string;         // 部门层级路径
  leader: string;       // 部门负责人
  phone: string;        // 联系电话
  email: string;        // 邮箱
  status: boolean;      // 状态（启用/禁用）
  orderNum: number;     // 排序号
  createTime: string;   // 创建时间
  updateTime: string;   // 更新时间
  children?: Department[]; // 子部门
}

export interface DepartmentQuery {
  keyword?: string;
  status?: boolean;
}

// 获取部门树形列表
export function getDepartmentTree(params?: DepartmentQuery) {
  return request({
    url: '/system/department/tree',
    method: 'get',
    params,
  })
}

// 获取部门列表
export function getDepartmentList(params?: DepartmentQuery) {
  return request({
    url: '/system/department/list',
    method: 'get',
    params,
  })
}

// 获取部门详情
export function getDepartmentDetail(id: number) {
  return request({
    url: `/system/department/${id}`,
    method: 'get',
  })
}

// 创建部门
export function createDepartment(data: Partial<Department>) {
  return request({
    url: '/system/department',
    method: 'post',
    data,
  })
}

// 更新部门
export function updateDepartment(id: number, data: Partial<Department>) {
  return request({
    url: `/system/department/${id}`,
    method: 'put',
    data,
  })
}

// 删除部门
export function deleteDepartment(id: number) {
  return request({
    url: `/system/department/${id}`,
    method: 'delete',
  })
} 