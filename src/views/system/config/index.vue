<template>
  <div class="page-config">
    <el-row>
      <el-col :span="4">
        <div class="group">
          <div class="head-container">
            <el-input v-model="keyword" placeholder="请输入模块名称" clearable prefix-icon="Search" style="margin-bottom: 5px" />
          </div>
          <div class="head-container">
            <el-scrollbar :height="treeHeight" class="tree-border">
              <el-tree :data="menuOptions" accordion :props="{ label: 'LABEL', children: 'CHILDREN' }" node-key="VALUE" :default-expanded-keys="treeDefaultExpandedKeys" :filter-node-method="filterNode" ref="treeRef" highlight-current @node-click="handleNodeClick" />
            </el-scrollbar>
          </div>
        </div>
      </el-col>
      <el-col :span="20">
        <div id="screen" class="top-btn tabs group">
          <template v-if="TabsList.length > 0">
            <el-row ref="btnboxRef" class="tabs-btn" :gutter="5">
              <el-col :span="1.5">
                <el-button plain :icon="FullScreen" @click="bigTable" />
              </el-col>
              <el-col :span="1.5">
                <el-button plain @click="previw" type="primary">预览</el-button>
              </el-col>
              <el-col :span="1.5" v-if="configForm.formValue.GROUPNO != 'BTN' &&configForm.formValue.GROUPNO != 'QRY'">
                <el-button plain @click="createConfig" type="primary">一键生成</el-button>
              </el-col>
              <el-col :span="1.5">
                <el-button plain @click="copyMenuOpen">引入</el-button>
              </el-col>
              <el-col :span="1.5">
                <el-button plain @click="plusTabs">新增</el-button>
              </el-col>
              <el-col :span="1.5">
                <el-button plain @click="SubmitConfig" type="primary">保存</el-button>
              </el-col>
            </el-row>
            <el-tabs v-model="activeTab" type="border-card" size="mini" :before-leave="beforeTabsChange">
              <el-tab-pane v-for="(item, index) in TabsList" :key="item.BILLNO" :label="item.VNAME" :name="index">
                <template #label>
                  <el-tooltip effect="light" :content="item.BILLNO" placement="bottom">
                    <div class="tab-name">
                      {{ item.VNAME }}
                      <template v-if="activeTabRow.BILLNO == item.BILLNO && activeTabRow.VNAME == item.VNAME">
                        <template v-if="item.GROUPNO !='QRY' && item.GROUPNO!='BTN'">
                          <Notification @click="EditTabs" style="width: 1em; height: 1em; margin-left: 8px" />
                          <Close v-if="item.ISDELETE == '1'" @click="DelTabs" style="width: 1em; height: 1em; margin-left: 8px" />
                        </template>
                      </template>
                    </div>
                  </el-tooltip>
                </template>
              </el-tab-pane>
            </el-tabs>
            <div class="tabs-content" v-loading="loading">
              <eos-form v-if="configForm.formColumns.length > 0 && configForm.formValue.GROUPNO != 'QRY' && configForm.formValue.GROUPNO != 'BTN'" ref="TableForm" v-model="configForm.formValue" :config="configForm.formColumns" labelWidth="auto" />
              <Etable ref="ETableRef" :tableCFG="tableCFG" v-model:tableData="tableData" :validRules="tableRules" :actionBarWidth="110" @change="tableChange" @headerClick="headerClick">
                <template #default_TERMINALTYPE="{ row, config }">
                  <popOver v-model="row.TERMINALTYPE" :config="config" width="100px" />
                </template>
                <template #edit_TERMINALTYPE="{ row, config }">
                  <popOver v-model="row.TERMINALTYPE" :config="config" width="100px" />
                </template>
                <template #default_FUNCTYPE="{ row, config }">
                  <popOver v-model="row.FUNCTYPE" :config="config" width="100px" />
                </template>
                <template #edit_FUNCTYPE="{ row, config }">
                  <popOver v-model="row.FUNCTYPE" :config="config" width="100px" />
                </template>
                <template #edit_PK_PAGE="{ row }">
                  <el-select v-model="row.PK_PAGE" :teleported="false">
                    <el-option v-for="item in selectTabList" :key="item.BILLNO" :label="item.VNAME" :value="item.BILLNO" />
                    <el-option label="自定义" value="slot" />
                  </el-select>
                </template>
                <template #default_PK_PAGE="{ row }">
                  {{ getTabsName(row.PK_PAGE) }}
                </template>
                <template #edit_PK_PARENT="{ row }">
                  <el-select v-model="row.PK_PARENT" :teleported="false">
                    <el-option v-for="item in selectTabList" :key="item.BILLNO" :label="item.VNAME" :value="item.BILLNO" />
                  </el-select>
                </template>
                <template #default_PK_PARENT="{ row }">
                  {{ getTabsName(row.PK_PARENT) }}
                </template>
                <template #edit_GROUPID="{ row }">
                  <el-select v-model="row.GROUPID" clearable :teleported="false">
                    <el-option v-for="item in BTNGROUP" :key="item.VALUE" :label="item.LABEL" :value="item.VALUE" />
                  </el-select>
                </template>
                <template #default_GROUPID="{ row }">
                  {{ DictLabel(BTNGROUP, row.GROUPID) }}
                </template>
                <template #actionBar="{ row, rowIndex }">
                  <el-row :gutter="10">
                    <el-col :span="1.5">
                      <el-link :icon="Plus" @click.stop="plusConfig(rowIndex)" />
                    </el-col>
                    <el-col :span="1.5">
                      <el-link :icon="Delete" @click.stop="delConfig(row)" />
                    </el-col>
                    <el-col :span="1.5">
                      <el-link :icon="Notification" @click.stop="editConfig(row)" />
                    </el-col>
                    <el-col :span="1.5">
                      <el-link :icon="CopyDocument" @click.stop="copyConfig(rowIndex)" />
                    </el-col>
                  </el-row>
                </template>
              </Etable>
            </div>
          </template>
          <el-empty v-else :image="emptyImg" description="很抱歉，暂时没有相关数据~" :image-size="200">
            <el-button @click="plusTabs">去新建</el-button>
          </el-empty>
        </div>
      </el-col>
    </el-row>

    <vxe-modal destroy-on-close v-model="pageConfig.modalVisible" :width="pageConfig.modalW" :height="pageConfig.modalH" id="formModal" resize storage transfer show-zoom show-footer>
      <template #title>
        <span> {{ pageConfig.modelTitle }} </span>
      </template>
      <template #default>
        <eos-form ref="formRef" v-model="formConfig.formValue" :config="formConfig.formColumns" :detail="false">
          <template #TERMINALTYPE="{ data, config }">
            <popOver v-model="data.TERMINALTYPE" :config="config" width="100px" />
          </template>
          <template #FUNCTYPE="{ data, config }">
            <popOver v-model="data.FUNCTYPE" :config="config" width="100px" />
          </template>
          <template #PK_PARENT="{ data }">
            <el-select v-model="data.PK_PARENT" :teleported="false">
              <el-option v-for="item in selectTabList" :key="item.BILLNO" :label="item.VNAME" :value="item.BILLNO" />
            </el-select>
          </template>
          <template #PK_PAGE="{ data }">
            <el-select v-model="data.PK_PAGE">
              <el-option v-for="item in selectTabList" :key="item.BILLNO" :label="item.VNAME" :value="item.BILLNO" />
              <el-option label="自定义" value="slot" />
            </el-select>
          </template>
        </eos-form>
      </template>
      <template #footer>
        <el-button size="default" @click="formSubmit"> 保存 </el-button>
      </template>
    </vxe-modal>

    <!-- 预览功能 -->
    <vxe-modal destroy-on-close v-model="previwVisible" :width="pageConfig.modalW" :height="pageConfig.modalH" id="formModal" resize storage transfer show-zoom show-footer>
      <template #title>
        <span> {{ configForm.formValue.VNAME }} </span>
      </template>
      <template #default>
        <!-- <Form ref="formRef" v-if="configForm.formValue.GROUPNO== 'FM' " v-model:formData="previwForm.Data" :formConfig="previwForm.formColumns" :rules="previwForm.formRules">
        </Form> -->
        <!-- <Vtable :tableCFG="previwTableCFG" :tableData="[]" v-else /> -->
      </template>
      <template #footer>
      </template>
    </vxe-modal>

    <!-- 引入 -->
    <copyMenuComponent ref="copyMenuRef" :treeData="menuOptions" @submit="copyMenu" />
  </div>
</template>

<script setup name="config">
import {
  TreeMenu,
  MenuTabs,
  MenuTabsDetail,
  MenuTabsConfigDetail,
  MenuTabsAdd,
  MenuTabsDelete,
  SaveMenuTabsConfig,
  delMenuTabsConfig,
  createdConfig,
  TableConfig_Form,
  TableConfig_Qty,
  TableConfig_Table,
  TableConfig_Btn,
  FormConfig,
  delMenuBtn,
} from "#/system/config";
import popOver from "./popover"
import Etable from "@/components/Vxtable/edit";
import copyMenuComponent from "./copyMenu";
import { getFormValue, getFormRule, deepClone } from "@/utils";
import {
  Plus,
  Delete,
  Edit,
  FullScreen,
  Notification,
  CopyDocument,
  Close,
} from "@element-plus/icons-vue";
import screenfull from "screenfull";
import PinyinMatch from "pinyin-match";
import Vtable from "@/components/Vxtable";

const { proxy } = getCurrentInstance();
const keyword = ref("");
watch(keyword, (val) => {
  treeRef.value.filter(val);
});
const menuOptions = ref([]);
const emptyImg = proxy.getAssetsFile("icon_task_NoData.png");

const treeHeight = window.innerHeight - 135;
// 左侧树
const treeRef = ref();
const treeDefaultExpandedKeys = ref([])
const TreeActive = ref();
const getMenuList = () => {
  let query = { KEYWORD: keyword.value, ISRELATE: 1 };
  TreeMenu(query).then((res) => {
    menuOptions.value = res.RESULT;
    treeDefaultExpandedKeys.value = [res.RESULT[0].VALUE]
  });
};
getMenuList();
const filterNode = (value, data) => {
  if (!value) return true;
  return PinyinMatch.match(data.LABEL, keyword.value);
};
const handleNodeClick = (val) => {
  if (TreeActive.value == val.VALUE) return;
  TreeActive.value = val.VALUE;
  if (val.CHILDREN.length == 0) getTabsList(val.VALUE);
};

// tabs
const activeTab = ref(0);
const activeTabRow = ref({});
const TabsList = ref([]);
const selectTabList = ref([]);
const getTabsList = (value) => {
  MenuTabs(value).then((newRes) => {
    let res = newRes.RESULT;
    if (res.length == 0) return;
    TabsList.value = res;
    selectTabList.value = res.filter(
      (el) => el.GROUPNO != "QRY" && el.GROUPNO != "BTN"
    );
    if (activeTab.value + 1 > res.length) activeTab.value = 0;
    activeTabRow.value = res[activeTab.value];
    configForm.formValue = { ...configForm.formBase, ...activeTabRow.value };
    setTableConfig();
    getMenuConfig();
  });
};
watch(activeTab, () => {
  activeTabRow.value = TabsList.value[activeTab.value];
  configForm.formValue = { ...configForm.formBase, ...activeTabRow.value };
  tableCheck.value = [];
  setTableConfig();
  getMenuConfig();
});
const beforeTabsChange = (val, oldval) => {
  return new Promise((resolve, reject) => {
    if (EditTableData()) {
      proxy.$modal.confirm("是否切换页面？系统可能不会保存您所做的更改").then(() => {
        tableCheck.value = [];
        resolve();
      }).catch(() => {
        reject();
      });
    } else {
      resolve();
    }
  });
};

// 新增页面
const plusTabs = () => {
  let formData = getFormValue(FormConfig);
  formConfig.formColumns = FormConfig;
  formConfig.formBase = formData;
  formConfig.formValue = JSON.parse(JSON.stringify(formData));
  formConfig.formValue.PK_MODULE = TreeActive.value;
  formConfig.formValue.MODULENAME = treeFind(menuOptions.value, (el) => el.VALUE == activeTabRow.value.PK_MODULE).LABEL;
  formConfig.formRules = getFormRule(FormConfig);
  pageConfig.modelTitle = "新增自定义页面";
  formType.value = "add";
  pageConfig.modalVisible = true;
};
const EditTabs = () => {
  let formData = getFormValue(FormConfig);
  formConfig.formColumns = FormConfig;
  formConfig.formBase = formData;
  formData.MODULENAME = treeFind(menuOptions.value, (el) => el.VALUE == activeTabRow.value.PK_MODULE).LABEL;
  formConfig.formValue = { ...formData, ...activeTabRow.value };
  formConfig.formRules = getFormRule(FormConfig);
  pageConfig.modelTitle = "编辑自定义页面";
  formType.value = "edit";
  pageConfig.modalVisible = true;
};
const DelTabs = () => {
  proxy.$modal.confirm("是否确定删除？").then((res) => {
    let id = activeTabRow.value.BILLNO;
    MenuTabsDelete({
      data: [id],
      MODULEID: TreeActive.value,
    }).then((res) => {
      getTabsList(TreeActive.value);
    });
  });
};

// 根据 页面类型-GROUP 切换 表格配置
const setTableConfig = async () => {
  let { GROUPNO } = activeTabRow.value;
  tableCFG.hasCheck = true;
  switch (GROUPNO) {
    case "FM":
      tableCFG.tableColumns = TableConfig_Form;
      break;
    case "QRY":
      tableCFG.tableColumns = TableConfig_Qty;
      break;
    case "TAB":
      tableCFG.tableColumns = TableConfig_Table;
      break;
    case "BTN":
      tableCFG.tableColumns = TableConfig_Btn;
      break;
  }
  BaseRowData.value = JSON.parse(JSON.stringify(getFormValue(tableCFG.tableColumns)));
  tableRules.value = getFormRule(tableCFG.tableColumns);
  tableCFG.height = window.innerHeight - 195;
};

// 一键生成配置
const createConfig = () => {
  let data = configForm.formValue;
  if (!data.TBVWID || !data.VCODE) return proxy.$modal.msgWarning("请选择维护关联表及编码");
  proxy.$modal.confirm("是否一键生成配置？").then((res) => {
    createdConfig({
      BILLNO: data.BILLNO,
      PK_MODULE: data.PK_MODULE,
      GROUPNO: data.GROUPNO,
      TBVWID: data.TBVWID,
      VCODE: data.VCODE,
    }).then((res) => {
      getTabsList(TreeActive.value);
    });
  });
};

const loading = ref(false);

// 表格
const ETableRef = ref();
const TableForm = ref();
const configForm = reactive({
  formBase: {},
  formValue: {}, // form数据
  formColumns: [], // form配置(已过滤显示)
  formRules: {}, // form验证
});
const initConfigForm = () => {
  let config = FormConfig.filter((el) => el.ISCY).map((el) => {
    el.COL = "8";
    return el;
  });
  let formData = getFormValue(config);
  configForm.formBase = formData;
  configForm.formColumns = config;
  configForm.formValue = JSON.parse(JSON.stringify(formData));
  configForm.formRules = getFormRule(config);
};
initConfigForm();

// 表格
const BaseRowData = ref({});
const tableCheck = ref([]);
const tableData = ref([]);
const getMenuConfig = () => {
  const row = activeTabRow.value;
  loading.value = true;
  MenuTabsConfigDetail({
    PK_MODULE: row.PK_MODULE,
    PK_PAGE: row.BILLNO,
    GROUPNO: row.GROUPNO,
  })
    .then((newRes) => {
      let res = newRes.RESULT;
      if (res.length == 0) {
        BaseRowData.value.PK_PAGE = row.BILLNO;
        BaseRowData.value.GROUPNO = row.GROUPNO;
        res = [BaseRowData.value];
      }
      tableData.value = res.map((el) => {
        el = { ...BaseRowData.value, ...el };
        return el;
      });
      ETableRef.value.xEditTable.reloadData(tableData.value);
    })
    .finally(() => {
      loading.value = false;
    });
};
const tableCFG = reactive({
  tableColumns: TableConfig_Form,
  tableButtons: ["ADD", "EDIT", "DELETE"],
  hasTableTools: false,
  hasSeq: false,
  toolsConfig: [],
  loading: false,
  height: window.innerHeight - 195,
});
console.log(tableCFG);
const tableRules = ref({});
const EditTableData = () => {
  let { insertRecords, updateRecords, removeRecords } = ETableRef.value.xEditTable.getRecordset();
  return insertRecords.length + updateRecords.length + removeRecords.length > 0;
};
const getTabsName = (id) => {
  if (id == "" || id == null || id == undefined) return "";
  if (id == "slot") return "自定义";
  let data = selectTabList.value.find((el) => el.BILLNO == id);
  if (!data) return id;
  return data.VNAME;
};
const tableChange = (data) => {
  tableCheck.value = data;
};

// Table操作
const plusConfig = (rowIndex) => {
  rowIndex += 1;
  const actionTab = activeTabRow.value;
  BaseRowData.value.PK_PAGE = actionTab.BILLNO;
  BaseRowData.value.GROUPNO = actionTab.GROUPNO;
  if (tableData.value.length <= rowIndex) rowIndex = -1;
  ETableRef.value.xEditTable.insertAt({ ...BaseRowData.value }, rowIndex);
};
const editRow = ref();
const editConfig = (row) => {
  editRow.value = row;
  let formData = getFormValue(tableCFG.tableColumns);
  formConfig.formColumns = tableCFG.tableColumns;
  formConfig.formBase = formData;
  formConfig.formValue = { ...formData, ...row };
  formConfig.formValue.PK_MODULE = TreeActive.value;
  formConfig.formRules = getFormRule(tableCFG.tableColumns);
  pageConfig.modelTitle = "修改配置";
  formType.value = "edit";
  pageConfig.modalVisible = true;
};
const delConfig = (row) => {
  if (tableCheck.value.length > 0) {
    proxy.$modal.confirm("是否删除选中的配置？").then((res) => {
      let newRows = tableCheck.value.filter((el) => el.BILLNO == undefined);
      if (newRows.length > 0) {
        for (let i = 0; i < newRows.length; i++) {
          const el = newRows[i];
          ETableRef.value.xEditTable.remove(el);
        }
      }
      let ids = tableCheck.value.filter((el) => el.BILLNO != undefined);
      if (ids.length > 0)
        delMenuTabsConfig({
          data: ids.map((el) => el.BILLNO),
        }).then((res) => {
          proxy.$modal.msgSuccess("删除成功");
          getTabsList(TreeActive.value);
        });
    });
  } else {
    let { BILLNO } = row;
    proxy.$modal.confirm("是否删除配置？").then((res) => {
      if (!BILLNO) {
        ETableRef.value.xEditTable.remove(row);
      } else {
        if (configForm.formValue.GROUPNO == "BTN") {
          delMenuBtn({
            data: [BILLNO],
          }).then((res) => {
            proxy.$modal.msgSuccess("删除成功");
            ETableRef.value.xEditTable.remove(row);
          });
        } else {
          delMenuTabsConfig({
            data: [BILLNO],
          }).then((res) => {
            proxy.$modal.msgSuccess("删除成功");
            ETableRef.value.xEditTable.remove(row);
          });
        }
      }
    });
  }
};
const copyConfig = (rowIndex) => {
  let row = deepClone(tableData.value[rowIndex]);
  delete row._X_ROW_KEY;
  delete row.BILLNO;
  let newRowIndex = rowIndex + 1;
  if (tableData.value.length == newRowIndex) newRowIndex = -1;
  ETableRef.value.xEditTable.insertAt({ ...row }, newRowIndex);
};
//批量修改
function headerClick(id) {
  let config = tableCFG.tableColumns.find((el) => el.FIELD == id);
  let formData = getFormValue([config]);
  formConfig.formColumns = [config];
  formConfig.formBase = formData;
  formConfig.formValue = { ...formData };
  formConfig.formValue.PK_MODULE = TreeActive.value;
  formConfig.formRules = getFormRule([config]);
  pageConfig.modelTitle = "批量修改" + config.LABEL;
  // pageConfig.modalW = '40%'
  // pageConfig.modalH = '40%'
  formType.value = "edits";
  pageConfig.modalVisible = true;
}
const SubmitConfig = () => {
  if (TableForm.value) {
    // 表单 表格 查询
    TableForm.value.validate().then((valid) => {
      if (!valid) return;
      ETableRef.value.xEditTable.validate(true).then((valid) => {
        if (valid != undefined) return;
        let { insertRecords, updateRecords } =
          ETableRef.value.xEditTable.getRecordset();
        let tableData = [...insertRecords, ...updateRecords];
        tableData = tableData.map((el) => {
          delete el.EnumData;
          return el;
        });
        SaveMenuTabsConfig({
          ...configForm.formValue,
          COLUMNS: tableData,
          MODULEID: TreeActive.value,
        }).then((res) => {
          proxy.$modal.msgSuccess("提交成功");
          getTabsList(TreeActive.value);
        });
      });
    });
  } else {
    // 按钮
    ETableRef.value.xEditTable.validate(true).then((valid) => {
      if (valid != undefined) return;
      let { tableData } = ETableRef.value.xEditTable.getTableData();
      tableData = tableData.map((el) => {
        delete el.EnumData;
        return el;
      });
      SaveMenuTabsConfig({
        ...configForm.formValue,
        COLUMNS: tableData,
        MODULEID: TreeActive.value,
      }).then((res) => {
        proxy.$modal.msgSuccess("提交成功");
        getTabsList(TreeActive.value);
      });
    });
  }
};

// 预览功能
const previwVisible = ref(false);
const previwForm = ref({
  formRules: null,
  formColumns: [],
  Data: null,
});

const previwTableCFG = reactive({
  tableColumns: [],
  hasTableTools: false, // 是否有操作栏
  hasSeq: false, // 是否显示序号
  toolsConfig: [],
  loading: false,
  hasFill: true, // 表格补位
  height: 300,
  // SelectType: 'checkbox',
});

const previw = () => {
  let { tableData } = ETableRef.value.xEditTable.getTableData();
  if (TableForm.value) {
    previwForm.value.formRules = getFormRule(tableData);
    previwForm.value.formColumns = tableData;
    previwForm.value.Data = getFormValue(tableData);
    previwTableCFG.tableColumns = tableData;
    previwVisible.value = true;
  }
};

// 局部全屏
const bigTable = () => {
  const ele = document.getElementById("screen"); //指定全屏区域元素
  screenfull.on("change", () => {
    if (!screenfull.isFullscreen) tableCFG.height = window.innerHeight - 195;
  });
  if (screenfull.isEnabled) {
    tableCFG.height = window.innerHeight - 30;
    screenfull.toggle(ele);
  }
};

// 新增Form
const formRef = ref();
const formType = ref("");
const pageConfig = reactive({
  modalVisible: false,
  modalW: "80%",
  modalH: "70%",
  modelTitle: "新增自定义页面",
});
const formConfig = reactive({
  formBase: {}, // 表单源数据
  formValue: {}, // form数据
  formColumns: [], // form配置(已过滤显示)
  formRules: {}, // form验证
});
const formSubmit = () => {
  formRef.value.validate().then((valid) => {
    if (!valid) return;
    if (formType.value == "add" || formType.value == "edit") {
      formConfig.formValue.ISDELETE = "1";
      MenuTabsAdd(formConfig.formValue).then((res) => {
        proxy.$modal.msgSuccess("提交成功");
        getTabsList(TreeActive.value);
        pageConfig.modalVisible = false;
      });
    } else if (formType.value == "edits") {
      let { fullData } = ETableRef.value.xEditTable.getTableData();
      let tableData = [...fullData];
      for (let index = 0; index < tableData.length; index++) {
        let a = formConfig.formColumns[0].FIELD;
        const element = tableData[index];
        element[a] = formConfig.formValue[a];
      }
      pageConfig.modalVisible = false;
    } else {
      Object.assign(editRow.value, formConfig.formValue);
      SubmitConfig();
      pageConfig.modalVisible = false;
    }
  });
};

// 查找树结构中的数据
function treeFind(tree, func, found = { value: false }) {
  for (const data of tree) {
    if (func(data)) {
      found.value = true;
      return data;
    }
    if (data.CHILDREN || data.children) {
      const res = treeFind(data.CHILDREN || data.children, func, found);
      if (res) return res;
      if (found.value) found.value = false;
    }
  }
  return null;
}

// 引入
const copyMenuRef = ref(null);
const copyMenuOpen = () => copyMenuRef.value.open();
const copyMenu = (res) => {
  const row = activeTabRow.value;
  let data = [
    ...res.map((el) => {
      el = { ...BaseRowData.value, ...el };
      el.PK_PAGE = row.BILLNO;
      el.GROUPNO = row.GROUPNO;
      return el;
    }),
  ];
  ETableRef.value.xEditTable.insert(data);
};

// 按钮分组
const btnGroupList = ref([]);
const { BTNGROUP } = proxy.useDict("BTNGROUP");
const DictLabel = (arr, data) => {
  arr = arr == undefined ? [] : arr;
  return proxy.selectDictLabel(arr, data);
};
</script>

<style lang="scss" scoped>
// .app-container {
//   padding: 10px 0 0;
//   box-sizing: border-box;
//   overflow: hidden;
// }
:deep(.el-tabs__nav-wrap) {
  width: calc(100% - 404px);
  .el-tabs__nav-prev {
    left: 4px;
  }
  .el-tabs__nav-next,
  .el-tabs__nav-prev {
    line-height: 40px;
    font-weight: 400;
  }
}
:deep(.el-tabs__content) {
  padding: 0;
}
:deep(.el-tabs--border-card) {
  border-bottom: none;
}
:deep(.el-tabs__new-tab) {
  margin-right: 10px;
  font-size: 18px;
}
:deep(.el-tabs__item .is-icon-close) {
  position: absolute;
  top: 50%;
  right: 3px;
  transform: translateY(-50%);
}
.tab-name {
  display: flex;
  align-items: center;
}
.tabs {
  position: relative;
  &-btn {
    position: absolute;
    top: 11px;
    right: 11px;
    z-index: 2;
  }
  &-content {
    padding: 10px 10px 0;
    box-sizing: border-box;
    border: 1px solid var(--el-border-color);
    border-top: none;
  }
}
#screen {
  background: #fff;
  min-height: calc(100vh - 110px);
  box-sizing: border-box;
  position: relative;
}
.group {
  padding: 8px;
  background: #fff;
}
:deep(.el-empty) {
  // height: calc(87vh + 2px);
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  margin: 0 auto;
}
:deep(.eos-form) {
  .form-group-no-title {
    padding-top: 0;
  }
}

.page-config{
  padding: 0 10px;
}
</style>
