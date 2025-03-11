import { MockMethod } from 'vite-plugin-mock'

// 字典类型数据
const dictTypes = [
  {
    id: 1,
    name: '用户性别',
    type: 'sys_user_sex',
    status: true,
    remark: '用户性别列表',
    createTime: '2024-03-01 12:00:00',
    updateTime: '2024-03-01 12:00:00',
  },
  {
    id: 2,
    name: '菜单状态',
    type: 'sys_show_hide',
    status: true,
    remark: '菜单状态列表',
    createTime: '2024-03-01 12:00:00',
    updateTime: '2024-03-01 12:00:00',
  },
  {
    id: 3,
    name: '系统开关',
    type: 'sys_normal_disable',
    status: true,
    remark: '系统开关列表',
    createTime: '2024-03-01 12:00:00',
    updateTime: '2024-03-01 12:00:00',
  },
  {
    id: 4,
    name: '任务状态',
    type: 'sys_job_status',
    status: true,
    remark: '任务状态列表',
    createTime: '2024-03-01 12:00:00',
    updateTime: '2024-03-01 12:00:00',
  },
  {
    id: 5,
    name: '系统是否',
    type: 'sys_yes_no',
    status: true,
    remark: '系统是否列表',
    createTime: '2024-03-01 12:00:00',
    updateTime: '2024-03-01 12:00:00',
  },
]

// 字典数据
const dictDataMap = {
  'sys_user_sex': [
    {
      id: 1,
      dictTypeId: 1,
      dictType: 'sys_user_sex',
      label: '男',
      value: '0',
      cssClass: '',
      listClass: 'default',
      isDefault: true,
      status: true,
      orderNum: 1,
      remark: '性别男',
      createTime: '2024-03-01 12:00:00',
      updateTime: '2024-03-01 12:00:00',
    },
    {
      id: 2,
      dictTypeId: 1,
      dictType: 'sys_user_sex',
      label: '女',
      value: '1',
      cssClass: '',
      listClass: 'success',
      isDefault: false,
      status: true,
      orderNum: 2,
      remark: '性别女',
      createTime: '2024-03-01 12:00:00',
      updateTime: '2024-03-01 12:00:00',
    },
    {
      id: 3,
      dictTypeId: 1,
      dictType: 'sys_user_sex',
      label: '未知',
      value: '2',
      cssClass: '',
      listClass: 'warning',
      isDefault: false,
      status: true,
      orderNum: 3,
      remark: '性别未知',
      createTime: '2024-03-01 12:00:00',
      updateTime: '2024-03-01 12:00:00',
    },
  ],
  'sys_show_hide': [
    {
      id: 4,
      dictTypeId: 2,
      dictType: 'sys_show_hide',
      label: '显示',
      value: '0',
      cssClass: '',
      listClass: 'success',
      isDefault: true,
      status: true,
      orderNum: 1,
      remark: '显示菜单',
      createTime: '2024-03-01 12:00:00',
      updateTime: '2024-03-01 12:00:00',
    },
    {
      id: 5,
      dictTypeId: 2,
      dictType: 'sys_show_hide',
      label: '隐藏',
      value: '1',
      cssClass: '',
      listClass: 'warning',
      isDefault: false,
      status: true,
      orderNum: 2,
      remark: '隐藏菜单',
      createTime: '2024-03-01 12:00:00',
      updateTime: '2024-03-01 12:00:00',
    },
  ],
  'sys_normal_disable': [
    {
      id: 6,
      dictTypeId: 3,
      dictType: 'sys_normal_disable',
      label: '正常',
      value: '0',
      cssClass: '',
      listClass: 'success',
      isDefault: true,
      status: true,
      orderNum: 1,
      remark: '正常状态',
      createTime: '2024-03-01 12:00:00',
      updateTime: '2024-03-01 12:00:00',
    },
    {
      id: 7,
      dictTypeId: 3,
      dictType: 'sys_normal_disable',
      label: '停用',
      value: '1',
      cssClass: '',
      listClass: 'error',
      isDefault: false,
      status: true,
      orderNum: 2,
      remark: '停用状态',
      createTime: '2024-03-01 12:00:00',
      updateTime: '2024-03-01 12:00:00',
    },
  ],
}

export default [
  // 字典类型接口
  {
    url: '/api/system/dict/type/list',
    method: 'get',
    response: ({ query }) => {
      const { keyword, page = 1, pageSize = 10 } = query
      let list = [...dictTypes]
      
      // 搜索
      if (keyword) {
        list = list.filter(item => 
          item.name.includes(keyword) || 
          item.type.includes(keyword)
        )
      }
      
      // 分页
      const start = (page - 1) * pageSize
      const end = start + pageSize
      const pageList = list.slice(start, end)
      
      return {
        code: 0,
        data: {
          list: pageList,
          total: list.length,
        },
        message: 'ok',
      }
    },
  },
  {
    url: '/api/system/dict/type/:id',
    method: 'get',
    response: (options) => {
      const id = options.query?.id || '1'
      const dictType = dictTypes.find(item => item.id === Number(id))
      
      if (dictType) {
        return {
          code: 0,
          data: dictType,
          message: 'ok',
        }
      }
      
      return {
        code: 1,
        message: '字典类型不存在',
      }
    },
  },
  {
    url: '/api/system/dict/type',
    method: 'post',
    response: ({ body }) => {
      return {
        code: 0,
        data: {
          id: dictTypes.length + 1,
          ...body,
          createTime: '2024-03-10 12:00:00',
          updateTime: '2024-03-10 12:00:00',
        },
        message: '新增成功',
      }
    },
  },
  {
    url: '/api/system/dict/type/:id',
    method: 'put',
    response: (options) => {
      const id = options.query?.id || '1'
      return {
        code: 0,
        data: {
          ...options.body,
          id: Number(id),
          updateTime: '2024-03-10 12:00:00',
        },
        message: '更新成功',
      }
    },
  },
  {
    url: '/api/system/dict/type/:id',
    method: 'delete',
    response: () => {
      return {
        code: 0,
        data: null,
        message: '删除成功',
      }
    },
  },
  
  // 字典数据接口
  {
    url: '/api/system/dict/data/list',
    method: 'get',
    response: ({ query }) => {
      const { dictType, keyword, page = 1, pageSize = 10 } = query
      
      if (!dictType || !dictDataMap[dictType]) {
        return {
          code: 0,
          data: {
            list: [],
            total: 0
          },
          message: 'ok',
        }
      }
      
      let list = [...dictDataMap[dictType]]
      
      // 搜索
      if (keyword) {
        list = list.filter(item => 
          item.label.includes(keyword) || 
          item.value.includes(keyword)
        )
      }
      
      // 分页
      const start = (page - 1) * pageSize
      const end = start + pageSize
      const pageList = list.slice(start, end)
      
      return {
        code: 0,
        data: {
          list: pageList,
          total: list.length
        },
        message: 'ok',
      }
    },
  },
  {
    url: '/api/system/dict/data/:id',
    method: 'get',
    response: (options) => {
      const id = options.query?.id || '1'
      const allDictData = Object.values(dictDataMap).flat()
      const dictData = allDictData.find(item => item.id === Number(id))
      
      if (dictData) {
        return {
          code: 0,
          data: dictData,
          message: 'ok',
        }
      }
      
      return {
        code: 1,
        message: '字典数据不存在',
      }
    },
  },
  {
    url: '/api/system/dict/data',
    method: 'post',
    response: ({ body }) => {
      const { dictType } = body
      const allDictData = Object.values(dictDataMap).flat()
      
      return {
        code: 0,
        data: {
          id: allDictData.length + 1,
          ...body,
          dictTypeId: dictTypes.find(item => item.type === dictType)?.id,
          createTime: '2024-03-10 12:00:00',
          updateTime: '2024-03-10 12:00:00',
        },
        message: '新增成功',
      }
    },
  },
  {
    url: '/api/system/dict/data/:id',
    method: 'put',
    response: (options) => {
      const id = options.query?.id || '1'
      return {
        code: 0,
        data: {
          ...options.body,
          id: Number(id),
          updateTime: '2024-03-10 12:00:00',
        },
        message: '更新成功',
      }
    },
  },
  {
    url: '/api/system/dict/data/:id',
    method: 'delete',
    response: () => {
      return {
        code: 0,
        data: null,
        message: '删除成功',
      }
    },
  },
] as MockMethod[] 