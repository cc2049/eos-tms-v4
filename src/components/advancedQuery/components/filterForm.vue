<!--
 * 查询组件
 * @author: wsd
 * @since: 2024-04-28
 * filterForm.vue
-->
<template>
    <div class="filterForm">

        <div class="firstSelect mr10">
            <el-select v-model="selectvalue" placeholder="请选择" style="width: 120px" :size="commonSize"
                @change="changeFilter">
                <el-option v-for="item in filterSeceletArrs" :key="item.BILLNO" :label="item.LABEL"
                    :value="item.BILLNO" />
            </el-select>
        </div>
        <div class="mr10">
            <el-select v-model="selectvalue1" placeholder="请选择" style="width: 100px" :size="commonSize">
                <el-option v-for="item in filterSeceletArrs1" :key="item" :label="item" :value="item" />
            </el-select>

        </div>
        <div style="width: 260px">
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
                    type="datetimerange" range-separator="至" value-format="YYYY-MM-DD HH:mm:ss" style="width: 100%" />
            </template>
            <template v-else-if="currentConfig.CONTROLS == 'ExSelect'">
                <el-select placeholder="请选择" v-model="formData[currentConfig.FIELD]" clearable style="width: 100%">
                    <el-option v-for="item in EnumData[currentConfig.FIELD]" :key="item.VALUE" :label="item.LABEL"
                        :value="item.VALUE" />
                </el-select>
            </template>
            <template v-else-if="currentConfig.CONTROLS == 'ExSelectModal'">
                <el-popover placement="bottom" :width="600" trigger="click" :visible="inputVisible" :popper-style="{
                padding: 0
            }">
                    <template #reference>
                        <el-input v-model="formData[currentConfig.FIELD]" style="width: 100%" placeholder="请输入"
                            @input="val => ExSelectModalInput(val, currentConfig)" />
                    </template>

                    <div class="disflex ExSelectModal-header">
                        <div class="ExSelectModal-left">
                            <div>代码</div>
                            <el-input style="width: 100%" placeholder="过滤条件" />
                        </div>
                        <div class="ExSelectModal-right">
                            <div>名称</div>
                            <el-input style="width: 100%" placeholder="过滤条件" />
                        </div>
                    </div>
                    <ul v-infinite-scroll="loadExSelectModalTable" class="infinite-list"
                        style="overflow: auto;height: 200px;">
                        <li class="disflex ExSelectModal-header" v-for="(item, index) in tableData" :key="index">
                            <div class="ExSelectModal-left">
                                <div>{{ item.BILLNO }}</div>
                            </div>
                            <div class="ExSelectModal-right">
                                <div>{{ item.VNAME }}</div>
                            </div>
                        </li>
                    </ul>
                    <!-- <div class="disflex ExSelectModal-header" v-for="(item, index) in tableData" :key="index">
                            <div class="ExSelectModal-left">
                                <div>{{ item.BILLNO }}</div>
                            </div>
                            <div class="ExSelectModal-right">
                                <div>{{ item.VNAME }}</div>
                            </div>
                        </div> -->
                    <div class="disflex justify-sb ExSelectModal-footer">
                        <div>
                            <el-select v-model="selectvalue2" placeholder="" style="width: 100px" class="mr10"
                                :size="commonSize">
                                <el-option label="左匹配" value="1" />
                                <el-option label="右匹配" value="2" />
                                <el-option label="全量模糊" value="3" />
                            </el-select>
                            <el-select v-model="selectvalue2" placeholder="" style="width: 100px" :size="commonSize">
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
        </div>



    </div>
</template>

<script setup>
import { watch } from 'vue';
import { getPageConfig, getTableData } from "@/api/system/page";

const emit = defineEmits(["update:formData", "changeFilter"]);

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

const changeFilter = (e) => {
    let newArr = filterSeceletArrs.value.filter(ele => ele.BILLNO == e)
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

const modalConfig = ref({})
const inputVisible = ref(false)
const ExSelectModalInput = (e, config) => {
    if (e) {
        tableData.value = []

        let { LABEL, SLOTCFG, OTHER } = config;
        if (SLOTCFG == "") return console.error("Error: 配置错误");
        let ids = SLOTCFG.split(",");
        if (ids.length < 2) return console.error("Error: 配置错误");
        let { url, data, importantData } = ParseOtherConfig(OTHER);
        console.log("🚀 ~ ExSelectModalInput ~ data, importantData:", url, data, importantData)

        let MODULEID = ids[0]
        let PAGEID = ids[1]
        let portData = {
            ...data,
            MODULEID,
            PAGEID
        }

        modalConfig.value = {
            // PAGEID,
            // MODULEID,
            portData,
            url
        }

        queryData(url, portData)


        inputVisible.value = true
    }
}
const PAGENUM = ref(0)
const loadExSelectModalTable = () => {

    let portData = {
        ...modalConfig.value.portData,
        PAGENUM: PAGENUM.value++
    }
    queryData(modalConfig.value.url, portData)
}

const queryData = (url, portData) => {
    getTableData(url, portData).then(res => {
        console.log("🚀 ~ getTableData ~ res:", res)
        const { RECORDS, SIZE, TOTAL, CURRENT, PAGES } = res.RESULT
        if (tableData.value.length == 0) {
            tableData.value = RECORDS
        } else {
            tableData.value.push(...RECORDS)

        }
    }).finally(() => {
    })
}

const SelectValueTo = ref([]);

// 解析 Other 配置
function ParseOtherConfig(config) {
    if (!config) {
        SelectValueTo.value = []
        return { url: "", data: {}, importantData: {} };
    }
    try {
        let newConfig = JSON.parse(config)[0]
        if (newConfig.setvalue && JSON.stringify(newConfig.setvalue) != '{}') {
            let arr = []
            for (const key in newConfig.setvalue) {
                arr.push({ k: key, v: newConfig.setvalue[key] })
            }
            SelectValueTo.value = arr
        }
        return { url: newConfig.url, data: newConfig?.params, importantData: newConfig?.importantData }
    } catch (error) {
        if (config.indexOf("/") == '0') {
            let paramsArr = config.split("?"),
                url = "",
                setQueryParam = {},
                queryJson = {},
                setImportantParam = {},
                importantData = {};


            console.log(paramsArr)

            if (paramsArr.length == 0) {
                url = config;
                SelectValueTo.value = [];
            } else if (paramsArr.length > 0) {
                url = paramsArr[0];
                if (paramsArr.length > 1) {
                    let { obj, importantObj } = GetUrlParams("a?" + paramsArr[1], "obj");
                    queryJson = obj
                    importantData = importantObj
                }
                if (paramsArr.length > 2) {
                    let { obj, importantObj } = GetUrlParams("a?" + paramsArr[2], "obj");
                    setQueryParam = obj
                    setImportantParam = importantObj
                    queryJson = { ...queryJson, ...ConvertData(setQueryParam) }
                    importantData = { ...importantData, ...ConvertData(setImportantParam) }
                }
                paramsArr[3] ? SelectValueTo.value = GetUrlParams("a?" + paramsArr[3], "arr") : []
            }
            return { url, data: queryJson, importantData };
        } else {
            console.error("配置解析错误!", error);
        }
    }
}
/** 转换数据 */
function ConvertData(obj) {
    let data = {}
    for (let ii in obj) {
        let valueKey = obj[ii]
        if (valueKey.includes("M$")) {
            valueKey = calcHasMSKey(valueKey)
            data[ii] = props.mainFormData[valueKey] || "";
        } else if (valueKey.includes("S$")) {
            valueKey = calcHasMSKey(valueKey)
            data[ii] = props.formData[valueKey] || "";
        } else {
            data[ii] = props.formData[valueKey] || "";
        }
    }
    return data
}

// 获取url 后面的参数
function GetUrlParams(url, backType) {
    let reg = /([^&?=]+)=([^&?=]+)/g,
        obj = {},
        importantObj = {},
        arr = [];
    url.replace(reg, function () {
        if (arguments[1].includes("!")) {
            let key = arguments[1].substr(1); //删除第一个字符
            importantObj[key] = arguments[2];
        } else {
            obj[arguments[1]] = arguments[2];
        }
        let objs = {};
        objs.k = arguments[1];
        objs.v = arguments[2];
        arr.push(objs);
    });
    return backType == "obj" ? { obj, importantObj } : arr;
}


</script>

<style scoped lang="scss">
.filterForm {
    display: flex;
}

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

.ExSelectModalPopver {}


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


:deep(.el-popover) {
    padding: 0 !important;
}

:deep(.el-popper.is-light) {
    padding: 0 !important;
}

:deep(.el-select__wrapper) {
    height: 26px !important;
    line-height: 26px !important;
    min-height: auto;
    border-color: #949eb5 !important;
}
</style>
