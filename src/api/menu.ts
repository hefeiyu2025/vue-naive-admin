import request from '@/utils/request'

export interface Menu {
  id: number;
  name: string;         // 菜单名称
  parentId: number;     // 上级菜单ID
  path: string;         // 路由路径
  component: string;    // 组件路径
  redirect: string;     // 重定向地址
  icon: string;         // 菜单图标
  title: string;        // 菜单标题
  hidden: boolean;      // 是否隐藏
  keepAlive: boolean;   // 是否缓存
  type: string;         // 菜单类型（目录、菜单、按钮）
  permission: string;   // 权限标识
  orderNum: number;     // 排序号
  status: boolean;      // 状态（启用/禁用）
  createTime: string;   // 创建时间
  updateTime: string;   // 更新时间
  children?: Menu[];    // 子菜单
}

export interface MenuQuery {
  keyword?: string;
  status?: boolean;
  type?: string;
}

// 获取菜单树形列表
export function getMenuTree(params?: MenuQuery) {
  return request({
    url: '/system/menu/tree',
    method: 'get',
    params,
  })
}

// 获取菜单列表
export function getMenuList(params?: MenuQuery) {
  return request({
    url: '/system/menu/list',
    method: 'get',
    params,
  })
}

// 获取菜单详情
export function getMenuDetail(id: number) {
  return request({
    url: `/system/menu/${id}`,
    method: 'get',
  })
}

// 创建菜单
export function createMenu(data: Partial<Menu>) {
  return request({
    url: '/system/menu',
    method: 'post',
    data,
  })
}

// 更新菜单
export function updateMenu(id: number, data: Partial<Menu>) {
  return request({
    url: `/system/menu/${id}`,
    method: 'put',
    data,
  })
}

// 删除菜单
export function deleteMenu(id: number) {
  return request({
    url: `/system/menu/${id}`,
    method: 'delete',
  })
}

// 获取图标列表
export function getIconList() {
  return request({
    url: '/system/menu/icons',
    method: 'get',
  })
} 