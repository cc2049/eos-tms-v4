<!--
 * 快捷过滤组件
 * @author: wsd
 * @since: 2024-04-28
 * filtrationCom.vue
-->
<template>
    <div class="filtrationCom">
        <el-row :gutter="20" >
            <el-col :sm="12" :xl="8" v-for="(item, index) in filterArr" :key="index">
                <FilterForm :filterConfig="filterConfig" />
            </el-col>
        </el-row>
    </div>
</template>

<script setup>
import FilterForm from "./filterForm"


const props = defineProps({
    filterConfig: {
        type: Object,
        default: {},
    },
    filterArr: {
        type: Array,
        default: [],
    }
});

console.log(props.filterConfig)


</script>

<style scoped lang="scss"></style>
