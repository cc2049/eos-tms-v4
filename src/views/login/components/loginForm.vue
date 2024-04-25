<template>
  <!-- 登录表单组件 -->
  <div class="loginForm">
    <div class="loginForm-header">
      <div class="loginForm-header-title">账号登录</div>
      <el-button type="primary" text class="loginForm-forgetPassword" @click="forgetPassword">忘记密码</el-button>
    </div>
    <el-form ref="loginRef" style="max-width: 600px" :model="loginForm" :rules="loginRules" label-width="auto"
      size="large" class="demo-loginForm" status-icon>

      <template v-if="loginType == 'captcha'">
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" type="text" auto-complete="off" placeholder="账号" class="inputDeep"
            clearable>
            <template #prefix>
              <svg-icon icon-class="user" class="el-input__icon input-icon" />
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" type="password" auto-complete="off" placeholder="密码" show-password
            class="inputDeep" @keyup.enter="handleLogin">
            <template #prefix>
              <svg-icon icon-class="password" class="el-input__icon input-icon" />
            </template>
          </el-input>
          <!-- <el-input v-model="loginForm.password" placeholder="请输入密码" /> -->
        </el-form-item>
      </template>
      <template v-else>
        <el-form-item prop="mobile">
          <el-input v-model.number="loginForm.mobile" type="number" size="large" auto-complete="off" placeholder="手机号"
            clearable class="inputDeep" :prefix-icon="Iphone">
          </el-input>
        </el-form-item>

        <el-form-item prop="code">
          <el-input v-model="loginForm.code" type="text" size="large" auto-complete="off" placeholder="验证码" clearable
            :maxlength="11" :prefix-icon="Lock" class="input-with-select inputDeep">
            <template #append>
              <el-button @click="getTelCode" type="primary" :disabled="telCode != '获取验证码' ? true : false" link>
                {{ telCode }}
              </el-button>
            </template>
          </el-input>
        </el-form-item>
      </template>
    </el-form>
    <div class="loginForm-btn">
      <el-button type="primary" :loaging="loginBtnLogin" size="large" style="width: 100%;"
        @click="handleLogin">登录</el-button>
    </div>
    <div class="disflex justify-sb codeimgDad">
      <el-row :gutter="20">
        <el-col :span="8" v-if="LoginConfig.isIosIcon == 1">
          <el-popover placement="top-start" :width="280" trigger="hover">
            <template #reference>
              <div class="">
                <div class="app-img">
                  <img class="codeimg" src="@/assets/images/login/2.png" alt="">
                </div>
              </div>
            </template>
            <template #default>
              <img class="QRCode" :src="'http://116.63.138.118:8079/' + LoginConfig.iosQRCode" alt="">
            </template>
          </el-popover>
        </el-col>
        <el-col :span="8" v-if="LoginConfig.isAndroidIcon == 1">
          <el-popover placement="top-start" :width="280" trigger="hover">
            <template #reference>
              <div class="">
                <div class="app-img">
                  <img class="codeimg" src="@/assets/images/login/2.png" alt="">
                </div>
              </div>
            </template>
            <template #default>
              <img class="QRCode" :src="'http://116.63.138.118:8079/' + LoginConfig.AndroidQRCode" alt="">
            </template>
          </el-popover>
        </el-col>
        <el-col :span="8" v-if="LoginConfig.isWxIcon == 1">
          <el-popover placement="top-start" :width="280" trigger="hover">
            <template #reference>
              <div class="">
                <div class="app-img">
                  <img class="codeimg" src="@/assets/images/login/2.png" alt="">
                </div>
              </div>
            </template>
            <template #default>
              <img class="QRCode" :src="'http://116.63.138.118:8079/' + LoginConfig.WxQRCode" alt="">
            </template>
          </el-popover>
        </el-col>
      </el-row>
      <el-button v-if="LoginConfig.isSMS == 1" type="primary" text class="loginForm-forgetPassword" @click="clickCut">{{
        loginType == 'captcha' ?
          '验证码登录'
          :
          '密码登录' }}</el-button>
    </div>
    <div class="disflex loginForm-clause">
      <el-icon color="#0c64eb">
        <SuccessFilled />
      </el-icon>
      同意
      <text class="text-blue" @click="showClause(1)">《服务条款》</text>
      与
      <text class="text-blue" @click="showClause(2)">《隐私条款》</text>
    </div>
  </div>




</template>

<script setup>

import Cookies from "js-cookie";
import { handleThemeStyle } from "@/utils/theme";
import { getUserConfig } from "#/common";
import { getFormValue, getFormRule, aesJmEncrypt } from "@/utils";

import {
  getCodeImg,
  getNoteCode,
  FormConfig,
  ForgotPasswordConfig,
  updatePwd,
  sendSmsCode,
  forgotPwd,
} from "@/api/login";
import {
  HelpFilled,
  Delete,
  Edit,
  Message,
  Search,
  Star,
  Filter,
  Iphone,
  Lock,
} from "@element-plus/icons-vue";

// import { ComponentSize, FormInstance, FormRules } from 'element-plus'
import useSettingsStore from "@/store/modules/settings";
import useUserStore from "@/store/modules/user";
const settingsStore = useSettingsStore();
const userStore = useUserStore();
const router = useRouter();
const props = defineProps({
  LoginConfigs: {
    type: Object,
    default: {},
  },
});
console.log(props.LoginConfigs)
const { proxy } = getCurrentInstance();
const emit = defineEmits('clickForgetPassword', "clickShowClause")
const LoginConfig = computed(() => props.LoginConfigs)

const radio = ref(null)
const loginType = ref("captcha");
const loginForm = ref({
  username: "",
  password: "",
  APASSWORD: "",
  rememberMe: false,
  code: "",
  uuid: "",
  mobile: "",
  LOGINTYPE: "captcha",
});
const loginRules = reactive({
  username: [{ required: true, trigger: "blur", message: "请输入您的账号" }],
  password: [{ required: true, trigger: "blur", message: "请输入您的密码" }],
  code: [{ required: true, trigger: "change", message: "请输入验证码" }],
  mobile: [
    { required: true, trigger: "blur", message: "请输入正确的手机号" },
    {
      pattern: /^1[3456789]\d{9}$/,
      message: "手机号码格式不正确",
      trigger: "blur",
    },
  ],
});
const loginRef = ref(null)
const loginBtnLogin = ref(false)
const codeUrl = ref("");

const redirect = ref("");

const clickCut = () => {
  loginType.value = loginType.value == 'captcha' ? 'sms_code' : 'captcha'
  const loginForm = ref({
    username: "",
    password: "",
    APASSWORD: "",
    rememberMe: false,
    code: "",
    uuid: "",
    mobile: "",
    LOGINTYPE: loginType.value,
  });

}

function handleLogin() {
  loginRules.code[0].required = true;

  loginForm.value.LOGINTYPE =
    loginType.value == "captcha" ? "captcha" : "sms_code";

  proxy.$refs.loginRef.validate((valid) => {
    if (valid) {
      loginBtnLogin.value = true;
      loginForm.value.APASSWORD = loginForm.value.password;
      // 勾选了需要记住密码设置在 cookie 中设置记住用户名和密码
      if (loginForm.value.rememberMe) {
        Cookies.set("username", loginForm.value.username, { expires: 30 });
        Cookies.set("password", encrypt(loginForm.value.password), {
          expires: 30,
        });
        Cookies.set("rememberMe", loginForm.value.rememberMe, { expires: 30 });
      } else {
        // 否则移除
        Cookies.remove("username");
        Cookies.remove("password");
        Cookies.remove("rememberMe");
      }
      // 调用action的登录方法


      userStore
        .login(loginForm.value)
        .then(() => {
          getUserThemeConfig();
          router.push({ path: redirect.value || "/" });
        })
        .catch((err) => {
          initForm();
          if (err.RESULT?.ENABLEVERIFICAT == 1) {
            captchaEnabled.value = true;
            getCode();
          }
          loginBtnLogin.value = false;
        });
    }
  });
}
function getCode() {
  getCodeImg().then((res) => {
    let { IMG, UUID } = res.RESULT;
    codeUrl.value = "data:image/gif;base64," + IMG;
    loginForm.value.uuid = UUID;
  });
}
const initForm = () => {
  formConfig.value = FormConfig;
  let formData = getFormValue(FormConfig);
  baseForm.value = formData;
  resetPasswords.value = formData;
  resetPasswords.value.USERNAME = loginForm.value.username;
  rules.value = getFormRule(FormConfig);
  // 增加确认密码和新密码是否一致的校验
  rules.value.SUREPASSWORD.push({
    validator: resetPasswordConfirmation,
    trigger: "blur",
  });

  modalConfig.modalW = "40%";
  modalConfig.modalH = "50%";
  modalConfig.open = userStore.showUpdatePassword;
  loginBtnLogin.value = false;
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
let countdown = 60;
const telCode = ref("获取验证码");

function getTelCode() {
  loginRules.code[0].required = false;
  if (countdown < 60) return;
  proxy.$refs.loginRef.validate((valid) => {
    if (valid) {
      // let data = { MOBILE: loginForm.value.mobile };
      const protData = {
        APPID: "",
        DATA: {
          MOBILE: loginForm.value.mobile
        },
        KEY: "",
        MODELEID: "",
        PAGEID: "",
        PARENTPAGE: "",
        VERSION: "",
      }
      getNoteCode(protData).then(() => {
        //手机验证码60s倒计时
        let timer = setInterval(() => {
          countdown -= 1;
          telCode.value = countdown + "S后重试";
          if (countdown === 0) {
            clearInterval(timer);
            countdown = 60;
            telCode.value = "获取验证码";
          }
        }, 1000);
      });
    }
  });
}

const forgetPassword = () => {
  emit('clickForgetPassword')

}

const showClause = (e) => {
  emit('clickShowClause', e)

}







</script>


<style scoped lang="scss">
@import "@/assets/styles/variables.module.scss";

.loginForm {

  background: #FEFEFE;
  box-shadow: 0px 0px 43px 0px rgba(74, 74, 74, 0.25);
  border-radius: 11px;
  padding: 60px 40px;

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

  .codeimgDad {
    margin-top: 30px;
  }

  .codeimg {
    width: 48px;
    height: 48px;
  }

  :deep(.el-input__wrapper) {
    box-shadow: none;
    border-bottom: 1px solid #E1E2E6;
    border-radius: 0;
  }

  // :deep(.el-input__prefix) {
  //   height: 14px !important;
  // }

  .input-icon {
    height: 39px;
    width: 14px;
    margin-left: 0px;
  }

  .text-blue {
    color: #0c64eb;
    cursor: pointer;
  }


}

.QRCode {
  width: 250px !important;
}


// /* 在小屏幕上减小字体大小 */
// @media (max-width: 1024px) {
//   .loginForm {
//     border-radius: 11px;
//     padding: 30px 20px;
//     &-header {
//       display: flex;
//       align-items: center;
//       justify-content: space-between;
//       margin-bottom: 20px;
//       &-title {
//         font-weight: 500;
//         font-size: 22px;
//         color: #131313;
//         margin-right: 68px;
//       }
//     }
//     &-forgetPassword {
//       font-weight: 500;
//       font-size: 14px;
//       // color: #3370FF;
//       color: $--color-primary;
//     }
//     &-btn {
//       margin-top: 20px;
//     }
//     .linkText {
//       color: $--color-primary;
//     }
//     &-clause {
//       text-align: center;
//       font-size: 14px;
//       justify-content: center;
//       margin-top: 20px;
//       .el-radio {
//         margin: 0;
//       }
//     }
//     .codeimgDad {
//       margin-top: 10px;
//     }
//     .codeimg {
//       width: 30px;
//       height: 30px;
//     }
//     .input-icon {
//       height: 29px;
//       width: 14px;
//       margin-left: 0px;
//     }
//     .text-blue {
//       color: #0c64eb;
//       cursor: pointer;
//     }
//   }
// }

/* 在大屏幕上增加字体大小 */
@media (max-width: 1200px) {
  
  .loginForm {
    border-radius: 11px;
    padding: 30px 20px;
    &-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 20px;
      &-title {
        font-weight: 500;
        font-size: 22px;
        color: #131313;
        margin-right: 68px;
      }
    }
    &-forgetPassword {
      font-weight: 500;
      font-size: 14px;
      // color: #3370FF;
      color: $--color-primary;
    }
    &-btn {
      margin-top: 20px;
    }
    .linkText {
      color: $--color-primary;
    }
    &-clause {
      text-align: center;
      font-size: 14px;
      justify-content: center;
      margin-top: 20px;
      .el-radio {
        margin: 0;
      }
    }
    .codeimgDad {
      margin-top: 10px;
    }
    .codeimg {
      width: 30px;
      height: 30px;
    }
    .input-icon {
      height: 29px;
      width: 14px;
      margin-left: 0px;
    }
    .text-blue {
      color: #0c64eb;
      cursor: pointer;
    }
  }



}
</style>