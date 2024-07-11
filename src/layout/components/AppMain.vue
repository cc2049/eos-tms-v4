<!--
 * @Author: cc2049
 * @Date: 2024-04-19 09:01:33
 * @LastEditors: 
 * @LastEditTime: 2024-07-11 16:26:51
 * @Description: 简介
-->
<template>
  <section class="app-main">
    <router-view v-slot="{ Component, route }">
      <transition name="fade-transform" mode="out-in">
        <keep-alive :include="tagsViewStore.cachedViews">
          <component v-if="!route.meta.link" :is="Component" :key="route.path" />
        </keep-alive>
      </transition>
    </router-view>
    <iframe-toggle />

    <div class="eos-alert" v-if="alertStore.show">
      <el-alert show-icon :type="alertStore.type" :closable="false">
        <template #title>
          {{  alertStore.title }}
        </template>
        <template #default>
          <el-button size="small" @click="alertStore.close()">
            确定
          </el-button>
        </template>
      </el-alert>
    </div>

    <EosModal />
  </section>
</template>

<script setup>
import iframeToggle from "./IframeToggle/index";
import useTagsViewStore from "@/store/modules/tagsView";
import useAlertStore from '@/store/modules/alert'

const tagsViewStore = useTagsViewStore();
const alertStore = useAlertStore()
</script>

<style lang="scss" scoped>
.app-main {
  /* 50= navbar  50  */
  min-height: calc(100vh - 50px);
  width: 100%;
  position: relative;
  overflow: hidden;
}

.eos-alert{
  width: calc(100% - 40px);
  height: 60vh;
  position: fixed;
  top: 130px;
  left: 20px;
  background-color: rgba($color: #000000, $alpha: .6);
  z-index: 101;
}

.fixed-header + .app-main {
  padding-top: 50px;
}

.hasTagsView {
  .app-main {
    /* 84 = navbar + tags-view = 50 + 34 */
    min-height: calc(100vh - 84px);
  }

  .fixed-header + .app-main {
    padding-top: 84px;
  }
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 6px;
  }
}

::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background-color: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background-color: #c0c0c0;
  border-radius: 3px;
}
</style>

