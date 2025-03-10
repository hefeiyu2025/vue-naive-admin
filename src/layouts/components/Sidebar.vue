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
      v-if="menuOptions.length > 0"
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
import { usePermissionStore } from '@/store'
import { useI18n } from 'vue-i18n'

const router = useRouter()
const permissionStore = usePermissionStore()
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

// 当前激活的菜单项
const activeKey = computed(() => {
  return router.currentRoute.value.path
})

// 菜单选项
const menuOptions = computed(() => {
  if (!permissionStore.menuOptions || permissionStore.menuOptions.length === 0) {
    return []
  }
  
  // 深拷贝菜单选项，避免修改原始数据
  const clonedOptions = JSON.parse(JSON.stringify(permissionStore.menuOptions))
  
  // 处理国际化
  const processI18n = (options: any[]) => {
    return options.map(option => {
      const newOption = { ...option }
      
      // 处理标签国际化
      if (typeof option.label === 'string') {
        newOption.label = t(option.label)
      }
      
      // 递归处理子菜单
      if (option.children && option.children.length > 0) {
        newOption.children = processI18n(option.children)
      }
      
      return newOption
    })
  }
  
  return processI18n(clonedOptions)
})

// 处理菜单点击
const handleMenuClick = (key: string) => {
  // 更新菜单存储中的activeKey，以便更新面包屑
  import('@/store/menu').then(({ useMenuStore }) => {
    const menuStore = useMenuStore()
    menuStore.setActiveKey(key)
  })
  router.push(key)
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