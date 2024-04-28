<!-- 登录样式 1 -->
<template>

  <div class="login" :style="{
    background: `url(${backImg}) no-repeat left `
  }">

    <!-- <h1>登录模板001</h1>

    需要支持：banner图、是否支持短信验证码登录、是否需要APP图标

    <el-button @click="getUserToken">登录获取token</el-button>
    <el-button @click="getUserMenu">获取菜单</el-button>
    <el-button @click="getUserinfo">获取用户信息</el-button> -->
    <div class="login-loginForm">
      <LoginForm @clickForgetPassword="forgetPassword" :LoginConfigs @clickShowClause="showClause" />
    </div>


  </div>
  <ForgetPassword v-if="LoginConfigs.isResetPassword" :isShow="forgetPasswordModel"
    @close="forgetPasswordModel = false" />

  <el-dialog v-model="showClauseModel" width="60%" height="60%">
    <template #title>
      <span class="modal-title">{{ showClauseContent.TITLE }}</span>
    </template>
    <div class="clauseText">
      <div v-html="showClauseContent.CONTENT"></div>

    </div>
  </el-dialog>

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

import { axiosGet, getDataByType } from "#/common";
const LoginConfigs = computed(() => props.LoginConfig)

const imgBaseUrl = computed(() => settingsStore.globalConfig.imgBaseUrl+'/');
const backImg = computed(() => imgBaseUrl.value + LoginConfigs.value.banner)


const forgetPasswordModel = ref(false)
const forgetPassword = () => {
  forgetPasswordModel.value = true
}

const showClauseModel = ref(false);
const showClauseContent = ref({});
const showClause = (e) => {
  let VTYPE = 3;
  if (e == 1) {
    VTYPE = 3;
  } else {
    VTYPE = 4;
  }
  getDataByType({
    VTYPE: VTYPE,
  }).then((res) => {
    showClauseModel.value = true;
    showClauseContent.value = res.RESULT;
  });
};



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

.clauseText {
  height: 500px;
  overflow-y: auto;
}


@media (max-width: 1024px) {
  .clauseText {
    height: 300px;
  }
}
</style>