<!--
 * @Author: cc2049
 * @Date: 2024-06-03 15:39:57
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-07-02 11:30:37
 * @Description: 简介
-->

<template>
  <!-- 超链接 -->
  <template v-if="config.VTYPE == 'link'">
    <el-link style="color:#0000ff;" type="primary" @click.stop="openLink(config, row)">{{row[config.FIELD]}}</el-link>
  </template>

  <!-- 插槽 -->
  <template v-else-if="config.VTYPE == 'ExNumberTh'">
    {{  toThousands(row[config.FIELD])  }}
  </template>

  <!-- 插槽 -->
  <template v-else-if="config.VTYPE == 'slot'">
    <slot :name="config.FIELD" :row="row"></slot>
  </template>

  <!-- 枚举转译 -->
  <template v-else-if="config.VTYPE == 'exNum'">
    <span>
      {{ setArrToDictLabel(config.OTHER, row[config.FIELD]) }}
    </span>
  </template>

  <!-- 查询类型的数据转译 -->
  <template v-else-if="
                config.CONTROLS == 'ExSelectSearch' ||
                config.CONTROLS == 'ExSelectMutiple' ||
                config.CONTROLS == 'ExSelectGroup' ||
                config.CONTROLS == 'ExRegion' || 
                config.CONTROLS == 'ExArea'
              ">
    {{ row[config.REVERFIELD] }}
  </template>

  <!-- 单位拼接 -->
  <span v-else-if="config.SUFFIX && config.SUFFIX != ''">
    {{ setSuffix(row, config) }}
  </span>

  <!-- 进度条 -->
  <template v-else-if="config.VTYPE == 'progressBar'">
    <el-progress :percentage="row[config.FIELD] || 0" :color="settimgProgress(config).colors" :stroke-width="settimgProgress(config).height" />
  </template>

  <template v-else-if="config.VTYPE == 'grade'">
    <el-button type="primary" link @click="clickGrade(row,config)">{{ row[config.FIELD] || '评分' }}</el-button>
  </template>

  <span v-else>
    {{ row[config.FIELD] }}
  </span>

</template>

<script setup>
import { setSuffix , toThousands } from "@/utils";
import { selectDictLabel } from "@/utils/ruoyi";

const { proxy } = getCurrentInstance();
const props = defineProps({
  config: {
    type: Object,
    default: () => {},
  },
  row: {
    type: Object,
    default: () => {},
  },
});

// 处理枚举数据转换的校验
function setArrToDictLabel(Arr, value) {
  try {
    if (!value) return "";
    let newArr = JSON.parse(Arr);
    value = String(value);
    if (value.includes(",")) {
      let a = [],
        valueArr = value.split(",");
      valueArr.forEach((i) => {
        a.push(selectDictLabel(newArr, i));
      });
      return a.join(",");
    } else {
      return selectDictLabel(newArr, value);
    }
  } catch (error) {
    return "";
  }
}


// 点击超链接事件
function openLink(cf, row) {
  proxy.$emit("openLink", { cf, row });
}
</script>

<style>
</style>
