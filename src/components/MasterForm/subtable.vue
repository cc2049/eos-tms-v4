<template>
  <div class="formTable-title">
    <div class="title" v-if="showTitle">{{title}}</div>
    <template v-if="!detail">
      <div class="saveAndAdd" v-if="ShowType == 'form'">
        <eos-form ref="editFormRef" class="subForm" v-model="form" v-model:mainFormData="mainFormData" :config="tableCFG.tableColumns" @openModal="openModal" />
        <el-button class="mb10" type="primary" plain size="default" @click="formSubmit">保存并新增</el-button>
      </div>
      <div class="btn" v-if="ShowType == 'modal'">
        <slot name="modalBtnBefore" />
        <el-link class="btn-item icon-plus" v-if="Eval_ShowBtn(AddBtnConfig)" type="primary" @click="plusRow()">添加</el-link>
        <el-link class="btn-item icon-edit" v-if="ShowType != 'form' && Eval_ShowBtn(EditBtnConfig)" type="warning" :disabled="checkData.length == 0" @click="editRow()">编辑</el-link>
        <el-link class="btn-item icon-delete" v-if="newData.length > 0 && Eval_ShowBtn(DeleteBtnConfig)" type="danger" :disabled="checkData.length == 0" @click="delRow()">删除</el-link>
        <slot name="modalBtnAfter" />
      </div>
    </template>
  </div>

  <component ref="subFormRef" :key="Field" :is="config.GROUPNO == 'FM' ? Form : (detail || ShowType == 'form' || ShowType == 'modal') ? VTable : ETable" :detail="detail" :mainFormData="mainFormData" v-model:formData="newData" :formConfig="config.COLUMNS" :rules="Rules" :tableCFG="tableCFG" v-model:tableData="newData" :validRules="Rules" :othConfig="othConfig" :actionBar="!detail && ShowType!='modal'" :actionBarWidth="90" @change="EtbaleChange" @updateTableData="updateTableData">
    <template #actionBar="{ row, rowIndex }">
      <el-row :gutter="5">
        <template v-if="detail">
          <el-col :span="1.5" v-for="btni in ButtonConfig" :key="btni.BILLNO">
            <el-link @click="BtnEvent(btni, row, rowIndex)">{{btni.VNAME}}</el-link>
          </el-col>
        </template>
        <template v-else>
          <el-col :span="8" v-if="ShowType != 'form' && Eval_ShowBtn(AddBtnConfig)">
            <el-link :icon="Plus" @click="plusRow" />
          </el-col>
          <el-col :span="8" v-if="ShowType !='row' ? Eval_ShowBtn(DeleteBtnConfig) : rowIndex > 0 && Eval_ShowBtn(DeleteBtnConfig)">
            <el-link :icon="Delete" @click="delRow(row)" />
          </el-col>
          <el-col :span="8" v-if="Eval_ShowBtn(EditBtnConfig)">
            <el-link :icon="Notification" @click="editRow(row)" />
          </el-col>
        </template>
      </el-row>
    </template>
  </component>

  <vxe-modal destroy-on-close v-model="pageConfig.modalVisible" :width="pageConfig.modalW" :height="pageConfig.modalH" id="formModal" resize storage transfer show-zoom show-footer>
    <template #title>
      <span> {{ pageConfig.modelTitle }} </span>
    </template>
    <template #default>
      <eos-form ref="editFormRef" mod="subForm" v-model="form" v-model:mainFormData="mainFormData" :config="tableCFG.tableColumns" @openModal="openModal" />
    </template>
    <template #footer>
      <el-button size="default" @click="formSubmit">保存</el-button>
    </template>
  </vxe-modal>
</template>

<script>
export default {
  inheritAttrs: false,
}
</script>
<script setup>
import { ref, reactive, computed, toRefs, getCurrentInstance, watch, onMounted } from "vue";
import ETable from "@/components/Vxtable/edit";
import VTable from "@/components/Vxtable";
import { getFormValue, getFormRule, deepClone, evilFn } from "@/utils";
import { Plus, Delete, Edit, Notification } from "@element-plus/icons-vue";

const props = defineProps({
  modelValue: [Array, Object],
  config: Object,
  title: String,
  showTitle: {
    type: Boolean,
    default: false
  },
  detail: Boolean,
  mainFormData: Object,
  othConfig: Object,
  othTabCFG: Object
})
const emit = defineEmits(["update:modelValue", "update:mainFormData", "change", "openModal"])
const { proxy } = getCurrentInstance();

/** 公用 */
const { config, detail, mainFormData, othConfig, othTabCFG } = toRefs(props)
const subFormRef = ref(null)
const xEditTable = computed(() => subFormRef.value.xEditTable)
const editFormRef = ref(null)
const newData = computed({
  get: () => props.modelValue,
  set: val => emit("update:modelValue", val)
})
const Field = ref(null)

/** 表单 */
const Rules = ref({})
const form = ref({})

/** 表格 */
const checkData = ref([])
const BaseRowData = ref({})
const ButtonConfig = computed(() => config.value.BUTTON)
const tableCFG = reactive({
  tableColumns: [],
  tableButtons: [],
  hasTableTools: false,
  hasSeq: false,
  toolsConfig: [],
  loading: false,
  height: props.config.TABLEHEIGHT || 200,
  hasFill: false, // 表格补位
})

/** 按钮控制 */
const AddBtnConfig = computed(() => ButtonConfig.value.find(el => el.ACTION == "ADD"))
const EditBtnConfig = computed(() => ButtonConfig.value.find(el => el.ACTION == "EDIT"))
const DeleteBtnConfig = computed(() => ButtonConfig.value.find(el => el.ACTION == "DELETE"))
const Eval_ShowBtn = computed(() => {
  return config => {
    if (!config) return false
    const { ISSHOW, OTHER } = config
    if (ISSHOW == "2") {
      let Data = newData.value[0] || {}
      return evilFn(Data, OTHER)
    } else {
      return ISSHOW == '1'
    }
  }
})

const updateTableData = (data) => {
  proxy.$emit("updateTableData", data);
}

/** 累加功能 */
const ETableSUM = computed(() => {
  return tableCFG.tableColumns.filter((el) => el.CONTROLS == "ExNumber" && el.LINKAGE?.includes("SUM")) || []
});

/** 更新数据 */
const updateTable = (data = null, clear = false) => {
  return new Promise((resolve) => {
    let { tableData } = subFormRef.value?.xEditTable.getTableData();
    let updata
    if (clear) {
      updata = Array.isArray(data) ? [...data] : [{ ...data }]
    } else {
      if (data && data?._X_ROW_KEY) {
        let index = tableData.findIndex(el => el._X_ROW_KEY == data._X_ROW_KEY)
        let rowData = tableData[index]
        Object.assign(rowData, data)
        updata = tableData
      } else {
        updata = !data ? tableData : Array.isArray(data) ? [...tableData, ...data] : [...tableData, data]
      }
    }
    subFormRef.value?.xEditTable.loadData(updata)
    emit("update:modelValue", updata)
    // emit("update:data", updata)
    setTimeout(() => {
      resolve();
    }, 1);
  });
};

/** 新增行 */
const plusRow = (checkData = false) => {
  form.value = deepClone(BaseRowData.value)
  if (ShowType.value != 'row') {
    let config = ButtonConfig.value.find(el => el.ACTION == 'ADD')
    if (config.RATIO) {
      let WWHH = config.RATIO != 1 ? config.RATIO.split("*") : config.PAGEPATH.split("*");
      pageConfig.modalW = WWHH[0];
      pageConfig.modalH = WWHH[1];
    }
    pageConfig.modelTitle = "添加"
    pageConfig.modalVisible = true;
  } else {
    subFormRef.value?.xEditTable.insertAt(BaseRowData.value, -1);
    updateTable()
  }
}

/** 编辑行 */
const editRowData = ref();
const editRow = row => {
  row = row || checkData.value[0]
  if (!row) return
  let config = ButtonConfig.value.find(el => el.ACTION == 'EDIT')
  if (config.RATIO) {
    let WWHH = config.RATIO != 1 ? config.RATIO.split("*") : config.PAGEPATH.split("*");
    pageConfig.modalW = WWHH[0];
    pageConfig.modalH = WWHH[1];
  }
  editRowData.value = row;
  pageConfig.modelTitle = "编辑"
  form.value = { ...deepClone(BaseRowData.value), ...row };
  if (ShowType.value != 'form') pageConfig.modalVisible = true;
}

/** 删除行 */
const delRow = (row) => {
  row = row || checkData.value[0]
  proxy.$modal.confirm("是否删除？").then(() => {
    subFormRef.value?.xEditTable.remove(row);
    nextTick(() => {
      ETableSUM.value.length > 0 && subFormRef.value?.resetSUM(ETableSUM.value);
    });
    updateTable(null);
  });
};
const EtbaleChange = (data) => {
  if (data.clicktype == 'checkbox') {
    checkData.value = data.data
    if (ShowType.value == 'form') form.value = { ...deepClone(BaseRowData.value), ...Array.isArray(data.data) ? data.data[0] : data.data }
    emit("EtbaleChange", data.data)
  } else if (data.clicktype == 'openLink') {
    emit("EtbaleLinkChange", data)
  } else if (data.type == 'SUM') {
    Object.assign(props.mainFormData, data.data)
    emit("update:mainFormData", Object.assign(props.mainFormData, data.data))
    // emit("update:data", Object.assign(props.data, data.data))
  }
  // nextTick(() => {
  //   ETableSUM.value.length > 0 && subFormRef.value?.resetSUM(ETableSUM.value);
  // });
};

/** 按钮操作 */
const BtnEvent = (config, row, rowindex) => {
  const { ACTIONADDRESS, ISTWOSURE, VNAME, PK_MODULE, PK_PAGE } = config
  if (ISTWOSURE == '1') {
    proxy.$modal.confirm(`是否${VNAME}？`).then(() => {
      proxy.request({
        url: ACTIONADDRESS,
        method: "post",
        data: {
          MODULEID: PK_MODULE,
          PAGEID: PK_PAGE,
          BILLNO: row.BILLNO
        },
      }).then(({ RESULT }) => {
        emit("btnClick")
      });
    });
  } else {
    proxy.request({
      url: ACTIONADDRESS,
      method: "post",
      data: {
        MODULEID: PK_MODULE,
        PAGEID: PK_PAGE,
        BILLNO: row.BILLNO
      },
    }).then(({ RESULT }) => {
      emit("btnClick")
    });
  }
}

/** 弹窗 */
const pageConfig = reactive({
  modalVisible: false,
  modalW: "50%",
  modalH: "50%",
  modelTitle: "编辑行",
});
const formSubmit = () => {
  editFormRef.value.validate().then((valid) => {
    if (!valid) return;
    if (ShowType.value == 'form' || ShowType.value == 'modal') {
      let newRowData = deepClone(form.value)
      updateTable(newRowData).then(() => {
        subFormRef.value?.resetSUM(ETableSUM.value, newRowData)
      })
      form.value = deepClone(BaseRowData.value)
    } else {
      Object.assign(editRowData.value, form.value);
      checkData.value = []
      updateTable();
    }
    pageConfig.modalVisible = false;
    editFormRef.value.resetFields();
  })
};

/** 按钮展示类型
 * form-单按钮
 * modal-选择行 点按钮编辑
 * row-行编辑
 */
const ShowType = computed(() => {
  let { EDITMODAL } = props.config
  if (!EDITMODAL) return "modal"
  return EDITMODAL
})

/** 验证表单 */
const HasOnlyConfig = computed(() => tableCFG.tableColumns.filter(al => al.ISONLY == '1'))
const validate = () => {
  let { tableData } = xEditTable.value.getTableData()
  if (HasOnlyConfig.value.length > 0)
    for (let i = 0; i < HasOnlyConfig.value.length; i++) {
      let { FIELD, LABEL } = HasOnlyConfig.value[i];
      let data = tableData.map(el => el[FIELD]).filter(el => el != ''),
        newData = Array.from(new Set(data));
      if (data.length != newData.length) return proxy.$modal.notifyError("校验失败: " + LABEL + " 存在重复数据")
    }
  let newTableData = []
  for (let i = 0; i < newData.value.length; i++) {
    let row = newData.value[i];
    let nrow = deepClone(row)
    delete nrow._X_ROW_KEY
    nrow = JSON.stringify(nrow)
    let baseRow = JSON.stringify(BaseRowData.value)
    let notEdit = nrow === baseRow
    if (!notEdit) newTableData.push(row)
  }
  if (newTableData.length) updateTable(newTableData, true)
  return xEditTable.value.validate(true)
}

/**  初始化 */
const InitConfig = () => {
  if (config.value.length == 0) return;
  let { COLUMNS, FIELD, BUTTON, _rowConfig, TABLEHEIGHT = 200 } = config.value;
  Field.value = FIELD;
  // tableCFG.height = othTabCFG.value?.height ? othTabCFG.value?.height : (_rowConfig?.SLOTCFG && _rowConfig.SLOTCFG.includes("height")) ? JSON.parse(_rowConfig.SLOTCFG).height : 200;
  tableCFG.height = TABLEHEIGHT < 100 ? 200 : TABLEHEIGHT;
  tableCFG.tableColumns = COLUMNS.filter((el) => el.ISSHOW == "1");
  tableCFG.tableButtons = ButtonConfig.value
  // editTableButton.value = BUTTON.filter((el) => el.ACTION == "EDIT");
  let form = getFormValue(COLUMNS);
  delete form.EnumData
  BaseRowData.value = deepClone(form)
  form.value = deepClone(BaseRowData.value)
  Rules.value = getFormRule(COLUMNS)
  if (!props.detail && ShowType.value == 'row' && newData.value.length == 0) {
    newData.value = [deepClone(form)]
  }
};

const openModal = val => {
  val.$formRef = editFormRef.value
  emit("openModal", val)
}

onMounted(() => {
  InitConfig();
})

defineExpose({ type: "table", Field, updateTable, validate, xEditTable: xEditTable });
</script>

<style lang="scss" scoped>
.formTable-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  .title {
    width: 50%;
    font-size: 16px;
    font-weight: bold;
  }
}
.btn {
  display: flex;
  align-items: center;
  justify-content: flex-end;

  &-item {
    padding: 4px 6px;
    font-size: 14px;
    cursor: pointer;

    &:disabled,
    &[disabled="true"] {
      cursor: not-allowed;
      color: #939393 !important;
    }

    &[type="primary"] {
      color: var(--el-color-primary);
    }

    &[type="danger"] {
      color: var(--el-color-danger);
    }
  }
}

.btn-button {
  margin-bottom: 10px;
}

.saveAndAdd {
  width: 100%;
  display: flex;
  margin-left: 6px;
  // align-items: end;
  justify-content: flex-end;
}
.subForm {
  :deep(.el-form-item) {
    margin-bottom: 14px;
  }
}
</style>