<!--
 * @Author: cc2049
 * @Date: 2024-05-08 14:49:22
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-05-08 18:08:46
 * @Description: 简介
-->
    
<template>
  <div class="tree-top">
    <div class="tree-input">
      <span class="tree-input-label">
        分组查询：
      </span>
      <el-input v-model="treeKeyword" size="small" placeholder="请输入关键字" clearable>
      </el-input>
    </div>
    <div class="tree-btn">
      <div class="tree-btn-item">
        新增分组
      </div>
      <div class="tree-btn-item">
        编辑分组
      </div>
      <div class="tree-btn-item">
        删除分组
      </div>
    </div>
  </div>
  <el-scrollbar :height="height" class="tree-border">
    <el-tree :data="treeData" :props="{
                label: 'LABEL',
                children: 'CHILDREN',
                disabled: 'disabled',
              }" node-key="BILLNO" 
              :default-expanded-keys="defaultExpandedKeys"
              :filter-node-method="filterNode" ref="treeRef" highlight-current @node-click="handleNodeClick">
      <template #default="{ data }">
        <TextOverflow :content="` ${data.VNAME}`" />
      </template>
    </el-tree>
  </el-scrollbar>
</template>

<script setup>
import PinyinMatch from "pinyin-match";
import TextOverflow from "@/components/TextOverflow/index.vue";
const props = defineProps({
  treeData: {
    type: Array,
    default: () => [],
  },
  height: {
    type: Number,
  },
  defaultExpandedKeys: {
    type: Array,
    default: () => [],
  },
});



const treeKeyword = ref("");

const emit = defineEmits(["treeClick"]);

const { proxy } = getCurrentInstance();

/** 节点点击事件  */
const handleNodeClick = (data) => {
  emit("treeClick", data);
};

const treeRef = ref(null);

onMounted(() => {
  nextTick(() => {
    treeRef.value.filter("");
  });
});

/** 根据名称筛选菜单树 */
watch(treeKeyword, (val) => {
  treeRef.value.filter(val);
});

/** 通过条件过滤节点  */
const filterNode = (value, data) => {
  if (!value) return true;
  return (
    PinyinMatch.match(data.LABEL, treeKeyword.value) ||
    PinyinMatch.match(data.VALUE, treeKeyword.value) ||
    PinyinMatch.match(data.CODE, treeKeyword.value)
  );
};
</script>


<style lang="scss" scoped>
:deep(.el-tree-node__expand-icon) {
  color: var(--el-color-primary);
  font-size: 16px;
}

:deep(
    .el-tree--highlight-current
      .el-tree-node.is-current
      > .el-tree-node__content
  ) {
  background-color: var(--el-color-primary);
  color: #fff;
  .el-tree-node__expand-icon {
    color: #fff;
  }
}

.tree-top {
  .tree-input {
    display: flex;
    align-items: center;
    font-size: 12px;
    &-label {
      width: 80px;
    }
  }
  .tree-btn {
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    color: var(--el-color-primary);
    margin: 10px 0 5px 0;
    padding: 0 20px;
    cursor: pointer;
    &-item {
      &:hover {
        color: #333;
      }
    }
  }
}
</style>
