<!--
 * @Author: cc2049
 * @Date: 2024-04-23 11:33:59
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-05-08 12:02:35
 * @Description: 简介
-->
<template>

  <div class="page-container">
    <SingleTable ref="listTableRef" :menuID="menuParams"  @openCustemPage="openCustemPages"  />

    

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
const visibleFormPage = ref(false);

const openCustemPages=(data) => {
  console.log("🚀 ~ openCustemPage ~ data:", data)
        openCustemPage(data.btnConf.VTYPE, data.btnConf.PAGEPATH); // 打开自定义页面

}


/** 动态自定义组件 */
const slotCustemPage = ref();
const openCustemPage = (type, path) => {
  try {
    // visibleFormPage.value = true;
    type == 1
      ? (visibleFormPage.value = true)
      : (pageConfig.modalVisible = true);
    slotCustemPage.value = pageAutoComponent(path);
    // slotCustemPage.value = defineAsyncComponent(() => import(`./page.js`))
  } catch (err) {
    console.error("打开自定义页面", err);
  }
};




provide("menuID", menuParams);

onMounted(() => {});
</script>

<style lang="scss" scoped>
.page-container {
  padding: 0 20px;
  position: relative;
}
</style>

