import request from '@/utils/request'

// 字典类型
export interface DictType {
  id: number;
  name: string;         // 字典名称
  type: string;         // 字典类型
  status: boolean;      // 状态（启用/禁用）
  remark: string;       // 备注
  createTime: string;   // 创建时间
  updateTime: string;   // 更新时间
}

// 字典数据
export interface DictData {
  id: number;
  dictTypeId: number;   // 字典类型ID
  dictType: string;     // 字典类型
  label: string;        // 字典标签
  value: string;        // 字典值
  cssClass: string;     // 样式属性
  listClass: string;    // 表格回显样式
  isDefault: boolean;   // 是否默认
  status: boolean;      // 状态（启用/禁用）
  orderNum: number;     // 排序号
  remark: string;       // 备注
  createTime: string;   // 创建时间
  updateTime: string;   // 更新时间
}

export interface DictQuery {
  keyword?: string;
  status?: boolean;
  page?: number;
  pageSize?: number;
}

export interface DictDataQuery extends DictQuery {
  dictType: string;
}

// 获取字典类型列表
export function getDictTypeList(params?: DictQuery) {
  return request({
    url: '/system/dict/type/list',
    method: 'get',
    params,
  })
}

// 获取字典类型详情
export function getDictTypeDetail(id: number) {
  return request({
    url: `/system/dict/type/${id}`,
    method: 'get',
  })
}

// 创建字典类型
export function createDictType(data: Partial<DictType>) {
  return request({
    url: '/system/dict/type',
    method: 'post',
    data,
  })
}

// 更新字典类型
export function updateDictType(id: number, data: Partial<DictType>) {
  return request({
    url: `/system/dict/type/${id}`,
    method: 'put',
    data,
  })
}

// 删除字典类型
export function deleteDictType(id: number) {
  return request({
    url: `/system/dict/type/${id}`,
    method: 'delete',
  })
}

// 获取字典数据列表
export function getDictDataList(params: DictDataQuery) {
  return request({
    url: '/system/dict/data/list',
    method: 'get',
    params,
  })
}

// 获取字典数据详情
export function getDictDataDetail(id: number) {
  return request({
    url: `/system/dict/data/${id}`,
    method: 'get',
  })
}

// 创建字典数据
export function createDictData(data: Partial<DictData>) {
  return request({
    url: '/system/dict/data',
    method: 'post',
    data,
  })
}

// 更新字典数据
export function updateDictData(id: number, data: Partial<DictData>) {
  return request({
    url: `/system/dict/data/${id}`,
    method: 'put',
    data,
  })
}

// 删除字典数据
export function deleteDictData(id: number) {
  return request({
    url: `/system/dict/data/${id}`,
    method: 'delete',
  })
} 