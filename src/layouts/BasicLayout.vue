<!-- 基础布局组件 -->
<template>
  <n-layout class="layout" has-sider>
    <!-- 侧边栏 -->
    <Sidebar v-model:collapsed="collapsed" />

    <!-- 主内容区 -->
    <n-layout class="main-content">
      <!-- 顶部导航栏 (固定) -->
      <div class="fixed-header">
        <Header v-model:collapsed="collapsed" />
        
        <!-- 标签页 (固定) -->
        <TabBar />
      </div>

      <!-- 内容区 (可滚动) -->
      <n-layout-content class="scrollable-content">
        <div class="content">
          <router-view v-slot="{ Component }">
            <transition name="fade" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
        </div>
      </n-layout-content>
    </n-layout>
  </n-layout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useTabStore } from '@/store/tab'
import Sidebar from './components/Sidebar.vue'
import Header from './components/Header.vue'
import TabBar from './components/TabBar.vue'

const router = useRouter()
const tabStore = useTabStore()

// 侧边栏折叠状态
const collapsed = ref(false)

// 在组件挂载时添加路由守卫
onMounted(() => {
  router.beforeEach((to, from, next) => {
    // 如果是登录页，清空标签页
    if (to.path === '/login') {
      tabStore.clearTabs()
    }
    next()
  })
})
</script>

<style scoped>
.layout {
  height: 100vh;
}

.main-content {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}

.fixed-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background-color: var(--body-color);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
}

.scrollable-content {
  flex: 1;
  overflow-y: auto;
  height: calc(100vh - 112px); /* 减去header和tabbar的高度 */
}

.content {
  padding: 16px;
  min-height: 100%;
  transition: opacity 0.3s ease;
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