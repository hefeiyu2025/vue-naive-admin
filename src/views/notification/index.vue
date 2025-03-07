<template>
  <div class="notification-container">
    <n-card :bordered="false" class="page-card">
      <template #header>
        <n-space justify="space-between">
          <n-space>
            <n-button type="primary" @click="handleReadAll">
              <template #icon>
                <n-icon><checkmark-circle-outline /></n-icon>
              </template>
              全部已读
            </n-button>
            <n-button @click="handleClear">
              <template #icon>
                <n-icon><trash-outline /></n-icon>
              </template>
              清空
            </n-button>
          </n-space>
          <n-space>
            <n-select
              v-model:value="filterType"
              :options="filterOptions"
              size="small"
              style="width: 120px"
            />
            <n-select
              v-model:value="category"
              :options="categoryOptions"
              size="small"
              style="width: 120px"
              placeholder="选择分类"
              clearable
            />
            <n-select
              v-model:value="type"
              :options="typeOptions"
              size="small"
              style="width: 120px"
              placeholder="选择类型"
              clearable
            />
            <n-select
              v-model:value="priority"
              :options="priorityOptions"
              size="small"
              style="width: 120px"
              placeholder="选择优先级"
              clearable
            />
            <n-date-picker
              v-model:value="dateRange"
              type="daterange"
              size="small"
              style="width: 240px"
              clearable
              :shortcuts="dateShortcuts"
            />
          </n-space>
        </n-space>
      </template>

      <n-data-table
        :columns="columns"
        :data="notifications"
        :pagination="pagination"
        :loading="loading"
        :row-key="row => row.id"
        :row-class-name="rowClassName"
        @update:page="handlePageChange"
        @update:page-size="handlePageSizeChange"
      />
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { ref, h, onMounted, watch, computed } from 'vue'
import { useMessage } from 'naive-ui'
import { useRouter } from 'vue-router'
import {
  CheckmarkCircleOutline,
  TrashOutline,
  InformationCircleOutline,
  WarningOutline,
  CloseCircleOutline,
} from '@vicons/ionicons5'
import {
  getNotificationList,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} from '@/api/notification'
import type { Notification } from '@/api/notification'
import type { DataTableColumns } from 'naive-ui'

const message = useMessage()
const router = useRouter()
const notifications = ref<Notification[]>([])
const total = ref(0)
const page = ref(1)
const pageSize = ref(10)
const loading = ref(false)
const filterType = ref<'all' | 'unread'>('all')
const category = ref<string | null>(null)
const type = ref<string | null>(null)
const priority = ref<string | null>(null)
const dateRange = ref<[number, number] | null>(null)

// 筛选选项
const filterOptions = [
  { label: '全部', value: 'all' },
  { label: '未读', value: 'unread' },
]

// 分类选项
const categoryOptions = [
  { label: '系统通知', value: 'system' },
  { label: '任务通知', value: 'task' },
  { label: '审批通知', value: 'approval' },
  { label: '安全通知', value: 'security' },
]

// 类型选项
const typeOptions = [
  { label: '信息', value: 'info' },
  { label: '成功', value: 'success' },
  { label: '警告', value: 'warning' },
  { label: '错误', value: 'error' },
]

// 优先级选项
const priorityOptions = [
  { label: '低', value: 'low' },
  { label: '中', value: 'medium' },
  { label: '高', value: 'high' },
]

// 表格列配置
const columns: DataTableColumns<Notification> = [
  {
    type: 'selection',
    width: 50,
  },
  {
    title: '标题',
    key: 'title',
    width: 200,
    render(row) {
      return h('div', { class: 'notification-title' }, [
        h('span', { class: row.isRead ? 'is-read' : '' }, row.title),
        !row.isRead && h('n-tag', { size: 'tiny', type: 'warning' }, { default: () => '未读' }),
      ])
    },
  },
  {
    title: '内容',
    key: 'content',
    ellipsis: true,
  },
  {
    title: '发送者',
    key: 'sender',
    width: 120,
    render(row) {
      return h('div', { class: 'sender-cell' }, [
        row.senderAvatar && h('n-avatar', {
          src: row.senderAvatar,
          round: true,
          size: 'small',
        }),
        h('span', { style: 'margin-left: 8px' }, row.sender || '-'),
      ])
    },
  },
  {
    title: '类型',
    key: 'type',
    width: 100,
    render(row) {
      return h('n-tag', {
        type: getTypeTagType(row.type),
        size: 'small',
      }, { default: () => getTypeText(row.type) })
    },
  },
  {
    title: '优先级',
    key: 'priority',
    width: 100,
    render(row) {
      return row.priority ? h('n-tag', {
        type: getPriorityType(row.priority),
        size: 'small',
      }, { default: () => getPriorityText(row.priority) }) : '-'
    },
  },
  {
    title: '分类',
    key: 'category',
    width: 100,
    render(row) {
      return row.category ? h('n-tag', {
        type: 'info',
        size: 'small',
      }, { default: () => row.category }) : '-'
    },
  },
  {
    title: '发送时间',
    key: 'createTime',
    width: 180,
  },
  {
    title: '有效期',
    key: 'expireTime',
    width: 180,
    render(row) {
      return row.expireTime ? h('span', { class: 'expire-time' }, row.expireTime) : '-'
    },
  },
  {
    title: '操作',
    key: 'actions',
    width: 120,
    fixed: 'right',
    render(row) {
      return h('n-space', null, {
        default: () => [
          h('n-button', {
            text: true,
            type: 'primary',
            size: 'small',
            onClick: () => handleClick(row),
          }, { default: () => '查看' }),
          h('n-button', {
            text: true,
            type: 'error',
            size: 'small',
            onClick: () => handleDelete(row),
          }, { default: () => '删除' }),
        ],
      })
    },
  },
]

// 分页配置
const pagination = computed(() => ({
  page: page.value,
  pageSize: pageSize.value,
  itemCount: total.value,
  showSizePicker: true,
  pageSizes: [10, 20, 30, 40],
}))

// 获取通知列表
const fetchNotifications = async () => {
  loading.value = true
  try {
    const res = await getNotificationList({
      page: page.value,
      pageSize: pageSize.value,
      isRead: filterType.value === 'unread' ? false : undefined,
      category: category.value || undefined,
      type: type.value || undefined,
      priority: priority.value || undefined,
      startTime: dateRange.value?.[0],
      endTime: dateRange.value?.[1],
    })
  
    notifications.value = res.data
    total.value = res.total
  }
  catch (error: any) {
    message.error(error.message || '获取通知失败')
  }
  finally {
    loading.value = false
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

// 删除通知
const handleDelete = async (item: Notification) => {
  try {
    await deleteNotification(item.id)
    message.success('删除成功')
    fetchNotifications()
  }
  catch (error: any) {
    message.error(error.message || '删除失败')
  }
}

// 全部已读
const handleReadAll = async () => {
  try {
    await markAllAsRead()
    notifications.value.forEach(item => item.isRead = true)
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
    total.value = 0
    message.success('清空成功')
  }
  catch (error: any) {
    message.error(error.message || '清空失败')
  }
}

// 页码改变
const handlePageChange = (newPage: number) => {
  page.value = newPage
  fetchNotifications()
}

// 每页条数改变
const handlePageSizeChange = (newSize: number) => {
  pageSize.value = newSize
  page.value = 1
  fetchNotifications()
}

// 行样式
const rowClassName = (row: Notification) => {
  return row.isRead ? 'is-read' : ''
}

// 获取通知类型标签样式
const getTypeTagType = (type: Notification['type']) => {
  const typeMap = {
    info: 'info',
    success: 'success',
    warning: 'warning',
    error: 'error',
  }
  return typeMap[type]
}

// 获取通知类型文本
const getTypeText = (type: Notification['type']) => {
  const textMap = {
    info: '信息',
    success: '成功',
    warning: '警告',
    error: '错误',
  }
  return textMap[type]
}

// 获取优先级类型
const getPriorityType = (priority: Notification['priority']) => {
  if (!priority) return 'info'
  const typeMap: Record<NonNullable<Notification['priority']>, string> = {
    low: 'info',
    medium: 'warning',
    high: 'error',
  }
  return typeMap[priority]
}

// 获取优先级文本
const getPriorityText = (priority: Notification['priority']) => {
  if (!priority) return '-'
  const textMap: Record<NonNullable<Notification['priority']>, string> = {
    low: '低',
    medium: '中',
    high: '高',
  }
  return textMap[priority]
}

// 日期快捷选项
const dateShortcuts: Record<string, () => [number, number]> = {
  '最近一周': () => {
    const end = new Date()
    const start = new Date()
    start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
    return [start.getTime(), end.getTime()]
  },
  '最近一月': () => {
    const end = new Date()
    const start = new Date()
    start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
    return [start.getTime(), end.getTime()]
  },
  '最近三月': () => {
    const end = new Date()
    const start = new Date()
    start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
    return [start.getTime(), end.getTime()]
  },
}

// 监听筛选条件变化
watch([filterType, category, type, priority, dateRange], () => {
  page.value = 1
  fetchNotifications()
})

// 初始化
onMounted(() => {
  fetchNotifications()
})
</script>

<style lang="scss" scoped>
.notification-container {
  height: 100%;
  padding: 16px;

  .page-card {
    height: 100%;
    display: flex;
    flex-direction: column;

    :deep(.n-card__content) {
      flex: 1;
      padding: 0;
      display: flex;
      flex-direction: column;
    }
  }

  .notification-title {
    display: flex;
    align-items: center;
    gap: 8px;

    &.is-read {
      opacity: 0.6;
    }
  }

  .sender-cell {
    display: flex;
    align-items: center;
  }

  .expire-time {
    color: var(--error-color);
  }

  :deep(.is-read) {
    opacity: 0.6;
  }
}
</style>