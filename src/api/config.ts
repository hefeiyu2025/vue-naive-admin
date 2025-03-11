import request from '@/utils/request'

export interface Config {
  id: number;
  name: string;         // 参数名称
  key: string;          // 参数键名
  value: string;        // 参数键值
  type: string;         // 参数类型（系统内置、自定义）
  group: string;        // 参数分组
  isBuiltin: boolean;   // 是否内置（内置参数不可删除）
  status: boolean;      // 状态（启用/禁用）
  remark: string;       // 备注
  createTime: string;   // 创建时间
  updateTime: string;   // 更新时间
}

export interface ConfigQuery {
  keyword?: string;
  type?: string;
  group?: string;
  status?: boolean;
  page?: number;
  pageSize?: number;
}

// 获取参数列表
export function getConfigList(params?: ConfigQuery) {
  return request({
    url: '/system/config/list',
    method: 'get',
    params,
  })
}

// 获取参数详情
export function getConfigDetail(id: number) {
  return request({
    url: `/system/config/${id}`,
    method: 'get',
  })
}

// 创建参数
export function createConfig(data: Partial<Config>) {
  return request({
    url: '/system/config',
    method: 'post',
    data,
  })
}

// 更新参数
export function updateConfig(id: number, data: Partial<Config>) {
  return request({
    url: `/system/config/${id}`,
    method: 'put',
    data,
  })
}

// 删除参数
export function deleteConfig(id: number) {
  return request({
    url: `/system/config/${id}`,
    method: 'delete',
  })
}

// 获取参数分组列表
export function getConfigGroups() {
  return request({
    url: '/system/config/groups',
    method: 'get',
  })
} 