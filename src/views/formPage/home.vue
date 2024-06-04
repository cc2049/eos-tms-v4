<!--
 * @Author: cc2049
 * @Date: 2024-06-03 20:55:06
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-06-04 10:06:34
 * @Description: 简介
-->
<template>
  <div class="home">
    <FormPage :menuID="menuParams" :currentData="currentData2" @closeModal="closeModal" @refreshTable="refreshTable" :isGetDetail :activeBtn :topButton :isDetail />
  </div>
</template>

<script setup>
import FormPage from "./index.vue"
/*
 * 解析路由获取菜单id
 */
const route = useRoute();
const routerParams = route.meta;
const menuParams = ref({
  MODULEID: routerParams.BILLNO || "-",
  PAGEID: routerParams.ACTION || "-",
});
const currentData2 = ref(null)
console.log( 888, route.meta , route );
</script>
