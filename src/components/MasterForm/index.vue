<template>
  <eos-form v-model="formData" :config="formConfig" :detail="detail">
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

</script>
<style lang="scss" scoped>
</style>