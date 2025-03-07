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
            <n-upload
              accept="image/*"
              :max="1"
              :show-file-list="false"
              @change="handleAvatarUpload"
            >
              <n-button text>
                <template #icon>
                  <n-icon><camera-outline /></n-icon>
                </template>
                更换头像
              </n-button>
            </n-upload>
            <h2>{{ userStore.userInfo?.nickname || userStore.userInfo?.username }}</h2>
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
import { ref, onMounted } from 'vue'
import { useMessage } from 'naive-ui'
import type { FormInst, UploadFileInfo } from 'naive-ui'
import { useUserStore } from '@/store'
import { MailOutline, PhonePortraitOutline, CameraOutline } from '@vicons/ionicons5'
import defaultAvatar from '@/assets/default-avatar.svg'
import { getUserInfo, updateUserInfo, uploadAvatar } from '@/api/user'

const message = useMessage()
const userStore = useUserStore()

// 获取用户信息
const fetchUserInfo = async () => {
  try {
    const { data } = await getUserInfo()
    userStore.setUserInfo(data)
    basicForm.value = {
      username: data.username,
      nickname: data.nickname || '',
      email: data.email || '',
      phone: data.phone || '',
      bio: data.bio || '',
    }
  }
  catch (error: any) {
    message.error(error.message || '获取用户信息失败')
  }
}

// 头像上传
const handleAvatarUpload = async (data: { file: UploadFileInfo }) => {
  try {
    const { file } = data
    if (!file.file) return
    const { data: res } = await uploadAvatar(file.file)
    userStore.setUserInfo({
      ...userStore.userInfo!,
      avatar: res.url,
    })
    message.success('头像上传成功')
  }
  catch (error: any) {
    message.error(error.message || '头像上传失败')
  }
}

// 基本信息表单
const basicFormRef = ref<FormInst | null>(null)
const basicSubmitting = ref(false)
const basicForm = ref({
  username: '',
  nickname: '',
  email: '',
  phone: '',
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
      await updateUserInfo(basicForm.value)
      userStore.setUserInfo({
        ...userStore.userInfo!,
        ...basicForm.value,
      })
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

// 初始化
onMounted(() => {
  fetchUserInfo()
})
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