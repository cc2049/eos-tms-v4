<!--
 * 高级查询组件
 * @author: wsd
 * @since: 2024-04-28
 * index.vue
-->
<template>
  <div class="advancedQuery">
    <div class="disflex advancedQuery-alone mb20">
      <div class="advancedQuery-title">我的方案</div>
      <div class="currentRadio" :class="chooseRadioVal == item.BILLNO ? 'active' : ''"
        v-for="(item, index) in myPlanList" :key="index" @click="clickRadio(item, index)"> {{ item.VNAME }}
      </div>
    </div>
    <div class=" advancedQuery-alone ">
      <div class="advancedQuery-title">快捷过滤</div>
      <!-- <div style="width: calc(100% - 100px)"> -->
      <div class="oneLine">
        <FiltrationCom :filterConfig="filterConfig" :filterArr="filterArr" class="oneLine-left"
          :style="{ height: FiltrationComHeight, maxWidth: binSize + 'px' }" 
          @changeFilter="changeFilter" @changeCurrentQueryList="changeCurrentQueryList" :settingArr="settingQueryList" />
        <div class="advancedQuery-rightBtn">
          <el-button type="primary" @click="searchBtn">
            <el-icon color="#fff" :size="20">
              <Icon icon="iconamoon:search"></Icon>
            </el-icon>
          </el-button>
          <el-popover placement="bottom" :width="600" trigger="click" :visible="visible">
            <template #reference>
              <el-button @click="visible = true">
                <el-icon :size="20">
                  <Icon icon="uil:setting"></Icon>
                </el-icon>
              </el-button>
            </template>
            <SettingFilter :filterConfig="filterConfig" :filterArr="filterArr"
              @changeCondition="changeCondition" @resetCondition="resetCondition" @delFilterArr="delFilterArr"
              @changeFilter="changeFilter" @changeCurrentQueryList="settingChangeCurrentQueryList" />
            <el-divider />
            <div class="tr">
              <el-button @click="visible = false" size="mini">取消</el-button>
              <el-button type="primary" @click="visible = false" size="mini">确定</el-button>
            </div>
          </el-popover>
          <div class="ml10 mr10 btnStyle" @click="clickSavePlan">保存</div>
          <div class="btnStyle">重置</div>
          <template v-if="filterArr.length > 1">
            <el-icon color="#0055ff" :size="15" class="ml10 cp foldOUnfoldIcon" @click="foldOUnfold(1)"
              v-if="FiltrationComHeight == 'auto'">
              <Icon icon="codicon:fold-up"></Icon>
            </el-icon>
            <el-icon color="#0055ff" :size="15" class="ml10 cp foldOUnfoldIcon" @click="foldOUnfold(0)" v-else>
              <Icon icon="codicon:fold-down"></Icon>
            </el-icon>

          </template>
        </div>
      </div>

      <!-- </div> -->
    </div>

    <AllocationPlan :showModal="showModal" :leftList="myPlanList" @updateLeftList="getPlanList" ref="allocationPlanRef"
      @closeModal="closeShowModal"></AllocationPlan>

  </div>
</template>

<script setup>
import FiltrationCom from "./components/filtrationCom";
import SettingFilter from "./components/settingFilter";
import AllocationPlan from "./components/allocationPlan";
import { getList, savePlan } from "#/system/advancedQuery";
const { proxy } = getCurrentInstance();

import { axiosGet } from "#/common";

const MenuID = inject("menuID");

const emit = defineEmits("updateHeight", "handleCustomPlan");

const props = defineProps({
  queryConfig: {
    type: Array,
    default: [],
  },
  //   showModal: {
  //     type: Boolean,
  //     default: false,
  //   },
});
const showModal = ref(false);
const binSize = computed(() => {
  const windowWidth = document.documentElement.clientWidth;
  let val = (windowWidth - 20 - 20 - 50 - 165) / 520;
  let newVal = Math.floor(val);
  return 520 * newVal;
});

const openShowModal = () => {
  showModal.value = true;
};
const closeShowModal = () => {
  showModal.value = false;
};

const clickStatus = ref(""); // 1是点击外层查询  2 是点击设置的确定

const filterArr = ref([]);
const defaultFilterArr = ref([]);
// 我的方案
const chooseRadioVal = ref(null);
const myPlanList = ref([]);
const clickRadio = (item, index) => {
  chooseRadioVal.value = item.BILLNO;

  let query = {
    ...MenuID.value,
    PKBILLNO: item.BILLNO,
  };
  // 查询方案里面的值
  axiosGet("/sys/queryprogUserDtl/getSubList", query).then((res) => {
    console.log("🚀 ~ axiosGet ~ res:", res)
    filterArr.value = res.RESULT
  });

  emit("handleCustomPlan", {
    type: "1",
    PROGRAMID: chooseRadioVal.value,
  });
};
// 查询按钮事件
function searchBtn() {
  emit("handleCustomPlan", {
    type: "2",
    PROGRAMID: chooseRadioVal.value,
    QUERYS:
      clickStatus.value == 1
        ? querySaveList.value
        : clickStatus.value == 2
          ? settingQueryList.value
          : [],
  });
}

// 快捷过滤
const filterConfig = ref({
  filterSeceletArr: [],
  filterSeceletArr1: [
    // { LABEL: "IsNull-为空", VALUE: "IsNull" },
    // { LABEL: "IsNotNull-不为空", VALUE: "IsNotNull" },
    // { LABEL: "EqualTo-等于", VALUE: "EqualTo" },
    // { LABEL: "NotEqualTo-不等于", VALUE: "NotEqualTo" },
    // { LABEL: "GreaterThan-大于", VALUE: "GreaterThan" },
    // { LABEL: "GreaterThanOrEqualTo-大于等于", VALUE: "GreaterThanOrEqualTo" },
    // { LABEL: "LessThan-小于", VALUE: "LessThan" },
    // { LABEL: "LessThanOrEqualTo-小于等于", VALUE: "LessThanOrEqualTo" },
    // { LABEL: "Like-模糊匹配", VALUE: "Like" },
    // { LABEL: "NotLike-模糊不匹配", VALUE: "NotLike" },
    // { LABEL: "In-包含", VALUE: "In" },
    // { LABEL: "NotIn-不包含", VALUE: "NotIn" },
    // { LABEL: "Between-在**之间", VALUE: "Between" },
    // { LABEL: "NotBetween-不**在之间", VALUE: "NotBetween" },
    // { LABEL: "LeftLike-左匹配", VALUE: "LeftLike" },
    // { LABEL: "RightLike-右匹配", VALUE: "RightLike" },
    // { LABEL: "FUZZYRET-复杂检索", VALUE: "FUZZYRET" },
  ],
});


watch(
  () => props.queryConfig,
  (value) => {
    filterConfig.value.filterSeceletArr = props.queryConfig.filter(
      (el) => el.ISSHOW != 0
    );
    
    filterArr.value = JSON.parse(JSON.stringify(defaultFilterArr.value));
  },
  { immediate: true }
);

const querySaveList = ref([]);
const changeCurrentQueryList = (val) => {
  console.log("🚀 ~ changeCurrentQueryList ~ val:", val)
  clickStatus.value = 1;
  querySaveList.value = JSON.parse(JSON.stringify(val));
};
const settingQueryList = ref([]);
const settingChangeCurrentQueryList = (val) => {
  clickStatus.value = 2;
  settingQueryList.value = JSON.parse(JSON.stringify(val));
  // querySaveList.value = JSON.parse(JSON.stringify(val));
};

const allocationPlanRef = ref(null);
const clickSavePlan = () => {
  if (myPlanList.value) {
    callAddition();
  } else {
    allocationPlanRef.value.showSaveAs(querySaveList.value);
  }
};

// 调用保存方案
const callAddition = () => {
  const protData = {
    BILLNO: chooseRadioVal.value, // 方案主键
    QUERYS: querySaveList.value,
    ...MenuID.value,
  };
  savePlan(protData).then((res) => {
    proxy.$modal.msgSuccess("保存成功");
  });
};

const getPlanList = () => {
  getList(MenuID.value).then((res) => {
    myPlanList.value = res.RESULT;
    if (myPlanList.value.length) {
      let newArr = myPlanList.value.filter((ele) => ele.ISDEFAULT == 1);
      !chooseRadioVal.value
        ? (chooseRadioVal.value = newArr.length
          ? newArr[0].BILLNO
          : myPlanList.value[0].BILLNO)
        : "";
    }
  });
};

// 折叠和展示
const FiltrationComHeight = ref("36px");
const foldOUnfold = (e) => {
  if (e) {
    FiltrationComHeight.value = "36px";
  } else {
    FiltrationComHeight.value = "auto";
  }
  emit("updateHeight");
};

const changeFilter = (val, item, index) => {
  filterArr.value[index] = JSON.parse(JSON.stringify(val));
};

const visible = ref(false);
const changeCondition = (e) => {

  filterArr.value.push(e);
  filterArr.value = JSON.parse(JSON.stringify(filterArr.value));  // 重新更新下数据 不然视图有问题


};
const resetCondition = () => {
  filterArr.value = JSON.parse(JSON.stringify(defaultFilterArr.value));
};
// 删除
const delFilterArr = (index) => {
  filterArr.value.splice(index, 1);
  emit("updateHeight", index);
};

defineExpose({
  openShowModal,
});

onMounted(() => {
  getPlanList();
});
</script>

<style scoped lang="scss">
@import "@/assets/styles/variables.module.scss";

.advancedQuery {
  padding-top: 20px;
  // padding-bottom: 10px;
  font-size: 12px;

  .currentRadio {
    border: 1px solid #a1bacb;
    margin-right: 10px;
    padding: 4px 6px;
    color: #5c7390;
    border-radius: 2px;
    cursor: pointer;

    &.active {
      color: $--color-primary;
      border-color: $--color-primary;
    }
  }

  &-alone {
    display: flex;

    :deep(.el-button) {
      height: 26px !important;
      line-height: 26px;
    }
  }

  &-title {
    color: #515967;
    font-weight: bold;
    margin-right: 15px;
    flex-shrink: 0;
    line-height: 26px;
  }

  &-rightBtn {
    line-height: 26px;

    display: flex;

    :deep(.el-button) {
      padding: 0 4px !important;

      .el-icon {
        font-size: 16px !important;
      }
    }
  }

  .btnStyle {
    color: $--color-primary;
    cursor: pointer;
    font-size: 14px;
  }

  .oneLine {
    display: flex;

    &-left {
      max-width: 1040px;
      overflow: hidden;
    }

    &-right {
      flex-shrink: 0;
      flex-grow: 1;
    }
  }

  .foldOUnfoldIcon {
    margin: 6px 0 0 10px;
  }
}

:deep(.el-select) {
  height: 26px !important;
  line-height: 26px !important;
}

:deep(.el-input) {
  height: 26px !important;
  line-height: 26px !important;
}

:deep(.el-input__wrapper) {
  box-shadow: none;
  border: 1px solid #949eb5;
  border-radius: 2px;
  height: 26px;
}

:deep(.el-input__inner) {
  color: #12151a;
}

:deep(.el-input__inner::placeholder) {
  color: #767476;
}

:deep(.el-input__suffix) {
  color: #acafb4;
}

:deep(.firstSelect) {
  .el-input__wrapper {
    padding: 1px 1px 1px 6px;
  }

  .el-input__suffix-inner {
    background-color: #f7f7f7;
    border-left: 1px solid #d1d4da;
  }

  .el-input__suffix-inner:hover {
    background-color: #c1c7d3;

    .el-select__icon {
      color: #757689;
    }
  }

  .el-input__suffix-inner> :first-child {
    margin: 5px;
  }
}

:deep(.el-select__wrapper) {
  height: 26px !important;
  line-height: 26px !important;
  min-height: auto;
  box-shadow: 0 0 0 1px #949eb5 inset;
  border-radius: 2px !important;
}
</style>
