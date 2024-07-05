<!--
 * @Author: cc2049
 * @Date: 2024-04-28 15:12:29
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-07-05 18:39:43
 * @Description: 简介
-->
<template>
  <div class="button-wrap">

    <div class="top-button" v-if="!isCurrentBtn">
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
          <el-dropdown v-else-if="itemBtn.CHILDREN?.length" style="margin: 0 6px" @command="handelEvent" size="default">
            <div class="buttom-item " @click="handleEvent(itemBtn)">
              {{ itemBtn.VNAME }}
              <el-icon class="el-icon--right">
                <arrow-down />
              </el-icon>
            </div>

            <template #dropdown>
              <el-dropdown-menu>
                <template v-for="itemBtnS in itemBtn.CHILDREN" :key="itemBtnS.BILLNO">
                  <el-dropdown-item class="dropdown-item" :command="itemBtnS" v-if="setShowBtn(itemBtnS)" @click="handleEvent(itemBtnS)">
                    {{ itemBtnS.VNAME }}
                  </el-dropdown-item>
                </template>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <el-divider direction="vertical" v-if="itemBtn.divider" />
        </template>

        <el-divider direction="vertical" />

        <div class="buttom-item" @click="leftHandleEvent(3)">
          退出
        </div>

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

    <slot name="currentBtn" />

    <!-- 公共弹窗表单模块 -->
    <vxe-modal destroy-on-close v-model="modalConfig.modalVisible" :width="modalConfig.modalW" :height="modalConfig.modalH" id="formModal" resize storage transfer show-zoom @close="closeModal">
      <template #title>
        <span class="modal-title"> {{ modalConfig.pageTitle  }}
        </span>
      </template>
      <template #default>
        <template v-if="modalConfig.modalType == 'vtable' ">
          <TablePage ref="TablePageRef" :menuID="formID" dbClickType="emit" @dbClick="TablePagedbClick" />
        </template>

        <template v-else>
          <FormPage :menuID="formID" :currentData="currentData2" @closeModal="closeModal" @refreshTable="refreshTable" :isGetDetail :activeBtn :topButton :isDetail />
        </template>
      </template>
    </vxe-modal>

    <!-- <eos-modal ref="modalRef">
        <template #default>
          <TablePage ref="TablePageRef" :menuID="modalConfig?.page" dbClickType="emit" @dbClick="TablePagedbClick" />
        </template>
        <template #footer>
          <el-button type="info" size="default" @click="closeModal">取消</el-button>
          <el-button type="primary" size="default" @click="handleConfirm">确定</el-button>
        </template>
      </eos-modal> -->

  </div>

</template>

<script setup name="Button">
import { ElMessageBox } from "element-plus";
import { axiosGet } from "#/common";
import { inject, reactive } from "vue";
import { getUrlParams, evalFun } from "@/utils";
import TablePage from "@/views/table/components/SingleTable/index.vue";
import useAlertStore from "@/store/modules/alert";
import usePermissionStore from "@/store/modules/permission";
import usePageParamsStore from "@/store/modules/page";

const pageParamsStore = usePageParamsStore();
const permissionStore = usePermissionStore();
const alertStore = useAlertStore();

const btnMenuRouters = computed(() => permissionStore.btnMenuRouters);

import FormPage from "@/views/formPage/index.vue";

import Workflow from "@/views/workflow/index.vue";
const router = useRouter();
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
  isCurrentBtn: {
    type: Boolean,
    default: false,
  },
  tableData: {
    type: Array,
  },
});
const isDetail = ref(false);
const isGetDetail = ref(false);
const activeBtn = ref(null);

const currentData2 = ref([]);

function closeModal() {
  modalConfig.modalVisible = false;
}

const MenuID = inject("menuID");
const formID = ref(null);
const { proxy } = getCurrentInstance();
// const emit = defineEmits(["handleTopBtn", "reloadTableData"]);
const emit = defineEmits([
  "reloadTableData",
  "quitPage",
  "handleBtnEvent",
  "currentBtn",
]);

const modalConfig = reactive({
  modalW: 1000,
  modalH: 600,
  pageTitle: "提示",
  modalType: "form",
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
    let newIndex = topButton.value.findIndex(
      (i) => i.BILLNO == topButtonExpand.value[parentIndex].GROUPID
    );
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
    if (!props.currentData || !props.currentData.length) {
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

// 条件成立是禁用
const getButtonStatus = (btn, data) => {
  if (btn.ACTION == "EDIT") return false;
  try {
    let DATA = data;
    if (btn.ISCHOOSE == 1) {
      DATA = data[0];
      if (evalFun(DATA, btn.SCRNCONDITION)) {
        return true;
      }
    } else if (btn.ISCHOOSE == 2) {
      if (checkDataSetBtn(btn.SCRNCONDITION, data)) {
        return true;
      }
    }
  } catch (e) {
    return false;
  }
};

// 按钮是多选按钮，对多条数据进行判断条件是否成立
function checkDataSetBtn(tj, data) {
  for (let i = 0, TNTlength = data.length; i < TNTlength; i++) {
    try {
      let DATA = data[i];
      if (evalFun(DATA, tj)) {
        return true;
      }
    } catch (e) {
      return false;
    }
  }
  return false;
}

function leftHandleEvent(type) {
  switch (type) {
    case 1:
      emit("handleTopBtn", { type: "openCustomPlan" });
      break;
    case 2:
      emit("reloadTableData");
      break;
    case 3:
      emit("quitPage");
      break;
  }
}

function refreshTable() {
  emit("reloadTableData");
}

// 表格的顶部按钮操作
function handleEvent(data, row) {
  let selectRecords = row?.length ? row : props.currentData;
  activeBtn.value = data;
  console.log("handelEvent22", data, selectRecords);
  // 表单中的按钮事件直接调
  if (props.sourceType == 2) {
    return emit("handleBtnEvent", data);
  }

  // 验证是否需要选择数据
  if (data.ISCHOOSE && data.ISCHOOSE * 1 > 0 && !selectRecords.length) {
    return alertStore.setAlert({
      show: true,
      title: "没有选择任何数据，请先选择数据！",
      content: "",
      type: "warning",
    });
  }

  if (data.SCRNCONDITION && getButtonStatus(data, selectRecords)) {
    return alertStore.setAlert({
      show: true,
      title: `已选中的数据不允许操作。`,
      content: "",
      type: "warning",
    });
  }

  // 如果弹窗大小的值存在就进行设置弹窗大小  VTYPE =2  7  是开弹窗
  if (data.RATIO) {
    let WWHH =
      data.RATIO != 1 ? data.RATIO.split("*") : data.PAGEPATH.split("*");
  }

  if (data.VTYPE == 1) {
    emit("handleTopBtn", { type: "openCustemPage", btnConf: data });
  } else if (
    // 打开弹窗
    data.VTYPE == 2 ||
    data.VTYPE == 20 ||
    data.VTYPE == 27
  ) {
    if (data.ACTION == "EDIT" || data.ACTION == "DTL") {
      if (!selectRecords.length) {
        return alertStore.setAlert({
          show: true,
          title: "没有选择任何数据，请先选择数据！",
          content: "",
          type: "warning",
        });
      }
      isGetDetail.value = true;
    } else {
      isGetDetail.value = false;
    }
    isDetail.value = data.ACTION == "DTL";

    currentData2.value = selectRecords;
    modalConfig.modalVisible = true;
    modalConfig.pageTitle = data.VNAME;
    formID.value = {
      MODULEID: data.PK_MODULE,
      PAGEID: data.PK_PAGE,
      ACTION: data.ACTION,
    };
  } else if (data.VTYPE == 3) {
    //  选中数据并提交
    let dataChoose = selectRecords;

    if (!dataChoose || !dataChoose.length) {
      return alertStore.setAlert({
        show: true,
        title: "没有选择任何数据，请先选择数据！",
        content: "",
        type: "warning",
      });
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
  } else if (data.VTYPE == 7) {
    // 表格弹窗
    currentData2.value = selectRecords;
    modalConfig.modalVisible = true;
    modalConfig.pageTitle = data.VNAME;
    modalConfig.modalType = "vtable";

    formID.value = {
      MODULEID: data.PK_MODULE,
      PAGEID: data.PK_PAGE,
    };
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
    emit("currentBtn");
  }
  //打开菜单
  if (data.VTYPE == 16) {
    let doType = null,
      Bid = "&";
    if (data.ACTION == "ADD") {
      doType = 0;
      Bid = "&";
    } else if (data.ACTION == "EDIT") {
      doType = 1;
      Bid = selectRecords[0].BILLNO;
    } else if (data.ACTION == "DTL") {
      doType = 2;
      Bid = selectRecords[0].BILLNO;
    } else if (data.ACTION == "COPY") {
      doType = 4;
      Bid = selectRecords[0].BILLNO;
    }

    if (data.ACTION == "EDIT" && data.SCRNCONDITION) {
      let DATA = selectRecords[0];
      if (evalFun(DATA, data.SCRNCONDITION)) {
        doType = 2;
      }
    }

    let btnMenuItem = btnMenuRouters.value.filter((i) =>
      i.fullPath.includes(data.PK_PAGE)
    );
    if (!btnMenuItem.length) {
      return proxy.$modal.msgError("打开的菜单不存在");
    }

    let setPath = btnMenuItem[0].fullPath;
    let newPath = setPath.includes(":id")
      ? setPath.replace(":id", Bid)
      : data.ACTIONADDRESS;
    newPath = newPath.includes(":type")
      ? newPath.replace(":type", doType)
      : newPath;
    // console.log(999, route);
    let billnoArr = props.tableData.map((i) => i.BILLNO);

    pageParamsStore.setPageBillNo({
      menuPath: newPath,
      menuParams: {
        billnoArr: billnoArr,
        parentPath: route.fullPath,
      },
    });

    router.push({
      path: newPath,
      // name: btnMenuItem[0].name ,
      // params: {  arr: billnoArr , parentPath: route.fullPath },
    });
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
    arr = data.map((i) => {
      return i.BILLNO;
    });
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

// 打开详情

function openDeatil(data) {
  let detailBtn = props.topButton.filter((i) => i.ACTION == "DTL")[0];
  handleEvent(detailBtn, data);
  console.log("openDeatil", data);
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

defineExpose({ openDeatil, handleEvent });
</script>

<style lang="scss" scoped>
.fixed-top-button {
  display: flex;
  align-items: center;
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

  .el-icon--right {
    position: relative;
    top: 2px;
  }

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
