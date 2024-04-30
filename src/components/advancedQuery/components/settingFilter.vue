<!--
 * 设置组件
 * @author: wsd
 * @since: 2024-04-28
 * settingFilter.vue
-->
<template>
    <div class="settingFilter">

        <div v-for="(item, index) in filterArr" :key="index" class="aloneFilter mb10">
            <div class="disflex ">
                <FilterForm :filterConfig="filterConfig" :filterVal="item"   />

                <el-icon color="#b9c9fb" :size="20" class="delIcon" @click="delFilterArr(item,index)">
                    <Icon icon="zondicons:minus-solid"></Icon>
                </el-icon>
            </div>
        </div>
        <el-row :gutter="20">
            <el-col :span="6">
                <el-select v-model="conditionValue" placeholder="请输入条件" :size="commonSize" @change="changeCondition">
                    <el-option v-for="item in filterConfig.filterSeceletArr" :key="item.value" :label="item.label"
                        :value="item.value" />
                </el-select>
            </el-col>
            <el-col :span="6">
                <el-button type="primary" link class="ml5" @click="resetCondition">
                    重置条件
                </el-button>

            </el-col>
            <el-col :span="12">
            </el-col>
        </el-row>



    </div>
</template>

<script setup>
import { computed } from "vue";
import FilterForm from "./filterForm"
const emit = defineEmits('changeCondition','resetCondition','delFilterArr')

const props = defineProps({
    filterConfig: {
        type: Object,
        default: {},
    },
    filterArr: {
        type: Array,
        default: [],
    },
    defaultFilterArr: {
        type: Array,
        default: [],
    },
    deaufilterArr: {
        type: Array,
        default: [],
    }
});

const filterSeceletArr = computed(() => props.filterConfig.filterSeceletArr)
const conditionValue = ref(null)
const changeCondition = (e) => {
    let newArr = filterSeceletArr.value.filter(ele => ele.value == e)
    emit('changeCondition', newArr[0] || {})
}

const resetCondition=()=>{
    conditionValue.value = null
    emit("resetCondition")
}
const delFilterArr=(item,index)=>{
    emit("delFilterArr",index)

}

</script>

<style scoped lang="scss">
.settingFilter {
    .aloneFilter {
        margin-bottom: 10px;
    }

    .delIcon {
        cursor: pointer;
        margin-left: 10px;
    }

    .delIcon:hover {
        color: #ef878b;
    }

}
</style>
