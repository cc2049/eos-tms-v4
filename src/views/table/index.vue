<!--
 * @Author: cc2049
 * @Date: 2024-04-23 11:33:59
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-05-06 12:08:41
 * @Description: 简介
-->
<template>

  <div class="page-container">
    <SingleTable ref="listTableRef" :config="allConfig"  />

  </div>

</template>

<script setup>
import SingleTable from "./components/SingleTable/index.vue";
import MultiTable from "./components/MultiTable/index.vue";

import useTableConifg from "@/hooks/useTableConifg";

import { axiosGet } from "#/common";

/*
 * 解析路由获取菜单id
 */
const router = useRouter();
const routerParams = router.currentRoute.value.meta;
const menuParams = ref({
  MODULEID: routerParams.BILLNO || "MU221010650325",
  PAGEID: routerParams.ACTION || "PG221010670930",
});

/*
 * 根据菜单id 去获取页面配置
 */
const { allConfig, getConfig } = useTableConifg(menuParams.value);

// hasTemplate.value = routerParams.ISTEMPLATE == "1";
// hasTree.value = routerParams.COMP == "VTableZtree";

// pageConfig.pageTitle = routerParams.title;
// const pageTitle = ref(routerParams.title);

const menuConfig = ref(null);
const showPage = ref(false);

const tableData = ref([]);

getConfig().then((res) => {
  menuConfig.value = res;
  showPage.value = true;

  
});



provide("menuConfig", menuConfig);
provide("menuID", menuParams);
provide("tableData", tableData);


onMounted(() => {});
</script>

<style lang="scss" scoped>
.page-container {
  padding: 0 20px;
  position: relative;
}
</style>

