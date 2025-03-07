import { defineStore } from 'pinia'

interface Tab {
  key: string
  label: string
  closable?: boolean
}

export const useTabStore = defineStore('tab', {
  state: () => ({
    activeTab: '/dashboard',
    tabs: [
      {
        key: '/dashboard',
        label: '仪表盘',
        closable: false,
      },
    ] as Tab[],
  }),
  actions: {
    addTab(tab: Tab) {
      if (!this.tabs.find((t) => t.key === tab.key)) {
        this.tabs.push(tab)
      }
      this.activeTab = tab.key
    },
    removeTab(key: string) {
      const index = this.tabs.findIndex((tab) => tab.key === key)
      if (index !== -1) {
        this.tabs.splice(index, 1)
        if (this.activeTab === key) {
          this.activeTab = this.tabs[index - 1]?.key || this.tabs[0].key
        }
      }
    },
    setActiveTab(key: string) {
      this.activeTab = key
    },
  },
}) 