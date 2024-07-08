<template>
  <div ref="myEcharts" style="width: 100%;height: 100%"></div>
</template>

<script setup>
import * as echarts from 'echarts'
const myEcharts = ref(null);
let chartInstance = null;
const props=defineProps({
  option: {
    type: Object,
    required: true,
    default:{}
  },
  isClick:{
    type:Boolean,
    default: false
  }
})
const emit = defineEmits(['onClick'])
onMounted(() => {
  nextTick(()=>{
    if (myEcharts.value) {
      chartInstance = echarts.init(myEcharts.value);
      updateChart();
      if(props.isClick){
        //监听点击事件，点击到空白部分返回null
        chartInstance.getZr().on('click',(e)=>{
          if(e.target){
            chartInstance.on('click',(params)=>{
              emit('onClick',params)
              //触发后卸载点击事件
              chartInstance.off('click');
            })
          }else{
            emit('onClick',null)
          }
        })
      }
      window.addEventListener('resize',resizeEcharts)
    }
  })
});

const updateChart = () => {
  if (chartInstance && props.option) {
    chartInstance.setOption(props.option,true);
  }
};
const resizeEcharts = () =>{
  if (chartInstance) {
    chartInstance.resize();
  }
}

watch(() => props.option,updateChart);

onUnmounted(() => {
  if(chartInstance){
    if(props.isClick){
      chartInstance.getZr().off('click');
    }
    chartInstance.dispose()
  }
  window.removeEventListener('resize',resizeEcharts)
});

</script>

<style scoped>

</style>