<!--
 * @Author: cc2049
 * @Date: 2024-04-28 13:10:44
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-04-28 18:31:00
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
          已选 <span class="color-orange"> {{ currentData.length }} </span> 行
        </div>
      </template>
    </vxe-pager>
  </template>

</template>

<script setup>
import Vxtable from "@/components/Vxtable";
import TopButton from "@/components/TopButton";
import AdvanceQuery from "@/components/AdvancedQuery/index";
import { watch } from "vue";

const menuConfig = inject("menuConfig");
const tableData = inject("tableData");

const currentData = ref([]);

const AdvancedQuery = ref(null);

const pageInfo = reactive({
  currentPage: 1,
  pageSize: 5,
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

const tableChange = ({ checked, row }) => {
  if (checked) {
    currentData.value.push(row);
  } else {
    currentData.value = currentData.value.filter((item) => item.id !== row.id);
  }
};

const dragTableRow = ({ row, $rowIndex }) => {
  console.log(row, $rowIndex);
};

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

