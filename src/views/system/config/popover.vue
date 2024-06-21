
<template>
  <el-popover trigger="click" :popper-style="{ 'width': width,'min-width': '60px' }">
    <div class="tools">
      <span @click="selectAll()">全选</span>
      <span @click="selectAll(0)">全不选</span>
    </div>
    <el-checkbox-group v-model="data">
      <el-checkbox v-for="(item, index) in enums" :key="index" :label="item.LABEL" :value="item.VALUE" />
    </el-checkbox-group>
    <template #reference>
      <el-link type="primary">{{modelValue}}</el-link>
    </template>
  </el-popover>
</template>

<script setup>
/**
 * 配置项弹窗
 * @author wangjun
 * @since 2024/06/21
 */
const props = defineProps({
  modelValue: String,
  config: Object,
  width: String
})
const emit = defineEmits(['update:modelValue'])

const data = computed({
  get() {
    if (!props.modelValue) return []
    let newVal = []
    const oldVal = props.modelValue.split("")
    oldVal.forEach((el, index) => {
      if (index == 0) return
      if (el == "1") newVal.push(`${index}`)
    })
    return newVal
  },
  set(val) {
    let newVal = ["9", "0", "0", "0", "0"]
    val.forEach((el, index) => {
      if (el) newVal[el] = "1"
    })
    emit('update:modelValue', newVal.join(""))
  }
})
const enums = computed(() => JSON.parse(props.config.OTHER))
const selectAll = (val = 1) => {
  data.value = val == 1 ? enums.value.map(el => el.VALUE) : []
}
</script>
<style lang="scss" scoped>
.tools {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
  span {
    cursor: pointer;
    &:hover {
      color: var(--el-color-primary);
    }
  }
}
</style>