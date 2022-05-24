import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import { UserModule } from '@/store/modules/user'
import { getToken } from '@/utils/cookies'

// baseURL判断一下本地开发环境与服务端环境，本地用'/',服务端用process.env.VUE_APP_BASE_API
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  timeout: 5000
  // withCredentials: true // send cookies when cross-domain requests
})

// Request interceptors
service.interceptors.request.use(
  (config:any) => {
    console.log('16UserModule.Authorization', UserModule.Authorization)
    if (UserModule.Authorization) {
      config.headers.Authorization = UserModule.Authorization
    }
    config.headers.SystemInfo = window.navigator.appVersion
    config.headers.Referer = window.origin
    return config
  },
  (error:any) => {
    Promise.reject(error)
  }
)

// Response interceptors
service.interceptors.response.use(
  (response:any) => {
    // Some example codes here:
    // code == 0: success
    // code == 20000: success
    // code == 50001: invalid access token
    // code == 50002: already login in other place
    // code == 50003: access token expired
    // code == 50004: invalid user (user not exist)
    // code == 50005: username or password is incorrect
    // You can change this part for your own usage.
    console.log('response', response)
    console.log('code', response.data.code)
    if (response.config && response.config.responseType && !['json', 'text'].includes(response.config.responseType)) {
      return response
    }
    const res = response.data
    if (res.code !== '0') {
      Message({
        message: res.msg || 'Error',
        type: 'error',
        duration: 5 * 1000
      })
      if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
        MessageBox.confirm(
          '你已被登出，可以取消继续留在该页面，或者重新登录',
          '确定登出',
          {
            confirmButtonText: '重新登录',
            cancelButtonText: '取消',
            type: 'warning'
          }
        ).then(() => {
          UserModule.ResetToken()
          location.reload() // To prevent bugs from vue-router
        })
      }
      return Promise.reject(new Error(res.msg || 'Error'))
    } else {
      return response.data
    }
  },
  (error:any) => {
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
export const post = (url: string) =>
  (data?: unknown) =>
    service({
      url,
      method: 'post',
      data
    })

export const get = (url: string) =>
  (data: unknown) =>
    service({
      url,
      method: 'post',
      data
    })
