

import request from '@/utils/request'
// 获取详情
export function getSpecialDetail(data) {
    return request({
        url: "/oms/demand/getSpecialDetail",
        method: "post",
        data
    })
}


// 按量
export function handleDemand(data) {
    return request({
        url: "/oms/demand/handleDemand",
        method: "post",
        data
    })
}

// 地址下拉项
export function getSelectTypeList(data) {
    return request({
        url: "/base/component/getSelectTypeList",
        method: "post",
        data
    })
}
