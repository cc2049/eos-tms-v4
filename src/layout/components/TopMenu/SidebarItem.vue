<template>
  <div v-if="!item.hidden">
    <template v-if="hasOneShowingChild(item.children, item) &&(!onlyOneChild.children || onlyOneChild.noShowingChildren) &&!item.alwaysShow">
      <app-link v-if="onlyOneChild.meta" :to="resolvePath(onlyOneChild.path, onlyOneChild.query)">
        <el-menu-item :index="resolvePath(onlyOneChild.path)" :class="{ 'submenu-title-noDropdown': !isNest }">
          <!-- <svg-icon :icon-class="onlyOneChild.meta.icon || (item.meta && item.meta.icon)" /> -->
          <template #title><span class="menu-title" :title="hasTitle(onlyOneChild.meta.title)">{{ onlyOneChild.meta.title }}</span></template>
        </el-menu-item>
      </app-link>
    </template>

    <el-sub-menu v-else ref="subMenu" :index="resolvePath(item.path)" popper-append-to-body :popper-offset="-6">
      <template v-if="item.meta" #title>
        <!-- <svg-icon :icon-class="item.meta && item.meta.icon" /> -->
        <span class="menu-title" :title="hasTitle(item.meta.title)">{{  item.meta.title  }}</span>
      </template>
      <sidebar-item v-for="child in item.children" :key="child.path" :is-nest="true" :item="child" :base-path="resolvePath(child.path)" class="nest-menu" />
    </el-sub-menu>
  </div>
</template>

<script setup>
import { isExternal } from "@/utils/validate";
import AppLink from "./Link";
import { getNormalPath } from "@/utils/ruoyi";

const props = defineProps({
  // route object
  item: {
    type: Object,
    required: true,
  },
  isNest: {
    type: Boolean,
    default: false,
  },
  basePath: {
    type: String,
    default: "",
  },
});

const onlyOneChild = ref({});

function hasOneShowingChild(children = [], parent) {
  if (!children) {
    children = [];
  }
  const showingChildren = children.filter((item) => {
    if (item.hidden) {
      return false;
    } else {
      // Temp set(will be used if only has one showing child)
      onlyOneChild.value = item;
      return true;
    }
  });

  // When there is only one child router, the child router is displayed by default
  if (showingChildren.length === 1) {
    return true;
  }

  // Show parent if there are no child router to display
  if (showingChildren.length === 0) {
    onlyOneChild.value = { ...parent, path: "", noShowingChildren: true };
    return true;
  }

  return false;
}

function resolvePath(routePath, routeQuery) {
  if (isExternal(routePath)) {
    return routePath;
  }
  if (isExternal(props.basePath)) {
    return props.basePath;
  }
  if (routeQuery) {
    let query = JSON.parse(routeQuery);
    return {
      path: getNormalPath(props.basePath + "/" + routePath),
      query: query,
    };
  }
  return getNormalPath(props.basePath + "/" + routePath);
}

function hasTitle(title) {
  if (title.length > 5) {
    return title;
  } else {
    return "";
  }
}
</script>

<style lang="scss" scoped>
.nest-menu {
  .menu-title {
    color: #333;
  }
}

.submenu-title-noDropdown {
  padding-right: 0;
  &:hover {
    background-color: #fff !important;
  }
}

.w100 {
  min-width: 100px;
  .submenu-title-noDropdown {
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
}

.menu-item {
  display: flex;
  align-items: center;
  height: var(--el-menu-item-height);
  line-height: var(--el-menu-item-height);
  font-size: var(--el-menu-item-font-size);
  color: var(--el-menu-text-color);
  padding: 0 var(--el-menu-base-level-padding);
  list-style: none;
  cursor: pointer;
  position: relative;
  transition: border-color var(--el-transition-duration),
    background-color var(--el-transition-duration),
    color var(--el-transition-duration);
  box-sizing: border-box;
  white-space: nowrap;
}

:deep(#app .sidebar-container){
  width: 100% !important;
}

</style>
