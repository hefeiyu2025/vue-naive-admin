<template>
  <div class="password-container">
    <n-card :bordered="false" title="修改密码">
      <n-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-placement="left"
        label-width="100"
        require-mark-placement="right-hanging"
      >
        <n-form-item label="当前密码" path="oldPassword">
          <n-input
            v-model:value="formData.oldPassword"
            type="password"
            show-password-on="click"
            placeholder="请输入当前密码"
          />
        </n-form-item>
        <n-form-item label="新密码" path="newPassword">
          <n-input
            v-model:value="formData.newPassword"
            type="password"
            show-password-on="click"
            placeholder="请输入新密码"
          />
        </n-form-item>
        <n-form-item label="确认新密码" path="confirmPassword">
          <n-input
            v-model:value="formData.confirmPassword"
            type="password"
            show-password-on="click"
            placeholder="请再次输入新密码"
          />
        </n-form-item>
        <n-form-item>
          <n-button
            type="primary"
            :loading="submitting"
            @click="handleSubmit"
          >
            确认修改
          </n-button>
        </n-form-item>
      </n-form>
    </n-card>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useMessage } from 'naive-ui'
import type { FormInst } from 'naive-ui'
import { updatePassword } from '@/api/user'

const router = useRouter()
const message = useMessage()
const formRef = ref<FormInst | null>(null)
const submitting = ref(false)

const formData = ref({
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
})

const rules = {
  oldPassword: [
    { required: true, message: '请输入当前密码', trigger: 'blur' },
  ],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能小于6位', trigger: 'blur' },
  ],
  confirmPassword: [
    { required: true, message: '请再次输入新密码', trigger: 'blur' },
    {
      validator: (rule: any, value: string) => {
        return value === formData.value.newPassword
      },
      message: '两次输入的密码不一致',
      trigger: 'blur',
    },
  ],
}

const handleSubmit = () => {
  formRef.value?.validate(async (errors) => {
    if (errors) return

    try {
      submitting.value = true
      await updatePassword({
        oldPassword: formData.value.oldPassword,
        newPassword: formData.value.newPassword,
      })
      message.success('修改成功')
      router.push('/profile')
    }
    catch (error: any) {
      message.error(error.message || '修改失败')
    }
    finally {
      submitting.value = false
    }
  })
}
</script>

<style lang="scss" scoped>
.password-container {
  max-width: 600px;
  margin: 24px auto;
}
</style>