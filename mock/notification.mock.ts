import { defineMock } from 'vite-plugin-mock-dev-server'

const notifications = [
  {
    id: '1',
    title: '系统更新通知',
    content: '系统将于今晚22:00进行例行维护更新，预计耗时2小时。',
    type: 'info',
    isRead: false,
    createTime: '2024-03-20 10:00:00',
    sender: '系统管理员',
    senderAvatar: 'https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg',
    priority: 'high',
    category: 'system',
    expireTime: '2024-03-21 10:00:00',
    link: '/system/update',
    action: {
      text: '查看详情',
      link: '/system/update'
    }
  },
  {
    id: '2',
    title: '任务分配通知',
    content: '您有一个新的任务待处理：项目文档编写',
    type: 'success',
    isRead: true,
    createTime: '2024-03-20 09:30:00',
    sender: '项目经理',
    senderAvatar: 'https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg',
    priority: 'medium',
    category: 'task',
    expireTime: '2024-03-22 18:00:00',
    link: '/task/1',
    action: {
      text: '查看任务',
      link: '/task/1'
    }
  },
  {
    id: '3',
    title: '审批请求通知',
    content: '您有一个新的审批请求待处理：请假申请',
    type: 'warning',
    isRead: false,
    createTime: '2024-03-20 09:00:00',
    sender: '张三',
    senderAvatar: 'https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg',
    priority: 'high',
    category: 'approval',
    expireTime: '2024-03-21 09:00:00',
    link: '/approval/1',
    action: {
      text: '处理审批',
      link: '/approval/1'
    }
  },
  {
    id: '4',
    title: '安全警告通知',
    content: '检测到异常登录尝试，请及时查看',
    type: 'error',
    isRead: false,
    createTime: '2024-03-20 08:30:00',
    sender: '安全系统',
    senderAvatar: 'https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg',
    priority: 'high',
    category: 'security',
    expireTime: '2024-03-21 08:30:00',
    link: '/security/log',
    action: {
      text: '查看日志',
      link: '/security/log'
    }
  },
]

export default defineMock([
  {
    url: '/api/notification/list',
    method: 'GET',
    body: ({ query }) => {
      const { page = 1, pageSize = 10, isRead, category, type, priority, startTime, endTime } = query
      let filteredList = [...notifications]

      // 筛选已读/未读
      if (isRead !== undefined) {
        filteredList = filteredList.filter(item => item.isRead === (isRead === 'true'))
      }

      // 筛选分类
      if (category) {
        filteredList = filteredList.filter(item => item.category === category)
      }

      // 筛选类型
      if (type) {
        filteredList = filteredList.filter(item => item.type === type)
      }

      // 筛选优先级
      if (priority) {
        filteredList = filteredList.filter(item => item.priority === priority)
      }

      // 筛选时间范围
      if (startTime && endTime) {
        filteredList = filteredList.filter(item => {
          const itemTime = new Date(item.createTime).getTime()
          return itemTime >= Number(startTime) && itemTime <= Number(endTime)
        })
      }

      // 分页
      const start = (Number(page) - 1) * Number(pageSize)
      const end = start + Number(pageSize)
      const list = filteredList.slice(start, end)

      return {
        code: 0,
        data: list,
        total: filteredList.length,
      }
    },
  },
  {
    url: '/api/notification/unread/count',
    method: 'GET',
    body: () => {
      const count = notifications.filter(item => !item.isRead).length
      return {
        code: 0,
        data: count,
      }
    },
  },
  {
    url: '/api/notification/:id/read',
    method: 'PUT',
    body: ({ params }) => {
      const notification = notifications.find(item => item.id === params.id)
      if (notification) {
        notification.isRead = true
        return {
          code: 0,
          message: '标记成功',
        }
      }
      return {
        code: 404,
        message: '通知不存在',
      }
    },
  },
  {
    url: '/api/notification/read/all',
    method: 'PUT',
    body: () => {
      notifications.forEach(item => item.isRead = true)
      return {
        code: 0,
        message: '标记成功',
      }
    },
  },
  {
    url: '/api/notification/:id',
    method: 'DELETE',
    body: ({ params }) => {
      const index = notifications.findIndex(item => item.id === params.id)
      if (index > -1) {
        notifications.splice(index, 1)
        return {
          code: 0,
          message: '删除成功',
        }
      }
      return {
        code: 404,
        message: '通知不存在',
      }
    },
  },
]) 