<!--
 * 运输需求按段拆
 * @author: wsd
 * @since: 2024-06-24
 * paragraph.vue
-->
<template>
  <teleport to="#custemPageBtn">
    <el-button @click="cancel">取消</el-button>
    <el-button type="primary" size="default" @click="confirm">确定</el-button>
  </teleport>
  <div class="measure">
    <el-card>
      <template #header>
        <div class="card-header disflex justify-between">
          <span>拆分详情</span>
          <div>
            <!-- <el-button type="text" @click="delList">删除</el-button> -->
            <el-button type="text" @click="addList">新增</el-button>
          </div>
        </div>
      </template>
      <div class="disflex resolutionMu">
        <div v-for="(item, index) in detailObj.SUBLIST" :key="index" class="resolution">
          <el-icon v-if="index != 0" @click="delList(index)" class="rightBtn">
            <Close />
          </el-icon>
          <el-select v-if="index != 0" v-model="item.TRANSTYPE" class="mr-20" clearable placeholder="请选择"
            style="width: 100px">
            <el-option label="汽运" value="1" />
            <el-option label="船运" value="2" />
            <el-option label="铁运" value="3" />
          </el-select>
          <div class="colorLumpMun">
            <div class="colorLump resolution-left">
              <div class="resolution-left-text">
                {{ index == 0 ? '起点' : index == detailObj.SUBLIST.length - 1 ? '终点' : '途径点' }}
              </div>
            </div>
            <div class="resolution-right">
              <div class="disflex">
                <div v-for="(materialItem, materialIndex) in item" :key="materialIndex" class="">
                  {{ materialIndex != 0 ? '/' : '' }}
                  {{
      materialItem.MATERIALNAME }}（{{ materialItem.ROWLYWEIGHT }}
                  {{
      materialItem.VUNIT }} ）</div>
              </div>
              <el-divider border-style="dashed" />
              <div class="disflex ">
                <el-date-picker value-format="YYYY-MM-DD" v-model="item.YQSTDATE" type="date" placeholder="请选择"
                  style="width: 100%;" class="mr-10" />
                <el-date-picker value-format="YYYY-MM-DD" v-if="index != 0 && index != detailObj.SUBLIST.length - 1"
                  v-model="item.YQSDDATE" type="date" placeholder="请选择" style="width: 100%;" />
              </div>

              <el-divider border-style="dashed" />
              <div class="disflex">
                <el-select v-model="item.PK_SENDADDR" clearable placeholder="请选择" style="width: 100%"
                  @change="val => changeDate(val, index)">
                  <el-option v-for="selectItem in selectList" :key="selectItem.VALUE" :label="selectItem.VNAME"
                    :value="selectItem.VALUE" />
                </el-select>

              </div>

            </div>
          </div>
        </div>
      </div>
    </el-card>

    <el-card class="mt-10">
      <template #header>
        <div class="card-header">
          <span>需求信息</span>
        </div>
      </template>
      <div>
        <el-form :model="form" label-width="auto" style="width: 100%;">
          <el-row style="width: 100%;">
            <el-col :span="6">
              <el-form-item label="委托单位：">
                <div>{{ detailObj.TRANORGNAME }}</div>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="业务类型：">
                <div>{{ detailObj.BUSSTYPE == 1 ? '采购' : detailObj.BUSSTYPE == 2 ? '销售' :
      detailObj.BUSSTYPE ==
        3 ? '调拨' : '' }}</div>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="客商企业：">
                <div>{{ detailObj.CUSTOMERNAME }}</div>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="合同单号：">
                <div>{{ detailObj.CONTRACTNO }}</div>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <el-divider border-style="dashed" />
        <el-form :model="form" label-width="auto" style="width: 100%;">
          <el-row style="width: 100%;">
            <el-col :span="6">
              <el-form-item label="发货单位：">
                <div>{{ detailObj.SENDORGNAME }}</div>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="发货地址：">
                <div>{{ detailObj.SENDADDR }}</div>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="联系姓名：">
                <div>{{ detailObj.SENDPSN }}</div>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="联系电话：">
                <div>{{ detailObj.SENDTEL }}</div>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="收货单位：">
                <div>{{ detailObj.RECEIVENAME }}</div>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="收货地址：">
                <div>{{ detailObj.RECEIVEADDR }}</div>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="联系姓名：">
                <div>{{ detailObj.RECEIVEPSN }}</div>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="联系电话：">
                <div>{{detailObj.RECEIVETEL}}</div>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </el-card>



  </div>
</template>

<script setup>
import { getSpecialDetail, handleDemand, getSelectTypeList } from "#/custemPage/transportDemand"
import { computed, onMounted, onUnmounted, ref, } from "vue";
import { Close } from '@element-plus/icons-vue'

const { proxy } = getCurrentInstance();
const emit = defineEmits(["closeModal"]);

const props = defineProps({
  currentData: Array,
  config: Object
})
console.log(props)
const form = ref({})

const rows = computed(() => props.currentData[0])
const detailObj = ref({
  SUBLIST: []
})


const calculatedValue = () => {

  detailObj.value.SUBLIST.forEach((item, index) => {
    if (index != 0) {
      item.forEach((items, indexs) => {
        detailObj.value.SUBLIST[index][indexs].ALLOWNUM = detailObj.value.SUBLIST[index - 1][indexs].ALLOWNUM - (detailObj.value.SUBLIST[index - 1][indexs].ALLOCATEDNUM || 0)
      })
      // detailObj.value.SUBLIST[index].ALLOWNUM = detailObj.value.SUBLIST[index - 1].ALLOWNUM - (detailObj.value.SUBLIST[index - 1].ALLOCATEDNUM || 0)
    }
  })
  console.log("🚀 ~ detailObj.value.SUBLIST.forEach ~ detailObj.value.SUBLIST:", detailObj.value.SUBLIST)
}

const ALLOCATEDNUMBlur = () => {
  calculatedValue()
}

const addList = () => {
  // detailObj.value.SUBLIST.push({
  //     ALLOCATEDNUM: '',
  //     ALLOWNUM: ''
  // })
  console.log(detailObj.value.SUBLIST)
  let newData = JSON.parse(JSON.stringify(detailObj.value.SUBLIST[0]))
  newData.forEach(item => {
    item.ALLOCATEDNUM = ''
  })
  detailObj.value.SUBLIST.push(newData)
  calculatedValue()
}

const delList = (index) => {
  detailObj.value.SUBLIST.splice(index, 1)
  calculatedValue()
}

const cancel = () => {
  emit("close")

}

const changeDate = (val, index) => {
  let valArr = selectList.value.filter(ele => ele.VALUE == val)
  if (valArr) {
    detailObj.value.SUBLIST[index].SENDADDR = valArr[0].LABEL
  }
}
const confirm = () => {
  console.log(detailObj.value.SUBLIST)
  let TRANSTYPE = ''
  detailObj.value.SUBLIST.forEach((item, index) => {
    // item.TRANSTYPE?TRANSTYPE = TRANSTYPE.concat(`${item.TRANSTYPE},`):''
    console.log(item.TRANSTYPE)
    if (item.TRANSTYPE) {
      TRANSTYPE = index != detailObj.value.SUBLIST.length-1 ? TRANSTYPE.concat(`${item.TRANSTYPE},`):TRANSTYPE.concat(`${item.TRANSTYPE}`)
    }
  })
  console.log("🚀 ~ confirm ~ TRANSTYPE:", TRANSTYPE)

  // let ROADLIST = []
  let ROADLIST = detailObj.value.SUBLIST.map((ele, eleIndex) => {
    return {
      "SENDADDR": ele.SENDADDR,
      "PK_SENDADDR": ele.PK_SENDADDR,
      "YQSTDATE": ele.YQSTDATE,
      "YQSDDATE": ele.YQSDDATE
    }
  })
  let protData = {
    BILLNO: rows.value.BILLNO,
    "MODE": "SECTION",
    TRANSTYPE,
    ROADLIST

  }
  handleDemand(protData).then(res => {
    proxy.$modal.msgSuccess("保存成功");
    emit("close")
  })
}

const getgetSpecialDetail = () => {
  let protData = {
    BILLNO: rows.value.BILLNO
  }
  getSpecialDetail(protData).then(res => {
    detailObj.value = res.RESULT
  })
};

const selectList = ref([])
const getgetSelectTypeList = () => {
  getSelectTypeList({ "KEYWORD": "", "TYPE": "263" }).then(res => {
    selectList.value = res.RESULT
  })
}

onMounted(() => {
  getgetSpecialDetail()
  getgetSelectTypeList()
  // 
});

</script>

<style scoped lang="scss">
.measure {
  padding: 10px 20px;

  .resolutionMu {
    background-color: #f7f9fe;
    padding: 20px 20px 0 20px;
    flex-wrap: wrap;


    .resolution:first-child {
      .colorLump {
        background-color: #eaf0fc;
        color: #2c62e3;
      }
    }

    .resolution:last-child {
      .colorLump {
        background-color: #fdf6ec;
        color: #e89e42;
      }
    }


  }

  .resolution {
    // width: 300px;
    display: flex;
    align-items: center;
    margin-right: 30px;
    margin-bottom: 20px;
    font-size: 14px;
    position: relative;

    .colorLumpMun {
      display: flex;
    }

    .colorLump {
      width: 40px;
      border-radius: 10px 0 0 10px;
      // text-align: center;
      writing-mode: vertical-lr;
      display: flex;
      align-items: center;
      justify-content: center;
      letter-spacing: 6px;
      background-color: #f2e8fe;
      color: #7915f5;
    }

    &-right {
      padding: 10px;
      background-color: #fff;
      border-radius: 0 10px 10px 0;

      .el-divider--horizontal {
        margin: 10px 0;
      }
    }


    .rightBtn {
      position: absolute;
      right: -8px;
      top: -6px;
      z-index: 999;
      font-size: 18px;
      color: #aaa;
      cursor: pointer;
    }
  }




}
</style>
