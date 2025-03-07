<!-- 侧边栏组件 -->
<template>
  <n-layout-sider
    bordered
    collapse-mode="width"
    :collapsed-width="64"
    :width="240"
    :collapsed="collapsed"
    show-trigger
    @collapse="handleCollapse"
    @expand="handleExpand"
  >
    <!-- Logo -->
    <div class="logo">
      <img src="@/assets/logo.svg" alt="Logo" />
      <h1 v-if="!collapsed">Vue Naive Admin</h1>
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
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useMenuStore } from '@/store/menu'
import { useI18n } from 'vue-i18n'
import {
  GridOutline,
  PersonOutline,
  PeopleOutline,
  KeyOutline,
  SettingsOutline,
} from '@vicons/ionicons5'

const router = useRouter()
const menuStore = useMenuStore()
const { t } = useI18n()

// 侧边栏折叠状态
const collapsed = ref(false)

// 处理折叠状态变化
const handleCollapse = () => {
  collapsed.value = true
}

const handleExpand = () => {
  collapsed.value = false
}

// 菜单
const menuOptions = computed(() => {
  const processMenuOption = (option: any) => {
    const newOption = { ...option }
    if (typeof option.label === 'string') {
      newOption.label = () => t(option.label)
    }
    if (option.children) {
      newOption.children = option.children.map(processMenuOption)
    }
    return newOption
  }

  return menuStore.menuOptions.map(processMenuOption)
})
const activeKey = computed(() => menuStore.activeKey)
const handleMenuClick = (key: string) => {
  menuStore.setActiveKey(key)
  router.push(key)
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
.logo {
  height: 64px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  overflow: hidden;
}

.logo img {
  width: 32px;
  height: 32px;
  flex-shrink: 0;
}

.logo h1 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  white-space: nowrap;
  transition: all 0.3s ease;
}
</style> 