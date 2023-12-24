import request from '@/utils/request'

// 获取角色列表
export function getRoleList() {
  return request({
    url: '/sys/role',
    method: 'get'
  })
}
