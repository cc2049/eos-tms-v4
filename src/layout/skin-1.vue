<!--
 * @Author: cc2049
 * @Date: 2024-04-24 12:47:35
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-06-06 09:06:50
 * @Description: 主题风格一 金蝶云
-->
<template>
  <div class="app-wrapper " :style="{ '--current-color': theme }">
    <div :class="{ hasTagsView: needTagsView, sidebarHide: sidebar.hide }" class="main-container skin-1-theme">
      <!-- <navbar @setLayout="setLayout" /> -->
      <TopMenu01 @setLayout="setLayout" @openNotice="openNotice" :noticeLength="10"></TopMenu01>
      <div class="app-wrapper-content">
        <div class="tags-view-jdy flex-box">
          <div class="tags-view-left">
            <span class="tags-left" @click="openAllMenu">
              <el-icon color="#abb6cd" :size="20">
                <HomeFilled />
              </el-icon>
              <el-icon color="#abb6cd" :size="20">
                <Menu />
              </el-icon>
            </span>
            <div class="tags-content">
              <TagsViewSkin1 @closeAllMenu="closeMenu" />
            </div>
          </div>
          <div class="tags-view-right">
            <el-icon color="#abb6cd" :size="20" class="darrow-down">
              <DArrowRight />
            </el-icon>
            <screenfull id="screenfull" class="right-menu-item hover-effect" />
          </div>
        </div>

        <div class="app-wrapper-content-main">
          <Sidebar v-if="showSidebar" @closeMenu="closeMenu" class="sidebar-container skin-1-sidebar" :showSidebar="showSidebar" />
          <app-main :topMenuHeight="topMenuHeight" />
          <settings ref="settingRef" />
          <notice ref="noticeRef" @setUnReadData="setUnReadData" />
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { useWindowSize } from "@vueuse/core";
import Sidebar from "./components/Sidebar/index-skin-1.vue";
import { AppMain, Navbar, Settings } from "./components";
import defaultSettings from "@/settings";
import TopMenu01 from "./components/TopMenu/index-skin-1.vue";
import Screenfull from "@/components/Screenfull";

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

const openNotice = () => {};

const showSidebar = ref(false);
function closeMenu() {
  showSidebar.value = false;
}
function openAllMenu() {
  showSidebar.value = !showSidebar.value;
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

// jdy 菜单风格
.tags-view-jdy {
  width: 100%;
  padding: 0 20px;
  background-color: #f5f7fb;
  display: flex;
  justify-content: space-between;
  .tags-view-left {
    display: flex;
    width: calc(100% - 100px);
    .tags-left {
      .el-icon {
        display: inline-block;
        position: relative;
        top: 4px;
        margin-right: 10px;
        cursor: pointer;
        &:hover {
          color: var(--el-color-primary);
        }
      }
    }
    .tags-content {
      width: calc(100% - 80px);
      background-color: rebeccapurple;
    }
  }
  .tags-view-right {
    display: flex;
    width: 100px;
    justify-content: space-around;
    #screenfull {
      color: #abb6cd;
      line-height: 30px;
      cursor: pointer;
      &:hover {
        color: var(--el-color-primary);
      }
    }
    .el-icon {
      cursor: pointer;
      position: relative;
      top: 6px;
      &:hover {
        color: var(--el-color-primary);
      }
    }

    .darrow-down {
      transform: rotate(90deg);
    }
  }
}

.app-wrapper-content {
  position: relative;
  height: calc(100% - 48px);
  &-main {
    background-color: #fafcff;
    height: calc(100% - 30px);
  }
  .skin-1-sidebar {
    top: 78px !important;
    background-color: #e9eaf3 !important;
  }
}
</style>