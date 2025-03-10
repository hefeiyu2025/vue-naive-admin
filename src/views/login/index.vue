<template>
  <div class="login-container" :class="{ 'dark-theme': isDark }">
    <!-- 左侧渐变背景 -->
    <div class="login-left">
      <div class="login-left-content">
        <img src="@/assets/logo.svg" alt="Logo" class="logo" />
        <h1>Vue Naive Admin</h1>
        <p>基于 Vue3 + Naive UI 的现代化后台管理系统</p>
        <div class="features">
          <div class="feature-item">
            <n-icon size="24" color="#fff">
              <shield-checkmark-outline />
            </n-icon>
            <span>安全可靠</span>
          </div>
          <div class="feature-item">
            <n-icon size="24" color="#fff">
              <flash-outline />
            </n-icon>
            <span>高效快速</span>
          </div>
          <div class="feature-item">
            <n-icon size="24" color="#fff">
              <layers-outline />
            </n-icon>
            <span>功能丰富</span>
          </div>
        </div>
      </div>
      <div class="login-left-footer">
        <p>© 2024 Vue Naive Admin. All Rights Reserved.</p>
      </div>
      
      <!-- 主题切换按钮 -->
      <div class="theme-switch">
        <n-button quaternary circle @click="toggleTheme">
          <template #icon>
            <n-icon size="20" color="#fff">
              <sunny-outline v-if="isDark" />
              <moon-outline v-else />
            </n-icon>
          </template>
        </n-button>
      </div>
      
      <!-- 动态背景元素 -->
      <div class="background-shapes">
        <div class="shape shape-1"></div>
        <div class="shape shape-2"></div>
        <div class="shape shape-3"></div>
        <div class="shape shape-4"></div>
      </div>
    </div>

    <!-- 右侧登录表单 -->
    <div class="login-right">
      <div class="login-form-container">
        <div class="login-header">
          <h2>欢迎登录</h2>
          <p>请输入您的账号和密码</p>
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
          
          <div class="login-options">
            <n-checkbox>记住我</n-checkbox>
            <a href="#" class="forgot-password">忘记密码？</a>
          </div>
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
        
        <div class="login-tips">
          <p>默认用户名：admin，密码：123456</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useMessage } from 'naive-ui'
import { 
  PersonOutline, 
  LockClosedOutline,
  ShieldCheckmarkOutline,
  FlashOutline,
  LayersOutline,
  SunnyOutline,
  MoonOutline
} from '@vicons/ionicons5'
import { useUserStore } from '@/store'
import { useTabStore } from '@/store/tab'
import { useThemeStore } from '@/store/theme'
import type { FormInst } from 'naive-ui'

const router = useRouter()
const route = useRoute()
const message = useMessage()
const userStore = useUserStore()
const tabStore = useTabStore()
const themeStore = useThemeStore()

const formRef = ref<FormInst | null>(null)
const loading = ref(false)

// 主题相关
const isDark = computed(() => themeStore.isDark)
const toggleTheme = () => themeStore.toggleTheme()

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
      // 重置标签页
      tabStore.resetTabs()
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
  min-height: 100vh;
  width: 100%;
  overflow: hidden;

  // 左侧渐变背景
  .login-left {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 60px;
    background: linear-gradient(135deg, #1867c0, #5cbbf6, #83d0c9);
    color: white;
    position: relative;
    overflow: hidden;
    transition: background 0.5s ease;

    &::before {
      content: '';
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 60%);
      transform: rotate(30deg);
      z-index: 1;
    }

    .login-left-content {
      position: relative;
      z-index: 5;
      max-width: 500px;

      .logo {
        width: 80px;
        height: 80px;
        margin-bottom: 20px;
      }

      h1 {
        font-size: 42px;
        font-weight: 600;
        margin-bottom: 16px;
      }

      p {
        font-size: 18px;
        opacity: 0.9;
        margin-bottom: 40px;
      }

      .features {
        display: flex;
        flex-direction: column;
        gap: 20px;

        .feature-item {
          display: flex;
          align-items: center;
          gap: 12px;

          span {
            font-size: 16px;
          }
        }
      }
    }

    .login-left-footer {
      position: relative;
      z-index: 5;
      font-size: 14px;
      opacity: 0.7;
    }
    
    // 主题切换按钮
    .theme-switch {
      position: absolute;
      top: 20px;
      right: 20px;
      z-index: 10;
    }
    
    // 动态背景元素
    .background-shapes {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 2;
      overflow: hidden;
      
      .shape {
        position: absolute;
        border-radius: 50%;
        opacity: 0.2;
        
        &-1 {
          width: 300px;
          height: 300px;
          background: radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 70%);
          top: -100px;
          right: -100px;
          animation: float 15s infinite ease-in-out;
        }
        
        &-2 {
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0) 70%);
          bottom: -200px;
          left: -100px;
          animation: float 20s infinite ease-in-out reverse;
        }
        
        &-3 {
          width: 200px;
          height: 200px;
          background: radial-gradient(circle, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 70%);
          top: 30%;
          left: 20%;
          animation: float 25s infinite ease-in-out 5s;
        }
        
        &-4 {
          width: 150px;
          height: 150px;
          background: radial-gradient(circle, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 70%);
          bottom: 20%;
          right: 20%;
          animation: float 18s infinite ease-in-out 2s;
        }
      }
    }
  }

  // 右侧登录表单
  .login-right {
    width: 500px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    padding: 40px;
    transition: background-color 0.3s ease;

    .login-form-container {
      width: 100%;
      max-width: 400px;
    }

    .login-header {
      margin-bottom: 40px;

      h2 {
        font-size: 28px;
        font-weight: 600;
        color: #1a1a1a;
        margin-bottom: 8px;
        transition: color 0.3s ease;
      }

      p {
        font-size: 16px;
        color: #666;
        transition: color 0.3s ease;
      }
    }

    .login-options {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;

      .forgot-password {
        color: #1867c0;
        text-decoration: none;
        font-size: 14px;
        transition: color 0.3s ease;

        &:hover {
          text-decoration: underline;
        }
      }
    }

    .login-buttons {
      margin-bottom: 24px;
    }

    .login-tips {
      text-align: center;
      font-size: 14px;
      color: #999;
      transition: color 0.3s ease;
    }
  }
  
  // 暗色主题
  &.dark-theme {
    .login-left {
      background: linear-gradient(135deg, #0c2d48, #2a6496, #4d8ac0);
      
      .background-shapes .shape {
        opacity: 0.15;
      }
    }
    
    .login-right {
      background-color: #111;
      
      .login-header {
        h2 {
          color: #e0e0e0;
        }
        
        p {
          color: #aaa;
        }
      }
      
      .login-options .forgot-password {
        color: #4d8ac0;
      }
      
      .login-tips {
        color: #777;
      }
    }
  }
}

// 响应式设计
@media (max-width: 992px) {
  .login-container {
    flex-direction: column;

    .login-left {
      padding: 40px 20px;
      min-height: 300px;
    }

    .login-right {
      width: 100%;
      padding: 40px 20px;
    }
  }
}

// 动画
@keyframes float {
  0%, 100% {
    transform: translateY(0) translateX(0);
  }
  25% {
    transform: translateY(-20px) translateX(10px);
  }
  50% {
    transform: translateY(10px) translateX(-15px);
  }
  75% {
    transform: translateY(15px) translateX(5px);
  }
}
</style>