<template>
  <eos-form ref="FormRef" v-model="formData" :config="formConfig" :detail="detail">
    <template #subTable="{ config }" v-if="tableConfig.length > 0">
      <div class="formTable" :style="`margin-left:-${labelWidth}`">
        <SubTableCom :ref="config.FIELD+'Ref'" :key="config.FIELD" :detail="detail || config.ISDISABLED == '1'" :title="config.LABEL" :config="comConfig(config)" v-model:data="formData[config.FIELD]" v-model:mainFormData="formData" :othConfig="othConfig" @EtbaleLinkChange="EtbaleLinkChange" @updateTableData="updateTableData">
          <template #modalBtnAfter>
            <slot name="modalBtnAfter" />
          </template>
        </SubTableCom>
      </div>
    </template>
  </eos-form>
</template>

<script setup>
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
const emit = defineEmits(["updateTableData", "EtbaleLinkChange"])
const { formData, formConfig, tableConfig, tableRules, labelWidth } = toRefs(props)

const FormRef = ref();

/** table 转换配置 */
const comConfig = config => {
  if (!config) return {}
  let { OTHER } = config
  let subTableConfig
  if (tableConfig.value.length == 1) {
    subTableConfig = tableConfig.value[0]
  } else {
    subTableConfig = tableConfig.value.find(el => el.BILLNO == OTHER)
  }
  return subTableConfig
}

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