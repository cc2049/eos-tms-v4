

import request from '@/utils/request'
// 获取详情
export function getSpecialDetail(data) {
    return request({
        url: "/oms/demand/getSpecialDetail",
        method: "post",
        data
    })
}



// {
//     "APPID": "",
//     "DATA": {
//         "BILLNO": "OT240612000003",
//         "MODE": "NUM",
//         "SUBLIST": [
//             [
//                 {
//                     "BILLNO": "OT24061200000301",
//                     "ALLOCATEDNUM": 2,
//                     "ALLOWNUM": 7
//                 }
//             ],
//             [
//                 {
//                     "BILLNO": "OT24061200000301",
//                     "ALLOCATEDNUM": 7,
//                     "ALLOWNUM": 7
//                 }
//             ]
//         ]
//     },
//     "KEY": "",
//     "MODULEID": "",
//     "PAGEID": "",
//     "PARENTPAGE": "",
//     "PROGRAMID": "",
//     "VERSION": ""
// }
// 按量
export function handleDemand(data) {
    return request({
        url: "/oms/demand/handleDemand",
        method: "post",
        data
    })
}

