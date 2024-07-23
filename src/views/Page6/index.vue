<template>
  <div class="page6">
    <div style="display:flex;justify-content: flex-end">
      <el-button type="primary" @click="exportExcel">导出</el-button>
    </div>
    <el-table ref="tableRef" :data="tableData" stripe style="width: 100%">
      <el-table-column prop="date" label="Date" width="180" />
      <el-table-column prop="name" label="Name" width="180" />
      <el-table-column prop="address" label="Address" />
    </el-table>
  </div>
</template>

<script setup>
import * as XLSX from 'xlsx'
const tableRef = ref(null)
const exportExcel = () =>{
  const tableDom = tableRef.value?.$el;
  if (tableDom) {
    const wb = XLSX.utils.table_to_book(tableDom);
    XLSX.writeFile(wb, '表格数据.xlsx');
  }

}
const tableData = [
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
]
</script>

<style lang="less" scoped>
.page6{
  width: 100%;
  height: 100%;
  padding: 20px;
}

</style>