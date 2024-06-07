// 竞价大厅
import request from '@/utils/request'


// 货主================================================
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

export function getCargoEndList(data) {
    return request({
        url: 'oms/bidRecord/getCargoEndList',
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

// 强制结束
export function forceEnd(data) {
    return request({
        url: 'oms/bidProject/forceEnd',
        method: 'post',
        data: data
    })
}

// 取消确认
export function cancelSign(data) {
    return request({
        url: 'oms/bidSign/cancelSign',
        method: 'post',
        data: data
    })
}

// 确认报名
export function confirmSign(data) {
    return request({
        url: 'oms/bidSign/confirmSign',
        method: 'post',
        data: data
    })
}

// 出价中的承运商下拉
export function getBidRecordCarrierList(data) {
    return request({
        url: 'oms/bidRecord/getBidRecordCarrierList',
        method: 'post',
        data: data
    })
}

// 作废
export function cancellation(data) {
    return request({
        url: 'oms/bidWin/cancel',
        method: 'post',
        data: data
    })
}

// 中标
export function bidWin(data) {
    return request({
        url: 'oms//bidWin/win',
        method: 'post',
        data: data
    })
}

// 获取公告信息

export function getNoticDetail(data) {
    return request({
        url: 'oms/bidNotice/getDetail',
        method: 'post',
        data: data
    })
}

// ===================================



// 承运商=================================

//获取竞价左侧列表
export function getCarrierPageList(data) {
    return request({
        url: 'oms/bidProject/getCarrierPageList',
        method: 'post',
        data: data
    })
}

// 获取竞价详情
export function getCarrierDetailss(data) {
    return request({
        url: 'oms/bidProject/getCarrierDetail',
        method: 'post',
        data: data
    })
}
// 3.标识竞价接口
export function collectBid(data) {
    return request({
        url: 'oms/bidSign/collectBid',
        method: 'post',
        data: data
    })
}
// 4.报名接口
export function carrierSign(data) {
    return request({
        url: 'oms/bidSign/sign',
        method: 'post',
        data: data
    })
}

// 4.竞价中出价信息列表
export function getBidRecordList(data) {
    return request({
        url: 'oms/bidRecord/getBidRecordList',
        method: 'post',
        data: data
    })
}
// 最后一名可中标价格接口
export function getLastPlacePrice(data) {
    return request({
        url: 'oms/bidRecord/getLastPlacePrice',
        method: 'post',
        data: data
    })
}


// 出价
  //       "BILLFROM": "1",   //数据来源   0平台、1手机APP、2-小程序、3第三方系统 
    //             "PK_PROJECT": "1",  //竞价项目ID
    //             "PROJECTNAME": "1",  //竞价项目名称
    //             "EXPECTVALUE": 1,   //出量
    //             "BIDPRICE": 1,    //出价金额   
    //             "ULON": "1",   //经度
    //             "ULAT": "1",   //纬度
    //          "UIPADDRESS":"1",   //IP地址
    //          "BIDADDRESS":"1"   //出价地址
export function offerPrice(data) {
    return request({
        url: 'oms/bidRecord/offerPrice',
        method: 'post',
        data: data
    })
}

// 8.已结束出价信息列表接口

export function getCarrierEndList(data) {
    return request({
        url: 'oms/bidRecord/getCarrierEndList',
        method: 'post',
        data: data
    })
}











