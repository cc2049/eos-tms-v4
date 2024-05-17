<!--
 * 页面过滤
 * @author: wsd
 * @since: 2024-05-16
 * allocationPlan.vue
-->
<template>
    <div class="container">

        <vxe-modal destroy-on-close v-model="showModals" id="formModal" :width="600" resize storage transfer show-zoom
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
                        <el-checkbox v-model="choosePlanObj.ISDEFAULT" class="ml-10" label="下次以此方案自动进入" size="large" />
                    </div>
                    <div class="content-right ">
                        <div class="flex">
                            <div v-for="(item, index) in rightMenu" :key="index" class="currentTabs"
                                :class="chooseTabVal == item ? 'active' : ''" @click="chooseTab(item)">
                                {{ item }}
                            </div>
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
import { addPlan, updatePlan, deleteBatchIds } from "#/system/advancedQuery";
import { inject, reactive } from "vue";


const rightMenu = ref([
    '条件', '高级', '排序', '显示隐藏列'
])
const MenuID = inject("menuID");
// console.log("🚀 ~ MenuID:", MenuID.value)

const props = defineProps({
    showModal: {
        type: Boolean,
        default: false,
    },
    leftList: {
        type: Array,
        default: [],
    }
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


const choosePlanObj = ref({})
const clickLeftPlan = (item) => {
    console.log("🚀 ~ clickLeftPlan ~ item:", item)

    choosePlanObj.value = item

}


const showModals = computed(() => props.showModal)
const saveAsModal = ref(false)

const chooseTabVal = ref('条件')
const chooseTab = (item) => {
    chooseTabVal.value = item
}


const showSaveAs = () => {
    saveAsModal.value = true
}

const confirmSaveAs = () => {
    savePlanLeft()
}

const cancelSaveAs = () => {
    saveAsModal.value = false
}

const saveAsForm = ref({

})
const saveAsRules = ref({})
const savePlanLeft = () => {

    const protData = {
        // VNAME: saveAsForm.value.VNAME,
        // VTYPE: 1,
        // SORTCODE: null,
        // SORTINFO: null,
        // GROUPINFO: null,
        // ISDEFAULT: 1,
        ...saveAsForm.value,
        ...MenuID.value
    }

    if (saveAsForm.value.BILLNO) {
        updatePlan(protData).then((res) => {
            saveAsModal.value = false

            emit('updateLeftList')

        });
    } else {
        addPlan(protData).then((res) => {
            saveAsModal.value = false
            emit('updateLeftList')

        });
    }





}


const clickUpdate = () => {
    saveAsForm.value = JSON.parse(JSON.stringify(choosePlanObj.value))
    saveAsModal.value = true

}

const clickDelete = () => {
    const protData = {
        CHOOSEDATA:[choosePlanObj.value],
        ...MenuID.value
    }

    deleteBatchIds(protData).then((res) => {
        emit('updateLeftList')

    });

}





</script>

<style scoped lang="scss">
@import "@/assets/styles/variables.module.scss";

.btnStyle {
    color: $--color-primary;
    cursor: pointer;
    font-size: 14px;
}

.content {
    &-left {
        &-btn {}

        &-main {
            margin-left: 10px;
            border: 1px solid #ddd;
            border-radius: 4px;

            height: 300px;
            overflow-y: auto;

        }
    }

    &-right {
        border-left: 10px solid #f3f3f3;

        .currentTabs {
            background-color: #eef1f8;
            padding: 4px 8px;
            margin-right: 1px;

            &.active {
                background-color: $--color-primary;
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
        background-color: $--color-primary;
        color: #fff;
    }



}
</style>
