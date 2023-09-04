<template>
  <div class="LVbody">
    <!-- 头部显示栏 -->
    <header>
      <h1>可视化</h1>
      <div class="showTime">{{ times }}</div>
    </header>
    <!-- 主体部分 -->
    <section class="mainbox">
      <!-- 中 -->
      <div class="column">
        <!-- no模块制作 -->
        <div class="no">
          <div class="no-hd">
            <ul>
              <li>125811</li>
              <li>100000</li>
            </ul>
          </div>
          <div class="no-bd">
            <ul>
              <li>前端需求人数</li>
              <li>市场供应人数</li>
            </ul>
          </div>
        </div>
        <!-- 地图模块 -->
        <div class="map">
          <div class="map1"></div>
          <div class="map2"></div>
          <div class="map3"></div>
          <div class="chart"></div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import "echarts-extension-amap";
import AMapLoader from "@amap/amap-jsapi-loader";
import china from '../map/json/china.json'
import axios from 'axios'
export default {
  data() {
    return {
      map: null, //初始化 map 对象
      times: '',//格式化之后的当前时间
      year: [],
      yeardata: [],
      loading: true,
    };
  },
  mounted() {
    echarts.registerMap("china", { geoJSON: china })
    // 获取时间
    this.getTimes()
    this.initMap()
    // this.dev0()
    // this.dev1()
    // this.dev2()
    // this.dev3()
    // this.dev4()
    // this.dev5()
    // this.dev6()
  },
  // 在Vue实例销毁前，清除定时器
  beforeDestroy() {
    if (this.times) {
      clearInterval(this.getTimesInterval);
    }
  },
  methods: {
    // 初始化高德地图
    // initMap() {
    //   window._AMapSecurityConfig = {
    //     securityJsCode: '8cf211a0fbbfd8bf936b57883039dbd5', // 高德地图的code
    //   }
    //   AMapLoader.load({
    //     key: "8cf211a0fbbfd8bf936b57883039dbd5", // 申请好的Web端开发者Key，首次调用 load 时必填
    //     version: "2.0", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
    //     plugins:['AMap.Autocomplete', 'AMap.PlaceSearch', 'AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 			  'AMap.MapType', 'AMap.PolyEditor', 'AMap.CircleEditor', 'AMap.MarkerClusterer'], // 需要使用的的插件列表，如比例尺'AMap.Scale'等
    //   }).then((AMap) => {
    //     // console.log(AMap);
    //     var myChart = echarts.init(document.querySelector(".map .chart"));
    //     var geoCoordMap = {
    //       上海: [121.4648, 31.2891],
    //       东莞: [113.8953, 22.901],
    //       东营: [118.7073, 37.5513],
    //       中山: [113.4229, 22.478],
    //       临汾: [111.4783, 36.1615],
    //       临沂: [118.3118, 35.2936],
    //       丹东: [124.541, 40.4242],
    //       丽水: [119.5642, 28.1854],
    //       乌鲁木齐: [87.9236, 43.5883],
    //       佛山: [112.8955, 23.1097],
    //       保定: [115.0488, 39.0948],
    //       兰州: [103.5901, 36.3043],
    //       包头: [110.3467, 41.4899],
    //       北京: [116.4551, 40.2539],
    //       北海: [109.314, 21.6211],
    //       南京: [118.8062, 31.9208],
    //       南宁: [108.479, 23.1152],
    //       南昌: [116.0046, 28.6633],
    //       南通: [121.1023, 32.1625],
    //       厦门: [118.1689, 24.6478],
    //       台州: [121.1353, 28.6688],
    //       合肥: [117.29, 32.0581],
    //       呼和浩特: [111.4124, 40.4901],
    //       咸阳: [108.4131, 34.8706],
    //       哈尔滨: [127.9688, 45.368],
    //       唐山: [118.4766, 39.6826],
    //       嘉兴: [120.9155, 30.6354],
    //       大同: [113.7854, 39.8035],
    //       大连: [122.2229, 39.4409],
    //       天津: [117.4219, 39.4189],
    //       太原: [112.3352, 37.9413],
    //       威海: [121.9482, 37.1393],
    //       宁波: [121.5967, 29.6466],
    //       宝鸡: [107.1826, 34.3433],
    //       宿迁: [118.5535, 33.7775],
    //       常州: [119.4543, 31.5582],
    //       广州: [113.5107, 23.2196],
    //       廊坊: [116.521, 39.0509],
    //       延安: [109.1052, 36.4252],
    //       张家口: [115.1477, 40.8527],
    //       徐州: [117.5208, 34.3268],
    //       德州: [116.6858, 37.2107],
    //       惠州: [114.6204, 23.1647],
    //       成都: [103.9526, 30.7617],
    //       扬州: [119.4653, 32.8162],
    //       承德: [117.5757, 41.4075],
    //       拉萨: [91.1865, 30.1465],
    //       无锡: [120.3442, 31.5527],
    //       日照: [119.2786, 35.5023],
    //       昆明: [102.9199, 25.4663],
    //       杭州: [119.5313, 29.8773],
    //       枣庄: [117.323, 34.8926],
    //       柳州: [109.3799, 24.9774],
    //       株洲: [113.5327, 27.0319],
    //       武汉: [114.3896, 30.6628],
    //       汕头: [117.1692, 23.3405],
    //       江门: [112.6318, 22.1484],
    //       沈阳: [123.1238, 42.1216],
    //       沧州: [116.8286, 38.2104],
    //       河源: [114.917, 23.9722],
    //       泉州: [118.3228, 25.1147],
    //       泰安: [117.0264, 36.0516],
    //       泰州: [120.0586, 32.5525],
    //       济南: [117.1582, 36.8701],
    //       济宁: [116.8286, 35.3375],
    //       海口: [110.3893, 19.8516],
    //       淄博: [118.0371, 36.6064],
    //       淮安: [118.927, 33.4039],
    //       深圳: [114.5435, 22.5439],
    //       清远: [112.9175, 24.3292],
    //       温州: [120.498, 27.8119],
    //       渭南: [109.7864, 35.0299],
    //       湖州: [119.8608, 30.7782],
    //       湘潭: [112.5439, 27.7075],
    //       滨州: [117.8174, 37.4963],
    //       潍坊: [119.0918, 36.524],
    //       烟台: [120.7397, 37.5128],
    //       玉溪: [101.9312, 23.8898],
    //       珠海: [113.7305, 22.1155],
    //       盐城: [120.2234, 33.5577],
    //       盘锦: [121.9482, 41.0449],
    //       石家庄: [114.4995, 38.1006],
    //       福州: [119.4543, 25.9222],
    //       秦皇岛: [119.2126, 40.0232],
    //       绍兴: [120.564, 29.7565],
    //       聊城: [115.9167, 36.4032],
    //       肇庆: [112.1265, 23.5822],
    //       舟山: [122.2559, 30.2234],
    //       苏州: [120.6519, 31.3989],
    //       莱芜: [117.6526, 36.2714],
    //       菏泽: [115.6201, 35.2057],
    //       营口: [122.4316, 40.4297],
    //       葫芦岛: [120.1575, 40.578],
    //       衡水: [115.8838, 37.7161],
    //       衢州: [118.6853, 28.8666],
    //       西宁: [101.4038, 36.8207],
    //       西安: [109.1162, 34.2004],
    //       贵阳: [106.6992, 26.7682],
    //       连云港: [119.1248, 34.552],
    //       邢台: [114.8071, 37.2821],
    //       邯郸: [114.4775, 36.535],
    //       郑州: [113.4668, 34.6234],
    //       鄂尔多斯: [108.9734, 39.2487],
    //       重庆: [107.7539, 30.1904],
    //       金华: [120.0037, 29.1028],
    //       铜川: [109.0393, 35.1947],
    //       银川: [106.3586, 38.1775],
    //       镇江: [119.4763, 31.9702],
    //       长春: [125.8154, 44.2584],
    //       长沙: [113.0823, 28.2568],
    //       长治: [112.8625, 36.4746],
    //       阳泉: [113.4778, 38.0951],
    //       青岛: [120.4651, 36.3373],
    //       韶关: [113.7964, 24.7028]
    //     };

    //     var XAData = [
    //       [{ name: "西安" }, { name: "拉萨", value: 100 }],
    //       [{ name: "西安" }, { name: "上海", value: 100 }],
    //       [{ name: "西安" }, { name: "广州", value: 100 }],
    //       [{ name: "西安" }, { name: "西宁", value: 100 }],
    //       [{ name: "西安" }, { name: "银川", value: 100 }]
    //     ];

    //     var XNData = [
    //       [{ name: "西宁" }, { name: "北京", value: 100 }],
    //       [{ name: "西宁" }, { name: "上海", value: 200 }],
    //       [{ name: "西宁" }, { name: "广州", value: 60 }],
    //       [{ name: "西宁" }, { name: "西安", value: 40 }],
    //       [{ name: "西宁" }, { name: "银川", value: 50 }]
    //     ];

    //     var YCData = [
    //       [{ name: "拉萨" }, { name: "潍坊", value: 100 }],
    //       [{ name: "拉萨" }, { name: "哈尔滨", value: 100 }],
    //       [{ name: "银川" }, { name: "上海", value: 500 }],
    //       [{ name: "银川" }, { name: "西安", value: 100 }],
    //       [{ name: "银川" }, { name: "西宁", value: 100 }]
    //     ];

    //     var planePath = "path://M1705.06,1318.313v-89.254l-319.9-221.799l0.073-208.063c0.521-84.662-26.629-121.796-63.961-121.491c-37.332-0.305-64.482,36.829-63.961,121.491l0.073,208.063l-319.9,221.799v89.254l330.343-157.288l12.238,241.308l-134.449,92.931l0.531,42.034l175.125-42.917l175.125,42.917l0.531-42.034l-134.449-92.931l12.238-241.308L1705.06,1318.313z";
    //     //var planePath = 'arrow';
    //     var convertData = function (data) {
    //       var res = [];
    //       for (var i = 0; i < data.length; i++) {
    //         var dataItem = data[i];
    //         var fromCoord = geoCoordMap[dataItem[0].name];
    //         var toCoord = geoCoordMap[dataItem[1].name];
    //         if (fromCoord && toCoord) {
    //           res.push({
    //             fromName: dataItem[0].name,
    //             toName: dataItem[1].name,
    //             coords: [fromCoord, toCoord],
    //             value: dataItem[1].value
    //           });
    //         }
    //       }
    //       // console.log(res);
    //       return res;
    //     };
    //     var color = ["#a6c84c", "#ffa022", "#46bee9"]; //航线的颜色
    //     var series = [];
    //     [
    //       ["西安", XAData],
    //       ["西宁", XNData],
    //       ["银川", YCData]
    //     ].forEach(function (item, i) {
    //       // console.log(item[1])
    //       series.push(
    //         // {
    //         //   name: item[0] + " Top3",
    //         //   coordinateSystem: 'amap',
    //         //   type: "lines",
    //         //   zlevel: 1,
    //         //   effect: {
    //         //     show: true,
    //         //     period: 6,
    //         //     trailLength: 0.7,
    //         //     color: "red", //arrow箭头的颜色
    //         //     symbolSize: 3
    //         //   },
    //         //   lineStyle: {
    //         //     color: color[i],
    //         //     width: 0,
    //         //     curveness: 0.2
    //         //   },
    //         //   data: convertData(item[1]) // {fromName: '西安', toName: '拉萨', coords: Array(2), value: 100}
    //         // },
    //         {
    //           name: item[0] + " Top3",
    //           coordinateSystem: 'amap',
    //           type: "lines",
    //           zlevel: 2,
    //           symbol: ["circle", "arrow"],
    //           symbolSize: 10,
    //           effect: {
    //             show: true,
    //             period: 6,
    //             trailLength: 0,
    //             symbol: planePath,
    //             symbolSize: 15
    //           },
    //           lineStyle: {
    //             color: color[i],
    //             width: 1,
    //             opacity: 0.6,
    //             curveness: 0.2
    //           },
    //           data: convertData(item[1])
    //         },
    //         {
    //           name: item[0] + " Top3",
    //           coordinateSystem: 'amap',
    //           type: "effectScatter",
    //           // type: 'scatter',
    //           // shape: 'prism',
    //           // zlevel: 2,
    //           // z: item[1].map(dataItem=>-dataItem[1].value),
    //           rippleEffect: {
    //             brushType: "stroke"
    //           },
    //           label: {
    //             show: true,
    //             position: "right",
    //             formatter: "{b}"
    //           },
    //           symbolSize: function (val) {
    //             return val[2] / 8;
    //           },
    //           itemStyle: {
    //             color: color[i],
    //           },
    //           emphasis: {
    //               areaColor: "#2B91B7"
    //           },
    //           data: item[1].map(function (dataItem) {
    //             return {
    //               name: dataItem[1].name,
    //               value: geoCoordMap[dataItem[1].name].concat([dataItem[1].value])
    //             };
    //           })
    //         }
    //       );
    //     });

    //     var option = {
    //       amap: {// 高德地图配置
    //         center: [104.114129, 37.550339], // 地图中心点
    //         zoom: 4,// 地图缩放级别
    //         viewMode: '3D',// 地图模式
    //         resizeEnabled: true,// 是否监控地图容器尺寸变化
    //         // mapStyle: 'amap://styles/7daf7c6981b0bc497d78c23077f5492f',// 地图样式
    //         mapStyle: 'amap://styles/blue',// 地图样式
    //         pitch: 15, //视角高度
    //         // features: ['bg', 'road','building'],
    //         opacity:0.1,
    //         skyColor: "#33216a", //天空颜色
    //       },
    //       tooltip: {
    //         trigger: "item",
    //         formatter: function (params, ticket, callback) {
    //           if (params.seriesType == "effectScatter") {
    //             return "线路：" + params.data.name + "" + params.data.value[2];
    //           } else if (params.seriesType == "lines") {
    //             return (
    //               params.data.fromName +
    //               ">" +
    //               params.data.toName +
    //               "<br />" +
    //               params.data.value
    //             );
    //           } else {
    //             return params.name;
    //           }
    //         }
    //       },
    //       legend: {
    //         orient: "vertical",
    //         top: 10,
    //         left: "right",
    //         data: ["西安 Top3", "西宁 Top3", "银川 Top3"],
    //         textStyle: {
    //           color: "#fff",
    //           fontSize: 14
    //         },
    //         selectedMode: "multiple"
    //       },
    //       // geo: {
    //       //   map: "china",
    //       //   coordinateSystem:'amap',
    //       //   label: {
    //       //     emphasis: {
    //       //       show: true,
    //       //       color: "#fff"
    //       //     }
    //       //   },
    //       //   // 把中国地图放大了1.2倍
    //       //   zoom: 1.2,
    //       //   roam: true,
    //       //   scaleLimit: {
    //       //     min: 0.5, // 最小的缩放值
    //       //     max: 3, // 最大的缩放值
    //       //   },
    //       //   itemStyle: {
    //       //     normal: {
    //       //       // 地图省份的背景颜色
    //       //       areaColor: "rgba(20, 41, 87,0.6)",
    //       //       borderColor: "#195BB9",
    //       //       borderWidth: 1
    //       //     },
    //       //     emphasis: {
    //       //       areaColor: "#2B91B7"
    //       //     }
    //       //   }
    //       // },
    //       series: series
    //     };
    //     myChart.setOption(option);
    //     myChart.getModel().getComponent('amap').getAMap();//获取高德地图实例
    //     // 监听浏览器缩放，图表对象调用缩放resize函数
    //     window.addEventListener("resize", function () {
    //       myChart.resize();
    //     });
    //   });
    // },
    // initMap() {
    //   window._AMapSecurityConfig = {
    //     securityJsCode: '8cf211a0fbbfd8bf936b57883039dbd5', // 高德地图的code
    //   }
    //   AMapLoader.load({
    //     key: "8cf211a0fbbfd8bf936b57883039dbd5", // 申请好的Web端开发者Key，首次调用 load 时必填
    //     version: "2.0", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
    //     // plugins: ['AMap.Autocomplete', 'AMap.PlaceSearch', 'AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType', 'AMap.PolyEditor', 'AMap.CircleEditor', 'AMap.MarkerClusterer'], // 需要使用的的插件列表，如比例尺'AMap.Scale'等
    //   }).then((AMap) => {
    //     // console.log(AMap);
    //     var myChart = echarts.init(document.querySelector(".map .chart"));
    //     var name_title = "中国各省份私家汽车拥有量"
    //     var nameColor = " rgb(0, 0, 0)"
    //     var name_fontFamily = '宋体'
    //     var name_fontSize = 38

    //     var data = [

    //       {
    //         name: "北京",
    //         value: 497.03,
    //         scale: '2.21%'
    //       },
    //       {
    //         name: "天津",
    //         value: 259.43,
    //         scale: '1.15%'
    //       },
    //       {
    //         name: "河北",
    //         value: 1518.86,
    //         scale: '6.75%'
    //       },
    //       {
    //         name: "山西",
    //         value: 640.82,
    //         scale: '2.85%'
    //       },
    //       {
    //         name: "内蒙古",
    //         value: 530.39,
    //         scale: '2.36%'
    //       },
    //       {
    //         name: "辽宁",
    //         value: 750.63,
    //         scale: '3.33%'
    //       },
    //       {
    //         name: "吉林",
    //         value: 408.08,
    //         scale: '1.81%'
    //       },
    //       {
    //         name: "黑龙江",
    //         value: 463.57,
    //         scale: '2.06%'
    //       },
    //       {
    //         name: "上海",
    //         value: 321.27,
    //         scale: '1.43%'
    //       },
    //       {
    //         name: "江苏",
    //         value: 1639.89,
    //         scale: '7.29%'
    //       },
    //       {
    //         name: "浙江",
    //         value: 1459.21,
    //         scale: '6.48%'
    //       },
    //       {
    //         name: "安徽",
    //         value: 794.26,
    //         scale: '3.53%'
    //       },
    //       {
    //         name: "福建",
    //         value: 590.51,
    //         scale: '2.62%'
    //       },
    //       {
    //         name: "江西",
    //         value: 537.77,
    //         scale: '2.39%'
    //       },
    //       {
    //         name: "山东",
    //         value: 2092.39,
    //         scale: '9.30%'
    //       },
    //       {
    //         name: "河南",
    //         value: 1471.95,
    //         scale: '6.54%'
    //       },
    //       {
    //         name: "湖北",
    //         value: 772.35,
    //         scale: '3.43%'
    //       },
    //       {
    //         name: "湖南",
    //         value: 807.96,
    //         scale: '3.59%'
    //       },
    //       {
    //         name: "广东",
    //         value: 2037.15,
    //         scale: '9.05%'
    //       },
    //       {
    //         name: "广西",
    //         value: 613.4,
    //         scale: '2.73%'
    //       },
    //       {
    //         name: "海南",
    //         value: 117.91,
    //         scale: '0.52%'
    //       },
    //       {
    //         name: "重庆",
    //         value: 403.3,
    //         scale: '1.79%'
    //       },
    //       {
    //         name: "四川",
    //         value: 1058.68,
    //         scale: '4.70%'
    //       },
    //       {
    //         name: "贵州",
    //         value: 487.45,
    //         scale: '2.17%'
    //       },
    //       {
    //         name: "云南",
    //         value: 681.57,
    //         scale: '3.03%'
    //       },
    //       {
    //         name: "西藏",
    //         value: 47.82,
    //         scale: '0.21%'
    //       },
    //       {
    //         name: "陕西",
    //         value: 609.24,
    //         scale: '2.71%'
    //       },
    //       {
    //         name: "甘肃",
    //         value: 290.91,
    //         scale: '1.29%'
    //       },
    //       {
    //         name: "青海",
    //         value: 99.64,
    //         scale: '0.44%'
    //       },
    //       {
    //         name: "宁夏",
    //         value: 143.16,
    //         scale: '0.64%'
    //       },
    //       {
    //         name: "新疆",
    //         value: 362.41,
    //         scale: '1.61%'
    //       },

    //     ];
    //     // var mapName = 'china'
    //     var geoCoordMap = {
    //       "台湾": [121.509062, 25.044332],
    //       "河北": [114.502461, 38.045474],
    //       "山西": [112.549248, 37.857014],
    //       "内蒙古": [111.670801, 40.818311],
    //       "辽宁": [123.429096, 41.796767],
    //       "吉林": [125.3245, 43.886841],
    //       "黑龙江": [126.642464, 45.756967],
    //       "江苏": [118.767413, 32.041544],
    //       "浙江": [120.153576, 30.287459],
    //       "安徽": [117.283042, 31.86119],
    //       "福建": [119.306239, 26.075302],
    //       "江西": [115.892151, 28.676493],
    //       "山东": [117.000923, 36.675807],
    //       "河南": [113.665412, 34.757975],
    //       "湖北": [114.298572, 30.584355],
    //       "湖南": [112.982279, 28.19409],
    //       "广东": [113.280637, 23.125178],
    //       "广西": [108.320004, 22.82402],
    //       "海南": [110.33119, 20.031971],
    //       "四川": [104.065735, 30.659462],
    //       "贵州": [106.713478, 26.578343],
    //       "云南": [102.712251, 25.040609],
    //       "西藏": [91.132212, 29.660361],
    //       "陕西": [108.948024, 34.263161],
    //       "甘肃": [103.823557, 36.058039],
    //       "青海": [101.778916, 36.623178],
    //       "宁夏": [106.278179, 38.46637],
    //       "新疆": [87.617733, 43.792818],
    //       "北京": [116.405285, 39.904989],
    //       "天津": [117.190182, 39.125596],
    //       "上海": [121.472644, 31.231706],
    //       "重庆": [106.504962, 29.533155],
    //       "香港": [114.173355, 22.320048],
    //       "澳门": [113.54909, 22.198951]
    //     };
    //     /*获取地图数据*/
    //     // myChart.showLoading();
    //     // var mapFeatures = echarts.getMap(mapName).geoJson.features;
    //     // myChart.hideLoading();
    //     // mapFeatures.forEach(function (v) { // 地区名称
    //     //   var name = v.properties.name;
    //     //   // 地区经纬度
    //     //   geoCoordMap[name] = v.properties.cp;

    //     // });
    //     // console.log(data)
    //     var max = 2100,
    //       min = 40; // todo
    //     var maxSize4Pin = 80,
    //       minSize4Pin = 20;

    //     var convertData = function (data) {
    //       var res = [];
    //       for (var i = 0; i < data.length; i++) {
    //         var geoCoord = geoCoordMap[data[i].name];
    //         if (geoCoord) {
    //           res.push({
    //             name: data[i].name,
    //             value: geoCoord.concat(data[i].value),
    //             scale:data[i].scale
    //           });
    //         }
    //       }
    //       // console.log(res)
    //       return res;
    //     };
    //     var option = {
    //       amap: {// 高德地图配置
    //         center: [104.114129, 37.550339], // 地图中心点
    //         zoom: 4,// 地图缩放级别
    //         viewMode: '3D',// 地图模式
    //         resizeEnabled: true,// 是否监控地图容器尺寸变化
    //         // mapStyle: 'amap://styles/7daf7c6981b0bc497d78c23077f5492f',// 地图样式
    //         mapStyle: 'amap://styles/blue',// 地图样式
    //         pitch: 15, //视角高度
    //         // features: ['bg', 'road','building'],
    //         opacity: 0.1,
    //         skyColor: "#33216a", //天空颜色
    //       },
    //       title: {
    //         text: name_title,
    //         x: 'center',
    //         textStyle: {
    //           color: nameColor,
    //           fontFamily: name_fontFamily,
    //           fontSize: name_fontSize
    //         },

    //       },
    //       tooltip: {
    //         trigger: 'item',
    //         formatter: function (params) {
    //           // console.log(params)
    //           if (params.data.name) {
    //             return (params.data.name + "<br/>" + params.data.scale);
    //           }
    //         }
    //       },
    //       series: [{
    //         name: '散点',
    //         type: 'scatter',
    //         coordinateSystem: 'amap',
    //         data: convertData(data),
    //         emphasis: {
    //           show: true
    //         },
    //         symbolSize: function (val) {
    //           return val[2] / 100;
    //         },
    //         label: {
    //           formatter: '{b}',
    //           position: 'right',
    //           show: true,
    //         },
    //         itemStyle: {
    //           color: '#05C3F9'
    //         }
    //       },
    //       {
    //         name: '点',
    //         type: 'scatter',
    //         coordinateSystem: 'amap',
    //         symbol: 'pin', //气泡
    //         symbolSize: function (val) {
    //           var a = (maxSize4Pin - minSize4Pin) / (max - min);
    //           var b = minSize4Pin - a * min;
    //           b = maxSize4Pin - a * max;
    //           return (a * val[2] + b);
    //         },
    //         label: {
    //           formatter: '{@[2]}' + '万辆',
    //           show: true,
    //           color: '#fff',
    //           fontSize: 9,
    //         },
    //         itemStyle: {
    //           color: '#F62157', //标志颜色
    //         },
    //         zlevel: 6,
    //         data: convertData(data),
    //       },
    //       {
    //         name: 'Top 10',
    //         type: 'effectScatter',
    //         coordinateSystem: 'amap',
    //         data: convertData(data.sort(function (a, b) {
    //           return b.value - a.value;
    //         }).slice(0, 10)),
    //         symbolSize: function (val) {
    //           return val[2] / 100;
    //         },
    //         showEffectOn: 'render',
    //         rippleEffect: {
    //           brushType: 'stroke'
    //         },
    //         emphasis:{
    //           scale:true
    //         },
    //         label: {
    //           formatter: '{b}',
    //           position: 'right',
    //           show: true
    //         },
    //         itemStyle: {
    //           color: 'yellow',
    //           shadowBlur: 10,
    //           shadowColor: 'yellow'
    //         },
    //         zlevel: 1
    //       },
    //       ]
    //     };
    //     myChart.setOption(option);
    //     myChart.getModel().getComponent('amap').getAMap();//获取高德地图实例
    //     // 监听浏览器缩放，图表对象调用缩放resize函数
    //     window.addEventListener("resize", function () {
    //       myChart.resize();
    //     });
    //   });
    // },
    // initMap() {
    //   // 动态计算柱形图的高度（定一个max）

    //   window._AMapSecurityConfig = {
    //     securityJsCode: '8cf211a0fbbfd8bf936b57883039dbd5', // 高德地图的code
    //   }
    //   AMapLoader.load({
    //     key: "8cf211a0fbbfd8bf936b57883039dbd5", // 申请好的Web端开发者Key，首次调用 load 时必填
    //     version: "2.0", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
    //     // plugins: ['AMap.Autocomplete', 'AMap.PlaceSearch', 'AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType', 'AMap.PolyEditor', 'AMap.CircleEditor', 'AMap.MarkerClusterer'], // 需要使用的的插件列表，如比例尺'AMap.Scale'等
    //   }).then((AMap) => {
    //     // console.log(AMap);
    //     var myChart = echarts.init(document.querySelector(".map .chart"));
    //     var geoCoordMap = {
    //       广州市: [113.507649675, 23.3200491021],
    //       东莞市: [113.863433991, 22.9430238154],
    //       中山市: [113.422060021, 22.5451775145],
    //       云浮市: [111.750945959, 22.9379756855],
    //       佛山市: [113.034025635, 23.0350948405],
    //       惠州市: [114.41065808, 23.1135398524],
    //       揭阳市: [116.079500855, 23.3479994669],
    //       梅州市: [116.126403098, 24.304570606],
    //       汕头市: [116.588650288, 23.2839084533],
    //       汕尾市: [115.572924289, 22.9787305002],
    //       江门市: [112.678125341, 22.2751167835],
    //       河源市: [114.913721476, 23.9572508505],
    //       深圳市: [114.025973657, 22.5960535462],
    //       清远市: [113.040773349, 23.9984685504],
    //       湛江市: [110.165067263, 21.2574631038],
    //       潮州市: [116.830075991, 23.7618116765],
    //       珠海市: [113.262447026, 22.1369146461],
    //       肇庆市: [112.37965337, 23.5786632829],
    //       茂名市: [110.931245331, 21.9682257188],
    //       阳江市: [111.777009756, 21.9715173045],
    //       韶关市: [113.594461107, 24.8029603119]
    //     }
    //     var customerBatteryCityData = [
    //       { name: "阳江市", value: 70 },
    //       { name: "茂名市", value: 20 },
    //       { name: "广州市", value: 70 },
    //       { name: "河源市", value: 70 },
    //       { name: "湛江市", value: 120 },
    //       { name: "潮州市", value: 70 },
    //       { name: "东莞市", value: 70 },
    //       { name: "深圳市", value: 0 },
    //       { name: "清远市", value: 70 },
    //       { name: "韶关市", value: 10 },
    //       { name: "云浮市", value: 70 },
    //       { name: "惠州市", value: 150 },
    //       { name: "汕头市", value: 60 },
    //       { name: "揭阳市", value: 80 },
    //       { name: "中山市", value: 70 },
    //       { name: "肇庆市", value: 70 },
    //       { name: "珠海市", value: 120 },
    //       { name: "汕尾市", value: 0 },
    //       { name: "江门市", value: 70 },
    //       { name: "梅州市", value: 70 },
    //       { name: "佛山市", value: 10 }
    //     ]
    //     var option = {
    //       amap: {// 高德地图配置
    //         center: [113.034025635, 23.0350948405], // 地图中心点
    //         zoom: 7,// 地图缩放级别
    //         viewMode: '2D',// 地图模式
    //         resizeEnabled: true,// 是否监控地图容器尺寸变化
    //         // mapStyle: 'amap://styles/7daf7c6981b0bc497d78c23077f5492f',// 地图样式
    //         mapStyle: 'amap://styles/blue',// 地图样式
    //         // pitch: 15, //视角高度
    //         // features: ['bg', 'road','building'],
    //         opacity: 0.1,
    //         skyColor: "#33216a", //天空颜色
    //       },
    //       tooltip: {
    //         // borderWidth: 0,
    //         trigger: 'item',
    //         show: true,
    //         enterable: true,
    //         textStyle: {
    //           fontSize: 20,
    //           color: '#fff'
    //         },
    //         backgroundColor: 'rgba(0,2,89,0.8)',
    //         formatter: (params) => {
    //         return customerBatteryCityData[params.dataIndex].name+ ':'+customerBatteryCityData[params.dataIndex].value;
    //         // console.log(customerBatteryCityData[params.dataIndex].value)
    //       },
    //       },
    //       series: [
    //         {
    //           type: 'lines',
    //           coordinateSystem: 'amap',
    //           zlevel: 5,
    //           effect: {
    //             show: false,
    //             // period: 4, //箭头指向速度，值越小速度越快
    //             // trailLength: 0.02, //特效尾迹长度[0,1]值越大，尾迹越长重
    //             // symbol: 'arrow', //箭头图标
    //             // symbol: imgDatUrl,
    //             symbolSize: 5 // 图标大小
    //           },
    //           lineStyle: {
    //             width: 17, // 尾迹线条宽度
    //             color: {
    //               type: 'linear',
    //               x: 0,
    //               y: 0,
    //               x2: 1,
    //               y2: 0,
    //               colorStops: [
    //                 {
    //                   offset: 0,
    //                   color: 'rgb(199,145,41)' // 0% 处的颜色
    //                 },
    //                 {
    //                   offset: 0.5,
    //                   color: 'rgb(199,145,41)' // 0% 处的颜色
    //                 },
    //                 {
    //                   offset: 0.5,
    //                   color: 'rgb(223,176,32)' // 0% 处的颜色
    //                 },
    //                 {
    //                   offset: 1,
    //                   color: 'rgb(223,176,32)' // 0% 处的颜色
    //                 },
    //                 {
    //                   offset: 1,
    //                   color: 'rgb(199,145,41)' // 100% 处的颜色
    //                 }
    //               ],
    //               global: false // 缺省为 false
    //             },
    //             opacity: 1, // 尾迹线条透明度
    //             curveness: 0 // 尾迹线条曲直度
    //           },
    //           label: {
    //             show: 0,
    //             position: 'end',
    //             formatter: '{b}'
    //           },
    //           // silent: true,
    //           data: lineData()
    //         },
    //         {
    //           type: 'scatter',
    //           coordinateSystem: 'amap',
    //           // geoIndex: 0,
    //           zlevel: 5,
    //           label: {
    //             show: false,
    //             position: 'bottom',
    //             formatter: (params) => this.data[params.dataIndex].value,
    //             padding: [4, 8],
    //             backgroundColor: '#003F5E',
    //             borderRadius: 5,
    //             borderColor: '#67F0EF',
    //             borderWidth: 1,
    //             color: '#67F0EF'
    //           },
    //           symbol: 'diamond',
    //           symbolSize: [17, 8],
    //           itemStyle: {
    //             color: '#ffd133',
    //             opacity: 1
    //           },
    //           silent: true,
    //           data: scatterData()
    //         },
    //         {
    //           type: 'scatter',
    //           coordinateSystem: 'amap',
    //           // geoIndex: 0,
    //           zlevel: 4,
    //           label: {
    //             formatter: '{b}',
    //             position: 'bottom',
    //             color: '#fff',
    //             fontSize: 12,
    //             distance: 10,
    //             show: true
    //           },
    //           symbol: 'diamond',
    //           symbolSize: [17, 8],
    //           itemStyle: {
    //             // color: '#F7AF21',
    //             color: {
    //               type: 'linear',
    //               x: 0,
    //               y: 0,
    //               x2: 1,
    //               y2: 0,
    //               colorStops: [
    //                 {
    //                   offset: 0,
    //                   color: 'rgb(199,145,41)' // 0% 处的颜色
    //                 },
    //                 {
    //                   offset: 0.5,
    //                   color: 'rgb(199,145,41)' // 0% 处的颜色
    //                 },
    //                 {
    //                   offset: 0.5,
    //                   color: 'rgb(223,176,32)' // 0% 处的颜色
    //                 },
    //                 {
    //                   offset: 1,
    //                   color: 'rgb(223,176,32)' // 0% 处的颜色
    //                 },
    //                 {
    //                   offset: 1,
    //                   color: 'rgb(199,145,41)' // 100% 处的颜色
    //                 }
    //               ],
    //               global: false // 缺省为 false
    //             },
    //             opacity: 1
    //             // shadowColor: '#fff',
    //             // shadowBlur: 5,
    //             // shadowOffsetY: 2
    //           },
    //           silent: true,
    //           data: scatterData2()
    //         },
    //         // {
    //         //   type: 'effectScatter',
    //         //   coordinateSystem: 'amap',
    //         //   // geoIndex: 0,
    //         //   symbol: 'circle',
    //         //   symbolSize: 4,
    //         //   showEffectOn: 'render',
    //         //   rippleEffect: {
    //         //     brushType: 'fill',
    //         //     scale: 10
    //         //   },
    //         //   label: {
    //         //     // formatter: (p) => {
    //         //     //   console.log(p, 99999)
    //         //     //   return p.data[2]
    //         //     // },
    //         //     formatter: '{b}',
    //         //     position: 'bottom',
    //         //     color: '#fff',
    //         //     fontSize: 14,
    //         //     distance: 10,
    //         //     show: true
    //         //   },
    //         //   itemStyle: {
    //         //     color: '#bacac6'
    //         //   },
    //         //   zlevel: 5,
    //         //   data: scatterData2()
    //         // }
    //       ]
    //     };
    //     myChart.setOption(option);
    //     var amap = myChart.getModel().getComponent('amap').getAMap();
    //     amap.addControl(new AMap.Scale());
    //     amap.addControl(new AMap.ToolBar());//获取高德地图实例
    //     // 监听浏览器缩放，图表对象调用缩放resize函数
    //     window.addEventListener("resize", function () {
    //       myChart.resize();
    //     });
    //     function lineMaxHeight() {
    //       const maxValue = Math.max(...customerBatteryCityData.map(item => item.value))
    //       return 0.9 / maxValue
    //     }
    //     // 柱状体的主干
    //     function lineData() {
    //       return customerBatteryCityData.map((item) => {
    //         return {
    //           coords: [geoCoordMap[item.name], [geoCoordMap[item.name][0], geoCoordMap[item.name][1] + item.value * lineMaxHeight()]],
    //           value:item.value
    //         }
    //       })
    //     }
    //     // 柱状体的顶部
    //     function scatterData() {
    //       return customerBatteryCityData.map((item) => {
    //         return [geoCoordMap[item.name][0], geoCoordMap[item.name][1] + item.value * lineMaxHeight()]
    //       })
    //     }
    //     // 柱状体的底部
    //     function scatterData2() {
    //       return customerBatteryCityData.map((item) => {
    //         return {
    //           name: item.name,
    //           value: geoCoordMap[item.name]
    //         }
    //       })
    //     }
    //   });
    // },
    // 设置定时器
    initMap() {
      // 动态计算柱形图的高度（定一个max）

      window._AMapSecurityConfig = {
        securityJsCode: '8cf211a0fbbfd8bf936b57883039dbd5', // 高德地图的code
      }
      AMapLoader.load({
        key: "8cf211a0fbbfd8bf936b57883039dbd5", // 申请好的Web端开发者Key，首次调用 load 时必填
        version: "2.0", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
        plugins: ['AMap.Autocomplete', 'AMap.PlaceSearch', 'AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType', 'AMap.PolyEditor', 'AMap.CircleEditor', 'AMap.MarkerClusterer'], // 需要使用的的插件列表，如比例尺'AMap.Scale'等
      }).then((AMap) => {
        // console.log(AMap);
        AMap.plugin(['AMap.ToolBar', 'AMap.Driving', 'AMap.Scale', 'AMap.MapType '], () => { });
        var myChart = echarts.init(document.querySelector(".map .chart"));
        var data = [
          { name: "海门", value: 9 },
          { name: "鄂尔多斯", value: 12 },
          { name: "招远", value: 12 },
          { name: "舟山", value: 12 },
          { name: "齐齐哈尔", value: 14 },
          { name: "盐城", value: 15 },
          { name: "赤峰", value: 16 },
          { name: "青岛", value: 18 },
          { name: "台北", value: 18 },
          { name: "乳山", value: 18 },
          { name: "金昌", value: 19 },
          { name: "泉州", value: 21 },
          { name: "莱西", value: 21 },
          { name: "日照", value: 21 },
          { name: "胶南", value: 22 },
          { name: "南通", value: 23 },
          { name: "拉萨", value: 24 },
          { name: "云浮", value: 24 },
          { name: "梅州", value: 25 },
          { name: "文登", value: 25 },
          { name: "嘉义", value: 25 },
          { name: "上海", value: 25 },
          { name: "攀枝花", value: 25 },
          { name: "威海", value: 25 },
          { name: "承德", value: 25 },
          { name: "厦门", value: 26 },
          { name: "汕尾", value: 26 },
          { name: "潮州", value: 26 },
          { name: "丹东", value: 27 },
          { name: "太仓", value: 27 },
          { name: "曲靖", value: 27 },
          { name: "烟台", value: 28 },
          { name: "福州", value: 29 },
          { name: "瓦房店", value: 30 },
          { name: "即墨", value: 30 },
          { name: "抚顺", value: 31 },
          { name: "玉溪", value: 31 },
          { name: "张家口", value: 31 },
          { name: "阳泉", value: 31 },
          { name: "莱州", value: 32 },
          { name: "湖州", value: 32 },
          { name: "汕头", value: 32 },
          { name: "昆山", value: 33 },
          { name: "宁波", value: 33 },
          { name: "湛江", value: 33 },
          { name: "揭阳", value: 34 },
          { name: "荣成", value: 34 },
          { name: "连云港", value: 35 },
          { name: "葫芦岛", value: 35 },
          { name: "常熟", value: 36 },
          { name: "东莞", value: 36 },
          { name: "河源", value: 36 },
          { name: "淮安", value: 36 },
          { name: "泰州", value: 36 },
          { name: "南宁", value: 37 },
          { name: "营口", value: 37 },
          { name: "惠州", value: 37 },
          { name: "江阴", value: 37 },
          { name: "蓬莱", value: 37 },
          { name: "高雄", value: 38 },
          { name: "韶关", value: 38 },
          { name: "嘉峪关", value: 38 },
          { name: "广州", value: 38 },
          { name: "延安", value: 38 },
          { name: "太原", value: 39 },
          { name: "清远", value: 39 },
          { name: "中山", value: 39 },
          { name: "昆明", value: 39 },
          { name: "寿光", value: 40 },
          { name: "盘锦", value: 40 },
          { name: "长治", value: 41 },
          { name: "深圳", value: 41 },
          { name: "珠海", value: 42 },
          { name: "宿迁", value: 43 },
          { name: "咸阳", value: 43 },
          { name: "铜川", value: 44 },
          { name: "平度", value: 44 },
          { name: "佛山", value: 44 },
          { name: "海口", value: 44 },
          { name: "江门", value: 45 },
          { name: "章丘", value: 45 },
          { name: "肇庆", value: 46 },
          { name: "大连", value: 47 },
          { name: "临汾", value: 47 },
          { name: "吴江", value: 47 },
          { name: "石嘴山", value: 49 },
          { name: "沈阳", value: 50 },
          { name: "苏州", value: 50 },
          { name: "茂名", value: 50 },
          { name: "嘉兴", value: 51 },
          { name: "长春", value: 51 },
          { name: "胶州", value: 52 },
          { name: "银川", value: 52 },
          { name: "张家港", value: 52 },
          { name: "三门峡", value: 53 },
          { name: "锦州", value: 54 },
          { name: "南昌", value: 54 },
          { name: "柳州", value: 54 },
          { name: "三亚", value: 54 },
          { name: "自贡", value: 56 },
          { name: "吉林", value: 56 },
          { name: "阳江", value: 57 },
          { name: "泸州", value: 57 },
          { name: "西宁", value: 57 },
          { name: "宜宾", value: 58 },
          { name: "呼和浩特", value: 58 },
          { name: "成都", value: 58 },
          { name: "大同", value: 58 },
          { name: "镇江", value: 59 },
          { name: "桂林", value: 59 },
          { name: "张家界", value: 59 },
          { name: "宜兴", value: 59 },
          { name: "北海", value: 60 },
          { name: "西安", value: 61 },
          { name: "金坛", value: 62 },
          { name: "东营", value: 62 },
          { name: "牡丹江", value: 63 },
          { name: "遵义", value: 63 },
          { name: "绍兴", value: 63 },
          { name: "扬州", value: 64 },
          { name: "常州", value: 64 },
          { name: "潍坊", value: 65 },
          { name: "重庆", value: 66 },
          { name: "台州", value: 67 },
          { name: "南京", value: 67 },
          { name: "滨州", value: 70 },
          { name: "贵阳", value: 71 },
          { name: "无锡", value: 71 },
          { name: "本溪", value: 71 },
          { name: "克拉玛依", value: 72 },
          { name: "渭南", value: 72 },
          { name: "马鞍山", value: 72 },
          { name: "宝鸡", value: 72 },
          { name: "焦作", value: 75 },
          { name: "句容", value: 75 },
          { name: "北京", value: 79 },
          { name: "徐州", value: 79 },
          { name: "衡水", value: 80 },
          { name: "包头", value: 80 },
          { name: "绵阳", value: 80 },
          { name: "乌鲁木齐", value: 84 },
          { name: "枣庄", value: 84 },
          { name: "杭州", value: 84 },
          { name: "淄博", value: 85 },
          { name: "鞍山", value: 86 },
          { name: "溧阳", value: 86 },
          { name: "库尔勒", value: 86 },
          { name: "安阳", value: 90 },
          { name: "开封", value: 90 },
          { name: "济南", value: 92 },
          { name: "德阳", value: 93 },
          { name: "温州", value: 95 },
          { name: "九江", value: 96 },
          { name: "邯郸", value: 98 },
          { name: "临安", value: 99 },
          { name: "兰州", value: 99 },
          { name: "沧州", value: 100 },
          { name: "临沂", value: 103 },
          { name: "南充", value: 104 },
          { name: "天津", value: 105 },
          { name: "富阳", value: 106 },
          { name: "泰安", value: 112 },
          { name: "诸暨", value: 112 },
          { name: "郑州", value: 113 },
          { name: "哈尔滨", value: 114 },
          { name: "聊城", value: 116 },
          { name: "芜湖", value: 117 },
          { name: "唐山", value: 119 },
          { name: "平顶山", value: 119 },
          { name: "邢台", value: 119 },
          { name: "德州", value: 120 },
          { name: "济宁", value: 120 },
          { name: "荆州", value: 127 },
          { name: "宜昌", value: 130 },
          { name: "义乌", value: 132 },
          { name: "丽水", value: 133 },
          { name: "洛阳", value: 134 },
          { name: "秦皇岛", value: 136 },
          { name: "株洲", value: 143 },
          { name: "石家庄", value: 147 },
          { name: "莱芜", value: 148 },
          { name: "常德", value: 152 },
          { name: "保定", value: 153 },
          { name: "湘潭", value: 154 },
          { name: "金华", value: 157 },
          { name: "岳阳", value: 169 },
          { name: "长沙", value: 175 },
          { name: "衢州", value: 177 },
          { name: "廊坊", value: 193 },
          { name: "菏泽", value: 194 },
          { name: "合肥", value: 229 },
          { name: "武汉", value: 273 },
          { name: "大庆", value: 279 }
        ];

        var geoCoordMap = {
          海门: [121.15, 31.89],
          鄂尔多斯: [109.781327, 39.608266],
          招远: [120.38, 37.35],
          舟山: [122.207216, 29.985295],
          齐齐哈尔: [123.97, 47.33],
          盐城: [120.13, 33.38],
          赤峰: [118.87, 42.28],
          青岛: [120.33, 36.07],
          乳山: [121.52, 36.89],
          金昌: [102.188043, 38.520089],
          泉州: [118.58, 24.93],
          莱西: [120.53, 36.86],
          日照: [119.46, 35.42],
          胶南: [119.97, 35.88],
          南通: [121.05, 32.08],
          拉萨: [91.11, 29.97],
          云浮: [112.02, 22.93],
          梅州: [116.1, 24.55],
          文登: [122.05, 37.2],
          上海: [121.48, 31.22],
          攀枝花: [101.718637, 26.582347],
          威海: [122.1, 37.5],
          承德: [117.93, 40.97],
          厦门: [118.1, 24.46],
          汕尾: [115.375279, 22.786211],
          潮州: [116.63, 23.68],
          丹东: [124.37, 40.13],
          太仓: [121.1, 31.45],
          曲靖: [103.79, 25.51],
          烟台: [121.39, 37.52],
          福州: [119.3, 26.08],
          瓦房店: [121.979603, 39.627114],
          即墨: [120.45, 36.38],
          抚顺: [123.97, 41.97],
          玉溪: [102.52, 24.35],
          张家口: [114.87, 40.82],
          阳泉: [113.57, 37.85],
          莱州: [119.942327, 37.177017],
          湖州: [120.1, 30.86],
          汕头: [116.69, 23.39],
          昆山: [120.95, 31.39],
          宁波: [121.56, 29.86],
          湛江: [110.359377, 21.270708],
          揭阳: [116.35, 23.55],
          荣成: [122.41, 37.16],
          连云港: [119.16, 34.59],
          葫芦岛: [120.836932, 40.711052],
          常熟: [120.74, 31.64],
          东莞: [113.75, 23.04],
          河源: [114.68, 23.73],
          淮安: [119.15, 33.5],
          泰州: [119.9, 32.49],
          南宁: [108.33, 22.84],
          营口: [122.18, 40.65],
          惠州: [114.4, 23.09],
          江阴: [120.26, 31.91],
          蓬莱: [120.75, 37.8],
          韶关: [113.62, 24.84],
          嘉峪关: [98.289152, 39.77313],
          广州: [113.23, 23.16],
          延安: [109.47, 36.6],
          太原: [112.53, 37.87],
          清远: [113.01, 23.7],
          中山: [113.38, 22.52],
          昆明: [102.73, 25.04],
          寿光: [118.73, 36.86],
          盘锦: [122.070714, 41.119997],
          长治: [113.08, 36.18],
          深圳: [114.07, 22.62],
          珠海: [113.52, 22.3],
          宿迁: [118.3, 33.96],
          咸阳: [108.72, 34.36],
          铜川: [109.11, 35.09],
          平度: [119.97, 36.77],
          佛山: [113.11, 23.05],
          海口: [110.35, 20.02],
          江门: [113.06, 22.61],
          章丘: [117.53, 36.72],
          肇庆: [112.44, 23.05],
          大连: [121.62, 38.92],
          临汾: [111.5, 36.08],
          吴江: [120.63, 31.16],
          石嘴山: [106.39, 39.04],
          沈阳: [123.38, 41.8],
          苏州: [120.62, 31.32],
          茂名: [110.88, 21.68],
          嘉兴: [120.76, 30.77],
          长春: [125.35, 43.88],
          胶州: [120.03336, 36.264622],
          银川: [106.27, 38.47],
          张家港: [120.555821, 31.875428],
          三门峡: [111.19, 34.76],
          锦州: [121.15, 41.13],
          南昌: [115.89, 28.68],
          柳州: [109.4, 24.33],
          三亚: [109.511909, 18.252847],
          自贡: [104.778442, 29.33903],
          吉林: [126.57, 43.87],
          阳江: [111.95, 21.85],
          泸州: [105.39, 28.91],
          西宁: [101.74, 36.56],
          宜宾: [104.56, 29.77],
          呼和浩特: [111.65, 40.82],
          成都: [104.06, 30.67],
          大同: [113.3, 40.12],
          镇江: [119.44, 32.2],
          桂林: [110.28, 25.29],
          张家界: [110.479191, 29.117096],
          宜兴: [119.82, 31.36],
          北海: [109.12, 21.49],
          西安: [108.95, 34.27],
          金坛: [119.56, 31.74],
          东营: [118.49, 37.46],
          牡丹江: [129.58, 44.6],
          遵义: [106.9, 27.7],
          绍兴: [120.58, 30.01],
          扬州: [119.42, 32.39],
          常州: [119.95, 31.79],
          潍坊: [119.1, 36.62],
          重庆: [106.54, 29.59],
          台州: [121.420757, 28.656386],
          南京: [118.78, 32.04],
          滨州: [118.03, 37.36],
          贵阳: [106.71, 26.57],
          无锡: [120.29, 31.59],
          本溪: [123.73, 41.3],
          克拉玛依: [84.77, 45.59],
          渭南: [109.5, 34.52],
          马鞍山: [118.48, 31.56],
          宝鸡: [107.15, 34.38],
          焦作: [113.21, 35.24],
          句容: [119.16, 31.95],
          北京: [116.46, 39.92],
          徐州: [117.2, 34.26],
          衡水: [115.72, 37.72],
          包头: [110, 40.58],
          绵阳: [104.73, 31.48],
          乌鲁木齐: [87.68, 43.77],
          枣庄: [117.57, 34.86],
          杭州: [120.19, 30.26],
          淄博: [118.05, 36.78],
          鞍山: [122.85, 41.12],
          溧阳: [119.48, 31.43],
          库尔勒: [86.06, 41.68],
          安阳: [114.35, 36.1],
          开封: [114.35, 34.79],
          济南: [117, 36.65],
          德阳: [104.37, 31.13],
          温州: [120.65, 28.01],
          九江: [115.97, 29.71],
          邯郸: [114.47, 36.6],
          临安: [119.72, 30.23],
          兰州: [103.73, 36.03],
          沧州: [116.83, 38.33],
          临沂: [118.35, 35.05],
          南充: [106.110698, 30.837793],
          天津: [117.2, 39.13],
          富阳: [119.95, 30.07],
          泰安: [117.13, 36.18],
          诸暨: [120.23, 29.71],
          郑州: [113.65, 34.76],
          哈尔滨: [126.63, 45.75],
          聊城: [115.97, 36.45],
          芜湖: [118.38, 31.33],
          唐山: [118.02, 39.63],
          平顶山: [113.29, 33.75],
          邢台: [114.48, 37.05],
          德州: [116.29, 37.45],
          济宁: [116.59, 35.38],
          荆州: [112.239741, 30.335165],
          宜昌: [111.3, 30.7],
          义乌: [120.06, 29.32],
          丽水: [119.92, 28.45],
          洛阳: [112.44, 34.7],
          秦皇岛: [119.57, 39.95],
          株洲: [113.16, 27.83],
          石家庄: [114.48, 38.03],
          莱芜: [117.67, 36.19],
          常德: [111.69, 29.05],
          保定: [115.48, 38.85],
          湘潭: [112.91, 27.87],
          金华: [119.64, 29.12],
          岳阳: [113.09, 29.37],
          长沙: [113, 28.21],
          衢州: [118.88, 28.97],
          廊坊: [116.7, 39.53],
          菏泽: [115.480656, 35.23375],
          合肥: [117.27, 31.86],
          武汉: [114.31, 30.52],
          大庆: [125.03, 46.58],
          台北: [121.514449, 25.028879],
          高雄: [120.285385, 22.643712],
          嘉义: [120.457101, 23.474124]
        };
        var convertData = function (data) {
          var res = [];
          for (var i = 0; i < data.length; i++) {
            var geoCoord = geoCoordMap[data[i].name];
            if (geoCoord) {
              res.push({
                name: data[i].name,
                value: geoCoord.concat(data[i].value)
              });
            }
          }
          return res;
        };

        var option = {
          // amap component option
          amap: {
            // enable 3D mode
            viewMode: "3D",
            // initial options of AMap
            // See https://lbs.amap.com/api/javascript-api/reference/map#MapOption for details
            // initial map center [lng, lat]
            center: [108.39, 39.9],
            // initial map zoom
            zoom: 4,
            // whether the map and echarts automatically handles browser window resize to update itself.
            resizeEnable: true,
            // customized map style, see https://lbs.amap.com/dev/mapstyle/index for details
            mapStyle: "amap://styles/dark",
            // whether echarts layer should be rendered when the map is moving. Default is true.
            // if false, it will only be re-rendered after the map `moveend`.
            // It's better to set this option to false if data is large.
            renderOnMoving: true,
            // the zIndex of echarts layer for AMap, default value is 2000.
            // deprecated since v1.9.0, use `echartsLayerInteractive` instead.
            // echartsLayerZIndex: 2019,
            // whether echarts layer is interactive. Default value is true
            // supported since v1.9.0
            echartsLayerInteractive: true,
            // whether to enable large mode. Default value is false
            // supported since v1.9.0
            largeMode: false,
            // whether to return map camera state in `amaproam` event.
            // supported since v1.10.0
            returnMapCameraState: true
            // Note: Please DO NOT use the initial option `layers` to add Satellite/RoadNet/Other layers now.
            // There are some bugs about it, we can use `amap.add` instead.
            // Refer to the codes at the bottom.

            // More initial options...
          },
          tooltip: {
            trigger: "item"
          },
          animation: false,
          series: [
            {
              name: "PM2.5",
              type: "scatter",
              // use `amap` as the coordinate system
              coordinateSystem: "amap",
              // data items [[lng, lat, value], [lng, lat, value], ...]
              data: convertData(data),
              symbolSize: function (val) {
                return val[2] / 10;
              },
              encode: {
                value: 2
              },
              label: {
                formatter: "{b}",
                position: "right",
                show: false
              },
              itemStyle: {
                color: "#00c1de"
              },
              emphasis: {
                label: {
                  show: true
                }
              }
            },
            {
              name: "Top 5",
              type: "effectScatter",
              coordinateSystem: "amap",
              data: convertData(
                data
                  .sort(function (a, b) {
                    return b.value - a.value;
                  })
                  .slice(0, 6)
              ),
              symbolSize: function (val) {
                return val[2] / 10;
              },
              encode: {
                value: 2
              },
              showEffectOn: "render",
              rippleEffect: {
                brushType: "stroke"
              },
              hoverAnimation: true,
              label: {
                formatter: "{b}",
                position: "right",
                show: true
              },
              itemStyle: {
                color: "rgba(255, 165, 0, 0.8)",
                shadowBlur: 10,
                shadowColor: "#333"
              },
              zlevel: 1
            },
            {
              type: "pie",
              name: "User Stat",
              coordinateSystem: "amap",
              center: [129.58, 44.6],
              radius: 20,
              data: [
                {
                  name: "Offline",
                  value: 200
                },
                {
                  name: "Online",
                  value: 620
                },
                {
                  name: "Unknown",
                  value: 65
                }
              ],
              animation: true,
              label: {
                show: false
              },
              emphasis: {
                label: {
                  show: true
                },
                labelLine: {
                  show: true,
                  lineStyle: {
                    color: "#fff"
                  }
                }
              }
            }
          ]
        };
        myChart.setOption(option);
        var amapComponent = myChart.getModel().getComponent("amap");
        // get the instance of AMap
        var amap = amapComponent.getAMap();
        // add some controls provided by AMap.
        amap.addControl(new AMap.MapType({ position: 'RT' }));
        amap.addControl(new AMap.Scale({
          position: {
            left: "10px",
            bottom: "80px"
          }
        }));
        amap.addControl(new AMap.Scale({
          position: {
            left: "10px",
            bottom: "80px"
          }
        }));
        amap.addControl(new AMap.Scale({
          position: {
            left: "10px",
            bottom: "80px"
          }
        }));
        amap.addControl(new AMap.Scale({
          position: {
            left: "10px",
            bottom: "80px"
          }
        }));
        amap.addControl(new AMap.Scale({
          position: {
            left: "10px",
            bottom: "80px"
          }
        }));
        amap.addControl(new AMap.ToolBar({
          position: 'LT'  //定位到左上角
        }));
        // add SatelliteLayer and RoadNetLayer to map
        // var satelliteLayer = new AMap.TileLayer.Satellite();
        // var roadNetLayer = new AMap.TileLayer.RoadNet();
        // amap.add([satelliteLayer, roadNetLayer]);
        // Add a marker to map
        amap.add(
          new AMap.Marker({
            position: [110, 35]
          })
        );
        // Make the overlay layer of AMap interactive
        // amapComponent.setEChartsLayerInteractive(false);
        // 监听浏览器缩放，图表对象调用缩放resize函数
        window.addEventListener("resize", function () {
          myChart.resize();
        });
      });
    },
    getTimes() {
      setInterval(this.getTimesInterval, 1000);
    },
    // 获取时间函数
    getTimesInterval() {
      let year = new Date().getFullYear(); //获取当前时间的年份
      let month = new Date().getMonth() + 1; //获取当前时间的月份
      let day = new Date().getDate(); //获取当前时间的天数
      let hours = new Date().getHours(); //获取当前时间的小时
      let minutes = new Date().getMinutes(); //获取当前时间的分数
      let seconds = new Date().getSeconds(); //获取当前时间的秒数
      //当小于 10 的是时候，在前面加 0
      if (hours < 10) {
        hours = "0" + hours;
      }
      if (minutes < 10) {
        minutes = "0" + minutes;
      }
      if (seconds < 10) {
        seconds = "0" + seconds;
      }
      //拼接格式化当前时间
      this.times = "当前时间：" + year + "年" + month + "月" + day + "日" + "-" + hours + "时" + minutes + "分" + seconds + "秒";
    },
  }
};
</script>

<style scoped>@import '../css/VisualReports.css';</style>
