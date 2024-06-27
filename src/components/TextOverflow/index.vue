<!--
 * @Author: cc2049
 * @Date: 2024-05-08 15:10:32
 * @LastEditors: 
 * @LastEditTime: 2024-06-27 14:33:32
 * @Description: 简介
-->
<template>
  <div class="ellipsis" @mouseover="onMouseOver" :title="content">
    <span ref="textRef">{{ content }}</span>
  </div>
</template>

<script setup>
const props = defineProps({
  content: String,
});

const isShowTooltip = ref(true);
const textRef = ref(null);

const onMouseOver = () => {
  // 内容超出，显示文字提示内容
  const tag = textRef.value;
  const parentWidth = tag.parentNode.offsetWidth; // 获取元素父级可视宽度
  const contentWidth = tag.offsetWidth; // 获取元素可视宽度
  isShowTooltip.value = contentWidth <= parentWidth;
};
</script>
<style lang="scss" scoped>
.ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>