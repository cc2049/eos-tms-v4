/*
 * @Author: cc2049
 * @Date: 2024-05-17 14:17:08
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-05-17 14:17:10
 * @Description: 简介
 */
import request from '@/utils/request'

export function getDicts(dictType) {
  return request({
    url: `/sys/dictDtl/queryDictInfoByCode/${dictType}`,
    method: "post",
    data: {}
  })
}

export function getDictsTree(dictType) {
  return request({
    url: "/sys/dictDtl/getTreeList",
    method: "post",
    data: {
      DICTCODE: dictType
    }
  })
}

// 获取字典选择框列表
export function optionselect() {
  return request({
    url: '/system/dict/type/optionselect',
    method: 'get'
  })
}