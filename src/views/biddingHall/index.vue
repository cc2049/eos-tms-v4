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
                <div class="leftMenu-status" :class="`leftMenu-status${item.BILLSTATUS}`">
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
              <!-- <el-button size="small" :type="btn.COLOR" 
              v-for="(btn,btnIndex) in allPageCon.BUTTON" 
              @click="clickCommonBtn(btn)"
              :key="btn.BILLNO">{{ btn.VNAME }}</el-button> -->

              <!-- <TopButton :topButton="allPageCon.BUTTON" sourceType="2" @handleBtnEvent="clickCommonBtn"  /> -->

              <TopButton :isCurrentBtn="true" ref="topBtnRef">
                <template #currentBtn>
                  <!-- 走了财旺的按钮方法 -->
                  <template v-for="(btn, btnIndex) in allPageCon.BUTTON" :key="btn.BILLNO">
                    <el-button v-if="setShowBtn(btn)" size="small" :type="btn.COLOR" @click="clickCommonBtn(btn)">{{
        btn.VNAME }}</el-button>
                  </template>

                  <!-- 走的自己写的 -->
                  <el-button size="small" v-if="detailNoDynamic.BILLSTATUS == 0" type="primary"
                    @click="subCheck">提交审核</el-button>
                  <el-popconfirm title="确定要结束?" @confirm="constraintEnd">
                    <template #reference>
                      <el-button size="small" type="danger"
                        v-if="detailNoDynamic.BILLSTATUS == 2 || queryLeftForm.BILLSTATUS == 5">强制结束</el-button>
                    </template>
                  </el-popconfirm>
                  <el-button size="small" :disabled="applyInfoRefChooseList.length > 0 ? false : true"
                    v-if="detailNoDynamic.BILLSTATUS == 2" @click="cancalSure">取消确认</el-button>
                  <el-button size="small" :disabled="applyInfoRefChooseList.length > 0 ? false : true" type="primary"
                    v-if="detailNoDynamic.BILLSTATUS == 2" @click="confirmApply">确认报名</el-button>
                  <el-button size="small"
                    v-if="detailNoDynamic.BILLSTATUS == 5 || detailNoDynamic.BILLSTATUS == 6 || detailNoDynamic.BILLSTATUS == 7"
                    @click="clickApplyDetail">报名明细</el-button>
                  <el-button size="small" type="primary" :disabled="winBiddingArr.length ? false : true"
                    v-if="detailNoDynamic.BILLSTATUS == 5" @click="winBidding">中标</el-button>
                  <el-button size="small"
                    v-if="detailNoDynamic.BILLSTATUS == 5 || detailNoDynamic.BILLSTATUS == 6 || detailNoDynamic.BILLSTATUS == 7"
                    :disabled="winBiddingArr.length ? false : true" @click="clickCancellation">作废</el-button>
                </template>
              </TopButton>


              <!-- <el-button size="small" v-if="queryLeftForm.BILLSTATUS == 0">编辑</el-button> -->


              <!-- <el-button size="small"
                v-if="detailNoDynamic.BILLSTATUS == 2 || detailNoDynamic.BILLSTATUS == 5 || detailNoDynamic.BILLSTATUS == 6 || detailNoDynamic.BILLSTATUS == 7">查看公告</el-button> -->





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
                      {{ chooseLeftData.STATUSNAME }}
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
                    <el-row>
                      <el-col :span="6">
                        <span>发货日期：</span>
                        <span class="cargoInfo-top-content">{{ detailNoDynamic.YQSTDATE }}</span>
                      </el-col>
                      <el-col :span="6">
                        <span>要求送达日期：</span>
                        <span class="cargoInfo-top-content">{{ detailNoDynamic.YQEDDATE }}</span>
                      </el-col>
                      <el-col :span="6">
                        <span>车辆类型：</span>
                        <span class="cargoInfo-top-content">{{ detailNoDynamic.CARTYPE }}</span>
                      </el-col>
                      <el-col :span="6">
                        <span>提供装货：</span>
                        <span class="cargoInfo-top-content">{{ detailNoDynamic.IS_LOAD == 1 ? '是' : '否' }}</span>
                      </el-col>
                      <el-col :span="6">
                        <span>提供卸货：</span>
                        <span class="cargoInfo-top-content">{{ detailNoDynamic.IS_UNLOAD == 1 ? '是' : '否' }}</span>
                      </el-col>
                      <el-col :span="6">
                        <span>提供发票：</span>
                        <span class="cargoInfo-top-content">{{ detailNoDynamic.PRICECUT == 1 ? '是' : '否' }}</span>
                      </el-col>
                    </el-row>


                    <el-row class=" mt10 pt-10" style="border-top: 1px dashed #ccc;">
                      <el-col :span="12">
                        <span>竞价时间：</span>
                        <span class="cargoInfo-top-content">{{ detailNoDynamic.BIDSTTIME }} - {{
        detailNoDynamic.BIDEDTIME
      }}</span>
                      </el-col>
                      <el-col :span="6">
                        <span>延期时长：</span>
                        <span class="cargoInfo-top-content">{{ detailNoDynamic.DELAYTIME }}分钟</span>
                      </el-col>
                      <el-col :span="6">
                        <span>报名确认：</span>
                        <span class="cargoInfo-top-content">{{ IS_SIGNQRList[detailNoDynamic.IS_SIGNQR] }}</span>
                      </el-col>
                      <!-- <el-col :span="9">
                        <span>车辆要求：</span>
                        <span class="cargoInfo-top-content">dd</span>
                      </el-col> -->
                      <el-col :span="12">
                        <span>报名时间：</span>
                        <span class="cargoInfo-top-content">
                          {{ detailNoDynamic.SIGNSTTIME ? detailNoDynamic.SIGNSTTIME + ' - ' : '' }}{{
        detailNoDynamic.SIGNEDTIME }}</span>
                      </el-col>
                      <el-col :span="6">
                        <span>保证金额：</span>
                        <span class="cargoInfo-top-content">{{ detailNoDynamic.BONDAMT }}元</span>
                      </el-col>
                      <el-col :span="6">
                        <span>运费上限：</span>
                        <span class="cargoInfo-top-content">{{ detailNoDynamic.FLOORPRICE }}元</span>
                      </el-col>
                      <el-col :span="6">
                        <span>确标方式：</span>
                        <span class="cargoInfo-top-content">{{ detailNoDynamic.IS_SURE == 1 ? '是' : '否' }}</span>
                      </el-col>
                      <el-col :span="6">
                        <span>中标分配：</span>
                        <span class="cargoInfo-top-content">{{ DEVIDETYPEList[detailNoDynamic.DEVIDETYPE] }}</span>
                      </el-col>
                      <el-col :span="6">
                        <span>中标名次：</span>
                        <span class="cargoInfo-top-content">{{ WINNUMList[detailNoDynamic.WINNUM] }}</span>
                      </el-col>
                      <el-col :span="6" v-if="detailNoDynamic.WINNUM > 0">
                        <span>第一名量：</span>
                        <span class="cargoInfo-top-content">{{ detailNoDynamic.ONEZBNUM * 100 }}%</span>
                      </el-col>
                      <el-col :span="6" v-if="detailNoDynamic.WINNUM > 1">
                        <span>第二名量：</span>
                        <span class="cargoInfo-top-content">{{ detailNoDynamic.TWOZBNUM * 100 }}%</span>
                      </el-col>
                      <el-col :span="6" v-if="detailNoDynamic.WINNUM > 2">
                        <span>第三名量：</span>
                        <span class="cargoInfo-top-content">{{ detailNoDynamic.THREEZBNUM * 100 }}%</span>
                      </el-col>
                      <el-col :span="6" v-if="detailNoDynamic.WINNUM > 3">
                        <span>第四名量：</span>
                        <span class="cargoInfo-top-content">{{ detailNoDynamic.FOURZBNUM * 100 }}%</span>
                      </el-col>
                      <el-col :span="6" v-if="detailNoDynamic.WINNUM > 4">
                        <span>第五名量：</span>
                        <span class="cargoInfo-top-content">{{ detailNoDynamic.FIVEZBNUM * 100 }}%</span>
                      </el-col>
                      <el-col :span="6">
                        <span>降价幅度：</span>
                        <span class="cargoInfo-top-content">{{ detailNoDynamic.PRICECUT }}元</span>
                      </el-col>
                    </el-row>


                  </div>
                </div>

              </el-collapse-item>
            </el-collapse>
            <!-- 报名信息 报名中 -->
            <div v-if="detailNoDynamic.BILLSTATUS == 2 || detailNoDynamic.BILLSTATUS == 3">
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
                  <el-table-column prop="CARRIERNAME" show-overflow-tooltip  label="报名单位" />
                  <el-table-column prop="CREATIONTIME" show-overflow-tooltip  label="报名时间" />
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
                      <el-select v-model="PK_CARRIER" size="small" clearable style="width: 120px"
                        @change="changePK_CARRIER">
                        <el-option :label="item.CARRIERNAME" :value="item.PK_CARRIER" v-for="item in carrierList"
                          :key="item.PK_CARRIER" />
                      </el-select>
                    </div>
                    <div class="disflex ml-20"
                      v-if="detailNoDynamic.BILLSTATUS == 6 || detailNoDynamic.BILLSTATUS == 7">
                      <div class="selectLeftText">是否中标</div>
                      <el-select v-model="IS_BID" size="small" clearable style="width: 120px" @change="changeIS_BID">
                        <el-option label="是" value="1" />
                        <el-option label="否" value="0" />
                      </el-select>
                    </div>
                  </div>

                </div>
              </div>
              <div class="mt10">
                <el-table :data="bidRunList" border style="width: 100%" :span-method="arraySpanMethod"
                  @selection-change="handleSelectionChange">
                  <el-table-column type="selection" width="50" fixed />
                  <el-table-column prop="RANK" label="排名" width="55" />
                  <el-table-column prop="CARRIERNAME" width="140" show-overflow-tooltip label="出价单位" />
                  <el-table-column prop="CONTACTTEL" width="110" label="联系方式" v-if="queryLeftForm.BILLSTATUS == 4" />
                  <el-table-column prop="BIDPRICE" label="出价金额" />
                  <el-table-column prop="EXPECTVALUE" label="出量" />
                  <el-table-column prop="UIPADDRESS" width="120" label="IP地址" />
                  <el-table-column prop="BIDADDRESS" width="120"  show-overflow-tooltip  label="定位信息" />
                  <el-table-column prop="BIDTIME" width="140"  show-overflow-tooltip  label="出价时间" />
                  <el-table-column prop="IS_BID" label="中标" v-if="queryLeftForm.BILLSTATUS == 6">
                    <template #default="scope">
                      <span>{{ scope.row.IS_BID == 0 ? '否' : scope.row.IS_BID == 1 ? '是' : '' }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="MATERIALNAME" label="物料" width="100" />
                  <el-table-column prop="TRUSTNUM" label="分配量" width="140">
                    <template #default="scope">
                      <span v-if="queryLeftForm.BILLSTATUS == 6">{{ scope.row.TRUSTNUM }}</span>
                      <el-input v-else type="number" size="small" v-model="scope.row.TRUSTNUM" placeholder="输入分配量"
                        clearable />
                    </template>
                  </el-table-column>
                  <el-table-column prop="SURETIME" label="中标时间" width="140"  show-overflow-tooltip  />
                  <el-table-column prop="SURENAME" width="130" label="中标确认人" />
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

const leftHight = window.innerHeight - 240;
const Hight = window.innerHeight - 160;
const { proxy } = getCurrentInstance();
// const MenuID = inject("menuID");
// console.log("🚀 ~ MenuID:", MenuID)

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

import {
  getSignList, getBidSignCount, getCarrierDetail
  , getBidRunList, submitApprove, forceEnd, cancelSign, confirmSign, getCargoEndList
  , getBidRecordCarrierList, cancellation, bidWin
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
      if (tableBody[i].PK_RECORD == tableBody[i - 1].PK_RECORD) {
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
  if (columnIndex === 1 || columnIndex === 2 || columnIndex === 3 || columnIndex === 4 || columnIndex === 5 || columnIndex === 6 || columnIndex === 7 || columnIndex === 8 || columnIndex === 9 || columnIndex === 12 || columnIndex === 13) {
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

const IS_SIGNQRList = ref(['人工确认', '自动确认'])
const DEVIDETYPEList = ref(['平均分配', '货主分配', '承运商出量'])
const WINNUMList = ref(['', '第一名中标', '前两名中标', '前三名中标', '前四名中标', '前五名中标'])


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
  getTableData("oms/bidProject/getCargoDetail", {
    BILLNO: menuVal.value,
    // ROUNDNUM: String(ROUNDNUM.value),
  }).then((res) => {
    // countDownRef.value ? countDownRef.value.countDownClearInterval() : ''
    detailNoDynamic.value = res.RESULT;

    const { BILLSTATUS } = res.RESULT

    switch (BILLSTATUS) {
      case "2":
        queryApplyInfo(menuVal.value)
        getGetBidSignCount(menuVal.value)
        break;
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
        getGetBidRunList(menuVal.value);
        querygetBidRecordCarrierList(menuVal.value)
        break;
      case "7":
        getGetBidRunList(menuVal.value);
        querygetBidRecordCarrierList(menuVal.value)
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

const PK_CARRIER = ref('')
const IS_BID = ref('')
const getGetBidRunList = (PK_PROJECT) => {
  const protData = {
    // PK_PROJECT,
    PK_PROJECT,
    PK_CARRIER: PK_CARRIER.value || '',
    IS_BID: IS_BID.value || ''
  }
  bidRunList.value = []

  if (queryLeftForm.value.BILLSTATUS == 6) {  // 已结束
    getCargoEndList(protData).then((res) => {
      bidRunList.value = res.RESULT
      listCount.value = null
      cellList.value = []
      computeCell(bidRunList.value)
    }).catch(() => {
      listCount.value = null
      cellList.value = []
      bidRunList.value = []
    });
  } else {
    getBidRunList(protData).then((res) => {
      bidRunList.value = res.RESULT
      listCount.value = null
      cellList.value = []
      computeCell(bidRunList.value)
    }).catch(() => {
      listCount.value = null
      cellList.value = []
      bidRunList.value = []
    });
  }

}
const carrierList = ref([])
const querygetBidRecordCarrierList = () => {
  const protData = {
    PK_PROJECT: detailNoDynamic.value.BILLNO
  }
  getBidRecordCarrierList(protData).then((res) => {
    carrierList.value = res.RESULT
  });
}

const changePK_CARRIER = (e) => {
  getGetBidRunList(menuVal.value);
}

const changeIS_BID = () => {
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

const winBiddingArr = ref([])
const handleSelectionChange = (val) => {
  winBiddingArr.value = val
}
const winBidding = () => {
  const protData = {
    data: winBiddingArr.value,
  }
  bidWin(protData).then((res) => {
    proxy.$modal.msgSuccess(res.MESSAGE || "提交成功");
    getPageList()
  });

}

const clickCancellation = () => {

  const protData = {
    data: winBiddingArr.value,
  }
  cancellation(protData).then((res) => {
    proxy.$modal.msgSuccess(res.MESSAGE || "提交成功");
    getPageList()
  });


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
  btn.ACTIONADDRESS = btn.ACTIONADDRESS.concat(`?PK_PROJECT=${detailNoDynamic.value.BILLNO}`)
  topBtnRef.value.handleEvent(btn, [detailNoDynamic.value])
}

const checkCertification = (val) => {
  let btn = allPageCon.value.BUTTON.filter(ele=>ele.BTNTITLE=='checkCertification')[0]
  // btn.ACTIONADDRESS = btn.ACTIONADDRESS.concat(`?PK_CARRIER=${val.BILLNO}`)
  let data = {
    BILLNO:val.BILLNO
  }
  topBtnRef.value.handleEvent(btn, [data])
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