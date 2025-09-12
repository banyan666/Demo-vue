<template>
  <div style="height: 100%;width: 100%">
    <HThree ref="threeRef" @clickModel="clickModel" :modelSize="modelSize" :sceneConfig="sceneConfig" :lightConfig="lightConfig" :cameraConfig="cameraConfig" :floodlightConfig="floodlightConfig" :outlinePassConfig="outlinePassConfig"></HThree>
    <div style="position: absolute;top: 0;left: 0;">
      <el-button @click="openRotate">旋转</el-button>
      <el-button @click="isShowPopup">标牌</el-button>
      <el-button @click="isShowText">文字</el-button>
    </div>
  </div>
</template>

<script setup>
import {heatPipeModelCode, heatStationModelCode,modelData} from './modelCode.ts'
import {HThree} from '../HThree/h-three.js'
import '../HThree/style.css'
import '../demo/demo.css'

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
    size: 5000,
    divisions: 45,
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
onMounted(async ()=>{
  nextTick(async ()=>{
    let group =await threeRef.value.initModel({type:'FBX',url:'/dp/fbx/hrz/danxitong.fbx'})
    console.log(group,'dddddddddddddd')
    let{getThreeEditor}=threeRef.value
    HThreeEditor = getThreeEditor()
    console.log(HThreeEditor,'HThreeEditor')
    traversalGroup(group)
    // threeRef.value.startClick('选择')
    // threeRef.value.openStartRotate(true,2)
  })
})
let getData = [
  {
    name:'流量',
    supplyValue: 0,
    backValue:0,
    unit: 'm³/h'
  },
  {
    name:'温度',
    supplyValue: 0,
    backValue:0,
    unit: '℃'
  },
  {
    name:'压力',
    supplyValue: 0,
    backValue:0,
    unit: 'MPa'
  }
]
let popupList = []
let textList = []
let outlinePass = []
const traversalGroup = (group) =>{
  //动画列表
  let animations = []
  //创建总体标牌
  let groupPopup=threeRef.value.create3DSprite()
  const center = threeRef.value.getModelCenter(group)
  groupPopup.scale.set(2, 2, 2); // 适当缩放
  let content = `
              <div style="font-size: 12px">
                <div><span>换热站名称：</span><span>高速收费站</span></div>
                <div><span>所属总公司：</span><span>长春市供热（集团）有限公司</span></div>
                <div><span>所属热源：</span><span>高新锅炉房</span></div>
                <div><span>投运年份：</span><span>2022</span></div>
                <div><span>是否自管：</span><span>否</span></div>
                <div><span>状态：</span><span>启用</span></div>
              </div>`;
  groupPopup.element.innerHTML = createHtml('换热站基本信息',content,false);
  groupPopup.position.set(center.x,center.y*4,center.z);
  HThreeEditor.scene.add(groupPopup);

  group.traverse(object =>{
    if (heatStationModelCode[object.name]) {
      object.material.color.setHex(0x81b0fa)//修改模型颜色
      let tag=threeRef.value.create3DSprite()
      //给模型添加名字
      tag.element.innerHTML = `<span style="font-size: 28px;color: #ffffff;pointer-events: none;">${heatStationModelCode[object.name]}</span>`
      const center = threeRef.value.getModelCenter(object)

      tag.position.set(center.x,center.y/2,center.z+4);
      HThreeEditor.scene.add(tag)
      textList.push(tag)
      if(modelData[object.name]){
        //给模型添加标牌气泡
        const popup = threeRef.value.create3DSprite()
        // // 标牌位置在对象上方
        popup.position.set(center.x+50,center.y*2,center.z);
        popup.scale.set(1.5, 1.5, 1.5); // 适当缩放
        let obj = modelData[object.name]
        if(obj){
          let content = ''
          getData.forEach(item=>{
            content +=`<div style="display: flex;justify-content: space-between;align-items: center;margin: 5px 0px">
            <span style="color: #00F0FF">${ item.name+' 供：'+item.supplyValue +'  回：'+item.backValue}</span>
            <span style="display: block;background: #3b577a;border-radius: 5px;padding: 2px 4px">${item.unit}</span>
            </div>
            `
          })
          popup.element.innerHTML = createHtml(obj.name,content,false);
          HThreeEditor.scene.add(popup);
          popupList.push(popup)
        }
      }
    }else if(object.name.includes('电热瓷砖')){
      outlinePass.push(object)//给电热瓷砖添加发热效果
    }else if(heatPipeModelCode[object.name]){
      //管线流动,判断模型材质是否已经添加流动动画
      if(!animations.some(item=>object.material.uuid===item)){
        animations.push(object.material.uuid)
        function update() {
          requestAnimationFrame(update);
          object.material.map.offset.x += 0.03
        }
        update()
      }
    }
  })
  const outline = threeRef.value.getOutlinePass()
  outline.selectedObjects =outlinePass
}
/**
 * 是否展示标牌
 */
const isShowPopup = () =>{
  popupList.forEach(item=>{
    item.visible = !item.visible
  })
}
/**
 * 是否展示文字
 */
const isShowText = () =>{
  textList.forEach(item=>{
    item.visible = !item.visible
  })
}
const clickModel = (e,info) =>{
  console.log(e,info,'eeeeeeeeeeeeeeeeeee')
}
let isRotate = false
const openRotate = () =>{
  isRotate = !isRotate
  threeRef.value&&threeRef.value.openStartRotate(isRotate,1.5)
}

//创建标签内容
const createHtml =(header, content) => {
  let html = `<div class="three-popup-box">
    <div class="three-popup-title">
      <div class="three-popup-title-icon"></div>
      <div class="three-popup-title-text">${header}</div>
    </div>
    <div class="three-popup-content">
      ${content}
    </div>
    <div class="three-popup-footer">
    </div>
  </div>`
  return html;

}

</script>

<style lang="less" scoped>

</style>