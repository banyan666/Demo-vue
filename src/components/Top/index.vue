<template>
  <div class="top">
    <div class="header" id="header"></div>
    <div class="top-title">这是一个大屏标题</div>
  </div>
</template>

<script setup>
import * as zrender from "zrender";

let screenWidth = window.innerWidth;
let screenHeight = window.innerHeight;
let zr = null;
let group = null;




onMounted(()=>{
  zr = zrender.init(document.getElementById("header"));
  init();
  window.addEventListener('resize', handleResize,{ passive: true });
})

onBeforeUnmount(()=>{
  console.log('卸载')
  zr.dispose()
  window.removeEventListener('resize', handleResize);
})
onBeforeMount(()=>{
  zr = null;
  group = null
})

let leftPoints = [
  [screenWidth*(596/1920), 25],
  [screenWidth*(530/1920), 25],
  [screenWidth*(518/1920), 39],
  [screenWidth*(500/1920), 39],
  [screenWidth*(493/1920), 32],
  [screenWidth*(472/1920), 32],
  [screenWidth*(460/1920), 46],
  [screenWidth*(427/1920), 46],
]
const lineColor = '#045F9F';
let lineWidth = 1
let rightPoints = [
  [screenWidth*(1321/1920), 25],
  [screenWidth*(1386/1920), 25],
  [screenWidth*(1397/1920), 39],
  [screenWidth*(1412/1920), 39],
  [screenWidth*(1425/1920), 32],
  [screenWidth*(1445/1920), 32],
  [screenWidth*(1454/1920), 46],
  [screenWidth*(1504/1920), 46],
]

const handleResize =()=>{
  zr.dispose()
  screenWidth = window.innerWidth;
  screenHeight = window.innerHeight;
  console.log(screenWidth,'screenWidth')
  leftPoints = [
    [screenWidth*(596/1920), 25],
    [screenWidth*(530/1920), 25],
    [screenWidth*(518/1920), 39],
    [screenWidth*(500/1920), 39],
    [screenWidth*(493/1920), 32],
    [screenWidth*(472/1920), 32],
    [screenWidth*(460/1920), 46],
    [screenWidth*(427/1920), 46],
  ]
  rightPoints = [
    [screenWidth*(1321/1920), 25],
    [screenWidth*(1386/1920), 25],
    [screenWidth*(1397/1920), 39],
    [screenWidth*(1412/1920), 39],
    [screenWidth*(1425/1920), 32],
    [screenWidth*(1445/1920), 32],
    [screenWidth*(1454/1920), 46],
    [screenWidth*(1504/1920), 46],
  ]
  zr = zrender.init(document.getElementById("header"));
  init();
}

const init=() => {
  let bs = new zrender.LinearGradient(0, 0, 1, 0, [
    {
      offset: 0,
      color: 'rgba(255, 255, 255,0.3)'
    },
    {
      offset: 0.5,
      color: 'rgba(255, 255, 255)'
    },
    {
      offset: 1,
      color: 'rgba(255, 255, 255,0.3)'
    },
  ]);
  let linearColor = new zrender.LinearGradient(0, 0, 1, 0, [
    {
      offset: 0,
      color: 'rgba(1, 92, 155,0)'
    },
    {
      offset: 1,
      color: 'rgba(1, 92, 155)'
    }
  ]);
  let linearColor1 = new zrender.LinearGradient(0, 0, 1, 0, [
    {
      offset: 0,
      color: 'rgba(1, 92, 155)'
    },
    {
      offset: 1,

      color: 'rgba(1, 92, 155,0)'
    }
  ]);
  let RAlinearColor = new zrender.RadialGradient(screenWidth*(975/1920), 45, screenWidth*(450/1920), [
    {
      offset: 0,
      color: 'rgb(8,43,121)'
    },
    {
      offset: 1,
      color: 'rgb(2,35,91)'
    }
  ]);
  group = new zrender.Group({
    position: [0, 0]
  });

  /* 整体底色 */
  let rect = new zrender.Rect({
    style: {
      fill: '#031e4f',
      // stroke: "#0180E4",

      lineWidth: 0
    },
    shape: {
      x: 0,
      y: 0,
      width: screenWidth,
      height: 72,
    },
    z:999
  })

  /* 底部的横线 */
  let polyline = new zrender.Polyline({
    style: {
      // fill: '#031339',
      stroke: "#1371d3",
      lineWidth: 2
    },
    shape: {
      points: [
        [0, 72],
        [screenWidth, 72]
      ]
    },
    z: 999
  })

  /* 中间轮廓线 */
  let wbx = new zrender.Polyline({
    style: {
      // fill: '#031339',
      stroke: "#00A0FF",
      lineWidth: 3
    },
    shape: {
      points: [
        [screenWidth*(573/1920), 0],
        [screenWidth*(662/1920), 95],
        [screenWidth*(713/1920), 95],
        [screenWidth*(724/1920), 87],
        [screenWidth*(1186/1920), 87],
        [screenWidth*(1195/1920), 95],
        [screenWidth*(1257/1920), 95],
        [screenWidth*(1344/1920), 0]
      ]
    },
    z: 999
  })

  /* 中间内部填充 */
  let TX = zrender.Path.extend({
    shape: {
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    },
    buildPath: function (path, shape) {
      path.moveTo(screenWidth*(573/1920), 0);
      path.lineTo(screenWidth*(662/1920), 95);
      path.lineTo(screenWidth*(713/1920), 95);
      path.lineTo(screenWidth*(724/1920), 87);
      path.lineTo(screenWidth*(1186/1920), 87);
      path.lineTo(screenWidth*(1195/1920), 95);
      path.lineTo(screenWidth*(1257/1920), 95);
      path.lineTo(screenWidth*(1344/1920), 0);
      path.closePath();

    }
  });
  let tx = new TX({
    shape: {
      x: 0,
      y: 0,
      width: 0,
      height: 0,

    },
    style: {
      lineWidth: 0,
      // stroke: '#797979',
      fill: RAlinearColor
    },
    z: 9999,

  })

  //中间底部梯形
  let BR = zrender.Path.extend({
    shape: {
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    },
    buildPath: function (path, shape) {
      path.moveTo(screenWidth*(719/1920), 96);
      path.lineTo(screenWidth*(1190/1920), 96);
      path.lineTo(screenWidth*(1182/1920), 91);
      path.lineTo(screenWidth*(727/1920), 91);
      path.closePath();

    }
  });
  let br = new BR({
    shape: {
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    },
    style: {
      lineWidth: 0,
      fill: "#147dd7"
    },
    z: 9999,

  })

  /* 左侧的折线 */
  let lpolyline = new zrender.Line({
    style: {
      stroke: '#045F9F',
      lineWidth: 1,
      lineDash: [0],
    },
    shape: {
      x1: leftPoints[0][0],
      y1: leftPoints[0][1],
      x2: leftPoints[0][0],
      y2: leftPoints[0][1]

    },
    z: 9999
  })

  /* 左侧折线下的多边形 */
  let DBX = zrender.Path.extend({
    shape: {
      x: 0,
      y: 0,
      width: 0,
      height: 0,

    },

    buildPath: function (path, shape) {
      path.moveTo(screenWidth*(530/1920), 43);
      path.lineTo(screenWidth*(542/1920), 55);
      path.lineTo(screenWidth*(625/1920), 55);
      path.lineTo(screenWidth*(600/1920), 30);
      path.lineTo(screenWidth*(540/1920), 30);
      path.closePath();

    }
  });
  let dbx1 = new DBX({
    shape: {
      x: 0,
      y: 0,
      width: 0,
      height: 0,

    },
    style: {
      lineWidth: 0,
      // stroke: '#797979',
      fill: linearColor1
    },
    z: 999,

  })


  /* 右侧的折线 */
  let rpolyline = new zrender.Line({
    style: {
      stroke: lineColor,
      lineWidth: lineWidth,
      lineDash: [0],
    },
    shape: {
      x1: rightPoints[0][0],
      y1: rightPoints[0][1],
      x2: rightPoints[0][0],
      y2: rightPoints[0][1]

    },
    z: 9999
  })

  /* 右侧折线下的多边形 */
  let YDBX = zrender.Path.extend({
    shape: {
      x: 0,
      y: 0,
      width: 0,
      height: 0,

    },

    buildPath: function (path, shape) {
      path.moveTo(screenWidth*(1317/1920), 30);
      path.lineTo(screenWidth*(1373/1920), 30);
      path.lineTo(screenWidth*(1384/1920), 43);
      path.lineTo(screenWidth*(1373/1920), 55);
      path.lineTo(screenWidth*(1294/1920), 55);
      path.closePath();

    }
  });
  let dbx2 = new YDBX({
    shape: {
      x: 0,
      y: 0,
      width: 0,
      height: 0,

    },
    style: {
      lineWidth: 0,
      // stroke: '#797979',
      fill: linearColor
    },
    z: 999,
  })

  /* 中间左侧白色的椭圆亮线 */
  let ellipse = new zrender.Ellipse({
    style: {
      fill: bs,
      shadowColor: "#71C4DD",
      shadowBlur: 4,
      // stroke:"rgba(113, 196, 221,0.7)",
      // lineWidth:1
    },
    shape: {
      cx: screenWidth*(610/1920),
      cy: 59,
      rx: screenWidth*(25/1920), //横向半径
      ry: 2 //纵向半径
    },
    origin: [screenWidth*(628/1920),57],
    rotation: -Math.PI /4 * ((95-0)/((screenWidth*(662/1920))-(screenWidth*(572/1920)))),
    z: 9999
  })
  /* 中间右侧白色的椭圆亮线 */
  let ellipse1 = new zrender.Ellipse({
    style: {
      fill: bs,
      shadowColor: "#71C4DD",
      shadowBlur: 4,

    },
    shape: {
      cx: screenWidth*(1310/1920),
      cy: 60,
      rx: screenWidth*(25/1920), //横向半径
      ry: 2 //纵向半径
    },
    origin: [screenWidth*(1289/1920), 57],
    rotation: Math.PI / 4 * ((95-0)/((screenWidth*(1345/1920))-(screenWidth*(1258/1920)))),
    z: 9999
  })
  /* 中间底部白色的椭圆亮线 */
  let ellipse2 = new zrender.Ellipse({
    style: {
      fill: bs,
      shadowColor: "#76d4f3",
      shadowBlur: 10,
    },
    shape: {
      cx: screenWidth*(960/1920),
      cy: 87,
      rx: screenWidth*(180/1920), //横向半径
      ry: 2 //纵向半径
    },
    z: 9999
  })
  //左下角的白色折线
  let l1 = new zrender.Polyline({
    style: {
      // fill: '#031339',
      stroke: "#fff",
      lineWidth: 2
    },
    shape: {
      points: [
        [screenWidth*(645/1920), 78],
        [screenWidth*(661/1920), 96],
        [screenWidth*(686/1920), 96],
      ]
    },
    z: 9999
  })
  //右下角的白色折线
  let l2 = new zrender.Polyline({
    style: {
      // fill: '#031339',
      stroke: "#fff",
      lineWidth: 2
    },
    shape: {
      points: [
        [screenWidth*(1231/1920), 96],
        [screenWidth*(1256/1920), 96],
        [screenWidth*(1272/1920), 80],
      ]
    },
    z: 9999
  })

  zr.add(polyline)
  zr.add(rect)
  zr.add(group)

  animatetoLinetr(lpolyline)
  animatetoLinetl(rpolyline)
  group.add(lpolyline)
  group.add(rpolyline)
  group.add(dbx1)
  group.add(dbx2)
  group.add(wbx)
  group.add(tx)
  group.add(br)
  group.add(ellipse)
  group.add(ellipse1)
  group.add(ellipse2)
  group.add(l1)
  group.add(l2)



}


const animatetoLinetr=(el)=> {
  let ltpolyline1 = new zrender.Line({
    style: {
      stroke: lineColor,
      lineWidth: lineWidth,
      lineDash: [0],
    },
    shape: {
      x1: leftPoints[1][0],
      y1: leftPoints[1][1],
      x2: leftPoints[1][0],
      y2: leftPoints[1][1]

    },
    z: 9999
  })
  let ltpolyline2 = new zrender.Line({
    style: {
      stroke: lineColor,
      lineWidth: lineWidth,
      lineDash: [0],
    },
    shape: {
      x1: leftPoints[2][0],
      y1: leftPoints[2][1],
      x2: leftPoints[2][0],
      y2: leftPoints[2][1]

    },
    z: 9999
  })
  let ltpolyline3 = new zrender.Line({
    style: {
      stroke: lineColor,
      lineWidth: lineWidth,
      lineDash: [0],
    },
    shape: {
      x1: leftPoints[3][0],
      y1: leftPoints[3][1],
      x2: leftPoints[3][0],
      y2: leftPoints[3][1]

    },
    z: 9999
  })
  let ltpolyline4 = new zrender.Line({
    style: {
      stroke: lineColor,
      lineWidth: lineWidth,
      lineDash: [0],
    },
    shape: {
      x1: leftPoints[4][0],
      y1: leftPoints[4][1],
      x2: leftPoints[4][0],
      y2: leftPoints[4][1]

    },
    z: 9999
  })
  let ltpolyline5 = new zrender.Line({
    style: {
      stroke: lineColor,
      lineWidth: lineWidth,
      lineDash: [0],
    },
    shape: {
      x1: leftPoints[5][0],
      y1: leftPoints[5][1],
      x2: leftPoints[5][0],
      y2: leftPoints[5][1]

    },
    z: 9999
  })
  let ltpolyline6 = new zrender.Line({
    style: {
      stroke: lineColor,
      lineWidth: lineWidth,
      lineDash: [0],
    },
    shape: {
      x1: leftPoints[6][0],
      y1: leftPoints[6][1],
      x2: leftPoints[6][0],
      y2: leftPoints[6][1]

    },
    z: 9999
  })

  el.animate('shape', false)
      .when(200, {
        x1: leftPoints[0][0],
        y1: leftPoints[0][1],
        x2: leftPoints[1][0],
        y2: leftPoints[1][1]
      })
      .done(() => {
        ltpolyline1.animate('shape', false)
            .when(200, {
              x1: leftPoints[1][0],
              y1: leftPoints[1][1],
              x2: leftPoints[2][0],
              y2: leftPoints[2][1]
            })
            .done(() => {
              ltpolyline2.animate('shape', false)
                  .when(200, {
                    x1: leftPoints[2][0],
                    y1: leftPoints[2][1],
                    x2: leftPoints[3][0],
                    y2: leftPoints[3][1]
                  })
                  .done(() => {
                    ltpolyline3.animate('shape', false)
                        .when(200, {
                          x1: leftPoints[3][0],
                          y1: leftPoints[3][1],
                          x2: leftPoints[4][0],
                          y2: leftPoints[4][1]
                        })
                        .done(() => {
                          ltpolyline4.animate('shape', false)
                              .when(200, {
                                x1: leftPoints[4][0],
                                y1: leftPoints[4][1],
                                x2: leftPoints[5][0],
                                y2: leftPoints[5][1]
                              })
                              .done(() => {
                                ltpolyline5.animate('shape', false)
                                    .when(200, {
                                      x1: leftPoints[5][0],
                                      y1: leftPoints[5][1],
                                      x2: leftPoints[6][0],
                                      y2: leftPoints[6][1]
                                    })
                                    .done(() => {
                                      ltpolyline6.animate('shape', false)
                                          .when(200, {
                                            x1: leftPoints[6][0],
                                            y1: leftPoints[6][1],
                                            x2: leftPoints[7][0],
                                            y2: leftPoints[7][1]
                                          })
                                          .done(() => {


                                          }).start()

                                    }).start()

                              }).start()

                        }).start()

                  }).start()

            }).start()

      }).start()
  group.add(ltpolyline1)
  group.add(ltpolyline2)
  group.add(ltpolyline3)
  group.add(ltpolyline4)
  group.add(ltpolyline5)
  group.add(ltpolyline6)
}
const animatetoLinetl=(el)=> {
  let rtpolyline1 = new zrender.Line({
    style: {
      stroke: lineColor,
      lineWidth: lineWidth,
      lineDash: [0],
    },
    shape: {
      x1: rightPoints[1][0],
      y1: rightPoints[1][1],
      x2: rightPoints[1][0],
      y2: rightPoints[1][1]
    },
    z: 9999
  })
  let rtpolyline2 = new zrender.Line({
    style: {
      stroke: lineColor,
      lineWidth: lineWidth,
      lineDash: [0],
    },
    shape: {
      x1: rightPoints[2][0],
      y1: rightPoints[2][1],
      x2: rightPoints[2][0],
      y2: rightPoints[2][1]
    },
    z: 9999
  })
  let rtpolyline3 = new zrender.Line({
    style: {
      stroke: lineColor,
      lineWidth: lineWidth,
      lineDash: [0],
    },
    shape: {
      x1: rightPoints[3][0],
      y1: rightPoints[3][1],
      x2: rightPoints[3][0],
      y2: rightPoints[3][1]
    },
    z: 9999
  })
  let rtpolyline4 = new zrender.Line({
    style: {
      stroke: lineColor,
      lineWidth: lineWidth,
      lineDash: [0],
    },
    shape: {
      x1: rightPoints[4][0],
      y1: rightPoints[4][1],
      x2: rightPoints[4][0],
      y2: rightPoints[4][1]
    },
    z: 9999
  })
  let rtpolyline5 = new zrender.Line({
    style: {
      stroke: lineColor,
      lineWidth: lineWidth,
      lineDash: [0],
    },
    shape: {
      x1: rightPoints[5][0],
      y1: rightPoints[5][1],
      x2: rightPoints[5][0],
      y2: rightPoints[5][1]
    },
    z: 9999
  })
  let rtpolyline6 = new zrender.Line({
    style: {
      stroke: lineColor,
      lineWidth: lineWidth,
      lineDash: [0],
    },
    shape: {
      x1: rightPoints[6][0],
      y1: rightPoints[6][1],
      x2: rightPoints[6][0],
      y2: rightPoints[6][1]
    },
    z: 9999
  })

  el.animate('shape', false)
      .when(200, {
        x1: rightPoints[0][0],
        y1: rightPoints[0][1],
        x2: rightPoints[1][0],
        y2: rightPoints[1][1]
      })
      .done(() => {
        rtpolyline1.animate('shape', false)
            .when(200, {
              x1: rightPoints[1][0],
              y1: rightPoints[1][1],
              x2: rightPoints[2][0],
              y2: rightPoints[2][1]
            })
            .done(() => {

              rtpolyline2.animate('shape', false)
                  .when(200, {
                    x1: rightPoints[2][0],
                    y1: rightPoints[2][1],
                    x2: rightPoints[3][0],
                    y2: rightPoints[3][1]
                  })
                  .done(() => {
                    rtpolyline3.animate('shape', false)
                        .when(200, {
                          x1: rightPoints[3][0],
                          y1: rightPoints[3][1],
                          x2: rightPoints[4][0],
                          y2: rightPoints[4][1]
                        })
                        .done(() => {
                          rtpolyline4.animate('shape', false)
                              .when(200, {
                                x1: rightPoints[4][0],
                                y1: rightPoints[4][1],
                                x2: rightPoints[5][0],
                                y2: rightPoints[5][1]
                              })
                              .done(() => {
                                rtpolyline5.animate('shape', false)
                                    .when(200, {
                                      x1: rightPoints[5][0],
                                      y1: rightPoints[5][1],
                                      x2: rightPoints[6][0],
                                      y2: rightPoints[6][1]
                                    })
                                    .done(() => {

                                      rtpolyline6.animate('shape', false)
                                          .when(200, {
                                            x1: rightPoints[6][0],
                                            y1: rightPoints[6][1],
                                            x2: rightPoints[7][0],
                                            y2: rightPoints[7][1]
                                          })
                                          .done(() => {}).start()
                                    }).start()
                              }).start()
                        }).start()
                  }).start()
            }).start()
      }).start()

  group.add(rtpolyline1)
  group.add(rtpolyline2)
  group.add(rtpolyline3)
  group.add(rtpolyline4)
  group.add(rtpolyline5)
  group.add(rtpolyline6)
}

</script>

<style lang="less" scoped>
.top{
  position: absolute;
  width: 100%;
  height: 100px;
  z-index: 999;
  .top-title{
    width: 100%;
    position: absolute;
    /*left: 50%;*/
    top: 20px;
    text-align: center;
    color:var(--text-color);
    letter-spacing: 3px;
    font-size: 36px;
    font-weight: bold;
    z-index: 9999;
    -webkit-animation: neon1 5s ease-in-out infinite alternate;
    -moz-animation: neon1 5s ease-in-out infinite alternate;
    animation: neon1 5s ease-in-out infinite alternate;
  }
  .header{
    width: 100%;
    height: 100%;
  }
}
@-webkit-keyframes neon1 {
  from {
    text-shadow: 0 0 0px #229ED9,
    0 0 30px #229ED9,
    0 0 60px #229ED9 ;
  }

  to {
    text-shadow:
        0 0 60px #229ED9,
        0 0 30px #229ED9,
        0 0 0px #229ED9;
  }
}
</style>