<!--
 * 快捷过滤组件
 * @author: wsd
 * @since: 2024-04-28
 * filtrationCom.vue
-->
<template>
    <!-- <div class="filtrationCom"> -->
    <div class="">
        <!-- <div class="oneLine"> -->
            <!-- <el-row :gutter="20" > -->
            <!-- <div class="oneLine-left"> -->
                <div v-for="(item, index) in filterArr" :key="index" class="mb10 oneLine-left-alone">
                    <!-- <el-col :xs="24" :sm="12" :xl="8" v-for="(item, index) in filterArr" :key="index" class="mb10"> -->
                    <FilterForm :filterConfig="filterConfig" :filterVal="item" v-model:formData="queryFormData"
                        @changeFilter="val => changeFilter(val, item, index)" />
                    <!-- </el-col> -->
                </div>
            <!-- </div> -->

            <!-- </el-row> -->
            <!-- <div class="oneLine-right">
                <div class="disflex advancedQuery-rightBtn">
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
<SettingFilter :filterConfig="filterConfig" :filterArr="newfilterArrs" :defaultFilterArr="defaultFilterArr"
    @changeCondition="changeCondition" @resetCondition="resetCondition" @delFilterArr="delFilterArr" />
<el-divider />
<div class="tr">
    <el-button @click="visible = false" size="mini">取消</el-button>
    <el-button type="primary" @click="visible = false" size="mini">确定</el-button>
</div>
</el-popover>
<div class="ml10 mr10 btnStyle">保存</div>
<div class="btnStyle">重置</div>
</div>
</div> -->
        <!-- </div> -->


    </div>
</template>

<script setup>
import FilterForm from "./filterForm"
import { getFormValue, GetDateAfter, evilFn, formatDate, deepClone } from "@/utils";
// import SettingFilter from "./settingFilter"

const emit = defineEmits(["changeFilter"]);


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
    }

});
const queryFormData = ref({})


onMounted(() => {
    queryFormData.value = getFormValue(props.filterConfig.filterSeceletArr)
})

const changeFilter = (val, item, index) => {
    emit("changeFilter", val, item, index)
}

const newfilterArrs = ref([])
watch(() => props.filterArr, value => {
    newfilterArrs.value = value
}, { immediate: true })


// const visible = ref(false)
// const changeCondition = (e) => {
//     newfilterArrs.value.push(e)
// }
// const resetCondition = () => {
//     newfilterArrs.value = JSON.parse(JSON.stringify(defaultFilterArr.value))
// }
// const delFilterArr = (index) => {
//     newfilterArrs.value.splice(index, 1)

// }


</script>

<style scoped lang="scss">
// .filtrationCom {
    .oneLine {
        // display: flex;


        &-left {
            // display: inline-block;
            // float: left;
            // display: flex;
            // flex-wrap: wrap;
            &-alone {
                width: 500px;
                float: left;
                // display: inline-block;

                // min-width: 300px;
                // max-width: 400px;
                margin-right: 20px;
            }


        }

        // &-right {
        // width: 200px;
        // flex-shrink: 0;
        // margin-left: 20px
        // }
    }



// }
</style>
