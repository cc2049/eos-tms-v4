<!--
 * @Author: cc2049
 * @Date: 2024-04-28 13:10:44
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-04-29 17:48:32
 * @Description: 简介
-->
<template>

  <template v-if="menuConfig">
    <TopButton :topButton="menuConfig?.pageConfig?.topButton" :currentData="currentData" @handelEvent="handelEvent" />

    <div class="custom-query" ref="AdvancedQuery">
      <AdvanceQuery />
    </div>

    <Vxtable ref="VxtableRef" class="bg-white" :tableCFG="menuConfig?.tableCFG" :tableData="tableData" @change="tableChange" @dragRow="dragTableRow" @queryEvent="queryEvent">
    </Vxtable>

    <vxe-pager size="mini" class-name="vxe-page-wrap " :page-size="pageInfo.pageSize" :page-sizes="ListPageSize" :current-page="pageInfo.currentPage" :total="pageInfo.totalResult" :layouts="pagerLayouts" @page-change="handlePageChange">
      <template #left>
        <div class="check-acount">
          已选 <span class="waring-color"> {{ currentData.length }} </span> 行
        </div>
      </template>
    </vxe-pager>
  </template>

</template>

<script setup>
import Vxtable from "@/components/Vxtable";
import TopButton from "@/components/TopButton";
import AdvanceQuery from "@/components/AdvancedQuery/index";
import { axiosGet } from "#/common";

const menuConfig = inject("menuConfig");
const tableData = ref([]);

const currentData = ref([]);

const AdvancedQuery = ref(null);

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

const tableHight = computed(() => {
  return window.innerHeight - 160 - AdvancedQuery.value?.clientHeight;
});

// 表格内部的多选事件，顶部筛选排序事件, 超链接事件

function tableChange(data) {
  console.log("tableChange", data);
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
    // let expandRow = getRowExpandRecords()
  }
  if (data.clicktype == "openLink") {
    // 超链接点击事件
    formModalTableCFG.value.tableBillNo = data.data.BILLNO;

    currentData.value = data.data;

    if (data.linkCFG.includes("?") && data.linkCFG.includes(":")) {
      // 如果配置了三元运算
      let currentLinkCFG = getEvalValue(data.data, data.linkCFG);
      let getLinkBtn = pageConfig.initButton.filter((i) => {
        return i.BILLNO == currentLinkCFG;
      });
      // currentData.value = data.data;
      getLinkBtn.length
        ? handelEvent({ data: getLinkBtn[0], row: data.data })
        : null;
    } else {
      let getLinkBtn = pageConfig.initButton.filter((i) => {
        return i.BILLNO == data.linkCFG;
      });
      // currentData.value = data.data;
      getLinkBtn.length
        ? handelEvent({ data: getLinkBtn[0], row: data.data })
        : null;
    }
  }
  if (data.clicktype == "openDrawer") {
    colDrawer.value = true;
  } else {
    currentData.value = data.data;
  }

  // 表格点击事件
  if (data.clicktype == "clinkBTN") {
    handelEvent({ data: data.linkCFG, row: data.data });
  }
  if (
    routerParams.COMP == "VTableSub" ||
    pageConfig.hasSubTable ||
    tableCFG.expandID
  ) {
    if (data.checked) {
      getSUBTBData(
        tableData.value[data.rowIndex].BILLNO ||
          tableData.value[data.rowIndex].PK_CLASS
      );
    }
  }
}

// 分页点击
function handlePageChange({ currentPage, pageSize }) {
  pageInfo.currentPage = currentPage;
  pageInfo.pageSize = pageSize;
  queryJSON.value.PAGESIZE = pageSize
  getTableData();
}

const dragTableRow = ({ row, $rowIndex }) => {
  console.log(row, $rowIndex);
};

const getTableData = () => {
  console.log(888, queryJSON.value);

  queryJSON.value.PAGENUM = pageInfo.currentPage;
  queryJSON.value.SORTNAME = pageInfo.sortName;
  queryJSON.value.REVERSE = pageInfo.sortOrder;

  axiosGet(queryURL.value, queryJSON.value).then((res) => {
    const { RECORDS, TOTAL } = res.RESULT;
    tableData.value = RECORDS;
    pageInfo.totalResult = TOTAL;
  });
};

const queryURL = ref(null);
const queryJSON = ref(null);

watch(
  () => menuConfig.value,
  (value) => {
    if (value) {
      queryURL.value = menuConfig.value.pageConfig.queryUrl;
      queryJSON.value = menuConfig.value.pageConfig.queryJson;
      let getConfigPager = menuConfig.value.tableCFG.pagerConfig;
      pageInfo.pageSize = getConfigPager.pageSize
      queryJSON.value.PAGESIZE = getConfigPager.pageSize || pageInfo.pageSize;
      getTableData();
    }
  },
  {
    immediate: true,
  }
);

watch(
  () => AdvancedQuery.value,
  (value) => {
    if (value) {
      menuConfig.value.tableCFG.height = tableHight.value;
    }
  },
  {
    immediate: true,
  }
);

onMounted(() => {});
</script>


<style lang="scss" scoped>
.vxe-page-wrap {
  background-color: #fafcff;
}
</style>

