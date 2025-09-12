<template>
  <div>
    <div class="right-box" v-show="leftCollapsed" >
      <div class="right">
        <div class="content-panel">
          <el-tabs type="border-card" v-if="leftCollapsed">
            <el-tab-pane label="场景选项">
              <!-- 简化后的辅助工具控制面板 -->
              <div class="helper-controls">
                <div class="control-group">
                  <div class="group-header">
                    <span class="group-title">场景选项</span>
                    <div class="divider"></div>
                  </div>

                  <div class="control-options">

                    <el-checkbox v-model="showGrid" @change="toggleGrid">
                      <div class="option-label">
                        <el-icon>
                          <Grid />
                        </el-icon>
                        <span>显示网格</span>
                      </div>
                    </el-checkbox>

                    <el-checkbox v-model="showAxes" @change="toggleAxes">
                      <div class="option-label">
                        <el-icon>
                          <ScaleToOriginal />
                        </el-icon>
                        <span>显示坐标轴</span>
                      </div>
                    </el-checkbox>
                  </div>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="绘制管线">
              <div class="helper-controls">
                <div class="control-group">
                  <div class="group-header">
                    <span class="group-title">管线配置</span>
                    <div class="divider"></div>
                  </div>
                  <el-form ref="pipeForm" :model="pipeConfig" label-width="80px">
                    <el-form-item label="条纹间隔">
                      <el-input v-model="pipeConfig.space"></el-input>
                    </el-form-item>
                    <el-form-item label="条纹宽度">
                      <el-input v-model="pipeConfig.stripeWidth"></el-input>
                    </el-form-item>
                    <el-form-item label="条纹速度">
                      <el-input v-model="pipeConfig.speed"></el-input>
                    </el-form-item>
                    <el-form-item label="管道半径">
                      <el-input v-model="pipeConfig.radius"></el-input>
                    </el-form-item>
                  </el-form>
                </div>
                <div class="control-group">
                  <div class="group-header">
                    <div style="display: flex;align-items: center">
                      <span class="group-title">管线列表</span>
                      <span style="padding-left: 10px;cursor: pointer">
                      <el-icon size="24" @click="addPipeLine"><CirclePlus /></el-icon>
                    </span>
                    </div>
                    <div class="divider"></div>
                  </div>
                  <div style="height: 50vh;overflow-y: auto">
                    <el-form ref="pipeForm" :model="pipeParams" label-width="80px">
                      <div v-for="(item,index) in pipeParams">
                        <el-form-item label="管道名称">
                          <el-input v-model="item.name"></el-input>
                        </el-form-item>
                        <div style="display: flex;">
                          <el-form-item label="管道颜色">
                            <el-color-picker v-model="item.color"></el-color-picker>
                          </el-form-item>
                          <el-form-item label="条纹颜色">
                            <el-color-picker v-model="item.stripeColor"></el-color-picker>
                          </el-form-item>
                        </div>
                        <el-form-item label="管道方向">
                          <el-radio-group v-model="item.direction">
                            <el-radio :value="1" size="large">正向</el-radio>
                            <el-radio :value="-1" size="large">逆向</el-radio>
                          </el-radio-group>
                        </el-form-item>
                        <el-form-item label="管道点组">
                          <div v-for="(point,p_index) in item.points" :key="item.key" style="display: flex;align-items: center;margin-bottom: 5px">
                            <el-input @blur="(value)=>pointsChange(value,index,p_index)" @focus="()=>positionPoint(index,p_index)" placeholder="请输入点坐标" v-model="point.point"></el-input>
                            <el-icon size="24" color="#f56c6c" style="margin-left: 5px;cursor: pointer" @click="deletePipePoint(index,p_index)"><Remove /></el-icon>
                          </div>

                        </el-form-item>
                        <div style="display: flex;justify-content: space-between">
                          <div>
                            <el-button type="primary" size="small" @click="startDrawPipe(index)">绘制</el-button>
                            <el-button type="primary" size="small" @click="editPipe(index)">编辑</el-button>
                          </div>
                          <el-button type="danger" size="small" @click="deletePipe(index)">删除</el-button>
                        </div>
                        <div class="divider" style="margin: 10px 0px"></div>
                      </div>

                    </el-form>
                  </div>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="其他">其他</el-tab-pane>
          </el-tabs>

        </div>
      </div>
    </div>
    <div class="panel-toggle" :style="{right: leftCollapsed ? '400px' : '0'}" @click="leftCollapsed = !leftCollapsed">
      <el-icon color="#ffffff">
        <ArrowRight v-if="leftCollapsed"/>
        <ArrowLeft v-else/>
      </el-icon>
    </div>
  </div>
</template>

<script setup>
import {Grid,ScaleToOriginal,ArrowRight,ArrowLeft,CirclePlus,Remove} from '@element-plus/icons-vue'

const props = defineProps({
  threeEditor:{
    type:Object,
    default:()=>{}
  }
})
const emit = defineEmits(['setMode'])
let HThreeEditor = null
let Three = null
onMounted(()=>{
  nextTick(()=>{
    let {THREE,getThreeEditor} = props.threeEditor
    HThreeEditor = getThreeEditor()
    Three = THREE
  })
})
const leftCollapsed = ref(true)
const showGrid = ref(true)
const showAxes = ref(false)
const toggleGrid = (value) => {
  console.log(props.threeEditor.getThreeEditor())
  props.threeEditor?.setShowGrid(value)
}
const toggleAxes = (value) => {
  props.threeEditor?.setShowAxes(value)
}

/**
 * 管线相关 start
 */
const pipeConfig = reactive({
  space:2.5,
  stripeWidth:2.5,
  speed:3,
  radius:0.25
})
// 管道模型列表
let pipeMeshList = [
  {
    key:1,
    mesh:null
  }
]
//管点列表
let ballMeshList = []
// 管道数据列表
const pipeParams = reactive([
  {
    key:1,
    name:'',
    color:'#028af8',
    stripeColor:'#0760d0',
    direction:1,
    points:[
      // {
      //   key:1,
      //   point:[0,0,0]
      // }
    ]
  }
])
/**
 * 新增管线
 */
const addPipeLine = () =>{
  let date = Date.now()
  pipeParams.push({
    key:date,
    name:'',
    color:'#028af8',
    stripeColor:'#0760d0',
    direction:1,
    points:[]
  })
  pipeMeshList.push({
    key:date,
    mesh:null
  })
}

/**
 * 删除管线相关配置以及辅助模型
 * @param index
 */
const deletePipe = (index) =>{
  props.threeEditor.stopDrawPipe() //关闭绘制
  pipeParams.splice(index,1)
  if(pipeMeshList[index].mesh){
    HThreeEditor.scene.remove(pipeMeshList[index].mesh)
    pipeMeshList[index].mesh = null
  }
  pipeMeshList.splice(index,1)
  if(ballMeshList[index]){
    ballMeshList[index].points.forEach(item=>HThreeEditor.scene.remove(item))
  }
  ballMeshList.splice(index,1)
}
let temporaryPipe = null //临时管线
//开始绘制管线
const startDrawPipe = (index) => {
  props.threeEditor.startDrawPipe((point)=>{
    if(temporaryPipe){
      HThreeEditor.scene.remove(temporaryPipe)
    }
    let date = Date.now()
    let obj = {key: date, point:point}
    pipeParams[index].points.push(obj)
    if(pipeMeshList[index].mesh){
      HThreeEditor.scene.remove(pipeMeshList[index].mesh)
      pipeMeshList[index].mesh = null
    }
    let {mesh} = createPipeLine(pipeParams[index])
    pipeMeshList[index].mesh = mesh
    let ballPoint=createBall(obj)
    if(ballMeshList[index]){
      ballMeshList[index].points.push(ballPoint)
    }else{
      ballMeshList[index] = {
        key:date,
        points:[ballPoint]
      }
    }
  },(point)=>{
    if(temporaryPipe){
      HThreeEditor.scene.remove(temporaryPipe)
    }
    if(pipeMeshList[index].mesh){
      pipeMeshList[index].mesh.visible = false
    }
    let date = Date.now()
    if(pipeParams[index].points.length>0){
      let obj = {
        ...pipeParams[index],
        active:false,
        points:[
            ...pipeParams[index].points
        ]
      }
      obj.points.push({
        key:date,
        point:point
      })
      let {mesh}=createPipeLine(obj)
      temporaryPipe = mesh

    }
  },()=>{
    if(pipeMeshList[index] && pipeMeshList[index].mesh){
      pipeMeshList[index].mesh.visible = true
    }
    if(temporaryPipe){
      HThreeEditor.scene.remove(temporaryPipe)
    }
  })
}

const pointsChange = (value,index,p_index) =>{
  console.log(value,'vvvvvvvvvvvvvvvvvvv')
  let arr=value.split(',')
  pipeParams[index].points[p_index].point=[parseFloat(arr[0]),parseFloat(arr[1]),parseFloat(arr[2])]
}
/**
 * 定位点位
 */
const positionPoint = (index,p_index) =>{
  if(isEdit && isIndex === index){
    HThreeEditor.transformControls.attach(ballMeshList[index].points[p_index]);
  }
}
let isIndex = null
let isEdit = false
let objectChangeCallback = null;  // 在外部定义回调函数

/**
 * 编辑管线
 * @param index
 */
const editPipe = (index) => {
  props.threeEditor.stopDrawPipe() //关闭绘制
  emit('setMode', '平移')
  HThreeEditor.transformControls.removeEventListener('objectChange', objectChangeCallback);
  if (index === isIndex) {
    isEdit = false;
    isIndex = null;
    HThreeEditor.transformControls.detach() //隐藏控制器
  } else {
    isEdit = true;
    isIndex = index;
  }

  ballMeshList.forEach((item, i) => {
    if (i === index) {
      item.points.forEach(item => { item.visible = isEdit });
    } else {
      item.points.forEach(item => item.visible = false);
    }
  });

  // 仅定义一次回调函数
  objectChangeCallback = (e) => {
    if(e.target.object.userData.type!=='管点') return
    pipeParams[index].points.forEach(item => {
      if (item.key === e.target.object.userData.key) {
        item.point = [e.target.object.position.x, e.target.object.position.y, e.target.object.position.z];
      }
    });
    if(pipeMeshList[index].mesh){
      HThreeEditor.scene.remove(pipeMeshList[index].mesh)
      pipeMeshList[index].mesh = null
    }
    let {mesh} = createPipeLine(pipeParams[index])
    pipeMeshList[index].mesh = mesh
  };

  if (isEdit) {
    HThreeEditor.transformControls.addEventListener('objectChange', objectChangeCallback);
    if (ballMeshList[index] && ballMeshList[index].points) {
      HThreeEditor.transformControls.attach(ballMeshList[index].points[ballMeshList[index].points.length - 1]);
    }
  }
};
/**
 * 删除管点重绘管线
 * @param index
 * @param p_index
 */
const deletePipePoint = (index, p_index) =>{
  props.threeEditor.stopDrawPipe() //关闭绘制
  pipeParams[index].points.splice(p_index,1)
  if(pipeMeshList[index].mesh){
    HThreeEditor.scene.remove(pipeMeshList[index].mesh)
  }
  let {mesh} = createPipeLine(pipeParams[index])
  pipeMeshList[index].mesh = mesh
  if(ballMeshList[index].points[p_index]){
    HThreeEditor.scene.remove(ballMeshList[index].points[p_index])
    ballMeshList[index].points.splice(p_index,1)
  }
}
/**
 * 绘制管线
 * @param config
 * @return {{uniforms: {stripeSpacing: {value: number}, stripeColor: {value: *}, stripeOffset: {value: number}, speedFactor: {value: number}, totalLength: {value: *}, stripeWidth: {value: number}}, mesh: *}}
 */

function createPipeLine(config) {
  let THREE = Three
  let scene = HThreeEditor.scene
  let { points = [], color = '#19bbd5', stripeColor = '#096be3', direction = 1, name = '水管',active=true } = config;

  if (points.length <= 1) {
    return false;
  }

  const curvePath = new THREE.CurvePath();
  let curvePoints = []
  for (let i = 0; i < points.length; i++) {
    const current = points[i].point;
    curvePoints.push(new THREE.Vector3(...current))
  }
  const cornerCurve = new THREE.CatmullRomCurve3(curvePoints);
  curvePath.add(cornerCurve);

  // 创建管道几何体
  const segments = Math.max(100, Math.floor(curvePath.getLength() / 20));
  const geometry = new THREE.TubeGeometry(
      curvePath,
      segments,
      pipeConfig.radius || 0.5,
      32, // 增加径向分段提高曲线质量
      false
  );

  const material = new THREE.MeshLambertMaterial({
    color: color,
    side: THREE.DoubleSide,
  });

  const length = curvePath.getLength();
  const uniforms = {
    totalLength: { value: length },
    stripeOffset: { value: 0 },
    stripeWidth: { value: pipeConfig.stripeWidth ||5 },
    stripeSpacing: { value: pipeConfig.space || 5 },
    stripeColor: { value: new THREE.Color(stripeColor) },
    speedFactor: { value: pipeConfig.speed || 5 },
  };

  // 修复的着色器代码
  material.onBeforeCompile = shader => {
    shader.uniforms.totalLength = uniforms.totalLength;
    shader.uniforms.stripeOffset = uniforms.stripeOffset;
    shader.uniforms.stripeWidth = uniforms.stripeWidth;
    shader.uniforms.stripeSpacing = uniforms.stripeSpacing;
    shader.uniforms.stripeColor = uniforms.stripeColor;

    shader.fragmentShader = `
        uniform float totalLength;
        uniform float stripeOffset;
        uniform float stripeWidth;
        uniform float stripeSpacing;
        uniform vec3 stripeColor;

        ${shader.fragmentShader}
        `.replace(
        `#include <color_fragment>`,
        `#include <color_fragment>

        // 计算归一化的位置
        float position = vUv.x;

        // 计算周期长度（归一化）
        float period = (stripeWidth + stripeSpacing) / totalLength;

        // 计算在周期内的位置（考虑偏移）
        float cyclePos = fract(position / period - stripeOffset);

        // 计算条纹比例
        float stripeRatio = stripeWidth / (stripeWidth + stripeSpacing);
        float isStripe = step(cyclePos, stripeRatio);

        // 平滑边缘处理
        float edge = fwidth(cyclePos) * 1.5;
        float smoothFactor = smoothstep(0.0, edge, cyclePos) *
                             (1.0 - smoothstep(stripeRatio - edge, stripeRatio, cyclePos));

        // 混合颜色
        diffuseColor.rgb = mix(diffuseColor.rgb, stripeColor, isStripe * smoothFactor);
      `
    );
  };

  material.defines = { 'USE_UV': '' };
  const mesh = new THREE.Mesh(geometry, material);
  mesh.name = name;
  scene.add(mesh);

  // 动画循环保持不变
  const clock = new THREE.Clock();
  function animation() {
    const delta = clock.getDelta();

    // 关键修改：根据实际长度计算偏移量，保持实际速度一致
    const speedPerSecond = uniforms.speedFactor.value;
    const actualDistanceMoved = speedPerSecond * delta * direction;
    uniforms.stripeOffset.value += actualDistanceMoved / uniforms.stripeWidth.value;

    // 确保偏移量在合理范围内
    uniforms.stripeOffset.value %= 1.0;

    requestAnimationFrame(animation);
  }
  active && animation();
  return { mesh, uniforms };
}
/**
 * 绘制管点
 * @param config
 * @return {*}
 */
const createBall = (config) =>{
  let THREE = Three
  let scene = HThreeEditor.scene
  let { point} = config
  const sphereGeometry = new THREE.SphereGeometry(pipeConfig.radius*1.5, 16, 16);
  const sphereMaterial = new THREE.MeshBasicMaterial({
    color: 0xff9900,
    transparent: true,
    opacity: 0.8
  });

  const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
  sphere.position.set(
      point[0],
      point[1],
      point[2]
  );

  // 存储点的引用
  sphere.userData = {...config,type:'管点'};

  scene.add(sphere);
  sphere.visible = isEdit

  return sphere
}
</script>

<style lang="less" scoped>
.right-box{
  position: absolute;
  width: 400px;
  height: calc(100% - 51px);
  top: 51px;
  right: 0;
}
.right {
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: #181818;
  display: flex;
  color: #f3f0f0;
  z-index: 100;
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
  &:hover {
    background-color: #444;
  }
}
.icon-arrow-right{
  position: absolute;
  right: 280px
}

/* 辅助工具控制面板样式 */
.helper-controls {
  margin-top: 10px;
  width: 100%;
  padding: 0 10px;
  box-sizing: border-box;
}

.control-group {
  background-color: rgba(30, 30, 30, 0.6);
  border-radius: 8px;
  padding: 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

.group-header {
  margin-bottom: 12px;
  display: flex;
  flex-direction: column;
}

.group-title {
  font-size: 15px;
  font-weight: 500;
  color: #a8d4fd;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.divider {
  height: 1px;
  background: linear-gradient(90deg, rgba(168, 212, 253, 0.3), transparent);
  width: 100%;
}

.control-options {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
}

.option-label {
  display: flex;
  align-items: center;
  gap: 8px;
}

.option-label .el-icon {
  color: #a8d4fd;
}
:deep(.el-checkbox) {
  .el-checkbox__label {
    color: #e5eaf3;
    font-size: 14px;
  }
}
:deep(.el-tabs--border-card){
  background: transparent;
  border: 1px solid #4a4a4a !important;
}
:deep(.el-tabs--border-card>.el-tabs__header){
  background-color: transparent;
  border-bottom: 1px solid #4a4a4a !important;
}
:deep(.el-tabs--border-card>.el-tabs__header .el-tabs__item.is-active){
  background-color: #76787d;
  color: #b6d3f4 !important;
  border-right: 1px solid #4a4a4a !important;
}
:deep(.el-tabs__item){
  color: #f3f0f0 !important;
  border-bottom-color: #4a4a4a !important;
  border-left: 1px solid #4a4a4a !important;
}
:deep(.el-form-item__label){
  color:#ffffff;
}
:deep(.el-input__inner){
  color:#ffffff;
}
:deep(.el-input__wrapper){
  box-shadow: 0 0 0 0 ;
}
</style>
