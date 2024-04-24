<template>
  <div class="navbar skin-1-top">
    <div class="system-title">
      <div class="logo-wrap">
        <img :src="avatarUrl" alt="" />
      </div>
      <div class="system-name">
        {{ systemName || "易运帮" }}
      </div>
      <el-divider direction="vertical" />

      <div class="complany-select">
        太原易思软件技术有限公司
      </div>
    </div>

    <div class="right-menu">
      <template v-if="appStore.device !== 'mobile'">
        <header-search id="header-search" class="right-menu-item" />
        <screenfull id="screenfull" class="right-menu-item hover-effect" />
        <!-- <el-tooltip content="布局大小" effect="dark" placement="bottom">
          <size-select id="size-select" class="right-menu-item hover-effect" />
        </el-tooltip> -->
      </template>
      <div class="avatar-container">
        <el-dropdown @command="handleCommand" class="right-menu-item hover-effect" trigger="click">
          <div class="avatar-wrapper">
            <img :src="avatarUrl" class="user-avatar" />
            <el-icon><caret-bottom /></el-icon>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <router-link to="/user/profile">
                <el-dropdown-item>个人中心</el-dropdown-item>
              </router-link>
              <el-dropdown-item command="setLayout" v-if="settingsStore.showSettings">
                <span>布局设置</span>
              </el-dropdown-item>
              <el-dropdown-item divided command="logout">
                <span>退出登录</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ElMessageBox } from "element-plus";
import Breadcrumb from "@/components/Breadcrumb";
import TopNav from "@/components/TopNav";
import Hamburger from "@/components/Hamburger";
import Screenfull from "@/components/Screenfull";
import SizeSelect from "@/components/SizeSelect";
import HeaderSearch from "@/components/HeaderSearch";

import useAppStore from "@/store/modules/app";
import useUserStore from "@/store/modules/user";
import useSettingsStore from "@/store/modules/settings";

const appStore = useAppStore();
const userStore = useUserStore();
const settingsStore = useSettingsStore();
const { proxy } = getCurrentInstance();
const avatarUrl = proxy.getAssetsFile("logo.png");

function toggleSideBar() {
  appStore.toggleSideBar();
}

function handleCommand(command) {
  switch (command) {
    case "setLayout":
      setLayout();
      break;
    case "logout":
      logout();
      break;
    default:
      break;
  }
}

function logout() {
  ElMessageBox.confirm("确定注销并退出系统吗？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      userStore.logOut().then(() => {
        location.href = "/index";
      });
    })
    .catch(() => {});
}

const emits = defineEmits(["setLayout"]);
function setLayout() {
  emits("setLayout");
}
</script>

<style lang='scss' scoped>
.navbar {
  height: 48px !important;
  color: #fff;
  overflow: hidden;
  position: relative;
  background-color: #2383eb;
  background-image: linear-gradient(135deg, #225dff 0%, #2a4aff 100%);
  display: flex;
  justify-content: space-between;
  align-items: center;
  .system-title {
    display: flex;
    width: 100%;
    padding-left: 10px;
    align-items: center;
    .logo-wrap {
      img {
        width: 32px;
        height: 32px;
      }
      margin-right: 10px;
    }
    .tag-version {
      margin: 0 8px;
      background-color: rgba($color: #fff, $alpha: 0.3);
      color: yellow;
      font-size: 12px;
      padding: 2px 4px;
      border-radius: 4px;
    }
    .system-name {
      white-space: nowrap;
      font-weight: 600;
      color: #fff;
    }
    img {
      max-height: 50px;
    }
  }

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .topmenu-container {
    position: absolute;
    left: 50px;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    
    line-height: 48px;
    display: flex;
    align-items: center;
    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #fff;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 40px;

      .avatar-wrapper {
        position: relative;
        top: 4px;
        .user-avatar {
          cursor: pointer;
          width: 24px;
          height: 24px;
          border-radius: 10px;
        }

        i {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 5px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
