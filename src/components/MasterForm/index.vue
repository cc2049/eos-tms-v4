<template>
  <el-skeleton :rows="15" :loading="loading" :throttle="20" animated>
    <div class="master-form">
      <eos-form ref="FormRef" v-model="formData" :config="formConfig" :detail="detail" @openModal="openModal" @labelClick="LabelClick">
        <template #SubTable="{ config }" v-if="tableConfig.length > 0">
          <div class="formTable" :style="`margin-left:-${labelWidth};width:calc(100% + ${labelWidth})`">
            <SubTableCom :ref="config.FIELD+'Ref'" :key="config.FIELD" :detail="detail || config.ISDISABLED == '1'" :title="config.LABEL" :config="GET_TableConfig(config)" v-model="formData[config.FIELD]" v-model:mainFormData="formData" :othConfig="othConfig" @EtbaleLinkChange="EtbaleLinkChange" @updateTableData="UPDATA_TableData" @openModal="openModal">
              <template #modalBtnAfter>
                <slot name="modalBtnAfter" />
              </template>
            </SubTableCom>
          </div>
        </template>
      </eos-form>

      <eos-modal ref="modalRef">
        <template #default>
          <TablePage ref="TablePageRef" :menuID="modalConfig?.page" dbClickType="emit" @dbClick="TablePagedbClick" />
        </template>
        <template #footer>
          <el-button type="info" size="default" @click="closeModal">取消</el-button>
          <el-button type="primary" size="default" @click="handleConfirm">确定</el-button>
        </template>
      </eos-modal>
    </div>
  </el-skeleton>
</template>

<script>
export default {
  inheritAttrs: false,
};
</script>

<script setup>
/**
 * 主子表单
 * @author WangJun 2024-05-11
 */
import { toRefs, ref, computed, getCurrentInstance } from "vue";
import useTableHook from "./hooks/table.hook";
import useModalHook from "./hooks/modal.hook";
import SubTableCom from "./subtable.vue";
import TablePage from "@/views/table/components/SingleTable/index.vue";
const props = defineProps({
  modelValue: {
    type: Object,
    require: true,
  },
  detail: {
    type: Boolean,
    default: false,
  },
  formConfig: {
    type: Object,
    default: () => { },
  },
  labelWidth: {
    type: [String, Number],
    default: "100px",
  },
  tableConfig: {
    type: Array,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits([
  "update:modelValue",
  "updateTableData",
  "EtbaleLinkChange",
  "labelClick"
]);
const { proxy } = getCurrentInstance();
const FormRef = ref(null);
const TablePageRef = ref(null);
const formData = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});
const { formConfig, tableConfig, tableRules, labelWidth } = toRefs(props);
const { GET_TableConfig, UPDATA_TableData } = useTableHook();
const { modalRef, modalConfig, openModal, closeModal } = useModalHook();

/** label link 事件 */
const LabelClick = val => {
  emit("labelClick", val)
}

/** 表格页面 双击 */
const TablePagedbClick = (row) => {
  if (Object.hasOwn(modalConfig.value, '$formRef')) {
    modalConfig.value.$formRef.update(modalConfig.value._config, row);
  } else {
    FormRef.value.update(modalConfig.value._config, row);
  }
  closeModal();
};
const handleConfirm = () => {
  const CheckRows = TablePageRef.value.getCheckRows();
  if (!CheckRows.length) return proxy.$modal.msgWarning("请选择数据");
  FormRef.value.update(modalConfig.value._config, CheckRows);
  closeModal();
};

/**
 * 主子表单验证
 * @returns {Promise<boolean>}
 */
const validate = () => {
  return new Promise((resolve) => {
    FormRef.value.validate().then((valid) => {
      if (!valid) return;
      // 需要验证的子表 和 需要验证的信息块 合并
      let SubHasValid = props.tableConfig.filter((el) => el.ISDISABLED != "1").map((el) => {
        return {
          TYPE: "subRef",
          FIELD: el.FIELD,
          GROUPNO: el.GROUPNO,
          HASONLY: el.GROUPNO === "TAB" ? el.COLUMNS.filter((al) => al.ISONLY == "1") : [],
        };
      });
      const HasValid = [...SubHasValid];
      if (HasValid.length == 0) {
        resolve(true);
      } else {
        let validateArr = [];
        for (let i = 0; i < HasValid.length; i++) {
          let { FIELD, GROUPNO, TYPE } = HasValid[i],
            refEl = proxy.$.refs[FIELD + "Ref"];
          if (!refEl) {
            validateArr.push(true);
            continue;
          }
          if (GROUPNO == "FM") {
            validateArr.push(refEl?.validate().then((sValid) => sValid));
          } else {
            validateArr.push(refEl.validate());
          }
        }
        Promise.all(validateArr).then((res) => {
          let valids = res.filter((el) => el == undefined || el == true);
          resolve(valids.length == HasValid.length);
        });
      }
    });
  });
};
const resetForm = () => {
  activeTab.value = 0;
  FormRef.value.resetFields();
};


// 主动暴露方法
defineExpose({ validate, resetForm });
</script>
<style lang="scss" scoped>
</style>