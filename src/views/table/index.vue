<!--
 * @Author: cc2049
 * @Date: 2024-04-23 11:33:59
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-07-09 17:12:10
 * @Description: 简介
-->
<template>
  <div class="page-container" :class="{ formBg: visibleFormPage }">
    <SingleTable v-if="!visibleFormPage" ref="listTableRef" :menuID="menuParams" :compType="routerParams.COMP"
      @openCustemPage="openCustemPage" />

    <template v-else>
      <OpenCustom :activeBtn :slotCustemPagePath="slotCustemPagePath" @backEvents="backEvent" />
    </template>

  </div>
</template>

<script setup>
import SingleTable from "./components/SingleTable/index.vue";
import OpenCustom from "./components/openCustom/index.vue";

import useKey17Status from "@/hooks/useKey17Status";
const { key17Status } = useKey17Status();

/*
 * 解析路由获取菜单id
 */
const route = useRoute();
const routerParams = route.meta;
const menuParams = ref({
  MODULEID: routerParams.BILLNO || "-",
  PAGEID: routerParams.ACTION || "-",
});
const visibleFormPage = ref(false);


const activeBtn = ref({})
const backEvent = () => {
  console.log(44444);
  // 目前不行，这样的话 财旺写的组件会报错
  visibleFormPage.value = false;
};

/** 动态自定义组件 */
const slotCustemPagePath = ref();
const openCustemPage = (data) => {
  activeBtn.value = data
  try {
    visibleFormPage.value = true;
    slotCustemPagePath.value = data.path;
  } catch (err) {
    console.error("打开自定义页面", err);
  }
};
provide("menuID", menuParams);
provide("key17Status", key17Status);

onMounted(() => {
  window.addEventListener('resize', () => {
    // 窗口尺寸改变时触发事件
    console.log('窗口尺寸改变');
  })
});
</script>

<style lang="scss" scoped>
.page-container {
  padding: 0 20px;
  position: relative;
  background-color: #fafcff;

}

.formBg {
  background-color: #e8ecf6 !important;
}
</style>
