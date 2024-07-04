<!--
 * @Author: cc2049
 * @Date: 2024-04-24 19:03:54
 * @LastEditors: 
 * @LastEditTime: 2024-07-03 14:25:45
 * @Description: 简介
-->

<template>
  <skin1 v-if="menuStyle==1"></skin1>
  <skin2 v-else></skin2>
</template>

<script setup>
import skin1 from "./skin-1.vue";
import skin2 from "./skin-2.vue";

import useSettingsStore from "@/store/modules/settings";
const settingsStore = useSettingsStore();
const menuStyle = computed(() => settingsStore.menuStyle);
</script>

<style lang="scss" scoped>
@import "@/assets/styles/mixin.scss";
@import "@/assets/styles/variables.module.scss";

</style>