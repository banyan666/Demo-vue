<!--  -->
<template>
  <div class="load" style="width: 100%;height: 100%">
    <div style="width: 100%;height: 100%" id="loading"></div>
  </div>
</template>

<script setup>
import * as zrender from 'zrender'
const lineColor = 'rgba(68, 174, 255, 57)'
const cirR=240


let zr = null
let group = null

onMounted(()=>{
  zr = zrender.init(document.getElementById('loading'))
  init()
  window.addEventListener('resize', handleResize,{ passive: true });
})
onBeforeMount(()=>{
  zr = null;
  group = null
})
onBeforeUnmount(()=>{
  zr.dispose()
  window.removeEventListener('resize', handleResize);
})
const handleResize =()=>{
  zr.dispose()
  zr = zrender.init(document.getElementById('loading'))
  init();
}
const init = () =>{
  group = new zrender.Group({
    position: [0, 0]
  });

  let linearColorb2 = new zrender.LinearGradient(1, 0, 0, 1, [{
    offset: 0,
    color: 'rgba(27, 151, 223,0.1)'
  },
    {
      offset: 1,
      color: 'rgba(28, 147, 239,0.5)'
    }
  ]);
  let jxColor1 = new zrender.LinearGradient(0, 0, 1, 0, [{
    offset: 0,
    color: '#168EEA'
  },
    {
      offset: 1,
      color: 'rgba(14, 95, 177,0.1)'
    }
  ]);
  let jxColor2 = new zrender.LinearGradient(0, 0, 1, 0, [{
    offset: 0,
    color: '#168EEA'
  },
    {
      offset: 1,
      color: 'rgba(28, 147, 239,0)'
    }
  ]);

  let mainText = new zrender.Text({
    style: {
      text: '10',
      fill: "#66CDEC",
      fontSize: 85,
      fontWeight:'bold',
      textShadowBlur:100,
      textShadowColor:"#40B6DC",
      x: 900,
      y: 510,
    },
    z: 999
  })

  let arc1=new zrender.Arc({
    style:{
      stroke:jxColor1,
      fill:'none',
      lineWidth: 4,
      lineDash: [0]
    },
    shape:{
      cx: 960,
      cy: 540,
      r: cirR,
      startAngle:0,              //开始角度
      endAngle:Math.PI*4         //结束角度
    },

  });
  let arc2=new zrender.Arc({
    style:{
      stroke:jxColor2,
      fill:'none',
      lineWidth: 20,
      lineDash: [180]
    },
    shape:{
      cx: 960,
      cy: 540,
      r: cirR-10,
    },
    origin:[960,540]
  });
  let arc3=new zrender.Arc({
    style:{
      stroke:lineColor,
      fill:'none',
      lineWidth: 4,
      shadowColor: lineColor,
      shadowBlur: 20,
      lineDash: [0]
    },
    shape:{
      cx: 960,
      cy: 540,
      r: cirR+20,

    }
  });
  let arc4=new zrender.Arc({
    style:{
      stroke:jxColor1,
      fill:'none',
      lineWidth: 20,
      lineDash: [10]
    },
    shape:{
      cx: 960,
      cy: 540,
      r: cirR-50,

    },
    origin:[960,540]
  });
  let arc5=new zrender.Arc({
    style:{
      stroke:linearColorb2,
      fill:'none',
      lineWidth: 10,
      lineDash: [2]
    },
    shape:{
      cx: 960,
      cy: 540,
      r: cirR-90,

    }
  });
  let arc6=new zrender.Arc({
    style:{
      stroke:jxColor1,
      fill:'none',
      lineWidth: 5,
      lineDash: [0]
    },
    shape:{
      cx: 960,
      cy: 540,
      r: cirR-95,
    }
  });
  let arc7=new zrender.Arc({
    style:{
      stroke:lineColor,
      fill:'none',
      lineWidth: 10,
      lineDash: [100]
    },
    shape:{
      cx: 960,
      cy: 540,
      r: cirR-130,

    },
    origin:[960,540]
  });
  group.add(arc1)
  group.add(arc2)
  group.add(arc3)
  group.add(arc4)
  group.add(arc5)
  group.add(arc6)
  group.add(arc7)
  group.add(mainText)
  animateCir(arc2,arc4,arc7,mainText)


  zr.add(group);
}
const animateCir = (el,el1,el2,text) =>{
  el.animate('', true)
      .when(10000, {rotation: Math.PI*2})
      .done( ()=> {

      })
      .start()
  el1.animate('', true)
      .when(25000, {rotation: -Math.PI*2})
      .done( ()=> {

      })
      .start()
  el2.animate('', true)
      .when(2000, {rotation: Math.PI*2})
      .done( ()=> {

      })
      .start()
  let index=10;
  text.animate('style', true)
      .when(2000, {
        text: index
      }).during((num,time)=>{
    num.text=parseInt(index);
    index+=1
    if(index>100){
      text.stopAnimation();
      text.attr('style',{x:880})
      // this.$emit("finish")
    }
  }).start()
}


</script>
<style scoped>
.load {
  position: fixed;
  left: 0;
  top: 0;
  z-index: 999999;
  background-color: rgba(9, 14, 42, 0.8) ;
  background-image: radial-gradient(circle, rgba(0, 0, 0, 1) 60%, rgba(41, 20, 1, 0));
  width: 100%;
  height: 100%;
}

</style>
