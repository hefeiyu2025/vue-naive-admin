import { h } from 'vue'
import { NIcon } from 'naive-ui'
import {
  PersonOutline,
  PeopleOutline,
  KeyOutline,
  SettingsOutline,
  MenuOutline,
  BookOutline,
  NotificationsOutline,
  BuildOutline,
  GridOutline,
  DocumentTextOutline,
  BarChartOutline,
  MailOutline,
  ServerOutline,
  TimeOutline,
  LogoUsd,
  PeopleCircleOutline,
  BagOutline,
  FolderOpenOutline,
  SettingsSharp,
  PersonSharp,
  PeopleSharp,
  KeySharp,
  MenuSharp,
  BookSharp,
  NotificationsSharp,
  AppsOutline,
} from '@vicons/ionicons5'

// 图标映射表
export const iconMap = {
  // 系统管理
  user: () => h(PersonOutline),
  role: () => h(PeopleOutline),
  permission: () => h(KeyOutline),
  department: () => h(PeopleSharp),
  menu: () => h(MenuOutline),
  dict: () => h(BookOutline),
  config: () => h(SettingsOutline),
  notice: () => h(NotificationsOutline),
  
  // 其他模块
  setting: () => h(SettingsSharp),
  dashboard: () => h(AppsOutline),
  content: () => h(DocumentTextOutline),
  workflow: () => h(BuildOutline),
  datacenter: () => h(BarChartOutline),
  message: () => h(MailOutline),
  monitor: () => h(ServerOutline),
  schedule: () => h(TimeOutline),
  finance: () => h(LogoUsd),
  customer: () => h(PeopleCircleOutline),
  product: () => h(BagOutline),
  project: () => h(GridOutline),
  knowledge: () => h(FolderOpenOutline),
}

// 渲染图标的函数
export function renderIcon(icon: any) {
  return () => h(NIcon, null, { default: () => h(icon) })
}

// 根据名称获取图标
export function getIcon(name: string) {
  return iconMap[name] ? iconMap[name]() : h(SettingsOutline)
} 