<!--
 * @Author: cc2049
 * @Date: 2024-04-19 09:01:33
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-04-29 14:23:19
 * @Description: 简介
-->
<template>
  <router-view />
</template>

<script setup>
import useSettingsStore from '@/store/modules/settings'
import { handleThemeStyle } from '@/utils/theme'

onMounted(() => {
  nextTick(() => {
    // 初始化主题样式
    handleThemeStyle(useSettingsStore().theme)
  })
})


</script>


