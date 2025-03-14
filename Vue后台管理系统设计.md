# Vue-Naive-UI 后台管理系统

## 技术栈要求
1. 包管理工具 pnpm ,全部包使用最新版本
2. 前端UI框架 naive-ui，使用按需自动引入的方式
3. 请求框架axios
4. 状态存储 pinia
5. 路由选择 vue-router
6. mock框架 vite-plugin-mock-dev-server
7. 项目名：vue-naive-admin

## 整体布局

后台管理系统登录后的首页应采用经典的"顶部+侧边栏+内容区"三区布局：

```
+--------------------------------------------------------+
| logo 系统名称   |      顶部导航栏                          |
+----------------+---------------------------------------+
|                |        页签                            |
|                |---------------------------------------|
|                |                                       |
|   左侧菜单栏    |             内容显示区                   |
|                |                                       |
|                |                                       |
|                |                                       |
+----------------+---------------------------------------+
```

## 顶部导航栏内容

顶部导航栏应包含以下元素：

1. **系统Logo和名称**：左上角显示
2. **菜单折叠按钮**：控制左侧菜单的展开/折叠
3. **面包屑导航**：显示当前页面位置
4. **全局搜索**：快速查找功能和内容
5. **系统通知**：消息提醒图标及数量
6. **语言切换**：支持多语言（如需要）
7. **主题切换**：明/暗模式切换
8. **全屏按钮**：切换全屏模式
9. **用户信息**：头像、姓名及下拉菜单（个人中心、修改密码、退出登录）

## 左侧菜单结构

根据功能清单，左侧菜单可以按照以下结构组织：

### 1. 仪表盘
- 系统概览
- 工作台

### 2. 系统管理
- 用户管理
- 角色管理
- 权限管理
- 部门管理
- 菜单管理
- 字典管理
- 参数配置
- 通知公告

### 3. 内容管理
- 文章管理
- 评论管理
- 附件管理
- 轮播图管理

### 4. 工作流管理
- 流程定义
- 流程实例
- 待办任务
- 已办任务
- 表单管理

### 5. 数据中心
- 数据看板
- 统计报表
- 数据可视化
- 数据导入导出

### 6. 消息中心
- 站内消息
- 通知管理
- 提醒设置

### 7. 系统监控
- 在线用户
- 服务监控
- 任务调度
- 操作日志

### 8. 财务管理
- 账单管理
- 支付管理
- 发票管理

### 9. 客户管理
- 客户列表
- 联系人管理
- 商机管理

### 10. 产品管理
- 产品目录
- 库存管理
- 订单管理
- 售后服务

### 11. 项目管理
- 项目概览
- 任务管理
- 团队管理

### 12. 知识库
- 知识文档
- 文件管理
- 常见问题

### 13. 个人中心
- 个人资料
- 修改密码
- 安全设置
- 登录设备

## 内容区首页设计

登录后的首页内容区（仪表盘/系统概览）应包含以下内容：

### 1. 欢迎信息
- 用户名称和角色
- 上次登录时间和地点
- 天气和日期信息（可选）

### 2. 数据概览卡片
- 用户总数/今日新增
- 订单总数/今日新增
- 销售额/今日销售
- 访问量/今日访问

### 3. 快捷操作区
- 常用功能快捷入口（如新增用户、发布文章等）
- 个性化推荐功能

### 4. 待办事项
- 待处理任务列表
- 待审批流程
- 未读消息提醒

### 5. 系统公告
- 最新系统公告列表
- 重要通知提醒

### 6. 数据统计图表
- 用户活跃度趋势图
- 业务数据统计图（如订单量、销售额等）
- 系统性能监控图

### 7. 最近访问
- 最近访问的页面记录
- 快速返回入口

### 8. 团队动态
- 团队成员最近活动
- 项目进展情况

## 菜单权限控制

左侧菜单应根据用户角色和权限进行动态显示：

1. **超级管理员**：显示所有菜单
2. **系统管理员**：显示系统管理、监控等管理类菜单
3. **业务用户**：显示与其业务相关的功能菜单
4. **普通用户**：只显示基础功能和个人中心

## 菜单交互设计

1. **多级菜单**：支持二级、三级菜单，点击父级菜单展开/折叠子菜单
2. **菜单图标**：每个菜单项配有直观的图标
3. **菜单高亮**：当前选中的菜单项高亮显示
4. **菜单徽标**：特定菜单可显示数字徽标（如未读消息数）
5. **菜单折叠**：支持完全折叠（只显示图标）和展开模式
6. **菜单搜索**：在菜单顶部提供搜索框，快速定位功能

## 响应式设计考虑

1. **大屏幕**：完整显示左侧菜单和内容区
2. **中等屏幕**：可折叠左侧菜单，点击展开
3. **小屏幕**：左侧菜单默认隐藏，通过顶部按钮触发显示

## 个性化设置

用户可以对首页进行个性化设置：

1. **菜单收藏**：将常用菜单添加到收藏夹
2. **仪表盘定制**：自定义首页显示的卡片和图表
3. **布局调整**：调整内容区各模块的排列顺序
4. **主题选择**：选择系统主题色和明暗模式

## 设计建议

1. **简洁为主**：避免首页信息过载，保持界面简洁清晰
2. **重点突出**：关键数据和待办事项应当醒目
3. **一致性**：整体设计风格保持一致，符合企业VI
4. **可访问性**：考虑不同用户的使用习惯，提供足够的操作提示
5. **性能优化**：首页加载速度应当优先考虑，可采用懒加载等技术


