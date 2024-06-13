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
                            <tr v-for="item in filedList" :key="item.BILLNO">
                                <td>{{ item.LABEL}}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </el-col>
            <el-col :span="4">
                <div><el-button type="primary" class="mb-10" size="small">加入</el-button></div>
                <div><el-button type="primary" class="mb-10" size="small">删除</el-button></div>
                <div><el-button type="primary" class="mb-30" size="small">全删</el-button></div>
                <div><el-button type="primary" class="mb-10" size="small">上移</el-button></div>
                <div><el-button type="primary" size="small">下移</el-button></div>
            </el-col>
            <el-col :span="12">
                <table style="width: 280px;">
                    <thead>
                        <tr>
                            <td>序号</td>
                            <td>字段</td>
                            <td>排序方式</td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>这大</td>
                        </tr>
                        <tr>
                            <td>这大</td>
                        </tr>
                        <tr>
                            <td>这大</td>
                        </tr>
                        <tr>
                            <td>这大</td>
                        </tr>
                    </tbody>
                </table>
            </el-col>
        </el-row>
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

const filedList = ref([])
const getgetFieldList = () => {
    const protData = {
        ...props.MenuID,
        PKBILLNO: props.choosePlanObj.BILLNO

    }
    getFieldList(protData).then((res) => {
        filedList.value = res.RESULT
    });
}

onMounted(() => {
    getgetFieldList();

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
