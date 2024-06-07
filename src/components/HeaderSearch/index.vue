<template>
  <div :class="{ 'show': show }" class="header-search">
    <!-- <svg-icon class-name="search-icon" icon-class="search" @click.stop="click" /> -->

    <el-icon v-show="!show" color="#fff" :size="20" @click.stop="click" class="header-search-icon">
      <Icon icon="iconamoon:search"></Icon>
    </el-icon>

    <el-select-v2 ref="headerSearchSelectRef" v-model="search" :props="selectProps" :options="options" filterable clearable placeholder="请输入内容进行搜索" class="header-search-select" @change="change">

      <template #empty>
        暂无数据
      </template>

      <template #prefix>
        <el-select class="select-type-wrap" size="small" v-model="searchType" placeholder="请选择" style="width: 100px">
          <el-option label="应用菜单" value="1"></el-option>
          <el-option label="内容查询" value="2"></el-option>
        </el-select>
      </template>

      <template #header>
        <div class="select-title">
          <el-icon color="#333" :size="20">
            <Icon icon="iconamoon:search"></Icon>
          </el-icon>
          <span class="select-title-text">搜索"{{ search }}"</span>
        </div>
      </template>

      <template #default="{ item }">
        <span style="margin-right: 8px">{{ item.NAME }}</span>
        <span style="color: var(--el-text-color-secondary); font-size: 13px">
          {{ item.BILLNO }}
        </span>
      </template>

    </el-select-v2>
  </div>
</template>

<script setup>
import Fuse from "fuse.js";
import { getNormalPath } from "@/utils/ruoyi";
import { isHttp } from "@/utils/validate";
import usePermissionStore from "@/store/modules/permission";
import { getMenukeyword } from "#/system/menu";
import { onMounted } from "vue";
const permissionStore = usePermissionStore();

const sidebarRouters = computed(() => permissionStore.topbarRouters);

const search = ref("");
const options = ref([]);
const searchPool = ref([]);
const show = ref(false);
const fuse = ref(undefined);
const headerSearchSelectRef = ref(null);
const router = useRouter();
const routes = computed(() => usePermissionStore().routes);

const searchType = ref("1");

const selectProps = ref({
  label: "NAME",
  value: "BILLNO",
});

function click() {
  show.value = !show.value;
  if (show.value) {
    headerSearchSelectRef.value && headerSearchSelectRef.value.focus();
  }
}
function close() {
  headerSearchSelectRef.value && headerSearchSelectRef.value.blur();
  options.value = [];
  show.value = false;
}
function change(val) {

  let item = options.value.find((item) => item.BILLNO === val);
  const path = item.fullPath ;
  const query = val.query;
  if (isHttp(path)) {
    // http(s):// 路径新窗口打开
    const pindex = path.indexOf("http");
    window.open(path.substr(pindex, path.length), "_blank");
  } else {
    if (query) {
      router.push({ path: path, query: JSON.parse(query) });
    } else {
      router.push(path);
    }
  }
  nextTick(() => {
    show.value = false;
  });
}

function querySearch(query) {
  if (query !== "") {
   
  } else {
    options.value = [];
  }
}

/*
 * 获取树形结构数组的每一项的最后一项
 */
function getLastItems(arr) {
  const results = [];
  function traverse(node) {
    // 基础情况：如果当前节点为空，则直接返回
    if (!node) return;
    // 如果当前节点是叶节点（没有children属性或children为空数组），则添加到结果中
    if (!node.children || node.children.length === 0) {
      results.push(node);
    } else {
      // 递归遍历所有子节点
      for (const child of node.children) {
        traverse(child);
      }
    }
  }
  // 对于树的每个顶层元素开始遍历
  for (const item of arr) {
    traverse(item);
  }
  return results;
}

watch(show, (value) => {
  if (value) {
    document.body.addEventListener("click", close);
  } else {
    document.body.removeEventListener("click", close);
  }
});

onMounted(() => {
  options.value = getLastItems(sidebarRouters.value);
});
</script>

<style lang='scss' scoped>
.header-search {
  display: flex !important;
  &-icon {
    position: relative;
    top: 5px;
    cursor: pointer;
  }
  .search-icon {
    cursor: pointer;
    font-size: 18px;
    vertical-align: middle;
  }

  .select-type-wrap {
    // width: 100px !important;
    :deep(.el-select__wrapper) {
      box-shadow: none !important;
    }
  }

  .header-search-select {
    font-size: 18px;
    transition: width 0.2s;
    width: 0;
    overflow: hidden;
    background: transparent;
    border-radius: 0;
    display: inline-block;
    vertical-align: middle;
    position: relative;
    top: 0px;

    :deep(.el-select__wrapper) {
      border-radius: 50px !important;
      height: 28px;
      min-height: 28px;
    }

    :deep(.el-select__wrapper.is-focused) {
      box-shadow: none;
    }

    :deep(.el-input__inner) {
      border-radius: 10px !important;
      border: 0;
      padding-left: 0;
      padding-right: 0;
      box-shadow: none !important;
      vertical-align: middle;
    }
  }

  &.show {
    .header-search-select {
      width: 290px;
      margin-left: 10px;
    }
  }
}
</style>