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
      <div class="currentRadio" :class="chooseRadioVal == item.BILLNO ? 'active' : ''" v-for="(item, index) in myPlanList" :key="index" @click="clickRadio(item, index)"> {{ item.VNAME }}
      </div>
    </div>
    <div class=" advancedQuery-alone ">
      <div class="advancedQuery-title">快捷过滤</div>
      <!-- <div style="width: calc(100% - 100px)"> -->
      <div class="oneLine">
        <!-- <FiltrationCom :filterConfig="filterConfig" :filterArr="filterArr"  class="oneLine-left"
                        :style="{ height: FiltrationComHeight,maxWidth:windowWidth>1473?'1040px':'520px'}" :defaultFilterArr="defaultFilterArr"
                        @changeFilter="changeFilter" /> -->
        <FiltrationCom :filterConfig="filterConfig" :filterArr="filterArr" class="oneLine-left" :style="{ height: FiltrationComHeight, maxWidth: binSize + 'px' }" :defaultFilterArr="defaultFilterArr" @changeFilter="changeFilter" />
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
            <SettingFilter :filterConfig="filterConfig" :filterArr="filterArr" :defaultFilterArr="defaultFilterArr" @changeCondition="changeCondition" @resetCondition="resetCondition" @delFilterArr="delFilterArr" />
            <el-divider />
            <div class="tr">
              <el-button @click="visible = false" size="mini">取消</el-button>
              <el-button type="primary" @click="visible = false" size="mini">确定</el-button>
            </div>
          </el-popover>
          <div class="ml10 mr10 btnStyle">保存</div>
          <div class="btnStyle">重置</div>
          <template v-if="filterArr.length > 2">
            <el-icon color="#0055ff" :size="15" class="ml10 cp foldOUnfoldIcon" @click="foldOUnfold(1)" v-if="FiltrationComHeight == 'auto'">
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

    <AllocationPlan :showModal="showModal" :leftList="myPlanList" @updateLeftList="getPlanList"></AllocationPlan>

  </div>
</template>

<script setup>
import FiltrationCom from "./components/filtrationCom";
import SettingFilter from "./components/settingFilter";
import AllocationPlan from "./components/allocationPlan";
import { getList } from "#/system/advancedQuery";
import { inject, reactive } from "vue";
const MenuID = inject("menuID");

const emit = defineEmits("updateHeight", "handleCustomPlan");

const props = defineProps({
  queryConfig: {
    type: Array,
    default: [],
  },
  showModal: {
    type: Boolean,
    default: false,
  },
});

const binSize = computed(() => {
  const windowWidth = document.documentElement.clientWidth;
  let val = (windowWidth - 20 - 20 - 50 - 165) / 520;
  let newVal = Math.floor(val);
  return 520 * newVal;
});

// 我的方案
const chooseRadioVal = ref(null);
const myPlanList = ref([]);
const clickRadio = (item, index) => {
  chooseRadioVal.value = item.BILLNO;
  emit("handleCustomPlan", { type: "1", data: item.BILLNO });
};

// 查询按钮事件

function searchBtn() {
  emit("handleCustomPlan", { type: "2", data: filterArr.value });
}

// 快捷过滤
// const filterSeceletArr = ref(['单据编号','供应商','物料编码'])
const value = ref(null);
const filterConfig = ref({
  // filterSeceletArr: ['单据编号', '供应商', '物料编码'],
  filterSeceletArr: [],
  filterSeceletArr1: ["包含", "等于", "大于"],
});

const filterArr = ref([]);
const defaultFilterArr = ref([]);

watch(
  () => props.queryConfig,
  (value) => {
    filterConfig.value.filterSeceletArr = props.queryConfig.filter(
      (el) => el.ISSHOW != 0
    );
    defaultFilterArr.value = JSON.parse(
      JSON.stringify(filterConfig.value.filterSeceletArr)
    );
    filterArr.value = JSON.parse(JSON.stringify(defaultFilterArr.value));
  },
  { immediate: true }
);

const getPlanList = () => {
  getList(MenuID.value).then((res) => {
    console.log("🚀 ~ getList ~ res:", res);
    myPlanList.value = res.RESULT;
    !chooseRadioVal.value
      ? (chooseRadioVal.value = myPlanList.value[0].BILLNO)
      : "";
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
};
const resetCondition = () => {
  filterArr.value = JSON.parse(JSON.stringify(defaultFilterArr.value));
};
// 删除
const delFilterArr = (index) => {
  filterArr.value.splice(index, 1);
  emit("updateHeight", index);
};

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

  .el-input__suffix-inner > :first-child {
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
