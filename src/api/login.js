/*
 * @Author: cc2049
 * @Date: 2024-04-23 10:08:57
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-05-21 11:22:49
 * @Description: 简介
 */
import request from '@/utils/request'
import localforage from 'localforage'



// 获取路由
export const getRouters = () => {
  return request({
    url: '/sys/module/getMenuByRoleList',
    data: {
      BILLFROM: "0"
    }
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


// 保存用户主题配置
export function saveUserConfig(data) {
  return request({
    url: "/sys/sysUserConfig/add",
    method: "post",
    data
  })
}

// 登录方法
export function login(data) {
  localforage.clear()
  return request({
    url: '/sys/check/login',
    headers: {
      isToken: false
    },
    method: 'post',
    data
  })
}

// 注册方法
export function register(data) {
  return request({
    url: '/register',
    headers: {
      isToken: false
    },
    method: 'post',
    data: data
  })
}

// 获取用户详细信息
export function getInfo() {
  return request({
    url: '/sys/user/getUserAccountInfo',
    method: 'post',
    data: { MODULEID: '', PAGEID: '', PARENTPAGE: '' }
  })
}

// 退出方法
export function logout() {
  return request({
    url: '/sys/check/logout',
    method: 'post',
    data:{},
    encry: false,
  })
}

// 获取验证码
export function getCodeImg() {
  return request({
    url: '/check/captcha',
    headers: {
      isToken: false
    },
    encry: false,
    method: 'get',
    timeout: 20000
  })
}

// 获取短信验证码
export function getNoteCode(data) {
  return request({
    url: 'sys/check/sendSmsCode ',
    headers: {
      isToken: false
    },
    method: 'post',
    data: data,
    encry: false,
    timeout: 20000
  })
}


// 重置密码
export function updatePwd(data) {
  return request({
    url: 'user/updatePwd',
    headers: {
      isToken: false
    },
    method: 'post',
    data: data,
  })
}

// 发送验证码
export function sendSmsCode(data) {
  return request({
    url: 'sys/check/sendSmsCode',
    headers: {
      isToken: false
    },
    method: 'post',
    data,
    encry: false,
  })
}

// 忘记密码
export function forgotPwd(data) {
  return request({
    // url: 'user/forgotPwd',
    url: '/sys/check/retrieve',
    headers: {
      isToken: false
    },
    method: 'post',
    data: data,
  })
}





// 重置密码表单配置
export const FormConfig = [
  { FIELD: "USERNAME", LABEL: "账号", COL: 24, CONTROLS: "ExTextBox", ISREQUIRE: 1, ISSHOW: 1, OTHER: "", ISDISABLED: 1 },
  { FIELD: "NEWPASSWORD", LABEL: "新密码", COL: 24, CONTROLS: "ExPassword", ISREQUIRE: 1, ISSHOW: 1, OTHER: "", RULES: 'Password' },
  { FIELD: "SUREPASSWORD", LABEL: "确认密码", COL: 24, CONTROLS: "ExPassword", ISREQUIRE: 1, ISSHOW: 1, OTHER: "", RULES: 'Password' },
]

// 重置密码表单配置
export const ForgotPasswordConfig = [
  { FIELD: "PHONE", LABEL: "手机号", COL: 24, CONTROLS: "ExTextBox", ISREQUIRE: 1, ISSHOW: 1, OTHER: "", },
  { FIELD: "CODE", LABEL: "验证码", COL: 24, CONTROLS: "ExTextBox", ISREQUIRE: 1, ISSHOW: 1, OTHER: "", },
]