import request from '@/utils/request'

// 登录
export function userLogin(data) {
  return request({
    url: '/sys/login',
    method: 'post',
    data
  })
}
// 获取当前登录用户的信息
export function getUserInfo() {
  return request({
    url: '/sys/profile',
    method: 'get'
  })
}
