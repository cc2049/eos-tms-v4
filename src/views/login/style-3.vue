<!-- 登录样式 1 -->
<template>

  <div class="login">

    <div>
      <img :src="backImg" alt="" class="login-imgClass">
    </div>

    <div class="login-loginForm" :style="styleType == 2 ? 'right:250px' : ''">
      <div>
        <div class="login-loginForm-title">易思云 i-TMS</div>
        <LoginForm3 class="login-loginForm-centerForm" @clickForgetPassword="forgetPassword" :LoginConfigs
          @clickShowClause="showClause" />
      </div>
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

import LoginForm3 from "./components/loginForm3.vue";
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

const imgBaseUrl = computed(() => settingsStore.globalConfig.imgBaseUrl + '/');
const backImg = computed(() => imgBaseUrl.value + LoginConfigs.value.banner)
const styleType = computed(() => LoginConfigs.value.style)

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
  width: 100vw;
  height: 100vh;
  overflow: hidden;

  &-imgClass {
    height: 100vh;
  }

  &-loginForm {
    width: 480px;
    height: 100vh;
    background-color: #fff;
    position: fixed;
    right: 0;
    top: 0;
    z-index: 999;

    display: flex;
    justify-content: center;
    align-items: center;

    &-centerForm {
      // margin: auto;
    }
    &-title{
      text-align: center;
      color: var(--el-color-primary) !important;
      font-size: 24px;
    }

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