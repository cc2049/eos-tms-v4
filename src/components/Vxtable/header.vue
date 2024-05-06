<!--
 * @Author: cc2049
 * @Date: 2024-02-20 09:00:04
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-05-06 19:28:20
 * @Description: 简介
-->

<template>
  <div class="custom-head" @contextmenu.prevent="fnResourcesRightClick($event, column)">

    <span class="font-size-12 custom-head-title" @click="handleSort(column)">
      {{ column.title || '' }}
      <el-icon :size="20" class="sort-icon" v-if=" column.field == sortCFG.sortBy ">
        <CaretBottom v-if=" sortCFG.sort == 'desc' " />
        <CaretTop v-else />
      </el-icon>
    </span>

    <div class="right-menu" v-show="showRightMenu && sortCFG.activeID == column.field" @click.stop.prevent="rightClick(column)" extmenu.stop.prevent>
      <div class="right-menu-item bottom">

        <el-popover placement="right" :width="126" trigger="click">
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

          <vxe-checkbox-group v-model="checkList" class="column-list" style="display: flex;flex-direction: column;junt-content: flex-start;">
            <vxe-checkbox style="margin-left:0;margin-bottom:10px" :content="itemCol.LABEL" :label="itemCol.FIELD" :key="itemCol.BILLNO" v-for="itemCol in tableCFG.tableColumns" />
          </vxe-checkbox-group>
        </el-popover>

      </div>
      <div class="right-menu-item">
        <el-icon :size="16" color="#606875">
          <Icon icon="mdi:lock" />
        </el-icon>
        <span>
          冻结列
        </span>
      </div>

      <div class="right-menu-item">
        <el-icon :size="16" color="#606875">
          <Icon icon="mdi:unlocked-variant" />
        </el-icon>
        <span>
          取消冻结列
        </span>
      </div>

    </div>

    <el-popover placement="bottom" :width="config.WIDTH" trigger="click" v-if="config.filterCfg">

      <template #reference>
        <div class="filter-icon" v-if="config.filterCfg">
          <el-icon color="#606875" :size="20">
            <Icon icon="material-symbols-light:filter-alt"></Icon>
          </el-icon>
        </div>
      </template>

      <el-input v-if="config.filterCfg.CONTROLS == 'ExTextBox' " v-model="tableCFG.queryJson[config.FIELD]" @keydown.enter="filterEvent" clearable />
      <!-- 

    <template v-else-if="config.filterCfg.CONTROLS == 'ExSelect'">
      <el-select placeholder=" " v-model="tableCFG.queryJson[config.FIELD]" clearable style="width: 100%" @change="filterEvent">
        <el-option v-for="itemST in tableCFG.queryJson.EnumData[config.FIELD]" :key="itemST.VALUE" :label="itemST.LABEL" :value="itemST.VALUE" />
      </el-select>
    </template>

    <div v-else-if="config.filterCfg.CONTROLS == 'ExSelectSearch'">
      <el-select v-model="tableCFG.queryJson[config.filterCfg.FIELD]" clearable filterable remote remote-show-suffix :remote-method="(val) => SelectQuery(val, config.filterCfg)" :loading="SelectLoading" placeholder=" " @focus="SelectFocus( config.filterCfg )"
        @change="(val) => SelectChange(config.filterCfg, val)" @clear="SelectChange" @keydown.enter="enterNextEl">
        <el-option v-for="itemST in tableCFG.queryJson.EnumData[config.filterCfg.FIELD]" :key="itemST.VALUE" :label="itemST.LABEL" :value="itemST.VALUE" style="max-width:300px" />
      </el-select>
    </div> -->

      <!-- ExSelectGroup 分组选择  -->
      <!-- <template v-else-if="config.filterCfg.CONTROLS == 'ExSelectGroup'">
      <el-tree-select v-model="tableCFG.queryJson[config.filterCfg.FIELD]" clearable filterable remote-show-suffix remote :remote-method="val => SelectQuery(val, config.filterCfg)" :loading="SelectLoading" :data="tableCFG.queryJson.EnumData[config.filterCfg.FIELD]"
        @focus="SelectFocus(config.filterCfg)" @change="(val) => SelectChange(config.filterCfg, val)" @clear="SelectChange(config.filterCfg, null)" style="width: 100%" popper-class="popMaxWidth" :render-after-expand="false" :placeholder="' '"
        :props="{ label: 'LABEL', children: 'CHILDREN' , disabled: 'ISDISABLED', }" value-key="VALUE" highlightCurrent />
    </template> -->

      <!-- ExDateRange 日期区间 -->
      <!-- <el-date-picker v-else-if="config.filterCfg.CONTROLS == 'ExDateRange'" @clear="DateChange(null,config.filterCfg)" @change="(v) => DateChange(v, config.filterCfg)" v-model="tableCFG.queryJson[config.FIELD+'Arr']" unlink-panels clearable :type="mapDateType(config.filterCfg ,true).type"
      range-separator="至" :value-format="mapDateType(config.filterCfg,true).format" style="width: 100%" /> -->

      <!-- ExDateTime 日期时间选择  -->
      <!-- <el-date-picker v-else-if="config.filterCfg.CONTROLS == 'ExDateTime'" v-model="tableCFG.queryJson[config.FIELD]" clearable @clear="DateChange(null,config.filterCfg)" type="datetime" value-format="YYYY-MM-DD HH:mm:ss" style="width: 100%" @change="(v)=>DateChange(v,config.filterCfg)" /> -->

      <!-- ExDateTimeRange 日期时间区间 -->
      <!-- <el-date-picker v-else-if="config.filterCfg.CONTROLS == 'ExDateTimeRange'" @change="(v) => DateChange(v, config.filterCfg)" v-model="tableCFG.queryJson[config.FIELD+'Arr']" clearable @clear="DateChange(null,config.filterCfg)" unlink-panels :prefix-icon="9" type="datetimerange"
      range-separator="至" value-format="YYYY-MM-DD HH:mm:ss" style="width: 100%" /> -->

    </el-popover>

  </div>

</template>

<script setup>
import { inject } from "vue";

import { axiosGet } from "#/common";

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
  sortCFG: {},
});

const emit = defineEmits(["filterEvent", "handleSortEvent", "rightClick"]);
const { proxy } = getCurrentInstance();

const checkList = ref([]);

const menuID = inject("menuID");

const filterEvent = () => {
  emit("filterEvent");
};

const handleSort = (column) => {
  emit("handleSortEvent", column);
};

// 下拉查询事件
const SelectLoading = ref(false);
const SelectValueTo = ref(null);
const SelectFocus = (config) => {
  SelectQuery("", config);
};

const router = useRouter();
const MENUID = router.currentRoute.value.meta.BILLNO;

const SelectQuery = (keyword = undefined, config) => {
  if (keyword == undefined) return;
  let { FIELD, DEFAULTVAL, CONTROLS, OTHER } = config;
  if (OTHER == "") return;
  let { url, data } = ParseOtherConfig(OTHER);
  if (url == "") return;
  SelectLoading.value = true;
  proxy
    .request({
      url: url,
      method: "post",
      data: {
        KEYWORD: keyword,
        MODULEID: MENUID,
        ...data,
      },
      headers: {
        repeatSubmit: false,
      },
    })
    .then(({ RESULT }) => {
      props.tableCFG.queryJson.EnumData[FIELD] = RESULT;
    })
    .catch(() => {
      props.tableCFG.queryJson.EnumData[FIELD] = [];
    })
    .finally(() => {
      SelectLoading.value = false;
    });
};

const SelectChange = () => {
  filterEvent();
};

// 解析 Other 配置
function ParseOtherConfig(config) {
  if (!config) {
    SelectValueTo.value = [];
    return { url: "", data: {}, importantData: {} };
  }
  try {
    let newConfig = JSON.parse(config)[0];
    if (newConfig.setvalue && JSON.stringify(newConfig.setvalue) != "{}") {
      let arr = [];
      for (const key in newConfig.setvalue) {
        arr.push({ k: key, v: newConfig.setvalue[key] });
      }
      SelectValueTo.value = arr;
    }
    return {
      url: newConfig.url,
      data: newConfig?.params,
      importantData: newConfig?.importantData,
    };
  } catch (error) {
    if (config.indexOf("/") == "0") {
      let paramsArr = config.split("?"),
        url = "",
        setQueryParam = {},
        queryJson = {},
        setImportantParam = {},
        importantData = {};
      if (paramsArr.length == 0) {
        url = config;
        SelectValueTo.value = [];
      } else if (paramsArr.length > 0) {
        url = paramsArr[0];
        if (paramsArr.length > 1) {
          let { obj, importantObj } = GetUrlParams("a?" + paramsArr[1], "obj");
          queryJson = obj;
          importantData = importantObj;
        }
        if (paramsArr.length > 2) {
          let { obj, importantObj } = GetUrlParams("a?" + paramsArr[2], "obj");
          setQueryParam = obj;
          setImportantParam = importantObj;
          queryJson = { ...queryJson, ...ConvertData(setQueryParam) };
          importantData = {
            ...importantData,
            ...ConvertData(setImportantParam),
          };
        }
        paramsArr[3]
          ? (SelectValueTo.value = GetUrlParams("a?" + paramsArr[3], "arr"))
          : [];
      }
      return { url, data: queryJson, importantData };
    } else {
      console.error("配置解析错误!", error);
    }
  }
}

// 获取url 后面的参数
function GetUrlParams(url, backType) {
  let reg = /([^&?=]+)=([^&?=]+)/g,
    obj = {},
    importantObj = {},
    arr = [];
  url.replace(reg, function () {
    if (arguments[1].includes("!")) {
      let key = arguments[1].substr(1); //删除第一个字符
      importantObj[key] = arguments[2];
    } else {
      obj[arguments[1]] = arguments[2];
    }
    let objs = {};
    objs.k = arguments[1];
    objs.v = arguments[2];
    arr.push(objs);
  });
  return backType == "obj" ? { obj, importantObj } : arr;
}

/** 转换数据 */
function ConvertData(obj) {
  let data = {};
  for (let ii in obj) {
    let valueKey = obj[ii];
    if (valueKey.includes("M$")) {
      valueKey = calcHasMSKey(valueKey);
      data[ii] = props.mainFormData[valueKey] || "";
    } else if (valueKey.includes("S$")) {
      valueKey = calcHasMSKey(valueKey);
      data[ii] = props.formData[valueKey] || "";
    } else {
      data[ii] = props.formData[valueKey] || "";
    }
  }
  return data;
}

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

  console.log(checkList.value);

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
</script>

<style lang="scss">
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
}

.font-size-12 {
  font-size: 12px;
  color: #333;
}

:deep(.vxe-checkbox+.vxe-checkbox) {
 margin-left: none;
}
</style>