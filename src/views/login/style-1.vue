<!--
 * @Author: cc2049
 * @Date: 2024-04-19 09:01:33
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-04-23 10:45:48
 * @Description: 简介
-->
<template>

  <div>
    <h1>登录模板001</h1>

    需要支持：banner图、是否支持短信验证码登录、是否需要APP图标

    <el-button @click="getUserToken">登录获取token</el-button>
    <el-button @click="getUserMenu">获取菜单</el-button>
    <el-button @click="getUserinfo">获取用户信息</el-button>

  </div>
</template>

<script setup>
// import loginPublic from "@/views/login/login-public.vue"
import loginStyle01 from "@/views/login/style-1.vue";
import useSettingsStore from "@/store/modules/settings";
import useUserStore from "@/store/modules/user";
const settingsStore = useSettingsStore();
const userStore = useUserStore();
// const systemConfig = computed(() => settingsStore.systemConfig);

const props = defineProps({
  LoginConfig: {
    type: Object,
    default: {},
  },
});

const message = ref("Hello Vue TMS-V3!");

import { axiosGet } from "#/common";
const LoginConfig = ref(null);
const redirect = ref("");
const getUserToken = () => {
  let data = {
    PASSWORD: "ce00580d6b3d1e0d7b7b8ec5eab0bc89",
    APASSWORD: "",
    USERNAME: "admin",
    LOGINTYPE: "captcha",
    TYPE: "WEB",
    USERTYPE: "0",
  };
  // 调用action的登录方法
  userStore
    .login(data)
    .then(() => {
      // getUserThemeConfig();
      router.push({ path: redirect.value || "/" });
    })
    .catch((err) => {
      if (err.RESULT?.ENABLEVERIFICAT == 1) {
        captchaEnabled.value = true;
        getCode();
      }
    });
};
</script>