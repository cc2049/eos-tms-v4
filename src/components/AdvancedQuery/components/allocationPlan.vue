<!--
 * 页面过滤
 * @author: wsd
 * @since: 2024-05-16
 * allocationPlan.vue
-->
<template>
    <div class="container">

        <vxe-modal destroy-on-close v-model="showModals" id="formModal" :width="1070" resize storage transfer show-zoom
            @close="closeModal">
            <template #title>
                <span class="modal-title"> 列表过滤
                </span>
            </template>
            <template #default>
                <!-- <FormPage :menuID="formID" @closeModal="closeModal" /> -->
                <div class="flex">
                    <div class="content-left">
                        <div class="content-left-btn flex">
                            <div class="ml10 mr10 btnStyle">保存</div>
                            <div class="mr10 btnStyle" @click="showSaveAs">另存</div>
                            <!-- <div class="mr10 btnStyle">复制</div>
                            <div class="mr10 btnStyle">重置</div> -->
                            <div class="mr10 btnStyle" @click="clickUpdate">修改</div>
                            <el-popconfirm title="确定要删除吗?" @confirm="clickDelete">
                                <template #reference>
                                    <div class="mr10 btnStyle">删除</div>
                                </template>
                            </el-popconfirm>
                        </div>
                        <div class="content-left-main">
                            <div v-for="(item, index) in leftList" :key="index" class="chooseLeftClass"
                                :class="choosePlanObj.BILLNO == item.BILLNO ? 'active' : ''"
                                @click="clickLeftPlan(item)">
                                {{ item.VNAME }}
                            </div>
                        </div>
                        <el-checkbox v-model="choosePlanObj.ISDEFAULT" true-value="1" class="ml-10 mr-10"
                            label="下次以此方案自动进入" size="large" @change="changeBox" />
                    </div>
                    <div class="content-right ">
                        <div class="flex">
                            <EosTabs :tabsList="rightMenu" @change="chooseTab" />
                        </div>
                        <div v-if="chooseTabVal == '条件' && choosePlanObj.BILLNO">
                            <ConditionModule :filterConfig :filterArr="conditionModuleList" :choosePlanObj
                                @closeModal="closeModal" />
                        </div>
                        <div v-else-if="chooseTabVal == '排序' && choosePlanObj.BILLNO">
                            <SortModule :MenuID :choosePlanObj @closeModal="closeModal"></SortModule>
                        </div>
                        <div v-else-if="chooseTabVal == '显示隐藏列' && choosePlanObj.BILLNO">
                            <ShowHiddenModule :MenuID :choosePlanObj @closeModal="closeModal"></ShowHiddenModule>
                        </div>
                    </div>
                </div>
            </template>
        </vxe-modal>

        <vxe-modal destroy-on-close v-model="saveAsModal" id="formModal" resize storage transfer show-zoom
            @close="closeModal1">
            <template #title>
                <span class="modal-title"> 过滤方案另存
                </span>
            </template>
            <template #default>
                <div class="saveAsAlone">
                    <div class="flex flex-items-center mt-10 grid-justify-between">
                        <el-form ref="ruleFormRef" style="max-width: 600px" :model="saveAsForm" :rules="saveAsRules"
                            label-width="auto" class="demo-ruleForm" size="small" status-icon>
                            <el-form-item label="方案名称" prop="VNAME">
                                <el-input v-model="saveAsForm.VNAME" placeholder="" />
                            </el-form-item>
                        </el-form>
                        <div>
                            <div class="mb-8">
                                <el-button size="small" @click="confirmSaveAs">确定</el-button>
                            </div>
                            <div>
                                <el-button size="small" @click="cancelSaveAs">取消</el-button>
                            </div>
                        </div>
                    </div>
                    <div class="mb-40">
                        <div class="flex mb-10">
                            <div class="sharedSettings">共享设置</div>
                            <div class="rightBorder"></div>
                        </div>
                        <el-checkbox v-model="checked1" label="共享给他人" size="large" />
                        <el-checkbox v-model="VTYPE" true-value="0" false-value="1" label="系统预设" size="large" />

                        <el-radio-group v-model="radio2" class="ml-4">
                            <el-radio value="1">共享所有用户</el-radio>
                            <el-radio value="2">
                                <span>共享指定用户</span>
                                <span class="ml-30 mr-5">用户</span>
                                <el-input style="width: 100px;" v-model="input1" placeholder="" size="small" />
                            </el-radio>
                        </el-radio-group>
                    </div>
                </div>
            </template>
        </vxe-modal>




    </div>
</template>

<script setup>

const emit = defineEmits(["update:formData", "updateLeftList"]);
import { addPlan, updatePlan, deleteBatchIds, getSubList } from "#/system/advancedQuery";
import { inject, reactive } from "vue";
const MenuID = inject("menuID");

import ConditionModule from "./conditionModule.vue"
import SortModule from "./sortModule.vue"
import ShowHiddenModule from "./showHiddenModule.vue"
import EosTabs from "@/components/EosTabs/index.vue";

const { proxy } = getCurrentInstance();

const rightMenu = ref([
    {
        BILLNO: 0,
        VNAME: '条件',
    },
    {
        BILLNO: 0,
        VNAME: '高级',
    },
    {
        BILLNO: 0,
        VNAME: '排序',
    },
    {
        BILLNO: 0,
        VNAME: '显示隐藏列',
    },

    // '条件', '高级', '排序', '显示隐藏列'
])

const checked12 = ref(null)
const VTYPE=ref('1')
const props = defineProps({
    showModal: {
        type: Boolean,
        default: false,
    },
    leftList: {
        type: Array,
        default: [],
    },
    filterConfig: {
        type: Object,
        default: {},
    },
    // filterVal: {
    //     type: Object,
    //     default: {},
    // },
    // formData: {
    //     type: Object,
    //     default: {},
    // }
});


const closeModal = () => {
    emit('closeModal')
}
const closeModal1 = () => {

}

const changeBox = (val) => {
    saveAsForm.value = JSON.parse(JSON.stringify(choosePlanObj.value))
    savePlanLeft()
}


const choosePlanObj = ref({})
const conditionModuleList = ref([])
const clickLeftPlan = (item) => {

    choosePlanObj.value = item
    const protData = {
        PKBILLNO: item.BILLNO,
        ...MenuID.value,
        VTYPE: '1'
    }
    getSubList(protData).then((res) => {
        conditionModuleList.value = res.RESULT
    });

}


const showModals = computed(() => props.showModal)
const saveAsModal = ref(false)

const chooseTabVal = ref('条件')
const chooseTab = (item) => {
    chooseTabVal.value = item.data.VNAME
}

const addConditionList = ref([])
const showSaveAs = (list = []) => {
    if (list.length) {
        addConditionList.value = list
    }
    saveAsModal.value = true
}
const ruleFormRef = ref(null)
const confirmSaveAs = () => {
    ruleFormRef.value.validate((valid, fields) => {
        if (valid) {
            savePlanLeft()
        }
    })
}

const cancelSaveAs = () => {
    saveAsModal.value = false
}

const saveAsForm = ref({

})
const saveAsRules = ref({
    VNAME: [
        { required: true, message: '请输入方案名称', trigger: 'blur' },
    ],
})
const savePlanLeft = () => {

    let QUERYS = []
    QUERYS = addConditionList.value.map((ele, index) => {
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
            SORTCODE: index,
            // VTYPE: '0',
            VTYPE:VTYPE.value
        }
    })

    const protData = {
        // VNAME: saveAsForm.value.VNAME,
        // VTYPE: 1,
        // SORTCODE: null,
        // SORTINFO: null,
        // GROUPINFO: null,
        // ISDEFAULT: 1,
        ...saveAsForm.value,
        ...MenuID.value,
        VTYPE:VTYPE.value,
        // QUERYS: addConditionList.value,  // 如果外面没有方案，那么保存时候会走新增方案，把外层方案传过来
        QUERYS
    }
    if (saveAsForm.value.BILLNO) {
        updatePlan(protData).then((res) => {
            saveAsModal.value = false
            proxy.$message({
                message: res.MESSAGE,
                type: "success",
            });
            emit('updateLeftList')

        });
    } else {
        addPlan(protData).then((res) => {
            saveAsModal.value = false
            proxy.$message({
                message: res.MESSAGE,
                type: "success",
            });
            emit('updateLeftList')

        });
    }





}


const clickUpdate = () => {
    if (choosePlanObj.value.VTYPE == '0') return proxy.$modal.msgError(`默认方案不支持修改!`);
    saveAsForm.value = JSON.parse(JSON.stringify(choosePlanObj.value))
    saveAsModal.value = true

}

const clickDelete = () => {
    if (choosePlanObj.value.VTYPE == '0') return proxy.$modal.msgError(`默认方案不支持删除!`);
    // const protData = {
    //     // CHOOSEDATA: [choosePlanObj.value],
    //     // ...MenuID.value
    //     [choosePlanObj.value]
    // }
    const protData = {
        data: [choosePlanObj.value.BILLNO],
        ...MenuID.value
    }

    deleteBatchIds(protData).then((res) => {
        emit('updateLeftList')

    });

}


defineExpose({
    showSaveAs,
});


</script>

<style scoped lang="scss">
.btnStyle {
    color: var(--el-color-primary) !important;
    cursor: pointer;
    font-size: 14px;
}

.content {
    &-left {
        &-btn {}

        &-main {
            margin: 0 10px;
            border: 1px solid #ddd;
            border-radius: 4px;

            height: 400px;
            overflow-y: auto;

        }
    }

    &-right {
        border-left: 10px solid #f3f3f3;
        width: 100%;

        .currentTabs {
            background-color: #eef1f8;
            padding: 4px 8px;
            margin-right: 1px;

            &.active {
                background-color: var(--el-color-primary) !important;
                color: #fff;
            }
        }
    }




}

.saveAsAlone {

    padding: 0 40px;

    .sharedSettings {
        background-color: #9d9d9d;
        color: #fff;
        // padding: 4px 12px;
        width: 100px;
        text-align: center;

    }

    .rightBorder {
        border-bottom: 2px solid #9d9d9d;
        width: 100%;
    }
}

.chooseLeftClass {

    padding: 4px 10px;

    &.active {
        background-color: var(--el-color-primary) !important;
        color: #fff;
    }



}
</style>
