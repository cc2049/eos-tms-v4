/*
 * @Author: cc2049
 * @Date: 2024-04-25 17:34:36
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-05-30 18:07:51
 * @Description: 获取动态配置
 */

import { getPageConfig } from '#/system/page.js'

import { getQueryUrl, resetColConfig } from './utils'

import { getFormValue, getShowCFG , percentageToNumber} from '@/utils'

const useTableConifg = (menu) => {
    const pageConfig = reactive({
        hasTree: false, // 是否存在左侧树型结构
        treeExpand: true, // 是否展开树
        defaultExpandedKeys: [], // 默认展开的树节点
        treeButton: [],
        totalData: null,
        topButton: [],
        initButton: [],
        queryUrl: null,
        queryJson: {},
        queryConfig: null,
        customPlan: [],
        subTable: [],
        pageShow: true,
        mainTable: [], // 多主表原始配置数据
        mainTableCFG: [], // 多主表处理后的配置
        pageTitle: '',
        pageID: {
            MODULEID: "",
            PAGEID: "",
        },
        tableCFG: null,
        subConfig: null,
    });

    // 单主表使用该配置
    const tableCFG = reactive({
        tableColumns: [],// 可显示的表格列配置
        allColumns: [], // 表格的所以列
        hasTableTools: false, // 是否有操作栏
        hasDragRow: false, // 是否支持 拖拽
        tableStyle: 0, // 表格风格  默认普通表格 ，  1是
        defaultStyle: 0,
        filterFileid: [], // 支持列头筛选的 字段
        loading: false,
        hasFill: false, // 表格补位
        hasEmpty: false,
        height: 500,
        rowClassEval: "", // 行加背景色的条件
        mergeCFG: [], // 表尾合计的配置  字段
        mergeRowField: [], // 需要合并的字段
        pagerConfig: {
            pageSize: 20,
            pageSizes: [10, 20, 30, 50, 100, 500, 1000],
        }, // 分页配置
    });

    const getConfig = async () => {
        const res = await getPageConfig(menu)
        const {
            MAINTABLE,
        } = res.RESULT

        let newPageConfig = null , newtableCFG = null ;
        if (MAINTABLE.length) {
            let newMainTable = MAINTABLE.map(item => {
                return resetConfig(item)
            })
            newPageConfig = newMainTable
        } else {
            newPageConfig = resetConfig(res.RESULT)
        }
        /*
        * 修改当前主表的每页数据Arr  {'PAGESIZE':[100,200,300,500]}
        */
        return new Promise((resolve, reject) => {
            let newConfig = {
                pageConfig: newPageConfig,
            }
            resolve(newConfig)
        })

    }

    // 处理页面中配置
    const resetConfig = (data) => {
        const {
            QUERY,
            BILLNO,
            PK_MODULE,
            ISSUB,
            SUBTABLE,
            CUSTOMPLAN,
            BUTTON,
            SLOTCFG,
            TABLEHEIGHT,
            VNAME,
            VDEF1,
        } = data

        let copyPageConfig = JSON.parse(JSON.stringify(pageConfig));

        // 设置页面配置
        copyPageConfig.BILLNO = BILLNO;
        copyPageConfig.initButton = BUTTON;
        copyPageConfig.customPlan = CUSTOMPLAN;
        copyPageConfig.queryConfig = QUERY;
        copyPageConfig.pageShow = VDEF1 == "1"; // 控制列表是否展示分页功能
        copyPageConfig.topButton = BUTTON.filter(item => item.VTYPE != 20);
        copyPageConfig.treeButton = BUTTON.filter(item => item.VTYPE == 20);
        copyPageConfig.queryUrl = SLOTCFG ? SLOTCFG : getQueryUrl(BUTTON);
        copyPageConfig.treeQueryUrl = getQueryUrl(BUTTON, "tree") || '';
        copyPageConfig.subTable = SUBTABLE
        copyPageConfig.hasTree = copyPageConfig.treeQueryUrl ? true : false;
        let initQueryJson = getFormValue(QUERY);
        copyPageConfig.queryJson = Object.assign(initQueryJson, menu)
        copyPageConfig.pageTitle = VNAME
        copyPageConfig.pageID = {
            MODULEID:PK_MODULE ,
            PAGEID: BILLNO,
        }
        copyPageConfig.tableCFG = resetTableConfig(data)
        // 左右布局表格
        let subConfig = {
            subLayout: ISSUB || 0,
            subLayoutLeft: TABLEHEIGHT || '50%' ,
            subLayoutRight:  percentageToNumber(TABLEHEIGHT )
        }
        copyPageConfig.subConfig = subConfig
        return copyPageConfig
    }

    const resetTableConfig = (data) => {
        const {
            QUERY,
            COLUMNS,
            TABLESTYLE,
            PAGESIZE,
            ISADAPTION,
            MODALTYPE,
            ISTBSELECT,
            VMEMO,
        } = data
        // 设置表格配置
        let copyTableCFG = JSON.parse(JSON.stringify(tableCFG));
        copyTableCFG.autoWidth = ISADAPTION;
        copyTableCFG.isHeaderFilter = ISTBSELECT == 1;
        copyTableCFG.tableStyle = TABLESTYLE || 0;
        copyTableCFG.defaultStyle = MODALTYPE || 0;
        copyTableCFG.tableColumns = getShowCFG(COLUMNS);
        copyTableCFG.allColumns = COLUMNS
        copyTableCFG.pagerConfig.pageSize = PAGESIZE || 20
        if (VMEMO && VMEMO.includes("PAGESIZE")) {
            try {
                copyTableCFG.pagerConfig.pageSizes = JSON.parse(VMEMO).PAGESIZE || 20
            } catch (error) {
                console.error('设置分页：每页大小选项列表', error)
            }
        }
        let newCFG = resetColConfig(COLUMNS, copyTableCFG.isHeaderFilter, QUERY)
        let newtableCFG = Object.assign(copyTableCFG, newCFG)
        return newtableCFG
    }

    return { getConfig }
}

export default useTableConifg