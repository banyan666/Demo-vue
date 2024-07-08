<template>
  <div class="home-app">
    <Menu></Menu>
    <router-view></router-view>
  </div>
</template>

<script setup>
import Menu from '../components/Menu/index.vue'

</script>

<style scoped>

.home-app{
  width: 100%;
  height: 100%;
  display: flex;
}
</style>