import { defineMock } from 'vite-plugin-mock-dev-server'

// 参数配置数据
const configList = [
  {
    id: 1,
    name: '系统名称',
    key: 'sys.name',
    value: 'Vue Naive Admin',
    type: '系统内置',
    group: '系统配置',
    isBuiltin: true,
    status: true,
    remark: '系统名称',
    createTime: '2024-03-01 12:00:00',
    updateTime: '2024-03-01 12:00:00',
  },
  {
    id: 2,
    name: '系统版本',
    key: 'sys.version',
    value: '1.0.0',
    type: '系统内置',
    group: '系统配置',
    isBuiltin: true,
    status: true,
    remark: '系统版本',
    createTime: '2024-03-01 12:00:00',
    updateTime: '2024-03-01 12:00:00',
  },
  {
    id: 3,
    name: '系统描述',
    key: 'sys.description',
    value: '基于Vue3和Naive UI的后台管理系统',
    type: '系统内置',
    group: '系统配置',
    isBuiltin: true,
    status: true,
    remark: '系统描述',
    createTime: '2024-03-01 12:00:00',
    updateTime: '2024-03-01 12:00:00',
  },
  {
    id: 4,
    name: '系统Logo',
    key: 'sys.logo',
    value: '/logo.png',
    type: '系统内置',
    group: '系统配置',
    isBuiltin: true,
    status: true,
    remark: '系统Logo',
    createTime: '2024-03-01 12:00:00',
    updateTime: '2024-03-01 12:00:00',
  },
  {
    id: 5,
    name: '系统版权',
    key: 'sys.copyright',
    value: '© 2024 Vue Naive Admin',
    type: '系统内置',
    group: '系统配置',
    isBuiltin: true,
    status: true,
    remark: '系统版权',
    createTime: '2024-03-01 12:00:00',
    updateTime: '2024-03-01 12:00:00',
  },
  {
    id: 6,
    name: 'SMTP服务器',
    key: 'mail.smtp.host',
    value: 'smtp.example.com',
    type: '自定义',
    group: '邮件配置',
    isBuiltin: false,
    status: true,
    remark: 'SMTP服务器地址',
    createTime: '2024-03-01 12:00:00',
    updateTime: '2024-03-01 12:00:00',
  },
  {
    id: 7,
    name: 'SMTP端口',
    key: 'mail.smtp.port',
    value: '465',
    type: '自定义',
    group: '邮件配置',
    isBuiltin: false,
    status: true,
    remark: 'SMTP服务器端口',
    createTime: '2024-03-01 12:00:00',
    updateTime: '2024-03-01 12:00:00',
  },
  {
    id: 8,
    name: '邮箱账号',
    key: 'mail.username',
    value: 'admin@example.com',
    type: '自定义',
    group: '邮件配置',
    isBuiltin: false,
    status: true,
    remark: '邮箱账号',
    createTime: '2024-03-01 12:00:00',
    updateTime: '2024-03-01 12:00:00',
  },
  {
    id: 9,
    name: '短信API地址',
    key: 'sms.api.url',
    value: 'https://api.sms.example.com',
    type: '自定义',
    group: '短信配置',
    isBuiltin: false,
    status: true,
    remark: '短信API地址',
    createTime: '2024-03-01 12:00:00',
    updateTime: '2024-03-01 12:00:00',
  },
  {
    id: 10,
    name: '短信API密钥',
    key: 'sms.api.key',
    value: 'xxxxxxxxxxxxxxxx',
    type: '自定义',
    group: '短信配置',
    isBuiltin: false,
    status: true,
    remark: '短信API密钥',
    createTime: '2024-03-01 12:00:00',
    updateTime: '2024-03-01 12:00:00',
  },
]

// 参数分组
const configGroups = [
  '系统配置',
  '邮件配置',
  '短信配置',
  '文件配置',
  '安全配置',
]

export default defineMock([
  {
    url: '/api/system/config/list',
    method: 'GET',
    body: ({ query }) => {
      const { keyword, type, group, page = 1, pageSize = 10 } = query
      let list = [...configList]
      
      // 搜索
      if (keyword) {
        list = list.filter(item => 
          item.name.includes(keyword) || 
          item.key.includes(keyword) ||
          item.value.includes(keyword)
        )
      }
      
      // 类型过滤
      if (type) {
        list = list.filter(item => item.type === type)
      }
      
      // 分组过滤
      if (group) {
        list = list.filter(item => item.group === group)
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
    url: '/api/system/config/:id',
    method: 'GET',
    body: ({ params }) => {
      const { id } = params
      const config = configList.find(item => item.id === Number(id))
      
      if (config) {
        return {
          code: 0,
          data: config,
          message: 'ok',
        }
      }
      
      return {
        code: 1,
        message: '参数不存在',
      }
    },
  },
  {
    url: '/api/system/config',
    method: 'POST',
    body: ({ body }) => {
      return {
        code: 0,
        data: {
          id: configList.length + 1,
          ...body,
          createTime: '2024-03-10 12:00:00',
          updateTime: '2024-03-10 12:00:00',
        },
        message: '新增成功',
      }
    },
  },
  {
    url: '/api/system/config/:id',
    method: 'PUT',
    body: ({ params, body }) => {
      return {
        code: 0,
        data: {
          ...body,
          id: Number(params.id),
          updateTime: '2024-03-10 12:00:00',
        },
        message: '更新成功',
      }
    },
  },
  {
    url: '/api/system/config/:id',
    method: 'DELETE',
    body: ({ params }) => {
      const { id } = params
      const config = configList.find(item => item.id === Number(id))
      
      if (config && config.isBuiltin) {
        return {
          code: 1,
          message: '内置参数不能删除',
        }
      }
      
      return {
        code: 0,
        data: null,
        message: '删除成功',
      }
    },
  },
  {
    url: '/api/system/config/groups',
    method: 'GET',
    body: () => {
      return {
        code: 0,
        data: configGroups,
        message: 'ok',
      }
    },
  },
]) 