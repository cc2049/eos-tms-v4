import request from '@/utils/request'

// 查询参数列表
export function addPlan(data) {
  return request({
    url: 'sys/queryprogUser/add',
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
