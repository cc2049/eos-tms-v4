<!--
 * 高级查询组件
 * @author: wsd
 * @since: 2024-04-28
 * index.vue
-->
<template>
    <div class="advancedQuery">
        <div class="disflex advancedQuery-alone">
            <div class="advancedQuery-title">我的方案</div>
            <div class="currentRadio" :class="chooseRadioVal == item ? 'active' : ''" v-for="(item, index) in radioList"
                :key="index" @click="clickRadio(item, index)"> {{ item }}</div>
        </div>
        <div class="disflex advancedQuery-alone">
            <div class="advancedQuery-title">快捷过滤</div>
            <div style="width: calc(100% - 100px)">
                <el-row :gutter="20">
                    <el-col :xs="16" :sm="18">
                        <FiltrationCom :filterConfig="filterConfig" :filterArr="filterArr" />

                        <!-- <el-row :gutter="10">
                            <el-col :xs="12" :sm="8">
                                <FiltrationCom :filterConfig="filterConfig" :filterArr="filterArr" />
                            </el-col>
                        </el-row> -->
                    </el-col>
                    <el-col :xs="8" :sm="6">
                        <div class="disflex">
                            <el-button type="primary">
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
                                <SettingFilter :filterConfig="filterConfig" :filterArr="filterArr" />
                                <div class="disflex">
                                    <el-select v-model="value" placeholder="请输入条件" 
                                        :size="commonSize">
                                        <el-option v-for="item in filterConfig.filterSeceletArr" :key="item"
                                            :label="item" :value="item" />
                                    </el-select>
                                    <el-button type="primary" link class="ml5">
                                        重置条件
                                    </el-button>
                                </div>

                                <el-divider />
                                <div class="tr">
                                    <el-button @click="visible = false" size="mini">取消</el-button>
                                    <el-button type="primary" @click="visible = false" size="mini">确定</el-button>
                                </div>


                            </el-popover>
                            <el-button type="primary" link>
                                保存
                            </el-button>
                            <el-button type="primary" link>
                                重置
                            </el-button>
                            <!-- <el-icon color="" :size="20">
                                <Icon icon="codicon:fold-down"></Icon>
                            </el-icon>
                            <el-icon color="" :size="20">
                                <Icon icon="codicon:fold-up"></Icon>
                            </el-icon> -->
                        </div>
                    </el-col>
                </el-row>
            </div>
        </div>
    </div>
</template>

<script setup>
import FiltrationCom from "./components/filtrationCom"
import SettingFilter from "./components/settingFilter"

// 我的方案
const chooseRadioVal = ref('默认方案')
const radioList = ref(['默认方案', '我的未完成订单', '今天', '本周', '本月'])
const clickRadio = (item, index) => {
    chooseRadioVal.value = item
}

// 快捷过滤
// const filterSeceletArr = ref(['单据编号','供应商','物料编码'])
const value = ref(null)
const filterConfig = ref({
    filterSeceletArr: ['单据编号', '供应商', '物料编码'],
    filterSeceletArr1: ['包含', '等于', '大于'],
})

const filterArr = ref([{}, {}])
const visible = ref(false)


</script>

<style scoped lang="scss">
@import "@/assets/styles/variables.module.scss";

.advancedQuery {
    font-size: 12px;

    .currentRadio {
        border: 1px solid #A1BACB;
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
    &-alone{
        margin-bottom: 20px;

        :deep(.el-button){
            height: 26px !important;
            line-height: 26px !important;
        }




    }

    &-title {
        color: #515967;
        font-weight: bold;
        margin-right: 15px;
    }






}
</style>
