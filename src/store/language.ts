import { defineStore } from 'pinia'
import i18n from '@/locales'
import { Storage } from '@/utils/storage'

const LANGUAGE_KEY = 'language'
type Language = 'zh-CN' | 'en-US'

export const useLanguageStore = defineStore('language', {
  state: () => ({
    currentLanguage: (Storage.get(LANGUAGE_KEY) || 'zh-CN') as Language,
  }),

  actions: {
    setLanguage(lang: Language) {
      this.currentLanguage = lang
      Storage.set(LANGUAGE_KEY, lang)
      i18n.global.locale.value = lang
      document.documentElement.lang = lang
    },

    toggleLanguage() {
      const newLang = this.currentLanguage === 'zh-CN' ? 'en-US' : 'zh-CN'
      this.setLanguage(newLang)
    },
  },
}) 