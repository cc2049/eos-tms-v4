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
                <!-- ExDate 日期选择 -->

                <template v-if="currentConfig.CONTROLS == 'ExDate'">
                    <el-date-picker v-model="formData[currentConfig.FIELD]" clearable style="width: 100%"
                        placeholder="请选择" />
                </template>
                <template v-else-if="currentConfig.CONTROLS == 'ExDateRange'">
                    <el-date-picker v-model="formData[currentConfig.FIELD + 'Arr']" unlink-panels clearable
                        range-separator="至" style="width: 100%" placeholder="请选择" />
                </template>
                <template v-else-if="currentConfig.CONTROLS == 'ExDateTime'">
                    <el-date-picker v-model="formData[currentConfig.FIELD]" clearable type="datetime"
                        value-format="YYYY-MM-DD HH:mm:ss" style="width: 100%" />
                </template>
                <template v-else-if="currentConfig.CONTROLS == 'ExDateTimeRange'">
                    <el-date-picker v-model="formData[currentConfig.FIELD + 'Arr']" clearable unlink-panels
                    type="datetimerange" range-separator="至" value-format="YYYY-MM-DD HH:mm:ss"
                        style="width: 100%" />
                </template>
                <template v-else-if="currentConfig.CONTROLS == 'ExSelect'">
                    <el-select placeholder="请选择" v-model="formData[currentConfig.FIELD]" clearable style="width: 100%" >
                        <el-option v-for="item in EnumData[currentConfig.FIELD]" :key="item.VALUE" :label="item.LABEL" :value="item.VALUE" />
                      </el-select>
                </template>
                <template v-else-if="currentConfig.CONTROLS == 'ExSelectModal'">
                    
                    

                </template>
                <template v-else>
                    <el-input v-model="formData[currentConfig.FIELD]" style="width: 100%" placeholder="输入关键字后回车查询" />
                </template>





                <!-- <el-input v-model="formData[item.FIELD]" style="width: 100%" placeholder="输入关键字后回车查询" :size="commonSize">
                    <template #suffix>
                        <el-icon color="#bacbd8" :size="20">
                            <Icon icon="iconamoon:search"></Icon>
                        </el-icon>
                    </template>
                </el-input> -->
            </el-col>
        </el-row>


    </div>
</template>

<script setup>
import { watch } from 'vue';
const emit = defineEmits(["update:formData"]);

const props = defineProps({
    filterConfig: {
        type: Object,
        default: {},
    },
    filterVal: {
        type: Object,
        default: {},
    },
    formData: {
        type: Object,
        default: {},
    }
});

console.log(props.formData)
console.log(props.filterVal)
const commonSize = ref('mini')
const filterSeceletArrs = computed(() => props.filterConfig.filterSeceletArr)
// console.log("🚀 ~ filterSeceletArrs:", filterSeceletArrs)
const filterSeceletArrs1 = computed(() => props.filterConfig.filterSeceletArr1)

const currentConfig = computed(() => props.filterVal)

const selectvalue = ref(null)
const selectvalue1 = ref(null)
const input = ref('')



watch(() => props.filterVal, value => {
    selectvalue.value = value.value
}, { immediate: true })


// 枚举数据
const EnumData = ref({});
const mapEnumData = () => {
  let rowData = getFormValue(props.formConfig);
  EnumData.value = { ...rowData.EnumData, ...rowData._getDICT };
};




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
