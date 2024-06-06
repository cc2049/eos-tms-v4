<!--
 * @Author: cc2049
 * @Date: 2024-06-03 20:55:06
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-06-06 12:14:35
 * @Description: 简介
-->
<template>
  <div class="home">
    <FormPage :menuID="menuParams" :currentData @closeModal="closeModal" @refreshTable="refreshTable" :isGetDetail :activeBtn :topButton :isDetail />
  </div>
</template>

<script setup>
import FormPage from "./index.vue";
/*
 * 解析路由获取菜单id
 */
const route = useRoute();
const routerParams = route.meta;
const menuParams = ref({
  MODULEID: routerParams.BILLNO || "-",
  PAGEID: routerParams.ACTION || "-",
});
const currentData = ref([]);
const isGetDetail = ref(false);
const isDetail = ref(false);

if (route.params) {
  let { id, type } = route.params;
  if (type !=0) isGetDetail.value = true;
  if (type == 2) isDetail.value = true;
  if(id!='-') currentData.value = [ {BILLNO:id}]
}

function closeModal(){
  
}

</script>


<style scoped>
.home{
  padding: 0 20px;
  background-color: #fff;
}
</style>