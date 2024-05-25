<!--
 * @Author: cc2049
 * @Date: 2024-04-28 13:10:44
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-05-25 08:54:23
 * @Description: 简介
-->
<template v-if="pageConfig">
  <TopButton v-model:topButton="topButton" :currentData="currentData" @handleTopBtn="handleTopBtn" @reloadTableData="reloadTableData" />
  <div class="custom-query" ref="AdvancedQuery">
    <AdvanceQuery :queryConfig="pageConfig?.queryConfig" @updateHeight="queryHeight" :customPlan ref="advanceQueryRef" @handleCustomPlan="handleCustomPlan" />
  </div>

  <div class="table-content">
    <!-- 左侧树模块 -->
    <template v-if="pageConfig?.hasTree">
      <div class="tree-wrap" v-show="showZtree">
        <Ztree :treeData :height="tableCFG.height - 50 " :defaultExpandedKeys="defaultExpandedKeys" @treeClick="treeClick" />
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

      <!-- <el-tabs :tab-position="tabPosition" class="demo-tabs" v-model="mainActive" @tab-click="handleMainTabsClick">
        <el-tab-pane :label="item.VNAME" v-for="(item, index) in pageConfig.mainTable" :key="index" :name="index">
        </el-tab-pane>
      </el-tabs> -->

      <Vxtable ref="VxtableRef" class="bg-white" :tableCFG="tableCFG" :tableData="tableData" @change="tableChange" @dragRow="dragTableRow" @queryEvent="queryEvent" @resetConfig="resetConfig" @dbClick="dbClickTable">
      </Vxtable>

      <div class="pager-wrap flex flex-items-center" :class=" compType=='VTableSub'?'justify-between':'justify-end' ">
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

const emit = defineEmits(["openCustemPage","dbClick"]);

const props = defineProps({
  menuID: {
    type: [String, Object],
    default: "",
  },
  compType: {},
});

const VxtableRef = ref(null);

const pageConfig = ref(null);
const tableCFG = ref(null);
const tableData = ref([]);
const treeData = ref([]);
const showZtree = ref(true);
const defaultExpandedKeys = ref([]);

const SubTableConfig = ref([]);

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

// 表格内部的多选事件，顶部筛选排序事件, 超链接事件

function tableChange(data) {
  console.log("tableChange", data.data);
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
    if (props.compType == "VTableSub" && SubTableConfig.value.length) {
      SubTableRef.value.getSubData(currentData.value);
    }
    // let expandRow = getRowExpandRecords()
  }
  // if (data.clicktype == "openLink") {
  //   // 超链接点击事件
  //   formModalTableCFG.value.tableBillNo = data.data.BILLNO;

  //   currentData.value = data.data;

  //   if (data.linkCFG.includes("?") && data.linkCFG.includes(":")) {
  //     // 如果配置了三元运算
  //     let currentLinkCFG = getEvalValue(data.data, data.linkCFG);
  //     let getLinkBtn = pageConfig.initButton.filter((i) => {
  //       return i.BILLNO == currentLinkCFG;
  //     });
  //     // currentData.value = data.data;
  //     getLinkBtn.length
  //       ? handelEvent({ data: getLinkBtn[0], row: data.data })
  //       : null;
  //   } else {
  //     let getLinkBtn = pageConfig.initButton.filter((i) => {
  //       return i.BILLNO == data.linkCFG;
  //     });
  //     // currentData.value = data.data;
  //     getLinkBtn.length
  //       ? handelEvent({ data: getLinkBtn[0], row: data.data })
  //       : null;
  //   }
  // }
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
  getTableData();
}
const advanceQueryRef = ref(null);
function handleTopBtn(data) {
  console.log(666, data);
  if (data.type == "openCustomPlan") {
    advanceQueryRef.value.openShowModal();
  }
   else if(data.type == "openCustemPage"){
    emit("openCustemPage",{data:data,row: currentData.value})
  } 
  else {
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

const getTableData = () => {
  tableCFG.value.loading = true;
  queryJSON.value.PAGENUM = pageInfo.currentPage;
  queryJSON.value.SORTNAME = pageInfo.sortName;
  queryJSON.value.REVERSE = pageInfo.sortOrder;
  axiosGet(queryURL.value, queryJSON.value)
    .then((res) => {
      currentData.value = [];
      tableCFG.value.loading = false;

      if (Array.isArray(res.RESULT)) {
        tableData.value = res.RESULT;
        pageInfo.totalResult = res.RESULT.length;
      } else {
        const { RECORDS, TOTAL } = res.RESULT;
        tableData.value = RECORDS;
        pageInfo.totalResult = TOTAL;
      }
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
const queryJSON = ref(null);
const topButton = ref([]);

const { getConfig } = useTableConifg(props.menuID);

watch(
  () => props.menuID,
  (value) => {
    if (value) {
      getConfig().then((res) => {
        tableCFG.value = res.tableCFG;
        pageConfig.value = res.pageConfig;
        topButton.value = res.pageConfig.topButton;
        queryURL.value = pageConfig.value.queryUrl;
        queryJSON.value = pageConfig.value.queryJson;
        customPlan.value = pageConfig.value.customPlan;

        SubTableConfig.value = pageConfig.value.subTable;

        let getConfigPager = tableCFG.value.pagerConfig;
        pageInfo.pageSize = getConfigPager.pageSize || 10;
        queryJSON.value.PAGESIZE = getConfigPager.pageSize || pageInfo.pageSize;
        nextTick(() => {
          resetHeight();
        });
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
    let subHeight =  SubTableConfig.value[0].TABLEHEIGHT*1 || 120;
    newTBHeight -= subHeight;
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
  pageConfig.value.hasTree ? getTreeData() : getTableData();
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


function  dbClickTable(data){
  emit('dbClick', data)
}

function getCheckRows(){
  return currentData.value
}

defineExpose({getCheckRows})

onMounted(() => {
   window.onresize = function onresize() {
    resetHeight()
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

