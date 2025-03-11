import { MockMethod } from 'vite-plugin-mock'

// 生成部门树形结构数据
const generateDepartmentTree = (keyword?: string) => {
  const departments = [
    {
      id: 1,
      name: '总公司',
      code: 'HQ',
      parentId: 0,
      path: '1',
      leader: '张三',
      phone: '13800138001',
      email: 'zhangsan@example.com',
      status: true,
      orderNum: 1,
      createTime: '2024-03-01 12:00:00',
      updateTime: '2024-03-01 12:00:00',
      children: [
        {
          id: 2,
          name: '研发部',
          code: 'DEV',
          parentId: 1,
          path: '1,2',
          leader: '李四',
          phone: '13800138002',
          email: 'lisi@example.com',
          status: true,
          orderNum: 1,
          createTime: '2024-03-01 12:00:00',
          updateTime: '2024-03-01 12:00:00',
          children: [
            {
              id: 5,
              name: '前端组',
              code: 'FRONT',
              parentId: 2,
              path: '1,2,5',
              leader: '王五',
              phone: '13800138005',
              email: 'wangwu@example.com',
              status: true,
              orderNum: 1,
              createTime: '2024-03-01 12:00:00',
              updateTime: '2024-03-01 12:00:00',
            },
            {
              id: 6,
              name: '后端组',
              code: 'BACK',
              parentId: 2,
              path: '1,2,6',
              leader: '赵六',
              phone: '13800138006',
              email: 'zhaoliu@example.com',
              status: true,
              orderNum: 2,
              createTime: '2024-03-01 12:00:00',
              updateTime: '2024-03-01 12:00:00',
            }
          ]
        },
        {
          id: 3,
          name: '市场部',
          code: 'MARKET',
          parentId: 1,
          path: '1,3',
          leader: '王七',
          phone: '13800138003',
          email: 'wangqi@example.com',
          status: true,
          orderNum: 2,
          createTime: '2024-03-01 12:00:00',
          updateTime: '2024-03-01 12:00:00',
        },
        {
          id: 4,
          name: '运营部',
          code: 'OPS',
          parentId: 1,
          path: '1,4',
          leader: '钱八',
          phone: '13800138004',
          email: 'qianba@example.com',
          status: true,
          orderNum: 3,
          createTime: '2024-03-01 12:00:00',
          updateTime: '2024-03-01 12:00:00',
        }
      ]
    }
  ]

  // 搜索部门
  if (keyword) {
    const searchDepartments = (departmentList: any[]) => {
      return departmentList.filter(department => {
        const match = department.name.includes(keyword) || department.code.includes(keyword)
        if (department.children && department.children.length > 0) {
          department.children = searchDepartments(department.children)
          return match || department.children.length > 0
        }
        return match
      })
    }
    return searchDepartments(JSON.parse(JSON.stringify(departments)))
  }

  return departments
}

export default [
  {
    url: '/api/system/department/tree',
    method: 'get',
    response: ({ query }) => {
      const { keyword } = query
      return {
        code: 0,
        data: generateDepartmentTree(keyword),
        message: 'ok',
      }
    },
  },
  {
    url: '/api/system/department/list',
    method: 'get',
    response: ({ query }) => {
      const { keyword } = query
      // 这里简化处理，实际项目中可能需要扁平化处理树形结构
      const departments = generateDepartmentTree(keyword)
      return {
        code: 0,
        data: {
          list: departments,
          total: departments.length,
        },
        message: 'ok',
      }
    },
  },
  {
    url: '/api/system/department/:id',
    method: 'get',
    response: (options) => {
      const id = options.query?.id || '1'
      // 简单模拟，实际项目中需要根据ID查找对应部门
      return {
        code: 0,
        data: {
          id: Number(id),
          name: `部门${id}`,
          code: `DEPT_${id}`,
          parentId: 0,
          path: id,
          leader: '张三',
          phone: '13800138000',
          email: 'zhangsan@example.com',
          status: true,
          orderNum: 1,
          createTime: '2024-03-01 12:00:00',
          updateTime: '2024-03-01 12:00:00',
        },
        message: 'ok',
      }
    },
  },
  {
    url: '/api/system/department',
    method: 'post',
    response: ({ body }) => {
      return {
        code: 0,
        data: {
          id: 100,
          ...body,
          createTime: '2024-03-10 12:00:00',
          updateTime: '2024-03-10 12:00:00',
        },
        message: '新增成功',
      }
    },
  },
] as MockMethod[] 