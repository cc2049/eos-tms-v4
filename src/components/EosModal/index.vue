<!--
 * @Author: cc2049
 * @Date: 2024-07-11 16:21:15
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-07-11 18:59:47
 * @Description: 简介
-->

<template>
    <vxe-modal v-model="isShow" :title="modalTitle" resize transfer :position="{ top: 50 }" :width="800" :height="600"
        :min-width="800" :min-height="600" :mask="false" @close="closeModal" @resize="modalResize">
        <template v-if="modalType == 'vtable'">
            <TablePage ref="TablePageRef" :menuID="formID" dbClickType="emit" @dbClick="TablePagedbClick" />
        </template>

        <template v-else>
            <FormPage :menuID="formID" :currentData="currentData2" @closeModal="closeModal" @refreshTable="refreshTable"
                :isGetDetail :activeBtn :topButton :isDetail />
        </template>
    </vxe-modal>
</template>

<script setup>
import TablePage from "@/views/table/components/SingleTable/index.vue";
import FormPage from "@/views/formPage/index.vue";

import useModalStore from "@/store/modules/modal"
import { computed, watch } from "vue";

const modalStore = useModalStore();

const isShow = computed(() => {
    return modalStore.showModal
})

const modalTitle = computed(() => {
    return modalStore.title
})

const modalType = computed(() => {
    return modalStore.type
})

const formID = {
    MODULEID: 'MU220926781446',
    PAGEID: 'PG220926533365',
    ACTION: '',
};


watch(isShow, (newVal) => {
    console.log('isShow', newVal);
})


function closeModal() {
    modalStore.close()
}

function modalResize(e) {
    console.log(3333, e);
}


provide("menuID", formID);

</script>