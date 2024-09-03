<template>
  <div class="map-box">
    <Loading v-if="isLoad"></Loading>
    <Top></Top>
    <div id="map_container"></div>
  </div>
</template>

<script setup>
import Loading from '../../components/Loading/index.vue'
import Top from '../../components/Top/index.vue'
import builds from '../../assets/json/buildings.json'
import {BMPGL} from "../../utils/map.ts";
import {styleJson2} from "./utils.ts";
import {View,ShapeLayer} from 'mapvgl';

let Mymap;
let Mapvgl = null;
let lyLayer = null
const isLoad = ref(true)

const mapData = {
  ak: 'Qqm5jVdSK3BRHOxAqKWQJL0TGo0OZYHJ',//百度密钥
  mapCenterPoint: [125.32756,43.887723],//地图默认中心点
  mapMaxZoom: 21,//地图最大缩放
  mapMinZoom: 10,//地图最小缩放
  mapRotateAngle: 0,//地图默认旋转角度
  mapSlant: 60,//地图默认倾斜角度
  mapZoomRatio: 16,//地图默认缩放比例
}

//初始化地图
const initMap = () =>{
  BMPGL(mapData.ak).then((BMapGL)=>{
    const map = new BMapGL.Map('map_container',{
      restrictCenter: false,
      maxZoom: mapData.mapMaxZoom,
      minZoom: mapData.mapMinZoom,
      displayOptions: {
        building: false,//关闭建筑
      },
      // enableTilt: false,//禁用地图倾斜
    });
    map.centerAndZoom(new BMapGL.Point(mapData.mapCenterPoint[0], mapData.mapCenterPoint[1]), 15);
    map.enableKeyboard();
    map.enableInertialDragging();
    map.enableContinuousZoom();
    map.enableScrollWheelZoom();//开启滚轮缩放
    map.setTilt(0); //地图倾斜角度
    map.setHeading(-90); //地图旋转角度
    map.setMapStyleV2({
      styleJson: styleJson2
    });

    map.disableDoubleClickZoom()
    map.setDisplayOptions({
      skyColors: ['rgba(186, 0, 255, 0)', 'rgba(44,42,42,0.2)'],
    });
    setTimeout(() => {
      map.setHeading(mapData.mapRotateAngle);
      map.setTilt(mapData.mapSlant);
      map.setZoom(mapData.mapZoomRatio);
    }, 3500);
    map.addControl(new BMapGL.ScaleControl()); // 添加比例尺控件
    // 隐藏室内图
    // map.addControl(new BMapGL.NavigationControl3D());  // 添加3D控件
    map.setDisplayOptions({
      indoor: false
    });
    Mymap = map;
    //创建MapVGL图层管理器
    Mapvgl = new View({
      map:Mymap
    })
    initBuilds()
  }).catch((err)=>{
    console.log(err)
  })
}

const initBuilds = () =>{
  let buildArr = []
  for(let i=0;i<builds.geometries.length;i++){
    buildArr.push(
        {
          "geometry":builds.geometries[i],
          "properties":{
            "height":Math.floor(Math.random() * (100 - 50 + 1)) +50
          }
        }
    )
  }
  drawLayer(buildArr)
}
// 定义绘制图层的函数
const drawLayer=(ryhdata)=> {
  lyLayer = new ShapeLayer({
    // 设置图层参数...
    // texture: this.wall,
    // isTextureFull: true,
    textureScale: 0.05,
    blend: 'lighter',
    // style: 'normal',
    topColor: 'rgba(10,62,94,0.75)',
    color: 'rgb(25,103,141)',
    // style: 'windowAnimation',
    opacity: 1,
    enablePicked: true, // 是否可以拾取
    selectedIndex: -1, // 选中项
    selectedColor: '#FF6A3A', // 选中项颜色
    autoSelect: true, // 根据鼠标位置来自动设置选中项
    renderOrder:-1,
    collides: true, // 是否开启碰撞检测, 数量较多时建议打开
    zIndex: -5,
    zoomThreshold:[14,30],
  });
  lyLayer.setData(ryhdata);
  Mapvgl.addLayer(lyLayer);
}
onMounted(()=>{
  initMap()
  setTimeout(()=>{
    isLoad.value = false
  },2500)
})
</script>

<style lang="less" scoped>
.map-box{
  width: 100%;
  height: 100%;
  #map_container{
    width: 1920px;
    height: 100%;
  }
}
</style>