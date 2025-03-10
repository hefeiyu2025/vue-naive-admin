import { defineStore } from 'pinia'

interface Tab {
  key: string
  label: string
  closable?: boolean
}

const TABS_KEY = 'vue-naive-admin-tabs'

// 从localStorage获取保存的标签页
const getSavedTabs = (): Tab[] => {
  const savedTabs = localStorage.getItem(TABS_KEY)
  if (savedTabs) {
    try {
      return JSON.parse(savedTabs)
    } catch (e) {
      return [
        {
          key: '/dashboard',
          label: 'common.dashboard',
          closable: false,
        },
      ]
    }
  }
  return [
    {
      key: '/dashboard',
      label: 'common.dashboard',
      closable: false,
    },
  ]
}

export const useTabStore = defineStore('tab', {
  state: () => ({
    tabs: getSavedTabs(),
  }),

  actions: {
    addTab(tab: Tab) {
      const existTab = this.tabs.find((t) => t.key === tab.key)
      if (!existTab) {
        this.tabs.push(tab)
        this.saveTabs()
      }
    },

    removeTab(key: string) {
      const index = this.tabs.findIndex((tab) => tab.key === key)
      if (index !== -1 && key !== '/dashboard') {
        this.tabs.splice(index, 1)
        this.saveTabs()
      }
    },

    // 清空所有标签（除了固定的）
    clearTabs() {
      this.tabs = this.tabs.filter(tab => !tab.closable)
      this.saveTabs()
    },

    // 重置所有标签页
    resetTabs() {
      this.tabs = [
        {
          key: '/dashboard',
          label: 'common.dashboard',
          closable: false,
        },
      ]
      this.saveTabs()
    },

    // 保存标签页到localStorage
    saveTabs() {
      localStorage.setItem(TABS_KEY, JSON.stringify(this.tabs))
    },
  },
}) 