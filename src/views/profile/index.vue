<template>
  <div class="profile-container">
    <n-grid :cols="24" :x-gap="16">
      <!-- 左侧用户信息卡片 -->
      <n-grid-item :span="8">
        <n-card :bordered="false">
          <div class="user-info">
            <n-avatar
              round
              :size="80"
              :src="userStore.userInfo?.avatar"
              :fallback-src="defaultAvatar"
            />
            <h2>{{ userStore.userInfo?.username }}</h2>
            <n-tag type="success">{{ userStore.userInfo?.role }}</n-tag>
            <div class="user-stats">
              <div class="stat-item">
                <p class="value">12</p>
                <p class="label">我的文章</p>
              </div>
              <div class="stat-item">
                <p class="value">3</p>
                <p class="label">我的项目</p>
              </div>
              <div class="stat-item">
                <p class="value">8</p>
                <p class="label">我的任务</p>
              </div>
            </div>
          </div>
        </n-card>
      </n-grid-item>

      <!-- 右侧内容区 -->
      <n-grid-item :span="16">
        <n-card :bordered="false">
          <n-tabs type="line" animated>
            <!-- 基本信息 -->
            <n-tab-pane name="basic" tab="基本信息">
              <n-form
                ref="basicFormRef"
                :model="basicForm"
                :rules="basicRules"
                label-placement="left"
                label-width="100"
                require-mark-placement="right-hanging"
              >
                <n-form-item label="用户名" path="username">
                  <n-input
                    v-model:value="basicForm.username"
                    placeholder="请输入用户名"
                  />
                </n-form-item>
                <n-form-item label="昵称" path="nickname">
                  <n-input
                    v-model:value="basicForm.nickname"
                    placeholder="请输入昵称"
                  />
                </n-form-item>
                <n-form-item label="邮箱" path="email">
                  <n-input
                    v-model:value="basicForm.email"
                    placeholder="请输入邮箱"
                  />
                </n-form-item>
                <n-form-item label="手机号" path="phone">
                  <n-input
                    v-model:value="basicForm.phone"
                    placeholder="请输入手机号"
                  />
                </n-form-item>
                <n-form-item label="个人简介" path="bio">
                  <n-input
                    v-model:value="basicForm.bio"
                    type="textarea"
                    placeholder="请输入个人简介"
                  />
                </n-form-item>
                <n-form-item>
                  <n-button
                    type="primary"
                    :loading="basicSubmitting"
                    @click="handleBasicSubmit"
                  >
                    保存修改
                  </n-button>
                </n-form-item>
              </n-form>
            </n-tab-pane>

            <!-- 修改密码 -->
            <n-tab-pane name="password" tab="修改密码">
              <n-form
                ref="passwordFormRef"
                :model="passwordForm"
                :rules="passwordRules"
                label-placement="left"
                label-width="100"
                require-mark-placement="right-hanging"
              >
                <n-form-item label="当前密码" path="oldPassword">
                  <n-input
                    v-model:value="passwordForm.oldPassword"
                    type="password"
                    show-password-on="click"
                    placeholder="请输入当前密码"
                  />
                </n-form-item>
                <n-form-item label="新密码" path="newPassword">
                  <n-input
                    v-model:value="passwordForm.newPassword"
                    type="password"
                    show-password-on="click"
                    placeholder="请输入新密码"
                  />
                </n-form-item>
                <n-form-item label="确认新密码" path="confirmPassword">
                  <n-input
                    v-model:value="passwordForm.confirmPassword"
                    type="password"
                    show-password-on="click"
                    placeholder="请再次输入新密码"
                  />
                </n-form-item>
                <n-form-item>
                  <n-button
                    type="primary"
                    :loading="passwordSubmitting"
                    @click="handlePasswordSubmit"
                  >
                    修改密码
                  </n-button>
                </n-form-item>
              </n-form>
            </n-tab-pane>

            <!-- 账号绑定 -->
            <n-tab-pane name="binding" tab="账号绑定">
              <n-list>
                <n-list-item>
                  <n-space justify="space-between">
                    <n-space>
                      <n-icon size="24" color="#2080f0">
                        <mail-outline />
                      </n-icon>
                      <div>
                        <p class="title">邮箱绑定</p>
                        <p class="desc">已绑定邮箱：{{ basicForm.email }}</p>
                      </div>
                    </n-space>
                    <n-button>修改</n-button>
                  </n-space>
                </n-list-item>
                <n-list-item>
                  <n-space justify="space-between">
                    <n-space>
                      <n-icon size="24" color="#18a058">
                        <phone-portrait-outline />
                      </n-icon>
                      <div>
                        <p class="title">手机绑定</p>
                        <p class="desc">已绑定手机：{{ basicForm.phone }}</p>
                      </div>
                    </n-space>
                    <n-button>修改</n-button>
                  </n-space>
                </n-list-item>
              </n-list>
            </n-tab-pane>
          </n-tabs>
        </n-card>
      </n-grid-item>
    </n-grid>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useMessage } from 'naive-ui'
import type { FormInst } from 'naive-ui'
import { useUserStore } from '@/store'
import { MailOutline, PhonePortraitOutline } from '@vicons/ionicons5'
import defaultAvatar from '@/assets/default-avatar.svg'

const message = useMessage()
const userStore = useUserStore()

// 基本信息表单
const basicFormRef = ref<FormInst | null>(null)
const basicSubmitting = ref(false)
const basicForm = ref({
  username: userStore.userInfo?.username || '',
  nickname: '',
  email: 'example@example.com',
  phone: '13800138000',
  bio: '',
})

const basicRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
  ],
  nickname: [
    { required: true, message: '请输入昵称', trigger: 'blur' },
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    {
      pattern: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
      message: '请输入正确的邮箱地址',
      trigger: 'blur',
    },
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    {
      pattern: /^1[3-9]\d{9}$/,
      message: '请输入正确的手机号',
      trigger: 'blur',
    },
  ],
}

const handleBasicSubmit = () => {
  basicFormRef.value?.validate(async (errors) => {
    if (errors) return

    try {
      basicSubmitting.value = true
      // TODO: 调用更新用户信息接口
      await new Promise((resolve) => setTimeout(resolve, 1000))
      message.success('保存成功')
    }
    catch (error: any) {
      message.error(error.message || '保存失败')
    }
    finally {
      basicSubmitting.value = false
    }
  })
}

// 修改密码表单
const passwordFormRef = ref<FormInst | null>(null)
const passwordSubmitting = ref(false)
const passwordForm = ref({
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
})

const passwordRules = {
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
        return value === passwordForm.value.newPassword
      },
      message: '两次输入的密码不一致',
      trigger: 'blur',
    },
  ],
}

const handlePasswordSubmit = () => {
  passwordFormRef.value?.validate(async (errors) => {
    if (errors) return

    try {
      passwordSubmitting.value = true
      // TODO: 调用修改密码接口
      await new Promise((resolve) => setTimeout(resolve, 1000))
      message.success('修改成功')
      passwordForm.value = {
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
      }
    }
    catch (error: any) {
      message.error(error.message || '修改失败')
    }
    finally {
      passwordSubmitting.value = false
    }
  })
}
</script>

<style lang="scss" scoped>
.profile-container {
  .user-info {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 24px 0;

    h2 {
      margin: 16px 0 8px;
      font-size: 20px;
      color: #1a1a1a;
    }

    .user-stats {
      display: flex;
      justify-content: space-around;
      width: 100%;
      margin-top: 24px;
      padding-top: 24px;
      border-top: 1px solid #f0f0f0;

      .stat-item {
        text-align: center;

        .value {
          margin: 0;
          font-size: 20px;
          font-weight: 600;
          color: #1a1a1a;
        }

        .label {
          margin: 4px 0 0;
          font-size: 12px;
          color: #666;
        }
      }
    }
  }

  .title {
    margin: 0;
    font-size: 16px;
    color: #1a1a1a;
  }

  .desc {
    margin: 4px 0 0;
    font-size: 14px;
    color: #666;
  }
}
</style> 