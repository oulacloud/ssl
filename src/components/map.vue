<style scoped>
  h2{
    text-align: center;
    padding: 30px;
    font-size: 18px;
  }
  #chart_example{
    width: 100%;
    height: 700px;
    /* border: 1px solid red; */
    margin: 0 auto;
  }
  .tool_tip-map {
              position:absolute;
              z-index:999;
              font-size:16px;
              color:#fff;
              width: 206px;
              height: 80px;
              border: 1px solid #419bf9;
              box-sizing: border-box;
              padding: 12px 25px;
              /* // background: rgba(0,2,89,0.8); */
              background: rgba(10,29,84,0.8);
              /* // background: #0a1d54; */
/* //牵引线就是两个伪元素实现的，只写了关键样式，其他的细微样式自己调 */
              /* &::after {
                  content: "";
                  width: 100px;
                  height: 2px;
                  background: #02C6E5;
                  position: absolute;
                  left: -120px;
                  top: 50%;
                  transform: translateY(-50%);
              }
              &::before{
                  content: "";
                  width: 2px;
                  height: 117px;
                  background: #02C6E5;
                  position: absolute;
                  left: -140px;
                  top: 36px;
                  transform:rotateZ(20deg);
              } */
}
</style>
<template>
  <div>
    <!-- <div class="tool_tip-map" id="tool_tip-map-w" v-if="isIslands">
      <div class="tool_map-box"></div>
      <div class="too_map-name">数据展示<p><span class="tool_map-num">{{ Islandsnum }}</span><span class="tool_map-sym">台</span></p></div>
    </div> -->
    <h2>3D示意图</h2>
    <div id="chart_example">

    </div>
  </div>
</template>

<script>
  import * as echarts from 'echarts'
  import echartsgl from 'echarts-gl'
  var cywc_zyq = require('../../static/js/geomap.json')  //引入geojson文件
  export default {
    data() {
      return {
        // data: data
      }
    },
    mounted() {
      let this_ = this;
      let myChart = echarts.init(document.getElementById('chart_example'));
	  // 注册地图名字(tongren)和数据(geoJson)
      echarts.registerMap('xicheng',cywc_zyq,{});

			// 隐藏动画加载效果。
			myChart.hideLoading();

			// 图表配置项
			var option = {
					title : {							// 标题
						top : '5%',
						text : '自定义3D地图',
						subtext : '',
						x : 'center',
						textStyle : {
							color : '#ccc'
						}
					},

					tooltip : {							// 提示框
						show: true,//地图自带的tooltip,在这里我设置为false,并没有使用，可以放开看下效果
            triggerOn: 'mousemove',//鼠标hover地图区域时出现
            trigger: 'item',
            transitionDuration: 0.3,//延时一秒出现
            formatter: function(params){
                      //返回的是dom结构，你可以在这里写好样式，也可以使用下面的配置项去设置样式
                  return `<div style="position:absolute;left:10px;top:16px;width:8px;height:8px;background-color:#FD9A5A;"></div>
                  <div class="tips" style="padding:12px;">
                      <h1 style="font-size:16px;">${params.name}</h1>
                      <p style="font-size:16px;">
                          <span style="color:#03dbf3;font-size:30px;display:inline-block;padding:5px 0">${params.value}</span>
                      台
                      </p>
                  </div>`
                    },
//这里就是设置地图自带的弹框样式
            borderColor: '#419bf9',
            borderWidth: 1,
            padding: [0, 15],
            // backgroundColor: '#0a1d54',
            backgroundColor: 'rgba(0,2,89,0.8)',
            borderRadius: 0,
            textStyle: { color:'#fff'},
            // hoverAnimation:true
						// formatter: "{b}<br/>{c} 元/平方米 "
					},

				    series: [{
				    	type: 'map3D',			  // 系列类型
				    	name: 'map3D',			  // 系列名称
			        map: 'xicheng',           // 地图类型。echarts-gl 中使用的地图类型同 geo 组件相同(ECharts 中提供了两种格式的地图数据，一种是可以直接 script 标签引入的 js 文件，引入后会自动注册地图名字和数据。还有一种是 JSON 文件，需要通过 AJAX 异步加载后手动注册。)
              // regionHeight: 3, //模型的高度
				        // 环境贴图，支持純颜色值，渐变色，全景贴图的 url。默认为 'auto'，在配置有 light.ambientCubemap.texture 的时候会使用该纹理作为环境贴图。否则则不显示环境贴图。
 				      // environment: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{      // 配置为垂直渐变的背景
				      //     offset: 0, color: '#00aaff' // 天空颜色
				      //   }, {
				      //     offset: 0.7, color: '#998866' // 地面颜色
				      //   }, {
				      //     offset: 1, color: '#998866' // 地面颜色
				      //   }], false),

              environment: new echarts.graphic.RadialGradient(0.5 , 0.5, 0.3, [{      // 配置为径向渐变的背景
				          offset: 0, color: 'rgba(193,111,251,0.8)' // 0%位置颜色
				        },
                  {
				          offset: 0.8, color: 'rgba(50,90,255,0.8)' // 100%位置颜色
				        }], false),

				      label: {                // 标签的相关设置
				            show: true,                 // (地图上的城市名称)是否显示标签 [ default: false ]
				            //distance: 50,               // 标签距离图形的距离，在三维的散点图中这个距离是屏幕空间的像素值，其它图中这个距离是相对的三维距离
				            //formatter:,               // 标签内容格式器
				            textStyle: {                // 标签的字体样式
				                color: '#000',                  // 地图初始化区域字体颜色
				                fontSize: 8,                    // 字体大小
				                opacity: 1,                     // 字体透明度
				                backgroundColor: 'rgba(0,23,11,0)'      // 字体背景色
				            },
				        },

              itemStyle: {            // 三维地理坐标系组件 中三维图形的视觉属性，包括颜色，透明度，描边等。
                  color: 'rgba(95,158,160,0.5)',       // 地图板块的颜色
                  opacity: 1,                 // 图形的不透明度 [ default: 1 ]
                  borderWidth: 0.5,           // (地图板块间的分隔线)图形描边的宽度。加上描边后可以更清晰的区分每个区域   [ default: 0 ]
                  borderColor: '#000'         // 图形描边的颜色。[ default: #333 ]
              },

              emphasis: {             // 鼠标 hover 高亮时图形和标签的样式 (当鼠标放上去时  label和itemStyle 的样式)
                  label: {                // label高亮时的配置
                      show: true,
                      textStyle: {
                          color: 'rgba(17,72,141,1)',      // 高亮时标签颜色变为 白色
                          // borderColor: 'yellow',
                          borderWidth: 4,
                          fontSize: 20,       // 高亮时标签字体 变大
                      }
                  },
                  itemStyle: {            // itemStyle高亮时的配置
                      areaColor: '#66ffff',   // 高亮时地图板块颜色改变
                  }
              },

              groundPlane: {			// 地面可以让整个组件有个“摆放”的地方，从而使整个场景看起来更真实，更有模型感。
                show: false,				// 是否显示地面。[ default: false ]
                color: '#aaa'			// 地面颜色。[ default: '#aaa' ]
              },

              regions: [{				// 可对单个地图区域进行设置
                name: 'Islands',		// 所对应的地图区域的名称
                height: '20',			// 区域的高度，可以设置不同的高度用来表达数据的大小。当 GeoJSON 为建筑的数据时，也可以通过这个值表示简直的高度。
                itemStyle: {				// 单个区域的样式设置
                    color: '#00FF00',
                    opacity: 1,
                    borderWidth: 0.4,
                    borderColor: '#5F9EA0',
                },
              }, {
                name: 'Central and Western',
                itemStyle: {
                    color: '#EEEE00',
                    opacity: 1,
                    borderWidth: 0.4,
                    borderColor: '#5F9EA0'
                },
              }],

              //shading: 'lambert',       // 三维地理坐标系组件中三维图形的着色效果，echarts-gl 中支持下面三种着色方式:
                                              // 'color' 只显示颜色，不受光照等其它因素的影响。
                                              // 'lambert' 通过经典的 lambert 着色表现光照带来的明暗。
                                              // 'realistic' 真实感渲染，配合 light.ambientCubemap 和 postEffect 使用可以让展示的画面效果和质感有质的提升。ECharts GL 中使用了基于物理的渲染（PBR） 来表现真实感材质。
              // realisticMaterial: {}    // 真实感材质相关的配置项，在 shading 为'realistic'时有效。
              // lambertMaterial: {}      // lambert 材质相关的配置项，在 shading 为'lambert'时有效。
              // colorMaterial: {}        // color 材质相关的配置项，在 shading 为'color'时有效。

              light: {                    // 光照相关的设置。在 shading 为 'color' 的时候无效。  光照的设置会影响到组件以及组件所在坐标系上的所有图表。合理的光照设置能够让整个场景的明暗变得更丰富，更有层次。
                  main: {                     // 场景主光源的设置，在 globe 组件中就是太阳光。
                      color: '#fff',              //主光源的颜色。[ default: #fff ]
                      intensity: 1.2,             //主光源的强度。[ default: 1 ]
                      shadow: true,              //主光源是否投射阴影。默认关闭。    开启阴影可以给场景带来更真实和有层次的光照效果。但是同时也会增加程序的运行开销。
                      //shadowQuality: 'high',      // 阴影的质量。可选'low', 'medium', 'high', 'ultra' [ default: 'medium' ]
                      alpha: 55,                  // 主光源绕 x 轴，即上下旋转的角度。配合 beta 控制光源的方向。[ default: 40 ]
                      beta: 10                    // 主光源绕 y 轴，即左右旋转的角度。[ default: 40 ]
                  },
                  ambient: {                  // 全局的环境光设置。
                      color: '#fff',              // 环境光的颜色。[ default: #fff ]
                      intensity: 0.5              // 环境光的强度。[ default: 0.2 ]
                  }
              },

              viewControl: {			// 用于鼠标的旋转，缩放等视角控制。
                projection: 'perspective',		// 投影方式，默认为透视投影'perspective'，也支持设置为正交投影'orthographic'。
                autoRotate: false,				// 是否开启视角绕物体的自动旋转查看。[ default: false ]
                autoRotateDirection: 'cw',		// 物体自传的方向。默认是 'cw' 也就是从上往下看是顺时针方向，也可以取 'ccw'，既从上往下看为逆时针方向。
                autoRotateSpeed: 10,			// 物体自传的速度。单位为角度 / 秒，默认为10 ，也就是36秒转一圈。
                autoRotateAfterStill: 3,		// 在鼠标静止操作后恢复自动旋转的时间间隔。在开启 autoRotate 后有效。[ default: 3 ]
                damping: 0,						// 鼠标进行旋转，缩放等操作时的迟滞因子，在大于等于 1 的时候鼠标在停止操作后，视角仍会因为一定的惯性继续运动（旋转和缩放）。[ default: 0.8 ]
                rotateSensitivity: 1,			// 旋转操作的灵敏度，值越大越灵敏。支持使用数组分别设置横向和纵向的旋转灵敏度。默认为1, 设置为0后无法旋转。	rotateSensitivity: [1, 0]——只能横向旋转； rotateSensitivity: [0, 1]——只能纵向旋转。
                zoomSensitivity: 1,				// 缩放操作的灵敏度，值越大越灵敏。默认为1,设置为0后无法缩放。
                panSensitivity: 1,				// 平移操作的灵敏度，值越大越灵敏。默认为1,设置为0后无法平移。支持使用数组分别设置横向和纵向的平移灵敏度
                panMouseButton: 'left',			// 平移操作使用的鼠标按键，支持：'left' 鼠标左键（默认）;'middle' 鼠标中键 ;'right' 鼠标右键(注意：如果设置为鼠标右键则会阻止默认的右键菜单。)
                rotateMouseButton: 'left',		// 旋转操作使用的鼠标按键，支持：'left' 鼠标左键;'middle' 鼠标中键（默认）;'right' 鼠标右键(注意：如果设置为鼠标右键则会阻止默认的右键菜单。)

                distance: 100,					// [ default: 100 ] 默认视角距离主体的距离，对于 grid3D 和 geo3D 等其它组件来说是距离中心原点的距离,对于 globe 来说是距离地球表面的距离。在 projection 为'perspective'的时候有效。
                minDistance: 40,				// [ default: 40 ] 视角通过鼠标控制能拉近到主体的最小距离。在 projection 为'perspective'的时候有效。
                maxDistance: 400,				// [ default: 400 ] 视角通过鼠标控制能拉远到主体的最大距离。在 projection 为'perspective'的时候有效。

                alpha: 60, 						// 视角绕 x 轴，即上下旋转的角度。配合 beta 可以控制视角的方向。[ default: 40 ]
                beta: 15,						// 视角绕 y 轴，即左右旋转的角度。[ default: 0 ]
                minAlpha: -360,					// 上下旋转的最小 alpha 值。即视角能旋转到达最上面的角度。[ default: 5 ]
                maxAlpha: 360,					// 上下旋转的最大 alpha 值。即视角能旋转到达最下面的角度。[ default: 90 ]
                minBeta: -360,					// 左右旋转的最小 beta 值。即视角能旋转到达最左的角度。[ default: -80 ]
                maxBeta: 360,					// 左右旋转的最大 beta 值。即视角能旋转到达最右的角度。[ default: 80 ]

                center: [0,0,0],				// 视角中心点，旋转也会围绕这个中心点旋转，默认为[0,0,0]。

                animation: false,				// 是否开启动画。[ default: true ]
                animationDurationUpdate: 1000,	// 过渡动画的时长。[ default: 1000 ]
                animationEasingUpdate: 'cubicInOut'		// 过渡动画的缓动效果。[ default: cubicInOut ]
              },

						data: [ 				// 可对单个地图区域进行设置
							{name: 'Central and Western',   	// 所对应的地图区域的名称
							 value: 17000,
							 height: 10,	// 区域的高度，可以设置不同的高度用来表达数据的大小。当 GeoJSON 为建筑的数据时，也可以通过这个值表示简直的高度。
							 itemStyle: {			// 单个区域的样式设置
					            color: '#EEEE00',
					            opacity: 1,
					            borderWidth: 0.4,
					            borderColor: '#5F9EA0'
							 },
							},
							{name: 'Islands',
							 value: 1000,
							//  height: 100,
							 itemStyle: {				// 单个区域的样式设置
					            color: '#00FF00',
					            opacity: 1,
					            borderWidth: 0.4,
					            borderColor: '#5F9EA0'
							 },
							},
							{name: 'Eastern', value: 5000},
							{name: 'Wong Tai Sin', value: 20000},
							{name: 'Wan Chai', value: 25000},
							{name: 'Tuen Mun', value: 30000},
							{name: 'Tsuen Wan', value: 18000},
							{name: 'Tai Po', value: 2300},
							{name: 'Southern', value: 20000},
							{name: 'Sham Shui Po', value: 16000},
							{name: 'Sha Tin', value: 28000}
						]
			        }]
			};
			// 设置图表实例的配置项以及数据，万能接口，所有参数和数据的修改都可以通过setOption完成，ECharts 会合并新的参数和数据，然后刷新图表。
			myChart.setOption(option);
      // addHeight(myChart)
      myChart.on('click', function (param) {
            console.info('点击' + JSON.stringify(param.data) ) // 柱状图上的数值并不会弹出
            // this.openMessage() // 这个方法也没执行
            //可根据 param.data.name 进行判断 跳转 第七区
      });
      // console.log(option.series[0].data[1]);
      // myChart.on('mouseover', function (param) {
      //   console.log(param.data.name)
      //   var option1 = option.series[0].data[
      //       {name:param.data.name,height:10,borderWidth: 1,}];
      //       console.log(option1);
      //       myChart.setOption(option1,true)
      //     });

      // myChart.on('mouseout', function (param) {
      //     myChart.setOption({series:[{data:[
      //       {name:param.data.name,height:3,borderWidth: 10,}]
      //   }]})
          // console.log(param.data.name)
      // });
      // myChart.on('mouseout', function (param) {
      //     myChart.setOption({series:[
      //       {name:param.data.name,height:3}
      //     ]})});
      window.addEventListener('resize',function() {myChart.resize()});
    },
    methods: {},
    watch: {},
    created() {
    }
  }
</script>
