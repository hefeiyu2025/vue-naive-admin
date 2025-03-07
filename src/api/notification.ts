import request from '@/utils/request'

export interface ApiResponse<T> {
  code: number
  data: T
  message?: string
}

export interface Notification {
  id: string
  title: string
  content: string
  type: 'info' | 'success' | 'warning' | 'error'
  isRead: boolean
  createTime: string
  link?: string
  sender?: string
  senderAvatar?: string
  priority?: 'low' | 'medium' | 'high'
  category?: string
  expireTime?: string
  action?: {
    text: string
    link: string
  }
}

export interface NotificationListResult {
  list: Notification[]
  total: number
}

export interface NotificationListParams {
  page?: number
  pageSize?: number
  isRead?: boolean
  category?: string
  type?: string
  priority?: string
  startTime?: number
  endTime?: number
}

// 获取通知列表
export function getNotificationList(params: NotificationListParams) {
  return request.get<NotificationListResult>('/notification/list', { params })
}

// 获取未读通知数量
export function getUnreadCount() {
  return request.get<number>('/notification/unread/count')
}

// 标记通知为已读
export function markAsRead(id: string) {
  return request.put(`/notification/${id}/read`)
}

// 标记所有通知为已读
export function markAllAsRead() {
  return request.put('/notification/read/all')
}

// 删除通知
export function deleteNotification(id: string) {
  return request.delete(`/notification/${id}`)
} 