import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  timeout: 10000 // 请求超时时间
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 在发送请求之前做些什么
    if (store.getters.token) {
      config.headers.Authorization = `Bearer ${store.getters.token}`
    }
    return config
  },
  error => {
    // 对请求错误做些什么
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  response => {
    // 对响应数据做点什么
    const { data, message, success } = response.data
    if (success) {
      return data
    } else {
      Message({
        type: 'error',
        message: message,
        duration: 5 * 1000
      })
      return Promise.reject(new Error(message))
    }
  },
  error => {
    // 对响应错误做点什么
    Message({
      type: 'error',
      message: error.message,
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
