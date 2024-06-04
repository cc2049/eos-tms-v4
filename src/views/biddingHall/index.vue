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
                <!-- <div class="leftMenu-status" :class="`leftMenu-status${item.BILLSTATUS}`">{{
        statusList[item.BILLSTATUS] }}</div> -->
                <div class="leftMenu-status">
                  {{ item.STATUSNAME }}
                </div>

              </div>
              <!-- <div class="leftMenu-content">报名截止时间：{{ item.SIGNENDTIME }}</div> -->
              <div class="leftMenu-content">竞价开始时间：{{ item.BIDSTTIME }}</div>
              <div class="leftMenu-content">竞价截止时间：{{ item.BIDEDTIME }}</div>
            </div>
          </el-scrollbar>
        </el-card>
      </el-col>
      <el-col :span="19">

        <el-card class="box-card" v-if="detailNoDynamic.BILLNO">
          <template #header>
            <div class="tr">
              <el-button size="small" v-if="queryLeftForm.BILLSTATUS == 0">编辑</el-button>
              <el-button size="small" v-if="queryLeftForm.BILLSTATUS == 0">发布公告</el-button>
              <el-button size="small" v-if="queryLeftForm.BILLSTATUS == 0" type="primary"
                @click="subCheck">提交审核</el-button>

              <!-- <el-button size="small" type="danger"
                v-if="queryLeftForm.BILLSTATUS == 2 || queryLeftForm.BILLSTATUS == 4" @click="constraintEnd">强制结束</el-button> -->

              <el-popconfirm title="确定要结束?" @confirm="constraintEnd">
                <template #reference>
                  <el-button size="small" type="danger"
                    v-if="queryLeftForm.BILLSTATUS == 2 || queryLeftForm.BILLSTATUS == 4">强制结束</el-button>
                </template>
              </el-popconfirm>

              <el-button size="small"
                v-if="queryLeftForm.BILLSTATUS == 2 || queryLeftForm.BILLSTATUS == 4">查看公告</el-button>
              <el-button size="small" :disabled="applyInfoRefChooseList.length > 0 ? false : true"
                v-if="queryLeftForm.BILLSTATUS == 2" @click="cancalSure">取消确认</el-button>
              <el-button size="small" :disabled="applyInfoRefChooseList.length > 0 ? false : true" type="primary"
                v-if="queryLeftForm.BILLSTATUS == 2" @click="confirmApply">确认报名</el-button>

              <el-button size="small" v-if="queryLeftForm.BILLSTATUS == 4" @click="clickApplyDetail">报名明细</el-button>
              <el-button size="small" type="primary" v-if="queryLeftForm.BILLSTATUS == 4">中标</el-button>

              <el-button size="small" v-if="queryLeftForm.BILLSTATUS == 6" @click="clickCancellation">作废</el-button>
              <el-button size="small" v-if="queryLeftForm.BILLSTATUS == 6">报名明细</el-button>
              <el-button size="small" type="primary" v-if="queryLeftForm.BILLSTATUS == 6">查看公告</el-button>

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
                      {{ queryLeftForm.BILLSTATUS == 6 ? detailNoDynamic.STATUSNAME : detailNoDynamic.STATUSNAME }}
                    </div>
                  </div>
                  <countDown ref="countDownRef" v-if="queryLeftForm.BILLSTATUS == 4"
                    :time="detailNoDynamic.BIDEDTIME" />
                  <!-- <countDown ref="countDownRef"
                    v-if="bidInfo.BILLSTATUS == 5 || bidInfo.BILLSTATUS == 4 || bidInfo.BILLSTATUS == 3"
                    :time="bidInfo.BILLSTATUS == 5 ? bidInfo.BIDENDTIME : bidInfo.BILLSTATUS == 4 ? bidInfo.BIDSTARTTIME : bidInfo.BILLSTATUS == 3 ? bidInfo.SIGNENDTIME : ''" /> -->
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
                      <el-button type="primary" class="ml-10" link @click="copyVCODE">复制</el-button>
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
                      <div>
                        <div v-for="item in detailNoDynamic.SUBLIST" :key="item.BILLNO" class="disflex">
                          <div>{{ item.MATERIALNAME }}/</div>
                          <div>{{ item.TWEIGHT }}</div>
                          <div>{{ item.VUNIT }}</div>
                        </div>
                      </div>
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
                          <div v-else-if="item.flag == 'isRadio'">
                            {{ detailNoDynamic[item.text] == 1 ? '是' : '否' }}
                          </div>
                        </div>
                        <div v-else class="cargoInfo-top-content">{{ detailNoDynamic[item.text] }}
                        </div>
                      </div>
                    </div>
                    <div class="disflex flex-w mt10 pt-10" style="border-top: 1px dashed #ccc;">
                      <div v-for="(item, index) in cargoInfoList1" :key="index" class="disflex mr-20 mb-5">
                        <div class="">{{ item.title }}</div>
                        <div v-if="item.flag && compShow(detailNoDynamic, item)">
                          <div v-if="item.flag == 'select'" class="cargoInfo-top-content">
                            {{ computedCargoInfoSelect(item.selectList,
        detailNoDynamic[item.text]).label }}
                          </div>
                          <div class="cargoInfo-top-content" v-else-if="item.flag == 'sub'">
                            <span v-for="item in computedSub(detailNoDynamic.SUBLIST)" :key="item">{{ item
                              }}</span>
                            <!-- {{ computedSub(detailNoDynamic.SUBLIST) }} -->
                          </div>
                          <div class="cargoInfo-top-content" v-else-if="item.flag == 'joinBiddingTime'">
                            {{ detailNoDynamic.BIDSTTIME }}-{{ detailNoDynamic.BIDEDTIME }}
                          </div>
                          <div v-else-if="item.flag == 'isRadio'">
                            {{ detailNoDynamic[item.text] == 1 ? '是' : '否' }}
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
            <!-- 报名信息 报名中 -->
            <div v-if="detailNoDynamic.BILLSTATUS == 3">
              <div class="commonSmallTitle mt-10 disflex justify-sb">
                <div class="disflex card-header">
                  <div class="mr-20">报名信息</div>
                  <div class="disflex">
                    <div class="selectLeftText">报名状态</div>
                    <el-select v-model="applyStatus" size="small" style="width: 120px" @change="changeApplyStatus">
                      <el-option label="全部" value="" />
                      <el-option label="已确认" value="1" />
                      <el-option label="未确认" value="0" />
                    </el-select>
                  </div>
                </div>
                <div class="winBidding-topRight disflex">
                  <div>报名人数</div>
                  <div class="winBidding-topRight-num mr-10">{{ applyInfoData.TOTAL }}</div>

                  <div>已确认</div>
                  <div class="winBidding-topRight-num mr-10">{{ applyInfoData.CONFIRMED }}</div>

                  <div>未确认</div>
                  <div class="winBidding-topRight-num mr-10">{{ applyInfoData.UNCONFIRM }}</div>
                </div>
              </div>
              <div class="mt10">
                <el-table ref="applyInfoRef" :data="applyInfoList" style="width: 100%"
                  @selection-change="applyInfoRefSelectionChange">
                  <el-table-column type="selection" width="55" />
                  <el-table-column prop="BILLSTATUS" label="报名状态">
                    <template #default="scope">
                      <span>{{ scope.row.BILLSTATUS == 0 ? '未确认' : '已确认' }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="CARRIERNAME" label="报名单位" />
                  <el-table-column prop="CREATIONTIME" label="报名时间" />
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
              </div>
            </div>

            <!-- 竞价信息 竞价中 -->
            <div
              v-else-if="detailNoDynamic.BILLSTATUS == 4 || detailNoDynamic.BILLSTATUS == 5 || detailNoDynamic.BILLSTATUS == 6 || detailNoDynamic.BILLSTATUS == 7">
              <div class="commonSmallTitle mt-10 disflex justify-sb">
                <div class="disflex card-header">
                  <div class="mr-20">竞价信息</div>
                  <div class="disflex">
                    <div class="disflex">
                      <div class="selectLeftText">出价单位</div>
                      <el-select v-model="PK_CARRIER" size="small" style="width: 120px" @change="changePK_CARRIER">
                        <el-option :label="item.CARRIERNAME" :value="item.PK_CARRIER" v-for="item in carrierList"
                          :key="item.PK_CARRIER" />
                      </el-select>
                    </div>
                    <div v-if="detailNoDynamic.BILLSTATUS == 6 || detailNoDynamic.BILLSTATUS == 7">
                      <div>是否中标</div>
                    </div>
                  </div>

                </div>
              </div>
              <div class="mt10">
                <el-table :data="bidRunList" style="width: 100%">
                  <el-table-column type="index" width="50" label="排名" />
                  <el-table-column prop="CONTACTTEL" label="联系方式" />
                  <el-table-column prop="BIDPRICE" label="出价金额" />
                  <el-table-column prop="EXPECTVALUE" label="出量" />
                  <el-table-column prop="UIPADDRESS" label="IP地址" />
                  <el-table-column prop="BIDADDRESS" label="定位信息" />
                  <el-table-column prop="BIDTIME" label="出价时间" />
                  <el-table-column prop="IS_BID" label="中标">
                    <template #default="scope">
                      <span>{{ scope.row.IS_BID == 0 ? '否' : scope.row.IS_BID == 1 ? '是' : '' }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="BIDDATE" label="物料" />
                  <el-table-column prop="BILLSTATUS" label="分配量">
                    <template #default="scope">

                    </template>
                  </el-table-column>
                  <el-table-column prop="SURETIME" label="中标时间" />
                  <el-table-column prop="SURENAME" label="中标确认人" />
                </el-table>
              </div>
            </div>






          </el-scrollbar>

        </el-card>
        <el-card v-else>
          <el-empty :image="emptyImg" description="很抱歉，暂时没有相关数据~" :image-size="350" />
        </el-card>
        <!-- </el-scrollbar> -->

      </el-col>
    </el-row>

    <vxe-modal destroy-on-close v-model="applyDetailModal" id="formModal" width="800" height="400" resize storage transfer show-zoom>
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
          <el-table-column prop="CARRIERNAME" label="报名单位" />
          <el-table-column prop="CREATIONTIME" label="报名时间" />
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

const leftHight = window.innerHeight - 240;
const Hight = window.innerHeight - 154;
const { proxy } = getCurrentInstance();
const MenuID = inject("menuID");
const emptyImg = proxy.getAssetsFile("icon_task_NoData.png");
import { onMounted, onUnmounted, ref, } from "vue";

import { Search } from "@element-plus/icons-vue";
import { getTableData } from "@/api/system/page";
import countDown from "@/components/countDown/index";

import axios from "axios";

import {
  getSignList, getBidSignCount, getCarrierDetail
  , getBidRunList, submitApprove, forceEnd, cancelSign, confirmSign
  , getBidRecordCarrierList, cancellation
} from "#/system/biddingHall";



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
// BILLSTATUS  0未开始(待提交、审核中、未通过)、1待发公告、2报名中(无需报名的没有这个状态)、3待竞价(报名结束)、4竞价中、5竞价结束、6已完成/已结束(已中标、未中标、已作废)、7强制结束
const statusList = ref(['未开始', '待发公告', '报名中', '待竞价', '竞价中', '竞价结束', '已完成', '强制结束'])

const computedCargoInfoSelect = computed((list, val) => {
  return (list, val) => {
    if (!list || !val) return "暂无数据";
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
    text: "CARTYPE",
    flag: 'isRadio',
  },
  // {
  //   title: "车辆要求",
  //   text: "BIDSTARTTIME",
  // },
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
]);
const cargoInfoList1 = ref([
  {
    title: "竞价时间",
    flag: 'joinBiddingTime'
  },
  {
    title: "延期时长",
    text: "DELAYTIME",
  },
  {
    title: "报名确认",
    text: "IS_SIGNQR",
    flag: 'select',
    selectList: [
      {
        label: '人工确认',
        value: 0,
      },
      {
        label: '自动确认',
        value: 1,
      },
    ]
  },
  {
    title: "保证金额",
    text: "BONDAMT",
  },
  {
    title: "报名时间",
    text: "SIGNSTTIME",
  },
  {
    title: "运费上限",
    text: "FLOORPRICE",
  },
  {
    title: "确标方式",
    text: "IS_SURE",
    flag: 'isRadio',
  },
  {
    title: "中标分配",
    text: "DEVIDETYPE",
    flag: 'select',
    selectList: [
      {
        label: '平均分配',
        value: 0,
      },
      {
        label: '货主分配',
        value: 1,
      },
      {
        label: '承运商出量',
        value: 2,
      },
    ]
  },
  {
    title: "中标名次",
    text: "WINNUM",
    flag: 'select',
    selectList: [
      {
        label: ' 第一名中标',
        value: 1,
      },
      {
        label: '前两名中标',
        value: 2,
      },
      {
        label: '前三名中标',
        value: 3,
      },
      {
        label: '前四名中标',
        value: 4,
      },
      {
        label: '前五名中标',
        value: 5,
      },
    ]
  },
  {
    title: "第一名量",
    text: "ONEZBNUM",
    flag: 'isShow',
    isShow: "DATA.WINNUM >= 1"
  },
  {
    title: "第二名量",
    text: "TWOZBNUM",
    flag: 'isShow',
    isShow: "DATA.WINNUM >= 2"
  },
  {
    title: "第三名量",
    text: "THREEZBNUM",
    flag: 'isShow',
    isShow: "DATA.WINNUM >= 3"
  },
  {
    title: "第四名量",
    text: "FOURZBNUM",
    flag: 'isShow',
    isShow: "DATA.WINNUM >= 4"
  },
  {
    title: "第五名量",
    text: "FIVEZBNUM",
    flag: 'isShow',
    isShow: "DATA.WINNUM >= 5"
  },
  {
    title: "降价幅度",
    text: "PRICECUT",
  },
])

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

const compShow = (DATA, config) => {
  if (!config.isShow) return
  try {
    eval(config.isShow)
  } catch (error) { }
}


const priceBlur = (num, field) => {
  ruleForm.value[field] = Number(ruleForm.value[field]).toFixed(num);
};

const menuVal = ref(null);
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
    menuVal.value = null
    detailNoDynamic.value = {}
    if (leftMenuList.value.length) chooeseMune(leftMenuList.value[0]);
  });
};


const chooeseMune = (item) => {
  menuVal.value = item.BILLNO;
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
  getTableData("oms/bidProject/getCargoDetail", {
    BILLNO: menuVal.value,
    // ROUNDNUM: String(ROUNDNUM.value),
  }).then((res) => {
    // countDownRef.value ? countDownRef.value.countDownClearInterval() : ''
    detailNoDynamic.value = res.RESULT;

    const { BILLSTATUS } = res.RESULT

    switch (BILLSTATUS) {
      case "3":
        queryApplyInfo(menuVal.value)
        getGetBidSignCount(menuVal.value)
        break;
      case "4":
        getGetBidRunList(menuVal.value);
        querygetBidRecordCarrierList(menuVal.value)
        break;
      case "5":
        getGetBidRunList(menuVal.value);
        querygetBidRecordCarrierList(menuVal.value)

        break;
      case "6":

        break;
      case "7":

        break;
      default:
        break;
    }






  });
};

const applyStatus = ref('')
const applyInfoList = ref([])
const queryApplyInfo = (PK_PROJECT) => {
  const protData = {
    PK_PROJECT,
    // PK_PROJECT: 1,
    BILLSTATUS: applyStatus.value,
    // ...MenuID.value
  }
  getSignList(protData).then((res) => {
    applyInfoList.value = res.RESULT

  });
}

const changeApplyStatus = (e) => {
  queryApplyInfo(menuVal.value)
}
const applyInfoData = ref({})
const getGetBidSignCount = (PK_PROJECT) => {
  const protData = {
    PK_PROJECT: PK_PROJECT,
    BILLSTATUS: applyStatus.value,
  }
  getBidSignCount(protData).then((res) => {
    applyInfoData.value = res.RESULT
  });
}

const checkCertification = (val) => {
  console.log("🚀 ~ checkCertification ~ val:", val)

}

const PK_CARRIER = ref('')
const bidRunList = ref([])
const getGetBidRunList = (PK_PROJECT) => {
  const protData = {
    // PK_PROJECT,
    PK_PROJECT: 1,
    PK_CARRIER: PK_CARRIER.value,
  }
  getBidRunList(protData).then((res) => {
    bidRunList.value = res.RESULT
  });

}
const carrierList = ref([])
const querygetBidRecordCarrierList = () => {
  const protData = {
    PK_PROJECT: 1
  }
  getBidRecordCarrierList(protData).then((res) => {
    carrierList.value = res.RESULT
  });
}

const changePK_CARRIER = (e) => {
  getGetBidRunList(menuVal.value);
}


const subCheck = () => {
  const protData = {
    BILLNO: menuVal.value,
  }
  submitApprove(protData).then((res) => {
    proxy.$modal.msgSuccess(res.MESSAGE || "提交成功");
    getPageList()
  });

}

const constraintEnd = () => {
  const protData = {
    BILLNO: menuVal.value,
  }
  forceEnd(protData).then((res) => {
    proxy.$modal.msgSuccess(res.MESSAGE || "提交成功");
    getPageList()
  });
}

const cancalSure = () => {
  let BILLNO = applyInfoRefChooseList.value.map(ele => ele.BILLNO)
  const protData = {
    BILLNO,
  }
  cancelSign(protData).then((res) => {
    proxy.$modal.msgSuccess(res.MESSAGE || "提交成功");
    getPageList()
  });
}

const confirmApply = () => {
  let BILLNO = applyInfoRefChooseList.value.map(ele => ele.BILLNO)
  const protData = {
    BILLNO,
  }
  confirmSign(protData).then((res) => {
    proxy.$modal.msgSuccess(res.MESSAGE || "提交成功");
    getPageList()
  });
}

const clickCancellation = () => {




}

const clickApplyDetail = () => {
  applyDetailModal.value = true
  queryApplyInfo(menuVal.value)

}


const applyInfoRef = ref(null)
const applyInfoRefChooseList = ref([])
const applyInfoRefSelectionChange = (e) => {
  applyInfoRefChooseList.value = e
}

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



const positionData = ref({});


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

  .selectLeftText {
    margin-right: 10px;
    font-size: 14px;
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