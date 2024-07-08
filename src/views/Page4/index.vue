<template>
  <div class="map-box">
    <div id="map_container"></div>
  </div>
</template>

<script setup>
import {BMPGL} from "../../utils/map.ts";
import {styleJson2} from "./utils.ts";
import {View} from 'mapvgl';

let Mymap;
let Mapvgl = null;

const mapData = {
  ak: 'Qqm5jVdSK3BRHOxAqKWQJL0TGo0OZYHJ',//百度密钥
  mapCenterPoint: [116.41338729034514, 39.910923647957596],//地图默认中心点
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

  }).catch((err)=>{
    console.log(err)
  })
}
onMounted(()=>{
  initMap()
})
</script>

<style lang="less" scoped>
.map-box{
  width: 100%;
  height: 95%;
  #map_container{
    width: 100%;
    height: 100%;
  }
}
</style>