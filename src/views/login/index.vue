<!--
 * @Author: cc2049
 * @Date: 2024-04-19 09:01:33
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-04-22 16:00:56
 * @Description: 简介
-->
<template>
  <div>
    <h1>登录入口-可以切换登录模板</h1>

    需要支持：banner图、是否支持短信验证码登录、是否需要APP图标

    <p>{{ message }}</p>
    <button @click="axiosGetDta">Change Message</button>
  </div>
</template>

<script setup>
// import loginPublic from "@/views/login/login-public.vue"
// import loginMES from "@/views/login/login-mes.vue"
import useSettingsStore from "@/store/modules/settings";
const settingsStore = useSettingsStore();
// const systemConfig = computed(() => settingsStore.systemConfig);

const message = ref("Hello Vue TMS-V3!");

import { axiosGet } from "#/common";

const axiosGetDta = () => {
  let data = {"MODULETYPE":"PCCONFIG","VTYPE":"SYSCONFIG"}
  axiosGet("sys/config/getList", data).then((res) => {
    let { RESULT } = res , newObj = {};
    RESULT.forEach(item => {
      newObj[item.CONFIGKEY] = item.CONFIGVALUE;
    });
    settingsStore.setGlobalConfig(newObj)
  });
};
</script>