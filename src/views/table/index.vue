<!--
 * @Author: cc2049
 * @Date: 2024-04-23 11:33:59
 * @LastEditors: PiPin 33947354+p1Master@users.noreply.github.com
 * @LastEditTime: 2024-05-24 17:13:48
 * @Description: 简介
-->
<template>

  <div class="page-container">
    <SingleTable v-if="!visibleFormPage" ref="listTableRef" :menuID="menuParams" :compType="routerParams.COMP" @openCustemPage="openCustemPages"  />
    <OpenCustom v-else :slotCustemPagePath="slotCustemPagePath" @backEvent="backEvent" />
  </div>

</template>

<script setup>
import SingleTable from "./components/SingleTable/index.vue";
import MultiTable from "./components/MultiTable/index.vue";
import OpenCustom from "./components/openCustom/index.vue";

/*
 * 解析路由获取菜单id
 */
const router = useRouter();
const routerParams = router.currentRoute.value.meta;
const menuParams = ref({
  MODULEID: routerParams.BILLNO || "-",
  PAGEID: routerParams.ACTION || "-",
});
const visibleFormPage = ref(false);

const openCustemPages=(acceptData) => {
  const {data,row} = acceptData
  openCustemPage(data.btnConf.VTYPE, data.btnConf.PAGEPATH); // 打开自定义页面

}

const backEvent=()=>{
  visibleFormPage.value = false
}


/** 动态自定义组件 */
const slotCustemPagePath=ref()
const openCustemPage = (type, path) => {
  try {
    visibleFormPage.value = true;
    slotCustemPagePath.value = path;
  } catch (err) {
    console.error("打开自定义页面", err);
  }
};


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

