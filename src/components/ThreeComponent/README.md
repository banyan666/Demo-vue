## HThree组件对Three.js以及three-edit编辑器进行合并封装
# HThree - 3D模型渲染组件
## 使用方法-可参考demo目录下参考示例，替换其中的模型地址，然后在页面引入demo组件即可查看渲染效果
```vue
<template>
  <div style="height: 100%;width: 100%;">
    <HThree ref="threeRef" 
            :modelSize="modelSize" 
            :isUpdateCenter="isUpdateCenter" 
            :sceneConfig="sceneConfig" 
            :lightConfig="lightConfig" 
            :cameraConfig="cameraConfig" 
            :floodlightConfig="floodlightConfig"
            :outlinePassConfig="outlinePassConfig"
            @clickModel="clickModel">
    </HThree>
  </div>
</template>

<script setup>
import {HThree} from "../ThreeComponent/HThree/h-three.js";
import  "../ThreeComponent/HThree/style.css";
const threeRef = ref(null);
let HThreeEditor = null
onMounted(()=>{
  //初始化模型，返回模型组对象。因为需要拿到组件实例，需放在nextTick。
  //注意：url地址必须是绝对路径，模型可以放在public静态资源目录下，或者使用绝对路径src/....，或者文件放在服务器上，访问服务器地址
  nextTick(async ()=>{
      let group =await threeRef.value.initModel({type:'FBX',url:'/dp/fbx/sanxitong.fbx'})
      console.log(group,'ggggg')
      let{getThreeEditor}=threeRef.value
      HThreeEditor = getThreeEditor() //返回Three.js编辑器实例
      console.log(HThreeEditor,'HThreeEditor')
      traversalGroup(group)
      threeRef.value.startClick('选择')
  })
})

//要启动点击事件需要在加载模型后startClick()开启点击事件
const clickModel = (e,info) =>{
  console.log(e,info,'eeeeeeeeeeeeeeeeeee')
}
//拿到模型对象，遍历模型对象上的子模型，完成后续的业务功能
const traversalGroup = (group) =>{
  group.traverse(child=>{
    console.log(child,'child')
  })
}
</script>

```
## 组件props(非必传)-以下参数都是默认值
```js
/**
 * 模型大小
 * @type {number}
 * 模型缩放大小，默认0.1
 */
const modelSize = 0.1
/**
 * 模型加载后是否自动更新相机
 * @type {boolean}
 * 是否开启相机更新，默认true
 */
const isUpdateCenter = true
/**
 * 场景配置
 * @type {{background: string, grid: {size: number, color: string, show: boolean, divisions: number}, opacity: number}}
 */
const sceneConfig = {
    background: '#01081f',//背景颜色
    opacity:1,//透明度
    grid:{ //网格线
        show:true, //是否显示
        size: 5000, //网格线大小
        divisions: 45, //网格线数量
        color: '#2d699f' //网格线颜色
    },
    showAxes:false //是否显示坐标轴
}
/**
 * 灯光配置
 * @type {{intensity: number, color: string, position: {x: number, y: number, z: number}, type: string}}
 */
const lightConfig = {
    type:'HemisphereLight',//灯光类型-半球光
    color: '#ffffff',//灯光颜色
    intensity: 10, //灯光强度
    position: { //灯光位置
        x: 0,
        y: 500,
        z: 0
    }
}
/**
 * 相机配置
 * @type {{maxPolarAngle: number, minDistance: number, maxDistance: number, near: number, position: {x: number, y: number, z: number}}}
 */
const cameraConfig = {
    near:0.6,//相机距离系数0.1-1 值越小相机距离越近
    maxPolarAngle:1.5, //相机最大仰角
    minDistance: 0.1, //相机最小距离
    maxDistance: 100000,//相机最大距离
    position: { //调整相机位置
        x: 0,
        y: 0,
        z: 0
    }
}
/**
 * 泛光配置
 * @type {{visible: boolean, strength: number, threshold: number, radius: number}}
 */
const floodlightConfig = {
    visible:false,//是否显示
    radius: 0.3,//半径0-1之间
    strength:0.3,//强度0-3之间
    threshold: 0.3 //阈值0-1之间
}
/**
 * 炫光配置(轮廓光)
 * @type {{visible: boolean, edgeStrength: number, edgeThickness: number, edgeGlow: number, visibleEdgeColor: string, hiddenEdgeColor: string, pulsePeriod: number}}
 */
const outlinePassConfig = {
    visible:false, //是否显示
    edgeStrength:3, //炫光强度
    edgeThickness:1, //炫光厚度
    edgeGlow : 0, //炫光辉度
    visibleEdgeColor:'#ffffff', //炫光可见边缘颜色
    hiddenEdgeColor:'#190a05', //炫光隐藏边缘颜色
    pulsePeriod : 0 //炫光闪烁周期
}
```
## 组件emit
```js
/**
 * 点击模型回调函数-此方法生效前提需要调用startClick()方法开启点击事件
 * @param e //鼠标事件对象
 * @param info //选中的模型对象
 */
const clickModel = (e,info) =>{
  console.log(e,info,'eeeeeeeeeeeeeeeeeee')
}
```
## 组件ref方法(threeRef)
```js
/**
 * THREE-Three.js的原生对象
 */
threeRef.value.THREE

/**
 * initModel()-初始化渲染模型方法
 * @param {Object} modelConfig - 模型配置对象
 * @param {string} modelConfig.type - 模型类型（FBX/GLTF/OBJ）
 * @param {string} modelConfig.url - 模型文件的 URL 路径
 * @returns {Promise<void>} - 返回模型组对象
 * 组件内部需要拿到dom实例挂载模型，所以需在nextTick()方法中调用此方法。
 * 注意：url地址必须是绝对路径，模型可以放在public静态资源目录下，或者使用绝对路径src/....，或者文件放在服务器上，访问服务器地址
 */
nextTick(()=>{
    threeRef.value.initModel({type:'FBX',url:'/dp/fbx/sanxitong.fbx'}).then(group=>{})
})

/**
 * setCameraCenter()-设置相机中心点
 * @param {Object} group - 模型对象
 * 设置相机中心点，相机会自动移动到模型中心点
 */
threeRef.value.setCameraCenter(group)

/**
 * getThreeEditor()-获取HThreeEditor实例
 * @return {HThreeEditor}
 * 返回一个HThreeEditor实例
 * 可结构出Three.js原生的对象,例如场景、相机、渲染器、控制器、变换控制器等
 * {scene, camera, renderer, controls, transformControls, ...} =HThreeEditor
 */
let HThreeEditor=threeRef.value.getThreeEditor()

/**
 * startClick()-开启鼠标事件
 * @param {string} mode - 鼠标点击模式，默认为选择模式
 *  '选择' - 选择模式，默认(有模型选中效果)
 *  '根选择' - 根选择模式，选择根节点
 *  '变换' - 修改模型位置
 *  '点击信息' - 点击信息模式(无模型选中效果)
 *   @param {string} type -
 *   鼠标点击事件类型，默认为click
 *  'dblclick' - 双击模式
 */
threeRef.value.startClick('选择','click')

/**
 * destroySceneRender()-手动销毁3D场景
 */
threeRef.value.destroySceneRender()

/**
 * create3DSprite()-创建3D标签
 * 返回一个CSS3DSprite对象
 * @return tag: CSS3DSprite
 */
let tag = threeRef.value.create3DSprite()
tag.element.innerHTML = "<span>这是一个3D标签</span>"
HThreeEditor.scene.add(tag)

/**
 * getModelCenter()-获取模型中心点
 * @param {Object} group - 模型对象
 * return {Vector3} - 返回模型中心点
 * 该方法也可以传入子模型，获取子模型的中心点
 */
let center = threeRef.value.getModelCenter(group)

/**
 * setLightConfig()-添加灯光
 * @param {Object} lightConfig - 参考组件props-灯光配置
 */
threeRef.value.setLightConfig(lightConfig)
/**
 * getLightCode()-获取灯光Code列表编码
 * return {Array} list - 返回灯光Code列表编码
 * {
 * "环境光": "AmbientLight",
 * "平行光": "DirectionalLight",
 * "点光源": "PointLight",
 * "聚光灯": "SpotLight",
 * "半球光": "HemisphereLight",
 * "平面光": "RectAreaLight"
 * }
 */
let list = threeRef.value.getLightCode()

/**
 * openStartRotate()-开启旋转
 * @param {Boolean} isStart 是否开始旋转
 * @param {Number} speed 旋转速度
 */
threeRef.value.openStartRotate(true,1.5)

/**
 * getOutlinePass()-获取炫光对象
 * return {OutlinePass} - 炫光对象
 */
let outlinePass = threeRef.value.getOutlinePass()
outlinePass.selectedObjects =[model1,model2,....]

/**
 * setShowGrid()-显示网格
 */
threeRef.value.setShowGrid(true)
/**
 * setShowAxes()-显示坐标轴
 */
threeRef.value.setShowAxes(true)

/**
 * startDrawPipe() - 开始绘制
 * @param {Function} callback - 绘制完成回调函数-返回[x,y,z]
 * @param {Function} moveCallback - 绘制中回调函数-返回[x,y,z]
 * @param {Function} endCallback - 绘制结束回调函数
 */
threeRef.value.startDrawPipe(callback,moveCallback,endCallback)
/**
 * stopDrawPipe() - 停止绘制
 */
threeRef.value.stopDrawPipe()

/**
 * getObjectViews()-获取最优视角
 */
let {maxView, target}=threeRef.value.getObjectViews(object)
/**
 * createGsapAnimation()-创建GSAP动画
 */
threeRef.value.createGsapAnimation(object,{x:0,y:0,z:0})
```

