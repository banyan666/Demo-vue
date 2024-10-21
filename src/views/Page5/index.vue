<template>
  <div style="width: 100%;height: 100%">
    <div style="display: flex;justify-content: center">
      <el-select
          v-model="selectValue"
          placeholder="Select"
          size="large"
          style="width: 240px"
          @change="languageChange"
      >
        <el-option label="中文" value="zh"/>
        <el-option label="English" value="en"/>
        <el-option label="日本語" value="ja"/>
      </el-select>
    </div>
    <div style="height: 50%;display: flex;justify-content: center;align-items: center">
      <div>{{ $t('message.hello') }}</div>
    </div>
    <div style="width:100%;height:100px">
      <div class="card">炫酷的box</div>
    </div>
  </div>
</template>

<script setup>
import {useI18n} from 'vue-i18n'

const {locale} = useI18n()

onMounted(()=>{
  selectValue.value = locale.value
})
const selectValue = ref('')
const languageChange = (value) => {
  locale.value = value
}
</script>

<style scoped>
.card {
  margin: 0 auto;
  padding: 2rem;
  width: 100px;
  height: 100%;
  background: #1c1f2b;
  text-align: center;
  border-radius: 10px;
  position: relative;
  color: #ffffff;

}


.card::after ,.card::before{
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  /*background: red;*/
  background-image: conic-gradient(from var(--angle), #05f57d, #e80b0b, #45ec3c);
  top: 50%;
  left: 50%;
  translate: -50% -50%;
  z-index: -1;
  animation: 3s spin linear infinite;
  border-radius: 10px;
  padding: 5px;
}

@property --angle {
  syntax: "<angle>";
  initial-value: 0deg;
  inherits: false;
}
@keyframes spin {
  from {
    --angle: 0deg;
  }
  to {
    --angle: 360deg;
  }
}

.card::before {
  filter: blur(1.5rem);
  opacity: 1;
}
</style>