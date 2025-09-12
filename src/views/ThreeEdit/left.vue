<template>
  <div>
    <div class="left-box">
      <div class="left" v-show="leftCollapsed">
        <div class="nav-menu">
          <div class="menu-item" v-for="item in data" :key="item.title" @click="setIndustryActive(item)">
            <el-button :class="{ 'active-icon': industryActive == item.title, 'normal-icon': industryActive != item.title }" link
                       :icon="item.icon" :title="item.title" />
            <span :class="{ 'active-text': industryActive == item.title }">{{ item.title }}</span>
          </div>
        </div>
        <div class="content-panel">
          <div class="build">
            <div class="back" v-for="item in industryList">
              <div class="item" draggable="true" @dragend="e => dragAdd(e, item)">
                <img class="img" :src="item.img" @click="clickLeft(item)"/>
              </div>
              <div class="back-text">{{item.name}}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="panel-toggle" :style="{left: leftCollapsed ? '400px' : '0'}" @click="leftCollapsed = !leftCollapsed">
      <el-icon color="#ffffff">
        <ArrowLeft v-if="leftCollapsed"/>
        <ArrowRight v-else/>
      </el-icon>
    </div>
  </div>
</template>

<script setup>
import {ArrowRight,ArrowLeft,OfficeBuilding,Guide} from '@element-plus/icons-vue'

const props = defineProps({
  threeEditor:{
    type:Object,
    default:()=>{}
  }
})
const emit = defineEmits(['addModel'])
onMounted(()=>{
  console.log(props.threeEditor,'threeEditor')
})


const data = [
  {
    title:'模型',
    icon:OfficeBuilding,
    list:[]
  },
  {
    title:'组件',
    icon:Guide,
    list:[]
  },
];
const leftCollapsed = ref(true)


const industryActive = ref(data[0].title)
const industryList = ref(data[0].list)
function setIndustryActive(item) {
  industryActive.value = item.title;
  industryList.value = item.list
}


async function clickLeft(v, point) {
  emit('addModel',v,point)
}


const dragAdd = (e, v) => {
  if(!props.threeEditor){
    return
  }
  const {THREE,getThreeEditor} =props.threeEditor
  const editor = getThreeEditor()
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  e.preventDefault();
  const { dataTransfer } = e;
  const { clientX, clientY } = e;
  mouse.x = (clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, editor.camera);
  const intersects = raycaster.intersectObjects(editor.scene.children, true);
  if (intersects.length > 0) {
    const intersect = intersects[0];
    const { point } = intersect;
    clickLeft(v, point)
  }
}

</script>

<style lang="less" scoped>
.left-box{
  position: absolute;
  width: 400px;
  height: calc(100% - 51px);
  top: 51px;
}
.left {
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: #181818;
  z-index: 100;
  display: flex;
  color: #f3f0f0;
}

.nav-menu {
  width: 60px;
  height: 100%;
  display: flex;
  flex-direction: column;
  border-right: 1px solid #4a4a4a;
  box-sizing: border-box;
}

.menu-item {
  height: 62px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 12px;
  cursor: pointer;
  border-bottom: 1px solid #3e3e3e;
  user-select: none;
  transition: all 0.2s ease;

  &:hover {
    background-color: #252525;
  }

  .normal-icon {
    font-size: 24px;
    transition: all 0.2s;
  }

  .active-icon {
    font-size: 28px;
    color: rgb(182, 211, 244);
    font-weight: 800;
    transition: all 0.2s;
  }

  .active-text {
    color: rgb(182, 211, 244);
    font-weight: bold;
  }
}

.content-panel {
  flex: 1;
  overflow: auto;
}

.build {
  padding: 4px;
  box-sizing: border-box;
  display: grid;
  grid-template-rows: repeat(auto-fit, 120px);
  grid-template-columns: repeat(2, 1fr);
  overflow-y: scroll;
  height: 100%;
  justify-items: center;
  width: 100%;

  .back {
    height: 100px;
    width: 120px;
    border-radius: 6px;
    border: 1px solid #676768;
    padding: 5px;
    box-sizing: border-box;
    .back-text{
      text-align: center;
      font-size: 14px;
    }
  }

  .item {
    border: 1px solid #3d3d3d;
    border-radius: 3px;
    height: 80%;
    width: 100%;
    word-wrap: break-word;
    word-break: break-all;
    font-size: 12px;
    display: flex;
    overflow-wrap: break-word;
    text-align: center;
    justify-content: center;
    align-content: center;
    justify-items: center;
    align-items: center;
    padding: 4px;  box-sizing: border-box;
    .img{
      width: 100%;height: 100%;border-radius: 3px
    }
  }

}
.panel-toggle {
  width: 16px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #333;
  cursor: pointer;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  border-radius: 3px;
  z-index: 2;

  &:hover {
    background-color: #444;
  }
}
.icon-arrow-left{
  position: absolute;
  left: 280px
}
</style>
