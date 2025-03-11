import request from '@/utils/request'

export interface Notice {
  id: number;
  title: string;        // 公告标题
  content: string;      // 公告内容
  type: string;         // 公告类型（通知、公告、警告）
  status: string;       // 公告状态（草稿、已发布、已撤回）
  publishTime: string;  // 发布时间
  expireTime: string;   // 过期时间
  isTop: boolean;       // 是否置顶
  readCount: number;    // 阅读次数
  createBy: string;     // 创建者
  createTime: string;   // 创建时间
  updateTime: string;   // 更新时间
}

export interface NoticeQuery {
  keyword?: string;
  type?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}

// 获取公告列表
export function getNoticeList(params?: NoticeQuery) {
  return request({
    url: '/system/notice/list',
    method: 'get',
    params,
  })
}

// 获取公告详情
export function getNoticeDetail(id: number) {
  return request({
    url: `/system/notice/${id}`,
    method: 'get',
  })
}

// 创建公告
export function createNotice(data: Partial<Notice>) {
  return request({
    url: '/system/notice',
    method: 'post',
    data,
  })
}

// 更新公告
export function updateNotice(id: number, data: Partial<Notice>) {
  return request({
    url: `/system/notice/${id}`,
    method: 'put',
    data,
  })
}

// 删除公告
export function deleteNotice(id: number) {
  return request({
    url: `/system/notice/${id}`,
    method: 'delete',
  })
}

// 发布公告
export function publishNotice(id: number) {
  return request({
    url: `/system/notice/publish/${id}`,
    method: 'put',
  })
}

// 撤回公告
export function revokeNotice(id: number) {
  return request({
    url: `/system/notice/revoke/${id}`,
    method: 'put',
  })
} 