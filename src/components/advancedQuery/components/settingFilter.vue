<!--
 * 设置组件
 * @author: wsd
 * @since: 2024-04-28
 * settingFilter.vue
-->
<template>
    <div class="settingFilter">

        <div v-for="(item, index) in filterArr" :key="index" class="aloneFilter">
            <div class="disflex ">
                <FilterForm :filterConfig="filterConfig" />

                <el-icon color="#b9c9fb" :size="20" class="delIcon">
                    <Icon icon="zondicons:minus-solid"></Icon>
                </el-icon>
            </div>
        </div>




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

<style scoped lang="scss">
.settingFilter{
    .aloneFilter{
        margin-bottom: 10px;
    }
    .delIcon{
        cursor: pointer;
        margin-left: 10px;
    }
    .delIcon:hover{
        color: #ef878b;
    }

}


</style>
