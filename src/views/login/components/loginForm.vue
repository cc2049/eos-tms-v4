<!-- 登录表单组件 -->
<template>

  <div class="loginForm">
    <div class="loginForm-header">
      <div class="loginForm-header-title">账号登录</div>
      <el-button type="primary" text class="loginForm-forgetPassword">忘记密码</el-button>
    </div>
    <el-form ref="loginFormRef" style="max-width: 600px" :model="loginForm" :rules="loginRules" label-width="auto" size="large"
      class="demo-loginForm" status-icon>
      <el-form-item prop="username">
        <el-input v-model="loginForm.username" placeholder="请输入账号" />
      </el-form-item>
      <el-form-item prop="password">
        <el-input v-model="loginForm.password" placeholder="请输入密码" />
      </el-form-item>
    </el-form>
    <div class="loginForm-btn">
      <el-button type="primary" size="large" style="width: 100%;" @click="getUserToken">登录</el-button>
    </div>
    <div class="disflex justify-sb codeimgDad">
      <el-row :gutter="20">
        <el-col :span="8">
          <img class="codeimg" src="@/assets/images/login/1.png" alt="">
        </el-col>
        <el-col :span="8">
          <img class="codeimg" src="@/assets/images/login/2.png" alt="">
        </el-col>
        <el-col :span="8">
          <img class="codeimg" src="@/assets/images/login/3.png" alt="">
        </el-col>
      </el-row>
      <el-button type="primary" text class="loginForm-forgetPassword">验证码登录</el-button>
    </div>
    <div class="disflex loginForm-clause">
      <!-- <el-radio value="1" size="large"></el-radio> -->
      <el-radio-group v-model="radio">
        <el-radio :value="1"></el-radio>
      </el-radio-group>
      <!-- <div class="disflex"> -->
      同意
      <span class="linkText pointer">《服务条款》</span>
      与
      <span class="linkText pointer">《隐私条款》</span>
      <!-- </div> -->
    </div>
  </div>
</template>

<script setup>
  import { getUserConfig } from "#/login";
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

const radio = ref(null)

const loginForm = ref({})
const loginRules = ref([])
const loginFormRef = ref(null)


//   const LoginConfig = ref(null);
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
        getUserThemeConfig();
        router.push({ path: redirect.value || "/" });
      })
      .catch((err) => {
        if (err.RESULT?.ENABLEVERIFICAT == 1) {
          captchaEnabled.value = true;
          getCode();
        }
      });
  };


const getUserThemeConfig = () => {
  getUserConfig().then((res) => {
    try {
      let {
        topNav,
        tagsView,
        fixedHeader,
        sidebarLogo,
        dynamicTitle,
        sideTheme,
        menuStyle,
        theme,
      } = JSON.parse(res.RESULT);
      localStorage.setItem("layout-setting", res.RESULT);
      settingsStore.changeSetting({ key: "sideTheme", value: sideTheme });
      settingsStore.changeSetting({ key: "theme", value: theme });
      handleThemeStyle(theme);
      settingsStore.changeSetting({ key: "topNav", value: topNav });
      settingsStore.changeSetting({ key: "tagsView", value: tagsView });
      settingsStore.changeSetting({ key: "fixedHeader", value: fixedHeader });
      settingsStore.changeSetting({ key: "sidebarLogo", value: sidebarLogo });
      settingsStore.changeSetting({ key: "dynamicTitle", value: dynamicTitle });
      settingsStore.changeSetting({ key: "menuStyle", value: menuStyle });
    } catch (error) {
      console.log('解析个性化配置错误：', error);
    }
  });
};

</script>


<style scoped lang="scss">
@import "@/assets/styles/variables.module.scss";

.loginForm {

  background: #FEFEFE;
  box-shadow: 0px 0px 43px 0px rgba(74, 74, 74, 0.25);
  border-radius: 11px;
  padding: 70px 50px;

  &-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 60px;

    &-title {
      font-weight: 500;
      font-size: 32px;
      color: #131313;
      margin-right: 130px;
    }
  }

  &-forgetPassword {
    font-weight: 500;
    font-size: 18px;
    // color: #3370FF;
    color: $--color-primary;
  }


  &-btn {
    margin-top: 50px;
  }

  .linkText {
    color: $--color-primary;
  }

  &-clause {
    text-align: center;
    font-size: 18px;
    justify-content: center;
    margin-top: 60px;

    .el-radio {
      margin: 0;
    }
  }

  .codeimgDad{
    margin-top: 30px;
  }
  .codeimg{
    width: 58px;
    height: 58px;
  }

  :deep(.el-input__wrapper){
    box-shadow: none;
    border-bottom: 1px solid #E1E2E6;
    border-radius: 0;
  }

}
</style>