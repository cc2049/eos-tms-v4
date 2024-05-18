<!--
 * @Author: cc2049
 * @Date: 2024-04-28 15:12:29
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-05-18 18:05:18
 * @Description: 简介
-->

<template>
  <div class="button-wrap">

    <div class="top-button">
      <div class="fixed-top-button">
        <div class="flex flex-items-center" v-if="sourceType==1">
          <div class="buttom-item" @click="leftHandleEvent(1)">
            过滤
          </div>
          <div class="buttom-item" @click="leftHandleEvent(2)">
            刷新
          </div>
          <el-divider direction="vertical" />
        </div>

        <template v-for="(itemBtn) in topButton" :key="itemBtn.BILLNO">
          <div class="buttom-item" @click="handleEvent(itemBtn)" :title="itemBtn.BTNTITLE " v-if="setShowBtn(itemBtn) ">
            {{ itemBtn.VNAME }}
          </div>
          <el-dropdown v-else-if="itemBtn.CHILDREN?.length" style="margin: 0 6px" @command="handelEvent" size="large">
            <div class="buttom-item ">
              {{ itemBtn.VNAME }}
              <el-icon class="el-icon--right">
                <arrow-down />
              </el-icon>
            </div>

            <template #dropdown>
              <el-dropdown-menu>
                <template v-for="itemBtnS in itemBtn.CHILDREN" :key="itemBtnS.BILLNO">
                  <el-dropdown-item :command="itemBtnS" v-if=" setShowBtn(itemBtnS)">
                    {{ itemBtnS.VNAME }}
                  </el-dropdown-item>
                </template>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
      </div>

      <div class="top-button-right">
        <div class="tool-wrap">
          <el-icon color="#949eb5" :size="22" style="top:3px"> 
            <Icon icon="tabler:bulb-filled"></Icon>
          </el-icon>
        </div>
        <vxe-pulldown ref="pulldownRef" destroy-on-close>
          <template #default>
            <div class="tool-wrap" @click="openPulldown">
              <el-icon color="#2a4bff" :size="20" style="top:4px">
                <Icon icon="ant-design:setting-outlined"></Icon>
              </el-icon>
            </div>
          </template>
          <template #dropdown>
            <div class="my-dropdown3">
              <el-scrollbar :height="300">
                <vxe-checkbox-group v-model="checkList" class="column-list" @change="checkboxChange" style="display: flex;flex-direction: column;junt-content: flex-start;">
                  <template v-for="item in topButton" :key="item.BILLNO">
                    <vxe-checkbox style="margin-left:0;margin-bottom:10px" :content="item.VNAME" :label="item.BILLNO" />
                    <template v-if="item.CHILDREN?.length">
                      <vxe-checkbox style="margin-left:20px;margin-bottom:10px" :content="item2.VNAME" :label="item2.BILLNO" v-for="(item2) in item.CHILDREN" :key="item2.BILLNO" />
                    </template>
                  </template>
                </vxe-checkbox-group>
              </el-scrollbar>

            </div>
          </template>
        </vxe-pulldown>

      </div>

    </div>

    <!-- 公共弹窗表单模块 -->
    <vxe-modal destroy-on-close v-model="modalConfig.modalVisible" :width="modalConfig.modalW" :height="modalConfig.modalH" id="formModal" resize storage transfer show-zoom @close="closeModal">
      <template #title>
        <span class="modal-title"> {{ modalConfig.pageTitle  }}
        </span>
      </template>
      <template #default>
        <FormPage :menuID="formID" @closeModal="closeModal" :isGetDetail :currentData :activeBtn />
      </template>
    </vxe-modal>

    <!-- 用户授权 -->
    <vxe-modal destroy-on-close v-model="pageConfig.modalVisible" :width="pageConfig.modalW" :height="pageConfig.modalH" id="formModal" resize storage transfer show-zoom show-footer>
      <template #title>
        <span> {{ pageConfig.modelTitle }} </span>
      </template>
      <template #default>
        <el-row :gutter="10">
          <!-- <Form ref="formRef" v-model:formData="form" labelWidth="100px" :formConfig="formConfig" :rules="rules" >
            <template #MENULIST>
              <div class="menuSelect">
                <el-checkbox v-model="menuExpand" @change="handleCheckedTreeExpand($event)">展开/折叠</el-checkbox>
                <el-checkbox v-model="menuNodeAll" @change="handleCheckedTreeNodeAll($event)">全选/全不选</el-checkbox>
                <el-checkbox v-model="menuFandZ">父子联动</el-checkbox>
                <el-tree class="tree-border" :data="AllMenuTree" show-checkbox ref="menuRef" node-key="VALUE" :check-strictly="!menuFandZ" empty-text="暂无数据" :props="TreeProps"></el-tree>
              </div>
            </template>
            <template #PANELID>
                <div>
                  <el-select v-model.trim="form.PANELID" placeholder="请选择" clearable @change="changePANELID" style="width: 100%;">
                    <el-option v-for="item in PANELIDList" :key="item.BILLNO" :label="item.PANEL_NAME" :value="item.BILLNO"></el-option>
                  </el-select>
                </div>
              </template>
          </Form> -->
        </el-row>
      </template>
      <template #footer>
        <el-button type="primary" size="default" @click="formSubmit">保存</el-button>
      </template>
    </vxe-modal>

  </div>

</template>

<script setup name="Button">
import { ElMessageBox } from "element-plus";
import { axiosGet } from "#/common";
import { inject, reactive } from "vue";
import { getUrlParams } from "@/utils";
import { getFormValue, getFormRule } from "@/utils";

import FormPage from "@/views/formPage/index.vue";

import { getMENUBENTree, RoleDetail } from "#/system/role";
import { getAuthRoles } from "#/system/user";

const route = useRoute();
const topButton = defineModel("topButton");
console.log(777, topButton);
const props = defineProps({
  // topButton: {
  //   type: Array,
  // },
  currentData: {
    type: Array,
  },
  treeNode: {},
  sourceType: {
    // 1: 表格 2: 表单
    type: [String, Number],
    default: 1,
  },
});

// 用户授权===============================================================
const data = reactive({
  baseForm: {},
  form: {},
  formConfig: [],
  AllMenuTree: [],
  queryParams: {
    PAGENUM: 1,
    PAGESIZE: 10,
    MODULEID: route.meta.BILLNO,
    PAGEID: route.meta.PBILLNO,
    PK_ORG: undefined,
    PK_DEPT: undefined,
  },
  BILLSTATUS: [
    { LABEL: "正常", VALUE: "1", COLOR: "primary" },
    { LABEL: "停用", VALUE: "0", COLOR: "danger" },
    { LABEL: "锁定", VALUE: "2", COLOR: "danger" },
  ],
  rules: {},
  TreeProps: {
    label: "LABEL",
    children: "CHILDREN",
    disabled: (data) => {
      let { VALUE } = data;
      return roleData.value.includes(VALUE);
    },
  },
});
const roleData = ref([]);
const {
  queryParams,
  baseForm,
  form,
  formConfig,
  BILLSTATUS,
  AllMenuTree,
  rules,
  TreeProps,
} = toRefs(data);
// 菜单权限相关
const menuRef = ref();
const menuExpand = ref(false);
const menuNodeAll = ref(false);
const menuFandZ = ref(true);

// 弹窗
const pageConfig = reactive({
  modalVisible: false,
  modalW: "50%",
  modalH: "50%",
  modelTitle: "",
});

const isGetDetail = ref(false);
const activeBtn = ref(null);
function closeModal() {
  modalConfig.modalVisible = false;
}

// 初始化 用户授权 表单store
const initPERMISSForm = () => {
  let config = [
    {
      FIELD: "VNAME",
      LABEL: "用户",
      COL: 24,
      CONTROLS: "ExReadCard",
      ISREQUIRE: 1,
      ISSHOW: 1,
      OTHER: "",
    },
    {
      FIELD: "ROLENAME",
      LABEL: "角色",
      COL: 24,
      CONTROLS: "ExReadCard",
      ISREQUIRE: 1,
      ISSHOW: 1,
      OTHER: "",
    },
    {
      FIELD: "MENULIST",
      LABEL: "菜单权限",
      COL: 24,
      CONTROLS: "slot",
      ISSHOW: 1,
    },
  ];
  formConfig.value = config;
  let formData = getFormValue(config);
  baseForm.value = formData;
  form.value = formData;
  rules.value = getFormRule(config);
  pageConfig.modalW = "600px";
  pageConfig.modalH = "70%";
};
/** 树权限（展开/折叠）*/
function handleCheckedTreeExpand(value) {
  let treeList = AllMenuTree.value;
  // for (let i = 0; i < treeList.length; i++) {
  //   menuRef.value.store.nodesMap[treeList[i].VALUE].expanded = value;
  // }
}

const handlePermiss = (row) => {
  // formType.value = "permiss";
  let { BILLNO, PK_ROLE } = row;

  getMENUBENTree({
    BILLFROM: "0",
  }).then((res) => {
    AllMenuTree.value = res.RESULT;
    initPERMISSForm();
    form.value = row;
    RoleDetail({
      BILLNO: PK_ROLE,
    }).then((res) => {
      roleData.value = [...res.RESULT.MENU, ...res.RESULT.BTN];
      console.log(BILLNO);
      getAuthRoles({ BILLNO }).then((res) => {
        pageConfig.modelTitle = "用户授权";
        let selectMenu = [...roleData.value];
        pageConfig.modalVisible = true;
        if (res.RESULT) {
          selectMenu = [...selectMenu, ...res.RESULT.MENU, ...res.RESULT.BTN];
        }
        nextTick(() => {
          menuExpand.value = true;
          handleCheckedTreeExpand(true);
          // selectMenu.forEach((v) => {
          //   menuRef.value.setChecked(v, true, false);
          // });
        });
      });
    });
  });
};

const MenuID = inject("menuID");
const formID = ref(null);
const { proxy } = getCurrentInstance();
const emit = defineEmits(["handleTopBtn", "reloadTableData"]);

const modalConfig = reactive({
  modalW: 1000,
  modalH: 600,
  pageTitle: "提示",
});

// 打开按钮
const checkList = ref([]);
const pulldownRef = ref(null);
const topButtonExpand = ref([]);

function openPulldown() {
  checkList.value = topButton.value
    .filter((i) => i.ISSHOW == 1)
    .map((i) => i.BILLNO);
  const $pulldown = pulldownRef.value;
  topButtonExpand.value = treeToArray(topButton.value);
  if ($pulldown) {
    $pulldown.togglePanel();
  }
}
function checkboxChange(e) {
  let index = topButton.value.findIndex((i) => i.BILLNO == e.label);
  if (index > 0) {
    topButton.value[index].ISSHOW = e.value ? "1" : "0";
  } else {
    let parentIndex = topButtonExpand.value.findIndex(
      (i) => i.BILLNO == e.label
    );
    let newIndex = topButton.value.findIndex((i) => i.BILLNO == topButtonExpand.value[parentIndex].GROUPID);
    let subIndex = topButton.value[newIndex].CHILDREN.findIndex(
      (i) => i.BILLNO == e.label
    );
    topButton.value[newIndex].CHILDREN[subIndex].ISSHOW = e.value ? "1" : "0";
  }
}

// 扁平化树
function treeToArray(tree) {
  let res = [];
  for (const item of tree) {
    const { CHILDREN, ...i } = item;
    if (CHILDREN && CHILDREN.length) {
      res = res.concat(treeToArray(CHILDREN));
    }
    res.push(i);
  }
  return res;
}

// 设置是否显示按钮

const setShowBtn = (btn) => {
  if (btn.ISSHOW == 0) return false;
  if (btn.ISSHOW == 2 && btn.OTHER) {
    if (!props.currentData.length) {
      return false;
    }
    try {
      for (var i = 0; i < props.currentData.length; i++) {
        let DATA = props.currentData[i];
        // console.error(evilFn( DATA, btn.OTHER));
        if (!evilFn(DATA, btn.OTHER)) {
          return false;
        }
      }
    } catch (error) {
      console.error(error);
    }

    return true;
  } else if (!btn.CHILDREN || !btn.CHILDREN.length) {
    return true;
  }
};

function leftHandleEvent(type) {
  switch (type) {
    case 1:
      emit("handleTopBtn", { type: "openCustomPlan" });
      break;
    case 2:
      emit("reloadTableData");
      break;
  }
}

// proxy.$emit("handelEvent", { data, row: null });

// 表格的顶部按钮操作
function handleEvent(data) {
  console.log("handelEvent", data);
  let selectRecords = props.currentData;

  activeBtn.value = data;
  // 表单中的按钮事件直接调
  if (props.sourceType == 2) {
    return emit("handleBtnEvent", data);
  }

  // 如果弹窗大小的值存在就进行设置弹窗大小  VTYPE =2  7  是开弹窗
  if (data.RATIO) {
    let WWHH =
      data.RATIO != 1 ? data.RATIO.split("*") : data.PAGEPATH.split("*");
  } else {
  }

  // 打开弹窗
  if (
    data.VTYPE == 2 ||
    data.VTYPE == 20 ||
    data.VTYPE == 1 ||
    data.VTYPE == 27
  ) {
    if (data.ACTION == "EDIT") {
      if (!props.currentData.length) {
        return proxy.$message.warning("请先选择数据再操作");
      }
      isGetDetail.value = true;
    }
    modalConfig.modalVisible = true;
    formID.value = {
      MODULEID: data.PK_MODULE,
      PAGEID: data.PK_PAGE,
    };
  } else if (data.VTYPE == 3) {
    //  选中数据并提交
    let dataChoose = props.currentData;

    if (!dataChoose || !dataChoose.length) {
      return proxy.$message.warning("请先选择数据再操作");
    }

    if (data.ISTWOSURE == 1) {
      needConfirm(data, dataChoose);
    } else {
      submitByBtn(data, dataChoose);
    }
  } else if (data.VTYPE == "5") {
    /** 查询方式 提交查询条件参数  */
    let dataChoose = currentData.value;
    if (data.ISCHOOSE == 1) {
      dataChoose = currentData.value[0];
    } else if (data.ISCHOOSE == 2) {
      dataChoose = currentData.value;
    }
    if (data.ISTWOSURE == 1) {
      needConfirm(data, { ...queryJson.value, CHOOSE: dataChoose });
    } else {
      submitByBtn(data, { ...queryJson.value, CHOOSE: dataChoose });
    }
  } else if (data.VTYPE == 7 && data.ACTION == "QRY") {
  } else if (data.VTYPE == 13) {
    //  文件流下载 导出
    let chooseData = currentData.value
      ? currentData.value.map((i) => i.BILLNO).join(",")
      : "";
    let PARENTPAGE = pageConfig.mainTable.length ? routerParams.ACTION : "";
    let UrlData = getUrlParams(data.ACTIONADDRESS);
    let aaDown = {
      APPID: "",
      // DATA: data.ISTWOSURE == 1 ? { BILLNO: currentData.value[0].BILLNO , ...queryJson.value } : {},
      DATA: { CHOOSEBILLNO: chooseData, ...queryJson.value, ...UrlData },
      KEY: "",
      MODULEID: routerParams.BILLNO,
      PAGEID: pageConfig.activeBtn.PK_PAGE,
      PARENTPAGE: PARENTPAGE,
      VERSION: "",
    };
    handleExport(data.ACTIONADDRESS, aaDown);
  } else if (data.VTYPE == 15) {
    // 文件路径下载
    downFilesByUrl(data);
  } else if (data.VTYPE == 21) {
    console.log(selectRecords);
    switch (data.BTNTITLE) {
      case "userAuthorization": // 用户授权
        handlePermiss(selectRecords[0]);
        break;
      case "userOrgScope": // 用户组织授权
        // emit('update', 'hour', cycleTotal.value, 'hour')
        break;
      // case 3:
      //     emit('update', 'hour', averageTotal.value, 'hour')
      //     break
      // case 4:
      //     if (checkboxList.value.length === 0) {
      //         checkboxList.value.push(checkCopy.value[0])
      //     } else {
      //         checkCopy.value = checkboxList.value
      //     }
      //     emit('update', 'hour', checkboxString.value, 'hour')
      //     break
    }
    //
  }
}

// 二次确认事件
function needConfirm(data, selectRecords) {
  ElMessageBox.confirm(`您确定要执行${data.VNAME}吗?`, "确认提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    submitByBtn(data, selectRecords);
  });
}

// 执行按钮提交前的数据格式校验
function submitByBtn(btn, data) {
  let params = btn.ACTIONADDRESS.includes("?")
      ? getUrlParams(btn.ACTIONADDRESS)
      : {},
    sdata = null;
  if (btn.ACTION == "DELETE" || btn.ISCHOOSE == 2) {
    let arr = [];
    if (btn.VTYPE == 20) {
      arr.push(treeNode.value.VALUE);
    } else {
      arr = props.currentData.map((i) => {
        return i.BILLNO;
      });
    }
    sdata = { data: arr };
  } else {
    // sdata = { ...data, ...params };
    sdata = {
      CHOOSEDATA: Array.isArray(data) ? data : [data],
      // ...data,
      ...params,
    };
  }
  sdata.MODULEID = btn.PK_MODULE;
  sdata.PAGEID = btn.PK_PAGE;

  submitEvent(btn.ACTIONADDRESS, sdata);
}

// 数据提交
function submitEvent(URL, sdata) {
  axiosGet(URL, sdata).then((res) => {
    let { MESSAGE, SUCCESS } = res;
    if (SUCCESS) {
      proxy.$message({
        message: MESSAGE,
        type: "success",
      });
      emit("reloadTableData");
    }
  });
}

function evilFn(row, fn) {
  const DATA = JSON.parse(JSON.stringify(row)) || Object.create(null);
  let Fn = new Function("DATA", `return ${fn}`);
  const proxy = new Proxy(DATA, {
    has(target, key) {
      return true;
    },
  });
  return Fn(proxy);
}
</script>

<style lang="scss" scoped>
.fixed-top-button {
  display: flex;

  .buttom-item {
    padding: 0 12px;
    font-size: 14px;
    cursor: pointer;
    line-height: 48px;
    color: #515967;
    &:hover {
      color: var(--el-color-primary);
      background-color: #cfddff;
    }
  }
}

.top-button {
  width: 100%;
  display: flex;
  justify-content: space-between;
  background-color: white;
  height: 46px;
  line-height: 46px;
  background: #fff;
  box-shadow: 0px 3px 7px 0px rgba(17, 50, 130, 0.09);
  &-right {
    cursor: pointer;
    display: flex;
    .tool-wrap {
      height: 46px;
      padding: 0 12px;
      line-height: 46px;
      &:hover {
        color: var(--el-color-primary);
        background-color: #cfddff;
      }
    }
  }
}

.my-dropdown3 {
  width: 200px !important;
  position: relative;
  left: -155px;
  padding: 5px 0 0 10px;
  border: 1px solid var(--el-border-color);
  z-index: 10000;
  background-color: #fff;
}

.font-16 {
  font-size: 16px;
}
</style>
