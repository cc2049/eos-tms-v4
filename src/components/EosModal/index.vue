<!--
 * @Author: cc2049
 * @Date: 2024-07-11 16:21:15
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-07-11 17:10:16
 * @Description: 简介
-->

<template>
    <vxe-modal v-model="isShow" :title="modalTitle" resize transfer :position="{top:50}"  :width="800" :height="600" :min-width="800"  :min-height="600" :mask="false" @close="closeModal" @resize="modalResize">
        <div>不显示遮罩层</div>
    </vxe-modal>
</template>

<script setup>

import useModalStore from "@/store/modules/modal"
import { computed } from "vue";

const modalStore = useModalStore();

const isShow = computed(() => {
    return modalStore.showModal
})

const modalTitle = computed(() => {
    return modalStore.title
})


function closeModal(){
    modalStore.close()
}

function modalResize(e){
    console.log(3333, e );
}



</script>