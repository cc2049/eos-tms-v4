<!--
 * @Author: cc2049
 * @Date: 2024-04-23 11:35:41
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-05-15 11:42:36
 * @Description: 简介
-->

<template>
  <div class="form-container">
    <TopButton :topButton="topButton" sourceType="2" @handleBtnEvent="handleBtnEvent" @reloadTableData="reloadTableData" />
    <div class="mt20 p-10 ">
      <eos-form ref="eosFormRef" v-model="formData" :config="formConfig" :detail="detail" >
        <template #subTable="{ config }" v-if="tableConfig.length > 0">
          <div class="formTable" :style="`margin-left:-${labelWidth}`">
            <SubTableCom :ref="config.FIELD+'Ref'" :key="config.FIELD" :detail="detail || config.ISDISABLED == '1'" :title="config.LABEL" :config="comConfig(config)" v-model:data="formData[config.FIELD]" v-model:mainFormData="formData" :othConfig="othConfig" @EtbaleLinkChange="EtbaleLinkChange"
              @updateTableData="updateTableData">
              <template #modalBtnAfter>
                <slot name="modalBtnAfter" />
              </template>
            </SubTableCom>
          </div>
        </template>
      </eos-form>
    </div>

  </div>
</template>

<script setup>
import TopButton from "@/components/TopButton";

import { getPageConfig } from "#/system/page.js";
import { getFormValue } from "@/utils";

const props = defineProps({
  menuID: {
    type: [String, Object],
    default: "",
  },
});
const eosFormRef = ref(null)
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
        const { COLUMNS, VDEF2, BUTTON } = res.RESULT;
        topButton.value = BUTTON;
        formConfig.value = COLUMNS;
        formData.value = getFormValue(COLUMNS);
        labelWidth.value = VDEF2 || "100px";

        console.log(12, topButton.value, formData.value);

        nextTick(() => {});
      });
    }
  },
  {
    immediate: true,
  }
);


function handleBtnEvent(data){
  console.log(eosFormRef.value);
  eosFormRef.value.validate((valid) => {
    console.log(123, valid,  formData.value);
    if (valid) {
      console.log(123, formData.value);
    }
  });
}

function reloadTableData(data) {
  console.log(data);
}

</script>

<style lang="scss" scoped>
</style>