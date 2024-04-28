/*
 * @Author: cc2049
 * @Date: 2024-04-25 17:34:36
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-04-28 18:55:59
 * @Description: 获取动态配置
 */

import { getPageConfig } from '#/system/page.js'

import { getQueryUrl , resetColConfig  } from './utils'

import { getFormValue, getFormRule, getShowCFG, setSuffix } from '@/utils'

const useTableConifg = (menu) => {
    const allConfig = ref(null)

    const pageConfig = reactive({
        hasTree: false, // 是否存在左侧树型结构
        treeExpand: true, // 是否展开树
        defaultExpandedKeys: [], // 默认展开的树节点
        tableData: [],
        totalData: null,
        topButton: [],
        initButton: [],
        queryUrl: null,
        queryJson:{},
        hasSubTable: false,
        activeBtn: {},
        pageShow: true,
        modalVisible: false,
        modalBtn: [],
        modalW: "60%",
        modalH: "40%",
        pageTitle: "",
        treeHeight: window.innerHeight - 200,
        mainTable: [], // 多主表原始配置数据
        mainActive: 0,
        mainTableCFG: [], // 多主表处理后的配置
        batchTable: false, // 是否批量操作表格
        EtableCFG: {}, // 批量操作时主表的验证规则
        footerHeight: 150, // 底部子表高度
        isSonTable: false, // 是否启用表格的批量编辑
        hasCustomQuery: false, // 是否启用高级查询
    });

    // 单主表使用该配置
    const tableCFG = reactive({
        tableColumns: [],// 可显示的表格列配置
        allColumns: [], // 表格的所以列
        hasTableTools: false, // 是否有操作栏
        hasSeq: false, // 是否显示序号
        hasCheck: false, // 是否需要多选图标
        hasDragRow: false, // 是否支持 拖拽
        tableStyle: 0, // 表格风格  默认普通表格 ，  1是
        defaultStyle: 0,
        filterFileid:[] , // 支持列头筛选的 字段
        toolsConfig: [],
        expandID: "",
        loading: false,
        hasFill: false, // 表格补位
        hasEmpty: false,
        height: 500,
        rowClassEval: "", // 行加背景色的条件
        mergeCFG: [], // 表尾合计的配置  字段
        mergeRowField: [], // 需要合并的字段
        treeID: null, // 树形表格 的可展开的节点id
        SelectType: null,
        tableButtons: ["ADD", "EDIT", "DELETE"],
        EtableRules: {},
        cellHeight: 40, // 单元格的行高
        isHeaderFilter: false, // 是否启用头部过滤
        headerConfig: [], // 配置的查询条件
        queryJson: {}, // 查询条件
        pagerConfig: {
            pageSize: 10,
            pageSizes: [10, 20, 30, 50, 100, 500, 1000],
        }, // 分页配置
    });

    const getConfig = async () => {
        const res = await getPageConfig(menu)
        const {
            QUERY,
            COLUMNS,
            SUBTABLE,
            BUTTON,
            SLOTCFG,
            MAINTABLE,
            TABLESTYLE,
            ISTREE,
            PAGESIZE,
            ISADAPTION,
            MODALTYPE,
            ISSONTABLE,
            ISTBSELECT,
            VDEF1,
            VDEF3,
            VDEF4,
            VMEMO,
        } = res.RESULT

        /*
        * 修改当前主表的每页数据Arr  {'PAGESIZE':[100,200,300,500]}
        */
        if (VMEMO && VMEMO.includes("PAGESIZE")) {
            try {
                tableCFG.pagerConfig.pageSize = PAGESIZE
                tableCFG.pagerConfig.pageSizes = JSON.parse(VMEMO).PAGESIZE
            } catch (error) {
                console.error('设置分页：每页大小选项列表', error)
            }
        }

        // 设置页面配置
        pageConfig.initButton = BUTTON;
        pageConfig.isSonTable = ISSONTABLE == 1;
        pageConfig.pageShow = VDEF1 == "1"; // 控制列表是否展示分页功能
        pageConfig.hasCustomQuery = VDEF3 == 1;
        pageConfig.batchTable = ISSONTABLE == 1; // 默认批量编辑
        pageConfig.topButton = BUTTON
        pageConfig.queryUrl = SLOTCFG ? SLOTCFG : getQueryUrl(BUTTON);
        let initQueryJson = getFormValue(QUERY);

        pageConfig.queryJson = Object.assign(initQueryJson, menu) 
        

        // 设置表格配置
        tableCFG.autoWidth = ISADAPTION;
        tableCFG.isHeaderFilter = ISTBSELECT == 1;
        tableCFG.headerConfig = QUERY;
        tableCFG.tableStyle = TABLESTYLE || 0;
        tableCFG.defaultStyle = MODALTYPE || 0;
        // 支持列头筛选的查询条件 ID
        tableCFG.filterFileid = QUERY.map((i) => {
            return i.SLOTCFG || i.FIELD;
        });

        tableCFG.tableColumns = getShowCFG(COLUMNS); 
        tableCFG.allColumns = COLUMNS

        let newCFG = resetColConfig(COLUMNS)
        let newtableCFG = Object.assign(tableCFG, newCFG)
        console.log(999, newtableCFG);

        
        return  new Promise((resolve, reject) => {
            let newConfig = {
                pageConfig,
                tableCFG : newtableCFG
            }
            resolve(newConfig)
        })

    }

    return { allConfig, getConfig }
}

export default useTableConifg