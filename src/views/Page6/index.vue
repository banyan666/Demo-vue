<template>
  <div class="page6">
    <div style="display:flex;justify-content: flex-end;padding: 20px">
      <el-button type="primary" @click="exportExcel">导出</el-button>
    </div>
    <el-table ref="tableRef" :data="tableData" stripe style="width: 100%">
      <el-table-column prop="date" label="Date" width="180" />
      <el-table-column prop="name" label="Name" width="180" />
      <el-table-column prop="address" label="Address" />
    </el-table>

    <div class="table">
      <div class="table-header">
        <div>时间</div>
        <div>姓名</div>
        <div>地址</div>
      </div>

      <div class="table-body">
        <Vue3SeamlessScroll  v-model="isScroll" :list="tableData" :step="0.5" :hover="true"
                             :limitScrollNum="3" :wheel="true">
          <div v-for="(item, index) in tableData" :key="index" class="table-row">
            <div>{{ item.date }}</div>
            <div>{{ item.name }}</div>
            <div>{{ item.address }}</div>
          </div>
        </Vue3SeamlessScroll>
      </div>

    </div>
  </div>
</template>

<script setup>
import * as XLSX from 'xlsx'
import {Vue3SeamlessScroll} from 'vue3-seamless-scroll'
const tableRef = ref(null)
const exportExcel = () =>{
  const tableDom = tableRef.value?.$el;
  if (tableDom) {
    const wb = XLSX.utils.table_to_book(tableDom);
    XLSX.writeFile(wb, '表格数据.xlsx');
  }

}
const isScroll = ref(true)
const tableData = ref([
  {
    date: '2016-05-03',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-02',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-04',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-01',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-01',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-01',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
])
const classOption = computed(()=>{
  return {
    step: 1, // 数值越大速度滚动越快
    limitMoveNum: 6, // 开始无缝滚动的数据量
    hoverStop: true, // 是否开启鼠标悬停stop
    direction: 1, // 0向下 1向上 2向左 3向右
    waitTime: 3000, // 单步运动停止的时间(默认值1000ms)
    singleHeight:30
  }
})
</script>

<style lang="less" scoped>
.page6{
  width: 100%;
  height: 100%;
}
.table{
  width: 100%;
  height: 30%;
  overflow: hidden;
  background: #fff;
  border-radius: 4px;
  padding: 20px;
  box-sizing: border-box;
  .table-header{
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #ccc;
    padding: 10px 0;
    div{
      width: 33%;
      text-align: center;
    }
  }
  .table-body{
    height: 200px;
    overflow: hidden;
    .table-row{
      display: flex;
      justify-content: space-between;
      padding: 10px 0;
      border-bottom: 1px solid #ccc;
      div{
        width: 33%;
        text-align: center;
      }
    }
  }
}
</style>