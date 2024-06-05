<!--
 * @Author: cc2049
 * @Date: 2024-04-23 11:33:59
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-06-05 19:40:30
 * @Description: 简介
-->
<template>
  <div class="page-container">
    <SingleTable v-if="!visibleFormPage" ref="listTableRef" :menuID="menuParams" :compType="routerParams.COMP" @openCustemPage="openCustemPage" />

    <template v-else>
      <OpenCustom :activeBtn :slotCustemPagePath="slotCustemPagePath" @backEvents="backEvent" />
    </template>

  </div>
</template>

<script setup>
import SingleTable from "./components/SingleTable/index.vue";
import MultiTable from "./components/MultiTable/index.vue";
import OpenCustom from "./components/openCustom/index.vue";

import useKey17Status from "@/hooks/useKey17Status";
const { key17Status } = useKey17Status();

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

const activeBtn = ref({})
const backEvent = () => {
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

onMounted(() => {});
</script>

<style lang="scss" scoped>
.page-container {
  padding: 0 20px;
  position: relative;
}
</style>

