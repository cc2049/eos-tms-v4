<!--
 * 列表过滤种的条件组件
 * @author: wsd
 * @since: 2024-05-30
 * conditionModule.vue
-->
<template>
    <div class="container">
        <div class="disflex mt-10 mb-10">
            <div class="mr10 btnStyle ml-10" @click="addLine">新增行</div>
            <div class="mr10 btnStyle" @click="delLine">删除行</div>
            <div class="mr10 btnStyle" @click="allDel">全部删除</div>
            <div class="mr10 btnStyle" @click="initLine">插入行</div>
            <div class="mr10 btnStyle" @click="copyLine">复制行</div>
        </div>
        <div class="content">
            <div v-for="(item, index) in newFilterArr" :key="index" class="oneLIne"
                :class="chooseOneLIneIndex == index ? 'active' : ''" @click="chooseOneLIne(item, index)">
                <div class="disflex">
                    <FilterForm :filterConfig="filterConfig" :filterVal="item"
                        v-model:formData="currentQueryList[index]" @changeFilter="val => changeFilter(val, item, index)"
                        :isCondition="true" />
                    <el-icon color="#b9c9fb" :size="20" class="delIcon cp" @click="delLine(item, index)">
                        <Icon icon="zondicons:minus-solid"></Icon>
                    </el-icon>
                </div>
            </div>
        </div>
        <div class="tr ">
            <el-button @click="confirm">确定</el-button>
            <el-button @click="cancle">取消</el-button>
        </div>
    </div>
</template>

<script setup>
import FilterForm from "./filterForm"
import { computed, inject, reactive } from "vue";
import { getList, savePlan } from "#/system/advancedQuery";


const { proxy } = getCurrentInstance();


const emit = defineEmits(["closeModal"]);
const MenuID = inject("menuID");

const props = defineProps({
    filterConfig: {
        type: Object,
        default: {},
    },
    filterArr: {
        type: Array,
        default: [],
    },
    choosePlanObj: {
        type: Object,
        default: {},
    }
    // settingArr: {
    //     type: Array,
    //     default: [],
    // }

});


const currentQueryList = ref([])
const newFilterArr = ref([])

watch(() => props.filterArr, value => {
    // console.log('执行了监听 filterarr')
    newFilterArr.value = value
    currentQueryList.value = value.map(ele => {
        if (ele.BILLNO) {
            return ele
        } else {
            return {
                FIELD: '',
                QUERYTYPE: '',
                DEFAULTVAL: '',
                DEFAULTVAL2: '',
                SORTCODE: '',
                DEFAULTVALArr: '',
                QRYCONT: '',
                QRYPRE: '',
                QRYSUF: '',
            }
        }
    })

}, { immediate: true })
const addObj = computed(() => {
    return {
        ...props.filterArr[0],
        FIELD: '',
        QUERYTYPE: '',
        DEFAULTVAL: '',
        DEFAULTVAL2: '',
        SORTCODE: '',
        DEFAULTVALArr: '',
        QRYCONT: '',
        QRYPRE: '',
        QRYSUF: '',
    }
})

const chooseOneLIneIndex = ref({})
const chooseOneLIne = (item, index) => {
    chooseOneLIneIndex.value = index
}
const addLine = () => {

    newFilterArr.value.push({})
    currentQueryList.value.push({})

}
const delLine = () => {
    if ((chooseOneLIneIndex.value || chooseOneLIneIndex.value == 0) && typeof(chooseOneLIneIndex.value) == 'number') {
        newFilterArr.value.splice(chooseOneLIneIndex.value, 1);
        currentQueryList.value.splice(chooseOneLIneIndex.value, 1);
        chooseOneLIneIndex.value = null
    }
}


const allDel = () => {
    newFilterArr.value = []
    currentQueryList.value = []
}
const initLine = () => {
    if (chooseOneLIneIndex.value || chooseOneLIneIndex.value == 0) {
        newFilterArr.value.splice(chooseOneLIneIndex.value + 1, 0, {})
        currentQueryList.value.splice(chooseOneLIneIndex.value + 1, 0, {})
    }
}
const copyLine = () => {
    if (chooseOneLIneIndex.value || chooseOneLIneIndex.value == 0) {
        newFilterArr.value.push(newFilterArr.value[chooseOneLIneIndex.value])
        currentQueryList.value.push(currentQueryList.value[chooseOneLIneIndex.value])
    }
}


const changeFilter = (val, item, index) => {
    newFilterArr.value[index] = JSON.parse(JSON.stringify(val));
}

const confirm = () => {
    let QUERYS = []
    QUERYS = currentQueryList.value.map((ele,index) => {
        return {
            FIELD: ele.FIELD,
            QUERYTYPE: ele.QUERYTYPE,
            DEFAULTVAL: ele.DEFAULTVAL,
            DEFAULTVAL2: ele.DEFAULTVAL2,
            SORTCODE: ele.SORTCODE,
            DEFAULTVALArr: ele.DEFAULTVALArr,
            QRYCONT: ele.QRYCONT,
            QRYPRE: ele.QRYPRE,
            QRYSUF: ele.QRYSUF,
            SORTCODE:index,
            VTYPE:'1',
        }
    })
    const protData = {
        BILLNO: props.choosePlanObj.BILLNO, // 方案主键
        // VTYPE:1,
        QUERYS,
        ...MenuID.value,
    };
    savePlan(protData).then((res) => {
        proxy.$modal.msgSuccess("保存成功");
        emit("closeModal")
    });
}

const cancle = () => {
    emit("closeModal")
}




</script>

<style scoped lang="scss">
@import "@/assets/styles/variables.module.scss";

.btnStyle {
    color: var(--el-color-primary) !important;
    cursor: pointer;
    font-size: 14px;
}


.content {
    height: 240px;
    overflow-y: auto;
    width: 780px;

}

.oneLIne {
    width: 100%;
    padding: 6px;

    &.active {
        background-color: #e2e9fd;
    }
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
    border-radius: 2px;
    height: 26px;
}

:deep(.el-input__inner) {
    color: #12151a;
}

:deep(.el-input__inner::placeholder) {
    color: #767476;
}

:deep(.el-input__suffix) {
    color: #acafb4;
}

:deep(.firstSelect) {
    .el-input__wrapper {
        padding: 1px 1px 1px 6px;
    }

    .el-input__suffix-inner {
        background-color: #f7f7f7;
        border-left: 1px solid #d1d4da;
    }

    .el-input__suffix-inner:hover {
        background-color: #c1c7d3;

        .el-select__icon {
            color: #757689;
        }
    }

    .el-input__suffix-inner> :first-child {
        margin: 5px;
    }
}

:deep(.el-select__wrapper) {
    height: 26px !important;
    line-height: 26px !important;
    min-height: auto;
    box-shadow: 0 0 0 1px #949eb5 inset;
    border-radius: 2px !important;
}
</style>
