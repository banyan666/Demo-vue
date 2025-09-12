<template>
  <div style="height: 100%;width: 100%;position: relative">
    <ThreeLoading v-if="isLoading">
      <div>{{progress===100?'正在加载中':'模型下载中'+progress.toFixed(0)+'%'}}</div>
    </ThreeLoading>
    <div style="width: 100%;height: 100%" ref="threeRef"></div>
  </div>

</template>

<script setup>
window.THREE_EDITOR_NOTIP = true //删除广告提示
import ThreeLoading from '../../ThreeLoading/index.vue'
import {ThreeEditor,THREE,createGsapAnimation,getObjectViews} from 'three-edit-cores'
import {CSS3DSprite,CSS3DRenderer} from 'three/examples/jsm/renderers/CSS3DRenderer.js'
import { OutlinePass } from "three/examples/jsm/postprocessing/OutlinePass.js"
import css3dText from "./css3dText.js";
const props = defineProps({
  modelSize:{
    type:Number,
    default: 0.1
  },
  isUpdateCenter:{
    type: Boolean,
    default: true
  },
  sceneConfig: {
    type: Object,
    default: () => {
      return {
        background: '#01081f',
        opacity:1,
        grid:{
          show:true,
          size: 5000,
          divisions: 45,
          color: '#2d699f'
        },
        showAxes: false
      }
    },
  },
  lightConfig: {
    type: Object,
    default: () => {
      return {
        type:'HemisphereLight',
        color: '#ffffff',
        intensity: 10,
        position: {
          x: 0,
          y: 500,
          z: 0
        }
      }
    },
  },
  cameraConfig: {
    type: Object,
    default: () => {
      return {
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
    },
  },
  floodlightConfig: {
    type: Object,
    default: () => {
      return {
        visible:false,
        radius: 0.3,//半径
        strength:0.3,//强度
        threshold: 0.3 //阈值
      }
    },
  },
  outlinePassConfig:{
    type: Object,
    default: () => {
      return{
        visible:false,
        edgeStrength:3,
        edgeThickness : 1,
        edgeGlow : 0,
        visibleEdgeColor:'#ffffff',
        hiddenEdgeColor:'#190a05',
        pulsePeriod : 0
      }
    }
  }
});

const emit = defineEmits(['clickModel']);
let isLoading = ref(false)
let progress = ref(0)
const threeRef = ref(null);
onMounted(() => {
  nextTick(() => {
    initScene();
  });
});
/**
 * 创建一个3d场景
 */
let HThreeEditor = null;
let mouseDownPosition = null
const initScene = () =>{
  ThreeEditor.__EFFECTS__.push(customEffect);
  ThreeEditor.__DESIGNS__.unshift(css3dText)
  HThreeEditor =new ThreeEditor(threeRef.value,{

    fps: null, // fps

    pixelRatio: window.devicePixelRatio * 1, // 像素比

    webglRenderParams: { antialias: true, alpha: true, logarithmicDepthBuffer: true }, // webgl 渲染参数

  });
  setSceneConfig(props.sceneConfig)
  HThreeEditor.handler.helpers.axes.showAxes=false //关闭坐标轴
  setLightConfig(props.lightConfig)
  setFloodlightConfig(props.floodlightConfig)
  // 获取容器尺寸
  const width = threeRef.value.clientWidth;
  const height = threeRef.value.clientHeight;
  const labelRender = new CSS3DRenderer();
  labelRender.setSize(width, height);
  labelRender.domElement.style.position = "absolute";
  labelRender.domElement.style.top = "0px";
  labelRender.domElement.style.pointerEvents = "none";
  threeRef.value.appendChild(labelRender.domElement);
}
/**
 * 设置场景配置
 * @param config
 */
const setSceneConfig = (config) =>{
  let {background='#01081f',opacity=1,grid={}} = config
  let {size=5000,divisions=45,color='#2d699f',show=true,showAxes=false} = grid
  HThreeEditor.renderer.setClearColor(background, opacity)
  HThreeEditor.handler.helpers.grid.size = size
  HThreeEditor.handler.helpers.grid.divisions = divisions
  HThreeEditor.handler.helpers.grid.colorGrid = color
  HThreeEditor.handler.helpers.grid.colorCenterLine = color
  HThreeEditor.handler.helpers.axes.axesLength = 50
  setShowGrid(show)
  setShowAxes(showAxes)
}
/**
 * 显示坐标轴
 */
const setShowAxes = (show) =>{
  if(HThreeEditor){
    HThreeEditor.handler.helpers.axes.showAxes=show
  }
}
/**
 * 显示网格
 */
const setShowGrid = (show) =>{
  if(HThreeEditor){
    HThreeEditor.handler.helpers.grid.showGrid=show
  }
}

/**
 * 设置灯光配置
 * @param config
 */
const setLightConfig = (config) =>{
  let {type='HemisphereLight',color='#ffffff',intensity=10,position={}} = config
  let {x=0,y=0,z=0}=position
  let light = new THREE[type](color, intensity)
  light.color=new THREE.Color(color);
  light.intensity = intensity;
  light .position.set(x, y, z);
  HThreeEditor.scene.add(light)

  // HThreeEditor.setLight(type, { color, intensity }).position.set(x, y, z);
}
/**
 * 获取灯光配置列表
 * @return {key:value}
 */
const getLightCode = () =>{
  return HThreeEditor && HThreeEditor.lightCores.list
}
/**
 * 设置泛光
 * @param config
 */
const setFloodlightConfig = (config) =>{
  let {visible=false,radius=0.3,strength=0.3,threshold=0.3} = config
  let unrealBloomPass = HThreeEditor.effectComposer?.effectPass?.unrealBloomPass
  if(unrealBloomPass){
    unrealBloomPass.enabled = visible
    unrealBloomPass.threshold = threshold
    unrealBloomPass.strength = strength
    unrealBloomPass.radius = radius
  }
}
/**
 * 开启鼠标事件
 * @param {string} mode - 鼠标点击模式，默认为选择模式
 *  '选择' - 选择模式，默认(有模型选中效果)
 *  '根选择' - 根选择模式，选择根节点
 *  '变换' - 修改模型位置
 *  '点击信息' - 点击信息模式(无模型选中效果)
 *  @param {string} type -
 *  鼠标点击事件类型，默认为click
 *  'dblclick' - 双击模式
 */
let clickType=''
// 创建射线投射器
const rayCaster = new THREE.Raycaster()
// 鼠标位置
const startClick = (mode='选择',type='click') =>{
  let selectType = 'select'
  if(mode==='根选择'){
    HThreeEditor.handler.selectChildEnabled = false
  }else if(mode==='选择'){
    HThreeEditor.handler.selectChildEnabled = true
  } else if(mode==='变换'){
    selectType = 'transform'
  } else{
    selectType = 'none'
  }
  HThreeEditor.handler.mode = selectType
  mouseDownPosition= new THREE.Vector2();
  clickType= type
  threeRef.value.addEventListener(type, mouseClick)
  threeRef.value.addEventListener('mousedown', mouseDown)
}
const mouseClick = (event) => {
  const distance = Math.sqrt(
      Math.pow(event.clientX - mouseDownPosition.x, 2) +
      Math.pow(event.clientY - mouseDownPosition.y, 2)
  )
  if (distance > 5) {
    return;
  }
  // 得到鼠标相对于容器的坐标
  mouseDownPosition.x = ( event.clientX / window.innerWidth ) * 2 - 1;
  mouseDownPosition.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

  // 执行射线检测
  rayCaster.setFromCamera(mouseDownPosition, HThreeEditor.camera);
  // 射线涉及到的物体集合
  const intersects = rayCaster.intersectObjects(HThreeEditor.scene.children, true)

  // todo
  // 以下编写点击事件后需要做的内容
  console.log('intersects:', intersects)
  if(intersects.length===1 && intersects[0].object.mode==='translate'){
    emit('clickModel',event,null)
  }else{
    HThreeEditor&&HThreeEditor.getSceneEvent(event,info=>{
      emit('clickModel',event,info)
    })
  }
};
const mouseDown = (event)=>{
  mouseDownPosition.x = event.clientX;
  mouseDownPosition.y = event.clientY;
}
/**
 * 初始化模型-自动计算相机视角在模型的右上角
 * @param {Object} modelConfig - 模型配置对象
 * @param {string} modelConfig.type - 模型类型（FBX/GLTF/OBJ）
 * @param {string} modelConfig.url - 模型文件的 URL 路径
 * @returns {Object} group - 返回加载后的模型对象
 */
const initModel = (modelConfig) => {
  if (!(modelConfig.type && modelConfig.url)) {
    throw new Error('Invalid model config');
  }

  try {
    isLoading.value = true;
    const model = HThreeEditor.modelCores.loadModel({...modelConfig});
    const { loaderService } = model;

    // 进度更新处理
    loaderService.progress = (total, loaded) => {
      // 正确的进度计算
      progress.value = total* 100;
    };
    let size=props.modelSize || 0.1
    // 将 complete 事件封装为 Promise
    const loadPromise = new Promise((resolve, reject) => {
      loaderService.complete = (group) => {
        isLoading.value = false;
        // 模型加载完成
        group.scale.set(size,size,size) //模型缩放
        props.isUpdateCenter&&setCameraCenter(group)
        window.addEventListener('resize', onWindowResize)
        console.log(group,'groupgroup')
        resolve(group);
      };

      loaderService.error = (error) => {
        isLoading.value = false;
        reject(error);
      };
    });

    return loadPromise;

  } catch (error) {
    isLoading.value = false;
    throw error;
  }
};
/**
 * 渲染模型后设置相机在模型中心
 * @param group
 */
const setCameraCenter = (group) => {
  let {near=0.6,maxPolarAngle=1.5,minDistance=0.1,maxDistance=100000,position={x:0,y:0,z:0}} = props.cameraConfig
  // 创建模型的边界框
  const box = new THREE.Box3().setFromObject(group);

  // 如果边界框无效，使用默认值
  if (box.isEmpty()) {
    box.setFromCenterAndSize(
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(10, 10, 10)
    );
  }

  // 获取边界框的中心点和尺寸
  const center = box.getCenter(new THREE.Vector3());
  const size = box.getSize(new THREE.Vector3());

  // 计算模型的最大尺寸
  const maxSize = Math.max(size.x, size.y, size.z);

  // 计算相机距离 - 添加缩放系数使相机更近
  const fovRad = HThreeEditor.camera.fov * Math.PI / 180;

  // 关键修改：添加近距系数 (0.6-0.8之间)
  const nearFactor = near;

  const distance = Math.max(
      maxSize / (2 * Math.tan(fovRad / 2)) * nearFactor, // 应用近距系数
      maxSize * nearFactor // 同时缩小这个值
  );

  // 设置相机位置 - 使用更接近的视角
  const cameraPosition = new THREE.Vector3(
      center.x + position.x,
      center.y + distance * 0.8 + position.y, // 减少仰角高度
      center.z + distance * 1 + position.z,  // 减少Z轴距离
  );

  // 创建轨道控制目标点
  const controls = HThreeEditor.controls;
  if (controls) {
    controls.target.copy(center);
    controls.maxPolarAngle = maxPolarAngle; // 关键修改：设置最大仰角
    controls.update();
  }

  // 设置相机位置和方向
  HThreeEditor.camera.position.copy(cameraPosition);
  HThreeEditor.camera.lookAt(center);

  // 自动调整近远裁剪平面 - 根据新距离调整
  const minDis = distance / 50; // 减少分母使近平面更近
  const maxDis = distance * 50; // 减少倍数使远平面更近

  HThreeEditor.camera.near = Math.max(minDis, minDistance);//相机最近距离
  HThreeEditor.camera.far = Math.min(maxDis, maxDistance);//相机最远距离

  // 根据窗口尺寸调整FOV
  const aspect = HThreeEditor.renderer.domElement.clientWidth /
      HThreeEditor.renderer.domElement.clientHeight;
  HThreeEditor.camera.aspect = aspect;

  // 更新投影矩阵
  HThreeEditor.camera.updateProjectionMatrix();

  // 添加调试信息
  console.log(`相机设置:
    模型尺寸: ${maxSize.toFixed(2)}
    相机距离: ${distance.toFixed(2)}
    相机位置: (${cameraPosition.x.toFixed(2)}, ${cameraPosition.y.toFixed(2)}, ${cameraPosition.z.toFixed(2)})
    目标位置: (${center.x.toFixed(2)}, ${center.y.toFixed(2)}, ${center.z.toFixed(2)})
  `);
}

/**
 * 获取HThreeEditor实例
 * @return {HThreeEditor}
 * 返回一个HThreeEditor实例
 * 可结构出Three.js原生的对象
 * {scene, camera, renderer, controls, transformControls, ...} =HThreeEditor
 */
const getThreeEditor = () => HThreeEditor

/**
 * 传入模型，获取模型中心点
 * @param object
 * @return {*}
 */
const getModelCenter = (object) =>{
  // 获取模型世界坐标
  const worldPos = new THREE.Vector3();
  //获取子模型中心点
  const box = new THREE.Box3().setFromObject(object);
  const center = box.getCenter(worldPos)
  return center
}

/**
 * 创建3D标签
 * 返回一个CSS3DSprite对象
 * @return tag: CSS3DSprite
 */
const create3DSprite = () =>{
  const div = document.createElement("div");
  const tag = new CSS3DSprite(div);
  return tag
}
/**
 * 销毁3D场景渲染
 */
const destroySceneRender = () => HThreeEditor && HThreeEditor.destroySceneRender();
//窗口重置
const onWindowResize = () =>{
  HThreeEditor && HThreeEditor.renderSceneResize()
}
/**
 * 开启旋转
 * @param isStart 是否开始旋转
 * @param speed 旋转速度
 */
const openStartRotate = (isStart=false,speed=1.5) =>{
  HThreeEditor.controls.autoRotate = isStart;
  HThreeEditor.controls.autoRotateSpeed = speed;
}

onUnmounted(() => {
  window.removeEventListener(clickType, mouseClick)
  window.removeEventListener('mousedown', mouseDown)
  window.removeEventListener('resize', onWindowResize)
  destroySceneRender()
});
//自定义后期外轮廓炫光
const install = ({ scene, camera, renderer }) => {
  // 创建轮廓效果
  const outlinePass = new OutlinePass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      scene,
      camera
  );
  let {visible=false, edgeStrength=3,
    edgeThickness =1,
    edgeGlow =0,
    visibleEdgeColor='#ffffff',
    hiddenEdgeColor='#190a05',
    pulsePeriod = 0}=props.outlinePassConfig
  // 设置默认参数
  outlinePass.enabled = visible;
  outlinePass.edgeStrength = edgeStrength;       // 边缘强度
  outlinePass.edgeGlow = edgeGlow;           // 边缘发光
  outlinePass.edgeThickness = edgeThickness;      // 边缘厚度
  outlinePass.pulsePeriod = pulsePeriod;          // 脉冲周期 (0表示无脉冲)
  outlinePass.visibleEdgeColor.set(visibleEdgeColor); // 可见边缘颜色
  outlinePass.hiddenEdgeColor.set(hiddenEdgeColor);  // 隐藏边缘颜色


  return outlinePass;
}

const getStorage = (outlinePass) => {
  return {
    enabled: outlinePass.enabled,
    edgeStrength: outlinePass.edgeStrength,
    edgeThickness: outlinePass.edgeThickness,
    edgeGlow: outlinePass.edgeGlow,
    visibleEdgeColor: outlinePass.visibleEdgeColor.getHex(),
    hiddenEdgeColor: outlinePass.hiddenEdgeColor.getHex(),
    pulsePeriod: outlinePass.pulsePeriod,
  };
}

const setStorage = (outlinePass, storage) => {
  if (storage.enabled !== undefined) outlinePass.enabled = storage.enabled;
  if (storage.edgeGlow !== undefined) outlinePass.edgeGlow = storage.edgeGlow;
  if (storage.edgeStrength !== undefined) outlinePass.edgeStrength = storage.edgeStrength;
  if (storage.edgeThickness !== undefined) outlinePass.edgeThickness = storage.edgeThickness;
  if (storage.pulsePeriod !== undefined) outlinePass.pulsePeriod = storage.pulsePeriod;
  if (storage.visibleEdgeColor !== undefined) {
    outlinePass.visibleEdgeColor.setHex(storage.visibleEdgeColor);
  }
  if (storage.hiddenEdgeColor !== undefined) {
    outlinePass.hiddenEdgeColor.setHex(storage.hiddenEdgeColor);
  }
}

const createPanel = (outlinePass, folder) => {
  folder.add(outlinePass, 'edgeStrength', 0, 10).name('炫光强度');
  folder.add(outlinePass, 'edgeThickness', 0, 10).step(0.1).name('炫光厚度');
  folder.add(outlinePass, 'edgeGlow', 0, 10).name('炫光辉度');
  folder.add(outlinePass, 'pulsePeriod', 0, 10).name('炫光周期');
  folder.addColor({ color: '#' + outlinePass.visibleEdgeColor.getHexString() }, 'color')
      .name('炫光可见边缘颜色')
      .onChange(val => outlinePass.visibleEdgeColor.set(val));

  folder.addColor({ color: '#' + outlinePass.hiddenEdgeColor.getHexString() }, 'color')
      .name('炫光隐藏边缘颜色')
      .onChange(val => outlinePass.hiddenEdgeColor.set(val));
}

const customEffect = {
  name: 'outlinePass1',
  label: '轮廓炫光',
  order: 80,
  install,
  getStorage,
  setStorage,
  createPanel
}
/**
 * 获取轮廓炫光对象
 * @return {outLinePass}
 */
const getOutlinePass = () => HThreeEditor && HThreeEditor.effectComposer.effectPass.outlinePass1

/**
 * 创建3D文本标签
 * @param params
 * params:{
 *   text: '标签内容';
 *   fontSize: 20;
 *   color: '#ffffff';
 *   bold:'bold',
 *   isOpenClick:false
 * }
 * @return {*}
 */
const create3DText = (params) =>{
  return css3dText.create(params, HThreeEditor)
}

/**
 * 开始绘制管道
 */
let drawCallback = null
let moveDrawCallback = null
let drawEndCallback = null
const startDrawPipe = (callback,moveCallback,endCallback) =>{
  drawCallback=callback
  moveDrawCallback=moveCallback
  drawEndCallback = endCallback
  threeRef.value.addEventListener('click', onDrawClick)
  threeRef.value.addEventListener('mousemove', onMoveDrawClick)
  threeRef.value.addEventListener('contextmenu', onDrawRightClick)
}
/**
 * 停止绘制管线
 */
const stopDrawPipe = () =>{
  onDrawRightClick()
}
/**
 * 绘制管线左键方法
 */

const onDrawClick = (event) =>{
  let intersectPoint = getIntersectPoint(event)
  drawCallback([...intersectPoint])
  return [...intersectPoint]
}
const onMoveDrawClick = (event) =>{
  let intersectPoint = getIntersectPoint(event)
  throttledMoveDrawCallback([...intersectPoint])
  return [...intersectPoint]
}
const getIntersectPoint = (event) =>{
  event && event.preventDefault();
  const raycaster = new THREE.Raycaster()
  const mouse= new THREE.Vector2();
  // 计算鼠标在3D空间中的位置
  const rect = event.target.getBoundingClientRect();

  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

  raycaster.setFromCamera(mouse, HThreeEditor.camera);

  const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
  const intersectPoint = new THREE.Vector3();
  raycaster.ray.intersectPlane(plane, intersectPoint);
  return [intersectPoint.x, intersectPoint.y || 0.5, intersectPoint.z]
}
const onDrawRightClick = (event) =>{
  event && event.preventDefault();
  console.log('取消绘制')
  threeRef.value.removeEventListener('click', onDrawClick)
  threeRef.value.removeEventListener('mousemove', onMoveDrawClick)
  drawEndCallback && drawEndCallback(false)
}
// 节流函数
const throttle = (func, delay) => {
  let lastTime = 0;
  return (...args) => {
    const now = Date.now();
    if (now - lastTime >= delay) {
      func(...args);
      lastTime = now;
    }
  };
};
// 创建节流后的 moveDrawCallback 函数
const throttledMoveDrawCallback = throttle((intersectPoint) => {
  moveDrawCallback(intersectPoint);
}, 300);
/**
 * 暴露方法与属性
 */
defineExpose({
  THREE,
  createGsapAnimation,
  getObjectViews,
  initModel,
  getThreeEditor,
  destroySceneRender,
  startClick,
  create3DSprite,
  getModelCenter,
  openStartRotate,
  setLightConfig,
  getLightCode,
  setCameraCenter,
  getOutlinePass,
  create3DText,
  setShowAxes,
  setShowGrid,
  startDrawPipe,
  stopDrawPipe
})
</script>

<style scoped>

</style>