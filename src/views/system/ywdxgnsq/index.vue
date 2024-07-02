<!--
 * 业务对象功能授权
 * @author: wsd
 * @since: 2024-06-17
 * index.vue
-->
<template>
    <div class="ywdxgnsq">
        <!-- <TopButton ref="topBtnRef" :topButton="allPageCon.BUTTON" @currentBtn="currentBtn">
        </TopButton> -->
        <TopButton ref="topBtnRef" :topButton="allPageCon.BUTTON">
        </TopButton>
        <div class="mt-20 disflex headerSearch">
            <div class="subjectColor mr-5">授予角色</div>
            <div class="mr-20">
                <el-select v-model="roleValue" filterable placeholder="请搜索" size="small" style="width: 200px"
                    @change="changeRoleValue">
                    <el-option v-for="item in roleList" :key="item.VALUE" :label="item.LABEL" :value="item.VALUE" />
                </el-select>
            </div>
            <div class="subjectColor mr-5">关键词查询</div>
            <div class="mr-20">
                <el-input v-model="KEYWORD" size="small" @blur="KEYWORDblur"></el-input>
            </div>
            <div class=""> <el-checkbox @change="changeISENABL" v-model="leftQueryParams.ISENABL" :true-value="true"
                    :false-value="false" label="" size="large" />
            </div>
            <div class="mr-20">显示全部业务对象</div>
            <!-- <div>角色类型</div> -->
        </div>
        <div>
            <el-row>
                <el-col :span="10">
                    <ETable ref="tableRef" :tableCFG="tableConfig" :tableData="dataList" @change="tableChange"
                        @switchChange="switchChange">
                    </ETable>
                    <vxe-pager v-if="leftQueryParams.ISENABL == true" size="mini" :page-size="leftQueryParams.PAGESIZE"
                        :page-sizes="[10, 15, 20, 30, 50,]" :current-page="leftQueryParams.PAGENUM"
                        :total="leftQueryParams.total"
                        :layouts="['Total', 'PrevPage', 'JumpNumber', 'NextPage', 'Sizes']"
                        @page-change="handlePageChange">
                    </vxe-pager>
                </el-col>
                <el-col :span="14">
                    <EosTabs :tabsList="topMenuList" @change="changeTab" />
                    <ETable ref="tableFormRef" :tableCFG="tableFormConfig" v-model:tableData="form"
                        @switchChange="etableSelect" :validRules="tableRules" :actionBarWidth="80">
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
import { getModule, getButton, getListRole, authorized } from "#/system/ywdxgnsq"
import TopButton from "@/components/TopButton";
import { getPageConfig, getTableData } from "@/api/system/page";
// import { jsx } from "vue/jsx-runtime";
const route = useRoute();
const pageInfo = computed(() => route.meta)

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

const roleList = ref([])
const roleValue = ref('')
const KEYWORD = ref('')

const getgetListRole = () => {
    const protData = {
        KEYWORD: ''
    }
    getListRole(protData).then(res => {
        roleList.value = res.RESULT
    }).finally(() => {

    })
}
const changeRoleValue = () => {
    getgetModule()
}
const KEYWORDblur = () => {
    getgetModule()

}
const changeISENABL = () => {
    getgetModule()

}

const allPageCon = ref({})

const getPageConfigs = () => {
    getPageConfig({
        MODULEID: pageInfo.value.BILLNO,
        PAGEID: pageInfo.value.ACTION,
    }).then(res => {
        allPageCon.value = res.RESULT
    }).catch(err => {

    })
}
const chooseLeftData = ref({})

const switchChange = (e) => {
    // chooseLeftData.value.data = [e.row]
    console.log(e)

    console.log(lastLeftData.value)

    let newIndex = lastLeftData.value.findIndex(ele => ele.BILLNO == e.row.BILLNO)
    if (newIndex == -1 && e.value == 1) {
        lastLeftData.value.push(e.row)
    } else {
        lastLeftData.value.splice(newIndex,1)
    }

    currentBtn(e)
}
const currentBtn = (e) => {
    let LIST = lastLeftData.value.map(ele => ele.BILLNO)
    const protData = {
        "BILLNO": roleValue.value,
        "VTYPE": "1",     // 0 按钮 1 菜单
        LIST
    }
    // let LIST = [e.row.BILLNO]
    // const protData = {
    //     "BILLNO": roleValue.value,
    //     "VTYPE": "1",     // 0 按钮 1 菜单
    //     ISENABL: Number(e.value),
    //     LIST
    // }
    authorized(protData).then(res => {
        proxy.$modal.msgSuccess(res.MESSAGE || "操作成功");
        getgetModule()
    })
}


// ========================================================
// 左侧列表
const tableRef = ref(null)
const TableConfig = ref([
    // { FIELD: "VNAME", LABEL: "菜单名称", VTYPE: 'checkbox', WIDTH: 50, ALIGN: "left", ISSHOW: 1, SELECTEDFLAG: 1 },
    { FIELD: "ISAUTHORIZED", LABEL: "是否授权", EDITTABLE: 1, WIDTH: 80, ALIGN: "center", ISSHOW: 1, SELECTEDFLAG: 1, CONTROLS: "ExSwitch" },
    { FIELD: "PRIMARYMENU", LABEL: "一级菜单名称", WIDTH: 100, ALIGN: "center", ISSHOW: 1, SELECTEDFLAG: 1 },
    { FIELD: "SECONDARYMENU", LABEL: "二级菜单名称", WIDTH: 100, ALIGN: "center", ISSHOW: 1, SELECTEDFLAG: 1 },
    { FIELD: "TERTIARYMENU", LABEL: "三级菜单名称", WIDTH: 100, ALIGN: "center", ISSHOW: 1, SELECTEDFLAG: 1 },
    { FIELD: "QUATERNARYMENU", LABEL: "四级菜单名称", WIDTH: 100, ALIGN: "center", ISSHOW: 1, SELECTEDFLAG: 1 },
])
const tableConfig = ref({
    // tableColumns: TableConfig,
    // hasTableTools: false,
    // hasSeq: false,
    // toolsConfig: [],
    // loading: false,
    // hasFill: true,
    // hasEmpty: false,
    // height: window.innerHeight - 260,

    tableColumns: TableConfig,
    tableButtons: [],
    hasTableTools: false,
    hasSeq: false,
    toolsConfig: [],
    loading: false,
    height: window.innerHeight - 260
})
const leftQueryParams = ref({
    PAGENUM: 1,
    PAGESIZE: 15,
    PAGESIZES: 15,
    VNAME: '',
    total: '',
    ISENABL: false,
    // MODULEID: route.meta.BILLNO,
    // PAGEID: route.meta.PBILLNO,
})
const dataList = ref([])
const lastLeftData = ref([])

const getgetModule = () => {
    leftQueryParams.value.PK_ROLE = roleValue.value
    leftQueryParams.value.KEYWORD = KEYWORD.value,
        leftQueryParams.value.PAGESIZE = leftQueryParams.value.ISENABL == true ? leftQueryParams.value.PAGESIZES : 999
    getModule(leftQueryParams.value).then(res => {
        dataList.value = res.RESULT.records
        leftQueryParams.value.total = res.RESULT.total;

        let newArr = dataList.value.filter(ele => ele.ISAUTHORIZED == 1)
        if (leftQueryParams.value.ISENABL == false) {   // 如果不是全部的数据，就是它自己全部授权的数据
            lastLeftData.value = JSON.parse(JSON.stringify(newArr))
        }
        setTimeout(() => {
            if (newArr.length) {
                tableRef.value.xEditTable.setCheckboxRow(newArr, true)
            }
        }, 300);
    })
}
const handlePageChange = ({ currentPage, pageSize }) => {
    leftQueryParams.value.PAGENUM = currentPage;
    leftQueryParams.value.PAGESIZE = pageSize;
    leftQueryParams.value.PAGESIZES = pageSize;
    getgetModule();
};


const tableChange = (e) => {
    e.data.length ? chooseLeftData.value = e : ''
    // if (lastLeftData.value && e.row) {
    //     let newIndex = lastLeftData.value.findIndex(ele => ele.BILLNO == e.row.BILLNO)
    //     if (newIndex == -1 || e.checked) {
    //         lastLeftData.value.push(e.row)
    //     } else {
    //         lastLeftData.value.splice(newIndex, 1)
    //     }
    // } else {
    //     lastLeftData.value = e.data
    // }

    // console.log("🚀 ~ tableChange ~ lastLeftData.value:", lastLeftData.value)

    getgetButton()
}




// ==============================================


const ISAUTHORIZEDDict = [{ LABEL: "是", VALUE: "1" }, { LABEL: "否", VALUE: "0" }]

// 右侧列表
const tableFormRef = ref(null)
const TableConfig_Form = [
    { FIELD: "GROUPNAME", LABEL: "组名称", WIDTH: "120", ALIGN: "", CONTROLS: "ExTextBox", EDITTABLE: 0, ISSHOW: 1, COL: 8 },
    { FIELD: "VNAME", LABEL: "按钮名称", WIDTH: "150", ALIGN: "", CONTROLS: "ExTextBox", EDITTABLE: 0, ISSHOW: 1, COL: 8 },
    // { FIELD: "ISAUTHORIZED", LABEL: "是否授权", WIDTH: "100", ALIGN: "", CONTROLS: "ExSelect", OTHER: JSON.stringify(ISAUTHORIZEDDict), EDITTABLE: 1, DEFAULTVAL: "0", ISSHOW: 1, COL: 8 },
    { FIELD: "ISAUTHORIZED", LABEL: "是否授权", EDITTABLE: 1, WIDTH: 80, ALIGN: "center", ISSHOW: 1, SELECTEDFLAG: 1, CONTROLS: "ExSwitch" },
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
    const protData = {
        "BILLNO": roleValue.value,
        // "PK_MODULE": chooseLeftData.value.row ? chooseLeftData.value.row.BILLNO : dataList.value[chooseLeftData.value.rowIndex]?.BILLNO
        "PK_MODULE": chooseLeftData.value.data[0]?.BILLNO

    }
    getButton(protData).then(res => {
        form.value = res.RESULT
    }).finally(() => {

    })
}

const etableSelect = (data) => {

    // let LIST = [form.value[data.rowIndex].BILLNO]
    // const protData = {
    //     "BILLNO": roleValue.value,
    //     "VTYPE": "0",     // 0 按钮 1 菜单
    //     ISENABL: Number(data.value),
    //     LIST
    // }
    let LIST = [data.row.BILLNO]
    const protData = {
        "BILLNO": roleValue.value,
        "VTYPE": "0",     // 0 按钮 1 菜单
        ISENABL: Number(data.value),
        LIST
    }
    authorized(protData).then(res => {
        proxy.$modal.msgSuccess(res.MESSAGE || "操作成功");
        getgetButton()
    })
}





// ==============================================


onMounted(() => {
    getPageConfigs()
    getgetModule()
    getgetListRole()
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
