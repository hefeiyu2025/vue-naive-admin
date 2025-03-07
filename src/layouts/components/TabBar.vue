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
    >
      <n-tab
        v-for="tab in tabOptions"
        :key="tab.key"
        :name="tab.key"
        :closable="tab.closable"
      >
        {{ tab.label }}
      </n-tab>
    </n-tabs>
  </div>
</template>

<script setup lang="ts">
import { computed, watch, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useTabStore } from '@/store/tab'
import type { RouteLocationNormalizedLoaded } from 'vue-router'

const router = useRouter()
const route = useRoute()
const tabStore = useTabStore()

// 标签页
const activeTab = computed(() => route.path)
const tabOptions = computed(() => tabStore.tabs)

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
</script>

<style scoped>
.tab-bar {
  padding: 8px 16px;
  background-color: #fff;
  border-bottom: 1px solid #f0f0f0;
}

:deep(.n-tabs-nav) {
  padding: 0 16px;
}

:deep(.n-tabs-tab) {
  padding: 0 16px;
}

:deep(.n-tabs-tab-pad) {
  width: 16px;
}
</style> 