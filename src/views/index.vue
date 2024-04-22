<!--
 * @Author: cc2049
 * @Date: 2024-04-19 09:01:33
 * @LastEditors: 
 * @LastEditTime: 2024-04-19 11:04:22
 * @Description: 简介
-->
<template>
  <div>
    <h1>Hello Vue 3!</h1>
    <p>{{ message }}</p>
    <button @click="changeMessage">Change Message</button>
  </div>
</template>

<script setup>
const message = ref('Hello Vue TMS-V3!')
</script>