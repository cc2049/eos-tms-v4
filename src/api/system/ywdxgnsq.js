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

