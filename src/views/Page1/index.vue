<template>
  <div>page1</div>
  <div>{{store.title}}</div>
  <div style="width: 100%;height: 50%">
    <MyEcharts :option="option"></MyEcharts>
  </div>
</template>

<script setup>
import MyEcharts from '../../components/Echarts/index.vue'
import {useStore} from "../../store/index.ts";
const store = useStore()
const option = {
  xAxis: {
    type: 'category',
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      data: [120, 200, 150, 80, 70, 110, 130],
      type: 'bar'
    }
  ]
};
</script>

<style scoped>

</style>