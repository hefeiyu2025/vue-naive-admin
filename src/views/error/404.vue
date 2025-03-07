<template>
  <div class="not-found">
    <div class="content">
      <h1>404</h1>
      <h2>抱歉，您访问的页面不存在</h2>
      <n-button type="primary" @click="router.push('/')">返回首页</n-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<style lang="scss" scoped>
.not-found {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f0f2f5;

  .content {
    text-align: center;

    h1 {
      margin: 0;
      font-size: 120px;
      font-weight: 600;
      color: #1a1a1a;
    }

    h2 {
      margin: 24px 0 32px;
      font-size: 24px;
      font-weight: 400;
      color: #666;
    }
  }
}
</style> 