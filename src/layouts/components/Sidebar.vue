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
      <h1 :class="{ 'hidden': collapsed }">Vue Naive Admin</h1>
    </div>

    <!-- 菜单 -->
    <n-menu
      v-if="menuOptions.length > 0"
      :collapsed="collapsed"
      :collapsed-width="64"
      :collapsed-icon-size="22"
      :indent="20"
      :options="menuOptions"
      :value="activeKey"
      @update:value="handleMenuClick"
    />
  </n-layout-sider>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
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
  
  // 处理国际化，但保留原始的图标函数
  const processOptions = (options: any[]) => {
    return options.map(option => {
      // 创建新选项，但不深拷贝，保留函数引用
      const newOption = { 
        ...option,
        // 处理标签国际化
        label: typeof option.label === 'string' ? t(option.label) : option.label
      }
      
      // 递归处理子菜单
      if (option.children && option.children.length > 0) {
        newOption.children = processOptions(option.children)
      }
      
      return newOption
    })
  }
  
  return processOptions(permissionStore.menuOptions)
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

// 监听路由变化，确保激活状态正确
watch(
  () => router.currentRoute.value.path,
  (path) => {
    // 如果路径变化，确保菜单项激活状态正确
    if (path && path !== activeKey.value) {
      import('@/store/menu').then(({ useMenuStore }) => {
        const menuStore = useMenuStore()
        menuStore.setActiveKey(path)
      })
    }
  }
)
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
  opacity: 1;
  width: auto;
}

.logo h1.hidden {
  width: 0;
  opacity: 0;
  margin: 0;
  padding: 0;
}

:deep(.n-menu-item-content) {
  display: flex;
  align-items: center;
}

:deep(.n-menu-item-content__icon) {
  margin-right: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

:deep(.n-menu.n-menu--collapsed .n-menu-item-content__icon) {
  margin-right: 0;
}
</style> 