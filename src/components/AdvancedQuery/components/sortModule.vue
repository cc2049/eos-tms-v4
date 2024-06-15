<!--
 * 列表过滤中的排序组件
 * @author: wsd
 * @since: 2024-06-13
 * sortModule.vue
-->
<template>
    <div class="sortModule">
        <el-row>
            <el-col :span="8">
                <div class="contrHeight">
                    <table style="width: 220px;">
                        <thead>
                            <tr>
                                <td>字段</td>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="item in filedList" :key="item.BILLNO"
                                :class="item.BILLNO == chooseLeftVal.BILLNO ? 'active' : ''"
                                @click="clickLeftTable(item)">
                                <td>{{ item.LABEL }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </el-col>
            <el-col :span="4">
                <div><el-button type="primary" class="mb-10" size="small" @click="clickBtn(1)">加入</el-button></div>
                <div><el-button type="primary" class="mb-10" size="small" @click="clickBtn(2)">删除</el-button></div>
                <div><el-button type="primary" class="mb-30" size="small" @click="clickBtn(3)">全删</el-button></div>
                <div><el-button type="primary" class="mb-10" size="small" @click="clickBtn(4)">上移</el-button></div>
                <div><el-button type="primary" size="small" @click="clickBtn(5)">下移</el-button></div>
            </el-col>
            <el-col :span="12">
                <table style="width: 100%;">
                    <thead>
                        <tr>
                            <td style="width: 50px;">序号</td>
                            <td>字段</td>
                            <td style="width: 100px;">排序方式</td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) in rightList" :key="item.BILLNO"
                            :class="item.BILLNO == chooseRightVal.BILLNO ? 'active' : ''"
                            @click="clickRightTable(item)">
                            <td>{{ index + 1 }}</td>
                            <td>{{ item.LABEL }}</td>
                            <td>
                                <el-select v-model="item.SORTFLAG" size="small" style="width: 100%">
                                    <el-option label="升序" value="AES" />
                                    <el-option label="降序" value="DESC" />
                                </el-select>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </el-col>
        </el-row>
        <div class="tr ">
            <el-button @click="confirm">确定</el-button>
            <el-button @click="cancle">取消</el-button>
        </div>
    </div>
</template>

<script setup>
import { getFieldList, updateSortFields, getSortFieldList } from "#/system/advancedQuery";
import { inject, reactive } from "vue";
const MenuID = inject("menuID");

const { proxy } = getCurrentInstance();


const props = defineProps({
    MenuID: {
        type: Object,
        default: {},
    },
    choosePlanObj: {
        type: Object,
        default: {},
    },
});




const chooseLeftVal = ref({})
const chooseRightVal = ref({})
const rightList = ref([])
const clickLeftTable = (item) => {
    chooseLeftVal.value = item
}
const clickRightTable = (item) => {
    chooseRightVal.value = item
}

const confirm = () => {
    let FIELDS = rightList.value.map(ele => {
        return {
            FIELD: ele.FIELD,
            SORTFLAG: ele.SORTFLAG
        }
    })
    const protData = {
        BILLNO: props.choosePlanObj.BILLNO, // 方案主键
        VTYPE: props.choosePlanObj.VTYPE,
        FIELDS,
        ...props.MenuID,
    };
    updateSortFields(protData).then((res) => {
        proxy.$modal.msgSuccess("保存成功");
        emit("closeModal")
    });
}

const cancle = () => {
    emit("closeModal")
}


const clickBtn = (flag) => {
    switch (flag) {
        case 1:
            if (chooseLeftVal.value.BILLNO && !rightList.value.find(ele => ele.BILLNO == chooseLeftVal.value.BILLNO)) {
                rightList.value.push(chooseLeftVal.value)
            }
            break
        case 2:
            let index = rightList.value.findIndex(item => item.BILLNO === chooseRightVal.value.BILLNO) || null
            if (index == -1) return
            rightList.value.splice(index, 1)
            chooseRightVal.value = {}
            break
        case 3:
            rightList.value = []
            chooseRightVal.value = {}
            break
        case 4:
            let index1 = rightList.value.findIndex(item => item.BILLNO === chooseRightVal.value.BILLNO) || null
            if (index1 == -1 || index1 == 0 || !index1) return
            let currentData = JSON.parse(JSON.stringify(rightList.value[index1]))
            let exchangeData = JSON.parse(JSON.stringify(rightList.value[index1 - 1]))
            rightList.value.splice(index1, 1, exchangeData)
            rightList.value.splice(index1 - 1, 1, currentData)
            break
        case 5:
            let index2 = rightList.value.findIndex(item => item.BILLNO === chooseRightVal.value.BILLNO)
            if (index2 == rightList.value.length - 1) return
            let currentData2 = JSON.parse(JSON.stringify(rightList.value[index2]))
            let exchangeData2 = JSON.parse(JSON.stringify(rightList.value[index2 + 1]))
            rightList.value.splice(index2, 1, exchangeData2)
            rightList.value.splice(index2 + 1, 1, currentData2)
            break

    }
}
const filedList = ref([])
const getgetFieldList = () => {
    const protData = {
        ...props.MenuID,
        PKBILLNO: props.choosePlanObj.BILLNO

    }
    getFieldList(protData).then((res) => {
        filedList.value = res.RESULT
        getgetSortFieldList()
    });
}

const getgetSortFieldList = () => {
    const protData = {
        ...props.MenuID,
        PKBILLNO: props.choosePlanObj.BILLNO,
        BILLNO: props.choosePlanObj.BILLNO,

    }
    getSortFieldList(protData).then((res) => {
        rightList.value = res.RESULT

        // const newArr = res.RESULT

        rightList.value.forEach((item, index) => {
            let obj = filedList.value.find(ele => ele.FIELD == item.FIELD)
            rightList.value[index].LABEL = obj.LABEL
        })


    });
}
watch(() => props.choosePlanObj.BILLNO, value => {
    getgetFieldList();
}, { immediate: true })

onMounted(() => {
    // getgetFieldList();

});






</script>

<style scoped lang="scss">
.sortModule {
    padding: 10px 20px;
    width: 100%;

    .contrHeight {
        height: 400px;
        overflow-y: auto;
    }

    table {
        border-collapse: collapse;
        border: 1px solid #dedee0;
    }

    thead {
        background-color: #eff2f7;
        color: #333;
        // width: 100px;
        height: 40px;
        text-align: center;
    }

    tbody {
        color: #313338;

        tr {
            border-bottom: 1px solid #ddd;

            td {
                padding: 8px;
            }

            &.active {
                background-color: #e3eafd;

            }
        }



    }


}
</style>
