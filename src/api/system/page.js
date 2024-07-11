/*
 * @Author: cc2049
 * @Date: 2024-04-25 17:39:07
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-07-11 14:38:16
 * @Description: 获取菜单配置相关
 */

import localforage from 'localforage'
import request from "@/utils/request";
import Cookies from 'js-cookie'

// 设置本地数据库名称
const EosIndexedDB = localforage.createInstance({
  name: 'EosIndexedDB',
})
let PageCache = null; // 是否开启本地数据库缓存

// 查询页面配置
export async function getPageConfig(data) {
  let localKey = data.MODULEID + data.PAGEID
  // PageCache = Cookies.get('PageCache') || null
  // console.log('PageCache', data);
  try {
    const localData = await localforage.getItem(localKey);
    let configData = null;
    if (PageCache == 1 && localData) {
      configData = localData
    } else {
      configData = await request({
        url: "/sys/pageConfig/getByPageNo",
        method: "post",
        data: data,
      })
      PageCache == 1 ? localforage.setItem(localKey, configData) : null
    }
    return new Promise((resolve, reject) => {
      resolve(configData);
    });
  } catch (err) {
    console.error("Err:", err);
  }
}

// 查询列表配置
export function getTableData(url, data) {
  delete data.EnumData
  return request({
    url: url,
    method: "post",
    data
  });
}

// 公共的数据交互接口
export function axiosSave(url, data) {
  return request({
    url: url,
    method: "post",
    data: data,
    isRepeatSubmit: true
  });
}



//重置列配置接口
export function restClick(data) {
  return request({
    url: "/sys/selectConfig/reset",
    method: "post",
    data: data,
  });
}

// 表单中的前一，后一按钮
export const upNextBtn = [
  {
    ACTION: "PREV",
    VNAME: "前一",
    CHILDREN: [
      {
        ACTION: "PREV",
        VNAME: "前一",
      },
      {
        ACTION: "FIRST",
        VNAME: "首张",
      },
    ],
  },
  {
    ACTION: "NEXT",
    VNAME: "后一",
    CHILDREN: [
      {
        ACTION: "NEXT",
        VNAME: "后一",
      },
      {
        ACTION: "FINAL",
        VNAME: "末张",
      },
    ],
  },
  {
    ACTION: "LIST",
    VNAME: "列表",
    CHILDREN: [],
  },
  {
    ACTION: "",
    VNAME: "选项",
    CHILDREN: [
      {
        ACTION: "",
        VNAME: "选项",
      },
      {
        ACTION: "",
        VNAME: "附件",
      },
    ],
  },
];

