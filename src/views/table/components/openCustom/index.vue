<!--
 * @Author: cc2049
 * @Date: 2024-05-27 17:02:11
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-06-05 17:48:03
 * @Description: 简介
-->
<template>
  <div class="open-page bg-white">
    <div class="page-title flex">
      <div class="form-title-left flex ">
        <div class="text-muted" @click="backEvent">
          <el-icon :size="24">
            <Icon icon="icon-park-outline:return" />
          </el-icon>
          <span class="ml-26">返回</span>
        </div>

        <span class="color-999 ml-20">
          {{ route.meta.title }} / --
        </span>
      </div>
      <div class="form-title-btn">
        <div id="custemPageBtn" v-if="
                  formModalTableCFG.PAGE == 'slot' ||
                  formModalTableCFG.TYPE == 'STEP'
                "></div>
        <template>
          <template v-for="itemB in formConfig.buttonList" :key="itemB.BILLNO">
            <el-button type="primary" size="default" @click="formBtnEvent(itemB,1)" v-if="setShowBtn(itemB)">
              {{ itemB.VNAME }}
            </el-button>
          </template>
        </template>
      </div>
    </div>
    <div class="form-page-content mt20">
     
      <!-- <template v-if="formModalTableCFG.PAGE == 'slot'"> -->
      <slotCustemPage :config="{}" :currentData="currentData" @close="closeCustemPage" />
      <!-- </template> -->
    </div>
  </div>
</template>
<script setup>
const route = useRoute();

const formModalTableCFG = ref({
  MODULE: "",
  PAGE: "",
  TYPE: "",
  tableBillNo: "",
  ListtableData: {},
});
console.log(888,route);
const formConfig = reactive({
  formBase: {}, // 表单源数据
  formValue: {}, // form数据
  formColumns: [], // form配置(已过滤显示)
  formRules: {}, // form验证
  formType: "", // DTL ADD
  buttonList: [], // 表单中的按钮
  showDetail: false, // 是否显示表单 ， 初始时不显示，详情数据查询后显示
});

const currentData = ref([]);

const emit = defineEmits(["treeClick", "backEvents"]);




function backEvent() {
  // treeKeyword.value = "";
  // visibleFormPage.value = false;
  // formConfig.showDetail = false;
  // formConfig.formValue = {};
  // currentData.value = [];
  emit("backEvents");
}
</script>

<style lang="scss" scoped>
.open-page {
  .page-title {
    padding: 10px;
    border-bottom: 1px solid var(--el-border-color-light);
    align-items: center;
    .form-title-left {
      .text-muted {
        position: relative;
        cursor: pointer;
        color: var(--el-color-primary) !important;
        .el-icon {
          position: absolute;
          top: -1px;
          color: var(--el-color-primary) !important;
        }
      }
    }
  }
}
</style>
