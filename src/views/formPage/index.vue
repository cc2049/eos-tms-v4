<!--
 * @Author: cc2049
 * @Date: 2024-04-23 11:35:41
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-05-23 10:31:04
 * @Description: 大表单组件
-->

<template>
  <div class="form-container">
    <TopButton :topButton="topButton" sourceType="2" @handleBtnEvent="handleBtnEvent" @reloadTableData="reloadTableData" />
    <eos-form ref="eosFormRef" v-model="formData" :config="formConfig" :detail="detail">
      <template #subTable="{ config }" v-if="tableConfig.length > 0">
        <div class="formTable" :style="`margin-left:-${labelWidth}`">
          <SubTableCom :ref="config.FIELD+'Ref'" :key="config.FIELD" :detail="detail || config.ISDISABLED == '1'" :title="config.LABEL" :config="comConfig(config)" v-model:data="formData[config.FIELD]" v-model:mainFormData="formData" :othConfig="othConfig" @EtbaleLinkChange="EtbaleLinkChange" @updateTableData="updateTableData">
            <template #modalBtnAfter>
              <slot name="modalBtnAfter" />
            </template>
          </SubTableCom>
        </div>
      </template>
    </eos-form>
  </div>
</template>

<script setup>
import TopButton from "@/components/TopButton";

import { getPageConfig } from "#/system/page.js";
import { getFormValue , getQueryUrl } from "@/utils";
import { axiosGet } from "#/common";

const emit = defineEmits(["closeModal"]);

const props = defineProps({
  menuID: {
    type: [String, Object],
    default: "",
  },
  isGetDetail: {
    type: Boolean,
    default: false,
  },
  currentData: {},
  activeBtn: {},
  topButton:{}
});

const { proxy } = getCurrentInstance();
const eosFormRef = ref(null);
const topButton = ref([]);
const formConfig = ref([]);
const formData = ref({});
const detail = ref(false);
const labelWidth = ref("100px");
const tableConfig = ref([]);
watch(
  () => props.menuID,
  (value) => {
    if (value) {
      getPageConfig(props.menuID).then((res) => {
        const { COLUMNS, VDEF2, BUTTON, SLOTCFG } = res.RESULT;
        topButton.value = resetButton(BUTTON);
        formConfig.value = COLUMNS;
        formData.value = getFormValue(COLUMNS);
        labelWidth.value = VDEF2 || "100px";
        // console.log("activeBtn", props.activeBtn , );
        if (props.isGetDetail) {
          let detailURL  = SLOTCFG || getQueryUrl(props.topButton);
          getDetail(detailURL);
        }
        nextTick(() => { });
      });
    }
  },
  {
    immediate: true,
  }
);

function resetButton(arr) {
  if (arr.length) {
    return arr;
  }
  let copyBtn = JSON.parse(JSON.stringify(props.activeBtn));
  try {
    let customCF = JSON.parse(copyBtn.PAGEPATH);
    copyBtn.VNAME = customCF.sName;
  } catch (error) { }

  let newBtn = [copyBtn];
  return newBtn;
}

const detailBtn = ref(null)

function getDetail(URL) {
  console.log('URL', URL);
  if (URL == "CurrentData") {
    formData.value = Object.assign(formData.value, props.currentData[0]);
  }else{
    let queryDetail = { ...props.menuID, ...props.currentData[0] }
    axiosGet(URL, queryDetail ).then((res) => {
      formData.value = Object.assign(formData.value, res.RESULT);
    });
  }

  console.log('formData.value', formData.value );

}

function handleBtnEvent(btn) {
  let URL = btn.ACTIONADDRESS;
  let MenuID = { MODULEID: btn.PK_MODULE, PAGEID: btn.PK_PAGE };
  let sdata = { ...formData.value, ...MenuID };
  eosFormRef.value.validate().then((valid) => {
    if (valid) {
      submitEvent(URL, sdata);
    }
  });
}

// 数据提交
function submitEvent(URL, sdata) {
  let newData = JSON.parse(JSON.stringify(sdata));
  delete newData.EnumData;
  delete newData._getDICT;
  axiosGet(URL, sdata).then((res) => {
    let { MESSAGE, SUCCESS } = res;
    if (SUCCESS) {
      proxy.$modal.msgSuccess(MESSAGE);
      emit("closeModal");
    }
  });
}

function reloadTableData(data) {
  console.log(data);
}
</script>

<style lang="scss" scoped>
</style>