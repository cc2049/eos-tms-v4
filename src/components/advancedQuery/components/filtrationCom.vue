<!--
 * 快捷过滤组件
 * @author: wsd
 * @since: 2024-04-28
 * filtrationCom.vue
-->
<template>
    <div class="">
        <div v-for="(item, index) in filterArr" :key="index" class="mb10 oneLine-left-alone">
            <!-- <FilterForm :filterConfig="filterConfig" :filterVal="item" v-model:formData="queryFormData"
                @changeFilter="val => changeFilter(val, item, index)" /> -->
            <FilterForm :filterConfig="filterConfig" :filterVal="item" v-model:formData="currentQueryList[index]"
                @changeFilter="val => changeFilter(val, item, index)" />
        </div>

    </div>
</template>

<script setup>
import { watch } from "vue";
import FilterForm from "./filterForm"
import { getFormValue } from "@/utils";

const emit = defineEmits(["changeFilter", "changeCurrentQueryList"]);


const props = defineProps({
    filterConfig: {
        type: Object,
        default: {},
    },
    filterArr: {
        type: Array,
        default: [],
    },
    settingArr: {
        type: Array,
        default: [],
    }

});
const queryFormData = ref({})

const currentQueryList = ref([])

onMounted(() => {
    queryFormData.value = getFormValue(props.filterConfig.filterSeceletArr)
})


const updateCurrentQueryList = (val) => {
    currentQueryList.value = val
}

const changeFilter = (val, item, index) => {
    emit("changeFilter", val, item, index)
}

// const newfilterArrs = ref([])
watch(() => props.filterArr, value => {
    // newfilterArrs.value = value
    currentQueryList.value = value.map(ele => {

        if (ele.BILLNO) {
            return ele
        } else {
            return {
                FIELD: '',
                QUERYTYPE: '',
                DEFAULTVAL: '',
                DEFAULTVAL2: '',
                SORTCODE: '',
                DEFAULTVALArr: ''
            }
        }

    })

}, { immediate: true, deep: true })

watch(() => currentQueryList.value, value => {
    emit('changeCurrentQueryList', value)

}, { immediate: true, deep: true })

watch(() => props.settingArr, value => {
    // currentQueryList.value = JSON.parse(JSON.stringify(value))

}, { immediate: true, deep: true })

defineExpose({
    updateCurrentQueryList,
});
</script>

<style scoped lang="scss">
.oneLine {

    &-left {
        &-alone {
            // width: 500px;
            width: 410px;
            float: left;

            margin-right: 20px;
        }

    }

}
</style>
