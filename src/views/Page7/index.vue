<template>
  <div style="height: 100vh; width: 100%; overflow: hidden; position: relative;">
    <div class="bottom-bar">
      <div style="width: 100%;position: relative">
        <!-- 弧形容器定位在页面底部 -->
        <div class="arc-container" ref="arcContainer">
          <!-- 动态渲染图标 -->
          <div
              v-for="(icon, index) in 10"
              :key="index"
              :class="['icon_'+index +' icon',iconIndex===index?'active_icon':'']"
              @click="()=>{setTheme(index)}"
          >
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { onMounted, nextTick, ref } from 'vue'

// 获取容器元素
const arcContainer = ref(null);

// 获取图标数组
const icons = ref([]);

// 获取容器的宽度和高度
const containerWidth = 60; // 容器的宽度
const containerHeight = 800; // 容器的高度
const radius = containerHeight; // 半圆的半径为容器的高度

// 动态调整图标的位置
function positionIcons() {
  // 获取图标的DOM节点
  const iconElements = arcContainer.value.querySelectorAll('.icon');
  const iconCount = iconElements.length;
  const angleStep = 40 / (iconCount - 1); // 计算每个图标的角度

  iconElements.forEach((icon, index) => {
    // 计算每个图标的角度，确保图标从左右两端对称
    const angle = -20 + angleStep * index; // 从 -90° 开始（图标从左侧开始）
    const x = containerWidth / 2 + radius * Math.cos((angle * Math.PI) / 180); // x坐标
    const y = containerHeight + radius * Math.sin((angle * Math.PI) / 180); // y坐标

    icon.style.left = `${x - icon.offsetWidth / 2}px`; // 调整x位置，使图标居中
    icon.style.top = `${y - icon.offsetHeight / 2}px`; // 调整y位置，使图标居中
  });
}
const iconIndex = ref(null)
const setTheme = (index)=>{
  iconIndex.value = index
}
// 初始化时和每次动态添加/移除图标时调用
onMounted(() => {
  nextTick(() => {
    positionIcons(); // 确保DOM更新后再调整位置
  });
});
</script>

<style lang="less" scoped>
.arc-container {
  position: absolute;
  top: 802px;
  left: 33px;
  //display: flex;
  //justify-content: center;
  //align-items: flex-start;
  transform: rotate(270deg); /* 使弧形朝下 */
}
.bottom-bar{
  width: 100%;position: absolute;bottom: 0;height: 60px;
  background-image: url('../../assets/img/bottom-open.png');
  background-position: center;  /* 背景图居中对齐 */
  background-repeat: no-repeat;  /* 禁止平铺 */
}

.icon {
  position: absolute;
  width: 70px;
  height: 70px;
  cursor: pointer;
}
.icon {
  background-image: url("../../assets/img/basemap.png");
}
.active_icon{
  background-image: url("../../assets/img/basemap-active.png");
}
</style>