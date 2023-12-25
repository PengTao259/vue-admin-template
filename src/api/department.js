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

// 根据id查询部门详情
export function getDepartmentDetail(id) {
  return request({
    url: `/company/department/${id}`,
    method: 'get'
  })
}

// 删除部门
export function delDepartment(id) {
  return request({
    url: `/company/department/${id}`,
    method: 'delete'
  })
}

// 修改部门
export function editDepartment(data) {
  return request({
    url: `/company/department/${data.id}`,
    method: 'put',
    data
  })
}

export function getEmployeeList(params) {
  return request({
    url: '/sys/user',
    params // 地址参数 查询参数
  })
}
