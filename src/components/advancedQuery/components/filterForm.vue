<!--
 * 查询组件
 * @author: wsd
 * @since: 2024-04-28
 * filterForm.vue
-->
<template>
    <div class="container">
        <el-row :gutter="10">
            <el-col :span="6">
                <el-select v-model="value" placeholder="请选择" style="width: 100%" :size="commonSize" >
                    <el-option v-for="item in filterSeceletArrs" :key="item" :label="item" :value="item" />
                </el-select>
            </el-col>
            <el-col :span="6">
                <el-select v-model="value1" placeholder="请选择" style="width: 100%" :size="commonSize">
                    <el-option v-for="item in filterSeceletArrs1" :key="item" :label="item" :value="item" />
                </el-select>

            </el-col>
            <el-col :span="12">
                <el-input v-model="input" style="width: 100%" placeholder="输入关键字后回车查询"  :size="commonSize" />
            </el-col>
        </el-row>


    </div>
</template>

<script setup>
const props = defineProps({
    filterConfig: {
        type: Object,
        default: {},
    },
});
const commonSize=ref('mini')
const filterSeceletArrs = computed(() => props.filterConfig.filterSeceletArr)
const filterSeceletArrs1 = computed(() => props.filterConfig.filterSeceletArr1)


const value = ref(null)
const value1 = ref(null)
const input = ref('')

</script>

<style scoped lang="scss"></style>
