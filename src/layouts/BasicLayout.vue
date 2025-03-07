<!-- 基础布局组件 -->
<template>
  <n-layout class="layout" has-sider>
    <!-- 侧边栏 -->
    <n-layout-sider
      bordered
      collapse-mode="width"
      :collapsed-width="64"
      :width="240"
      :collapsed="collapsed"
      show-trigger
      @collapse="collapsed = true"
      @expand="collapsed = false"
    >
      <!-- Logo -->
      <div class="logo">
        <img src="@/assets/logo.svg" alt="Logo" />
        <h1 v-show="!collapsed">Vue Naive Admin</h1>
      </div>

      <!-- 菜单 -->
      <n-menu
        :collapsed="collapsed"
        :collapsed-width="64"
        :collapsed-icon-size="22"
        :options="menuOptions"
        :value="activeKey"
        @update:value="handleMenuClick"
      />
    </n-layout-sider>

    <!-- 主内容区 -->
    <n-layout>
      <!-- 顶部导航栏 -->
      <n-layout-header bordered>
        <div class="header">
          <!-- 折叠按钮 -->
          <n-button quaternary circle @click="collapsed = !collapsed">
            <template #icon>
              <n-icon size="18">
                <MenuOutline v-if="collapsed" />
                <ChevronForwardOutline v-else />
              </n-icon>
            </template>
          </n-button>

          <!-- 面包屑 -->
          <n-breadcrumb>
            <n-breadcrumb-item v-for="item in breadcrumbs" :key="item.path">
              {{ item.title }}
            </n-breadcrumb-item>
          </n-breadcrumb>

          <!-- 右侧工具栏 -->
          <div class="toolbar">
            <!-- 搜索 -->
            <n-button quaternary circle>
              <template #icon>
                <n-icon><SearchOutline /></n-icon>
              </template>
            </n-button>

            <!-- 通知 -->
            <n-button quaternary circle>
              <template #icon>
                <n-icon><NotificationsOutline /></n-icon>
              </template>
            </n-button>

            <!-- 全屏 -->
            <n-button quaternary circle @click="toggleFullscreen">
              <template #icon>
                <n-icon>
                  <ScanOutline v-if="!isFullscreen" />
                  <ExpandOutline v-else />
                </n-icon>
              </template>
            </n-button>

            <!-- 主题切换 -->
            <n-button quaternary circle @click="toggleTheme">
              <template #icon>
                <n-icon>
                  <SunnyOutline v-if="isDark" />
                  <MoonOutline v-else />
                </n-icon>
              </template>
            </n-button>

            <!-- 用户信息 -->
            <n-dropdown :options="userOptions" @select="handleUserSelect">
              <n-avatar round size="small" src="@/assets/avatar.svg" />
            </n-dropdown>
          </div>
        </div>
      </n-layout-header>

      <!-- 标签页 -->
      <n-card :bordered="false" class="tabs">
        <n-tabs
          type="card"
          :value="activeTab"
          :options="tabOptions"
          @update:value="handleTabUpdate"
          @close="handleTabClose"
        />
      </n-card>

      <!-- 内容区 -->
      <n-layout-content class="content">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </n-layout-content>
    </n-layout>
  </n-layout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import {
  MenuOutline,
  SearchOutline,
  NotificationsOutline,
  ChevronForwardOutline,
  ScanOutline,
  PersonOutline,
  PeopleOutline,
  KeyOutline,
  SettingsOutline,
  GridOutline,
  ContractOutline,
  ExpandOutline,
  SunnyOutline,
  MoonOutline
} from '@vicons/ionicons5'
import { useFullscreen } from '@vueuse/core'
import { useThemeStore } from '@/store/theme'
import { useUserStore } from '@/store'
import { useMenuStore } from '@/store/menu'
import { useTabStore } from '@/store/tab'

const router = useRouter()
const themeStore = useThemeStore()
const userStore = useUserStore()
const menuStore = useMenuStore()
const tabStore = useTabStore()

// 侧边栏折叠状态
const collapsed = ref(false)

// 全屏
const { isFullscreen, toggle: toggleFullscreen } = useFullscreen()

// 主题
const isDark = computed(() => themeStore.isDark)
const toggleTheme = () => themeStore.toggleTheme()

// 菜单
const menuOptions = computed(() => menuStore.menuOptions)
const activeKey = computed(() => menuStore.activeKey)
const handleMenuClick = (key: string) => {
  menuStore.setActiveKey(key)
  router.push(key)
}

// 面包屑
const breadcrumbs = computed(() => menuStore.breadcrumbs)

// 用户菜单
const userOptions = [
  {
    label: '个人中心',
    key: 'profile',
  },
  {
    label: '修改密码',
    key: 'password',
  },
  {
    type: 'divider',
  },
  {
    label: '退出登录',
    key: 'logout',
  },
]

const handleUserSelect = (key: string) => {
  switch (key) {
    case 'profile':
      router.push('/profile')
      break
    case 'password':
      router.push('/password')
      break
    case 'logout':
      userStore.logout()
      router.push('/login')
      break
  }
}

// 标签页
const activeTab = computed(() => tabStore.activeTab)
const tabOptions = computed(() => tabStore.tabs)
const handleTabUpdate = (key: string) => {
  tabStore.setActiveTab(key)
  router.push(key)
}
const handleTabClose = (key: string) => {
  tabStore.removeTab(key)
}

// 图标映射
const iconMap: Record<string, any> = {
  dashboard: GridOutline,
  user: PersonOutline,
  role: PeopleOutline,
  permission: KeyOutline,
  system: SettingsOutline,
}
</script>

<style scoped>
.layout {
  height: 100vh;
}

.logo {
  height: 64px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.logo img {
  width: 32px;
  height: 32px;
}

.logo h1 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.header {
  height: 64px;
  padding: 0 16px;
  display: flex;
  align-items: center;
  gap: 16px;
}

.toolbar {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 8px;
}

.tabs {
  margin: 8px;
}

.content {
  padding: 16px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style> 