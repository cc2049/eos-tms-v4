<!--
 * 运输需求按量拆
 * @author: wsd
 * @since: 2024-06-24
 * measure.vue
-->
<template>
    <teleport to="#custemPageBtn">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" size="default" @click="confirm">确定</el-button>
    </teleport>
    <div class="measure">
        <el-card>
            <template #header>
                <div class="card-header disflex justify-between">
                    <span>拆分详情</span>
                    <div>
                        <!-- <el-button type="text" @click="delList">删除</el-button> -->
                        <el-button type="text" @click="addList">新增</el-button>
                    </div>
                </div>
            </template>
            <div class="disflex resolutionMu">
                <div v-for="(item, index) in detailObj.SUBLIST" :key="index" class="resolution">
                    <el-icon v-if="index != 0" @click="delList(index)" class="rightBtn">
                        <Close />
                    </el-icon>
                    <div class="colorLump resolution-left">
                        {{ index + 1 }}
                    </div>
                    <div class="resolution-right">
                        <div class="disflex">
                            <div v-for="(materialItem, materialIndex) in item" :key="materialIndex" class="">
                                {{ materialIndex != 0 ? '/' : '' }}
                                {{
            materialItem.MATERIALNAME }}（{{ materialItem.ROWLYWEIGHT }}
                                {{
            materialItem.VUNIT }} ）</div>
                        </div>
                        <el-divider border-style="dashed" />

                        <div class="disflex ">
                            <div class="disflex mr-10" v-for="(materialItem, materialIndex) in item"
                                :key="materialIndex">
                                {{ materialIndex != 0 ? '/' : '' }} 剩余{{ materialItem.ALLOWNUM }}
                            </div>
                        </div>

                        <el-divider border-style="dashed" />
                        <div class="disflex">
                            <el-input v-for="(materialItem, materialIndex) in item" :key="materialIndex" class=" mr-10"
                                v-model="materialItem.ALLOCATEDNUM" type="number" size="small" @blur="ALLOCATEDNUMBlur"
                                placeholder="输入委托量"></el-input>
                        </div>




                        <!-- <div class="">{{ detailObj.SUBLIST[0].MATERIALNAME }}（{{ detailObj.SUBLIST[0].ROWLYWEIGHT }} {{
            detailObj.SUBLIST[0].VUNIT }} ）</div>
                        <el-divider border-style="dashed" />
                        <div class="disflex ">剩余{{ item.ALLOWNUM }}</div>
                        <el-divider border-style="dashed" />
                        <div>
                            <el-input v-model="item.ALLOCATEDNUM" type="number" size="small" @blur="ALLOCATEDNUMBlur"
                                placeholder="输入委托量"></el-input>
                        </div> -->


                    </div>
                </div>
            </div>
        </el-card>

        <el-card class="mt-10">
            <template #header>
                <div class="card-header">
                    <span>需求信息</span>
                </div>
            </template>
            <div>
                <el-form :model="form" label-width="auto" style="width: 100%;">
                    <el-row style="width: 100%;">
                        <el-col :span="6">
                            <el-form-item label="委托单位：">
                                <div>{{ detailObj.TRANORGNAME }}</div>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="业务类型：">
                                <div>{{ detailObj.BUSSTYPE == 1 ? '采购' : detailObj.BUSSTYPE == 2 ? '销售' :
            detailObj.BUSSTYPE ==
                3 ? '调拨' : '' }}</div>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="客商企业：">
                                <div>{{ detailObj.CUSTOMERNAME }}</div>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="合同单号：">
                                <div>{{ detailObj.CONTRACTNO }}</div>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <el-divider border-style="dashed" />
                <el-form :model="form" label-width="auto" style="width: 100%;">
                    <el-row style="width: 100%;">
                        <el-col :span="6">
                            <el-form-item label="发货单位：">
                                <div>{{ detailObj.SENDORGNAME }}</div>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="发货地址：">
                                <div>{{ detailObj.SENDADDR }}</div>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="联系姓名：">
                                <div>{{ detailObj.SENDPSN }}</div>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="联系电话：">
                                <div>{{ detailObj.SENDTEL }}</div>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="收货单位：">
                                <div>{{ detailObj.RECEIVENAME }}</div>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="收货地址：">
                                <div>{{ detailObj.RECEIVEADDR }}</div>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="联系姓名：">
                                <div>{{ detailObj.RECEIVEPSN }}</div>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="联系电话：">
                                <div>{{detailObj.RECEIVETEL}}</div>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </div>
        </el-card>



    </div>
</template>

<script setup>
import { getSpecialDetail, handleDemand } from "#/custemPage/transportDemand"
import { computed, onMounted, onUnmounted, ref, } from "vue";
import { Close } from '@element-plus/icons-vue'

const { proxy } = getCurrentInstance();
const emit = defineEmits(["closeModal"]);

const props = defineProps({
    currentData: Array,
    config: Object
})
console.log(props)
const form = ref({})

const rows = computed(() => props.currentData[0])
const detailObj = ref({
    SUBLIST: []
})


const calculatedValue = () => {

    detailObj.value.SUBLIST.forEach((item, index) => {
        if (index != 0) {
            item.forEach((items, indexs) => {
                detailObj.value.SUBLIST[index][indexs].ALLOWNUM = detailObj.value.SUBLIST[index - 1][indexs].ALLOWNUM - (detailObj.value.SUBLIST[index - 1][indexs].ALLOCATEDNUM || 0)
            })
            // detailObj.value.SUBLIST[index].ALLOWNUM = detailObj.value.SUBLIST[index - 1].ALLOWNUM - (detailObj.value.SUBLIST[index - 1].ALLOCATEDNUM || 0)
        }
    })
    console.log("🚀 ~ detailObj.value.SUBLIST.forEach ~ detailObj.value.SUBLIST:", detailObj.value.SUBLIST)
}

const ALLOCATEDNUMBlur = () => {
    calculatedValue()
}

const addList = () => {
    // detailObj.value.SUBLIST.push({
    //     ALLOCATEDNUM: '',
    //     ALLOWNUM: ''
    // })
    console.log(detailObj.value.SUBLIST)
    let newData = JSON.parse(JSON.stringify(detailObj.value.SUBLIST[0]))
    newData.forEach(item => {
        item.ALLOCATEDNUM = ''
    })
    detailObj.value.SUBLIST.push(newData)
    calculatedValue()
}

const delList = (index) => {
    detailObj.value.SUBLIST.splice(index, 1)
    calculatedValue()
}

const cancel = () => {
    emit("close")

}
const confirm = () => {
    let SUBLIST = []
    detailObj.value.SUBLIST.forEach((ele,eleIndex) => {
        console.log("🚀 ~ SUBLIST ~ ele:", ele)
        ele.forEach((item,index) => {
            // return {
            //     BILLNO: item.BILLNO,
            //     ALLOCATEDNUM: Number(item.ALLOCATEDNUM),
            //     ALLOWNUM: item.ALLOWNUM
            // }
            SUBLIST[eleIndex]?'':SUBLIST[eleIndex] = []
            SUBLIST[eleIndex][index]?'':SUBLIST[eleIndex][index] = {}
            SUBLIST[eleIndex][index].BILLNO = item.BILLNO
            SUBLIST[eleIndex][index].ALLOCATEDNUM = item.ALLOCATEDNUM
            SUBLIST[eleIndex][index].ALLOWNUM = item.ALLOWNUM
        })
    })
    console.log("🚀 ~ SUBLIST ~ SUBLIST:", SUBLIST)
    let protData = {
        BILLNO: rows.value.BILLNO,
        "MODE": "NUM",
        SUBLIST

    }
    handleDemand(protData).then(res => {
        proxy.$modal.msgSuccess("保存成功");
        emit("close")
    })
}

const getgetSpecialDetail = () => {
    let protData = {
        BILLNO: rows.value.BILLNO
    }
    getSpecialDetail(protData).then(res => {
        detailObj.value = res.RESULT
    })
};

onMounted(() => {
    getgetSpecialDetail()
    // 
});

</script>

<style scoped lang="scss">
.measure {
    padding: 10px 20px;

    .resolutionMu {
        background-color: #f7f9fe;
        padding: 20px 20px 0 20px;
        flex-wrap: wrap;

        .resolution:nth-child(1n) {
            .colorLump {
                background-color: #eaf0fc;
            }
        }

        .resolution:nth-child(2n) {
            .colorLump {
                background-color: #f2e8fe;
            }
        }

        .resolution:nth-child(3n) {
            .colorLump {
                background-color: #fdf6ec;
            }
        }
    }

    .resolution {
        // width: 300px;
        display: flex;
        margin-right: 30px;
        margin-bottom: 20px;
        font-size: 14px;
        position: relative;

        .colorLump {
            width: 40px;
            background-color: #eaf0fc;
            border-radius: 10px 0 0 10px;
            text-align: center;
            line-height: 8;
        }


        &-right {
            padding: 10px;
            background-color: #fff;
            border-radius: 0 10px 10px 0;

            .el-divider--horizontal {
                margin: 10px 0;
            }
        }


        .rightBtn {
            position: absolute;
            right: -8px;
            top: -6px;
            z-index: 999;
            font-size: 18px;
            color: #aaa;
            cursor: pointer;
        }
    }




}
</style>
