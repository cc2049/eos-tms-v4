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
                <FilterForm :filterConfig="filterConfig" :filterVal="item" class="mr10"
                    v-model:formData="currentQueryList[index]" @changeFilter="val => changeFilter(val, item, index)" />
                <div>
                    <el-icon v-if="index != 0" color="#b9c9fb" :size="20" class="delIcon cp"
                        @click="delFilterArr(item, index)">
                        <Icon icon="zondicons:minus-solid"></Icon>
                    </el-icon>
                    <el-icon v-else color="#fff" :size="20">
                        <Icon icon="zondicons:minus-solid"></Icon>
                    </el-icon>
                </div>
            </div>
        </div>
        <div class="disflex">
            <!-- <el-row :gutter="20">
            <el-col :span="6"> -->
            <el-select v-model="conditionValue" style="width: 120px" placeholder="请输入条件" :size="commonSize"
                @change="changeCondition">
                <el-option v-for="item in filterConfig.filterSeceletArr" :key="item.BILLNO" :label="item.LABEL"
                    :value="item.BILLNO" />
            </el-select>
            <!-- </el-col> -->
            <!-- <el-col :span="6"> -->
            <el-button type="primary" link class="ml5" @click="resetCondition">
                重置条件
            </el-button>

            <!-- </el-col> -->
            <!-- <el-col :span="12">
            </el-col> -->
            <!-- </el-row> -->
        </div>



    </div>
</template>

<script setup>
import { computed } from "vue";
import FilterForm from "./filterForm"
const emit = defineEmits('changeCondition', 'resetCondition', 'delFilterArr', 'changeCurrentQueryList', 'changeFilter')


const props = defineProps({
    filterConfig: {
        type: Object,
        default: {},
    },
    filterArr: {
        type: Array,
        default: [],
    },
});


const currentQueryList = ref([])

const filterSeceletArr = computed(() => props.filterConfig.filterSeceletArr)
const conditionValue = ref(null)
const changeCondition = (e) => {
    let newArr = filterSeceletArr.value.filter(ele => ele.BILLNO == e)
    emit('changeCondition', newArr[0] || {})
}

const resetCondition = () => {
    conditionValue.value = null
    emit("resetCondition")
}
const delFilterArr = (item, index) => {
    currentQueryList.value.splice(index, 1);

    emit("delFilterArr", index)
}

const updateCurrentQueryList = (val) => {
    currentQueryList.value = val
}

const changeFilter = (val, item, index) => {
    emit("changeFilter", val, item, index)
}

// const newfilterArrs = ref([])
watch(() => props.filterArr, nArr => {

    nArr.forEach((item, index) => {
        if(currentQueryList.value[index]){
            currentQueryList.value[index].FIELD = nArr[index].FIELD
        }else{
            currentQueryList.value[index] = {}
            currentQueryList.value[index].FIELD = nArr[index].FIELD
        }
    })


    // currentQueryList.value = value.map(ele => {
    // console.log("🚀 ~ watch ~ ele:", ele)
    //     if (ele.BILLNO) {
    //         // return ele
    //         return {
    //             FIELD: ele.FIELD,
    //             QUERYTYPE: '',
    //             DEFAULTVAL: '',
    //             DEFAULTVAL2: '',
    //             SORTCODE: '',
    //             DEFAULTVALArr: ''
    //         }
    //     } else {
    //         return {
    //             FIELD: '',
    //             QUERYTYPE: '',
    //             DEFAULTVAL: '',
    //             DEFAULTVAL2: '',
    //             SORTCODE: '',
    //             DEFAULTVALArr: ''
    //         }
    //     }
    // })

}, { immediate: true })

watch(() => currentQueryList.value, value => {
    emit('changeCurrentQueryList', value)

}, { immediate: true, deep: true })





defineExpose({
    updateCurrentQueryList,
});

</script>

<style scoped lang="scss">
.settingFilter {
    .aloneFilter {
        margin-bottom: 10px;
    }

    .delIcon {}

    .delIcon:hover {
        color: #ef878b;
    }

}
</style>
