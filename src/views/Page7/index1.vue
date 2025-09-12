<template>
  <div style="height: 100vh; width: 100%; overflow: hidden; position: relative;">
    <div class="bottom-bar">
      <div style="width: 100%;height: 100%">
        <!-- 弧形容器定位在页面底部 -->
        <div ref="arcContainer" style="width: 720px;height: 100%;display: flex;justify-content: space-between;align-items: center;margin: 0 auto">
          <!-- 动态渲染图标 -->
          <div
              v-for="(icon, index) in iconsCount"
              :key="index"
              :class="['icon_'+index +' icon', iconIndex === index ? 'active_icon' : '']"
          @click="() => { setTheme(index) }"
          >
        </div>
      </div>
    </div>
  </div>
  </div>
</template>

<script setup>
import {nextTick, onMounted, ref} from 'vue'

// 图标数量
const iconsCount = 12;
const iconIndex = ref(null); // 当前选中的图标索引

// 设置选中的图标
const setTheme = (index) => {
  iconIndex.value = index;
};
onMounted(() => {
  nextTick(() => {
    getIconStyle(); // 确保DOM更新后再调整位置
  });
});
const arcContainer = ref(null)
let marginBottom = 0
const marginStep = 6
// 计算每个图标的 margin-bottom
const getIconStyle = () => {
  const iconElements = arcContainer.value.querySelectorAll('.icon');
  const iconCount = iconElements.length;
  const half = Math.floor(iconCount / 2);  // 中心图标的索引（对于偶数总数，中心是两者的中间）
  console.log(iconCount,half,'aaaaaaaaaaaaaaa')
  iconElements.forEach((icon,index)=>{

    if(iconCount%2===0){
      if(index<half){
        marginBottom += marginStep * (half - index);
      }else if(index===half || index===half-1){
          marginBottom = marginBottom
        } else{
        marginBottom -= marginStep * (index - half);
      }
    }else{
      if(index<half){
        marginBottom += marginStep * (half - index);
      }else if(index===half){
        marginBottom += 8;
      } else if(index===half+1){
        marginBottom -= 8;
      }else{
        marginBottom -= marginStep * (index-1 - half);
      }
    }
    icon.style.marginBottom = `${marginBottom}px`
  })
};
</script>

<style lang="less" scoped>
.bottom-bar {
  width: 100%;
  position: absolute;
  bottom: 0;
  height: 60px;
  background-image: url('../../assets/img/bottom-open.png');
  background-position: center;  /* 背景图居中对齐 */
  background-repeat: no-repeat;  /* 禁止平铺 */
}

.icon {
  width: 70px;
  height: 70px;
  cursor: pointer;
  background-image: url("../../assets/img/basemap.png");
  background-size: cover;
}

.active_icon {
  background-image: url("../../assets/img/basemap-active.png");
}
</style>
