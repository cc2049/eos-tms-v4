/*
 * @Author: cc2049
 * @Date: 2024-04-19 11:32:18
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-04-19 12:40:36
 * @Description: 简介
 */

import request from '@/utils/request'

/*
* 公共的查询数据接口
* @param {String} url 接口地址
* @param {Object} data 参数
*/
export function axiosGet(url, data) {
    return request({
        url: url,
        data: data,
    })
}

// 获取用户主题配置
export function getUserConfig() {
    return request({
      url: "/sys/sysUserConfig/getInfo",
      method: "post",
      data: {}
    })
  }