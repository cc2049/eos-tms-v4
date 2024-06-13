<!--
 * @Author: cc2049
 * @Date: 2024-06-13 15:48:04
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-06-13 17:13:55
 * @Description: 简介
-->
<template>
  <el-scrollbar :height="wheight">
    锐浪报表案例
    <div id="report_holder"> </div>
  </el-scrollbar>
</template>

<script setup>

import TestJson from "./data/jsonCustomer.json";

const wheight = window.innerHeight - 78

async function initNav() {
  const ElementResizeDetector = await import("@/utils/grhtml5-6.8-min.js");
  const rubylong = ElementResizeDetector.default;
  // http://116.63.138.118:8078/group1/M00/00/3D/wKgB12ZqtSeAJY6dAAANNCnrTkI242.grf?attname=simple.grf
  var reportViewer = rubylong.grhtml5.insertReportViewer(
    "report_holder",
    "/grf/simple.grf",
    TestJson
  );
  reportViewer.start();
}

onMounted(() => {
  initNav();
});
</script>