<template>
  <div class="val_table bg-white">

    <vxe-table :key="tableKey" class="mytable-scrollbar mytable-footer" resizable round auto-resize show-overflow="title" ref="xTable" size="mini" highlight-hover-row width="100%" :show-footer="tableCFG.mergeCFG && tableCFG.mergeCFG.length" border :loading="tableCFG.loading" :cell-class-name="cellClassName"
      :height="tableCFG.height" :scroll-y="{enabled: true, gt: 0}" :column-config="{ isCurrent: false, isHover: true }" :row-config="{
        isCurrent: true,
        isHover: true,
        height:  34 ,
      }" :data="tableData" :mouse-config="{selected: true}" :span-method="mergeRowMethod" :checkbox-config="{highlight: true}" :sort-config="{ showIcon: false }" :footer-method="footerMethod" :row-class-name="rowClassName" :tree-config="tableCFG.treeID" footer-row-class-name="footerRowClassName"
      footer-cell-class-name="footerCellClassName" @toggle-row-expand="toggleExpandChangeEvent" @sort-change="sortChange" @radio-change="radioChangeEvent" @checkbox-change="checkboxChange" @checkbox-all="checkboxChange" @custom="toolbarCustomEvent" @cell-click="rowClick"
      @resizable-change="resizableChange" @cell-dblclick="
        (e) => {
          openDetail(e.row);
        }
      ">

      <template v-for="(config, indexC) in tableCFG.tableColumns" :key="indexC">

        <template v-if="config.VTYPE == 'seq'">
          <vxe-column field="name" title=" " width="40" type="seq" align="center" fixed="left">
          </vxe-column>
        </template>

        <template v-else-if="config.VTYPE == 'radio'">
          <vxe-column type="radio" align="center" width="40" fixed="left"></vxe-column>
        </template>

        <template v-else-if="config.VTYPE == 'checkbox'">
          <vxe-column type="checkbox" align="center" width="40" fixed="left"></vxe-column>
        </template>

        <template v-else>
          <vxe-column :field="config.FIELD" :align="config.ALIGN" :width="setColWidth(config)" :title=" setColTitle(config)  " :fixed="config.ISFIXED=='left'?'left':null" :height="30" :resizable="true" :key="i" :tree-node=" tableCFG.treeID?.treenodeId == config.FIELD "
            :visible="setTableColShow(config)" :sortable="config.ISSORT == 1">
            <template #header="{ column }">
              <Header :column="column" :config="config" :tableData="sourceTableData" :sortCFG :tableCFG="tableCFG" @filterEvent="filterEvent" @handleSortEvent="headerCellClickEvent" @rightClick="rightClickEvent" @setColShowEvent="setColShowEvent" />
            </template>
            <template #default="{ row }">
              <Content :config :row @openLink="openLink" />
            </template>
          </vxe-column>
        </template>

      </template>

      <vxe-column title="操作" :width="actionBarWidth" fixed="right" v-if="actionBar">
        <template #default="{ row, rowIndex }">
          <slot name="actionBar" :rowIndex="rowIndex" :row="row"></slot>
        </template>
      </vxe-column>

      <template #empty>
        <el-empty :image="emptyImg" description="很抱歉，暂时没有相关数据~" :image-size="150" />
      </template>
    </vxe-table>

    <!-- 弹窗 -->
    <template>
      <vxe-modal destroy-on-close v-model="modalConfig.open" :width="modalConfig.width" :height="modalConfig.height" id="formModal" resize storage transfer show-zoom show-footer>
        <template #title>
          <span> {{ modalConfig.title }} </span>
        </template>
        <template #default>
          <!-- <FileUploadList v-if="modalConfig.type == 'Filelist'" v-model="FileRow[FileConfig.FIELD]" :filelist="FileRow[FileConfig.FIELD + 'Arr']" @change="(val) => setUploadFile(val, FileRow, FileConfig)" :detail="FileConfig.ISEDIT == '1' || FileConfig.EDITTABLE == 1" /> -->
        </template>
        <template #footer>
          <el-button v-if="modalConfig.type == 'Modal'" type="primary" size="default" @click="modalSubmit">保存</el-button>
        </template>
      </vxe-modal>
    </template>

    <!-- 生成二维码 -->
    <template>
      <vxe-modal destroy-on-close v-model="qrcodrOpen" :width="400" :height="450" id="formModalcode" resize storage transfer show-zoom show-footer>
        <template #title>
          <!-- <span> 二维码 </span> -->
          <span> {{ qrcodeData.COMPANYNAME }} </span>
        </template>
        <template #default>

          <div class="text-blod text-ll mb5">{{ qrcodeData.LINENAME }}</div>
          <div class="disflex">
            <div class="redDot"></div>
            <div class="">{{ qrcodeData.SENDCOMPANY }}</div>
          </div>
          <div class="disflex mb10">
            <div class="greenDot"></div>
            <div class="">{{ qrcodeData.RECVCOMPANY }}</div>
          </div>
          <el-tag v-if="qrcodeData.CARTYPEREQUIE">{{ qrcodeData.CARTYPEREQUIE }}</el-tag>
          <el-tag class="mr5 ml5" v-if="qrcodeData.MATERIALNAME">{{qrcodeData.MATERIALNAME}}</el-tag>
          <!-- <el-tag>{{qrcodeData.NORIGTAXPRICE}}吨</el-tag> -->

          <div class="qrcode-wrap mt10">
            <qrcode-vue id="canvasDom" :value="qrcodeText" :margin="1" :size="200" :foreground=" '#000000' " level="H" />
          </div>
          <div class="text-c mt10">
            APP扫码，快速接单
          </div>
          <div>

          </div>
        </template>
        <template #footer>
          <el-button @click="downLoadQRcode">保存二维码</el-button>
        </template>
      </vxe-modal>
    </template>

    <!-- <vxe-modal destroy-on-close v-model="gradeModal" :width="modalConfig.width" :height="modalConfig.height" id="formModal" resize storage transfer show-zoom>
      <template #title>
        商务评分细则
      </template>
      <template #default>
        <Invitation :currentData="gradeModalRowData" @close="gradeModal = false" />
      </template>
    </vxe-modal> -->
  </div>
</template>

<script>
export default {
  inheritAttrs: false,
};
</script>
<script setup name="">
import Sortable from "sortablejs";
import { selectDictLabel } from "@/utils/ruoyi";
import {
  dict2name,
  setSuffix,
  getUrlParams,
  toThousands,
  evalFun,
} from "@/utils";
import useSettingsStore from "@/store/modules/settings";
import VueQr from "vue-qr/src/packages/vue-qr.vue";

import Header from "./components/header.vue";
import Content from "./components/content.vue";

import { axiosSave } from "@/api/system/page";

const key17Status = inject("key17Status");

const { proxy } = getCurrentInstance();
const settingsStore = useSettingsStore();
const storeSettings = computed(() => settingsStore);

const nameOptions = ref([{ data: null }]);

const qrcodrOpen = ref(false);

const rowHeight = ref(40);

const selectRow = ref();
const selectColumn = ref();
const cellClassName = ({ row, column }) => {
  // if (row === selectRow.value && column === selectColumn.value) {
  //   return "cell-active";
  // }
  // const hasCellClass = proxy.tableCFG.tableColumns.filter(el => el.FIELD == column.field && el.SLOT && el.SLOT == 'cellBg')
  // if (hasCellClass.length == 0) return ""
  // let DATA = row
  // if (DATA && eval(hasCellClass[0].SLOTCFG)) return "cell-red"
  return null;
};

const emit = defineEmits([
  "dragRow",
  "queryEvent",
  "resetConfig",
  "filterNameEvent",
]);
const props = defineProps({
  // 配置
  tableCFG: {
    type: Object,
    default: undefined,
  },
  // 数据
  tableData: {
    type: Array,
    default: [],
  },
  // 表格的原数据
  sourceTableData: {
    type: Array,
    default: [],
  },
  validRules: {
    typeo: Object,
    default: {},
  },
  // 当前的值
  value: [Number, String, Array],
  // 操作栏是否展示
  actionBar: {
    type: Boolean,
    default: false,
  },
  // 操作栏宽度
  actionBarWidth: {
    type: Number,
    default: 150,
  },
  // 合计总数据数
  totalData: {
    type: Object,
  },
  // 列表风格
  tableStyle: {
    type: Number,
    default: 0,
  },
  showMoreQuery: {
    type: Boolean,
    default: false,
  },
  tableToolsBTN: {
    type: Array,
    default: [],
  },
  // 是否展示表头筛选
  isHeaderFilter: {
    type: Boolean,
    default: false,
  },

  // queryJson: {
  //   type: Object,
  //   default: {},
  // },
});
const gradeModal = ref(false);
const gradeModalRowData = ref("");
const clickGrade = (row, config) => {
  gradeModal.value = true;
  gradeModalRowData.value = row;
};

const xTable = ref(null);
const tableKey = ref(Math.random());

const emptyImg = proxy.getAssetsFile("icon_task_NoData.png");

const settimgProgress = computed((config) => {
  return (config) => {
    try {
      let { OTHER } = config;
      if (!OTHER)
        return {
          height: 8,
          colors: [
            { color: "#f56c6c", percentage: 20 },
            { color: "#e6a23c", percentage: 40 },
            { color: "#5cb87a", percentage: 60 },
            { color: "#1989fa", percentage: 80 },
            { color: "#6f7ad3", percentage: 100 },
          ],
        };
      let { height, colors } = JSON.parse(OTHER);
      return { height, colors };
    } catch (error) {
      console.error("进度条修改失败");
    }
  };
});
const setStatusNodes = computed((config, val) => {
  return (config, val) => {
    try {
      let arr = JSON.parse(config);
      let newArr = arr.filter((ele) => ele.VALUE == val);
      if (newArr.length > 0) {
        let color =
          newArr[0].COLOR == "info"
            ? "#909399"
            : newArr[0].COLOR == "primary"
            ? "#409EFF"
            : newArr[0].COLOR == "success"
            ? "#67C23A"
            : newArr[0].COLOR == "danger"
            ? "#F56C6C"
            : "#E6A23C";
        let LABEL = newArr[0].LABEL;
        let VALUE = newArr[0].VALUE;
        return { color, LABEL, VALUE };
      } else {
        return { color: "#909399", LABEL: "暂无数据", VALUE: null };
      }
    } catch (error) {
      console.error("状态节点修改失败");
    }
  };
});

const setTableColShow = computed((config) => {
  return (config) => {
    if (props.tableStyle == 1) {
      return config.LINESTYLE ? true : false;
    } else {
      return config.SELECTEDFLAG == 0 ? false : true;
    }
  };
});

const sortCFG = reactive({
  sortBy: "",
  sort: "",
  activeID: "",
});

function refreshColumn() {
  tableKey.value = Math.random()
}
// 刷新表格数据
function reloadTableData(data) {
  proxy.$refs.xTable.loadData(data);
}

const setActionWidth = computed(() => {
  return () => {
    let width = 0;
    props.tableToolsBTN.forEach((i) => {
      if (i.VNAME.length < 3) {
        width += 70;
      } else {
        width += 100;
      }
    });
    return width;
  };
});

// 线性表格的相关配置
const setColTitle = computed((config) => {
  return (config) => {
    try {
      if (props.tableStyle == 1) {
        let html = config.LINESTYLE;
        let obgJson = JSON.parse(html);
        if (!html) return config.LABEL;
        return obgJson.title || config.LABEL;
      }
      return config.LABEL;
    } catch (error) {
      return config.LABEL;
    }
  };
});

const setColWidth = computed((config) => {
  return (config) => {
    try {
      // if (props.tableStyle == 1) {
      //   let html = config.LINESTYLE;
      //   let obgJson = JSON.parse(html);
      //   if (!html) return obgJson.width;
      //   return obgJson.width || config.WIDTH;
      // }
      if (props.tableCFG.autoWidth == 1) {
        return "";
      }
      return config.WIDTH;
    } catch (error) {
      return config.WIDTH;
    }
  };
});

const linkEvent = (data, row) => {
  if (!data.isLink) return null;
  let giveParentData = {
    clicktype: "openLink",
    linkCFG: data.isLink,
    data: row,
    getBtn: "1",
  };
  proxy.$emit("change", giveParentData);
};

// tableStyle>0? rowHeight : 42
const resetRowHeight = computed(() => {
  return () => {
    try {
      if (props.tableStyle == 1) {
        let hasLineStyle = props.tableCFG.tableColumns.filter(
          (i) => i.LINESTYLE
        );
        let maxRow = 1,
          height = 42;
        hasLineStyle.forEach((i) => {
          let Item = JSON.parse(i.LINESTYLE);
          if (Item.maxRow && Item.maxRow > maxRow * 1) {
            maxRow = Item.maxRow;
          }
        });
        return maxRow > 1 ? maxRow * 30 : height;
      }
      return 42;
    } catch (error) {
      return 42;
    }
  };
});

// 设置是否显示按钮
const setShowBtn = computed((btn, row) => {
  return (btn, row) => {
    if (btn.ISSHOW == 0) return false;
    if (btn.ISSHOW == 1) return true;
    if (btn.ISSHOW == 2 && btn.OTHER) {
      try {
        return evalFun(row, btn.OTHER) || false;
      } catch (error) {
        console.error("setShowBtn", error);
      }
      return true;
    } else {
      return false;
    }
  };
});

// 操作栏按钮
const getButtonStatus = (item, row) => {
  let { SCRNCONDITION } = item;
  if (SCRNCONDITION && evalFun(row, SCRNCONDITION)) {
    return true;
  }
  return false;
};

// 列表中的操作按钮
function handelEvent(btn, row) {
  if (btn.VTYPE == 28) {
    return openQrCode(btn, row);
  }
  let giveParentData = {
    clicktype: "clinkBTN",
    linkCFG: btn,
    data: row,
  };
  proxy.$emit("change", giveParentData);
}

// 生成二维码
const qrcodeText = ref(null);
const qrcodeData = ref({});
function openQrCode(btn, row) {
  let saveData = {
    BILLNO: row.BILLNO,
    MODULEID: "11",
    PAGEID: btn.ACTION,
  };
  axiosSave(btn.ACTIONADDRESS, saveData).then((res) => {
    let { DATA, ISTIMSE, TIMSE } = res.RESULT;
    qrcodeText.value = DATA;
    qrcodrOpen.value = true;
    qrcodeData.value = res.RESULT;
  });
}

const downLoadQRcode = () => {
  const canvas = document.getElementById("canvasDom");
  const url = canvas.toDataURL("image/png"); // 通过 toDataURL 返回一个包含图片展示的 data URI
  const aDom = document.createElement("a");
  aDom.download = "二维码"; // 设置下载的文件名
  aDom.href = url;
  document.body.appendChild(aDom);
  aDom.click();
  aDom.remove();
};

function rowClassName({ row }) {
  let DATA = row;
  if (
    DATA &&
    proxy.tableCFG.rowClassEval &&
    eval(proxy.tableCFG.rowClassEval)
  ) {
    return "row-red";
  }
  return null;
}

// 表格单选按钮
function radioChangeEvent({ row, rowIndex }) {
  let giveParentData = {
    clicktype: "radio",
    data: [row],
    checked: true,
    rowIndex,
  };
  proxy.$emit("change", giveParentData);
}

// 处理枚举数据转换的校验
function setArrToDictLabel(Arr, value) {
  try {
    if (!value) return "";
    let newArr = JSON.parse(Arr);
    value = String(value);
    if (value.includes(",")) {
      let a = [],
        valueArr = value.split(",");
      valueArr.forEach((i) => {
        a.push(selectDictLabel(newArr, i));
      });
      return a.join(",");
    } else {
      return selectDictLabel(newArr, value);
    }
  } catch (error) {
    return "";
  }
}

function checkboxChange({ checked, row, rowIndex }) {
  let checkboxCFG = props.tableCFG.tableColumns.filter((i) => {
    return i.VTYPE == "checkbox";
  })[0];
  let selectRecords = proxy.$refs.xTable.getCheckboxRecords();
  let giveParentData = {
    clicktype: "checkbox",
    data: selectRecords,
    checked,
    rowIndex,
    row,
  };

  proxy.$emit("change", giveParentData);
  if (checked && selectRecords.length && checkboxCFG && checkboxCFG.OTHER) {
    // 判断是否进行关联自动选中
    let autoSelectID = checkboxCFG.OTHER,
      autoSelectVal = selectRecords[0][autoSelectID];
    let autoSelectArr = this.tableData.filter((i) => {
      return i[autoSelectID] == autoSelectVal;
    });
    proxy.$refs.xTable.setCheckboxRow(autoSelectArr, true);
  }

  if (
    checked &&
    selectRecords.length != 1 &&
    checkboxCFG &&
    checkboxCFG.scrnCondition
  ) {
    if (eval(checkboxCFG.scrnCondition)) {
      proxy.$refs.xTable.setCheckboxRow(row, false);
      ElMessage({
        message: "该单据不可与其它单据一起执行业务",
        type: "warning",
      });
      return;
    }
  }
}

// 表尾的合计数据显示功能
function footerMethod({ columns }) {
  const footerData = [
    columns.map((column, _columnIndex) => {
      if (_columnIndex === 0) {
        return "合计";
      }
      if (props.tableCFG.mergeCFG.includes(column.field)) {
        try {
          return props.totalData[column.field];
        } catch (er) {
          return "";
        }
      }
      return null;
    }),
  ];
  return footerData;
}

// 打开列控制
function openDrawer() {
  let giveParentData = {
    clicktype: "openDrawer",
    data: {},
  };
  proxy.$emit("change", giveParentData);
}

const resizableCol = ref(null);

function resizableChange(e) {
  let col = {
    field: e.column.field,
    width: e.resizeWidth,
  };
  if (!resizableCol.value) {
    resizableCol.value = col;
  }
  if (col.field == resizableCol.value.field) {
    setColData(col.field);
  } else {
    resizableCol.value = col;
  }
  // console.log("拖拽事件宽度", e.resizeWidth);
}

/* 修改表格的配置， 双击列的中间线时
 * type 1 修改指定的某一列   2 全局替换
 * index  列的配置所在下标
 * data  替换后的值
 *
 */

const setColData = (id) => {
  let findIndex = props.tableCFG.tableColumns.findIndex((i) => i.FIELD == id);
  let colItem = props.tableCFG.tableColumns[findIndex];
  // console.log("99", colItem );
  if(colItem.VTYPE =='exNum' || colItem.VNAME.includes('日期')){
      return ;
  }
  let newArr = props.tableData.map((i) => {
    return i[id] ? String(i[id]).length : 0;
  });
  const max = Math.max(...newArr);
  colItem.WIDTH = max * 13 + 8 + "";
  const resetColConfg = {
    type: 1,
    index: findIndex,
    data: colItem,
  };
  emit("resetConfig", resetColConfg);
};

const rowClickIndex = ref(null);
function rowClick({ row, column, triggerCheckbox, rowIndex }) {
  selectRow.value = row;
  selectColumn.value = column;
  if (props.tableCFG.treeID?.transform) {
    return;
  }
  if (proxy.tableCFG.SelectType == "radio") return;
  let selectRecords = proxy.$refs.xTable.getCheckboxRecords(),
    checked = false;
  if (selectRecords.length == 0) {
    rowClickIndex.value = null;
  }
  if (!triggerCheckbox) {
    !key17Status || !key17Status.value
      ? proxy.$refs.xTable?.clearCheckboxRow()
      : null;
    if (rowClickIndex.value != rowIndex) {
      rowClickIndex.value = rowIndex;
      checked = true;
      proxy.$refs.xTable.toggleCheckboxRow(row);
    }
    let giveParentData = {
      clicktype: "checkbox",
      data: checked ? proxy.$refs.xTable.getCheckboxRecords() : [],
      checked: checked,
      rowIndex,
    };

    // 判断当前展开的是否是选中的数据，否则关闭所有展开
    let expandRow = proxy.$refs.xTable.getRowExpandRecords();
    if (expandRow.length) {
      if (expandRow[0].BILLNO != row.BILLNO) {
        proxy.$refs.xTable.clearRowExpand();
      }
    }
    proxy.$emit("change", giveParentData);
  }
}
// 点击超链接事件
function openLink(data) {
  const { cf, row } = data;
  if (cf.OTHER) {
    let giveParentData = {
      clicktype: "openLink",
      linkCFG: cf.VTYPE == "exNumLink" ? cf.REVERFIELD : cf.OTHER,
      data: row,
    };
    proxy.$emit("change", giveParentData);
  } else {
    openDetail(row);
  }
}

function toolbarCustomEvent() {
  return false;
}

function openDetail(row) {
  proxy.$emit("dbClick", row);
}

let expandBillNo = null;
function toggleExpandChangeEvent({ expanded, row, columnIndex }) {
  let expandCFG = {};
  if (!expandBillNo) {
    proxy.$refs.xTable.toggleRowExpand();
  } else if (expandBillNo == row.BILLNO) {
    proxy.$refs.xTable.toggleRowExpand();
  } else {
    proxy.$refs.xTable.clearRowExpand(row);
    proxy.$refs.xTable.setRowExpand([row], true);
  }
  expandBillNo = row.BILLNO;
  let giveParentData = {
    clicktype: "expand",
    data: { expanded, ...row },
    expandCFG: expandCFG,
  };
  proxy.$emit("change", giveParentData);
}

// 服务端排序
function sortChange({ property, order }) {
  let giveParentData = {
    clicktype: "sort",
    data: { sortBy: property, sort: order },
  };
  if (order != null) {
    proxy.$emit("change", giveParentData);
    proxy.$emit("sort", row);
  }
}

// 获取枚举的图标
function getNumIcon(url) {
  return proxy.getAssetsFile(url);
}

// 自定义服务端排序
function headerCellClickEvent(column) {
  if (
    column.type == "seq" ||
    column.type == "checkbox" ||
    column.type == "seq"
  ) {
    return;
  }

  let property = column.field,
    order = "asc";
  if (sortCFG.sortBy && sortCFG.sortBy == column.field) {
    sortCFG.sort = sortCFG.sort == "asc" ? "desc" : "asc";
  } else {
    sortCFG.sortBy = property;
    sortCFG.sort = "asc";
  }
  let giveParentData = {
    clicktype: "sort",
    data: { sortBy: sortCFG.sortBy, sort: sortCFG.sort },
  };
  if (order != null) {
    proxy.$emit("change", giveParentData);
  }
}

// 表头的右键

function rightClickEvent(data) {
  if (data.type == "openRight") {
    sortCFG.activeID = data.column.field;
  }
}

/*
 * 表头右键事件
 */
function setColShowEvent(data) {
  let index = props.tableCFG.tableColumns.findIndex((i) => i.FIELD == data.id);
  if (data.isShow) {
    props.tableCFG.tableColumns[index].SELECTEDFLAG = data.isShow;
  } else {
    props.tableCFG.tableColumns[index].ISFIXED = data.isFixed;
  }
}

// 支持列头筛选的查询条件 ID

const inputCtrl = ref("ExTextBox,ExSelectGroup,ExSelectMutiple,");
const selectCtrl = ref("ExSelect");
const searchCtrl = ref("ExSelectSearch");
const DateCtrl = ref("ExDate,ExDateTime,ExTime");

/*
 * type 1 本地的过滤   2 输入框关键字的查询
 * config  列的配置
 * keyword  输入框的关键字
 * checkList 选中的下拉框中的数组
 */
const filterEvent = (data) => {
  proxy.$emit("filterNameEvent", data);
};

// 时间确认事件
function DateChange(val, config) {
  let { FIELD, CONTROLS, LINKAGE } = config;
  if (CONTROLS == "ExDateRange" || CONTROLS == "ExDateTimeRange") {
    props.tableCFG.queryJson[FIELD] = !val ? "" : val.join(",");
  } else {
    props.tableCFG.queryJson[FIELD] = !val ? "" : val;
  }
  if (LINKAGE) {
    cleanEvent(config);
    if (CONTROLS == "ExDate") DateCalc(config);
  }
  filterEvent();
}

function mergeRowMethod({ row, _rowIndex, column, visibleData }) {
  const fields = props.tableCFG.mergeRowField || [];
  const cellValue = row[column.field];

  // 分组的合并 父级节点合并
  if (props.tableCFG.treeID) {
    let colspanNum = props.tableCFG.tableColumns.length - 3;
    if (row.PARENTID == 0 && props.tableCFG.treeID.treenodeId == column.field) {
      return { rowspan: 1, colspan: colspanNum };
    }
  }

  if (cellValue && fields.includes(column.field)) {
    const prevRow = visibleData[_rowIndex - 1];
    let nextRow = visibleData[_rowIndex + 1];
    if (prevRow && prevRow[column.field] === cellValue) {
      return { rowspan: 0, colspan: 0 };
    } else {
      let countRowspan = 1;
      while (nextRow && nextRow[column.field] === cellValue) {
        nextRow = visibleData[++countRowspan + _rowIndex];
      }
      if (countRowspan > 1) {
        return { rowspan: countRowspan, colspan: 1 };
      }
    }
  }
}

function clearCheckRow() {
  proxy.$refs.xTable?.clearCheckboxRow();
  proxy.$refs.xTable?.clearRadioRow(); // 清除点选选中效果
}

// 拼接单元格时字体颜色的提取
const htmlColor = (val, cf) => {
  if (!cf || !val) return "";
  let objColor = cf.includes("=") ? getUrlParams("?" + cf)[val] : cf;
  return objColor;
};

// 拼接单元格时字体枚举的提取
const htmlDictName = (val, id) => {
  let otherParams = props.tableCFG.allColumns.filter((i) => {
    return i.FIELD == id;
  });
  val = otherParams.length ? setArrToDictLabel(otherParams[0].OTHER, val) : "";
  return val;
};
// 拼接的字典颜色
const htmlDictColor = (val, id) => {
  if (!val) return "";
  let otherParams = props.tableCFG.allColumns.filter((i) => {
    return i.FIELD == id;
  });
  try {
    let dictConifg = JSON.parse(otherParams[0].OTHER);
    let color = dictConifg.filter((i) => i.VALUE == val)[0].COLOR;
    return color;
  } catch (error) {
    return "";
  }
};

//
const openLinkByHtml = (row, bid) => {
  let cf = { OTHER: bid, VTYPE: "", REVERFIELD: "" };
  openLink(cf, row);
};
// 单元格拼接方法
const formatHTML = (row, config) => {
  let html = config.OTHER;
  try {
    let obgArr = JSON.parse(html);
    return obgArr;
  } catch (error) {
    return [];
  }
};

// 线性表格
const lineStyleCFG = (config) => {
  let html = config.LINESTYLE;
  if (!html) return [];
  try {
    let obgArr = JSON.parse(html);
    return obgArr;
  } catch (error) {
    console.error("lineStyleCFG异常", error);
    return [];
  }
};

// 提前富文本的文字
function getSimpleText(html) {
  var re1 = new RegExp("<.+?>", "g"); //匹配html标签的正则表达式，"g"是搜索匹配多个符合的内容
  var msg = html ? html.replace(re1, "") : ""; //执行替换成空字符
  return msg;
}

// 提取线性表格的 value
function resetCellVal(row, config) {
  try {
    const { id, color } = config;

    if (!id.includes(",") && !id.includes("#")) {
      let newID = id.includes("$") ? id.replace("$", "") : id;
      return {
        name: row[newID],
        color: color,
      };
    }

    let newarr = id.split(","),
      newStr = "",
      colors = "";
    newarr.forEach((item) => {
      if (item.includes("$")) {
        //拼接变量
        let fileid = item.replace("$", "");
        newStr = newStr.concat(row[fileid]);
      } else if (item.includes("#")) {
        //拼接字典
        let fileid = item.replace("#", "");
        let arr = props.tableCFG.allColumns.filter(
          (ele) => ele.FIELD == fileid
        );
        if (arr.length == 0 || !arr[0].OTHER) return;

        if (row[fileid]) {
          let newOther = JSON.parse(arr[0].OTHER);
          newStr = newStr.concat(DictLabels(newOther, row[fileid]));
        }
        colors = dict2name(arr[0].OTHER, row[fileid]).color || "";
      } else {
        newStr = newStr.concat(item);
      }
    });
    return {
      name: newStr,
      color: colors,
    };
  } catch (error) {
    console.error("resetCellVal异常", error);
  }
}

// 多个字典拼接
const DictLabels = (arr, data, jg = ",", label = "LABEL", value = "VALUE") => {
  arr = arr == undefined ? [] : arr;
  return proxy.selectDictLabels(arr, data, jg, label, value);
};

// 弹窗
const modalRef = ref(null);
const modalConfig = reactive({
  type: "",
  open: false,
  title: "",
  MENUID: "",
  PAGEID: "",
  width: "90%",
  height: "90%",
});
const FileRow = ref({});
const FileConfig = ref({});
const handleFileList = (row, config) => {
  FileRow.value = row;
  FileConfig.value = config;
  let { FIELD, LABEL } = config;
  modalConfig.type = "Filelist";
  modalConfig.title = LABEL;
  modalConfig.width = "40%";
  modalConfig.height = "50%";
  modalConfig.open = true;
};

// 重新计算
const resetSUM = (arr) => {
  if (arr.length == 0) return;
  for (let i = 0; i < arr.length; i++) {
    const el = arr[i];
    numberBlur(el, props.tableData[0]);
  }
};
function calcNUM(row, equ) {
  try {
    const Data = row;
    return evilFn(Data, equ);
  } catch (err) {
    console.warn("Err:运算错误", err);
  }
}
// 级联计算
const numberBlur = (config, row) => {
  let { FIELD, LINKAGE } = config,
    point = 2;
  if (!LINKAGE) return;
  // 小数点控制
  if (LINKAGE.includes("POINT")) {
    try {
      let Linkage = JSON.parse(LINKAGE);
      point = Linkage.POINT;
      row[FIELD] = row[FIELD].toFixed(point) * 1;
    } catch (err) {
      console.error("Error:POINT解析", err);
    }
  }
  // 计算
  if (LINKAGE.includes("CALC")) {
    try {
      let Linkage = JSON.parse(LINKAGE),
        calcArr = Linkage.CALC.split("&");
      for (let i = 0; i < calcArr.length; i++) {
        const el = calcArr[i].split("=");
        let [equ, res] = el;
        if (el.length) {
          let num = calcNUM(row, equ);
          if (res.includes("M$")) {
            emit("change", {
              [res.slice(2, res.length)]:
                Math.round(num * 10 ** point) / 10 ** point,
            });
          } else {
            row[res] = Math.round(num * 10 ** point) / 10 ** point;
          }
        }
      }
    } catch (err) {
      console.error("Error:CALC解析", err);
    }
  }
  // 统计
  if (LINKAGE.includes("SUM")) {
    try {
      let Linkage = JSON.parse(LINKAGE),
        sumArr = Linkage.SUM.split("="),
        [equ, res] = sumArr;
      if (sumArr.length) {
        let num = 0;
        for (let i = 0; i < props.tableData.length; i++) {
          const el = props.tableData[i];
          num += el[equ];
        }
        if (res.includes("M$")) {
          emit("change", {
            type: "SUM",
            data: {
              [res.slice(2, res.length)]:
                Math.round(num * 10 ** point) / 10 ** point,
            },
          });
        } else {
          row[res] = Math.round(num * 10 ** point) / 10 ** point;
        }
      }
    } catch (err) {
      console.error("Error:SUM解析", err);
    }
  }
};


const router = useRouter();
const MENUID = router.currentRoute.value.meta.BILLNO;

/** 获取附件数量 */
const getFileLength = computed((row, FIELD) => {
  return (row, FIELD) => {
    return row[FIELD] ? row[FIELD].split(",").length : 0;
  };
});

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

let initTime;
nextTick(() => {
  // 加载完成之后在绑定拖动事件
  // initTime = setTimeout(() => {
  // }, 300);
});
// onUnmounted(() => {
//   clearTimeout(initTime);
//   if (sortable1) {
//     sortable1.destroy();
//   }
// });

// 页面离开后
onDeactivated(() => {
  clearCheckRow();
});

// 页面进入后
onActivated(() => {
  // console.log(456, '页面进入' );
});
// 主动暴露方法
defineExpose({
  refreshColumn,
  reloadTableData,
  xEditTable: xTable,
  clearCheckRow,
  resetSUM,
});
</script>

<style lang="scss" scoped>
:deep(.vxe-table--render-default .vxe-body--row.row--current) {
  background-color: rgb(224, 232, 255) !important;
}
:deep(
    .vxe-table--render-default .vxe-body--row.row--checked,
    .vxe-table--render-default .vxe-body--row.row--radio
  ) {
  background-color: rgb(224, 232, 255) !important;
}

:deep(.mytable-scrollbar .vxe-body--row .cell-active) {
  box-shadow: inset 0 0 0 2px var(--vxe-primary-color);
}

:deep(.vxe-table--render-default .vxe-body--column.col--selected) {
  box-shadow: inset 0 0 0 2px var(--vxe-primary-color) !important;
}

.mytable-scrollbar:deep() .footerRowClassName {
  background-color: #f5f5f5 !important;
}
.mytable-scrollbar:deep() .footerCellClassName {
  // background-color: #f5f5f5!important;
  background-image: none !important;
}

/* // 移除vxtable  可编辑表格的 编辑图标 */
.vxe-header--column .vxe-cell--edit-icon {
  display: none;
}
:deep(.vxe-header--column) {
  font-weight: normal !important;
  color: #333;
  background-color: #eef2f8 !important;
}

:deep(.vxe-cell) {
  margin-top: -2px;
  color: #313338;
  font-family: "Microsoft YaHei";
  font-size: 13px;
}

.row-red {
  background-color: #187;
  color: #fff;
}
:deep(.vxe-body--column.cell-red) {
  background: red !important;
  color: #fff !important;
}
.img-box {
  display: flex;
  align-items: center;
  overflow: hidden;
}
.dots {
  width: 6px;
  height: 6px;
}

.vxe-header--row {
  height: 42px !important;
}

.line-style-wrap {
  .cell-label {
    color: #8a8e99;
  }
  .cell-value {
    color: #333;
    font-weight: 400;
  }
  .line-style-cell {
    display: flex;
    align-items: center;
  }
}

.qrcode-wrap {
  display: flex;
  justify-content: center;
}

.redDot,
.greenDot {
  background-color: #f56c6c;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 6px;
}
.greenDot {
  background-color: #67c23a;
}

:deep(
    .vxe-table--render-default
      .vxe-body--column.col--ellipsis
      > .vxe-cell
      .vxe-tree-cell
  ) {
  text-align: left;
}

.bg-white {
  background-color: #fff;
}
</style>
