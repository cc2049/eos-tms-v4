<!--
 * 列表过滤中的排序组件
 * @author: wsd
 * @since: 2024-06-13
 * showHiddenModule.vue
-->
<template>
    <div class="showHiddenModule">
        <el-row gutter="20">
            <el-col :span="20">
                <div class="contrHeight">
                    <table style="width: 100%;">
                        <!-- <thead style="position: sticky;top: 0;z-index: 999;"> -->
                        <thead>
                            <tr>
                                <td>序号</td>
                                <td>字段</td>
                                <td>显示</td>
                                <td>宽度</td>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item, index) in filedList" :key="item.BILLNO"
                                :class="item.BILLNO == chooseLeftVal.BILLNO ? 'active' : ''"
                                @click="clickLeftTable(item)">
                                <td style="width: 50px;">{{ index + 1 }}</td>
                                <td>{{ item.LABEL }}</td>
                                <td style="width: 60px;"><el-checkbox v-model="item.IS_SHOW" true-value="1"
                                        false-value="0" /></td>
                                <td style="width: 90px;"><el-input v-model="item.WIDTH" type="number" size="small"
                                        style="width: 150px;"></el-input></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </el-col>
            <el-col :span="4">
                <div><el-button type="primary" class="mb-20" size="small" @click="clickBtn(4)">上移</el-button></div>
                <div><el-button type="primary" class="mb-20" size="small" @click="clickBtn(5)">下移</el-button></div>
                <div class="mb-10">调至（行）</div>
                <div class="mb-20"><el-input type="number" v-model="numberLIne" size="small" @blur="clickBtn(1)"
                        style="width: 50px;"></el-input></div>
                <div><el-button type="primary" class="mb-20" size="small" @click="clickBtn(2)">默认值</el-button></div>
            </el-col>
        </el-row>
        <div class="tr ">
            <el-button @click="confirm">确定</el-button>
            <el-button @click="cancle">取消</el-button>
        </div>
    </div>
</template>

<script setup>
import { getFieldList } from "#/system/advancedQuery";
import { inject, reactive } from "vue";
const MenuID = inject("menuID");



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
const clickLeftTable = (item) => {
    chooseLeftVal.value = item
    numberLIne.value = null
}

const numberLIne = ref(null)

const clickBtn = (flag) => {
    console.log(numberLIne.value)
    if (!chooseLeftVal.value.BILLNO) return
    switch (flag) {
        case 1:
            if (numberLIne.value >= filedList.value.length || !chooseLeftVal.value.BILLNO) return
            let index3 = filedList.value.findIndex(item => item.BILLNO == chooseLeftVal.value.BILLNO)
            let currentData3 = JSON.parse(JSON.stringify(filedList.value[index3]))
            let exchangeData3 = JSON.parse(JSON.stringify(filedList.value[numberLIne.value - 1]))
            filedList.value.splice(index3, 1, exchangeData3)
            filedList.value.splice(numberLIne.value - 1, 1, currentData3)
            break
        case 2:
            let newArr = initFiledList.value.filter(ele => ele.BILLNO == chooseLeftVal.value.BILLNO)
            console.log("🚀 ~ clickBtn ~ newArr:", newArr)
            let newIndex = filedList.value.findIndex(item => item.BILLNO == chooseLeftVal.value.BILLNO)
            filedList.value[newIndex] = JSON.parse(JSON.stringify(newArr[0]))

            break
        case 3:

            break
        case 4:
            let index1 = filedList.value.findIndex(item => item.BILLNO === chooseLeftVal.value.BILLNO) || null
            if (index1 == -1 || index1 == 0 || !index1) return
            let currentData = JSON.parse(JSON.stringify(filedList.value[index1]))
            let exchangeData = JSON.parse(JSON.stringify(filedList.value[index1 - 1]))
            filedList.value.splice(index1, 1, exchangeData)
            filedList.value.splice(index1 - 1, 1, currentData)
            break
        case 5:
            let index2 = filedList.value.findIndex(item => item.BILLNO === chooseLeftVal.value.BILLNO)
            if (index2 == filedList.value.length - 1) return
            let currentData2 = JSON.parse(JSON.stringify(filedList.value[index2]))
            let exchangeData2 = JSON.parse(JSON.stringify(filedList.value[index2 + 1]))
            filedList.value.splice(index2, 1, exchangeData2)
            filedList.value.splice(index2 + 1, 1, currentData2)
            break

    }
}
const filedList = ref([])
const initFiledList = ref([])
const getgetFieldList = () => {
    const protData = {
        ...props.MenuID,
        PKBILLNO: props.choosePlanObj.BILLNO

    }
    getFieldList(protData).then((res) => {
        filedList.value = JSON.parse(JSON.stringify(res.RESULT))
        initFiledList.value = JSON.parse(JSON.stringify(res.RESULT))
    });
}

onMounted(() => {
    getgetFieldList();

});






</script>

<style scoped lang="scss">
.showHiddenModule {
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
