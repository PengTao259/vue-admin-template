import request from '@/utils/request'

// 获取首页展示数据
export const getHomeData = () => {
  return request({
    url: '/home/data',
    method: 'get'
  })
}

// 获取消息通知
export const getNotice = () => {
  return request({
    url: '/home/notice',
    method: 'get'
  })
}
