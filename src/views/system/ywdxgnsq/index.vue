<!--
 * 业务对象功能授权
 * @author: wsd
 * @since: 2024-06-17
 * index.vue
-->
<template>
    <div class="ywdxgnsq">
        <div class="mt-20 disflex headerSearch">
            <div class="subjectColor mr-5">授予角色</div>
            <div class="mr-20"></div>
            <div class=""> <el-checkbox v-model="showAllObj" true-value="1" false-value="0" label="" size="large" />
            </div>
            <div class="mr-20">显示全部业务对象</div>
            <!-- <div>角色类型</div> -->
        </div>
        <div>
            <el-row>
                <el-col :span="10">
                    <VTable ref="tableRef" :tableCFG="tableConfig" :tableData="dataList" @change="tableChange">
                        <!-- <template #actionBar="{ row }">
                            <el-row :gutter="5" justify="center">
                                <el-col :span="8">
                                <el-link :icon="Edit" :underline="false" @click="handleEdit(row)" />
                                </el-col>
                                <el-col :span="8" v-if="row.ISDELETE == '1'">
                                <el-link :icon="Delete" :underline="false" @click="handleDelete(row)" />
                                </el-col>
                            </el-row>
                            </template> -->
                    </VTable>
                    <vxe-pager size="mini" :page-size="leftQueryParams.PAGESIZE" :page-sizes="[10, 20, 30, 50, 100,]"
                        :current-page="leftQueryParams.PAGENUM" :total="leftQueryParams.total"
                        :layouts="['Total', 'PrevPage', 'JumpNumber', 'NextPage', 'Sizes']"
                        @page-change="handlePageChange">
                    </vxe-pager>
                </el-col>
                <el-col :span="14">
                    <EosTabs :tabsList="topMenuList" @change="changeTab" />
                    <ETable ref="tableFormRef" :tableCFG="tableFormConfig" v-model:tableData="form"
                        :validRules="tableRules" :actionBarWidth="80">
                    </ETable>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script setup>
// Vxtable
import ETable from "@/components/Vxtable/edit";
import VTable from "@/components/Vxtable";
import EosTabs from "@/components/EosTabs/index.vue";
import { ref } from "vue";
import { getModule, getButton } from "#/system/ywdxgnsq"

const { proxy } = getCurrentInstance();

const topMenuList = ref([
    {
        BILLNO: '1',
        VNAME: '功能权限'
    },
    {
        BILLNO: '2',
        VNAME: '基础资料权限'
    },
])

const changeTab = (val) => {
    console.log("🚀 ~ changeTab ~ val:", val)
    return {
    }
}

const showAllObj = ref('')



// 左侧列表
const tableRef = ref(null)
const TableConfig = ref([
    { FIELD: "VNAME", LABEL: "菜单名称", VTYPE: 'checkbox', WIDTH: 50, ALIGN: "left", ISSHOW: 1, SELECTEDFLAG: 1 },
    { FIELD: "PRIMARYMENU", LABEL: "一级菜单名称", WIDTH: 100, ALIGN: "left", ISSHOW: 1, SELECTEDFLAG: 1 },
    { FIELD: "SECONDARYMENU", LABEL: "二级菜单名称", WIDTH: 100, ALIGN: "left", ISSHOW: 1, SELECTEDFLAG: 1 },
    { FIELD: "TERTIARYMENU", LABEL: "三级菜单名称", WIDTH: 100, ALIGN: "left", ISSHOW: 1, SELECTEDFLAG: 1 },
    { FIELD: "QUATERNARYMENU", LABEL: "四级菜单名称", WIDTH: 100, ALIGN: "left", ISSHOW: 1, SELECTEDFLAG: 1 },
])
const tableConfig = ref({
    tableColumns: TableConfig,
    hasTableTools: false,
    hasSeq: false,
    toolsConfig: [],
    loading: false,
    hasFill: true,
    hasEmpty: false,
    height: window.innerHeight - 200,
})
const leftQueryParams = ref({
    PAGENUM: 1,
    PAGESIZE: 15,
    VNAME: '',
    total: ''
    // MODULEID: route.meta.BILLNO,
    // PAGEID: route.meta.PBILLNO,
})
const dataList = ref([])

const getgetModule = () => {
    getModule(leftQueryParams.value).then(res => {
        dataList.value = res.RESULT.records
        leftQueryParams.value.total = res.RESULT.total;

    }).finally(() => {

    })
}
const handlePageChange = ({ currentPage, pageSize }) => {
    leftQueryParams.value.PAGENUM = currentPage;
    leftQueryParams.value.PAGESIZE = pageSize;
    getgetModule();
};
const chooseLeftData = ref({})
const tableChange = (e) => {
    chooseLeftData.value = e
    getgetButton()
}




// ==============================================


const ISAUTHORIZEDDict = [{ LABEL: "是", VALUE: "1" }, { LABEL: "否", VALUE: "0" }]

// 右侧列表
const tableFormRef = ref(null)
const TableConfig_Form = [
    // { FIELD: "LABEL", LABEL: "权限组名称", WIDTH: "120", ALIGN: "", CONTROLS: "ExTextBox", ISREQUIRE: 1, EDITTABLE: 1, ISSHOW: 1, COL: 8 },
    // { FIELD: "FIELD", LABEL: "权限名称", WIDTH: "120", ALIGN: "", CONTROLS: "ExTextBox", ISREQUIRE: 1, EDITTABLE: 1, ISSHOW: 1, COL: 8 },
    // { FIELD: "CONTROLS", LABEL: "有权", WIDTH: "100", ALIGN: "", CONTROLS: "ExCheckbox", VTYPE: 'exNum', OTHER: '', EDITTABLE: 1, DEFAULTVAL: "", ISREQUIRE: 1, ISSHOW: 1, COL: 8 },
    // { FIELD: "ISSHOW", LABEL: "无权", WIDTH: "80", ALIGN: "", CONTROLS: "ExCheckbox", VTYPE: 'exNum', OTHER: '', EDITTABLE: 1, ISSHOW: 1, COL: 8, ISSORT: 1 },
    // { FIELD: "COL", LABEL: "禁止", WIDTH: "80", ALIGN: "", CONTROLS: "ExCheckbox", EDITTABLE: 1, DEFAULTVAL: "12", ISSHOW: 1, ISREQUIRE: 1, COL: 8 },
    // { FIELD: "ISREQUIRE", LABEL: "数据范围", WIDTH: " 180", ALIGN: "", CONTROLS: "ExTextBox", VTYPE: 'exNum', OTHER: '', ISSHOW: 1, COL: 8 },
    { FIELD: "GROUPNAME", LABEL: "组名称", WIDTH: "120", ALIGN: "", CONTROLS: "ExTextBox", EDITTABLE: 0, ISSHOW: 1, COL: 8 },
    { FIELD: "VNAME", LABEL: "按钮名称", WIDTH: "150", ALIGN: "", CONTROLS: "ExTextBox", EDITTABLE: 0, ISSHOW: 1, COL: 8 },
    // { FIELD: "ISAUTHORIZED", LABEL: "是否授权", WIDTH: "100", ALIGN: "", CONTROLS: "ExCheckbox", VTYPE: 'exNum', OTHER: JSON.stringify(ISAUTHORIZEDDict), EDITTABLE: 1, DEFAULTVAL: "", ISSHOW: 1, COL: 8 },
    { FIELD: "ISAUTHORIZED", LABEL: "是否授权", WIDTH: "100", ALIGN: "", CONTROLS: "ExSelect", OTHER: JSON.stringify(ISAUTHORIZEDDict), EDITTABLE: 1, DEFAULTVAL: "0", ISSHOW: 1, COL: 8 },

]
const tableFormConfig = reactive({
    tableColumns: TableConfig_Form,
    // tableButtons: ['ADD', 'EDIT', 'DELETE'],
    tableButtons: [],
    hasTableTools: false,
    hasSeq: false,
    toolsConfig: [],
    loading: false,
    height: window.innerHeight - 255
});
const form = ref()
const tableRules = ref({})



const getgetButton = () => {
    console.log(dataList.value)
    console.log(dataList.value)
    const protData = {
        "BILLNO": "10",
        "PK_MODULE": dataList.value[chooseLeftData.value.rowIndex].BILLNO
    }
    getButton(protData).then(res => {
        console.log("🚀 ~ getModule ~ res:", res)
        form.value = res.RESULT
    }).finally(() => {

    })
}






// ==============================================


onMounted(() => {
    getgetModule()
})

</script>

<style scoped lang="scss">
.ywdxgnsq {
    padding: 10px 20px;

    .headerSearch {
        font-size: 12px;
        // color: ;
        margin-bottom: 20px;
    }

    .subjectColor {
        color: var(--el-color-primary) !important;
    }

}
</style>
