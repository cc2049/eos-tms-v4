import request from '@/utils/request'

//  新增方案
export function addPlan(data) {
  return request({
    url: 'sys/queryprogUser/add',
    method: 'post',
    data: data
  })
}

//  编辑方案
export function updatePlan(data) {
  return request({
    url: 'sys/queryprogUser/update',
    method: 'post',
    data: data
  })
}

//  删除方案
export function deleteBatchIds(data) {
  return request({
    url: 'sys/queryprogUser/deleteBatchIds',
    method: 'post',
    data: data
  })
}


// 查询方案列表
export function getList(data) {
  return request({
    url: 'sys/queryprogUser/getList',
    method: 'post',
    data: data
  })
}


// 保存方案
export function savePlan(data) {
  return request({
    url: 'sys/queryprogUserDtl/add',
    method: 'post',
    data: data
  })
}

// 方案信息查询
export function getSubList(data) {
  return request({
    url: 'sys/queryprogUserDtl/getSubList',
    method: 'post',
    data: data
  })
}
