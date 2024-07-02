<!--
 * 帮助中心
 * @author: wsd
 * @since: 2024-07-02
 * helpCenter.vue
-->
<template>
    <div>
        <el-drawer v-model="isShow" title="帮助助手" custom-class="helpContent">
            <div class="helpContent">
                <div class="topCon">
                    <div></div>
                    <div>用户帮助手册</div>
                </div>
                <div class="topCon">
                    <div></div>
                    <div>掌上报销支持事由申请单功能</div>
                </div>
                <div>业务知识</div>
                <div class="problem">
                    <div class="problem-title">常见问题</div>
                    <div class="problem-content">
                        <div v-for="item in problemList" :key="item.BILLNO" class="disflex mb-10">
                            <div class="problem-content-left">知识</div>
                            <div class="problem-content-right">{{ item.TITLE }}</div>
                        </div>
                    </div>
                    <div class="problem-footer" @click="clickMoreContent">
                        更多内容
                    </div>
                </div>
                <!-- <div class="problem">
                    <div class="problem-title">产品快速入门</div>
                    <div class="problem-content">
                        
                    </div>
                    <div class="problem-footer">
                        更多内容
                    </div>
                </div> -->
            </div>

        </el-drawer>

    </div>
</template>

<script setup>
import { getTableData } from "@/api/system/page";

const emit = defineEmits(["update:helpDrawer","clickMoreContent"]);

const router = useRouter();

const props = defineProps({
    helpDrawer: {
        type: Boolean,
        default: false,
    },
});
const isShow = computed(() => props.helpDrawer);

const clickMoreContent=()=>{
    // props.helpDrawer = false
    router.push({
      path: '/PLAT_YW/help/wtzsk',
    });
    emit("clickMoreContent")
}

const problemList=ref([])
const getProblem = () => {
    let portData =
        { "APPID": "", "DATA": { "TITLE": "", "PKBILLNO": "", "PAGESIZE": 6, "QUERYS": [{ "FIELD": "PK_CLASS", "QUERYTYPE": "EqualTo", "DEFAULTVAL": "CL230207761578", "SORTCODE": "" }], "PAGENUM": 1, "SORTNAME": "", "REVERSE": "", "PK_PARENT": "CL230207761578", "PK_CLASS": "CL230207761578" }, "KEY": "", "MODULEID": "MU230206997479", "PAGEID": "PG230206684914", "PARENTPAGE": "", "PROGRAMID": "", "CLIENTTYPE": "PC", "VERSION": "" }
    getTableData("/sys/help/wiki/getPageList", portData)
        .then((res) => {
            console.log("🚀 ~ .then ~ res:", res)
            problemList.value = res.RESULT.RECORDS
        })
        .catch(() => {

        });
}

onMounted(() => {
    getProblem()
})


</script>

<style scoped lang="scss">
.helpContent {
    padding: 10px;
    font-size: 14px;

    .topCon {
        background-color: #fff;
        padding: 6px 10px;
        border-radius: 6px;
        margin-bottom: 10px;
    }

    .problem {
        background-color: #fff;
        padding: 6px 0;
        border-radius: 6px;
        margin: 10px 0;

        &-title {
            border-bottom: 1px solid #e2e2e2;
            padding: 6px;
        }

        &-content{
            padding: 6px;
            &-left{
                background-color: #59b9bc;
                padding: 2px;
                color: #fff;
                border-radius: 2px;
                margin-right: 10px;
            }
            &-right{
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
            }
        }

        &-footer{
            color: #3674c8;
            text-align: center;
            border-top: 1px solid #e2e2e2;
            padding: 6px;
            cursor: pointer;
        }


    }




}


// background-color: #eef0f3;
:deep(.el-drawer__body) {
    background-color: #eef0f3 !important;
    margin: 0 !important;
    padding: 0 !important;
    color: #333;
}

:deep(.el-drawer__header) {
    margin-bottom: 0 !important;
    background-color: #3252f5 !important;
    color: #fff;
    padding: 10px;

    .el-drawer__title {
        font-size: 14px;
    }

    .el-icon {
        font-size: 14px;
    }
}
</style>
