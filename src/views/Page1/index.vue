<template>
  <div>page1</div>
  <div>{{store.title}}</div>
</template>

<script setup>
import {useStore} from "../../store/index.ts";
const store = useStore()

</script>

<style scoped>

</style>