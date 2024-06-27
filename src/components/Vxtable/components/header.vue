<!--
 * @Author: cc2049
 * @Date: 2024-02-20 09:00:04
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-06-27 16:21:20
 * @Description: 简介
-->

<template>
  <div class="custom-head" @contextmenu.prevent="fnResourcesRightClick($event, column)" >

    <span class="custom-head-title" @click.stop="handleSort(column)" :title="column.title">
      {{ column.title || '' }}
      <el-icon :size="20" class="sort-icon" v-if=" column.field == sortCFG.sortBy ">
        <CaretBottom v-if=" sortCFG.sort == 'desc' " />
        <CaretTop v-else />
      </el-icon>
    </span>

    <!-- <div class="dblclick-wrrap" @dblclick="dblclickHeader">

    </div> -->

    <div class="right-menu" v-show="showRightMenu && sortCFG.activeID == column.field" @click.stop.prevent="rightClick(column)" extmenu.stop.prevent>
      <div class="right-menu-item bottom">
        <el-popover placement="right" :width="126">
          <template #reference>
            <div>
              <el-icon :size="16" color="#606875">
                <Icon icon="ic:round-view-column" />
              </el-icon>
              <span>
                列显示隐藏
              </span>
              <el-icon :size="12" color="#606875" class="arrow-icon">
                <ArrowRightBold />
              </el-icon>
            </div>
          </template>
          <vxe-checkbox-group v-model="checkList" class="column-list" @change="checkboxChange" style="display: flex;flex-direction: column;junt-content: flex-start;">
            <vxe-checkbox style="margin-left:0;margin-bottom:10px" :content="itemCol.LABEL" :label="itemCol.FIELD" :key="itemCol.BILLNO" v-for="itemCol in tableCFG.tableColumns" />
          </vxe-checkbox-group>
        </el-popover>

      </div>
      <div class="right-menu-item" @click="fixedEvent(column, 1)">
        <el-icon :size="16" color="#606875">
          <Icon icon="mdi:lock" />
        </el-icon>
        <span>
          冻结列 {{ column.defaultFixed }}
        </span>
      </div>

      <div class="right-menu-item" @click="fixedEvent(column, 0)">
        <el-icon :size="16" color="#606875">
          <Icon icon="mdi:unlocked-variant" />
        </el-icon>
        <span>
          取消冻结列
        </span>
      </div>

    </div>

    <vxe-pulldown ref="pulldownRef" destroy-on-close transfer popup-class-name="custom-pulldown">
      <template #default>
        <div class="filter-icon" @click="openPulldown(column)">
          <el-icon color="#606875" :size="20">
            <Icon icon="material-symbols-light:filter-alt"></Icon>
          </el-icon>
        </div>
      </template>
      <template #dropdown>
        <div class="my-dropdown3">
          <el-input v-model="searchValue" class="mb-10" size="small" placeholder="搜索" @input="searchEvent" />
          <el-scrollbar :height="260">
            <vxe-checkbox-group v-model="checkColList" class="column-list" @change="checkboxColChange" style="display: flex;flex-direction: column;junt-content: flex-start;">
              <vxe-checkbox style="margin-left:0;margin-bottom:10px" content="全选" label="全选" />
              <template v-for="item in colData" :key="item">
                <vxe-checkbox style="margin-left:0;margin-bottom:10px" :label="item">
                  {{ item }}
                </vxe-checkbox>
              </template>
            </vxe-checkbox-group>
          </el-scrollbar>
          <div class="footer">
            <div class="num-wra font-800">
              已选{{ checkColList.length }}项
            </div>
            <div class="footer-btn flex mt-6">
              <el-button type="primary" class="" size="small" @click="colFilterEvent">确定</el-button>
              <el-button size="small" @click="colFilterEvent(1)">清除</el-button>
            </div>
          </div>
        </div>
      </template>
    </vxe-pulldown>
  </div>

</template>

<script setup>
import PinyinMatch from "pinyin-match";
import TextOverflow from "@/components/TextOverflow/index.vue";
import { axiosGet } from "#/common";
import { onMounted } from "vue";

const props = defineProps({
  column: {
    type: Object,
    default: () => {},
  },
  config: {
    type: Object,
    default: () => {},
  },
  tableCFG: {
    type: Object,
    default: () => {},
  },
  tableData: {
    type: Array,
  },
  sortCFG: {},
});

const emit = defineEmits([
  "filterEvent",
  "handleSortEvent",
  "rightClick",
  "setColShowEvent",
]);
const { proxy } = getCurrentInstance();

const checkList = ref([]);
const checkColList = ref([]);

const menuID = inject("menuID");

const handleSort = (column) => {
  emit("handleSortEvent", column);
};

const searchValue = ref("");
const pulldownRef = ref(null);
const colData = ref([]);
const sourceColData = ref([]);

/* 过滤事件 */

function searchEvent() {
  if (searchValue.value == "") return (colData.value = sourceColData.value);
  let newColData = sourceColData.value.filter((item) =>
    PinyinMatch.match(item, searchValue.value)
  );
  colData.value = newColData;
}

function openPulldown(col) {
  let id = col.field;
  try {
    if (props.config.VTYPE == "exNum") {
      let otherArr = JSON.parse(props.config.OTHER);
      colData.value = otherArr.map((i) => {
        return i.LABEL;
      });
    } else {
      colData.value = getColData(id);
    }
    sourceColData.value = JSON.parse(JSON.stringify(colData.value));
  } catch (error) {}

  const $pulldown = pulldownRef.value;
  if ($pulldown) {
    $pulldown.togglePanel();
  }
}

const colFilterEvent = (type) => {
  if (type == 1) {
    return (checkColList.value = []);
  }
  emit("filterEvent", { config: props.config, checkList: checkColList.value });
  const $pulldown = pulldownRef.value;
  if ($pulldown) {
    $pulldown.hidePanel();
  }
};

const getColData = (id) => {
  let newArr = props.tableData.map((i) => {
    return i[id];
  });
  newArr = [...new Set(newArr)];
  return newArr;
};

// 下拉查询事件
const SelectLoading = ref(false);
const SelectValueTo = ref(null);
const SelectFocus = (config) => {};

const router = useRouter();
const MENUID = router.currentRoute.value.meta.BILLNO;

const showRightMenu = ref(false);

/*
        右键点击资源
        event ==> 事件对象
        item  ==> 资源数据
    */
function fnResourcesRightClick(event, item) {
  // 获取top、left 最大允许像素
  let nScreenWidth = document.documentElement.clientWidth - 98;
  let nScreenHeight = document.documentElement.clientHeight - 54;
  // console.log(event, item);
  checkList.value = props.tableCFG.tableColumns
    .filter((el) => el.SELECTEDFLAG == 1)
    .map((i) => i.FIELD);

  showRightMenu.value = true;
  let eventData = {
    type: "openRight",
    column: item,
  };
  emit("rightClick", eventData);
  document.addEventListener("click", () => {
    showRightMenu.value = false;
  });
}

// 推断日期组件类型
const mapDateType = computed((config, isRange = false) => {
  return (config, isRange) => {
    let { SLOTCFG, SUFFIX } = config,
      Ctype = SLOTCFG || SUFFIX,
      type = "",
      format = "";
    switch (Ctype) {
      case "year":
        type = isRange ? "daterange" : "year";
        format = "YYYY";
        break;
      case "month":
        type = isRange ? "monthrange" : "month";
        format = "YYYY-MM";
        break;
      default:
        type = isRange ? "daterange" : "date";
        format = "YYYY-MM-DD";
        break;
    }
    return { type, format };
  };
});

const templateList = ref([]);
const selectTemp = ref("");
function getTemplate() {
  axiosGet("/sys/selectConfig/getList", menuID.value).then((res) => {
    let { TEMPLIST } = res.RESULT;
    templateList.value = TEMPLIST;
    let idArr = TEMPLIST.filter((i) => i.ISDETAULT == 1);
    selectTemp.value = idArr.length ? idArr[0].VALUE : null;
    getColumnsList(res.RESULT);
  });
}

function getColumnsList(data) {
  let { TEMPLIST, ENGNAMESINFO, CHANAMESINFO, CHINASHOWINFO, NOTSHOWINFO } =
    data;
  // 设置已选模板的状态
  let showColIDArr = ENGNAMESINFO?.split(","),
    showColNameArr = CHANAMESINFO?.split(","),
    noShowColIDArr = NOTSHOWINFO ? NOTSHOWINFO?.split(",") : [],
    noShowColNameArr = CHINASHOWINFO?.split(",");

  let newArr = [];
  if (!showColIDArr?.length) return;
  showColIDArr.forEach((item, index) => {
    let newItem = {
      LABEL: showColNameArr[index],
      FIELD: item,
      SELECTEDFLAG: 1,
    };
    newArr.push(newItem);
  });
  if (noShowColIDArr.length) {
    noShowColIDArr.forEach((item, index) => {
      let newItem = {
        LABEL: noShowColNameArr[index],
        FIELD: item,
        SELECTEDFLAG: 0,
      };
      newArr.push(newItem);
    });
  }
  tableColumns.value = newArr;
}

function checkboxChange(e) {
  let data = { id: e.label, isShow: e.value ? "1" : "0" };
  emit("setColShowEvent", data);
}

function checkboxColChange(e) {
  if (e.label == "全选") {
    checkColList.value = e.value ? [...colData.value, "全选"] : [];
  } else {
    if (checkColList.value.length == colData.value.length) {
      checkColList.value.unshift("全选");
    } else if (checkColList.value.includes("全选")) {
      console.log("移除全选");
    }
  }
}

function fixedEvent(e, t) {
  console.log(e, t);
  let data = { id: e.field, isShow: "", isFixed: t ? "left" : "" };
  emit("setColShowEvent", data);
}


function dblclickHeader(){
  console.log(9995);
}

// onMounted(()=>{
//   document.getElementByClassName('vxe-resizable').addEventListener('dblclick',dblclickHeader)
// })

</script>

<style lang="scss" scoped>
.custom-sort {
  color: #c0c4cc;
  cursor: pointer;
  position: relative;
  left: 20px;
}
.custom-sort:hover {
  color: #333;
}
$border-color-jdy: #ceced2;
.custom-head {
  width: 100%;
  display: flex;
  position: relative;
  cursor: pointer;
  text-align: center;
  &-title {
    width: calc(100% - 10px);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    .sort-icon {
      position: absolute;
      color: #333;
    }
  }

  .filter-icon {
    position: absolute;
    top: 2px;
    right: -10px;
    display: none;
  }

  &:hover .filter-icon {
    display: block;
  }
  &:hover .sort-icon {
    color: var(--el-color-primary);
  }

  .right-menu {
    position: fixed;
    z-index: 1000;
    width: 160px;
    height: 100px;
    background-color: #f0f3fa;
    border: 1px solid var(--border-color-jdy);

    .bottom {
      border-bottom: 1px solid var(--border-color-jdy);
    }

    &-item {
      text-align: left;
      display: flex;
      align-items: center;
      padding: 0 10px;
      height: 30px;
      line-height: 30px;
      &:hover {
        background-color: var(--el-color-primary-light-8);
      }
      .el-icon {
        margin-right: 10px;
      }
      .el-icon {
        margin-right: 10px;
      }
      .arrow-icon {
        position: absolute;
        right: 0;
        top: 8px;
      }
    }
  }

  .dblclick-wrrap{
    width: 10px;
    height: 20px;
    background: red;
    position: absolute;
    right: -10px;
    z-index: 10000;
  }
}

.custom-head-title {
  font-size: 12px;
  color: #333;
}

:deep(.vxe-checkbox + .vxe-checkbox) {
  margin-left: none;
}

.custom-pulldown {
  top: 30px;
}

.my-dropdown3 {
  width: 200px;
  padding: 6px;
  border: 1px solid var(--border-color-jdy);
  border-radius: 4px;
  top: 20px;
  .footer-btn {
    .el-button {
      width: 50%;
    }
  }
}
</style>