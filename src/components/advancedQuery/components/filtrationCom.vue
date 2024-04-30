<!--
 * 快捷过滤组件
 * @author: wsd
 * @since: 2024-04-28
 * filtrationCom.vue
-->
<template>
    <div class="filtrationCom">
        <el-row :gutter="20"  >
            <el-col :xs="24" :sm="12" :xl="8" v-for="(item, index) in filterArr" :key="index" class="mb10">
                <FilterForm :filterConfig="filterConfig" :filterVal="item" />
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



</script>

<style scoped lang="scss"></style>
