<!-- 基础布局组件 -->
<template>
  <n-layout class="layout" has-sider>
    <!-- 侧边栏 -->
    <Sidebar v-model:collapsed="collapsed" />

    <!-- 主内容区 -->
    <n-layout>
      <!-- 顶部导航栏 -->
      <Header v-model:collapsed="collapsed" />

      <!-- 标签页 -->
      <TabBar />

      <!-- 内容区 -->
      <n-layout-content>
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

.content {
  padding: 16px;
  background-color: #f0f2f5;
  min-height: calc(100vh - 128px);
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