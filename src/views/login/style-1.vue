<!-- 登录样式 1 -->
<template>

  <div class="login" :style="{
  background: `url(${backImg}) no-repeat left`}">
 
    <!-- <h1>登录模板001</h1>

    需要支持：banner图、是否支持短信验证码登录、是否需要APP图标

    <el-button @click="getUserToken">登录获取token</el-button>
    <el-button @click="getUserMenu">获取菜单</el-button>
    <el-button @click="getUserinfo">获取用户信息</el-button> -->
    <div class="login-loginForm">
      <LoginForm @clickForgetPassword="forgetPassword" :LoginConfigs />
    </div>


  </div>
  <ForgetPassword v-if="LoginConfigs.isResetPassword" :isShow="forgetPasswordModel" @close="forgetPasswordModel = false" />

</template>

<script setup>

import LoginForm from "./components/loginForm.vue";
import ForgetPassword from './components/forgetPassword.vue'


// import loginPublic from "@/views/login/login-public.vue"
import loginStyle01 from "@/views/login/style-1.vue";
import useSettingsStore from "@/store/modules/settings";
import useUserStore from "@/store/modules/user";
const settingsStore = useSettingsStore();
const userStore = useUserStore();
const router = useRouter();
const props = defineProps({
  LoginConfig: {
    type: Object,
    default: {},
  },
});

import { axiosGet } from "#/common";
const LoginConfigs = computed(() => props.LoginConfig)
const backImg = computed(() => 'http://116.63.138.118:8079/'+LoginConfigs.value.banner)

const redirect = ref("");
const getUserToken = () => {
  let data = {
    PASSWORD: "Aa@123456",
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

const forgetPasswordModel = ref(false)
const forgetPassword = () => {
  forgetPasswordModel.value = true
}



</script>


<style scoped lang="scss">
.login {
  // background: url(@/assets/images/login/style2/background-img.png) no-repeat left;
  background-size: cover;
  width: 100vw;
  height: 100vh;

  &-loginForm {
    position: fixed;
    right: 100px;
    top: 50%;
    transform: translate(0, -50%);

  }

}
</style>