<!--
 * @Author: cc2049
 * @Date: 2024-04-28 15:12:29
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-05-21 11:52:28
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
          <el-icon color="#949eb5" :size="22" style="top:3px"> 
            <Icon icon="tabler:bulb-filled"></Icon>
          </el-icon>
        </div>
        <vxe-pulldown ref="pulldownRef" destroy-on-close>
          <template #default>
            <div class="tool-wrap" @click="openPulldown">
              <el-icon color="#2a4bff" :size="20" style="top:4px">
                <Icon icon="ant-design:setting-outlined"></Icon>
              </el-icon>
            </div>
          </template>
          <template #dropdown>
            <div class="my-dropdown3">
              <el-scrollbar :height="300">
                <vxe-checkbox-group v-model="checkList" class="column-list" @change="checkboxChange" style="display: flex;flex-direction: column;junt-content: flex-start;">
                  <template v-for="item in topButton" :key="item.BILLNO">
                    <vxe-checkbox style="margin-left:0;margin-bottom:10px" :content="item.VNAME" :label="item.BILLNO" />
                    <template v-if="item.CHILDREN?.length">
                      <vxe-checkbox style="margin-left:20px;margin-bottom:10px" :content="item2.VNAME" :label="item2.BILLNO" v-for="(item2) in item.CHILDREN" :key="item2.BILLNO" />
                    </template>
                  </template>
                </vxe-checkbox-group>
              </el-scrollbar>

            </div>
          </template>
        </vxe-pulldown>

      </div>

    </div>

    <!-- 公共弹窗表单模块 -->
    <vxe-modal destroy-on-close v-model="modalConfig.modalVisible" :width="modalConfig.modalW" :height="modalConfig.modalH" id="formModal" resize storage transfer show-zoom @close="closeModal">
      <template #title>
        <span class="modal-title"> {{ modalConfig.pageTitle  }}
        </span>
      </template>
      <template #default>
        <FormPage :menuID="formID" @closeModal="closeModal" :isGetDetail :currentData :activeBtn :topButton />
      </template>
    </vxe-modal>


  </div>

</template>

<script setup name="Button">
import { ElMessageBox } from "element-plus";
import { axiosGet } from "#/common";
import { inject, reactive } from "vue";
import { getUrlParams } from "@/utils";
import { getFormValue, getFormRule } from "@/utils";

import FormPage from "@/views/formPage/index.vue";

import Workflow from "@/views/workflow/index.vue";

const route = useRoute();
const topButton = defineModel("topButton");
const props = defineProps({
  currentData: {
    type: Array,
  },
  treeNode: {},
  sourceType: {
    // 1: 表格 2: 表单
    type: [String, Number],
    default: 1,
  },
});





const isGetDetail = ref(false);
const activeBtn = ref(null);
function closeModal() {
  modalConfig.modalVisible = false;
}



const MenuID = inject("menuID");
const formID = ref(null);
const { proxy } = getCurrentInstance();
// const emit = defineEmits(["handleTopBtn", "reloadTableData"]);
const emit = defineEmits([ "reloadTableData"]);


const modalConfig = reactive({
  modalW: 1000,
  modalH: 600,
  pageTitle: "提示",
});

// 打开按钮
const checkList = ref([]);
const pulldownRef = ref(null);
const topButtonExpand = ref([]);

function openPulldown() {
  checkList.value = topButton.value
    .filter((i) => i.ISSHOW == 1)
    .map((i) => i.BILLNO);
  const $pulldown = pulldownRef.value;
  topButtonExpand.value = treeToArray(topButton.value);
  if ($pulldown) {
    $pulldown.togglePanel();
  }
}
function checkboxChange(e) {
  let index = topButton.value.findIndex((i) => i.BILLNO == e.label);
  if (index > 0) {
    topButton.value[index].ISSHOW = e.value ? "1" : "0";
  } else {
    let parentIndex = topButtonExpand.value.findIndex(
      (i) => i.BILLNO == e.label
    );
    let newIndex = topButton.value.findIndex((i) => i.BILLNO == topButtonExpand.value[parentIndex].GROUPID);
    let subIndex = topButton.value[newIndex].CHILDREN.findIndex(
      (i) => i.BILLNO == e.label
    );
    topButton.value[newIndex].CHILDREN[subIndex].ISSHOW = e.value ? "1" : "0";
  }
}

// 扁平化树
function treeToArray(tree) {
  let res = [];
  for (const item of tree) {
    const { CHILDREN, ...i } = item;
    if (CHILDREN && CHILDREN.length) {
      res = res.concat(treeToArray(CHILDREN));
    }
    res.push(i);
  }
  return res;
}

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
      emit("handleTopBtn", { type: "openCustomPlan" });
      break;
    case 2:
      emit("reloadTableData");
      break;
  }
}

// proxy.$emit("handelEvent", { data, row: null });

// 表格的顶部按钮操作
function handleEvent(data) {
  console.log("handelEvent", data);
  let selectRecords = props.currentData;

  activeBtn.value = data;
  // 表单中的按钮事件直接调
  if (props.sourceType == 2) {
    return emit("handleBtnEvent", data);
  }

  // 如果弹窗大小的值存在就进行设置弹窗大小  VTYPE =2  7  是开弹窗
  if (data.RATIO) {
    let WWHH =
      data.RATIO != 1 ? data.RATIO.split("*") : data.PAGEPATH.split("*");
  } else {
  }

  if( data.VTYPE == 1){
    if (data.PK_PAGE && data?.PK_PAGE == "slot") {
      emit("handleTopBtn", { type: "openCustemPage",btnConf:data });

    } 

  }else 
  
  if (// 打开弹窗
    data.VTYPE == 2 ||
    data.VTYPE == 20 ||
    data.VTYPE == 27
  ) {
    if (data.ACTION == "EDIT") {
      if (!props.currentData.length) {
        return proxy.$message.warning("请先选择数据再操作");
      }
      isGetDetail.value = true;
    }
    modalConfig.modalVisible = true;
    formID.value = {
      MODULEID: data.PK_MODULE,
      PAGEID: data.PK_PAGE,
    };
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
  } else if (data.VTYPE == 21) {
    console.log(selectRecords);
    
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
    // sdata = { ...data, ...params };
    sdata = {
      CHOOSEDATA: Array.isArray(data) ? data : [data],
      // ...data,
      ...params,
    };
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

.my-dropdown3 {
  width: 200px !important;
  position: relative;
  left: -155px;
  padding: 5px 0 0 10px;
  border: 1px solid var(--el-border-color);
  z-index: 10000;
  background-color: #fff;
}

.font-16 {
  font-size: 16px;
}
</style>
