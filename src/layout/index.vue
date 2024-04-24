<!--
 * @Author: cc2049
 * @Date: 2024-04-19 09:01:33
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-04-24 18:31:42
 * @Description: 主题入口
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