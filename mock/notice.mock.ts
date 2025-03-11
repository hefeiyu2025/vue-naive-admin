import { defineMock } from 'vite-plugin-mock-dev-server'

// 通知公告数据
const noticeList = [
  {
    id: 1,
    title: '系统升级通知',
    content: '尊敬的用户，系统将于2024年3月15日凌晨2:00-4:00进行升级维护，届时系统将暂停服务，请提前做好相关工作安排。给您带来的不便，敬请谅解！',
    type: '通知',
    status: '已发布',
    publishTime: '2024-03-01 10:00:00',
    expireTime: '2024-03-16 00:00:00',
    isTop: true,
    readCount: 125,
    createBy: '系统管理员',
    createTime: '2024-03-01 09:30:00',
    updateTime: '2024-03-01 10:00:00',
  },
  {
    id: 2,
    title: '新功能上线公告',
    content: '尊敬的用户，我们很高兴地通知您，系统新增了以下功能：\n1. 数据导出功能\n2. 批量处理功能\n3. 自定义报表功能\n\n欢迎使用并提供宝贵意见！',
    type: '公告',
    status: '已发布',
    publishTime: '2024-03-05 14:30:00',
    expireTime: '2024-04-05 00:00:00',
    isTop: true,
    readCount: 98,
    createBy: '系统管理员',
    createTime: '2024-03-05 14:00:00',
    updateTime: '2024-03-05 14:30:00',
  },
  {
    id: 3,
    title: '系统安全警告',
    content: '近期发现有不法分子冒充系统管理员，通过钓鱼邮件方式获取用户账号密码。请广大用户提高警惕，不要点击来源不明的链接，不要将账号密码告知他人。',
    type: '警告',
    status: '已发布',
    publishTime: '2024-03-08 09:00:00',
    expireTime: '2024-04-08 00:00:00',
    isTop: true,
    readCount: 156,
    createBy: '安全管理员',
    createTime: '2024-03-08 08:30:00',
    updateTime: '2024-03-08 09:00:00',
  },
  {
    id: 4,
    title: '员工培训通知',
    content: '公司将于2024年3月20日下午2:00-5:00在三楼会议室举办新系统使用培训，请相关部门人员准时参加。',
    type: '通知',
    status: '已发布',
    publishTime: '2024-03-10 11:00:00',
    expireTime: '2024-03-21 00:00:00',
    isTop: false,
    readCount: 76,
    createBy: '人力资源部',
    createTime: '2024-03-10 10:30:00',
    updateTime: '2024-03-10 11:00:00',
  },
  {
    id: 5,
    title: '系统维护通知（草稿）',
    content: '系统将于近期进行例行维护，具体时间待定，请关注后续通知。',
    type: '通知',
    status: '草稿',
    publishTime: '',
    expireTime: '2024-04-30 00:00:00',
    isTop: false,
    readCount: 0,
    createBy: '系统管理员',
    createTime: '2024-03-12 15:30:00',
    updateTime: '2024-03-12 15:30:00',
  },
]

export default defineMock([
  {
    url: '/api/system/notice/list',
    method: 'GET',
    body: ({ query }) => {
      const { keyword, type, status, page = 1, pageSize = 10 } = query
      let list = [...noticeList]
      
      // 搜索
      if (keyword) {
        list = list.filter(item => 
          item.title.includes(keyword) || 
          item.content.includes(keyword)
        )
      }
      
      // 类型过滤
      if (type) {
        list = list.filter(item => item.type === type)
      }
      
      // 状态过滤
      if (status) {
        list = list.filter(item => item.status === status)
      }
      
      // 分页
      const total = list.length
      const start = (page - 1) * pageSize
      const end = start + pageSize
      const pageList = list.slice(start, end)
      
      return {
        code: 0,
        data: {
          list: pageList,
          total,
        },
        message: 'ok',
      }
    },
  },
  {
    url: '/api/system/notice/:id',
    method: 'GET',
    body: ({ params }) => {
      const { id } = params
      const notice = noticeList.find(item => item.id === Number(id))
      
      if (notice) {
        // 模拟阅读次数增加
        const updatedNotice = { ...notice, readCount: notice.readCount + 1 }
        
        return {
          code: 0,
          data: updatedNotice,
          message: 'ok',
        }
      }
      
      return {
        code: 1,
        message: '公告不存在',
      }
    },
  },
  {
    url: '/api/system/notice',
    method: 'POST',
    body: ({ body }) => {
      console.log('创建公告请求数据:', body)
      
      // 处理日期格式
      const now = new Date().toISOString().replace('T', ' ').substring(0, 19)
      
      // 创建新的公告对象，只包含必要字段
      const newNotice = {
        id: noticeList.length + 1,
        title: body.title || '',
        content: body.content || '',
        type: body.type || '通知',
        status: body.status || '草稿',
        publishTime: '',
        expireTime: body.expireTime || '',
        isTop: !!body.isTop,
        readCount: 0,
        createBy: '当前用户',
        createTime: now,
        updateTime: now,
      }
      
      console.log('创建公告响应数据:', newNotice)
      
      return {
        code: 0,
        data: newNotice,
        message: '新增成功',
      }
    },
  },
  {
    url: '/api/system/notice/:id',
    method: 'PUT',
    body: ({ params, body }) => {
      console.log('更新公告请求数据:', body)
      
      // 处理日期格式
      const now = new Date().toISOString().replace('T', ' ').substring(0, 19)
      
      // 创建更新后的公告对象
      const updatedNotice = {
        ...body,
        id: Number(params.id),
        updateTime: now,
      }
      
      console.log('更新公告响应数据:', updatedNotice)
      
      return {
        code: 0,
        data: updatedNotice,
        message: '更新成功',
      }
    },
  },
  {
    url: '/api/system/notice/:id',
    method: 'DELETE',
    body: () => {
      return {
        code: 0,
        data: null,
        message: '删除成功',
      }
    },
  },
  {
    url: '/api/system/notice/publish/:id',
    method: 'PUT',
    body: ({ params }) => {
      const { id } = params
      console.log('发布公告ID:', id)
      
      const notice = noticeList.find(item => item.id === Number(id))
      
      if (!notice) {
        return {
          code: 1,
          message: '公告不存在',
        }
      }
      
      // 处理日期格式
      const now = new Date().toISOString().replace('T', ' ').substring(0, 19)
      
      const publishedNotice = {
        ...notice,
        status: '已发布',
        publishTime: now,
        updateTime: now,
      }
      
      console.log('发布公告响应数据:', publishedNotice)
      
      return {
        code: 0,
        data: publishedNotice,
        message: '发布成功',
      }
    },
  },
  {
    url: '/api/system/notice/revoke/:id',
    method: 'PUT',
    body: ({ params }) => {
      const { id } = params
      console.log('撤回公告ID:', id)
      
      const notice = noticeList.find(item => item.id === Number(id))
      
      if (!notice) {
        return {
          code: 1,
          message: '公告不存在',
        }
      }
      
      // 处理日期格式
      const now = new Date().toISOString().replace('T', ' ').substring(0, 19)
      
      const revokedNotice = {
        ...notice,
        status: '已撤回',
        updateTime: now,
      }
      
      console.log('撤回公告响应数据:', revokedNotice)
      
      return {
        code: 0,
        data: revokedNotice,
        message: '撤回成功',
      }
    },
  },
]) 