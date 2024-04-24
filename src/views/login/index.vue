<!--
 * @Author: cc2049
 * @Date: 2024-04-19 09:01:33
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-04-24 10:47:40
 * @Description: 简介
-->
<template>
  <loginStyle01 :LoginConfig />
  <!-- <loginStyle01 v-if="LoginConfig.style==1" :LoginConfig /> -->
  <!-- <loginStyle02 v-if="LoginConfig.style==1" :LoginConfig /> -->

  <!-- <div v-else>
    <h1>登录入口-可以切换登录模板</h1>

    需要支持：banner图、是否支持短信验证码登录、是否需要APP图标

    <p>{{ message }}</p>

    <el-button @click="getUserToken">登录获取token</el-button>
    <el-button @click="getUserMenu">获取菜单</el-button>
    <el-button @click="getUserinfo">获取用户信息</el-button>

  </div> -->
</template>

<script setup>
// import loginPublic from "@/views/login/login-public.vue"
import loginStyle01 from "@/views/login/style-1.vue";
import loginStyle02 from "@/views/login/style-2.vue";
import useSettingsStore from "@/store/modules/settings";
const settingsStore = useSettingsStore();
// const systemConfig = computed(() => settingsStore.systemConfig);

const message = ref("Hello Vue TMS-V3!");

import { axiosGet } from "#/common";
const LoginConfig = ref({
  style: null,
});

const getGlobalConfig = () => {
  let data = { MODULETYPE: "PCCONFIG", VTYPE: "SYSCONFIG" };
  axiosGet("sys/config/getList", data).then((res) => {
    let { RESULT } = res,
      newObj = {};
    RESULT.forEach((item) => {
      newObj[item.CONFIGKEY] = item.CONFIGVALUE || item.PARAMKEYVALUE;
    });
    try {
      LoginConfig.value = newObj.LoginConfig
        ? JSON.parse(newObj.LoginConfig)
        : {};
      console.log("LoginConfig.value", LoginConfig.value);
    } catch (error) {
      console.log("获取登录界面配置出错", error);
    }
    settingsStore.setGlobalConfig(newObj);
  });
};
getGlobalConfig();
</script>