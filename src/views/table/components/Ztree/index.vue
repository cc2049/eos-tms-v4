<!--
 * @Author: cc2049
 * @Date: 2024-05-08 14:49:22
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-05-08 14:52:50
 * @Description: 简介
-->
<template>
  <el-scrollbar :height="300" class="tree-border">
    <el-tree :data="treeOptions" :props="{
                label: 'LABEL',
                children: 'CHILDREN',
                disabled: 'disabled',
              }" node-key="VALUE" :filter-node-method="filterNode" :current-node-key="
                pageConfig.defaultExpandedKeys.length
                  ? pageConfig.defaultExpandedKeys[0]
                  : null
              " :default-expanded-keys="pageConfig.defaultExpandedKeys" ref="treeRef" highlight-current @node-click="handleNodeClick">
      <template #default="{ data }">
        <!-- <TextOverflow :content="`${data.LABEL}`" /> -->
        {{ data.LABEL }}
      </template>
    </el-tree>
  </el-scrollbar>
</template>

<script setup>
import PinyinMatch from "pinyin-match";

const treeOptions =ref([])


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
