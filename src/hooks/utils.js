/*
 * @Author: cc2049
 * @Date: 2024-04-26 14:17:26
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-04-26 14:29:05
 * @Description: 简介
 */


export const resetColConfig = (COLUMNS) => {
    // 重新整理列表配置
    let tableCFG = {
      hasSeq: true,
      expandID: "",
      cellHeight: 40,
      cellWidth: 0,
      expandCFG: {},
      mergeCFG: [],
      mergeRowField: [],
      rowBgEval: "",
      showColumns: [] ,
    };  

    COLUMNS.forEach((el) => {
      el.title = el.LABEL;
      if (el.VTYPE == 0) {
        el.VTYPE = "";
      }
      // 是否需要显示序号，默认显示
      if (el.VTYPE == "seq") {
        tableCFG.hasSeq = el.ISSHOW == 1 ? true : false;
      }
      // 是否需要展开详情
      if (el.VTYPE == "expand") {
        tableCFG.expandID = el.FIELD;
        tableCFG.expandCFG = el;
      }

      if (el.VTYPE == "ExJoint" && el.OTHER) {
        try {
          let obgArr = JSON.parse(el.OTHER);
          let brNum = obgArr.filter((i) => {
            return i.row == 1;
          });
          let rowNum = brNum.length;
          if (obgArr.length > rowNum) {
            rowNum += 1;
          }
          let h = rowNum * 22 + 2;
          tableCFG.cellHeight =
            h > tableCFG.cellHeight ? h : tableCFG.cellHeight;
        } catch (error) {
          console.error("拼接配置错误", error, el);
        }
      }

      // 处理多选框和单选框的列头 为空
      if (el.VTYPE == "checkbox" || el.VTYPE == "radio") {
        el.title = "";
        tableCFG.SelectType = el.VTYPE;
        tableCFG.hasCheck = el.VTYPE == "checkbox";
      }
      // 是否存在拖拽
      if (el.VTYPE == "drag") {
        tableCFG.hasDragRow = true;
        tableCFG.dragRowConfig = el;
      }
      // 是否存在操作栏
      if (el.CONTROLS == "ExTableTools") {
        tableCFG.hasTableTools = true;
      }

      if (el.SLOT == "rowBg" && el.SLOTCFG) {
        tableCFG.rowBgEval = tableCFG.rowBgEval ? tableCFG.rowBgEval + " && " + el.SLOTCFG : el.SLOTCFG;
      }

      if (el.ISSHOW == 1 && el.SELECTEDFLAG == 1) {
        columnWidth += el.WIDTH * 1;
        if (el.TOTALTYPE && el.TOTALTYPE != "-") {
            tableCFG.mergeCFG.push(el.FIELD);
        }
      }

      if (el.ISMERGE == 1) {
        tableCFG.mergeRowField.push(el.FIELD);
      }
      //  开启表头筛选功能，把查询条件添加到表头筛选配置中
    //   if (tableCFG.isHeaderFilter && filterFileid.includes(el.FIELD)) {
    //     let TabColFilterCfg = QUERY.filter(
    //       (iQ) => iQ.FIELD == el.FIELD || (iQ.SLOTCFG && iQ.SLOTCFG == el.FIELD)
    //     );
    //     TabColFilterCfg.length ? (el.filterCfg = TabColFilterCfg[0]) : "";
    //   }

      if (
        el.ISSHOW == 1 &&
        el.VTYPE != "seq" &&
        el.VTYPE != "checkbox" &&
        el.CONTROLS != "ExTableTools" &&
        el.SELECTEDFLAG == 1
      ) {
        showColumns.push(el);
      }

      // 如果配置了唯一，说明是要进行合并的 字段
      tableCFG.mergeRowField = mergeRowField;
      tableCFG.mergeCFG = mergeCFG;
    });

    return tableCFG
}