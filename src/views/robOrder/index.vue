<!-- 抢单大厅 -->
<template>
    <div class="manual-app">
        <el-row>
            <el-col :span="5">
                <el-card class="box-card">
                    <div>
                        <el-tabs v-model="queryLeftForm.TAGSTATUS" class="demo-tabs" @tab-change="handleClick">
                            <template>
                                <template v-if="userInfo.USERTYPE == 0">
                                    <el-tab-pane label="未开始" name="1"></el-tab-pane>
                                    <el-tab-pane label="抢单中" name="2"></el-tab-pane>
                                    <el-tab-pane label="已结束" name="4"></el-tab-pane>
                                </template>
                                <template v-else>
                                    <el-tab-pane label="全部" name="0"></el-tab-pane>
                                    <el-tab-pane label="已抢单" name="3"></el-tab-pane>
                                    <el-tab-pane label="已结束" name="4"></el-tab-pane>
                                </template>
                            </template>
                        </el-tabs>
                    </div>
                    <div class="mb10 disflex ">
                        <el-input size="default" v-model="queryLeftForm.KEYWORD" placeholder="请输入关键词查询"
                            :prefix-icon="Search" clearable />
                        <el-divider direction="vertical" />
                        <el-button text @click="clickLeftBtn">查询</el-button>
                    </div>
                    <el-scrollbar :height="leftHight">
                        <div v-for="(item, index) in leftMenuList" :key="index" class="leftMenu"
                            :class="{ 'active': menuVal == item.BILLNO }" @click="chooeseMune(item)">
                            <div class="leftMenu-alone disflex justify-sb ">
                                <div class="leftMenu-title">
                                    <TextOverflow :content="item.VNAME" />
                                </div>
                                <!-- <div class="leftMenu-status" :class="`leftMenu-status${item.BILLSTATUS}`">{{
          statusList[item.BILLSTATUS] }}</div> -->
                                <div class="leftMenu-status" :class="`leftMenu-status${item.BILLSTATUS}`">
                                    {{ item.STATUSNAME }}
                                </div>

                            </div>
                            <!-- <div class="leftMenu-content">报名截止时间：{{ item.SIGNENDTIME }}</div> -->
                            <div class="leftMenu-content">抢单开始时间：{{ item.ROBSTTIME }}</div>
                            <div class="leftMenu-content">抢单截止时间：{{ item.ROBEDTIME }}</div>
                        </div>
                    </el-scrollbar>
                </el-card>
            </el-col>
            <el-col :span="19">

                <el-card class="box-card" v-if="detailNoDynamic.BILLNO">
                    <template #header>
                        <div class="tr">
                            <!-- <el-button size="small" :type="btn.COLOR" 
                v-for="(btn,btnIndex) in allPageCon.BUTTON" 
                @click="clickCommonBtn(btn)"
                :key="btn.BILLNO">{{ btn.VNAME }}</el-button> -->

                            <!-- <TopButton :topButton="allPageCon.BUTTON" sourceType="2" @handleBtnEvent="clickCommonBtn"  /> -->
                            <TopButton :isCurrentBtn="true" ref="topBtnRef" :currentData="[detailNoDynamic]"
                                @reloadTableData="reloadTableData">
                                <template #currentBtn>
                                    <!-- 走了财旺的按钮方法 -->
                                    <template v-for="(btn, btnIndex) in allPageCon.BUTTON" :key="btn.BILLNO">
                                        <el-button v-if="setShowBtn(btn)" size="small" :type="btn.COLOR"
                                            :disabled="(btn.BTNTITLE == 'cancellation' || btn.BTNTITLE == 'winBidding') && !applyInfoRefChooseList.length ? true : false"
                                            @click="clickCommonBtn(btn)">{{
                btn.VNAME }}</el-button>
                                    </template>
                                </template>
                            </TopButton>
                        </div>
                    </template>
                    <el-scrollbar :height="Hight">
                        <div class="card-header">
                            <div>
                                <div class="disflex">
                                    <div class="card-header-title">{{ detailNoDynamic.VNAME }}</div>
                                </div>
                            </div>
                            <div class="disflex">
                                <div class="disflex">
                                    <div class="card-header-tag">
                                        <div class="card-header-tag-text">
                                            <!-- {{ BILLSTATUSList[detailNoDynamic.BILLSTATUS] || '暂无状态' }} -->
                                            <!-- {{ queryLeftForm.BILLSTATUS == 6 ? detailNoDynamic.STATUSNAME : detailNoDynamic.STATUSNAME }} -->
                                            {{ chooseLeftData.RESIDUETIME }}
                                        </div>
                                    </div>
                                    <countDown ref="countDownRef" :time="detailNoDynamic.ROBEDTIME" />
                                </div>
                            </div>
                        </div>
                        <el-collapse v-model="activeName" class="">
                            <el-collapse-item name="1">
                                <!-- <template #title>
                                    <div class="commonSmallTitle">竞价信息</div>
                                </template> -->
                                <div>
                                    <div class="cargoInfo">
                                        <div class="disflex mb-10">
                                            <div>需求编号：</div>
                                            <div>{{ detailNoDynamic.VCODE }}</div>
                                            <el-button type="primary" class="ml-10" link
                                                @click="copyVCODE">复制</el-button>
                                        </div>
                                        <div class="cargoInfo-top">
                                            <div class="disflex justify-sb ">
                                                <div class="disflex mr-30">
                                                    <div class="cargoInfo-top-start">装</div>
                                                    <div class="">
                                                        <div class="cargoInfo-top-startTitle">
                                                            {{ detailNoDynamic.SENDPROVINCE }}
                                                            {{ detailNoDynamic.SENDCITY }}</div>
                                                        <div class="cargoInfo-top-describe">
                                                            {{ detailNoDynamic.SENDCITY }}
                                                            {{ detailNoDynamic.SENDCOUNTY }}
                                                            {{ detailNoDynamic.SENDAREAINFO }}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="cargoInfo-top-line mr-30">
                                                    {{ detailNoDynamic.MILEAGE }} KM
                                                </div>
                                                <div class="disflex">
                                                    <div class="cargoInfo-top-end">卸</div>
                                                    <div class="">
                                                        <div class="cargoInfo-top-endTitle">
                                                            {{ detailNoDynamic.RECVPROVINCE }}
                                                            {{ detailNoDynamic.RECVCITY }}
                                                        </div>
                                                        <div class="cargoInfo-top-describe">
                                                            {{ detailNoDynamic.RECVCITY }}
                                                            {{ detailNoDynamic.RECVCOUNTY }}
                                                            {{ detailNoDynamic.RECVAREAINFO }}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div>
                                                <div v-for="item in detailNoDynamic.SUBLIST" :key="item.BILLNO"
                                                    class="disflex">
                                                    <div>{{ item.MATERIALNAME }}/</div>
                                                    <div>{{ item.ROBNUM }}</div>
                                                    <div>{{ item.VUNIT }}</div>
                                                </div>
                                            </div>
                                        </div>
                                        <el-row>
                                            <el-col :span="6">
                                                <span>发货日期：</span>
                                                <span class="cargoInfo-top-content">{{ detailNoDynamic.YQSTDATE
                                                    }}</span>
                                            </el-col>
                                            <el-col :span="6">
                                                <span>要求送达日期：</span>
                                                <span class="cargoInfo-top-content">{{ detailNoDynamic.YQSDDATE
                                                    }}</span>
                                            </el-col>
                                            <el-col :span="6">
                                                <span>车辆类型：</span>
                                                <span class="cargoInfo-top-content">{{ detailNoDynamic.CARTYPE }}</span>
                                            </el-col>
                                            <el-col :span="6">
                                                <span>提供装货：</span>
                                                <span class="cargoInfo-top-content">{{ detailNoDynamic.IS_LOAD == 1 ?
                '是' : '否'
                                                    }}</span>
                                            </el-col>
                                            <el-col :span="6">
                                                <span>提供卸货：</span>
                                                <span class="cargoInfo-top-content">{{ detailNoDynamic.IS_UNLOAD == 1 ?
                '是' : '否'
                                                    }}</span>
                                            </el-col>
                                            <el-col :span="6">
                                                <span>提供发票：</span>
                                                <span class="cargoInfo-top-content">{{ detailNoDynamic.IS_INVOICE == 1 ?
                '是' : '否'
                                                    }}</span>
                                            </el-col>
                                        </el-row>


                                        <el-row class=" mt10 pt-10" style="border-top: 1px dashed #ccc;">
                                            <el-col :span="12">
                                                <span>抢单时间：</span>
                                                <span class="cargoInfo-top-content">{{ detailNoDynamic.ROBSTTIME }} - {{
                detailNoDynamic.ROBEDTIME
            }}</span>
                                            </el-col>
                                            <el-col :span="6">
                                                <span>抢单类型：</span>
                                                <span class="cargoInfo-top-content">{{
                detailNoDynamic.VTYPE == 0 ? '司机抢单' : '承运商抢单'
            }}</span>
                                            </el-col>
                                            <el-col :span="6">
                                                <span>运费价格：</span>
                                                <span class="cargoInfo-top-content">{{
                detailNoDynamic.TRANSPRICE
            }}元</span>
                                            </el-col>


                                            <el-col :span="6">
                                                <span>确标方式：</span>
                                                <span class="cargoInfo-top-content">{{ detailNoDynamic.IS_SURE == 1 ?
                '人工' : '自动'
                                                    }}</span>
                                            </el-col>
                                            <el-col :span="6" v-if="detailNoDynamic.VTYPE == 0">
                                                <span>结算周期：</span>
                                                <span class="cargoInfo-top-content">{{ detailNoDynamic.SETTLECYCLE ==
                0 ? '现结' : detailNoDynamic.SETTLECYCLE ==
                    1 ? '7天' : detailNoDynamic.SETTLECYCLE ==
                        2 ? '14天' : ''
                                                    }}</span>
                                            </el-col>

                                        </el-row>


                                    </div>
                                </div>

                            </el-collapse-item>
                        </el-collapse>
                        <!-- 货主 -->
                        <!-- 抢单项目状态 BILLSTATUS 0-未开始(未审核、审核中、未通过) 1-未发布 2-已发布 3-抢单中 4-已结束 -->
                        <template v-if="userInfo.USERTYPE == 0">
                            <div v-if="detailNoDynamic.BILLSTATUS == 3 || detailNoDynamic.BILLSTATUS == 4">
                                <div class="commonSmallTitle mt-10 disflex justify-sb">
                                    <div class="disflex card-header">
                                        <div class="mr-20">抢单信息</div>
                                        <div class="disflex">
                                            <div class="disflex">
                                                <div class="selectLeftText">抢单单位</div>
                                                <el-select v-model="robOrderForm.PK_ROBE" size="small" clearable
                                                    style="width: 120px" @change="changePK_CARRIER">
                                                    <el-option :label="item.ROBERNAME" :value="item.PK_ROBE"
                                                        v-for="item in PK_ROBEList" :key="item.PK_ROBE" />
                                                </el-select>
                                            </div>
                                            <div class="disflex ml-20" v-if="detailNoDynamic.BILLSTATUS == 4">
                                                <div class="selectLeftText">是否中标</div>
                                                <el-select v-model="robOrderForm.BILLSTATUS" size="small" clearable
                                                    style="width: 120px" @change="changeIS_BID">
                                                    <el-option label="待确认" value="0" />
                                                    <el-option label="成功" value="1" />
                                                    <el-option label="失败" value="2" />
                                                </el-select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="mt10">
                                    <el-table ref="applyInfoRef" :data="applyInfoList" style="width: 100%" border
                                        :span-method="arraySpanMethod" @selection-change="applyInfoRefSelectionChange">
                                        <el-table-column type="selection" width="55" />
                                        <el-table-column prop="ROBERNAME" width="120" show-overflow-tooltip
                                            label="抢单单位" />
                                        <el-table-column prop="PHONE" width="120" show-overflow-tooltip label="联系方式" />
                                        <el-table-column prop="CREATIONTIME" width="120" show-overflow-tooltip
                                            label="抢单时间" />
                                        <el-table-column prop="BILLSTATUS" show-overflow-tooltip label="中标">
                                            <template #default="scope">
                                                <span> {{ scope.row.BILLSTATUS == 0 ? '否' : scope.row.BILLSTATUS ==
                1 ? '成功' : scope.row.BILLSTATUS ==1 ? '是' : '' }} </span>
                                            </template>
                                        </el-table-column>
                                        <el-table-column prop="ROBWEIGHT" label="出量" />
                                        <el-table-column prop="MATERIALNAME" show-overflow-tooltipshow-overflow-tooltip
                                            width="120" label="物料名称" />
                                        <el-table-column prop="ENTRUSTNUM" label="分配量" width="140">
                                            <!-- <template #default="scope">
                                                <span v-if="detailNoDynamic.BILLSTATUS != 3">{{ scope.row.ENTRUSTNUM
                                                    }}</span>
                                                <el-input v-else type="number" size="small" v-model="scope.row.ENTRUSTNUM"
                                                    placeholder="输入分配量" clearable />
                                            </template> -->
                                        </el-table-column>
                                        <el-table-column prop="SURENAME" label="中标确认人" width="120" />
                                        <el-table-column prop="SURETIME" show-overflow-tooltip width="120"
                                            label="中标时间" />
                                        <el-table-column label="资质审查">
                                            <template #default="scope">
                                                <el-button type="primary" text
                                                    @click="checkCertification(scope.row)">查看资质</el-button>
                                            </template>
                                        </el-table-column>
                                    </el-table>
                                </div>
                            </div>
                            <!-- 公告信息 -->
                            <div v-if="detailNoDynamic.BILLSTATUS == 1 || detailNoDynamic.BILLSTATUS == 2">
                                <div class="commonSmallTitle mt-10 disflex justify-sb">
                                    <div class="disflex card-header">
                                        <div class="mr-20">公告信息</div>
                                    </div>
                                </div>
                                <div class="mt10 p-5" v-if="noticInfo.BILLNO">
                                    <div class="noticInfoTitle mt-10 mb-10">{{ noticInfo.VNAME }}</div>
                                    <div v-html="noticInfo.CONTENT"></div>
                                </div>
                                <div v-else>
                                    <el-empty :image="emptyImg" description="很抱歉，暂时没有相关数据~" :image-size="150" />
                                </div>
                            </div>
                        </template>
                        <!-- 承运商 -->
                        <template v-else>
                            <div v-if="detailNoDynamic.BILLSTATUS == 3 || detailNoDynamic.BILLSTATUS == 4">
                                <div class="commonSmallTitle mt-10 disflex justify-sb">
                                    <div class="disflex card-header">
                                        <div class="mr-20">抢单信息</div>
                                    </div>
                                </div>
                                <div class="mt10">
                                    <el-table ref="applyInfoRef" :data="applyInfoList" style="width: 100%"
                                        @selection-change="applyInfoRefSelectionChange">
                                        <el-table-column prop="ROBERNAME" show-overflow-tooltip label="抢单单位" />
                                        <el-table-column prop="CREATIONTIME" show-overflow-tooltip label="抢单时间" />
                                        <el-table-column prop="BILLSTATUS" show-overflow-tooltip label="中标">
                                            <template #default="scope">
                                                <span> {{ scope.row.BILLSTATUS == 0 ? '待确认' : scope.row.BILLSTATUS ==
                                                    1?'成功':scope.row.BILLSTATUS == 2?'失败':''}} </span>
                                            </template>
                                        </el-table-column>
                                        <el-table-column prop="MATERIALNAME" label="物料名称" />
                                        <el-table-column prop="ENTRUSTNUM" label="分配量" />
                                        <el-table-column prop="SURENAME" label="中标确认人" />
                                        <el-table-column prop="SURETIME" label="中标时间" />
                                    </el-table>
                                </div>
                            </div>
                        </template>
                    </el-scrollbar>
                </el-card>
                <el-card v-else>
                    <el-empty style="height: 680px;" :image="emptyImg" description="很抱歉，暂时没有相关数据~" :image-size="350" />
                </el-card>
                <!-- </el-scrollbar> -->

            </el-col>
        </el-row>

        <vxe-modal destroy-on-close v-model="applyDetailModal" id="formModal" width="800" height="400" resize storage
            transfer show-zoom>
            <template #title>
                <span class="modal-title"> 报名明细
                </span>
            </template>
            <template #default>
                <el-table ref="applyInfoRef" :data="applyInfoList" style="width: 100%">
                    <el-table-column prop="BILLSTATUS" label="报名状态">
                        <template #default="scope">
                            <span>{{ scope.row.BILLSTATUS == 0 ? '未确认' : '已确认' }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="CARRIERNAME" show-overflow-tooltip label="报名单位" />
                    <el-table-column prop="CREATIONTIME" show-overflow-tooltip label="报名时间" />
                    <el-table-column prop="CREATORNAME" label="报名用户" />
                    <el-table-column prop="APPROVER" label="确认人" />
                    <el-table-column prop="APPROVERTIME" label="确认时间" />
                    <el-table-column prop="BILLSTATUS" label="资质审查">
                        <template #default="scope">
                            <!-- 调用 13 -->
                            <el-button type="primary" text @click="checkCertification(scope.row)">查看资质</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </template>
        </vxe-modal>
    </div>
</template>

<script setup>

const leftHight = window.innerHeight - 218;
const Hight = window.innerHeight - 168;
const { proxy } = getCurrentInstance();
// const MenuID = inject("menuID");

const route = useRoute();

const router = useRouter();
const routerParams = router.currentRoute.value.meta;
const menuParams = ref({
    MODULEID: routerParams.BILLNO || "-",
    PAGEID: routerParams.ACTION || "-",
});
provide("menuID", menuParams);

const emptyImg = proxy.getAssetsFile("icon_task_NoData.png");


import TopButton from "@/components/TopButton";

import { computed, onMounted, onUnmounted, ref, } from "vue";

import { Search } from "@element-plus/icons-vue";
import { getPageConfig, getTableData } from "@/api/system/page";
import countDown from "@/components/countDown/index";
import axios from "axios";


const robOrderForm = ref({
    PK_ROBE: '',
    BILLSTATUS: '',
})

const ruleForm = ref({
    BIDPRICE: null,
    EXPECTVALUE: null,
    BIDADDRESS: null,
});
import TextOverflow from "@/components/TextOverflow"

// const titleIndex = ref(0);
import useUserStore from "@/store/modules/user";

const userStore = useUserStore();

const userInfo = computed(() => userStore.userInfo);
// 0货主 2 承运商
// BILLSTATUS  0未开始(待提交、审核中、未通过)、1待发公告、2报名中(无需报名的没有这个状态)、3待竞价(报名结束)、4竞价中、5竞价结束、6已完成/已结束(已中标、未中标、已作废)、7强制结束
const statusList = ref(['未开始', '待发公告', '报名中', '待竞价', '竞价中', '竞价结束', '已完成', '强制结束'])

const pageInfo = computed(() => route.meta)

const cellList = ref([])
const listCount = ref(null)
const computeCell = (tableBody) => {
    // 循环遍历表体数据
    for (let i = 0; i < tableBody.length; i++) {
        if (i == 0) {
            // 先设置第一项
            cellList.value.push(1); // 初为1，若下一项和此项相同，就往cellList数组中追加0
            listCount.value = 0; // 初始计数为0
            // console.log("索引", 0, listCount.value);
        } else {
            // 判断当前项与上项的设备类别是否相同，因为是合并这一列的单元格
            if (tableBody[i].BILLNO == tableBody[i - 1].BILLNO) {
                // 如果相等
                cellList.value[listCount.value] += 1; // 增加计数
                cellList.value.push(0); // 相等就往cellList数组中追加0
                // console.log("索引", i, listCount.value);
            } else {
                cellList.value.push(1); // 不等就往cellList数组中追加1
                listCount.value = i; // 将索引赋值为计数
                // console.log("索引", i, listCount.value);
            }
        }
    }
}
const arraySpanMethod = (obj) => {
    const { row, column, rowIndex, columnIndex } = obj
    if (columnIndex === 0 || columnIndex === 1 || columnIndex === 2 || columnIndex === 3 || columnIndex === 4 || columnIndex === 5 || columnIndex === 8 || columnIndex === 9 || columnIndex === 10) {
        const rowCell = cellList.value[rowIndex];
        if (rowCell > 0) {
            const colCell = 1;
            // console.log(`动态竖向合并单元格, 第${colCell}列，竖向合并${rowCell}个单元格 `);
            return {
                rowspan: rowCell,
                colspan: colCell,
            };
        } else {
            // 清除原有的单元格，必须要加，否则就会出现单元格会被横着挤到后面了！！！
            return {
                rowspan: 0,
                colspan: 0,
            };
        }
    }

}

const bidRunList = ref([])

const applyDetailModal = ref(false)
const copyVCODE = () => {
    let input = document.createElement("input"); // 创建input对象
    input.value = detailNoDynamic.value.VCODE; // 设置复制内容
    document.body.appendChild(input); // 添加临时实例
    input.select(); // 选择实例内容
    document.execCommand("Copy"); // 执行复制
    document.body.removeChild(input); // 删除临时实例
    proxy.$modal.msgSuccess("复制成功");
}

const activeName = ref(["1"]);

// const IS_SIGNQRList = ref(['人工确认', '自动确认'])
// const DEVIDETYPEList = ref(['平均分配', '货主分配', '承运商出量'])
// const WINNUMList = ref(['', '第一名中标', '前两名中标', '前三名中标', '前四名中标', '前五名中标'])


// 0-未开始 1-待发公告 2-待报名 3-报名中 4-待竞价 5-竞价中 6-竞价结束 7-竞价完
const BILLSTATUSList = ref([
    "未开始",
    "待发公告",
    "待报名",
    "报名中",
    "待竞价",
    "竞价中",
    "竞价结束",
    "竞价完",
]);
const leftMenuList = ref([]);
const timer = ref(null);
const count = ref(0);

onMounted(() => {
    getPageList();
    getPageConfigs()


});



const menuVal = ref(null);
const queryLeftForm = ref({
    TAGSTATUS: userInfo.value.USERTYPE == 2 ? '0' : '1',
    // TAGSTATUS: '1',
    KEYWORD: ''
})
const handleClick = (e) => {
    queryLeftForm.value.KEYWORD = ''
    robOrderForm.value = {
        PK_ROBE: '',
        BILLSTATUS: '',
    }
    getPageList()
}
const clickLeftBtn = () => {
    getPageList()
}
const getPageList = () => {
    getTableData("oms/robProject/getRobList", {
        // PAGENUM: 1,
        // PAGESIZE: 99,
        ...queryLeftForm.value,
        // ...MenuID.value
        ...menuParams.value
    }).then((res) => {
        // leftMenuTotal.value = res.RESULT.TOTAL
        leftMenuList.value = res.RESULT.RECORDS;
        menuVal.value = null
        detailNoDynamic.value = {}
        if (leftMenuList.value.length) chooeseMune(leftMenuList.value[0]);
    });
};

const chooseLeftData = ref({})
const chooeseMune = (item) => {
    menuVal.value = item.BILLNO;
    chooseLeftData.value = item;
    ruleForm.value = {
        BIDPRICE: null,
        EXPECTVALUE: null,
        BIDADDRESS: null,
    };

    getDetailNoDynamic();
};
const detailNoDynamic = ref({});
const countDownRef = ref(null);
const ROUNDNUM = ref('')
const getDetailNoDynamic = () => {
    getTableData("oms/robProject/getRobInfo", {
        BILLNO: menuVal.value,
        ...menuParams.value
    }).then((res) => {
        // countDownRef.value ? countDownRef.value.countDownClearInterval() : ''
        detailNoDynamic.value = res.RESULT;

        const { BILLSTATUS } = res.RESULT

        switch (BILLSTATUS) {
            case "1":
                getNoticInfo()
                break;
            case "2":
                getNoticInfo()
                break;
            case "3":
                queryApplyInfo()
                break;
            case "4":
                queryApplyInfo()
                break;
            default:
                break;
        }
    });
};

const noticInfo = ref({})
const getNoticInfo = () => {
    const protData = {
        BILLNO: menuVal.value,
        ...menuParams.value

    }

    getTableData("/oms/robNotice/getDetailByRobId", protData)
        .then((res) => {
            noticInfo.value = res.RESULT || {}

        })
        .catch(() => {
            noticInfo.value = {}
        });
}


const applyStatus = ref('')
const applyInfoList = ref([])
const PK_ROBEList = ref([])
const queryApplyInfo = () => {
    const protData = {
        BILLNO: menuVal.value,
        ...menuParams.value,
        ...robOrderForm.value
    }
    getTableData("/oms/robRecords/getRobRecordList", protData)
        .then((res) => {
            applyInfoList.value = res.RESULT
            listCount.value = null
            cellList.value = []
            computeCell(applyInfoList.value)

            let newobj = {};
            PK_ROBEList.value = applyInfoList.value.reduce((preVal, curVal) => {
                newobj[curVal.PK_ROBE] ? '' : newobj[curVal.PK_ROBE] = preVal.push(curVal);
                return preVal
            }, [])

        }).catch(() => {
            applyInfoList.value = []
            listCount.value = null
            cellList.value = []
            PK_ROBEList.value = []
        })
}



const changePK_CARRIER = (e) => {
    queryApplyInfo()

}

const changeIS_BID = () => {
    queryApplyInfo()

}


const applyInfoRef = ref(null)
const applyInfoRefChooseList = ref([])
const applyInfoRefSelectionChange = (e) => {
    applyInfoRefChooseList.value = e
}

const bidInfo = ref({});
const getPermissDetail = () => {

    clearInterval(timer.value);
    count.value = 0;
    timer.value = null;

    getTableData("/oms/omsBidRecord/getPermissDetail", { BILLNO: menuVal.value, ROUNDNUM: String(ROUNDNUM.value) })
        .then((res) => {
            bidInfo.value = res.RESULT;
            count.value = 10;
            Verification();
        })
        .catch(() => {
            clearInterval(timer.value);
            count.value = 0;
            timer.value = null;
            bidInfo.value = {};
        });
};


const Verification = () => {
    if (timer.value) return

    timer.value = setInterval(() => {
        if (count.value > 0 && count.value <= 10) {
            count.value--;
        } else if (count.value == 0) {
            getPermissDetail(); // 请求数据
            clearInterval(timer.value);
            timer.value = null;
        }
    }, 1000);
};

const topBtnRef = ref(null)
const clickCommonBtn = (btn) => {
    if (btn.BTNTITLE == "cancellation" || btn.BTNTITLE == "winBidding") { // 作废  中标
        const Collection = applyInfoRefChooseList.value.map(ele => ele.BILLNO)
        const protData = {
            data: Collection,
            ...menuParams.value,
        }
        getTableData(btn.ACTIONADDRESS, protData)
            .then((res) => {
                proxy.$modal.msgSuccess("操作成功");
                applyInfoRefChooseList.value = []
                getPageList()

            })


    } else {
        topBtnRef.value.handleEvent(btn, [detailNoDynamic.value])
    }
}

const checkCertification = (val) => {
    let btn = allPageCon.value.BUTTON.filter(ele => ele.BTNTITLE == 'checkCertification')[0]
    let data = {
        BILLNO: val.BILLNO
    }
    topBtnRef.value.handleEvent(btn, [data])
}

const reloadTableData = () => {
    getPageList()
}

const setShowBtn = (btn) => {
    if (btn.ISSHOW == 0) return false;
    if (btn.ISSHOW == 2 && btn.OTHER) {
        try {
            let DATA = detailNoDynamic.value;
            // console.error(evilFn( DATA, btn.OTHER));
            if (!evilFn(DATA, btn.OTHER)) {
                return false;
            }
        } catch (error) {
            console.error(error);
        }
        return true;
    } else if (!btn.CHILDREN || !btn.CHILDREN.length) {
        return true;
    }
};

function evilFn(row, fn) {
    const DATA = JSON.parse(JSON.stringify(row)) || Object.create(null);
    let Fn = new Function("DATA", `return ${fn}`);
    const proxy = new Proxy(DATA, {
        has(target, key) {
            return true;
        },
    });
    return Fn(proxy);
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

onUnmounted(() => {
    // console.log("竞价离开视线");
    // clearInterval(timer.value);
    // timer.value = null;
});
</script>

<style lang="scss" scoped>
.disflex {
    display: flex;
    align-items: center;
}

.align-s {
    align-items: start;
}

.align-e {
    align-items: end;
}

.justify-sb {
    justify-content: space-between;
}

.flex-w {
    flex-wrap: wrap;
}

.mt-10 {
    margin-top: 10px;
}

.mt-20 {
    margin-top: 20px;
}

.mt-30 {
    margin-top: 30px;
}

.mr-20 {
    margin-right: 20px;
}

.mr-30 {
    margin-right: 30px;
}

.mr-10 {
    margin-right: 10px;
}

.mb-5 {
    margin-bottom: 5px;
}

.manual-app {

    // margin-top: 6px;
    .el-col-5 {
        padding: 0px !important;
        // height: 620px;
        float: left;
        display: block;
        box-sizing: border-box;

        .box-card {
            width: 100%;

            .card-header {
                font-size: 18px;
                font-weight: 500;
                color: #292929;
                margin-bottom: 10px;
            }

            .leftMenu {
                // padding: 4px 6px;
                // font-size: 14px;
                // font-weight: 500;
                // color: rgba(41, 41, 41, 0.75);
                // margin: 2px 0;
                cursor: pointer;
                border-radius: 2px;
                border: 1px solid #C4C4C4;

                margin-bottom: 20px;
                padding: 10px;

                &-title {
                    font-weight: 500;
                    font-size: 16px;
                    color: #2E2E2E;
                    width: 100%;
                    // width: calc(100% - 42px);
                }

                &-content {
                    font-weight: 400;
                    font-size: 12px;
                    color: #5A5A5A;
                }

                &.active {
                    // background-color: #f1f6ff;
                    // font-size: 14px;
                    // font-weight: 500;
                    // color: #1964f8;

                    background: #F7F9FC;
                    box-shadow: 0px 4px 10px 0px rgba(12, 47, 115, 0.14);
                    border: 1px solid #1964F8;
                }

                &-alone {}

                &-status {
                    font-weight: 400;
                    font-size: 14px;
                    flex-shrink: 0;
                }

                &-status0 {
                    color: #29AE9C;
                }

                &-status1 {
                    color: #29AE9C;
                }

                &-status2 {
                    color: #29AE9C;
                }

                &-status3 {
                    color: #1964F8;
                }

                &-status4 {
                    color: #1964F8;
                }

                &-status5 {
                    color: #FBAE15;
                }

                &-status6 {
                    color: #E41919;
                }


            }
        }
    }

    .el-col-19 {
        padding: 0px 0px 0px 5px !important;

        .box-card {
            width: 100%;

            .commonSmallTitle {
                font-size: 18px;
                font-weight: 500;
                color: rgba(42, 43, 45, 0.82);
            }

            .card-header {
                display: flex;
                justify-content: space-between;
                align-items: center;

                &-title {
                    font-size: 22px;
                    font-weight: bold;
                    color: #1a1a1a;
                    margin-right: 30px;

                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    // width: 270px;
                    // max-width: 270px;
                }

                &-tag {
                    color: #fff;
                    width: 88px;
                    height: 30px;
                    // background: #E26D52;
                    background: linear-gradient(to right bottom, #ed7d5a, #fcaa7d);
                    transform: skewX(-25deg);
                    position: relative;
                    text-align: center;
                    line-height: 30px;
                    margin-right: 20px;

                    &-text {
                        transform: skewX(25deg);
                        font-size: 16px;
                        font-weight: 500;
                        color: #ffffff;
                    }
                }

                .RoundBid {
                    width: 81px;
                    height: 29px;
                    border: 1px solid #1964f8;
                    border-radius: 2px;
                    font-size: 14px;
                    font-weight: 500;
                    color: #1964f8;
                    text-align: center;
                    line-height: 27px;
                    margin-right: 20px;
                }

                .currentRound {
                    font-size: 16px;
                    font-weight: 500;
                    color: #1a1a1a;

                    &-num {
                        font-size: 16px;
                        color: #686868;
                    }
                }

                .noMargin {
                    &.el-form-item {
                        margin-bottom: 0 !important;
                    }
                }

                .degree {
                    // width: 136px;
                    width: 100px;
                    height: 62px;
                    background: #1964f8;
                    border-radius: 4px;

                    font-size: 16px;
                    font-weight: bold;
                    color: #ffffff;
                    text-align: center;

                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                }

                .endRange {
                    font-size: 20px;
                    font-weight: 500;
                    color: #dd593b;
                }
            }

            .cargoInfo {
                background: rgba(239, 242, 247, 0.5);
                border-radius: 10px;
                font-size: 14px;
                font-weight: 500;
                color: #2a2b2d;
                padding: 10px;

                &-top {
                    display: flex;
                    justify-content: space-between;

                    &-start {
                        width: 38px;
                        height: 38px;
                        background: #1964f8;
                        border-radius: 50%;

                        font-size: 18px;
                        font-weight: 500;
                        color: #ffffff;
                        text-align: center;
                        line-height: 38px;
                        margin-right: 5px;
                    }

                    &-startTitle {
                        font-size: 18px;
                        font-weight: 500;
                        color: #1964f8;
                    }

                    &-describe {
                        font-size: 13px;
                        font-weight: 500;
                        color: #969696;
                    }

                    &-end {
                        width: 38px;
                        height: 38px;
                        background: #e33644;
                        border-radius: 50%;
                        margin-right: 5px;

                        font-size: 18px;
                        font-weight: 500;
                        color: #ffffff;
                        text-align: center;
                        line-height: 38px;
                    }

                    &-endTitle {
                        font-size: 18px;
                        font-weight: 500;
                        color: #e33644;
                    }

                    &-num {
                        font-size: 20px;
                        font-weight: bold;
                        color: #eb401e;
                        margin-left: 10px;
                    }

                    &-line {
                        font-size: 14px;
                        font-weight: 500;
                        color: #6d6d6d;
                        border-bottom: 1px dashed #969696;
                        padding-bottom: 10px;
                        flex-shrink: 0;
                    }

                    &-content {
                        font-size: 16px;
                        color: #686868;
                    }
                }
            }

            .winBidding {
                display: grid;
                grid-template-columns: repeat(5, calc(20% - 5px));
                grid-column-gap: 5px;

                height: 62px;
                line-height: 62px;

                &-img {
                    width: 70px;
                    // height: 45px;
                }

                &-icon {
                    width: 22px;
                    height: 22px;
                    background: #f5ac10;
                    border-radius: 50%;
                    font-size: 16px;
                    font-weight: 400;
                    color: #ffffff;
                    text-align: center;
                    line-height: 22px;
                    margin-right: 4px;

                    &.two {
                        background: #788d9d;
                    }

                    &.tree {
                        background: #d1a686;
                    }

                    &.four {
                        background: #a2a2a2;
                    }

                    &.five {
                        background: #a2a2a2;
                    }
                }

                &-topRight {
                    font-size: 12px;
                    background: #ececec;
                    border-radius: 2px;
                    padding: 6px;
                    font-weight: 500;
                    color: rgba(42, 43, 45, 0.82);

                    &-num {
                        font-size: 16px;
                        color: #1964f8;
                    }
                }

                &-alone {
                    padding: 0px 8px;
                    background: rgba(239, 242, 247, 0.5);
                    border-radius: 10px;
                    font-size: 18px;
                    font-weight: 400;
                    color: #2a2b2d;

                    &-num {
                        font-size: 34px;
                        font-weight: 500;
                        color: #f5ac10;

                        &-symbol {
                            font-size: 18px;
                            font-weight: 400;
                        }

                        &.two {
                            color: #788d9d;
                        }

                        &.tree {
                            color: #d1a686;
                        }

                        &.four {
                            color: #a2a2a2;
                        }

                        &.five {
                            color: #a2a2a2;
                        }
                    }
                }
            }
        }
    }

    :deep(.el-collapse-item__content) {
        padding-bottom: 10px;
    }

    .selectLeftText {
        margin-right: 10px;
        font-size: 14px;
    }
}

:deep(.el-tabs__item) {
    padding: 0 6px;
}

.noticInfoTitle {
    font-weight: bold;
    text-align: center;
}
</style>
<!-- <style scoped>
  .mytable-scrollbar ::-webkit-scrollbar {
      width: 8px;
      height: 8px;
  }
  
  /*滚动条的轨道*/
  .mytable-scrollbar ::-webkit-scrollbar-track {
      background-color: #ffffff;
  }
  
  /*滚动条里面的小方块，能向上向下移动*/
  .mytable-scrollbar ::-webkit-scrollbar-thumb {
      background-color: #bfbfbf;
      border-radius: 5px;
      border: 1px solid #f1f1f1;
      box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  }
  
  .mytable-scrollbar ::-webkit-scrollbar-thumb:hover {
      background-color: #a8a8a8;
  }
  
  .mytable-scrollbar ::-webkit-scrollbar-thumb:active {
      background-color: #787878;
  }
  
  /*边角，即两个滚动条的交汇处*/
  .mytable-scrollbar ::-webkit-scrollbar-corner {
      background-color: #ffffff;
  }
  </style> -->