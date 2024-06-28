<template>
  <div class="workflow-form">
    <el-scrollbar :height="formHeight">
      <MasterForm v-model="formConfig.formValue" :formConfig="formConfig.formColumns" :tableConfig="SubTableConfig" detail :loading="formConfig.isloading" />
      <template v-if="workflowDetail">
        <h3>审批意见</h3>
        <el-form ref="auditRef" :model="form">
          <el-form-item required prop="COMMENTS" :rules="[{ required: true, message: '审批意见不可为空' }]">
            <el-input type="textarea" v-model="form.COMMENTS" :rows="3" placeholder="审批意见" maxlength="200"></el-input>
          </el-form-item>
          <el-form-item>
            <el-row>
              <el-col :span="1.5" style="margin-right:20px">
                <el-button type="primary" @click="submitAudit('1')">同意</el-button>
              </el-col>
              <el-col :span="1.5">
                <el-button @click="submitAudit('0')">驳回</el-button>
              </el-col>
            </el-row>
          </el-form-item>
        </el-form>
      </template>
    </el-scrollbar>
  </div>
</template>

<script setup>
import MasterForm from "@/components/MasterForm";
import { getPageConfig } from '#/system/page'
import request from "@/utils/request";
import { enterDo, cancelDo } from "#/workflow/do"

const props = defineProps({
  currentData: Array,
  config: Object
})

const { proxy } = getCurrentInstance();
const emits = defineEmits(['close'])

const formHeight = computed(() => {
  const windowScrollHeight = window.innerHeight - 125
  return `${windowScrollHeight}px`
});

const auditRef = ref(null)
const workflowDetail = computed(() => {
  return props.config.ACTION != 'DTL'
})

const formConfig = ref({
  formValue: {}, // form数据
  formColumns: [], // form配置(已过滤显示)
  isloading: true
});
const SubTableConfig = ref([])

const form = ref({
  TASKID: "",
  COMMENTS: ""
})
const initForm = () => {
  if (props.currentData.length == 0) return false
  Object.assign(form.value, {
    TASKID: props.currentData[0].TASKID,
    COMMENTS: "",
  })
}
// 获取菜单
const getMENU = computed(() => {
  return {
    MODULEID: props.currentData[0].MENUID,
    PAGEID: props.currentData[0].PAGEID
  }
})
// 获取页面配置
const getConfig = async () => {
  return new Promise(async (resolve, reject) => {
    const config = await getPageConfig(getMENU.value)
    let { SLOTCFG, COLUMNS, SUBTABLE } = config.RESULT
    formConfig.value.formColumns = COLUMNS;
    SubTableConfig.value = SUBTABLE;
    getDataURL.value = SLOTCFG || props.config.ACTIONADDRESS
    resolve(1)
  })
}
// 获取数据
const getDataURL = ref("")
const getData = () => {
  if (!getDataURL.value) return proxy.$modal.error("未配置数据接口")
  const row = props.currentData[0]
  const data = {
    BILLNO: row.BUSINESSKEY,
    MODULEID: row.MENUID,
    PAGEID: row.PAGEID,
    PK_CLASS: row.BUSINESSKEY
  }
  request({
    url: getDataURL.value,
    method: "post",
    data
  }).then(res => {
    formConfig.value.formValue = res.RESULT
    formConfig.value.isloading = false
    initForm()
  })
}

const submitAudit = val => {
  auditRef.value.validate(valid => {
    if (!valid) return
    if (val == '1') {
      enterDo(form.value).then(res => {
        proxy.$modal.msgSuccess("审批成功")
        closePage()
      })
    } else {
      cancelDo(form.value).then(res => {
        proxy.$modal.msgSuccess("审批成功")
        closePage()
      })
    }
  })
}

// 关闭页面
const closePage = () => {
  emits("close")
}

// 初始化页面
const initPage = () => {
  getConfig().then(res => {
    getData()
  })
}

initPage()
</script>
<style lang="scss" scoped>
.workflow-form {
  padding: 0 10px;
}
</style>