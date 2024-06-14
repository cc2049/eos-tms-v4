/* 需求委托-指派 */
<template>
  <teleport to="#custemPageBtn">
    <el-button type="primary" size="default" @click="formSubmit">保存</el-button>
  </teleport>
  <div class="custemPage p10">
    <div class="panel-item p5">
      <div class="title">需求编号：{{rows.BILLNO}}</div>
    </div>
    <div class="panel-item p5 flex justify-between items-stretch">
      <div class="table w-full">
        <div class="title h30 flex justify-between items-align">
          <el-select v-model="assignForm.ASSIGNTYPE" :disabled="PZLIST.length > 0" placeholder="配载类型" size="default" style="width:100px">
            <el-option v-for="item in ASSIGNTYPE" :key="item.VALUE" :label="item.LABEL" :value="item.VALUE"></el-option>
          </el-select>
        </div>
        <div class="query flex justify-between items-align">
          <span>快捷筛选</span>
        </div>
        <div class="table"></div>
      </div>
      <div class="form w-full">
        <div class="title h30 flex justify-between items-align">
          <span>配载信息</span>
          <span>{{ getPZTotalInfo }}</span>
        </div>
        <el-scroll>
          <div class="assign-item">
            <div class="title"></div>
            <div class="form"></div>
            <div class="table"></div>
          </div>
        </el-scroll>
      </div>
    </div>
    <div class="panel-item p5">
      <div class="title">需求信息</div>
      <eos-form v-model="form" :config="orderConfig"></eos-form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { getOrderDetail, getCDCList, assignSave, orderConfig, loadConfig, ASSIGNTYPE } from "#/custemPage/reqEntrust/assign"
const props = defineProps({
  currentData: Array,
  config: Object
})
const emits = defineEmits(['close'])
const route = useRoute();
const formRef = ref(null)

const rows = computed(() => props.currentData[0])

const assignForm = ref({})
const initAssignForm = () => {
  let initForm = {
    BILLNO: form.value.BILLNO,
    ASSIGNTYPE: "1",
    CARRIERLIST: [],
    DRIVERLIST: [],
    CARLIST: []
  }
  Object.assign(assignForm.value, initForm)
}
const form = ref(null)
const getDetail = () => {
  if (!props.config.ACTIONADDRESS) return false
  const params = {
    url: props.config.ACTIONADDRESS,
    data: {
      BILLNO: rows.value.BILLNO,
      MODULEID: route.meta.BILLNO,
      PAGEID: route.meta.ACTION
    }
  }
  getOrderDetail(params).then(res => {
    form.value = res.RESULT
    initAssignForm()
  })
}
const PZLIST = ref([])
const getPZTotalInfo = computed(() => {
  if (!PZLIST.value.length) return ""
  if (assignForm.value.ASSIGNTYPE == '1') {
    return `已配载 ${PZLIST.value.length} 家`
  } else {
    const nums = PZLIST.value.map(el => el.ROUND).reduce((a, b) => a + b, 0)
    return `已配载 ${PZLIST.value.length} 车 ${nums} 趟`
  }
})

const formSubmit = () => {

}

getDetail()
</script>
<style lang="scss" scoped>
</style>