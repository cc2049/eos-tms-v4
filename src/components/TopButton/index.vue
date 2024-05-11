<!--
 * @Author: cc2049
 * @Date: 2024-04-28 15:12:29
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-05-10 18:11:04
 * @Description: 简介
-->

<template>
  <div class="top-button">
    <div class="fixed-top-button">
      <template v-for="(itemBtn) in topButton" :key="itemBtn.BILLNO">
        <div class="buttom-item" @click="handelEvent(itemBtn)" :title="itemBtn.BTNTITLE " v-if=" setShowBtn(itemBtn) ">
          {{ itemBtn.VNAME }}
        </div>
        <el-dropdown v-else-if="itemBtn.CHILDREN?.length" style="margin: 0 6px" @command="handelEvent" size="large">
          <div class="buttom-item ">
            {{ itemBtn.VNAME }}
            <el-icon class="el-icon--right">
              <arrow-down />
            </el-icon>
          </div>

          <template #dropdown>
            <el-dropdown-menu>
              <template v-for="itemBtnS in itemBtn.CHILDREN" :key="itemBtnS.BILLNO">
                <el-dropdown-item :disabled="getButtonStatus(itemBtnS)" :command="itemBtnS" v-if=" setShowBtn(itemBtnS)">
                  {{ itemBtnS.VNAME }}
                </el-dropdown-item>
              </template>

            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </template>

    </div>

    <div class="top-button-right">
      <div class="tool-wrap">
        <el-icon color="#949eb5" :size="20">
          <Icon icon="tabler:bulb-filled"></Icon>
        </el-icon>
      </div>

      <div class="tool-wrap">
        <el-icon color="#2a4bff" :size="20">
          <Icon icon="ant-design:setting-outlined"></Icon>
        </el-icon>
      </div>

    </div>
  </div>

</template>

<script setup name="Button">
const props = defineProps({
  topButton: {
    type: Array,
  },
  currentData: {
    type: Array,
  },
  treeNode: {},
});

// console.log('topButton', props.topButton );

const { proxy } = getCurrentInstance();
const emit = defineEmits(["handelEvent"]);

const getButtonStatus = computed(() => (item) => {
  //计算属性传递参数
  let { ISCHOOSE: tnt, SCRNCONDITION: data } = item;
  data = data || "";
  //  tnt 指是否需要选择数据   data 按钮禁用条件
  let DATA = props.currentData.length ? props.currentData[0] : null,
    TREEDATA = props.treeNode || {},
    b = props.currentData.length == 1, // 只选中一条数据
    c = props.currentData.length > 0; // 选中了多条数据

  if (!data && (!tnt || tnt == 0)) {
    // 不需要选中数据的时候
    return false;
  } else if (tnt == 2 && c) {
    // 多选成立
    if (data && checkDataSetBtn(data)) {
      return true;
    }
    return false;
  } else if (tnt == 1) {
    // 单选成立时
    if (!b) return true;
    if (DATA && checkDataSetBtn(data)) {
      return true;
    }
    return false;
  } else if (data && !tnt) {
    return eval(data);
  } else {
    return true;
  }
});

// 按钮是多选按钮，对多条数据进行判断条件是否成立
function checkDataSetBtn(tj) {
  for (let i = 0, TNTlength = props.currentData.length; i < TNTlength; i++) {
    try {
      let DATA = props.currentData[i];
      if (eval(tj)) {
        return true;
      }
    } catch (e) {
      return false;
    }
  }
  return false;
}

// 设置是否显示按钮

const setShowBtn = (btn) => {
  if (btn.ISSHOW == 0) return false;
  if (btn.ISSHOW == 2 && btn.OTHER) {
    if (!props.currentData.length) {
      return false;
    }
    try {
      for (var i = 0; i < props.currentData.length; i++) {
        let DATA = props.currentData[i];
        // console.error(evilFn( DATA, btn.OTHER));
        if (!evilFn(DATA, btn.OTHER)) {
          return false;
        }
      }
    } catch (error) {
      console.error(error);
    }

    return true;
  } else if (!btn.CHILDREN || !btn.CHILDREN.length) {
    return true;
  }
};


// proxy.$emit("handelEvent", { data, row: null });

// 表格的顶部按钮操作
function handelEvent( data ) {
  console.log("handelEvent", btn );
  let selectRecords = props.currentData
  // 如果弹窗大小的值存在就进行设置弹窗大小  VTYPE =2  7  是开弹窗
  if (data.RATIO) {
    let WWHH =
      data.RATIO != 1 ? data.RATIO.split("*") : data.PAGEPATH.split("*");
    pageConfig.modalW = WWHH[0];
    pageConfig.modalH = WWHH[1];
  } else {
    pageConfig.modalW = "70%";
    pageConfig.modalH = "60%";
  }

  // 打开弹窗
  if (
    data.VTYPE == 2 ||
    data.VTYPE == 20 ||
    data.VTYPE == 1 ||
    data.VTYPE == 27
  ) {
    
    
  } else if (data.VTYPE == 3) {
    //  选中数据并提交
    let dataChoose = null;
    dataChoose = currentData.value;
    if (data.ISCHOOSE == 1) {
      dataChoose = currentData.value[0];
    } else if (data.ISCHOOSE == 2) {
      dataChoose = currentData.value;
    }
    if (data.ISTWOSURE == 1) {
      needConfirm(data, dataChoose);
    } else {
      submitByBtn(data, dataChoose);
    }
  } else if (data.VTYPE == "5") {
    /** 查询方式 提交查询条件参数  */
    let dataChoose = currentData.value;
    if (data.ISCHOOSE == 1) {
      dataChoose = currentData.value[0];
    } else if (data.ISCHOOSE == 2) {
      dataChoose = currentData.value;
    }
    if (data.ISTWOSURE == 1) {
      needConfirm(data, { ...queryJson.value, CHOOSE: dataChoose });
    } else {
      submitByBtn(data, { ...queryJson.value, CHOOSE: dataChoose });
    }
  } else if (data.VTYPE == 7 && data.ACTION == "QRY") {
    //表格弹窗
    if (data.CHOOSE2SUB == "no") {
      // 如果选中数组给子表的配置，是 del，则表示要删掉数据
      selectRecords = [];
      currentData.value = [];
    }

    const [val1, val2] = data.ACTIONADDRESS.split(",");
    formModalTableCFG.value.PAGE = val2;
    formModalTableCFG.value.MODULE = val1;
    // formModalTableCFG.value.tableBillNo = currentData.value[currentData.value.length - 1].billno;
    formModalTableCFG.value.ListtableData =
      selectRecords[selectRecords.length - 1];
    // currentData.value[currentData.value.length - 1];
    pageConfig.modelTitle = data.VNAME || "提示";
    modalPageInfo.pageSize = 10;
    modalPageInfo.currentPage = 1;
    tableShowCGF.value = true;
  }
  //  文件流下载 导出
  if (data.VTYPE == 13) {
    let chooseData = currentData.value
      ? currentData.value.map((i) => i.BILLNO).join(",")
      : "";
    let PARENTPAGE = pageConfig.mainTable.length ? routerParams.ACTION : "";
    let UrlData = getUrlParams(data.ACTIONADDRESS);
    let aaDown = {
      APPID: "",
      // DATA: data.ISTWOSURE == 1 ? { BILLNO: currentData.value[0].BILLNO , ...queryJson.value } : {},
      DATA: { CHOOSEBILLNO: chooseData, ...queryJson.value, ...UrlData },
      KEY: "",
      MODULEID: routerParams.BILLNO,
      PAGEID: pageConfig.activeBtn.PK_PAGE,
      PARENTPAGE: PARENTPAGE,
      VERSION: "",
    };
    handleExport(data.ACTIONADDRESS, aaDown);
  }
  // 文件路径下载
  if (data.VTYPE == 15) {
    downFilesByUrl(data);
  }
  //模板新增
  if (data.VTYPE == 17) {
    pageConfig.modelTitle = data.VNAME || "提示";
    formConfig.formType = data.ACTION || "";
    mbType.value = true;
    if (MBConfig.MODULEID == "" && MBConfig.PAGEID == "") {
      MBConfig.MODULEID = MBTableData.value.PK_MODULE;
      MBConfig.PAGEID = MBTableData.value.PK_PAGE;
    } else {
      formModalTableCFG.MODULE = MBConfig.MODULEID;
      formModalTableCFG.PAGEID = MBConfig.PAGEID;
    }
    pageConfig.modalVisible = true;
    getOnlyPageConfig(data.CHOOSE2SUB, 17); // 获取独立的配置
  }
  //打开菜单
  if (data.VTYPE == 16) {
    if (formModalTableCFG.value.tableBillNo != "") {
      router.push({
        path: data.ACTIONADDRESS,
        query: { billno: formModalTableCFG.value.tableBillNo },
      });
    } else if (data.OTHER == "fenceMap") {
      router.push({
        path: data.ACTIONADDRESS,
        query: { billno: currentData.value[0].BILLNO },
      });
    } else if (data.OTHER == "formBillNo") {
      const orderNos = currentData.value.map((order) => order.BILLNO).join(",");
      router.push({
        path: data.ACTIONADDRESS,
        query: { billno: orderNos },
      });
    } else {
      router.push({
        path: data.ACTIONADDRESS,
      });
    }
  }
  if (data.VTYPE == 21 && data.PAGEPATH == "type:cyspjmb") {
    reportCGF.value = true;
    let arr = currentData.value[currentData.value.length - 1].BILLNO;
    // 打开弹窗
    ReportType.value = "";
    ReportType.value = 1;
    pageConfig.modelTitle = data.VNAME || "提示";
    reportFromData.value.moduleid = data.PK_MODULE;
    reportFromData.value.pageid = data.PK_PAGE;
    reportFromData.value.type = ReportType.value;
    reportFromData.value.billno = arr;
    reportFromData.value.queryURL = data.ACTIONADDRESS;
    reportFromData.value.saveURL = data.APPLETOTHER;
    pageConfig.modalVisible = true;
    reportFromData.value.isDetail = false;

    if (data.ACTION == "DTL") {
      reportFromData.value.isDetail = true;
    }
  }
  //承运商评价模板审核按钮
  if (
    data.VTYPE == 21 &&
    data.ACTION == "EDIT" &&
    data.PAGEPATH == "type:cyspjmb"
  ) {
    ReportType.value = "";
    ReportType.value = 2;
    let arr = currentData.value[currentData.value.length - 1].BILLNO;
    // 打开弹窗
    reportFromData.value.moduleid = data.PK_MODULE;
    reportFromData.value.pageid = data.PK_PAGE;
    reportFromData.value.type = ReportType.value;
    reportFromData.value.billno = arr;
    reportFromData.value.examine = true;
    reportFromData.value.isDetail = false;
    pageConfig.modelTitle = data.VNAME || "提示";
    pageConfig.modalVisible = true;
  }
  // 启用批量操作  ACTION: "BATCHEDIT"  isSonTable
  // if (data.VTYPE == 22 && data.ACTION == "BATCHEDIT") {
  //   pageConfig.batchTable = !pageConfig.batchTable;
  //   data.VNAME = pageConfig.batchTable ? "取消编辑" : "批量编辑";
  // }

  // 启用了批量编辑时的数据提交功能   { LABEL: "保存并重置", VALUE: "14" },
  if (pageConfig.batchTable && data.VTYPE == 14) {
    batchTableSubmit(data);
  }

  // 查看审批流节点
  if (data.VTYPE == 23) {
    let workBillNo = Array.isArray(currentData.value)
      ? currentData.value[0].PROCESSINSTANCEID
      : currentData.value.PROCESSINSTANCEID;
    // ElMessage({
    //   message: "未获取到单据的审批流主键PROCESSINSTANCEID无法查看审批节点！",
    //   type: "error",
    // });
    if (!workBillNo) return;
    detailDo(workBillNo).then((res) => {
      workDoData.value = res.RESULT;
      pageConfig.modalW = "40vw";
      pageConfig.modalH = "60%";
      workModal.value = true;
    });
  }

  // 分享 ，复制到粘贴板
  if (data.VTYPE == 24) {
    let arr = [];
    //获取客户端
    let newArr = tableCFG.tableColumns.filter((ele) => ele.FIELD == "CTYPENO");
    let newArr1 = JSON.parse(newArr[0].OTHER);
    currentData.value.forEach((item, index) => {
      let terminalTypArr = newArr1.filter((ele) => ele.VALUE == item.CTYPENO);
      arr.push(
        // `客户：${item.CUSTOMERNAME}\n客户端：${item.CTYPENO}\n机器码：${item.MACCODE}\n注册码：${item.REGCODE} \n有效期：${item.EXPIREDATE} \n************************`
        `客户：${item.CUSTOMERNAME}\n客户端：${terminalTypArr[0].LABEL}\n机器码：${item.MACCODE}\n注册码：${item.REGCODE} \n有效期：${item.EXPIREDATE} \n************************`
      );
    });
    let str = arr.join("\n");
    copyTextSuccess(str);
  }

  // 文件预览
  if (data.VTYPE == 25) {
    previewFilesByUrl(data);
  }
  // 单据溯源
  if (data.VTYPE == 29) {
    tracingModal.value = true;
  }
}

// 二次确认事件
function needConfirm(data, selectRecords) {
  ElMessageBox.confirm(`您确定要将该单据${data.VNAME}吗?`, "确认提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    submitByBtn(data, selectRecords);
  });
}

// 执行按钮提交前的数据格式校验
function submitByBtn(btn, data) {
  let params = btn.ACTIONADDRESS.includes("?")
    ? getUrlParams(btn.ACTIONADDRESS)
    : {},
    sdata = null;
  if (btn.ACTION == "DELETE" || btn.ISCHOOSE == 2) {
    let arr = [];
    if (btn.VTYPE == 20) {
      arr.push(treeNode.value.VALUE);
    } else {
      arr = currentData.value.map((i) => {
        return i.BILLNO;
      });
    }
    sdata = { data: arr };
  } else {
    sdata = { ...data, ...params };
  }
  submitEvent(btn.ACTIONADDRESS, sdata);
}

// 数据提交
function submitEvent(URL, sdata) {
  
}

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
</script>

<style lang="scss" scoped>
.fixed-top-button {
  display: flex;

  .buttom-item {
    padding: 0 12px;
    font-size: 14px;
    cursor: pointer;
    line-height: 48px;
    color: #515967;
    &:hover {
      color: var(--el-color-primary);
      background-color: #cfddff;
    }
  }
}

.top-button {
  width: 100%;
  display: flex;
  justify-content: space-between;
  background-color: white;
  height: 46px;
  line-height: 46px;
  background: #fff;
  box-shadow: 0px 3px 7px 0px rgba(17, 50, 130, 0.09);
  &-right {
    cursor: pointer;
    display: flex;
    .tool-wrap {
      height: 46px;
      padding: 0 12px;
      line-height: 46px;
      &:hover {
        color: var(--el-color-primary);
        background-color: #cfddff;
      }
    }

    
  }
}

.font-16 {
  font-size: 16px;
}
</style>
