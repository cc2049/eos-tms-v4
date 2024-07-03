<!--
 * @Author: cc2049
 * @Date: 2024-04-23 11:35:41
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-07-03 16:45:55
 * @Description: 大表单组件
-->

<template>
  <div class="form-container bg-white" ref="formBoxRef">
    <div class="form-affix" ref="affixRef">
      <TopButton :topButton="topButton" sourceType="2" @handleBtnEvent="handleBtnEvent" @quitPage="quitPage" />
      <div id="eos-form-tabs"></div>
    </div>
    <el-scrollbar :height="formHeight" class="eos-scrollbar">
      <MasterForm ref="eosFormRef" v-model="formData" :formConfig="formConfig" :detail="isDetail" :tableConfig="tableConfig" :loading="formLoading" @labelClick="LabelClick" />
    </el-scrollbar>
  </div>
</template>

<script setup>
import TopButton from "@/components/TopButton";
import MasterForm from "@/components/MasterForm/index.vue";
import { getPageConfig } from "#/system/page.js";
import { getFormValue, getQueryUrl, getUrlParams , eosObjAssign } from "@/utils";
import { axiosGet } from "#/common";
const route = useRoute();
const routerParams = route.meta;
console.log('route',  route);
const props = defineProps({
  menuID: {
    type: [String, Object],
    default: "",
  },
  isDetail: {
    type: Boolean,
    default: false,
  },
  isGetDetail: {
    type: Boolean,
    default: false,
  },
  currentData: {},
  activeBtn: {},
  topButton: {},
});
const emit = defineEmits(["closeModal", "refreshTable"]);

const { proxy } = getCurrentInstance();
const formBoxRef = ref(null);
const affixRef = ref(null);
const eosFormRef = ref(null);
const topButton = ref([]);
const formConfig = ref([]);
const formData = ref({});
const detail = ref(false);
const labelWidth = ref("100px");
const tableConfig = ref([]);
const formHeight = computed(() => {
  if (formBoxRef.value) {
    const formScrollHeight = formBoxRef.value.clientHeight - affixRef.value.clientHeight - 10
    const windowScrollHeight = window.innerHeight - 115 - affixRef.value.clientHeight
    return `${formScrollHeight < 0 ? windowScrollHeight : formScrollHeight}px`
  }
});
const formLoading = ref(false);

watch(
  () => props.menuID,
  (value) => {
    if (value) {
      getPageConfig(props.menuID).then((res) => {
        const { COLUMNS, VDEF2, BUTTON, SLOTCFG, SUBTABLE } = res.RESULT;
        topButton.value = resetButton(BUTTON);
        formConfig.value = COLUMNS;
        formData.value = getFormValue(COLUMNS);
        labelWidth.value = VDEF2 || "100px";
        tableConfig.value = SUBTABLE;
        formLoading.value = true;
        if (props.isGetDetail) {
          let detailURL = SLOTCFG || getQueryUrl(props.topButton);
          detailURL ? getDetail(detailURL) : null;
        } else {
          formLoading.value = false;
        }
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
  } else if (!props.activeBtn) {
    return [];
  }

  let copyBtn = JSON.parse(JSON.stringify(props.activeBtn));
  try {
    let customCF = JSON.parse(copyBtn.PAGEPATH);
    copyBtn.VNAME = customCF.sName;
  } catch (error) { }

  let newBtn = [copyBtn];
  return newBtn;
}

const detailBtn = ref(null);

function getDetail(URL) {
  if (URL == "CurrentData") {
    formData.value = Object.assign(formData.value, props.currentData[0]);
  } else {
    let queryDetail = { ...props.menuID, ...props.currentData[0] };
    axiosGet(URL, queryDetail).then((res) => {
      formData.value = eosObjAssign(formData.value, res.RESULT);
      formLoading.value = false;
      if (route.params && Object.keys(route.params).length) {
         let { type } = route.params;
         if(type == '4'){
          delete formData.value.BILLNO
         }
      }
    });
  }
}

const quitPage = () => {
  emit('closeModal')
}

function handleBtnEvent(btn) {
  let URL = btn.ACTIONADDRESS;
  let params = getUrlParams(URL)
  let MenuID = { MODULEID: btn.PK_MODULE, PAGEID: btn.PK_PAGE };
  eosFormRef.value.validate().then((valid) => {
    if (valid) {
      if (btn.BTNTITLE == 'getCurrentData') {  // 竞价大厅货主端的发布公告中提交按钮要的参数
        let sdata = { ...formData.value, ...MenuID, ...params, PK_PROJECT: props.currentData[0].BILLNO, PROJECTNAME: props.currentData[0].VNAME };
        submitEvent(URL, sdata);
      } else {
        let sdata = { ...formData.value, ...MenuID, ...params };
        submitEvent(URL, sdata);
      }
    }
  });
}

function LabelClick(val) {
  console.log("labelClick", val);
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
      emit("refreshTable");
    }
  });
}


</script>

<style lang="scss" scoped>
.form-affix {
  position: sticky;
  top: 0;
  z-index: 100;
}
</style>