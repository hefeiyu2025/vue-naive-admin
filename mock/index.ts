import { createProdMockServer } from 'vite-plugin-mock/client'

// 导入所有 mock 文件
import userMock from './user'
import roleMock from './role'
import permissionMock from './permission'
import configMock from './config'
import noticeMock from './notice'
import menuMock from './menu'
import dictMock from './dict'
import departmentMock from './department'
import notificationMock from './notification'

// 创建生产环境的 mock 服务器
export function setupProdMockServer() {
  createProdMockServer([
    ...userMock,
    ...roleMock,
    ...permissionMock,
    ...configMock,
    ...noticeMock,
    ...menuMock,
    ...dictMock,
    ...departmentMock,
    ...notificationMock,
  ])
} 