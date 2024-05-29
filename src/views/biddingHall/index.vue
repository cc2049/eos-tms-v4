<!-- 竞价大厅 货主端 -->
<template>
  <div class="manual-app">
    <el-row>
      <el-col :span="5">
        <el-card class="box-card">
          <div>
            <el-tabs v-model="queryLeftForm.BILLSTATUS" class="demo-tabs" @tab-change="handleClick">
              <!-- 货主  -->
              <template>
                <el-tab-pane label="未开始" name="0"></el-tab-pane>
                <el-tab-pane label="报名中" name="2"></el-tab-pane>
                <el-tab-pane label="竞价中" name="4"></el-tab-pane>
                <el-tab-pane label="已结束" name="6"></el-tab-pane>
              </template>

            </el-tabs>
          </div>
          <div class="mb10 disflex ">
            <el-input size="default" v-model="queryLeftForm.KEYWORD" placeholder="请输入关键词查询" :prefix-icon="Search"
              clearable />
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
                <div class="leftMenu-status" :class="`leftMenu-status${item.BILLSTATUS}`">{{
        statusList[item.BILLSTATUS] }}</div>
              </div>
              <!-- <div class="leftMenu-content">报名截止时间：{{ item.SIGNENDTIME }}</div> -->
              <div class="leftMenu-content">竞价开始时间：{{ item.BIDSTTIME }}</div>
              <div class="leftMenu-content">竞价截止时间：{{ item.BIDEDTIME }}</div>
            </div>
          </el-scrollbar>
        </el-card>
      </el-col>
      <el-col :span="19">

        <el-card class="box-card">
          <template #header>
            <div class="tr">
              <el-button size="small">编辑</el-button>
              <el-button size="small">发布公告</el-button>
              <el-button size="small" type="primary">提交审核</el-button>
<!-- 
              <el-button size="small" type="danger">强制结束</el-button>
              <el-button size="small">查看公告</el-button>
              <el-button size="small">取消确认</el-button>
              <el-button size="small" type="primary">确认报名</el-button>

              <el-button size="small" type="danger">强制结束</el-button>
              <el-button size="small">报名明细</el-button>
              <el-button size="small">查看公告</el-button>
              <el-button size="small" type="primary">中标</el-button>

              <el-button  size="small">作废</el-button>
              <el-button size="small">报名明细</el-button>
              <el-button size="small" type="primary">查看公告</el-button> -->

            </div>
          </template>
          <el-scrollbar :height="Hight">
            <div class="card-header" v-if="userInfo.USERTYPE == 0">
              <div>
                <div class="disflex">
                  <div class="card-header-title">{{ detailNoDynamic.VNAME }}</div>
                </div>
              </div>
              <div class="disflex">
                <div class="disflex">
                  <div class="card-header-tag">
                    <div class="card-header-tag-text">
                      {{ BILLSTATUSList[bidInfo.BILLSTATUS] || '暂无状态' }}
                    </div>
                  </div>
                  <!-- <countDown ref="countDownRef" v-if="bidInfo.BILLSTATUS == 5" :time="bidInfo.BIDENDTIME" /> -->
                  <!-- <countDown ref="countDownRef"
                    v-if="bidInfo.BILLSTATUS == 5 || bidInfo.BILLSTATUS == 4 || bidInfo.BILLSTATUS == 3"
                    :time="bidInfo.BILLSTATUS == 5 ? bidInfo.BIDENDTIME : bidInfo.BILLSTATUS == 4 ? bidInfo.BIDSTARTTIME : bidInfo.BILLSTATUS == 3 ? bidInfo.SIGNENDTIME : ''" /> -->
                </div>
              </div>
            </div>
            <div class="card-header" v-else-if="userInfo.USERTYPE == 2">
              <div>
                <div class="disflex">

                  <div class="card-header-title" :style="{
        maxWidth: bidInfo.BILLSTATUS == 5 ? '370px' : '500px'

      }">{{ detailNoDynamic.VNAME }}</div>
                  <div class="disflex">
                    <div class="card-header-tag">
                      <div class="card-header-tag-text">
                        {{ BILLSTATUSList[bidInfo.BILLSTATUS] || '暂无状态' }}
                      </div>
                    </div>
                    <countDown ref="countDownRef"
                      v-if="bidInfo.BILLSTATUS == 5 || bidInfo.BILLSTATUS == 4 || bidInfo.BILLSTATUS == 3"
                      :time="bidInfo.BILLSTATUS == 5 ? bidInfo.BIDENDTIME : bidInfo.BILLSTATUS == 4 ? bidInfo.BIDSTARTTIME : bidInfo.BILLSTATUS == 3 ? bidInfo.SIGNENDTIME : ''" />
                  </div>
                </div>
              </div>
              <div class="disflex" v-if="bidInfo.BILLSTATUS == 5" style="flex-shrink:0">
                <div class="mr-10">
                  <el-form ref="ruleFormRef" :model="ruleForm" label-width="50px" class="demo-ruleForm" size='small'
                    status-icon>
                    <el-form-item label="出价" prop="name">
                      <el-input v-model="ruleForm.BIDPRICE" style="width: 120px;" type="number"
                        @blur="priceBlur(2, 'BIDPRICE')">
                        <template #append>元</template>
                      </el-input>
                    </el-form-item>
                    <el-form-item label="出量" prop="desc" class="noMargin" v-if="detailNoDynamic.ISEXPECTTYPE == 1">
                      <el-input v-model="ruleForm.EXPECTVALUE" style="width: 120px;" type="number"
                        @blur="priceBlur(0, 'EXPECTVALUE')">
                        <template #append>{{ detailNoDynamic.TRANSUNITSTUNIT }}</template>
                      </el-input>
                    </el-form-item>
                  </el-form>
                </div>
                <div class="degree" @click="clickBidPrice">
                  <div>出价</div>
                  <div v-if="detailNoDynamic.BIDTYPE == 1 || detailNoDynamic.BIDTYPE == 0">
                    <span v-if="bidInfo.REMAINNUM == '不限制'">({{ bidInfo.REMAINNUM }})</span>
                    <span v-else>(剩余{{ bidInfo.REMAINNUM }}次)</span>
                  </div>
                </div>
              </div>
            </div>

            <el-collapse v-model="activeName" class="">
              <el-collapse-item name="1">
                <template #title>
                  <div class="commonSmallTitle">竞价信息</div>
                </template>
                <div>
                  <div class="cargoInfo">
                    <div class="disflex mb-10">
                      <div>需求编号：</div>
                      <div>{{ detailNoDynamic.VCODE }}</div>
                      <div class="ml-10">复制</div>
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
                      <!-- <div class="disflex justify-sb">
                        <div class="disflex mr-20">
                          竞价运费 <span class="cargoInfo-top-num">{{ detailNoDynamic.BIDFLOORPRICE }}
                            元</span>
                        </div>
                        <div class="disflex">
                          保证金 <span class="cargoInfo-top-num">{{ detailNoDynamic.DEPOSITAMT }}
                            元</span>
                        </div>
                      </div> -->
                    </div>
                    <div class="disflex flex-w mt10">
                      <div v-for="(item, index) in cargoInfoList" :key="index" class="disflex mr-20 mb-5">
                        <div class="">{{ item.title }}</div>
                        <div v-if="item.flag">
                          <div v-if="item.flag == 'select'" class="cargoInfo-top-content">
                            {{ computedCargoInfoSelect(item.selectList,
        detailNoDynamic[item.text]) }}
                          </div>
                          <div class="cargoInfo-top-content" v-else-if="item.flag == 'sub'">
                            <span v-for="item in computedSub(detailNoDynamic.SUBLIST)" :key="item">{{ item
                              }}</span>
                            <!-- {{ computedSub(detailNoDynamic.SUBLIST) }} -->
                          </div>
                          <div class="cargoInfo-top-content" v-else-if="item.flag == 'joint'">
                            {{ detailNoDynamic.CARMINLENGTH }}*{{ detailNoDynamic.CARMINWIDTH
                            }}*{{
        detailNoDynamic.CARMINHEIGHT }}
                          </div>
                        </div>
                        <div v-else class="cargoInfo-top-content">{{ detailNoDynamic[item.text] }}
                        </div>
                      </div>
                    </div>
                    <div class="disflex flex-w mt10 pt-10" style="border-top: 1px dashed #ccc;">
                      <div v-for="(item, index) in cargoInfoList1" :key="index" class="disflex mr-20 mb-5">
                        <div class="">{{ item.title }}</div>
                        <div v-if="item.flag">
                          <div v-if="item.flag == 'select'" class="cargoInfo-top-content">
                            {{ computedCargoInfoSelect(item.selectList,
        detailNoDynamic[item.text]) }}
                          </div>
                          <div class="cargoInfo-top-content" v-else-if="item.flag == 'sub'">
                            <span v-for="item in computedSub(detailNoDynamic.SUBLIST)" :key="item">{{ item
                              }}</span>
                            <!-- {{ computedSub(detailNoDynamic.SUBLIST) }} -->
                          </div>
                          <div class="cargoInfo-top-content" v-else-if="item.flag == 'joint'">
                            {{ detailNoDynamic.CARMINLENGTH }}*{{ detailNoDynamic.CARMINWIDTH
                            }}*{{
        detailNoDynamic.CARMINHEIGHT }}
                          </div>
                        </div>
                        <div v-else class="cargoInfo-top-content">{{ detailNoDynamic[item.text] }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </el-collapse-item>
            </el-collapse>
            <div>
              <div class="commonSmallTitle mt-10 disflex justify-sb">
                <div class="disflex card-header">
                  <div class="mr-20">出价信息</div>
                  <div class="disflex">
                    <div class="RoundBid">{{ detailNoDynamic.BIDTYPE == 1 ? '自由出价' : detailNoDynamic.BIDTYPE
        ==
        2 ? '公开竞价' : '轮次出价' }}</div>
                    <div class="currentRound" v-if="detailNoDynamic.BIDTYPE == 0">当前轮次：<span class="currentRound-num">{{
        detailNoDynamic.ROUNDNUM
      }}次</span> </div>
                  </div>

                </div>
                <div class="winBidding-topRight disflex">
                  <div>在线人数</div>
                  <div class="winBidding-topRight-num mr-10">{{ bidInfo.SIGNCOUNT }}个</div>

                  <div>报名单位</div>
                  <div class="winBidding-topRight-num mr-10">{{ bidInfo.SIGNCOUNT }}个</div>

                  <div>出价单位</div>
                  <div class="winBidding-topRight-num mr-10">{{ bidInfo.COMPANYCOUNT }}个</div>

                  <div>出价次数</div>
                  <div class="winBidding-topRight-num mr-10">{{ bidInfo.RECORDCOUNT }}次</div>

                  <div v-if="userInfo.USERTYPE == 2 && bidInfo.CARRIERVISITRANK == 1">出价排名</div>
                  <div v-if="userInfo.USERTYPE == 2 && bidInfo.CARRIERVISITRANK == 1"
                    class="winBidding-topRight-num mr-10">{{
        bidInfo.CHINESERANK }}</div>

                </div>
              </div>
              <div class="mt10">
                <el-table :data="bidInfo.SUBLIST" style="width: 100%">
                  <el-table-column prop="BIDDERNAME" label="出价单位" width="180" />
                  <el-table-column prop="BIDPRICE" label="出价金额" />
                  <el-table-column prop="IPADDRESS" label="IP地址" />
                  <el-table-column prop="BIDADDRESS" label="定位信息" />
                  <el-table-column prop="BIDDATE" label="出价时间" />
                  <el-table-column prop="BILLSTATUS" label="状态">
                    <template #default="scope">
                      {{ scope.row.BILLSTATUS == 1 ? '有效' : '无效' }}
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>
            <!-- 报名信息 报名中 -->
            <div>
              <div class="commonSmallTitle mt-10 disflex justify-sb">
                <div class="disflex card-header">
                  <div class="mr-20">报名信息</div>
                  <div>
                    <div>报名状态</div>

                  </div>
                </div>
                <div class="winBidding-topRight disflex">
                  <div>报名人数</div>
                  <div class="winBidding-topRight-num mr-10">{{ bidInfo.SIGNCOUNT }}</div>

                  <div>已确认</div>
                  <div class="winBidding-topRight-num mr-10">{{ bidInfo.SIGNCOUNT }}</div>

                  <div>未确认</div>
                  <div class="winBidding-topRight-num mr-10">{{ bidInfo.COMPANYCOUNT }}</div>
                </div>
              </div>
              <div class="mt10">
                <el-table :data="bidInfo.SUBLIST" style="width: 100%">
                  <el-table-column prop="BIDDERNAME" label="报名状态" width="180" />
                  <el-table-column prop="BIDPRICE" label="报名单位" />
                  <el-table-column prop="IPADDRESS" label="报名时间" />
                  <el-table-column prop="BIDADDRESS" label="报名用户" />
                  <el-table-column prop="BIDDATE" label="确认人" />
                  <el-table-column prop="BIDDATE" label="确认时间" />
                  <el-table-column prop="BILLSTATUS" label="资质审查">
                    <template #default="scope">
                      el
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>

            <!-- 竞价信息 竞价中 -->
            <div>
              <div class="commonSmallTitle mt-10 disflex justify-sb">
                <div class="disflex card-header">
                  <div class="mr-20">竞价信息</div>
                  <div>
                    <div>出价单位</div>
                  </div>
                  <div>
                    <div>是否中标</div>
                  </div>
                </div>
              </div>
              <div class="mt10">
                <el-table :data="bidInfo.SUBLIST" style="width: 100%">
                  <el-table-column prop="BIDDERNAME" label="排名" width="180" />
                  <el-table-column prop="BIDPRICE" label="联系方式" />
                  <el-table-column prop="IPADDRESS" label="出价金额" />
                  <el-table-column prop="BIDADDRESS" label="出量" />
                  <el-table-column prop="BIDDATE" label="IP地址" />
                  <el-table-column prop="BIDDATE" label="定位信息" />
                  <el-table-column prop="BIDDATE" label="出价时间" />
                  <el-table-column prop="BIDDATE" label="中标" />
                  <el-table-column prop="BIDDATE" label="物料" />
                  <el-table-column prop="BILLSTATUS" label="分配量">
                    <template #default="scope">

                    </template>
                  </el-table-column>
                  <el-table-column prop="BIDDATE" label="中标时间" />
                  <el-table-column prop="BIDDATE" label="中标确认人" />
                </el-table>
              </div>
            </div>






          </el-scrollbar>

        </el-card>
        <!-- </el-scrollbar> -->

      </el-col>
    </el-row>
  </div>
</template>

<script setup>
// const sideIndex = ref();

const leftHight = window.innerHeight - 240;
const Hight = window.innerHeight - 154;
const { proxy } = getCurrentInstance();
const MenuID = inject("menuID");

import { onMounted, onUnmounted, ref, } from "vue";

import { Search } from "@element-plus/icons-vue";
// import { getGfLeftList, getGfRightList } from "#/system/log";
import { getTableData } from "@/api/system/page";
// import biddingHall1 from "@/assets/images/WZC/biddingHall1.png";
// import biddingHall2 from "@/assets/images/WZC/biddingHall2.png";
// import biddingHall3 from "@/assets/images/WZC/biddingHall3.png";
import countDown from "@/components/countDown/index";

import axios from "axios";

// const route = useRoute();
// const searchValue = ref("");
// const textContent = ref("");
// const Description = ref("");
// const vname = ref("");
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
// BILLSTATUS 项目状态0-未开始 1-待发公告 2-待报名 3-报名中 4-待竞价 5-竞价中 6-竞价结束

const statusList = ref(['未开始', '待发公告', '报名中', '待竞价', '竞价中', '竞价结束', '已完成', '强制结束'])

const computedCargoInfoSelect = computed((list, val) => {
  return (list, val) => {
    if (!list || !val) return "暂无数据";
    // console.log(detailNoDynamic.value.WINNUM)
    for (const key in list) {
      if (val == key) {
        return list[key];
      }
    }
    return "暂无数据";

    // let obj = list.filter(ele => ele.value == val)[0]
    // return obj?.value || '暂无数据'
  };
});
const computedSub = computed((list) => {
  return (list) => {
    if (!list) return "暂无数据";
    let arr = [];
    list.forEach((item) => {
      let str = item.MATERIALNAME.concat(
        ` | ${item.ORDERNUM} | ${item.TRANSUNIT}`
      );
      arr.push(str);
    });
    return arr || [];
  };
});

// const nextTitle = computed(() => {
//     if (titleIndex.value == options.value.length - 1) return "";
//     vname.value = options.value[titleIndex.value]["TITLE"];
//     return options.value[titleIndex.value + 1]["TITLE"];
// });

const activeName = ref(["1"]);

const brandModelList = ref([]);
const WINNUMList = ref([]);
const cargoInfoList = ref([
  {
    title: "发货日期",
    text: "YQSTDATE",
  },
  {
    title: "要求送达日期",
    text: "YQEDDATE",
  },
  {
    title: "车辆类型",
    text: "BIDSTARTTIME",
  },
  {
    title: "车辆要求",
    text: "BIDSTARTTIME",
  },
  {
    title: "提供装货",
    text: "IS_LOAD",
  },
  {
    title: "提供卸货",
    text: "IS_UNLOAD",
  },
  {
    title: "提供发票",
    text: "PRICECUT",
  },
  // {
  //   title: "参考价：",
  //   text: "REFERENCEPRICE",
  // },
  // // {
  // //     title: '结算组织：',
  // //     text: '竞价时间',
  // // },
  // {
  //   title: "运输货物：",
  //   flag: "sub",
  // },
  // {
  //   title: "车辆要求：",
  //   flag: "joint",
  // },
  // {
  //   title: "车型要求：",
  //   text: "CARTYPEREQUIE",
  //   // flag: 'select',
  //   // selectList: brandModelList
  // },
  // {
  //   title: "要求发货时间：",
  //   text: "REQSTARTTIME",
  // },
  // {
  //   title: "要求送达时间：",
  //   text: "REQENDTIME",
  // },
  // {
  //   title: "中标名次：",
  //   text: "WINNUM",
  //   flag: "select",
  //   selectList: WINNUMList,
  // },
]);
const cargoInfoList1 = ref([
  {
    title: "竞价时间",
    text: "BIDSTARTTIME",
  },
  {
    title: "延期时长",
    text: "BIDSTARTTIME",
  },
  {
    title: "报名确认",
    text: "BIDSTARTTIME",
  },
  {
    title: "保证金额",
    text: "BIDSTARTTIME",
  },
  {
    title: "报名时间",
    text: "BIDSTARTTIME",
  },
  {
    title: "运费上限",
    text: "BIDSTARTTIME",
  },
  {
    title: "确标方式",
    text: "BIDSTARTTIME",
  },
  {
    title: "中标分配",
    text: "BIDSTARTTIME",
  },
  {
    title: "中标名次",
    text: "BIDSTARTTIME",
  },
  {
    title: "第一名量",
    text: "BIDSTARTTIME",
  },
  {
    title: "第二名量",
    text: "BIDSTARTTIME",
  },
  {
    title: "降价幅度",
    text: "BIDSTARTTIME",
  },
])
// const winBiddingList = ref([
//   {
//     title: "第一名分配",
//     num: "ONEPRESENDCARNUM",
//     // img: biddingHall1,
//   },
//   {
//     title: "第二名分配",
//     num: "TWOPRESENDCARNUM",
//     // img: biddingHall2,
//     colorClass: "two",
//   },
//   {
//     title: "第三名分配",
//     num: "THREEPRESENDCARNUM",
//     // img: biddingHall3,
//     colorClass: "tree",
//   },
//   {
//     title: "第四名分配",
//     num: "FOURPRESENDCARNUM",
//     // img: biddingHall3,
//     colorClass: "four",
//   },
//   {
//     title: "第五名分配",
//     num: "FIVEPRESENDCARNUM",
//     // img: biddingHall3,
//     colorClass: "five",
//   },
// ]);
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
  // getProjectStatusCount()
  // queryShowList("brandModel");
  // queryShowList("WINNUM");
  // if (userInfo.value.USERTYPE == 2) {
  //   queryPosition();
  // }
});

const priceBlur = (num, field) => {
  ruleForm.value[field] = Number(ruleForm.value[field]).toFixed(num);
};

const menuVal = ref(null);
const leftMenuTotal = ref(0)
const queryLeftForm = ref({
  // BILLSTATUS: userInfo.value.USERTYPE == 2 ? '3,4' : userInfo.value.USERTYPE != 0 ? '3' : '5',
  BILLSTATUS: '0',
  KEYWORD: ''
})
const handleClick = (e) => {
  queryLeftForm.value.KEYWORD = ''
  getPageList()
}
const clickLeftBtn = () => {
  getPageList()
}
const getPageList = () => {
  getTableData("oms/bidProject/getCargoPageList", {
    PAGENUM: 1,
    PAGESIZE: 99,
    ...queryLeftForm.value,
    // ...MenuID.value
  }).then((res) => {
    // leftMenuTotal.value = res.RESULT.TOTAL
    leftMenuList.value = res.RESULT.RECORDS;
    if (leftMenuList.value.length) chooeseMune(leftMenuList.value[0]);
  });
};
const quantityData = ref({})
const getProjectStatusCount = () => {
  getTableData("oms/omsBidProject/getProjectStatusCount", {
  }).then((res) => {
    console.log("🚀 ~ getProjectStatusCount ~ res:", res)
    quantityData.value = res.RESULT
  });
}



const changeROUNDNUM = () => {
  clearInterval(timer.value);
  timer.value = null;
  bidInfo.value.BILLSTATUS = null;
  countDownRef.value ? countDownRef.value.countDownClearInterval() : "";
  getDetailNoDynamic();
  // getPermissDetail();
}
const chooeseMune = (item) => {
  menuVal.value = item.BILLNO;
  ruleForm.value = {
    BIDPRICE: null,
    EXPECTVALUE: null,
    BIDADDRESS: null,
  };
  // clearInterval(timer.value);
  // timer.value = null;
  // bidInfo.value.BILLSTATUS = null;
  // countDownRef.value ? countDownRef.value.countDownClearInterval() : "";

  getDetailNoDynamic();
  // getPermissDetail();
};
const detailNoDynamic = ref({});
const countDownRef = ref(null);
const ROUNDNUM = ref('')
const getDetailNoDynamic = () => {
  getTableData("oms/bidProject/getCargoDetail", {
    BILLNO: menuVal.value,
    // ROUNDNUM: String(ROUNDNUM.value),
  }).then((res) => {
    // countDownRef.value ? countDownRef.value.countDownClearInterval() : ''
    detailNoDynamic.value = res.RESULT;
  });
};
const bidInfo = ref({});
const getPermissDetail = () => {
  // countDownRef.value ? countDownRef.value.countDownClearInterval() : ''
  // bidInfo.value.BILLSTATUS = null
  // bidInfo.value.BIDENDTIME = null

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

const queryShowList = (dictCode) => {
  proxy
    .request({
      url: `/sys/dictDtl/queryDictByCode/${dictCode} `,
      method: "get",
      data: {
        // MODULEID: PK_MODULE,
        // PAGEID: PK_PAGE,
        // BILLNO: row.BILLNO
      },
    })
    .then(({ RESULT }) => {
      if (dictCode == "brandModel") {
        brandModelList.value = RESULT;
      } else if (dictCode == "WINNUM") {
        WINNUMList.value = RESULT;
      }
    });
};
const positionData = ref({});
const queryPosition = () => {
  axios
    .get("http://ip-api.com/json/?lang=zh-CN")
    .then((response) => {
      positionData.value = response.data;
    })
    .catch((error) => {
      console.log(error);
    });
};

const clickBidPrice = () => {
  getTableData("oms/omsBidRecord/bidPrice", {
    BILLNO: menuVal.value,
    BIDPRICE: ruleForm.value.BIDPRICE,
    EXPECTVALUE: ruleForm.value.EXPECTVALUE,
    BIDADDRESS: positionData.value.country + positionData.value.city,
    LAT: positionData.value.lat,
    LON: positionData.value.lon,
  }).then((res) => {
    ElMessage({
      message: "出价成功",
      type: "success",
    });
    ruleForm.value = {
      BIDPRICE: null,
      EXPECTVALUE: null,
      BIDADDRESS: null,
    };

    getPermissDetail();
    clearInterval(timer.value);
    timer.value = null;
  });
};

const Verification = () => {
  console.log(timer.value)
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