<template>
  <div class="forbidden">
    <div class="content">
      <h1>403</h1>
      <h2>抱歉，您没有权限访问此页面</h2>
      <n-button type="primary" @click="router.push('/')">返回首页</n-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<style lang="scss" scoped>
.forbidden {
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