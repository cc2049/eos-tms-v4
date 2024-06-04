// 竞价大厅
import request from '@/utils/request'



//  报名信息列表

// "MODULEID": "MU240322931850",
//         "PAGEID": "PG240322861672",
//         "PK_PROJECT": "OBP231031000007",  //竞价项目ID
//         "BILLSTATUS":"1"     //全部不传，已确认传1，未确认传0
export function getSignList(data) {
    return request({
        url: 'oms/bidSign/getSignList',
        method: 'post',
        data: data
    })
}


// 报名信息统计
export function getBidSignCount(data) {
    return request({
        url: 'oms/bidSign/getBidSignCount',
        method: 'post',
        data: data
    })
}

// 获取承运商资质详情

export function getCarrierDetail(data) {
    return request({
        url: 'oms/bdcarrier/getCarrierDetail',
        method: 'post',
        data: data
    })
}

// 14.竞价中出价信息列表接口
export function getBidRunList(data) {
    return request({
        url: 'oms/bidRecord/getBidRunList',
        method: 'post',
        data: data
    })
}

// 提交审核
export function submitApprove(data) {
    return request({
        url: 'oms/bidProject/submitApprove',
        method: 'post',
        data: data
    })
}




