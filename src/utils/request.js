import axios from 'axios'
import { ElNotification, ElMessageBox, ElMessage, ElLoading } from 'element-plus'
import { getToken } from '@/utils/auth'
import errorCode from '@/utils/errorCode'
import { tansParams, blobValidate } from '@/utils/ruoyi'
import { saveAs } from 'file-saver'
import useUserStore from '@/store/modules/user'
import useAlertStore from "@/store/modules/alert";

import { aesEncrypt, aesDEncrypt } from '@/utils/aes.js'
// const alertStore = useAlertStore();
let downloadLoadingInstance;
// 是否显示重新登录
export let isRelogin = { show: false };

axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'
// 创建axios实例
const service = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API,
  timeout: 1000000,
  method: 'post'
})

// request拦截器
service.interceptors.request.use(config => {
  // 是否需要设置 token
  const isToken = (config.headers || {}).isToken === false
  // 是否需要防止数据重复提交
  // 是否加密数据
  const encry = (config || {}).encry === false
  if (getToken() && !isToken) {
    config.headers['Authorization'] = 'Bearer ' + getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
  }
  // get请求映射params参数
  if (config.method === 'get' && config.params) {
    let url = config.url + '?' + tansParams(config.params);
    url = url.slice(0, -1);
    config.params = {};
    config.url = url;
  }
  const axiosData = config.data;
  // 删除 EnumData & _getDICT
  if (config?.data?.EnumData) delete config.data.EnumData
  if (config?.data?._getDICT) delete config.data._getDICT
  // 加密 封装数据
  if (!encry) config.data = {
    APPID: "",
    DATA: config.data && Array.isArray(config.data.data) ? config.data.data : config.data,
    KEY: "",
    MODULEID: axiosData ? (config.data.MODULEID || '') : '',
    PAGEID: axiosData ? (config.data.PAGEID || '') : '',
    PARENTPAGE: axiosData ? (config.data.PARENTPAGE) || '' : '',
    PROGRAMID: axiosData ? (config.data.PROGRAMID) || '' : '',
    CLIENTTYPE: "PC",
    VERSION: ""
  }
  if (config.url?.includes('ISRSA=1')) {
    const { aesKey, aesData } = aesEncrypt(config.data.DATA)
    const newRsaData = { KEY: aesKey, SECRETDATA: aesData }
    // config.data.KEY = aesKey
    // config.data.SECRETDATA = aesData
    config.data = newRsaData
    delete config.data.DATA
  }

  if (config.data.DATA?.MODULEID) {
    delete config.data.DATA.MODULEID
    delete config.data.DATA.PROGRAMID
    delete config.data.DATA.PAGEID
  }
  return config
}, error => {
  Promise.reject(error)
})

// 响应拦截器
service.interceptors.response.use(res => {
  // 未设置状态码则默认成功状态
  const code = isNaN(res.data.STATUS * 1) ? 400 : res.data.STATUS * 1;
  // 获取错误信息
  const msg = errorCode[code] || res.data.MESSAGE || errorCode['default']
  // 二进制数据则直接返回
  if (res.request.responseType === 'blob' || res.request.responseType === 'arraybuffer') {
    return res.data
  }

  if (code === 401) {
    console.error('code', res);
    isRelogin.show = false
    if (!isRelogin.show) {
      isRelogin.show = true;
      ElMessageBox.confirm('登录状态已过期，请重新登录', '系统提示', {
        confirmButtonText: '重新登录',
        cancelButtonText: '取消',
        showCancelButton: false,
        showClose: false,
        type: 'warning'
      }
      ).then(() => {
        isRelogin.show = false;
        useUserStore().cleanUserInfo()
        location.href = '/login';
      }).catch(() => {
        isRelogin.show = false;
      });
    }
  } else if (code === 500) {
    ElNotification.closeAll()
    ElNotification.error({
      title: msg
    })
    return Promise.reject(new Error(msg))
  } else if (code === 205) {   // 登录判断密码复杂度的返回状态
    return Promise.reject(res.data)
  } else if (code !== 200) {
    // ElNotification.closeAll()
    // ElNotification.error({
    //   title: msg
    // })
    useAlertStore().setAlert({
      show: true,
      title: msg,
      content: "",
      type: "error",
    });
    return Promise.reject(res.data)
  } else {
    if (res.data && res.data.KEY) {
      let KMData = {};
      KMData = KMData ? JSON.parse(aesDEncrypt(res.data)) : null
      res.data.RESULT = KMData
    }
    
    return Promise.resolve(res.data)
  }
},
  error => {
    console.error('Err:' + error)
    let { message } = error;
    if (message == "Network Error") {
      message = "服务器网络故障，请稍后重试";
    }else if (message.includes("timeout")) {
      message = "系统接口请求超时";
    } else if (message.includes("Request failed with status code")) {
      message = "服务运维中，请稍后重试";
    }
    ElNotification.closeAll()
    ElNotification.error({
      title: message
    })
    return Promise.reject(error)
  }
)

// 通用下载方法  'Content-Type': 'application/x-www-form-urlencoded' ,
export function download22(url, params = {}, filename = '') {
  downloadLoadingInstance = ElLoading.service({ text: "正在下载数据，请稍候", background: "rgba(0, 0, 0, 0.7)", })
  return service.post(url, params, {
    transformRequest: [(params) => { return tansParams(params) }],
    headers: { 'Authorization': 'Bearer ' + getToken() },
    responseType: 'blob'
  }).then(async (data) => {
    const isLogin = await blobValidate(data);
    if (isLogin) {
      const blob = new Blob([data])
      saveAs(blob, filename)
    } else {
      const resText = await data.text();
      const rspObj = JSON.parse(resText);
      const errMsg = errorCode[rspObj.code] || rspObj.msg || errorCode['default']
      ElMessage.error(errMsg);
    }
    downloadLoadingInstance.close();
  }).catch((r) => {
    console.error(r)
    ElMessage.error('下载文件出现错误，请联系管理员！')
    downloadLoadingInstance.close();
  })
}



// 下载文件
export function download(url, params) {
  // let BBURL = import.meta.env.VITE_APP_BASE_API, Token = getToken();
  // let uniSigns = new Date().getTime() + '';
  // axios({
  //   url: `${BBURL}${url}`,
  //   method: 'post',
  //   data: params,
  //   headers: {
  //     Authorization: `Bearer ${Token}`
  //   },
  //   responseType: 'blob',
  //   onDownloadProgress: progress => {
  //     let filename = params.DATA.FILENAME
  //     let total = progress.total || progress.target.response.size;
  //     let loaded = progress.loaded;
  //     let downProgress = Math.round(100 * loaded / total)
  //     useFileDownStore().setDown({ name: filename, path: uniSigns, progress, downProgress })
  //   }
  // }).then((res) => {
  //   let contentDisposition = res.headers["content-disposition"];
  //   if (!contentDisposition) {
  //     let resData = res.data.text().then(res => {
  //       res = JSON.parse(res)
  //       if (!res.SUCCESS) ElMessage.error(res.MESSAGE)
  //     })
  //     return
  //   }
  //   let flieName = contentDisposition.split("=")[1];
  //   let blob = new Blob([res.data]);
  //   let url = window.URL.createObjectURL(blob);
  //   let link = document.createElement("a");
  //   link.style.display = "none";
  //   link.href = url;
  //   link.setAttribute("download", decodeURIComponent(flieName));
  //   document.body.appendChild(link);
  //   link.click();
  // }).catch((err) => {
  //   ElMessage.error(err.message)
  // });
}



// 上传文件
export function uploadFileApi(data) {
  let BBURL = import.meta.env.VITE_APP_BASE_API, Token = getToken();
  // 创建FormData
  const formData = new FormData()
  formData.append('file', data)
  return new Promise((resolve, reject) => {
    axios({
      url: `${BBURL}/sys/file/upload`,
      method: 'post',
      data: formData,
      params: { filename: 'file', BILLFROM: "0" },
      headers: {
        Authorization: `Bearer ${Token}`
      },
    })
      .then((res) => {
        if (res.status === 200) {
          let { SUCCESS, RESULT } = res.data
          resolve(RESULT)
        } else {
          ElMessage.error('文件上传失败')
        }
      })
      .catch((err) => {
        ElMessage.error(err.message)
      });
  })
}

export default service
