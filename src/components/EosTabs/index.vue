<!--
 * @Author: cc2049
 * @Date: 2024-05-22 12:03:45
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-05-28 22:51:51
 * @Description: 简介
-->
<template>
  <div class="eos-tabs flex">
    <div class="eos-tabs-item mr-4" v-for="(item, index) in tabsList" :key="index" :class="{ 'active': activeID === item.BILLNO }" @click="change(item,index)">
      {{ item.VNAME || item.pageTitle  }}
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  // 父组件传过来的值
  tabsList: {
    type: Array,
    default: [],
  },
});

const emit =defineEmits(['change'])
const activeID = ref(props.tabsList[0].BILLNO);
const change = (item, index) => {
  activeID.value = item.BILLNO;
  emit('change', {data: item, index} )
}

</script>

<style lang="scss" scoped>
.eos-tabs {
  height: 30px;
  line-height: 30px;
  font-size: 14px;
  .eos-tabs-item {
    text-align: center;
    cursor: pointer;
    border-radius: 4px 4px 0 0;
    background-color: #EEF2F8;
    color: #273447;
    padding: 0 10px;
    &.active {
      color: #fff;
      background-color: var(--el-color-primary);
    }
    &:hover{
      color: var(--el-color-primary);
      background-color: #eef2f8;
    }
  }
}
</style>
