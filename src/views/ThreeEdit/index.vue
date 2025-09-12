<template>
  <div style="height: 100%;width: 100%">
    <!-- 顶部导航栏 -->
    <div class="header">
      <div class="header-box">
        <div class="header-left">
          <el-select v-model="dataCores.sceneName" style="width: 200px;" popper-class="select-popper" @change="changeScene">
            <el-option v-for="item in dataCores.options" :key="item.name" :label="item.name" :value="item.name">
              <div style="width: 100%;display: flex;justify-content: space-between;">
                <span>{{ item.name }} </span>
                <span>
                      <el-icon style="color: aliceblue;">
                        <Close @click="delScene(item)"/>
                      </el-icon>
                </span>
              </div>
            </el-option>
          </el-select>
          <el-button class="btn-add" link icon="plus" @click="dialogVisible = true">新建场景</el-button>
          <el-dialog v-model="dialogVisible" title="命名场景" width="500">
            <el-input v-model="inputSceneName" placeholder="请输入场景名称" />
            <template #footer>
              <div class="dialog-footer">
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button @click="createEditor">
                  确认
                </el-button>
              </div>
            </template>
          </el-dialog>
        </div>
        <div class="title">
          3D模型编辑器
        </div>
        <div class="header-right">
          <el-button class="btn-add" link icon="Document" @click="exportTemplateJson">导出</el-button>
          <el-button @click="openPanel">控制板</el-button>
          <el-button @click="saveParams">保存</el-button>
        </div>
      </div>
    </div>
    <!-- 左侧菜单   -->
    <LeftMenu :threeEditor="threeRef" @addModel="addModel"></LeftMenu>
    <HThreeD ref="threeRef"
             @clickModel="clickModel"
             :modelSize="modelSize"
             :sceneConfig="sceneConfig"
             :lightConfig="lightConfig"
             :cameraConfig="cameraConfig"
             :floodlightConfig="floodlightConfig"
             :outlinePassConfig="outlinePassConfig"
             :isUpdateCenter="false"
    ></HThreeD>
    <!-- 右侧   -->
    <Right :threeEditor="threeRef" @setMode="setMode"></Right>
    <!-- 中间区域 -->
    <div class="center-panel">
      <!-- 顶部工具栏 -->
      <div class="top-toolbar">
        <el-radio-group v-model="currentMode" size="small">
          <el-radio-button label="选中" value="选中">
            <el-icon>
              <Pointer />
            </el-icon>选择
          </el-radio-button>
          <el-radio-button label="平移" value="平移">
            <el-icon>
              <Rank />
            </el-icon>平移
          </el-radio-button>
          <el-radio-button label="旋转" value="旋转">
            <el-icon>
              <RefreshRight />
            </el-icon>旋转
          </el-radio-button>
          <el-radio-button label="缩放" value="缩放">
            <el-icon>
              <ZoomIn />
            </el-icon>缩放
          </el-radio-button>
        </el-radio-group>
      </div>
    </div>
  </div>
</template>

<script setup>
import {Pointer,Rank,RefreshRight,ZoomIn,Close} from '@element-plus/icons-vue'

import HThreeD from '../../components/ThreeComponent/HThreeD/index.vue'
import LeftMenu from './left.vue'
import Right from './right.vue'
import Tips from './Tips.vue'

const threeRef = ref(null)
let HThreeEditor = null // threejs编辑器
//模型缩放大小配置
const modelSize = 0.1
// 场景配置
const sceneConfig = {
  background: '#01081f',//背景颜色
  opacity:1,//透明度
  grid:{
    show:true,
    size: 100,
    divisions: 50,
    color: '#2d699f'
  }
}
// 灯光配置
const lightConfig = {
  type:'HemisphereLight',
  color: '#ffffff',
  intensity: 10,
  position: {
    x: 0,
    y: 500,
    z: 0
  }
}
// 相机配置
const cameraConfig = {
  near:0.6,
  maxPolarAngle:1.5,
  minDistance: 0.1,
  maxDistance: 100000,
  position: {
    x: 0,
    y: 0,
    z: 0
  }
}
// 泛光设置
const floodlightConfig = {
  visible:true,//是否显示
  strength:0.25,//强度
  radius: 0.25,//半径
  threshold: 0.25 //阈值
}
//炫光设置
const outlinePassConfig = {
  visible:true, //是否显示
  edgeStrength:5, //炫光强度
  edgeThickness:5, //炫光厚度
  edgeGlow : 1, //炫光辉度
  visibleEdgeColor:'#fa6e07', //炫光可见边缘颜色
  hiddenEdgeColor:'#fa6e07', //炫光隐藏边缘颜色
  pulsePeriod : 5 //炫光闪烁周期
}

onMounted(()=>{
  nextTick(()=>{
    threeRef.value.startClick('选择','dblclick')
    HThreeEditor =  threeRef.value.getThreeEditor()
    HThreeEditor.handler.openKeyEnable = true
    loadParams()
  })
})
const clickModel = (e,info)=>{
  console.log(e,info,'eeeeeeeeeeeeeeeeeee')
}
const addModel = async (modelConfig,params) =>{
  console.log(modelConfig,params,'modelConfig')
  let { createGsapAnimation, getObjectViews,initModel,getThreeEditor} = threeRef.value
  let group = await initModel({type:'FBX',url:modelConfig.url})
  group.scale.set(0.001, 0.001, 0.001)
  if(params) {
    group.children[0].position.x = params.x
    group.children[0].position.z = params.z
    group.position.x = params.x
    group.position.z = params.z
  }
  let {THREE} = threeRef.value
  // 获取模型的包围盒
  const box = new THREE.Box3().setFromObject(group);
  const boxBottom = box.min.y; // 获取模型底部的y坐标

  // 如果模型的底部位于y轴以下，将模型整体向上移动
  if (boxBottom < 0) {
    const offset = Math.abs(boxBottom); // 计算需要向上移动的距离
    group.children[0].position.y += offset; // 将模型向上移动
    group.position.y += offset;
  }

  const { maxView, target } = getObjectViews(group)
  HThreeEditor = getThreeEditor()
  console.log(group,'groupgroupgroupgroup')
  Promise.all([createGsapAnimation(HThreeEditor.camera.position, maxView), createGsapAnimation(HThreeEditor.controls.target, target)]).then(() => {
    HThreeEditor.transformControls.attach(group.children[0])
  })
}

const inputSceneName = ref('');
const dialogVisible = ref(false);
const dataCores = reactive({
  sceneName: localStorage.getItem('new_sceneName') || '',
  options: JSON.parse(localStorage.getItem('new_sceneList')) || []
})
const setMode = (mode) => {
  currentMode.value =  mode
}
const currentMode = ref('选中')
watch(currentMode, (val) => {
  HThreeEditor = threeRef.value.getThreeEditor()
  const { transformControls } = HThreeEditor
  if (val === '选中') {
    HThreeEditor.handler.mode = 'select'
    console.log(transformControls,'HThreeEditor.transformControls')
  } else HThreeEditor.handler.mode = 'transform'
  if (val === '平移') transformControls.setMode('translate')
  else if (val === '旋转') transformControls.setMode('rotate')
  else if (val === '缩放') transformControls.setMode('scale')
})
//导出场景配置
function exportTemplateJson() {
  HThreeEditor = threeRef.value.getThreeEditor()
  if (!HThreeEditor) return ElMessage.error('没有可导出的场景')
  const blob = new Blob([JSON.stringify(HThreeEditor.saveSceneEdit())], { type: 'application/json' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = (dataCores.sceneName || '场景') + '.json'
  link.click()
}
//新增场景
function createEditor() {
  if (dataCores.options.some(item => item.name === inputSceneName.value)) return ElMessage.error('场景名称已存在')
  dataCores.options.push({ name: inputSceneName.value })
  dataCores.sceneName = inputSceneName.value
  ElMessage.success(dataCores.sceneName + '添加成功')
  saveLocal()
  dialogVisible.value = false
}
function saveLocal() {
  localStorage.setItem('new_sceneList', JSON.stringify(dataCores.options))
  localStorage.setItem('new_sceneName', dataCores.sceneName)
}
//删除场景
function delScene(item) {
  const index = dataCores.options.findIndex(i => i.name === item.name)
  if (index > -1) {
    dataCores.options.splice(index, 1)
    localStorage.removeItem(item.name + '-newEditor')
    saveLocal()
    dataCores.sceneName = ''
    localStorage.removeItem('new_sceneName')
  }
}
//保存编辑
const saveParams = () =>{
  HThreeEditor = threeRef.value.getThreeEditor()
  if (dataCores.options.find(item => item.name === dataCores.sceneName)) localStorage.setItem(dataCores.sceneName + '-newEditor', JSON.stringify(HThreeEditor.saveSceneEdit()))
  else dataCores.sceneName = ''
  ElMessage.success('保存成功')
  saveLocal()
}
const changeScene = () =>{
  loadParams()
}
//回显编辑
const loadParams = () =>{
  HThreeEditor = threeRef.value.getThreeEditor()
  let json = JSON.parse(localStorage.getItem(dataCores.sceneName + '-newEditor'))
  if(json){
    HThreeEditor.resetEditorStorage(json)
  }
}
const openPanel = () =>{
  HThreeEditor.openControlPanel()
}
</script>

<style lang="less" scoped>
.header {
  background-color: #181818;
  height: 50px;
  border-bottom: 1px solid #404040;
  z-index: 10;
  position: absolute;
  width: 100%;
  &-box {
    height: 100%;
    padding: 0 20px;
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
  }

  &-left {
    display: flex;
    align-items: center;
  }

  .title {
    color: #E5EAF3;
    font-size: 18px;
    text-align: center;
    display: flex;
    align-items: center;
    height: 100%;
  }

  &-right {
    display: flex;
    justify-content: flex-end;
  }
}

.center-panel {
  background-color: #1e1e1e;
  width: 100%;
  position: absolute;
  top: 60px;
}

.top-toolbar {
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 4;
  padding: 4px 10px;
  border-radius: 8px;
  border: 1px solid #404040;
  display: flex;
  align-items: center;
  gap: 12px;
  backdrop-filter: blur(5px);
  transition: all 0.3s ease;
  background-color: rgba(45, 45, 45, 0.95);

  :deep(.el-radio-group) {
    display: flex;
    .is-active{
      background-color: #409eff;
    }
  }

  :deep(.el-radio-button__inner) {
    display: flex;
    align-items: center;
    padding: 6px 10px;
    font-size: 12px;
    transition: all 0.2s ease;
    background: transparent;
    border: 1px solid #404040;
    color: #ffffff;
    &:hover {
      background-color: #4a4a4a;
    }

    .el-icon {
      margin-right: 4px;
    }
  }
}
.btn-add {
  margin-left: 15px;
  color: #E5EAF3;
}
:deep(.el-select__wrapper){
  border: 1px solid #404040;
  background: transparent !important;
}
:deep(.el-input__wrapper){
  background-color: rgba(45, 45, 45, 0.95) !important;
}
:deep(.el-input__inner){
  background-color: transparent !important;
}


</style>