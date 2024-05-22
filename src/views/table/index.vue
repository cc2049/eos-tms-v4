<!--
 * @Author: cc2049
 * @Date: 2024-04-23 11:33:59
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-05-22 10:52:53
 * @Description: 简介
-->
<template>

  <div class="page-container">
    <SingleTable ref="listTableRef" :menuID="menuParams" :compType="routerParams.COMP"  />
  </div>

</template>

<script setup>
import SingleTable from "./components/SingleTable/index.vue";
import MultiTable from "./components/MultiTable/index.vue";

/*
 * 解析路由获取菜单id
 */
const router = useRouter();
const routerParams = router.currentRoute.value.meta;
const menuParams = ref({
  MODULEID: routerParams.BILLNO || "MU221010650325",
  PAGEID: routerParams.ACTION || "PG221010670930",
});

console.log(123, routerParams);


provide("menuID", menuParams);

onMounted(() => {});
</script>

<style lang="scss" scoped>
.page-container {
  padding: 0 20px;
  position: relative;
}
</style>

