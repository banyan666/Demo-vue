<template>
  <div class="page2">
    <div style="height: 100px;display: flex;justify-content:center">
      <el-switch
          size="large"
          v-model="value"
          active-text="暗色"
          inactive-text="亮色"
          @change="toggleTheme">
      </el-switch>
    </div>
    <div class="page-title">page222</div>
  </div>
</template>

<script setup>
import {useTheme} from "../../utils/useTheme.ts";
const {theme ,toggleTheme } = useTheme()
const value = ref(false)
onMounted(()=>{
  if(theme.value==='dark'){
    value.value =true
  }else{
    value.value =false
  }
})
</script>

<style lang="less" scoped>
.page2{
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom,var(--bg1),var(--bg2));
  .page-title{
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 30px;
    color: var(--text-color);
    padding-top: 100px;
  }
}

</style>