<!-- 顶部导航栏组件 -->
<template>
  <n-layout-header bordered>
    <div class="header">
      <!-- 折叠按钮 -->
      <n-button quaternary circle @click="toggleCollapse">
        <template #icon>
          <n-icon size="18" :class="{ 'icon-rotate': collapsed }">
            <MenuOutline />
          </n-icon>
        </template>
      </n-button>

      <!-- 面包屑 -->
      <n-breadcrumb>
        <n-breadcrumb-item v-for="item in breadcrumbs" :key="item.path">
          {{ t(item.title) }}
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
        <Notification />

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

        <!-- 语言切换 -->
        <n-button quaternary circle class="lang-button" @click="toggleLanguage">
          <template #icon>
            <div class="language-switch">
              <n-icon size="18">
                <EarthOutline />
              </n-icon>
              <span class="lang-text" :class="{ 'active': languageStore.currentLanguage === 'zh-CN' }">中</span>
              <span class="divider">/</span>
              <span class="lang-text" :class="{ 'active': languageStore.currentLanguage === 'en-US' }">En</span>
            </div>
          </template>
        </n-button>

        <!-- 用户信息 -->
        <n-dropdown :options="userOptions" @select="handleUserSelect" trigger="click">
          <n-space align="center">
            <n-avatar
              round
              size="small"
              :src="userStore.userInfo?.avatar"
              :fallback-src="defaultAvatar"
            />
            <span class="username">{{ userStore.userInfo?.username }}</span>
          </n-space>
        </n-dropdown>
      </div>
    </div>
  </n-layout-header>
</template>

<script setup lang="ts">
import { computed, h } from 'vue'
import { useRouter } from 'vue-router'
import { useMessage } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import {
  MenuOutline,
  SearchOutline,
  NotificationsOutline,
  ScanOutline,
  ExpandOutline,
  SunnyOutline,
  MoonOutline,
  EarthOutline
} from '@vicons/ionicons5'
import { useFullscreen } from '@vueuse/core'
import { useThemeStore } from '@/store/theme'
import { useUserStore } from '@/store'
import { useMenuStore } from '@/store/menu'
import { useLanguageStore } from '@/store/language'
import defaultAvatar from '@/assets/default-avatar.svg'
import Notification from './Notification.vue'

const props = defineProps<{
  collapsed: boolean
}>()

const emit = defineEmits<{
  (e: 'update:collapsed', value: boolean): void
}>()

const router = useRouter()
const message = useMessage()
const { t } = useI18n()
const themeStore = useThemeStore()
const userStore = useUserStore()
const menuStore = useMenuStore()
const languageStore = useLanguageStore()

// 是否暗色主题
const isDark = computed(() => themeStore.isDark)

// 全屏
const { isFullscreen, toggle: toggleFullscreen } = useFullscreen()

// 主题
const toggleTheme = () => themeStore.toggleTheme()

// 语言切换
const toggleLanguage = () => {
  const newLang = languageStore.currentLanguage === 'zh-CN' ? 'en-US' : 'zh-CN'
  languageStore.setLanguage(newLang)
  message.success(newLang === 'zh-CN' ? '已切换到中文' : 'Switched to English')
}

// 面包屑
const breadcrumbs = computed(() => menuStore.breadcrumbs)

// 用户菜单
const userOptions = [
  {
    label: () => t('common.profile'),
    key: 'profile',
    icon: () => h('i', { class: 'i-carbon:user-avatar' })
  },
  {
    label: () => t('common.password'),
    key: 'password',
    icon: () => h('i', { class: 'i-carbon:password' })
  },
  {
    type: 'divider',
  },
  {
    label: () => t('common.logout'),
    key: 'logout',
    icon: () => h('i', { class: 'i-carbon:logout' })
  },
]

// 处理用户菜单选择
const handleUserSelect = async (key: string) => {
  switch (key) {
    case 'profile':
      router.push('/profile')
      break
    case 'password':
      router.push('/password')
      break
    case 'logout':
      await userStore.logout()
      router.push('/login')
      message.success(t('common.logout') + (languageStore.currentLanguage === 'zh-CN' ? '成功' : ' success'))
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
  transition: opacity 0.3s ease;
}

.toolbar {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 8px;
}

.icon-rotate {
  transform: rotate(-90deg);
  transition: transform 0.3s ease;
}

.username {
  font-size: 14px;
  color: var(--text-color);
}

.lang-button {
  width: auto !important;
  min-width: 85px !important;
  padding: 0 8px !important;
}

.language-switch {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  height: 32px;
  padding: 0 4px;
  white-space: nowrap;
}

.lang-text {
  opacity: 0.5;
  transition: all 0.3s ease;
  line-height: 1;
  user-select: none;
}

.lang-text.active {
  opacity: 1;
  font-weight: bold;
  color: var(--primary-color);
}

.divider {
  opacity: 0.3;
  margin: 0 2px;
  line-height: 1;
  user-select: none;
}
</style> 