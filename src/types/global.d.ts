import type { DialogApi } from 'naive-ui'

declare global {
  interface Window {
    $dialog?: DialogApi
  }
} 