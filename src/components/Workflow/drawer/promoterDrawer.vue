<!--
 * @Date: 2022-08-25 14:05:59
 * @LastEditors: PiPin 33947354+p1Master@users.noreply.github.com
 * @LastEditTime: 2024-06-05 17:47:08
 * @FilePath: /Workflow-Vue3/src/components/drawer/promoterDrawer.vue
-->
<template>
  <el-drawer :append-to-body="true" title="发起人" v-model="visible" direction="rtl" class="set_promoter" size="550px" :before-close="savePromoter">
    <div class="demo-drawer__content">
      <div class="promoter_content drawer_content">
        <p>{{ $func.arrToStr(flowPermission) || '所有人' }}</p>
        <el-button type="primary" @click="addPromoter">添加/修改发起人</el-button>
      </div>
      <div class="demo-drawer__footer clear">
        <el-button type="primary" @click="savePromoter">确 定</el-button>
        <el-button @click="closeDrawer">取 消</el-button>
      </div>
      <employees-dialog :isDepartment="true" v-model:visible="promoterVisible" v-model:data="checkedList" @change="surePromoter" />
    </div>
  </el-drawer>
</template>
<script setup>
import { ref, computed, watch } from 'vue'
import employeesDialog from '../dialog/employeesDialog.vue'
import $func from '../plugins/preload'
import { mapState } from '../plugins/lib'
import useworkflowStore from "@/store/modules/workflow"
const workflowStore = useworkflowStore();
let { promoterDrawer, flowPermission1 } = mapState()
let { setPromoter, setFlowPermission } = workflowStore

// import { computed, ref, watch } from 'vue'
let flowPermission = ref([])
let promoterVisible = ref(false)
let checkedList = ref([])
let visible = computed({
  get() {
    return promoterDrawer.value
  },
  set() {
    closeDrawer()
  }
})
watch(flowPermission1, (val) => {
  flowPermission.value = val.value
})


const addPromoter = () => {
  checkedList.value = flowPermission.value
  promoterVisible.value = true;
}
const surePromoter = (data) => {
  flowPermission.value = data;
  promoterVisible.value = false;
}
const savePromoter = () => {
  setFlowPermission({
    value: flowPermission.value,
    flag: true,
    id: flowPermission1.value.id
  })
  closeDrawer()
}
const closeDrawer = () => {
  setPromoter(false)
}
</script>

<style lang="scss" scoped>
.set_promoter {
  .promoter_content {
    padding: 0 20px;

    .el-button {
      margin-bottom: 20px;
    }

    p {
      padding: 18px 0;
      font-size: 14px;
      line-height: 20px;
      color: #000000;
    }
  }
}
</style>