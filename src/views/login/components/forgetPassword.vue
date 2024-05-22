<!--
 * 忘记密码弹窗组件
 * @author: wsd
 * @since: 2024-04-24
 * forgetPassword.vue
-->
<template>
    <div class="container">
        <el-dialog v-model="isShowModal" title="忘记密码" width="600" draggable align-center
            :before-close="cancelForgotPassword">
            <el-form ref="forgotPasswordRef" :model="forgotPasswordForm" :rules="forgotPasswordRules"
                label-position="right" label-width="auto">
                <el-form-item prop="MOBILE" label="手机号">
                    <el-input v-model.number="forgotPasswordForm.MOBILE" type="number" autocomplete="off"
                        placeholder="请输入手机号" clearable :prefix-icon="Iphone">
                    </el-input>
                </el-form-item>
                <el-form-item prop="CODE" label="验证码">
                    <el-input v-model="forgotPasswordForm.CODE" type="text" auto-complete="off" placeholder="请输入验证码"
                        clearable :maxlength="11" :prefix-icon="Lock">
                        <template #append>
                            <span class="" @click="getTelCodeProp" disabled>
                                {{ telCode }}
                            </span>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item prop="NEWPASSWORD" label="新密码">
                    <el-input v-model="forgotPasswordForm.NEWPASSWORD" placeholder="请输入新密码" type="password"
                        autocomplete="new-password" show-password>
                    </el-input>
                </el-form-item>
                <el-form-item prop="SUREPASSWORD" label="确认密码">
                    <el-input v-model="forgotPasswordForm.SUREPASSWORD" placeholder="请确认密码" type="password"
                        autocomplete="new-password" show-password>
                    </el-input>
                </el-form-item>
                <div class="passMes">
                    请输入必须满足8-16位且包含大小写字母、数字
                </div>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button type="primary" :loading="confirmForgotPasswordLoading" @click="confirmForgotPassword">确
                        定</el-button>
                    <el-button :loading="confirmForgotPasswordLoading" @click="cancelForgotPassword">取 消</el-button>
                </div>
            </template>
        </el-dialog>



    </div>
</template>

<script setup>
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
import md5 from 'js-md5';
import {aesJmEncrypt} from "@/utils/aes";

const props = defineProps({
    isShow: {
        type: Boolean,
        default: false,
    },
});
const { proxy } = getCurrentInstance();

const isShowModal = computed(() => props.isShow)
const emit = defineEmits('close')


const telCode = ref("获取验证码");
const confirmForgotPasswordLoading = ref(false)
const forgotPasswordRef = ref(null)
const forgotPasswordForm = ref({})
const equalToPassword = (rule, value, callback) => {
    if (forgotPasswordForm.value.NEWPASSWORD !== value) {
        callback(new Error("两次输入的密码不一致"));
    } else {
        callback();
    }
};
const forgotPasswordRules = reactive({
    CODE: [{ required: true, trigger: "blur", message: "请输入验证码" }],
    MOBILE: [
        { required: true, trigger: "blur", message: "请输入正确的手机号" },
        {
            pattern: /^1[3456789]\d{9}$/,
            message: "手机号码格式不正确",
            trigger: "blur",
        },
    ],
    NEWPASSWORD: [
        { required: true, trigger: "blur", message: "请输入密码" },
        {
            pattern:
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[-`=\[\];',.~!@#$%^&*()_+|{}:"?])[A-Za-z\d-`=\[\];',.~!@#$%^&*()_+|{}:"?]{8,16}$/,
            message: "请输入必须满足8-16位且包含大小写字母、数字",
            trigger: "blur",
        },
    ],
    SUREPASSWORD: [
        { required: true, trigger: "blur", message: "请确认密码" },
        { required: true, validator: equalToPassword, trigger: "blur" },
        {
            pattern:
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[-`=\[\];',.~!@#$%^&*()_+|{}:"?])[A-Za-z\d-`=\[\];',.~!@#$%^&*()_+|{}:"?]{8,16}$/,
            message: "请输入必须满足8-16位且包含大小写字母、数字",
            trigger: "blur",
        },
    ],
});


let countdownProp = 60;

function getTelCodeProp() {
    if (countdownProp < 60) return;
    if (countdownProp == 60 && forgotPasswordForm.value.MOBILE) {
        // let data = { MOBILE: forgotPasswordForm.value.MOBILE };

        const protData={
            APPID:"",
            DATA:{
                MOBILE: forgotPasswordForm.value.MOBILE
            },
            KEY:"",
            MODELEID:"",
            PAGEID:"",
            PARENTPAGE:"",
            VERSION:"",
        }


        sendSmsCode(protData)
            .then(() => {
                // 手机验证码60s倒计时
                let timer = setInterval(() => {
                    countdownProp -= 1;
                    telCode.value = countdownProp + "S后重试";
                    if (countdownProp === 0) {
                        clearInterval(timer);
                        countdownProp = 60;
                        telCode.value = "获取验证码";
                    }
                }, 1000);
            })
            .catch((err) => {
                console.log(err);
            });
    } else {
        proxy.$modal.msgError("请输入手机号~");
    }
}
function confirmForgotPassword() {
    proxy.$refs.forgotPasswordRef.validate((valid) => {
        if (valid) {
            confirmForgotPasswordLoading.value = true;
            let data = {
                MOBILE: forgotPasswordForm.value.MOBILE,
                CODE: forgotPasswordForm.value.CODE,
                NEWPASSWORD: md5(forgotPasswordForm.value.NEWPASSWORD),
                SUREPASSWORD: md5(forgotPasswordForm.value.SUREPASSWORD),
                PID: aesJmEncrypt(forgotPasswordForm.value.NEWPASSWORD),
            };
            forgotPwd(data)
                .then(() => {
                    proxy.$modal.msgSuccess("修改成功，请登录~");
                    confirmForgotPasswordLoading.value = false;
                    emit('close')
                })
                .catch((err) => {
                    confirmForgotPasswordLoading.value = false;
                });
        }
    });
}
function cancelForgotPassword() {
    confirmForgotPasswordLoading.value = false;
    forgotPasswordForm.value = {};
    emit('close')
    forgotPasswordRef.value.resetFields()
}

</script>

<style scoped lang="scss"></style>
