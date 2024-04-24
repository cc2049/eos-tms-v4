<!--
 * @Author: cc2049
 * @Date: 2024-04-24 12:47:35
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-04-24 18:56:03
 * @Description: 主题风格一 金蝶云
-->
<template>
  <div class="app-wrapper " :style="{ '--current-color': theme }">
    <div :class="{ hasTagsView: needTagsView, sidebarHide: sidebar.hide }" class="main-container skin-1-theme">
      <div>
        <!-- <navbar @setLayout="setLayout" /> -->
          <TopMenu01 @setLayout="setLayout" @openNotice="openNotice" :noticeLength="10"></TopMenu01>

        <TagsViewSkin1 v-if="needTagsView" />
      </div>
      <app-main />
      <settings ref="settingRef" />
    </div>
  </div>
</template>

<script setup>
import { useWindowSize } from "@vueuse/core";
import Sidebar from "./components/Sidebar/index.vue";
import { AppMain, Navbar, Settings } from "./components";
import defaultSettings from "@/settings";
import TopMenu01 from "./components/TopMenu/index-skin-1.vue";

import TagsViewSkin1 from "./components/TagsView/index-skin-1.vue";


import useAppStore from "@/store/modules/app";
import useSettingsStore from "@/store/modules/settings";
import { onMounted } from "vue";

const settingsStore = useSettingsStore();
const theme = computed(() => settingsStore.theme);
const sideTheme = computed(() => settingsStore.sideTheme);
const sidebar = computed(() => useAppStore().sidebar);
const device = computed(() => useAppStore().device);
const needTagsView = computed(() => settingsStore.tagsView);
const fixedHeader = computed(() => settingsStore.fixedHeader);
const menuStyle = computed(() => settingsStore.menuStyle);



const { width, height } = useWindowSize();
const WIDTH = 992; // refer to Bootstrap's responsive design

watchEffect(() => {
  if (device.value === "mobile" && sidebar.value.opened) {
    useAppStore().closeSideBar({ withoutAnimation: false });
  }
  if (width.value - 1 < WIDTH) {
    useAppStore().toggleDevice("mobile");
    useAppStore().closeSideBar({ withoutAnimation: true });
  } else {
    useAppStore().toggleDevice("desktop");
  }
});

const settingRef = ref(null);
function setLayout() {
  settingRef.value.openSetting();
}

const openNotice=()=>{

}

</script>

<style lang="scss" scoped>
@import "@/assets/styles/mixin.scss";
@import "@/assets/styles/variables.module.scss";

.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;

  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
}

.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}

.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;
  width: calc(100% - #{$base-sidebar-width});
  transition: width 0.28s;
}

.hideSidebar .fixed-header {
  width: calc(100% - 54px);
}

.sidebarHide .fixed-header {
  width: 100%;
}

.mobile .fixed-header {
  width: 100%;
}
</style>