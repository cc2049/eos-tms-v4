<!--
 * @Author: cc2049
 * @Date: 2024-04-23 11:35:41
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-07-11 18:51:43
 * @Description: 大表单组件
-->

<template>
  <div class="form-container bg-white" ref="formBoxRef">
    <div class="form-affix" ref="affixRef">
      <TopButton :topButton="topButton" sourceType="2" @handleBtnEvent="handleBtnEvent" @quitPage="quitPage" />
      <div id="eos-form-tabs"></div>
    </div>
    <el-scrollbar :height="formHeight" class="eos-scrollbar">
      <MasterForm ref="eosFormRef" v-model="formData" :formConfig="formConfig" :labelWidth :ctrlWidth :detail="isDetail"
        :tableConfig="tableConfig" :loading="formLoading" @labelClick="LabelClick" />
    </el-scrollbar>
  </div>
</template>

<script setup>
import TopButton from "@/components/TopButton";
import MasterForm from "@/components/MasterForm/index.vue";
import { getPageConfig , upNextBtn } from "#/system/page.js";
import { getFormValue, getQueryUrl, getUrlParams, eosObjAssign } from "@/utils";
import { axiosGet } from "#/common";

import useModalStore from "@/store/modules/modal";
import usePageParamsStore from "@/store/modules/page";
const modalStore = useModalStore();
const pageParamsStore = usePageParamsStore();


const tableBillNo = computed(() => {
  return pageParamsStore.pageBillNo;
});

const router = useRouter();
const route = useRoute();

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
const ctrlWidth = ref("");
const tableConfig = ref([]);
const pageHeight = computed(() => {
  return formBoxRef.value.parentNode.clientHeight;
});
const formHeight = computed(() => {
  if (formBoxRef.value) {
    const formScrollHeight =
      pageHeight.value - affixRef.value.clientHeight - 10;
    const windowScrollHeight =
      window.innerHeight - 80 - affixRef.value.clientHeight;
    return `${formScrollHeight < 0 ? windowScrollHeight : formScrollHeight}px`;
  }
});
const formLoading = ref(false);
const detailURL = ref("");
const detailID = ref(null);


watch(
  () => props.menuID,
  (value) => {
    if (value) {
      getPageConfig(props.menuID).then((res) => {
        const { COLUMNS, LABELWIDTH, FIELDWIDTH, BUTTON, SLOTCFG, SUBTABLE } =
          res.RESULT;
        topButton.value = resetButton(BUTTON);
        formConfig.value = COLUMNS;
        formData.value = getFormValue(COLUMNS);
        labelWidth.value = LABELWIDTH || "100px";
        ctrlWidth.value = FIELDWIDTH;
        tableConfig.value = SUBTABLE;
        formLoading.value = true;
        if (props.isGetDetail) {
          detailURL.value = SLOTCFG || getQueryUrl(props.topButton);
          detailID.value = props.currentData[0].BILLNO;
          detailURL.value ? getDetail() : null;
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
  let resButton = [];
  if (arr.length) {
    resButton = arr;
  } else if (!props.activeBtn) {
    resButton = [];
  } else {
    let copyBtn = JSON.parse(JSON.stringify(props.activeBtn));
    try {
      let customCF = JSON.parse(copyBtn.PAGEPATH);
      copyBtn.VNAME = customCF.sName;
    } catch (error) { }
    resButton = [copyBtn];
  }
  if (props.menuID.ACTION != "ADD") {
    resButton[resButton.length - 1].divider = true;
    resButton = [...resButton, ...upNextBtn];
  }
  return resButton;
}

function getDetail() {
  if (detailURL.value == "CurrentData") {
    formData.value = Object.assign(formData.value, props.currentData[0]);
  } else {
    let urlParams = getUrlParams(detailURL.value)
    let queryDetail = { ...props.menuID, BILLNO: detailID.value, ...urlParams };
    axiosGet(detailURL.value, queryDetail).then((res) => {
      formData.value = eosObjAssign(formData.value, res.RESULT);
      formLoading.value = false;
      if (route.params && Object.keys(route.params).length) {
        let { type } = route.params;
        if (type == "4") {
          delete formData.value.BILLNO;
        }
      }
    });
  }
}

const quitPage = () => {
  emit("closeModal");
};


const formBtnAct = ['PREV', 'FIRST', 'NEXT', 'FINAL', 'LIST',]


function handleBtnEvent(btn) {
  if (formBtnAct.includes(btn.ACTION)) {
    return CustomEvent(btn)
  }
  let URL = btn.ACTIONADDRESS;
  let params = getUrlParams(URL);
  let MenuID = { MODULEID: btn.PK_MODULE, PAGEID: btn.PK_PAGE };
  eosFormRef.value.validate().then((valid) => {
    if (valid) {
      if (btn.BTNTITLE == "getCurrentData") {
        // 竞价大厅货主端的发布公告中提交按钮要的参数
        let sdata = {
          ...formData.value,
          ...MenuID,
          ...params,
          PK_PROJECT: props.currentData[0].BILLNO,
          PROJECTNAME: props.currentData[0].VNAME,
        };
        submitEvent(URL, sdata);
      } else {
        let sdata = { ...formData.value, ...MenuID, ...params };
        submitEvent(URL, sdata);
      }
    }
  });
}


function CustomEvent(btn) {
  let { ACTION } = btn;
  let newID = tableBillNo.value[route.fullPath].billnoArr
  let currentIDIndex = newID.findIndex((item) => item == detailID.value);
  if(currentIDIndex==0 && ACTION == "PREV"){
    return proxy.$modal.msgError("当前为第一条数据，无法切换");
  }else if(currentIDIndex== newID.length-1 && ACTION == "NEXT"){
    return proxy.$modal.msgError("当前为最后一条数据，无法切换");
  }
  if (ACTION == "PREV") {
    detailID.value = newID[currentIDIndex - 1]
  } else if (ACTION == "FIRST") {
    detailID.value = newID[0]
  } else if (ACTION == "NEXT") {
    detailID.value = newID[currentIDIndex + 1]
  } else if (ACTION == "FINAL") {
    detailID.value = newID[newID.length - 1]
  } else if (ACTION == "LIST") {
    return router.push({
      path: tableBillNo.value[route.fullPath].parentPath
    })
  }
  getDetail();
}

function LabelClick(val) {
  console.log("labelClick", val);
  let title = val.config.LABEL
  modalStore.setModal({
    title: title ,
    config: val,
    type:'vtable'
  })

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