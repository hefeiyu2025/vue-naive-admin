<!-- 标签页组件 -->
<template>
  <div class="tab-bar">
    <n-tabs
      type="card"
      :value="activeTab"
      @update:value="handleTabUpdate"
      @close="handleTabClose"
      justify-content="start"
      size="medium"
      closable
      class="custom-tabs"
    >
      <n-tab
        v-for="tab in tabOptions"
        :key="tab.key"
        :name="tab.key"
        :closable="tab.closable"
        :label="t(tab.label)"
      />
    </n-tabs>
  </div>
</template>

<script setup lang="ts">
import { defineComponent, computed, watch, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useTabStore } from '@/store/tab'
import { useI18n } from 'vue-i18n'
import type { RouteLocationNormalizedLoaded } from 'vue-router'
import { NTabs, NTab } from 'naive-ui'

interface Tab {
  key: string
  label: string
  closable?: boolean
}

const router = useRouter()
const route = useRoute()
const tabStore = useTabStore()
const { t } = useI18n()

// 标签页
const activeTab = computed<string>(() => route.path)
const tabOptions = computed<Tab[]>(() => tabStore.tabs)

// 添加标签页
const addTab = (route: RouteLocationNormalizedLoaded) => {
  if (route.path === '/login') return
  
  const title = route.meta.title as string
  if (title) {
    tabStore.addTab({
      key: route.path,
      label: title,
      closable: route.path !== '/dashboard'
    })
  }
}

// 监听路由变化
watch(
  () => route,
  (newRoute) => {
    addTab(newRoute)
  },
  { immediate: true, deep: true }
)

// 组件挂载时，确保当前路由的标签页存在
onMounted(() => {
  addTab(route)
})

const handleTabUpdate = (key: string) => {
  router.push(key)
}

const handleTabClose = (key: string) => {
  if (key === activeTab.value) {
    // 如果关闭的是当前标签，需要先跳转到其他标签
    const tabs = tabStore.tabs
    const index = tabs.findIndex(tab => tab.key === key)
    const nextTab = tabs[index - 1] || tabs[index + 1]
    if (nextTab) {
      router.push(nextTab.key)
    }
  }
  tabStore.removeTab(key)
}

defineComponent({
  name: 'TabBar'
})
</script>

<style lang="scss" scoped>
.tab-bar {
  padding: 6px 16px 0;
  background-color: var(--card-color);
}

:deep(.custom-tabs) {
  .n-tabs-nav {
    padding: 0;
  }

  .n-tabs-tab {
    padding: 0 16px;
    height: 32px;
    font-size: 13px;
    border: none;
    background-color: transparent;
    transition: all 0.3s ease;
    margin-right: 2px;
    border-radius: 4px 4px 0 0;

    &:hover {
      background-color: var(--hover-color);
    }

    &.n-tabs-tab--active {
      background-color: var(--primary-color);
      color: #fff;

      .n-tabs-tab__close {
        color: #fff;
      }
    }
  }

  .n-tabs-tab-pad {
    width: 16px;
  }

  .n-tabs-nav-scroll-content {
    border-bottom: 1px solid var(--border-color);
  }

  .n-tabs-tab__close {
    color: var(--text-color-3);
    transition: color 0.3s ease;
    margin-left: 4px;
    font-size: 12px;

    &:hover {
      color: var(--error-color);
    }
  }

  .n-tabs-nav-scroll-content {
    &::after {
      display: none;
    }
  }
}
</style> 