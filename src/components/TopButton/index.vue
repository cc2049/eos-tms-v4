<!--
 * @Author: cc2049
 * @Date: 2024-04-28 15:12:29
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-05-15 11:42:01
 * @Description: 简介
-->

<template>
  <div class="button-wrap">

    <div class="top-button">
      <div class="fixed-top-button">
        <div class="flex flex-items-center" v-if="sourceType==1">
          <div class="buttom-item" @click="leftHandleEvent(1)">
            过滤
          </div>
          <div class="buttom-item" @click="leftHandleEvent(2)">
            刷新
          </div>
          <el-divider direction="vertical" />
        </div>

        <template v-for="(itemBtn) in topButton" :key="itemBtn.BILLNO">
          <div class="buttom-item" @click="handleEvent(itemBtn)" :title="itemBtn.BTNTITLE " v-if="setShowBtn(itemBtn) ">
            {{ itemBtn.VNAME }}
          </div>
          <el-dropdown v-else-if="itemBtn.CHILDREN?.length" style="margin: 0 6px" @command="handelEvent" size="large">
            <div class="buttom-item ">
              {{ itemBtn.VNAME }}
              <el-icon class="el-icon--right">
                <arrow-down />
              </el-icon>
            </div>

            <template #dropdown>
              <el-dropdown-menu>
                <template v-for="itemBtnS in itemBtn.CHILDREN" :key="itemBtnS.BILLNO">
                  <el-dropdown-item :command="itemBtnS" v-if=" setShowBtn(itemBtnS)">
                    {{ itemBtnS.VNAME }}
                  </el-dropdown-item>
                </template>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
      </div>

      <div class="top-button-right">
        <div class="tool-wrap">
          <el-icon color="#949eb5" :size="20">
            <Icon icon="tabler:bulb-filled"></Icon>
          </el-icon>
        </div>

        <div class="tool-wrap">
          <el-icon color="#2a4bff" :size="20">
            <Icon icon="ant-design:setting-outlined"></Icon>
          </el-icon>
        </div>
      </div>

    </div>

    <!-- 公共弹窗表单模块 -->
    <vxe-modal destroy-on-close v-model="modalConfig.modalVisible" :width="modalConfig.modalW" :height="modalConfig.modalH" id="formModal" resize storage transfer show-zoom @close="closeModal">
      <template #title>
        <span class="modal-title"> {{ modalConfig.pageTitle  }}
        </span>
      </template>
      <template #default>
        <FormPage :menuID="formID" />
      </template>
    </vxe-modal>
  </div>

</template>

<script setup name="Button">
import { ElMessageBox } from "element-plus";
import { axiosGet } from "#/common";
import { inject, reactive } from "vue";
import { getUrlParams } from "@/utils";

import FormPage from "@/views/formPage/index.vue";

const props = defineProps({
  topButton: {
    type: Array,
  },
  currentData: {
    type: Array,
  },
  treeNode: {},
  sourceType:{ // 1: 表格 2: 表单
    type: [String, Number],
    default: 1
  }
});

const MenuID = inject("menuID");
const formID = ref(null);
// console.log('topButton', props.topButton );
const { proxy } = getCurrentInstance();
const emit = defineEmits(["handleBtnEvent", "reloadTableData"]);

const modalConfig = reactive({
  modalVisible: false,
  modalW: 1000,
  modalH: 600,
  pageTitle: "提示",
});

// 设置是否显示按钮

const setShowBtn = (btn) => {
  if (btn.ISSHOW == 0) return false;
  if (btn.ISSHOW == 2 && btn.OTHER) {
    if (!props.currentData.length) {
      return false;
    }
    try {
      for (var i = 0; i < props.currentData.length; i++) {
        let DATA = props.currentData[i];
        // console.error(evilFn( DATA, btn.OTHER));
        if (!evilFn(DATA, btn.OTHER)) {
          return false;
        }
      }
    } catch (error) {
      console.error(error);
    }

    return true;
  } else if (!btn.CHILDREN || !btn.CHILDREN.length) {
    return true;
  }
};

function leftHandleEvent(type) {
  switch (type) {
    case 1:
      proxy.$emit("filterEvent");
      break;
    case 2:
      proxy.$emit("reloadTableData");
      break;
  }
}

// proxy.$emit("handelEvent", { data, row: null });

// 表格的顶部按钮操作
function handleEvent(data) {
  console.log("handelEvent", data);
  let selectRecords = props.currentData;
  // 表单中的按钮事件直接调
  if(props.sourceType ==2 ){
    return emit('handleBtnEvent', data)
  }

  // 如果弹窗大小的值存在就进行设置弹窗大小  VTYPE =2  7  是开弹窗
  if (data.RATIO) {
    let WWHH =
      data.RATIO != 1 ? data.RATIO.split("*") : data.PAGEPATH.split("*");
  } else {
  }

  // 打开弹窗
  if (
    data.VTYPE == 2 ||
    data.VTYPE == 20 ||
    data.VTYPE == 1 ||
    data.VTYPE == 27
  ) {
    modalConfig.modalVisible = true;
    formID.value = {
      MODULEID: data.PK_MODULE,
      PAGEID: data.PK_PAGE,
    };
    console.log(123, modalConfig);
  } else if (data.VTYPE == 3) {
    //  选中数据并提交
    let dataChoose = props.currentData;

    if (!dataChoose || !dataChoose.length) {
      return proxy.$message.warning("请先选择数据再操作");
    }

    if (data.ISTWOSURE == 1) {
      needConfirm(data, dataChoose);
    } else {
      submitByBtn(data, dataChoose);
    }
  } else if (data.VTYPE == "5") {
    /** 查询方式 提交查询条件参数  */
    let dataChoose = currentData.value;
    if (data.ISCHOOSE == 1) {
      dataChoose = currentData.value[0];
    } else if (data.ISCHOOSE == 2) {
      dataChoose = currentData.value;
    }
    if (data.ISTWOSURE == 1) {
      needConfirm(data, { ...queryJson.value, CHOOSE: dataChoose });
    } else {
      submitByBtn(data, { ...queryJson.value, CHOOSE: dataChoose });
    }
  } else if (data.VTYPE == 7 && data.ACTION == "QRY") {
  } else if (data.VTYPE == 13) {
    //  文件流下载 导出
    let chooseData = currentData.value
      ? currentData.value.map((i) => i.BILLNO).join(",")
      : "";
    let PARENTPAGE = pageConfig.mainTable.length ? routerParams.ACTION : "";
    let UrlData = getUrlParams(data.ACTIONADDRESS);
    let aaDown = {
      APPID: "",
      // DATA: data.ISTWOSURE == 1 ? { BILLNO: currentData.value[0].BILLNO , ...queryJson.value } : {},
      DATA: { CHOOSEBILLNO: chooseData, ...queryJson.value, ...UrlData },
      KEY: "",
      MODULEID: routerParams.BILLNO,
      PAGEID: pageConfig.activeBtn.PK_PAGE,
      PARENTPAGE: PARENTPAGE,
      VERSION: "",
    };
    handleExport(data.ACTIONADDRESS, aaDown);
  } else if (data.VTYPE == 15) {
    // 文件路径下载
    downFilesByUrl(data);
  }
}

// 二次确认事件
function needConfirm(data, selectRecords) {
  ElMessageBox.confirm(`您确定要执行${data.VNAME}吗?`, "确认提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    submitByBtn(data, selectRecords);
  });
}

// 执行按钮提交前的数据格式校验
function submitByBtn(btn, data) {
  let params = btn.ACTIONADDRESS.includes("?")
      ? getUrlParams(btn.ACTIONADDRESS)
      : {},
    sdata = null;
  if (btn.ACTION == "DELETE" || btn.ISCHOOSE == 2) {
    let arr = [];
    if (btn.VTYPE == 20) {
      arr.push(treeNode.value.VALUE);
    } else {
      arr = props.currentData.map((i) => {
        return i.BILLNO;
      });
    }
    sdata = { data: arr };
  } else {
    sdata = { ...data, ...params };
  }
  sdata.MODULEID = btn.PK_MODULE;
  sdata.PAGEID = btn.PK_PAGE;

  submitEvent(btn.ACTIONADDRESS, sdata);
}

// 数据提交
function submitEvent(URL, sdata) {
  axiosGet(URL, sdata).then((res) => {
    let { MESSAGE, SUCCESS } = res;
    if (SUCCESS) {
      proxy.$message({
        message: MESSAGE,
        type: "success",
      });
      emit("reloadTableData");
    }
  });
}

function evilFn(row, fn) {
  const DATA = JSON.parse(JSON.stringify(row)) || Object.create(null);
  let Fn = new Function("DATA", `return ${fn}`);
  const proxy = new Proxy(DATA, {
    has(target, key) {
      return true;
    },
  });
  return Fn(proxy);
}
</script>

<style lang="scss" scoped>
.fixed-top-button {
  display: flex;

  .buttom-item {
    padding: 0 12px;
    font-size: 14px;
    cursor: pointer;
    line-height: 48px;
    color: #515967;
    &:hover {
      color: var(--el-color-primary);
      background-color: #cfddff;
    }
  }
}

.top-button {
  width: 100%;
  display: flex;
  justify-content: space-between;
  background-color: white;
  height: 46px;
  line-height: 46px;
  background: #fff;
  box-shadow: 0px 3px 7px 0px rgba(17, 50, 130, 0.09);
  &-right {
    cursor: pointer;
    display: flex;
    .tool-wrap {
      height: 46px;
      padding: 0 12px;
      line-height: 46px;
      &:hover {
        color: var(--el-color-primary);
        background-color: #cfddff;
      }
    }
  }
}

.font-16 {
  font-size: 16px;
}


</style>
