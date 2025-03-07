export const Storage = {
  set(key: string, value: any) {
    if (value === undefined) {
      return
    }
    localStorage.setItem(key, JSON.stringify(value))
  },

  get(key: string) {
    const value = localStorage.getItem(key)
    if (value) {
      try {
        return JSON.parse(value)
      } catch (error) {
        return value
      }
    }
    return null
  },

  remove(key: string) {
    localStorage.removeItem(key)
  },

  clear() {
    localStorage.clear()
  }
} 