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
                <el-select v-model="selectvalue" placeholder="请选择" style="width: 100%" :size="commonSize" @change="changeFilter">
                    <el-option v-for="item in filterSeceletArrs" :key="item.BILLNO" :label="item.LABEL"
                        :value="item.BILLNO" />
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
                    <el-select placeholder="请选择" v-model="formData[currentConfig.FIELD]" clearable style="width: 100%">
                        <el-option v-for="item in EnumData[currentConfig.FIELD]" :key="item.VALUE" :label="item.LABEL"
                            :value="item.VALUE" />
                    </el-select>
                </template>
                <template v-else-if="currentConfig.CONTROLS == 'ExSelectModal'">
                    <el-popover placement="bottom" :width="600" trigger="click" :visible="inputVisible" :popper-style="{
                        padding:0
                    }">
                        <template #reference>
                            <el-input v-model="formData[currentConfig.FIELD]" style="width: 100%" placeholder="请输入"
                                @input="ExSelectModalInput" />
                        </template>
                        <div class="disflex ExSelectModal-header" v-for="(item, index) in tableData" :key="index">
                            <div class="ExSelectModal-left">
                                <div v-if="index == 0">代码</div>
                                <el-input v-else-if="index == 1" v-model="leftInputVal" style="width: 100%"
                                    placeholder="过滤条件" />
                                <div v-else>{{ item.label }}</div>
                            </div>
                            <div class="ExSelectModal-right">
                                <div v-if="index == 0">名称</div>
                                <el-input v-else-if="index == 1" v-model="rightInputVal" style="width: 100%"
                                    placeholder="过滤条件" />
                                <div v-else>{{ item.label }}</div>
                            </div>
                        </div>
                        <div class="disflex justify-sb ExSelectModal-footer">
                            <div>
                                <el-select v-model="selectvalue2" placeholder="" style="width: 100px" class="mr10"
                                    :size="commonSize">
                                    <el-option label="左匹配" value="1" />
                                    <el-option label="右匹配" value="2" />
                                    <el-option label="全量模糊" value="3" />
                                </el-select>
                                <el-select v-model="selectvalue2" placeholder="" style="width: 100px"
                                    :size="commonSize">
                                    <el-option label="全部" value="1" />
                                    <el-option label="编码" value="2" />
                                    <el-option label="名称" value="3" />
                                </el-select>
                            </div>
                            <div>
                                <el-select v-model="selectvalue2" placeholder="" style="width: 60px" :size="commonSize">
                                    <el-option label="5" value="1" />
                                    <el-option label="10" value="2" />
                                    <el-option label="20" value="3" />
                                </el-select>
                                <el-button link>
                                    更多
                                </el-button>
                            </div>
                        </div>
                    </el-popover>


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
const emit = defineEmits(["update:formData","changeFilter"]);

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

const commonSize = ref('mini')
const filterSeceletArrs = computed(() => props.filterConfig.filterSeceletArr)
const filterSeceletArrs1 = computed(() => props.filterConfig.filterSeceletArr1)

const currentConfig = computed(() => props.filterVal)

const selectvalue = ref(null)
const selectvalue1 = ref(null)
const selectvalue2 = ref('1')
const input = ref('')

const leftInputVal = ref(null)
const rightInputVal = ref(null)

const tableData = ref([{}, {}, { label: '222' }])

const changeFilter=(e) => {
    let newArr = filterSeceletArrs.value.filter(ele => ele.value == e)
    emit('changeFilter', newArr[0] || {})

}

watch(() => props.filterVal, value => {
    selectvalue.value = value.BILLNO
}, { immediate: true })


// 枚举数据
const EnumData = ref({});
const mapEnumData = () => {
    let rowData = getFormValue(props.formConfig);
    EnumData.value = { ...rowData.EnumData, ...rowData._getDICT };
};

const inputVisible = ref(false)
const ExSelectModalInput = (e) => {
    if (e) {
        inputVisible.value = true
    }
}



</script>

<style scoped lang="scss">
.filterForm {}

.ExSelectModal {
    &-header {
        padding: 6px;
    }
    &-header:first-child {
        background-color: #eff3f7;
        padding: 10px 15px;
    }

    &-left {
        width: 34%;
    }

    &-right {
        width: 66%;
    }

    &-footer {
        background-color: #f5f5f5;
    }
}

.ExSelectModalPopver{

}


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


:deep(.el-popover){
    padding: 0 !important;
}
:deep(.el-popper.is-light){
    padding: 0 !important;
}
</style>
