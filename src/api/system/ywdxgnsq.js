import request from '@/utils/request'

export function getModule(data) {
  return request({
    url: "/sys/module/getPageListByRole",
    method: "post",
    data
  })
}

export function getButton(data) {
  return request({
    url: "/sys/button/getListByRole",
    method: "post",
    data
  })
}

export function getListRole(data) {
  return request({
    url: "/sys/role/getList",
    method: "post",
    data
  })
}

export function authorized(data) {
  return request({
    url: "/sys/role/authorized",
    method: "post",
    data
  })
}


