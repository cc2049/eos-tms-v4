<template>
  <eos-form v-model="formData" :config="formConfig" :detail="detailMod" />
</template>

<script setup>
import { ref } from "vue"
import { getFormValue } from "@eosine/form"

const detailMod = ref(false)

const formData = ref({})
const demoDict = [{ LABEL: "选项1", VALUE: "option1" }, { LABEL: "选项2", VALUE: "option2" }, { LABEL: "选项3", VALUE: "option3" }]

const formConfig = [
  { FIELD: "ExReadCard", LABEL: "读取", COL: 24, CONTROLS: "ExReadCard", DEFAULTVAL: "只读控件", ISSHOW: 1 },
  { FIELD: "ExTextBox", LABEL: "输入框", COL: 24, CONTROLS: "ExTextBox", DEFAULTVAL: "", ISSHOW: 1 },
  { FIELD: "ExPassword", LABEL: "密码", COL: 24, CONTROLS: "ExPassword", DEFAULTVAL: "", ISSHOW: 1 },
  { FIELD: "ExTextarea", LABEL: "文本域", COL: 24, CONTROLS: "ExTextarea", DEFAULTVAL: "", ISSHOW: 1 },
  { FIELD: "ExNumber", LABEL: "数字输入框", COL: 24, CONTROLS: "ExNumber", DEFAULTVAL: "", ISSHOW: 1, SUFFIX: "吨" },
  { FIELD: "ExSelect", LABEL: "下拉选择", COL: 24, CONTROLS: "ExSelect", DEFAULTVAL: "option1", ISSHOW: 1, OTHER: JSON.stringify(demoDict) },
  { FIELD: "ExSelectMultiple", LABEL: "下拉多选", COL: 24, CONTROLS: "ExSelectMultiple", DEFAULTVAL: "option1,option2", ISSHOW: 1, OTHER: JSON.stringify(demoDict) },
  { FIELD: "ExRadio", LABEL: "单选", COL: 24, CONTROLS: "ExRadio", DEFAULTVAL: "option1", ISSHOW: 1, OTHER: JSON.stringify(demoDict) },
  { FIELD: "ExRadioButton", LABEL: "单选组", COL: 24, CONTROLS: "ExRadioButton", DEFAULTVAL: "option1", ISSHOW: 1, OTHER: JSON.stringify(demoDict) },
  { FIELD: "ExCheckbox", LABEL: "复选框", COL: 24, CONTROLS: "ExCheckbox", DEFAULTVAL: "option1", ISSHOW: 1, OTHER: JSON.stringify(demoDict) },
  { FIELD: "ExSelectSearch", LABEL: "下拉查询选择", COL: 24, CONTROLS: "ExSelectSearch", DEFAULTVAL: "", ISSHOW: 1, OTHER: "/base/material/getPageList???MATERIALNAME=VNAME&PK_MATERIAL=BILLNO&MATCODE=VCODE&WTUNIT=UNITTYPE" },
  { FIELD: "ExSelectMutiple", LABEL: "下拉查询多选", COL: 24, CONTROLS: "ExSelectMutiple", DEFAULTVAL: "", ISSHOW: 1 },
  { FIELD: "ExSelectGroup", LABEL: "分组选择", COL: 24, CONTROLS: "ExSelectGroup", DEFAULTVAL: "", ISSHOW: 1 },
  { FIELD: "ExTreeSelect", LABEL: "权限树多选", COL: 24, CONTROLS: "ExTreeSelect", DEFAULTVAL: "", ISSHOW: 1 },
  { FIELD: "ExRegion", LABEL: "级联选择", COL: 24, CONTROLS: "ExRegion", DEFAULTVAL: "", ISSHOW: 1 },
  { FIELD: "ExTime", LABEL: "时间选择", COL: 24, CONTROLS: "ExTime", DEFAULTVAL: "", ISSHOW: 1 },
  { FIELD: "ExDate", LABEL: "日期选择", COL: 24, CONTROLS: "ExDate", DEFAULTVAL: "", ISSHOW: 1 },
  { FIELD: "ExDateRange", LABEL: "日期区间", COL: 24, CONTROLS: "ExDateRange", DEFAULTVAL: "", ISSHOW: 1 },
  { FIELD: "ExSwitch", LABEL: "开关", COL: 24, CONTROLS: "ExSwitch", DEFAULTVAL: "", ISSHOW: 1 },
  { FIELD: "ExArea", LABEL: "省市区选择", COL: 24, CONTROLS: "ExArea", DEFAULTVAL: "", ISSHOW: 1 },
  { FIELD: "ExCarNum", LABEL: "车牌号组件", COL: 24, CONTROLS: "ExCarNum", DEFAULTVAL: "", ISSHOW: 1 },
  { FIELD: "ExUpload", LABEL: "图片上传", COL: 24, CONTROLS: "ExUpload", DEFAULTVAL: "", ISSHOW: 1 },
  { FIELD: "ExShowImage", LABEL: "图片预览", COL: 24, CONTROLS: "ExShowImage", DEFAULTVAL: "/group1/M00/00/3D/wKgB12Y8cKGAC26vAABTX6zAGxo005.png?attname=未标题-1.png", ISSHOW: 1 },
  { FIELD: "ExUploadFile", LABEL: "文件上传", COL: 24, CONTROLS: "ExUploadFile", DEFAULTVAL: "", ISSHOW: 1, MAXLENGTH: 1 },
  { FIELD: "ExEditor", LABEL: "富文本", COL: 24, CONTROLS: "ExEditor", DEFAULTVAL: "", ISSHOW: 1 },
  { FIELD: "ExLink", LABEL: "超链接", COL: 24, CONTROLS: "ExLink", DEFAULTVAL: "超链接", ISSHOW: 1 },
  { FIELD: "SmsCode", LABEL: "验证码", COL: 24, CONTROLS: "SmsCode", DEFAULTVAL: "", ISSHOW: 1 },
  { FIELD: "ExModalIcon", LABEL: "图标", COL: 24, CONTROLS: "ExModalIcon", DEFAULTVAL: "", ISSHOW: 1 },
  { FIELD: "ExJsonViewer", LABEL: "JSON 预览", COL: 24, CONTROLS: "ExJsonViewer", DEFAULTVAL: "", ISSHOW: 1 },
]

const init = () => {
  formData.value = getFormValue(formConfig)
  // formRules.value = getRules(formConfig)
}
init()
</script>
<style lang="scss" scoped>
</style>