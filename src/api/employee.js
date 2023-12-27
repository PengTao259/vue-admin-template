import request from '@/utils/request'

// 获取员工简单列表
export function getEmployeeSimple() {
  return request({
    method: 'GET',
    url: '/sys/user/simple'
  })
}

// 获取员工列表
export function getEmployeeList(params) {
  return request({
    method: 'GET',
    url: '/sys/user',
    params
  })
}

/**
 * 导出员工的excel
 * **/

export function exportEmployee() {
  return request({
    url: '/sys/user/export',
    // 改变接收数据的类型
    responseType: 'blob' // 使用blob接收二进制文件流
  })
}

/**
 * 下载员工导入模版
 * **/

export function getExportTemplate() {
  return request({
    url: '/sys/user/import/template',
    responseType: 'blob' // 二进制文件流
  })
}

/**
 * 上传用户的excel
 *
*/
export function uploadExcel(data) {
  return request({
    url: '/sys/user/import',
    method: 'post',
    data // form-data类型 因为要上传文件类型
  })
}

/**
 * 删除员工
 * **/

export function delEmployee(id) {
  return request({
    method: 'delete',
    url: `/sys/user/${id}`
  })
}

/**
 * 新增员工
 * **/

export function addEmployee(data) {
  return request({
    method: 'post',
    url: '/sys/user',
    data
  })
}

/**
 * 获取员工基本信息
 * **/

export function getEmployeeDetail(id) {
  return request({
    method: 'GET',
    url: `/sys/user/${id}`
  })
}

/**
 * 更新员工基本信息
 * **/

export function updateEmployee(data) {
  return request({
    method: 'PUT',
    url: `/sys/user/${data.id}`,
    data
  })
}

/**
 * 获取可用的角色列表
 * **/

export function getRoleList() {
  return request({
    url: '/sys/role/list/enabled'
  })
}
