<script setup lang="ts">
import {
  NConfigProvider,
  NMessageProvider,
  NDialogProvider,
  NNotificationProvider,
  NLoadingBarProvider,
  zhCN,
  enUS
} from 'naive-ui'
import { useThemeStore } from '@/store/theme'
import { useLanguageStore } from '@/store/language'
import { watch } from 'vue'
import i18n from '@/locales'

const themeStore = useThemeStore()
const languageStore = useLanguageStore()

// 初始化语言
i18n.global.locale.value = languageStore.currentLanguage
document.documentElement.lang = languageStore.currentLanguage

// 监听语言变化
watch(
  () => languageStore.currentLanguage,
  (newLang) => {
    i18n.global.locale.value = newLang
    document.documentElement.lang = newLang
  }
)
</script>

<template>
  <n-config-provider :theme="themeStore.theme" :locale="languageStore.currentLanguage === 'zh-CN' ? zhCN : enUS">
    <n-message-provider>
      <n-dialog-provider>
        <n-notification-provider>
          <n-loading-bar-provider>
            <router-view></router-view>
          </n-loading-bar-provider>
        </n-notification-provider>
      </n-dialog-provider>
    </n-message-provider>
  </n-config-provider>
</template>

<style>
html {
  font-size: 16px;
}

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans',
    sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#app {
  width: 100%;
  height: 100vh;
}
</style>
