<template>
  <div style="width: 100%">
    <div>page1</div>
    <div>{{store.title}}</div>
    <div style="width: 100%;height: 50%">
      <MyEcharts :option="option"></MyEcharts>
    </div>
    <div style="padding-left: 20%">
      <div>禁用选中的日期</div>
      <div v-for="item in timePeriod" :key="item.key" style="margin: 10px">
        <el-date-picker v-model="item.time" :disabled-date="disableData" value-format="YYYY-MM-DD" type="daterange" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间"/>
      </div>
    </div>
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

const timePeriod =ref([
  {
    key:1,
    time: []
  },
  {
    key:2,
    time: []
  },
  {
    key:3,
    time: []
  }
])

const disableData = (Data) =>{
  const currentDate = Data.getTime();
  let isDisabled = false

  for(let i=0;i<timePeriod.value.length;i++){
    if(timePeriod.value[i].time&&timePeriod.value[i].time.length){
      const [startTime, endTime] = timePeriod.value[i].time;

      // 获取 startTime 当天的午夜零点时间戳
      const startDate = new Date(startTime);
      console.log(startDate)
      startDate.setHours(0, 0, 0, 0); // 设置为当天的 00:00:00
      const start = startDate.getTime();
      const end = new Date(endTime).getTime();
      // console.log(currentDate,start,end)
      if(currentDate>=start && currentDate<=end){
        isDisabled = true
        break
      }
    }
  }
  return isDisabled
}
</script>

<style scoped>

</style>