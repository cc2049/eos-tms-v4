<!--
 * 查询组件
 * @author: wsd
 * @since: 2024-04-28
 * filterForm.vue
-->
<template>
    <div class="filterForm">
        <el-row :gutter="10">
            <el-col :span="6" class="firstSelect">
                <el-select v-model="selectvalue" placeholder="请选择" style="width: 100%" :size="commonSize">
                    <el-option v-for="item in filterSeceletArrs" :key="item.value" :label="item.label"
                        :value="item.value" />
                </el-select>
            </el-col>
            <el-col :span="6">
                <el-select v-model="selectvalue1" placeholder="请选择" style="width: 100%" :size="commonSize">
                    <el-option v-for="item in filterSeceletArrs1" :key="item" :label="item" :value="item" />
                </el-select>

            </el-col>
            <el-col :span="12">
                <el-input v-model="input" style="width: 100%" placeholder="输入关键字后回车查询" :size="commonSize">
                    <template #suffix>
                        <!-- <el-icon class="el-input__icon">
                            <calendar />
                        </el-icon> -->
                        <el-icon color="#bacbd8" :size="20">
                            <Icon icon="iconamoon:search"></Icon>
                        </el-icon>
                    </template>
                </el-input>
            </el-col>
        </el-row>


    </div>
</template>

<script setup>
import { watch } from 'vue';

const props = defineProps({
    filterConfig: {
        type: Object,
        default: {},
    },
    filterVal: {
        type: Object,
        default: {},
    }
});
const commonSize = ref('mini')
const filterSeceletArrs = computed(() => props.filterConfig.filterSeceletArr)
// console.log("🚀 ~ filterSeceletArrs:", filterSeceletArrs)
const filterSeceletArrs1 = computed(() => props.filterConfig.filterSeceletArr1)

const selectvalue = ref(null)
const selectvalue1 = ref(null)
const input = ref('')
watch(() => props.filterVal, value => {
    console.log(value.value)
    console.log(selectvalue.value)
    selectvalue.value = value.value
},{ immediate: true })




</script>

<style scoped lang="scss">
.filterForm {
    :deep(.el-select) {
        height: 26px !important;
        line-height: 26px !important;
    }

    :deep(.el-input) {
        height: 26px !important;
        line-height: 26px !important;
    }

    :deep(.el-input__wrapper) {
        box-shadow: none;
        border: 1px solid #949eb5;
    }
}
</style>
