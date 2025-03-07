<template>
  <n-popover trigger="click" :width="400">
    <template #trigger>
      <n-badge :value="unreadCount" :max="99">
        <n-button quaternary circle>
          <template #icon>
            <n-icon><NotificationsOutline /></n-icon>
          </template>
        </n-button>
      </n-badge>
    </template>

    <div class="notification-container">
      <div class="notification-header">
        <span class="title">通知</span>
        <div class="notification-actions">
          <n-button text size="small" @click="handleReadAll">
            全部已读
          </n-button>
          <n-button text size="small" @click="handleClear">
            清空
          </n-button>
        </div>
      </div>

      <n-scrollbar style="max-height: 400px">
        <n-list>
          <n-list-item v-for="item in notifications" :key="item.id">
            <n-thing
              :title="item.title"
              :description="item.content"
              :class="{ 'is-read': item.isRead }"
              @click="handleClick(item)"
            >
              <template #avatar>
                <n-icon
                  :color="getTypeColor(item.type)"
                  size="24"
                >
                  <component :is="getTypeIcon(item.type)" />
                </n-icon>
              </template>
            </n-thing>
          </n-list-item>
        </n-list>
      </n-scrollbar>

      <div class="notification-footer">
        <n-button text block @click="handleViewAll">
          查看全部
        </n-button>
      </div>
    </div>
  </n-popover>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useMessage } from 'naive-ui'
import { useRouter } from 'vue-router'
import {
  NotificationsOutline,
  InformationCircleOutline,
  CheckmarkCircleOutline,
  WarningOutline,
  CloseCircleOutline,
} from '@vicons/ionicons5'
import {
  getNotificationList,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} from '@/api/notification'
import type { Notification } from '@/api/notification'
import { wsClient } from '@/utils/websocket'

const message = useMessage()
const router = useRouter()
const notifications = ref<Notification[]>([])
const unreadCount = ref(0)
let timer: number | null = null

// 获取通知列表
const fetchNotifications = async () => {
  try {
    const res = await getNotificationList({
      page: 1,
      pageSize: 10,
    })
    notifications.value = res.data
  }
  catch (error: any) {
    message.error(error.message || '获取通知失败')
  }
}

// 获取未读数量
const fetchUnreadCount = async () => {
  try {
    const res = await getUnreadCount()
    unreadCount.value = res.data
  }
  catch (error: any) {
    message.error(error.message || '获取未读数量失败')
  }
}

// 标记为已读
const handleClick = async (item: Notification) => {
  if (item.isRead) {
    // 如果已读，直接跳转
    if (item.link) {
      router.push(item.link)
    }
    return
  }
  
  try {
    await markAsRead(item.id)
    item.isRead = true
    unreadCount.value--
    message.success('标记已读')
    
    // 标记已读后跳转
    if (item.link) {
      router.push(item.link)
    }
  }
  catch (error: any) {
    message.error(error.message || '标记失败')
  }
}

// 全部已读
const handleReadAll = async () => {
  try {
    await markAllAsRead()
    notifications.value.forEach(item => item.isRead = true)
    unreadCount.value = 0
    message.success('全部已读')
  }
  catch (error: any) {
    message.error(error.message || '操作失败')
  }
}

// 清空通知
const handleClear = async () => {
  try {
    await Promise.all(
      notifications.value.map(item => deleteNotification(item.id))
    )
    notifications.value = []
    unreadCount.value = 0
    message.success('清空成功')
  }
  catch (error: any) {
    message.error(error.message || '清空失败')
  }
}

// 查看全部
const handleViewAll = () => {
  router.push('/notification')
}

// 获取通知类型图标
const getTypeIcon = (type: Notification['type']) => {
  const iconMap = {
    info: InformationCircleOutline,
    success: CheckmarkCircleOutline,
    warning: WarningOutline,
    error: CloseCircleOutline,
  }
  return iconMap[type]
}

// 获取通知类型颜色
const getTypeColor = (type: Notification['type']) => {
  const colorMap = {
    info: '#2080f0',
    success: '#18a058',
    warning: '#f0a020',
    error: '#d03050',
  }
  return colorMap[type]
}

// 处理 WebSocket 消息
const handleWebSocketMessage = (data: any) => {
  if (data.type === 'notification') {
    // 新通知
    notifications.value.unshift(data.notification)
    unreadCount.value++
  }
  else if (data.type === 'notification_read') {
    // 通知已读
    const notification = notifications.value.find(n => n.id === data.notificationId)
    if (notification) {
      notification.isRead = true
      unreadCount.value--
    }
  }
}

// 初始化
onMounted(() => {
  fetchNotifications()
  fetchUnreadCount()
  // wsClient.addMessageHandler(handleWebSocketMessage)
  // wsClient.connect()
})

// 清理
onUnmounted(() => {
  // wsClient.removeMessageHandler(handleWebSocketMessage)
  // wsClient.disconnect()
})
</script>

<style lang="scss" scoped>
.notification-container {
  .notification-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    border-bottom: 1px solid var(--border-color);

    .title {
      font-size: 16px;
      font-weight: 500;
    }

    .notification-actions {
      display: flex;
      align-items: center;
      gap: 8px;
    }
  }

  .notification-footer {
    padding: 8px 16px;
    border-top: 1px solid var(--border-color);
  }

  :deep(.n-thing) {
    cursor: pointer;
    padding: 8px 0;

    &.is-read {
      opacity: 0.6;
    }
  }
}
</style> 