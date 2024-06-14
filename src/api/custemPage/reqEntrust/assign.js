// 需求委托-指派
import request from '@/utils/request'

// 获取需求详情
export function getOrderDetail({ url, data }) {
  return request({
    url,
    method: "post",
    data
  })
}

// 保存
export function assignSave(data) {
  return request({
    url: "/oms/demandAssign/assign",
    method: "post",
    data
  })
}

// 获取 承运商/司机/车辆 列表
export function getCDCList(data) {
  return request({
    url: "",
    method: "post",
    data
  })
}

export const ASSIGNTYPE = [
  { VALUE: "1", LABEL: "承运商" },
  { VALUE: "2", LABEL: "司机" },
  { VALUE: "3", LABEL: "车辆" },
]

// 需求信息配置
export const orderConfig = [
  {},
]

// 配载信息配置
export const loadConfig = [
  { FIELD: "PK_DRIVER", LABEL: "司机", COL: 8, CONTROLS: "slot", MAXLENGTH: "200", ISSHOW: 2, OTHER: "", ISREQUIRE: 1, LINKAGE: '{"ISSHOW":"Data.ASSIGNTYPE==3"}' },
  { FIELD: "PK_CAR", LABEL: "车辆", COL: 8, CONTROLS: "slot", MAXLENGTH: "200", ISSHOW: 2, OTHER: "", ISREQUIRE: 1, LINKAGE: '{"ISSHOW":"Data.ASSIGNTYPE==2"}' },
  { FIELD: "ROUND", LABEL: "次数", COL: 8, CONTROLS: "ExNumber", MAXLENGTH: "200", DEFAULTVAL: "1", ISSHOW: 1, SUFFIX: "趟", MAXLENGTH: "999", ISREQUIRE: 1, OTHER: "", SLOTCFG: '{"MIN":"1"}', LINKAGE: '{"POINT":"0"}' },
  { FIELD: "STARTDATE", LABEL: "开始运输", COL: 8, CONTROLS: "ExDate", MAXLENGTH: "20", ISSHOW: 2, ISREQUIRE: 1, OTHER: "" },
  { FIELD: "ETADATE", LABEL: "预计到达", COL: 8, CONTROLS: "ExDate", MAXLENGTH: "20", ISSHOW: 2, ISREQUIRE: 1, OTHER: "" },
  { FIELD: "ISXX", LABEL: "是否卸箱", COL: 8, CONTROLS: "ExSwitch", DEFAULTVAL: "0", ISSHOW: 2, OTHER: "", LINKAGE: '{"ISSHOW":"Data.ASSIGNTYPE==2"}', },
]