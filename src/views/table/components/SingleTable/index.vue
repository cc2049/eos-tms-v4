<!--
 * @Author: cc2049
 * @Date: 2024-04-28 13:10:44
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-06-12 18:28:01
 * @Description: 简介
-->
<template v-if="pageConfig">
  <TopButton ref="topButtonRef" v-model:topButton="topButton" :currentData="currentData" @handleTopBtn="handleTopBtn" @reloadTableData="reloadTableData" />
  <div class="custom-query" ref="AdvancedQuery">
    <AdvanceQuery :queryConfig="pageConfig?.queryConfig" @updateHeight="queryHeight" :customPlan ref="advanceQueryRef" @handleCustomPlan="handleCustomPlan" />
  </div>

  <div class="table-content">
    <!-- 左侧树模块 -->
    <template v-if="pageConfig?.hasTree">
      <div class="tree-wrap" v-show="showZtree">
        <Ztree :treeData :height="tableCFG.height - 50 " :defaultExpandedKeys="defaultExpandedKeys" @treeClick="treeClick" @treeBtnEvent="treeBtnEvent" />
      </div>
      <div class="splitbar-wrap">
        <div class="btn-icon left" @click="handleSplitbar('left')" v-if="showZtree">
          <el-icon :size="18">
            <CaretLeft />
          </el-icon>
        </div>
        <div class="btn-icon right" @click="handleSplitbar('right')">
          <el-icon :size="18">
            <CaretRight />
          </el-icon>
        </div>
      </div>
    </template>
    <!-- 表格主体 -->
    <div class="table-wrap" :class="pageConfig?.hasTree && showZtree ? 'has-tree-table' :'' " v-if="tableCFG">

      <!-- 多主表的页签 -->
      <template v-if="multiMainTable.length">
        <EosTabs :tabsList="multiMainTable" @change="changeTab" />
      </template>

      <div class="main-sub-table flex">
        <div class="left-table " :style="{width: SubLayoutConfig.subLayout==1? SubLayoutConfig.subLayoutLeft : '100%'}">
          <Vxtable ref="VxtableRef" class="bg-white" :tableCFG="tableCFG" :totalData="totalData" :tableData="tableData" :sourceTableData="sourceTableData" @change="tableChange" @dragRow="dragTableRow" @queryEvent="queryEvent" @resetConfig="resetConfig" @filterNameEvent="filterNameEvent"
            @dbClick="dbClickTable">
          </Vxtable>
        </div>
        <div class="right-table ml-6" :style="{width: SubLayoutConfig.subLayoutRight }" v-if="SubLayoutConfig.subLayout==1 && SubTableConfig.length">
          <SubTable ref="SubTableRef" :SubTableConfig :subLayout="SubLayoutConfig.subLayout" :height="tableCFG.height " />
        </div>
      </div>

      <div class="pager-wrap flex flex-items-center" :class=" compType=='VTableSub' && SubTableConfig.length ?'justify-between':'justify-end' ">
        <EosTabs :tabsList="SubTableConfig" @change="changeTab" v-if="compType=='VTableSub' && SubTableConfig.length" />
        <vxe-pager size="mini" class-name="vxe-page-wrap " :page-size="pageInfo.pageSize" :page-sizes="ListPageSize" :current-page="pageInfo.currentPage" :total="pageInfo.totalResult" :layouts="pagerLayouts" @page-change="handlePageChange">
          <template #left>
            <div class="check-acount">
              已选 <span class="waring-color"> {{ currentData.length }} </span> 行
            </div>
          </template>
        </vxe-pager>
      </div>

      <template v-if="compType=='VTableSub' && SubTableConfig.length">
        <SubTable ref="SubTableRef" :SubTableConfig />
      </template>

    </div>
  </div>
</template>



<script setup>
import Vxtable from "@/components/Vxtable";
import TopButton from "@/components/TopButton";
import AdvanceQuery from "@/components/AdvancedQuery/index";
import Ztree from "./../Ztree";
import useTableConifg from "@/hooks/useTableConifg";
import { axiosGet } from "#/common";
import { getUrlParams } from "@/utils";
import EosTabs from "@/components/EosTabs/index.vue";
import SubTable from "./SubTable.vue";
const emit = defineEmits(["openCustemPage", "dbClick"]);
const { proxy } = getCurrentInstance();

const showTablePage = ref(true);

const props = defineProps({
  menuID: {
    type: [String, Object],
    default: "",
  },
  compType: {},
  dbClickType: {
    type: [String, Number],
    default: 1,
  },
});

const VxtableRef = ref(null);
const topButtonRef = ref(null);
const pageConfig = ref(null);
const tableCFG = ref(null);
const tableData = ref([]);
const totalData = ref(null);

const sourceTableData = ref([]);
const treeData = ref([]);
const showZtree = ref(true);
const defaultExpandedKeys = ref([]);

const SubTableConfig = ref([]);
const SubLayoutConfig = ref({
  subLayout: 0,
  subLayoutLeft: "50%",
  subLayoutRight: "50%",
});

const SubTableRef = ref(null);

const currentData = ref([]);

const AdvancedQuery = ref(null);
// const showCustomPlan = ref(false);
const customPlan = ref([]);

const pageInfo = reactive({
  currentPage: 1,
  pageSize: 10,
  totalResult: 0,
  sortName: "",
  sortOrder: "",
});
const pagerLayouts = ref([
  "FullJump",
  "PrevJump",
  "PrevPage",
  "Number",
  "NextPage",
  "NextJump",
  "Sizes",
  "Total",
]);
const ListPageSize = ref([10, 20, 30, 50, 100, 500, 1000]);

const handleSplitbar = () => {
  showZtree.value = !showZtree.value;
};

const activeTabsIndex = ref(0);
const activeTabs = ref(null);

const changeTab = (e) => {
  activeTabsIndex.value = e.index;
  activeTabs.value = e.data;
  pageConfig.value = e.data;
  tableCFG.value = e.data.tableCFG;
  setPageConfig();
  getTableData();
};

// 表格内部的多选事件，顶部筛选排序事件, 超链接事件

function tableChange(data) {
  // console.log("tableChange", data);
  if (data.clicktype == "sort") {
    pageInfo.sortName = data.data.sortBy;
    pageInfo.sortOrder = data.data.sort;
    getTableData();
  } else if (data.clicktype == "detail") {
    formModalTableCFG.value.tableBillNo = data.data.BILLNO;
    currentData.value = data.data;
    //承运商评价模板详情
    if (
      detailBtnCFG.value.VTYPE == 21 &&
      detailBtnCFG.value.PAGEPATH == "type:cyspjmb"
    ) {
      reportFromData.value.moduleid = detailBtnCFG.value.PK_MODULE;
      reportFromData.value.pageid = detailBtnCFG.value.PK_PAGE;
      reportFromData.value.type = 2;
      reportFromData.value.billno = data.data.BILLNO;
    }
    handelEvent({ data: detailBtnCFG.value, row: data.data });
  } else if (data.clicktype == "checkbox") {
    currentData.value = data.data;
    if (
      (props.compType == "VTableZtree" || props.compType == "VTableSub") &&
      SubTableConfig.value.length
    ) {
      SubTableRef.value.getSubData(currentData.value);
    }
    // let expandRow = getRowExpandRecords()
  }

  // 超链接点击事件
  if (data.clicktype == "openLink") {
    currentData.value = [data.data];
    let getLinkBtn = topButton.value.filter((i) => {
      return i.BILLNO == data.linkCFG;
    });
    getLinkBtn.length
      ? topButtonRef.value.handleEvent( getLinkBtn[0],  currentData.value)
      : null;
  }
  // if (data.clicktype == "openDrawer") {
  //   colDrawer.value = true;
  // } else {
  //   currentData.value = data.data;
  // }

  // // 表格点击事件
  // if (data.clicktype == "clinkBTN") {
  //   handelEvent({ data: data.linkCFG, row: data.data });
  // }
}

function reloadTableData() {
  pageInfo.currentPage = 1;
  queryJSON.value.PAGENUM = 1;
  queryJSON.value.PK_CLASS = "";
  if (pageConfig.value.hasTree) {
    getTreeData();
  } else {
    getTableData();
  }
}
const advanceQueryRef = ref(null);
function handleTopBtn(data) {
  if (data.type == "openCustomPlan") {
    advanceQueryRef.value.clostPopver(); // 关闭设置的弹窗
    advanceQueryRef.value.openShowModal();
  } else if (data.type == "openCustemPage") {
    console.log("handleTopBtn", data , currentData.value);
    emit("openCustemPage", {
      data: data,
      path: data.btnConf.PAGEPATH,
      row: currentData.value,
    });
  } else {
    handelEvent({ data: data, row: currentData.value });
  }
}

function treeClick(data) {
  pageInfo.currentPage = 1;
  queryJSON.value.PAGENUM = 1;
  queryJSON.value.PK_PARENT = data.VALUE;
  queryJSON.value.PK_CLASS = data.VALUE;
  getTableData();
}

function filterNameEvent(data) {
  let copyTableData = JSON.parse(JSON.stringify(sourceTableData.value));
  let id = data.config.FIELD,
    checkList = data.checkList;

  let newTableData = copyTableData.filter((item) => {
    return checkList.includes(item[id]);
  });
  tableData.value = newTableData;
  pageInfo.totalResult = newTableData.length;
}

// 分页点击
function handlePageChange({ currentPage, pageSize }) {
  pageInfo.currentPage = currentPage;
  pageInfo.pageSize = pageSize;
  queryJSON.value.PAGESIZE = pageSize;
  getTableData();
}

const dragTableRow = ({ row, $rowIndex }) => {
  console.log(row, $rowIndex);
};

const ztreeQUERYS = ref({
  FIELD: "PK_CLASS",
  QUERYTYPE: "EqualTo",
  DEFAULTVAL: "",
  SORTCODE: "",
});

const getTableData = () => {
  // console.log(999, tableCFG.value);
  tableCFG.value.loading = true;
  queryJSON.value.PAGENUM = pageInfo.currentPage;
  queryJSON.value.SORTNAME = pageInfo.sortName;
  queryJSON.value.REVERSE = pageInfo.sortOrder;

  if (multiMainTable.value.length) {
    queryJSON.value.MODULEID = activeTabs.value.pageID.MODULEID;
    queryJSON.value.PAGEID = activeTabs.value.pageID.PAGEID;
  }

  if (pageConfig.value.hasTree) {
    ztreeQUERYS.value.DEFAULTVAL = queryJSON.value.PK_CLASS || "";
    let hasPK_CLASS = queryJSON.value.QUERYS?.findIndex(
      (item) => item.FIELD == "PK_CLASS"
    );
    hasPK_CLASS < 0
      ? queryJSON.value.QUERYS?.push(ztreeQUERYS.value)
      : (queryJSON.value.QUERYS[hasPK_CLASS] = ztreeQUERYS.value);
  }

  axiosGet(queryURL.value, queryJSON.value)
    .then((res) => {
      currentData.value = [];
      tableCFG.value.loading = false;
      if (Array.isArray(res.RESULT)) {
        tableData.value = res.RESULT;
        pageInfo.totalResult = res.RESULT.length;
      } else {
        const { RECORDS, TOTAL, TOTALDATA } = res.RESULT;
        tableData.value = RECORDS;
        totalData.value = TOTALDATA ? JSON.parse(TOTALDATA) : {};
        pageInfo.totalResult = TOTAL;
      }
      sourceTableData.value = JSON.parse(JSON.stringify(tableData.value));
    })
    .catch(() => {
      tableCFG.value.loading = false;
      // console.log(res.RESULT);
    })
    .catch(() => {
      tableCFG.value.loading = false;
    });
};

function getTreeData() {
  let params = getUrlParams(pageConfig.value.treeQueryUrl);
  let data = {
    KEYWORD: "",
    ...params,
    PAGENUM: 1,
    TYPE: "1",
    PAGESIZE: 10000,
    SORTNAME: "",
    SORTORDER: "",
    ...props.menuID,
  };
  axiosGet(pageConfig.value.treeQueryUrl, data).then((res) => {
    treeData.value = res.RESULT;
    defaultExpandedKeys.value = res.RESULT.map((i) => i.BILLNO);
    getTableData();
  });
}

const queryURL = ref(null);
const queryJSON = ref({});
const topButton = ref([]);
const treeButton = ref([]);
const multiMainTable = ref([]);

const { getConfig } = useTableConifg(props.menuID);

// 重置页面相关配置

const setPageConfig = () => {
  topButton.value = pageConfig.value.topButton;
  treeButton.value = pageConfig.value.treeButton;
  queryURL.value = pageConfig.value.queryUrl;
  queryJSON.value = pageConfig.value.queryJson;
  customPlan.value = pageConfig.value.customPlan;
  SubTableConfig.value = pageConfig.value.subTable;
  SubLayoutConfig.value = pageConfig.value.subConfig;
  let getConfigPager = tableCFG.value.pagerConfig;
  pageInfo.pageSize = getConfigPager.pageSize || 10;
  queryJSON.value.PAGESIZE = pageInfo.pageSize;
  queryJSON.value.QUERYS = [];
  let customPlanDefa = pageConfig.value.customPlan.filter(
    (i) => i.ISDEFAULT == "1"
  );
  queryJSON.value.PROGRAMID = customPlanDefa.length
    ? customPlanDefa[0].BILLNO
    : "";
  nextTick(() => {
    resetHeight();
  });
};

watch(
  () => props.menuID,
  (value) => {
    if (value) {
      getConfig().then((res) => {
        // console.log(888, res);
        if (Array.isArray(res.pageConfig)) {
          multiMainTable.value = res.pageConfig;
          activeTabs.value = multiMainTable.value[0];
          pageConfig.value = multiMainTable.value[0];
          tableCFG.value = pageConfig.value.tableCFG;
        } else {
          pageConfig.value = res.pageConfig;
          tableCFG.value = pageConfig.value.tableCFG;
        }
        setPageConfig();
        if (pageConfig.value.hasTree) {
          getTreeData();
        } else {
          getTableData();
        }
      });
    }
  },
  {
    immediate: true,
  }
);

/*
 * 重新设置相关高度
 */
function resetHeight() {
  let newTBHeight =
    window.innerHeight - 160 - AdvancedQuery.value?.clientHeight;
  if (props.compType == "VTableSub" && SubTableConfig.value.length) {
    let subHeight = SubTableConfig.value[0].TABLEHEIGHT * 1 || 120;
    newTBHeight -= subHeight;
  }
  if (multiMainTable.value.length) {
    newTBHeight -= 40;
  }
  tableCFG.value.height = newTBHeight;
}

function queryHeight() {
  nextTick(() => {
    resetHeight();
  });
}

//
function handleCustomPlan(data) {
  queryJSON.value.PROGRAMID = data.PROGRAMID;
  queryJSON.value.QUERYS = data.QUERYS || [];
  pageConfig.value?.hasTree ? getTreeData() : getTableData();
}

function resetConfig(data) {
  // let index = tableCFG.value.tableColumns.findIndex((i) => i.FIELD == data.id);
  // tableCFG.value.tableColumns[index] = data.isShow

  // let newTableCol = JSON.parse(JSON.stringify(tableCFG.value.tableColumns)) ;
  // tableCFG.value.tableColumns = [];
  // tableCFG.value.tableColumns = newTableCol;

  // VxtableRef.value.refreshColumn();
  console.log("resetConfig", tableCFG.value.tableColumns);
}

/*
 * 左侧树按钮点击事件
 */
function treeBtnEvent(data) {
  let addBtn = treeButton.value.filter((i) => i.ACTION == "ADD");
  let editBtn = treeButton.value.filter((i) => i.ACTION == "EDIT");
  let deleteBtn = treeButton.value.filter((i) => i.ACTION == "DELETE");
  let btnCfg = null;

  if (data.type > 1 && !queryJSON.value.PK_CLASS) {
    return proxy.$modal.msgError("请先选择分组");
  }
  if (data.type == 1) {
    if (!addBtn.length) return proxy.$modal.msgError("您没有权限");
    btnCfg = addBtn[0];
  } else if (data.type == 2) {
    if (!editBtn.length) return proxy.$modal.msgError("您没有权限");
    btnCfg = editBtn[0];
  } else if (data.type == 3) {
    if (!deleteBtn.length) return proxy.$modal.msgError("您没有权限");
    btnCfg = deleteBtn[0];
    btnCfg.VTYPE = 3;
  }
  topButtonRef.value.handleEvent(btnCfg, [
    { BILLNO: queryJSON.value.PK_CLASS },
  ]);
}

function dbClickTable(data) {
  if (props.dbClickType == 1) {
    topButtonRef.value.openDeatil([data]);
  } else {
    emit("dbClick", data);
  }
  console.log("dbClickTable", props.dbClickType, data);
}

function getCheckRows() {
  return currentData.value;
}

defineExpose({ getCheckRows });

onMounted(() => {
  window.onresize = function onresize() {
    resetHeight();
  };
});
</script>


<style lang="scss" scoped>
.vxe-page-wrap {
  background-color: #fafcff;
}

.splitbar-wrap {
  position: relative;
  width: 12px;
  background-color: #f3f3f4;
  &:hover {
    background-color: var(--el-color-primary-light-8);
  }
  .btn-icon {
    border: 1px solid var(--border-color-jdy);
    width: 12px;
    height: 32px;
    line-height: 32px;
    box-sizing: border-box;
    position: absolute;
    background-color: white;
    color: #9da7bb;
    &:hover {
      background-color: var(--el-color-primary-light-2);
      color: #fff;
      cursor: pointer;
    }
  }

  .left {
    top: 42%;
    border-radius: 8px 0 0 8px;
    .el-icon {
      position: absolute;
      right: -6px;
      top: 6px;
    }
  }
  .right {
    top: 50%;
    text-align: left;
    border-radius: 0 8px 8px 0;
    .el-icon {
      position: absolute;
      left: -6px;
      top: 6px;
    }
  }
}

.table-content {
  width: 100%;
  display: flex;
  .tree-wrap {
    width: 280px;
  }
  .table-wrap {
    width: 100%;
  }
  .has-tree-table {
    width: calc(100% - 280px) !important;
  }
}
</style>

