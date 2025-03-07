<template>
  <n-layout class="layout" has-sider>
    <!-- 侧边栏 -->
    <n-layout-sider
      :collapsed="collapsed"
      :collapsed-width="64"
      :width="220"
      show-trigger
      @collapse="collapsed = true"
      @expand="collapsed = false"
      bordered
    >
      <div class="logo">
        <img src="@/assets/logo.svg" alt="logo" />
        <h1 v-show="!collapsed">Vue Naive Admin</h1>
      </div>
      <n-menu
        v-model:value="activeKey"
        :collapsed="collapsed"
        :collapsed-width="64"
        :collapsed-icon-size="22"
        :options="menuOptions"
        :render-icon="renderIcon"
        :render-label="renderLabel"
        :expand-icon="renderArrow"
      />
    </n-layout-sider>

    <!-- 主体内容 -->
    <n-layout>
      <!-- 顶部导航 -->
      <n-layout-header bordered>
        <div class="header">
          <div class="header-left">
            <n-button quaternary circle @click="collapsed = !collapsed">
              <template #icon>
                <n-icon size="20">
                  <menu-outline />
                </n-icon>
              </template>
            </n-button>
            <n-breadcrumb>
              <n-breadcrumb-item v-for="item in breadcrumbs" :key="item.path">
                {{ item.title }}
              </n-breadcrumb-item>
            </n-breadcrumb>
          </div>
          <div class="header-right">
            <n-space :size="24">
              <n-button quaternary circle>
                <template #icon>
                  <n-icon><search-outline /></n-icon>
                </template>
              </n-button>
              <n-button quaternary circle>
                <template #icon>
                  <n-icon><notifications-outline /></n-icon>
                </template>
              </n-button>
              <n-dropdown :options="userOptions" @select="handleUserSelect">
                <n-avatar
                  round
                  :size="32"
                  :src="userStore.userInfo?.avatar"
                  :fallback-src="defaultAvatar"
                />
              </n-dropdown>
            </n-space>
          </div>
        </div>
      </n-layout-header>

      <!-- 内容区域 -->
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

<script lang="ts" setup>
import { ref, computed, h } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore, usePermissionStore } from '@/store'
import { NIcon } from 'naive-ui'
import {
  MenuOutline,
  SearchOutline,
  NotificationsOutline,
  ChevronForwardOutline,
} from '@vicons/ionicons5'
import defaultAvatar from '@/assets/default-avatar.svg'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const permissionStore = usePermissionStore()

// 侧边栏折叠状态
const collapsed = ref(false)

// 当前激活的菜单项
const activeKey = computed(() => route.name as string)

// 面包屑导航
const breadcrumbs = computed(() => {
  const matched = route.matched.filter(item => item.meta?.title)
  return matched.map(item => ({
    title: item.meta?.title,
    path: item.path,
  }))
})

// 用户下拉菜单
const userOptions = [
  {
    label: '个人中心',
    key: 'profile',
  },
  {
    label: '退出登录',
    key: 'logout',
  },
]

// 处理用户菜单选择
const handleUserSelect = async (key: string) => {
  if (key === 'logout') {
    await userStore.logout()
    router.push('/login')
  }
  else if (key === 'profile') {
    router.push('/profile')
  }
}

// 渲染图标
const renderIcon = (icon: any) => {
  return () => h(NIcon, null, { default: () => h(icon) })
}

// 渲染标签
const renderLabel = (option: any) => {
  return option.label
}

// 渲染箭头
const renderArrow = () => {
  return h(NIcon, null, { default: () => h(ChevronForwardOutline) })
}

// 菜单配置
const menuOptions = computed(() => {
  return permissionStore.menus.map((menu: any) => ({
    label: menu.name,
    key: menu.code,
    icon: menu.icon,
    children: menu.children?.map((child: any) => ({
      label: child.name,
      key: child.code,
      icon: child.icon,
    })),
  }))
})
</script>

<style lang="scss" scoped>
.layout {
  height: 100vh;

  .logo {
    display: flex;
    align-items: center;
    padding: 16px;
    height: 64px;

    img {
      width: 32px;
      height: 32px;
    }

    h1 {
      margin: 0 0 0 12px;
      font-size: 16px;
      font-weight: 600;
      color: #1a1a1a;
      white-space: nowrap;
    }
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 24px;
    height: 64px;

    &-left {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    &-right {
      display: flex;
      align-items: center;
    }
  }

  .content {
    padding: 24px;
    background-color: #f0f2f5;
  }
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