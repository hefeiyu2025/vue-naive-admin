import axios from 'axios'
import type { AxiosInstance, AxiosResponse } from 'axios'
import { useUserStore } from '@/store/modules/user'

interface ApiResponse<T = any> {
  code?: number
  data: T
  message?: string
}

const service: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API,
  timeout: 15000
})

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    const userStore = useUserStore()
    if (userStore.token) {
      config.headers['Authorization'] = `Bearer ${userStore.token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    const res = response.data
    // 如果响应没有code字段，说明是直接返回数据的接口
    if (res.code === undefined) {
      return res.data || res
    }
    // 处理业务响应
    if (res.code !== 0) {
      return Promise.reject(new Error(res.message || 'Error'))
    }
    return res
  },
  (error) => {
    // 处理HTTP错误
    return Promise.reject(error)
  }
)

export default service 