<!-- 顶部导航栏组件 -->
<template>
  <n-layout-header bordered>
    <div class="header">
      <!-- 折叠按钮 -->
      <n-button quaternary circle @click="toggleCollapse">
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
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import {
  MenuOutline,
  SearchOutline,
  NotificationsOutline,
  ChevronForwardOutline,
  ScanOutline,
  ExpandOutline,
  SunnyOutline,
  MoonOutline
} from '@vicons/ionicons5'
import { useFullscreen } from '@vueuse/core'
import { useThemeStore } from '@/store/theme'
import { useUserStore } from '@/store'
import { useMenuStore } from '@/store/menu'

const props = defineProps<{
  collapsed: boolean
}>()

const emit = defineEmits<{
  (e: 'update:collapsed', value: boolean): void
}>()

const router = useRouter()
const themeStore = useThemeStore()
const userStore = useUserStore()
const menuStore = useMenuStore()

// 全屏
const { isFullscreen, toggle: toggleFullscreen } = useFullscreen()

// 主题
const isDark = computed(() => themeStore.isDark)
const toggleTheme = () => themeStore.toggleTheme()

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

// 处理用户菜单选择
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

// 切换折叠状态
const toggleCollapse = () => {
  emit('update:collapsed', !props.collapsed)
}
</script>

<style scoped>
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
</style> 