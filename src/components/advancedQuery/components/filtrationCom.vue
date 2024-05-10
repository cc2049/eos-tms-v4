<!--
 * 快捷过滤组件
 * @author: wsd
 * @since: 2024-04-28
 * filtrationCom.vue
-->
<template>
    <div class="">
        <div v-for="(item, index) in filterArr" :key="index" class="mb10 oneLine-left-alone">
            <FilterForm :filterConfig="filterConfig" :filterVal="item" v-model:formData="queryFormData"
                @changeFilter="val => changeFilter(val, item, index)" />
        </div>

    </div>
</template>

<script setup>
import FilterForm from "./filterForm"
import { getFormValue } from "@/utils";

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



</script>

<style scoped lang="scss">
.oneLine {

    &-left {
        &-alone {
            width: 500px;
            float: left;

            margin-right: 20px;
        }

    }

}
</style>
