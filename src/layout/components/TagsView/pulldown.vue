<template>
    <vxe-pulldown ref="pulldownRef" destroy-on-close class-name="tags-dropdown">
        <template #default>
            <div class="tool-wrap" @click="openPulldown">
                <el-icon color="#abb6cd" :size="20" class="darrow-down">
                    <DArrowRight />
                </el-icon>
            </div>
        </template>
        <template #dropdown>
            <div class="bg-gray">
                <el-scrollbar>
                    <div class="tags-item" v-for="item in visitedViews" :key="item.path" @click="handleMenu(item)"
                        :class="{ active: item.path === route.path }">

                        <el-icon v-if="isActive(item)" class="suffix-icon mr-10">
                            <Select />
                        </el-icon>
                        <el-icon v-else class="suffix-icon mr-10">
                            <Document />
                        </el-icon>

                        <span class="tags-name">{{ item.meta.title }}</span>
                        <el-icon v-if="!item.meta.affix" class="close-icon " @click.stop="closeSelectedTag(item)">
                            <Close />
                        </el-icon>
                    </div>

                    <el-divider border-style="dashed" />

                    <div class="tags-item " @click="closeOthersTags">
                        <span class="tags-name pl-22">关闭其他页面</span>
                    </div>
                    <div class="tags-item " @click="closeAllTags(selectedTag)">
                        <span class="tags-name pl-22">关闭所有页面</span>
                    </div>
                </el-scrollbar>
            </div>
        </template>
    </vxe-pulldown>
</template>

<script setup>
import { getNormalPath } from '@/utils/ruoyi'
import useTagsViewStore from '@/store/modules/tagsView'
const visible = ref(false);

const selectedTag = ref({});
const affixTags = ref([]);

const { proxy } = getCurrentInstance();
const route = useRoute();
const router = useRouter();

const visitedViews = computed(() => useTagsViewStore().visitedViews);


watch(visible, (value) => {
    if (value) {
        document.body.addEventListener('click', closeMenu)
    } else {
        document.body.removeEventListener('click', closeMenu)
    }
})

function isActive(r) {
    return r.path === route.path
}

function filterAffixTags(routes, basePath = '') {
    let tags = []
    routes.forEach(route => {
        if (route.meta && route.meta.affix) {
            const tagPath = getNormalPath(basePath + '/' + route.path)
            tags.push({
                fullPath: tagPath,
                path: tagPath,
                name: route.name,
                meta: { ...route.meta }
            })
        }
        if (route.children) {
            const tempTags = filterAffixTags(route.children, route.path)
            if (tempTags.length >= 1) {
                tags = [...tags, ...tempTags]
            }
        }
    })
    return tags
}


function closeSelectedTag(view) {
    proxy.$tab.closePage(view).then(({ visitedViews }) => {
        if (isActive(view)) {
            toLastView(visitedViews, view)
        }
    })
}

function closeOthersTags() {
    closePulldown()
    router.push(selectedTag.value).catch(() => { });
    proxy.$tab.closeOtherPage(selectedTag.value).then(() => {
    })
}
function closeAllTags(view) {
    closePulldown()
    proxy.$tab.closeAllPage().then(({ visitedViews }) => {
        if (affixTags.value.some(tag => tag.path === route.path)) {
            return
        }
        toLastView(visitedViews, view)
    })
}
function toLastView(visitedViews, view) {
    const latestView = visitedViews.slice(-1)[0]
    if (latestView) {
        router.push(latestView.fullPath)
    } else {
        // now the default is to redirect to the home page if there is no tags-view,
        // you can adjust it according to your needs.
        if (view.name === 'Dashboard') {
            // to reload home page
            router.replace({ path: '/redirect' + view.fullPath })
        } else {
            router.push('/')
        }
    }
}
function openMenu(tag, e) {
    selectedTag.value = tag
}
function closeMenu() {
    visible.value = false
}
function handleScroll() {
    closeMenu()
}

function handleMenu(e) {
    closePulldown()
    router.push({
        path: e.fullPath
    })
}



// 打开按钮
const pulldownRef = ref(null);
function openPulldown() {
    selectedTag.value = route
    const $pulldown = pulldownRef.value;
    if ($pulldown) {
        $pulldown.togglePanel();
    }
}
function closePulldown() {
    const $pulldown = pulldownRef.value;
    if ($pulldown) {
        $pulldown.togglePanel();
    }
}

</script>

<style lang='scss' scoped>
.darrow-down {
    transform: rotate(90deg);
    position: relative;
    top: 5px;
    cursor: pointer;
}

.el-divider--horizontal {
    margin: 0px;
}

.tags-dropdown {

    :deep(.vxe-pulldown--panel) {
        left: -150px !important;
        border: 1px solid #ddd;
        border-radius: 2px 0 0 2px;
        border-right: 1px solid #000000;
        border-bottom: 1px solid #000000;
    }

    .bg-gray {
        background-color: #f3f3f4;
    }

    .text-lend {
        padding-left: 2rem;
    }

    .tags-item {
        font-size: 12px !important;
        width: 200px;
        position: relative;
        padding: 4px 10px;
        border-bottom: 1px solid red($color: #000000);
        cursor: pointer;

        &:hover {
            background-color: #d4d4d4;

            .close-icon {
                display: block;
            }
        }

        .suffix-icon {
            position: relative;
            top: 2px;
        }

        .close-icon {
            display: none;
            position: absolute;
            right: 10px;
            top: 6px;
        }
    }

}
</style>
