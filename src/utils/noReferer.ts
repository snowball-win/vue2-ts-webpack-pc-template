import request from '@/utils/request'
import { ResponseType } from 'axios/index'
export default (url: string, option: { [a: string]: string}) => {
  option = option || {}
  // if (url.match(/\/mmbiz_png(.*?)/g)) {
  //   url = (url.match(/\/mmbiz_png(.*?)/g) as string [])[1]
  // }
  url = url.replace(/^(http|https):\/\/(.*?)\//g, '/')
  // console.log(url, 'wenxin')
  return request({
    baseURL: option.baseUrl || '/',
    method: 'get',
    url,
    headers: { referer: '' },
    responseType: (option.responseType as ResponseType) || 'blob'
  })
    .then(res => {
      return URL.createObjectURL(res.data)
    })
}
