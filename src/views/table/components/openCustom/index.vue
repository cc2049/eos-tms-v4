<!--
 * @Author: cc2049
 * @Date: 2024-05-27 17:02:11
 * @LastEditors: PiPin 33947354+p1Master@users.noreply.github.com
 * @LastEditTime: 2024-06-06 11:56:11
 * @Description: 简介
-->
<template>
  <div class="open-page bg-white">
    <div class="page-title flex" v-if="pageCFG.PAGE == 'slot'">
      <div class="form-title-left flex ">
        <div class="text-muted" @click="backEvent">
          <el-icon :size="24">
            <Icon icon="icon-park-outline:return" />
          </el-icon>
          <span class="ml-26">返回</span>
        </div>
        <span class="color-999 ml-20">
          {{ route.meta.title }} / {{ btnConfig.VNAME }}
        </span>
      </div>
      <div class="form-title-btn">
        <div id="custemPageBtn"></div>
        <template>
          <template v-for="itemB in formConfig.buttonList" :key="itemB.BILLNO">
            <el-button type="primary" size="default" @click="formBtnEvent(itemB,1)" v-if="setShowBtn(itemB)">
              {{ itemB.VNAME }}
            </el-button>
          </template>
        </template>
      </div>
    </div>
    <div class="form-page-content">
      <template v-if="pageCFG.PAGE == 'slot'">
        <slotCustemPage :config="btnConfig" :currentData="currentData" @close="closeCustemPage" />
      </template>
      <template v-else>
        <FormPage :menuID="menuParams" :currentData @closeModal="closeModal" @refreshTable="refreshTable" :isGetDetail :activeBtn :topButton :isDetail />
      </template>
    </div>
  </div>
</template>
<script setup>
import { ref, reactive, computed } from "vue";
import FormPage from "@/views/formPage/index.vue";
import pageAutoComponent from "@/pageToComponents";

const props = defineProps({
  activeBtn: Object,
  slotCustemPagePath: String,
});
const emit = defineEmits(["treeClick", "backEvents"]);
const route = useRoute();

const formModalTableCFG = ref({
  MODULE: "",
  PAGE: "",
  TYPE: "",
  tableBillNo: "",
  ListtableData: {},
});
const formConfig = reactive({
  formBase: {}, // 表单源数据
  formValue: {}, // form数据
  formColumns: [], // form配置(已过滤显示)
  formRules: {}, // form验证
  formType: "", // DTL ADD
  buttonList: [], // 表单中的按钮
  showDetail: false, // 是否显示表单 ， 初始时不显示，详情数据查询后显示
});

const currentData = computed(() => props.activeBtn.row);
const btnConfig = computed(() => props.activeBtn.data.btnConf);
console.log(btnConfig.value);
const menuParams = computed(() => {
  return {
    MODULEID: btnConfig.value.PK_MODULE || "-",
    PAGEID: btnConfig.value.PK_PAGE || "-",
  };
});
const pageCFG = computed(() => {
  return {
    PAGE: btnConfig.value.PK_PAGE || "form",
  };
});

/** 动态自定义组件 */
const slotCustemPage = ref();
const openCustemPage = () => {
  try {
    const path = props.slotCustemPagePath;
    slotCustemPage.value = pageAutoComponent(path);
  } catch (err) {
    console.error("Err:打开自定义页面", err);
  }
};

onMounted(() => {
  pageCFG.value.PAGE == "slot" && openCustemPage();
});

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
    justify-content: space-between;

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
