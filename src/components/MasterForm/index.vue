<template>
  <div class="master-form">
    <eos-form ref="FormRef" v-model="formData" :config="formConfig" :detail="detail" @openModal="openModal">
      <template #subTable="{ config }" v-if="tableConfig.length > 0">
        <div class="formTable" :style="`margin-left:-${labelWidth}`">
          <SubTableCom :ref="config.FIELD+'Ref'" :key="config.FIELD" :detail="detail || config.ISDISABLED == '1'" :title="config.LABEL" :config="GET_TableConfig(config)" v-model:data="formData[config.FIELD]" v-model:mainFormData="formData" :othConfig="othConfig" @EtbaleLinkChange="EtbaleLinkChange" @updateTableData="UPDATA_TableData">
            <template #modalBtnAfter>
              <slot name="modalBtnAfter" />
            </template>
          </SubTableCom>
        </div>
      </template>
    </eos-form>
    <eos-modal ref="modalRef">
      111123123
    </eos-modal>
  </div>
</template>

<script setup>
/**
 * 主子表单
 * @author WangJun 2024-05-11
 */
import useTableHook from "./hooks/table.hook";
import useModalHook from "./hooks/modal.hook"
import SubTableCom from "./subtable.vue";
import { toRefs, ref } from "vue";
const props = defineProps({
  modelValue: {
    type: Object,
    require: true
  },
  detail: {
    type: Boolean,
    default: false
  },
  formConfig: {
    type: Object,
    default: () => { }
  },
  labelWidth: {
    type: [String, Number],
    default: "100px"
  },
  tableConfig: {
    type: Array,
    default: () => []
  }
})
const emit = defineEmits(["update:modelValue", "updateTableData", "EtbaleLinkChange"])

const formData = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val)
})
const { formConfig, tableConfig, tableRules, labelWidth } = toRefs(props)

const FormRef = ref();

const { GET_TableConfig, UPDATA_TableData } = useTableHook()
const { modalRef, modalConfig, openModal } = useModalHook()

/**
 * 主子表单验证
 * @returns {Promise<boolean>}
 */
const validate = () => {
  return new Promise((resolve) => {
    FormRef.value.validate().then((valid) => {
      if (!valid) return;
      // 需要验证的子表 和 需要验证的信息块 合并
      let SubHasValid = props.tableConfig.filter(el => el.ISDISABLED != '1').map(el => {
        return {
          TYPE: "subRef",
          FIELD: el.FIELD,
          GROUPNO: el.GROUPNO,
          HASONLY: el.GROUPNO === 'TAB' ? el.COLUMNS.filter(al => al.ISONLY == '1') : []
        }
      })
      let InfoHasValid = InfoConfigList.value.filter(el => el.CONTROLS != 'WorkFlowTimeLine' && el.ISDISABLED != '1').map(el => {
        return {
          TYPE: "infoRef",
          FIELD: el.FIELD,
          GROUPNO: el.CONTROLS,
          HASONLY: el.CONTROLS === 'TAB' ? el._config.tableColumns.filter(al => al.ISONLY == '1') : []
        }
      })
      const HasValid = [...SubHasValid, ...InfoHasValid]
      if (HasValid.length == 0) {
        resolve(true);
      } else {
        let validateArr = [],
          RefArr = [...subFormRef.value ? Array.isArray(subFormRef.value) ? subFormRef.value : [subFormRef.value] : [], ...InfoRef.value ? InfoRef.value : []];
        for (let i = 0; i < HasValid.length; i++) {
          let { FIELD, GROUPNO, TYPE } = HasValid[i],
            refEl = proxy.$.refs[FIELD + 'Ref'];
          if (!refEl) {
            validateArr.push(true)
            continue
          }
          if (GROUPNO == 'FM') {
            validateArr.push(refEl?.validate().then(sValid => sValid))
          } else {
            validateArr.push(refEl.validate())
          }
        }
        Promise.all(validateArr).then((res) => {
          let valids = res.filter((el) => el == undefined || el == true);
          resolve(valids.length == HasValid.length);
        })
      }
    });
  });
}
const resetForm = () => {
  activeTab.value = 0;
  FormRef.value.resetFields();
}

// 主动暴露方法
defineExpose({ validate, resetForm });
</script>
<style lang="scss" scoped>
</style>