import { defineStore } from 'pinia'
import { darkTheme } from 'naive-ui'
import type { GlobalTheme } from 'naive-ui'

const THEME_KEY = 'vue-naive-admin-theme'

export const useThemeStore = defineStore('theme', {
  state: () => ({
    isDark: localStorage.getItem(THEME_KEY) === 'dark',
    theme: localStorage.getItem(THEME_KEY) === 'dark' ? darkTheme : null,
  }),

  actions: {
    toggleTheme() {
      this.isDark = !this.isDark
      this.theme = this.isDark ? darkTheme : null
      localStorage.setItem(THEME_KEY, this.isDark ? 'dark' : 'light')
    },
  },
}) 