/*
 * @Author: cc2049
 * @Date: 2024-04-19 09:01:33
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-07-02 14:13:12
 * @Description: 简介
 */
import { login, logout, getInfo } from "@/api/login";
import { getToken, setToken, removeToken } from "@/utils/auth";

import md5 from 'js-md5';

const useUserStore = defineStore("user", {
  state: () => ({
    token: getToken(),
    name: "",
    avatar: "",
    roles: [],
    systemInfo: {},
    userInfo: null,
    permissions: [],
    showUpdatePassword: false,
  }),
  persist: {
    enabled: true, // 开启存储
  },
  actions: {
    // 登录
    login(userInfo) {
      let saveData = {}
      if(userInfo.LOGINTYPE == 'captcha'){
        saveData = {
          PASSWORD: md5(userInfo.password || userInfo.PASSWORD),
          APASSWORD: "",
          USERNAME: userInfo.username || userInfo.USERNAME,
          LOGINTYPE: "captcha",
          TYPE: "WEB",
          USERTYPE: "0",
        };
      }else{
        saveData = {
          LOGINTYPE: "sms_code",
          TYPE: "WEB",
          USERTYPE: "0",
          MOBILE:userInfo.mobile || '',
          CODE:userInfo.code
        };

      }
      return new Promise((resolve, reject) => {
        login(saveData)
          .then((res) => {
            setToken(res.RESULT.ACCESS_TOKEN);
            this.token = res.RESULT.ACCESS_TOKEN;
            resolve();
          })
          .catch((error) => {
            if (error.STATUS == 205) {
              this.showUpdatePassword = true
            } else {
              this.showUpdatePassword = false
            }
            reject(error);

          });
      });
    },
    // 获取用户信息
    getInfo() {
      return new Promise((resolve, reject) => {
        getInfo().then((res) => {
          const user = res.RESULT;
          let avatar = user.AVATAR ? user.AVATAR : "";
          if (avatar && !avatar.includes('http') && avatar.slice(0, 1) != '/') {
            avatar = '/' + avatar
          }
          this.roles = ["ROLE_DEFAULT"];
          this.name = user.VNAME;
          this.avatar = avatar;
          this.userInfo = user;
          resolve(res.RESULT);
        }).catch((error) => {
          reject(error);
        });
      });
    },
    cleanUserInfo() {
      console.log('cleanUserInfo');
      this.token = "";
      this.roles = [];
      this.permissions = [];
      removeToken();
    },
    setExpiryDate(date) {
      this.systemInfo.REGISTRAEXPIREDDATE = date
    },
    // 退出系统
    logOut() {
      return new Promise((resolve, reject) => {
        logout(this.token)
          .then(() => {
            this.token = "";
            this.roles = [];
            this.permissions = [];
            removeToken();
            resolve();
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
  },
});

export default useUserStore;
