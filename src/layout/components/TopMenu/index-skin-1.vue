<template>
  <div class="navbar skin-1-top">
    <div class="system-title">
      <div class="logo-wrap">
        <img :src="logoUrl" alt="" />
      </div>

      <div class="version mr-20 ">
        企业版
      </div>

      <div class="system-name">
        {{ systemName || "集团公司" }}
      </div>
      <el-divider direction="vertical" />

      <div class="complany-select">
        太原易思软件技术有限公司
        <el-icon style="top:3px">
          <ArrowDownBold />
        </el-icon>

      </div>
    </div>

    <div class="right-menu">
      <template v-if="appStore.device !== 'mobile'">
        <el-space size="large">
          <header-search id="header-search" class="right-menu-item" />
          <el-icon :size="20">
            <Icon icon="bi:bell"></Icon>
          </el-icon>
          <el-icon color="#fff" :size="20" @click="clickHelpCenter">
            <Icon icon="ant-design:question-circle-outlined"></Icon>
          </el-icon>
        </el-space>

      </template>
      <div class="avatar-container">
        <el-dropdown @command="handleCommand" class="right-menu-item hover-effect" trigger="click" size="def">
          <div class="avatar-wrapper">
            <el-avatar :size="22" :src="avatarUrl" />
            <div class="user-text">
              {{ userInfo.VNAME || 'adminadmin' }}
            </div>
            <!-- <div class="">
              <div class="user-role">
                {{ userInfo.ROLENAME || '超级管理员' }}
              </div>
            </div> -->
          </div>

          <template #dropdown>
            <el-dropdown-menu style="width: 300px">
              <div class="userinfo-wrap">
                <span class="user-name">{{ userInfo.VNAME }}</span>
                <router-link to="/user/profile">
                  <el-button>编辑</el-button>
                </router-link>
              </div>

              <el-dropdown-item command="setLayout">
                <el-icon>
                  <Setting />
                </el-icon><span>界面设置</span>
              </el-dropdown-item>

              <el-dropdown-item>
                <el-popover placement="right" :width="200" trigger="hover">
                  <template #reference>
                    <div class="role-selcet">
                      <el-icon>
                        <Connection />
                      </el-icon><span>切换角色</span>
                    </div>
                  </template>
                  <template #default>
                    <div class="role-wrap">
                      <div class="role-item" v-for="item in RoleList" :key="item.BILLNO" @click="activeRoleEvent(item)">
                        <el-avatar :size="25" :src="circleUrl" />
                        <span class="role-name">
                          {{ item.VNAME }}
                        </span>
                        <el-icon class="choose" v-if="
                                item.ISDEFAULT == 1 ||
                                activeRole.BILLNO == item.BILLNO
                              ">
                          <SuccessFilled />
                        </el-icon>
                      </div>
                    </div>
                  </template>
                </el-popover>
              </el-dropdown-item>

              <router-link to="/PLAT_YW/versions/manual">
                <el-dropdown-item>
                  <el-icon>
                    <Calendar />
                  </el-icon>
                  <span>更新日志</span>
                </el-dropdown-item>
              </router-link>

              <!-- <router-link to="/PLAT_YW/help/wtzsk">
                <el-dropdown-item>
                  <el-icon>
                    <Service />
                  </el-icon>
                  <span>帮助中心</span>
                </el-dropdown-item>
              </router-link> -->
              <el-dropdown-item command="helpCenter">
                  <el-icon>
                    <Service />
                  </el-icon>
                  <span>帮助中心</span>
                </el-dropdown-item>

              <el-dropdown-item divided command="logout">
                <el-icon>
                  <SwitchButton />
                </el-icon>
                <span>退出登录</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
    <HelpCenter  v-model:helpDrawer="helpDrawer" @clickMoreContent="clickMoreContent" />
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

import HelpCenter from "./HelpCenter.vue";

const appStore = useAppStore();
const userStore = useUserStore();
const settingsStore = useSettingsStore();
const { proxy } = getCurrentInstance();
const logoUrl = proxy.getAssetsFile("logo.png");
const avatarUrl = proxy.getAssetsFile("user.png");
const userInfo = computed(() => userStore.userInfo);

const helpDrawer=ref(false)
const clickMoreContent=()=>{
  helpDrawer.value = false
}


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
    case "helpCenter":
      clickHelpCenter()
      break;
    default:
      break;
  }
}

function clickHelpCenter(){

  helpDrawer.value = true


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
    font-size: 14px;
    .logo-wrap {
      img {
        height: 26px;
      }
      margin-right: 10px;
    }
    .version {
      background-color: #fff;
      color: var(--el-color-primary);
      font-size: 0.55rem;
      font-weight: 600;
      transform: skewX(-15deg);
      padding: 2px 4px;
      border-radius: 2px;
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

.avatar-wrapper {
  display: flex;
  align-items: center;
  .user-text {
    text-align: center;
    font-size: 14px;
    white-space: nowrap;
    min-width: 40px;
  }
}

.userinfo-wrap {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 16px;
  border-bottom: 1px solid #ddd;
  margin-bottom: 10px;
  .user-name {
    font-size: 18px;
  }
}

</style>
