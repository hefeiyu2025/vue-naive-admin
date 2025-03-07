<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <h2>Vue Naive Admin</h2>
        <p>基于 Vue3 + Naive UI 的后台管理系统</p>
      </div>
      <n-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-placement="left"
        label-width="0"
        require-mark-placement="right-hanging"
        size="large"
        @keyup.enter="handleSubmit"
      >
        <n-form-item path="username">
          <n-input
            v-model:value="formData.username"
            placeholder="用户名"
            :maxlength="20"
          >
            <template #prefix>
              <n-icon><person-outline /></n-icon>
            </template>
          </n-input>
        </n-form-item>
        <n-form-item path="password">
          <n-input
            v-model:value="formData.password"
            type="password"
            placeholder="密码"
            :maxlength="20"
            show-password-on="click"
          >
            <template #prefix>
              <n-icon><lock-closed-outline /></n-icon>
            </template>
          </n-input>
        </n-form-item>
      </n-form>
      <div class="login-buttons">
        <n-button
          type="primary"
          size="large"
          :loading="loading"
          :block="true"
          @click="handleSubmit"
        >
          登录
        </n-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useMessage } from 'naive-ui'
import { PersonOutline, LockClosedOutline } from '@vicons/ionicons5'
import { useUserStore } from '@/store'
import type { FormInst } from 'naive-ui'

const router = useRouter()
const route = useRoute()
const message = useMessage()
const userStore = useUserStore()

const formRef = ref<FormInst | null>(null)
const loading = ref(false)

const formData = ref({
  username: '',
  password: '',
})

const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
  ],
}

const handleSubmit = () => {
  formRef.value?.validate(async (errors) => {
    if (errors) return

    try {
      loading.value = true
      await userStore.login(formData.value.username, formData.value.password)
      message.success('登录成功')
      // 延迟跳转，确保token已经保存
      await new Promise(resolve => setTimeout(resolve, 100))
      const redirect = route.query.redirect as string
      router.push(redirect || '/')
    }
    catch (error: any) {
      message.error(error.message || '登录失败')
    }
    finally {
      loading.value = false
    }
  })
}
</script>

<style lang="scss" scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f0f2f5;

  .login-card {
    width: 100%;
    max-width: 400px;
    padding: 32px;
    margin: 0 16px;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  }

  .login-header {
    text-align: center;
    margin-bottom: 32px;

    h2 {
      margin: 0;
      font-size: 24px;
      color: #1a1a1a;
    }

    p {
      margin: 12px 0 0;
      font-size: 14px;
      color: #666;
    }
  }

  .login-buttons {
    margin-top: 24px;
  }
}
</style> 