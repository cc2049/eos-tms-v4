<!--
 * @Author: cc2049
 * @Date: 2024-05-22 08:30:20
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-06-11 09:05:02
 * @Description: 简介
-->

<template>
  <div class="sub-table-wrap">
    <!-- <EosTabs :tabsList="SubTableConfig" @change="changeTab" /> -->
    <template v-if="activeTab?.VCODE =='timeline'">
      <!-- <TimeLine :height="150" :data="tableData" :config="tableCFG" /> -->
    </template>
    <template v-else>
      <Vxtable ref="VxtableRef" class="bg-white" :tableCFG :tableData @change="tableChange" @queryEvent="queryEvent" @resetConfig="resetConfig">
      </Vxtable>
    </template>
  </div>
</template>

<script setup>
import Vxtable from "@/components/Vxtable";
import EosTabs from "@/components/EosTabs/index.vue";
import TimeLine from "@/components/TimeLine"; // 单据进度条

import { axiosGet } from "#/common";
import { getUrlParams } from "@/utils";
import { onMounted } from "vue";

const props = defineProps({
  SubTableConfig: {
    type: Array,
    default: () => [],
  },
  subLayout: {
    type: String,
    default: "0",
  },
  height: {},
});

const tableData = ref([]);
const activeTab = ref(props.SubTableConfig[0]);

const tableCFG = reactive({
  tableColumns: [], // 可显示的表格列配置
  allColumns: [], // 表格的所以列
  hasTableTools: false, // 是否有操作栏
  hasSeq: false, // 是否显示序号
  hasCheck: false, // 是否需要多选图标
  hasDragRow: false, // 是否支持 拖拽
  tableStyle: 0, // 表格风格  默认普通表格 ，  1是
  defaultStyle: 0,
  filterFileid: [], // 支持列头筛选的 字段
  toolsConfig: [],
  expandID: "",
  loading: false,
  hasFill: false, // 表格补位
  hasEmpty: false,
  height: 500,
  rowClassEval: "", // 行加背景色的条件
  mergeCFG: [], // 表尾合计的配置  字段
  mergeRowField: [], // 需要合并的字段
  treeID: null, // 树形表格 的可展开的节点id
  SelectType: null,
  tableButtons: ["ADD", "EDIT", "DELETE"],
  EtableRules: {},
  cellHeight: 40, // 单元格的行高
  isHeaderFilter: false, // 是否启用头部过滤
  queryJson: {}, // 查询条件
  pagerConfig: {
    pageSize: 10,
    pageSizes: [10, 20, 30, 50, 100, 500, 1000],
  }, // 分页配置
});

onMounted(() => {
  const { COLUMNS,  TABLEHEIGHT } = props.SubTableConfig[0];
   tableCFG.height = props.subLayout == 1 ? props.height : TABLEHEIGHT;
  tableCFG.tableColumns = COLUMNS;
});

watch(
  () => props.height,
  (value) => {
    const { TABLEHEIGHT } = props.SubTableConfig[0];
    tableCFG.height = props.subLayout == 1 ? props.height : TABLEHEIGHT;
  }
);

const tableChange = (data) => {
  console.log("tableChange", data);
};

const queryEvent = (data) => {
  console.log("queryEvent", data);
};

const resetConfig = (data) => {
  console.log("resetConfig", data);
};

const changeTab = (data) => {
  activeTab.value = data;
  getSubData();
};

const chooseData = ref([]);

function getSubData(currentData) {
  currentData ? (chooseData.value = currentData) : null;
  let queryURL = activeTab.value.SLOTCFG,
    URL = queryURL,
    pageID = activeTab.value.BILLNO,
    menuID = activeTab.value.PK_MODULE,
    urlParams = getUrlParams(queryURL),
    BILLNO = null;
  if (URL.includes("batch")) {
    URL = URL.replace("batch=", "");
    if (currentData.length && Array.isArray(currentData)) {
      BILLNO = currentData
        .map((i) => {
          return i.BILLNO;
        })
        .join(",");
    }
  } else {
    BILLNO = currentData[0].BILLNO;
  }

  let data = {
    ...urlParams,
    PK_CLASS: BILLNO,
    PK_ORG: BILLNO,
    PK_BILLNO: BILLNO,
    MODULEID: menuID,
    PAGEID: pageID,
  };

  axiosGet(queryURL, data).then((res) => {
    tableData.value = res.RESULT;
  });
}

defineExpose({
  getSubData,
});

// const tabsList = computed((props) => (props) => {
//   return  props.SubTableConfig.map((item) => {
//     return {
//       label: item.VNAME,
//       id: item.BILLNO,
//     };
//   });
// });
</script>
