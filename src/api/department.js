import request from '@/utils/request'

export function getDepartmentList(params) {
  return request({
    url: '/company/department',
    method: 'get',
    params
  })
}

// 获取部门负责人列表
export function getManagerList() {
  return request({
    url: '/sys/user/simple',
    method: 'get'
  })
}

// 新增部门
export function addDepartment(data) {
  return request({
    url: '/company/department',
    method: 'post',
    data
  })
}

// 删除部门
export function delDepartment(id) {
  return request({
    url: `/company/department/${id}`,
    method: 'delete'
  })
}
