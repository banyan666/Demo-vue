<template>
  <div class="bottom-buttons">
    <div class="buttons-box">
      <div v-for="(item, i) in routers"  :key="item">
        <div
            :class="['button-icon',activeKey===item?'active_icon':'']"
            :style="getStyle(i)"
            @click="toRouter(item)"
        >
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const radius = 1000;//半径
const step = 5;//间隔
const width = 720
const routers = ['A','B','C','D','E','F','G','H']
const activeKey = ref(null)
const toRouter = (item) => {
  console.log( item)
  activeKey.value = item
}
/**
 * 绘制圆弧形的布局样式
 * @type {ComputedRef<unknown>}
 */
// 圆心
const centerX = computed(() => width / 2);
const centerY = computed(() => radius + 50); // 圆心在下方偏移一些

const getStyle = (i) => {
  const n = routers.length;

  if (n === 1) {
    var angle = 0;
  } else {
    const maxAngle = 30;

    const total = Math.min(maxAngle, (n - 1) * step);
    const start = -total / 2;
    const end = total / 2;

    angle = start + (end - start) * (i / (n - 1));
  }

  const rad = (angle * Math.PI) / 180;

  const x = centerX.value + radius * Math.sin(rad);
  const y = centerY.value - radius * Math.cos(rad);

  return {
    left: x + "px",
    top: y + "px"
  };
};
</script>

<style lang="less" scoped>
/* 路由按钮*/
.bottom-buttons {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 720px;
  height: 60px;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-image: url('../../assets/img/bottom-open.png');
}
.buttons-box{
  width: 100%;
  height: 100%;
  position: absolute;
  bottom: 60px;
}

.button-icon {
  position: absolute;
  width: 54px;
  height: 54px;
  border-radius: 50%;
  transform: translate(-50%, -70%);
  color: white;
  font-size: 16px;
  pointer-events: all;
  cursor: pointer;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-image: url("../../assets/img/basemap.png");
}
.active_icon {
  background-image: url("../../assets/img/basemap-active.png");
}
</style>
