<template>
  <div class="LVbody">
    <!-- 头部显示栏 -->
    <header>
      <h1>可视化</h1>
      <div class="showTime">{{ times }}</div>
    </header>
    <!-- 主体部分 -->
    <section class="mainbox">
      <div class="column">
        <!-- no模块制作 -->
        <div class="no">
          <div class="no-hd">
            <ul>
              <li>{{ this.cm }}</li>
              <li>{{ this.svl }}</li>
              <li>
                <template>
                  <el-select v-show="false" @change="switchData" v-model="value" placeholder="请选择企业">
                    <el-option v-for="item in this.cname" :key="item.value" :label="item.label" :value="item.value"
                      :disabled="item.disabled">
                    </el-option>
                  </el-select>
                </template>
              </li>
            </ul>
          </div>
          <div class="no-bd">
            <ul>
              <li>摇号公司(位置)数量</li>
              <li>摇号次数</li>
              <li></li>
            </ul>
          </div>
        </div>
        <!-- 地图模块 -->
        <div class="map">
          <div class="map1"></div>
          <div class="map2"></div>
          <div class="map3"></div>
          <div id=id class="chart"></div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import "echarts-extension-amap";
import AMapLoader from "@amap/amap-jsapi-loader";
// import china from '../map/json/china.json'
import axios from 'axios'
import $ from 'jquery'
export default {
  data() {
    return {
      api: "http://sslapi.nadibao.cn/api/HzYaoHaoData/GetCompanyCross",
      value: '阿里',
      data: [], //原始数据
      coname: [], //企业名称,等同于阿里...
      cname: [], //企业名称下拉菜单对象
      sgeoCoordMap: {}, //起始发起地坐标
      sname: [], //起始地名称
      sum_arr: [], //多数据数组-数组
      egeoCoordMap: {}, //箭头指向地坐标
      geoCoordMap: {}, //所有地点坐标
      lo_la_tude: [], //经纬度
      svl: 0, //摇号次数
      cm: 0, //摇号公司数量
      count: 0,
      map: null, //初始化 map 对象
      times: '',//格式化之后的当前时间
      year: [],
      yeardata: [],
      loading: true,
    };
  },
  created() {
    // vm = this
  },
  mounted() {
    // echarts.registerMap("china", { geoJSON: china })
    // 获取时间
    var vn = this
    // this.getTimes()
    this.getData(this.value) //获取数据
    setTimeout(() => {
      this.initMap()
    }, 2000);
  },
  // 在Vue实例销毁前，清除定时器
  beforeDestroy() {
    if (this.times) {
      clearInterval(this.getTimesInterval);
    }
  },
  methods: {
    //切换数据
    switchData(v) {
      this.value = v
      // console.log(this.value);
      this.sgeoCoordMap = {} //起始发起地坐标
      this.sname = [] //起始地名称
      this.sum_arr = [] //多数据数组-数组
      this.egeoCoordMap = {} //箭头指向地坐标
      this.geoCoordMap = {} //所有地点坐标
      this.svl = 0 //摇号次数
      this.cm = 0 //摇号公司数量
      for (var i = 0; i < this.data.length; i++) {
        this.$set(this.coname, this.data[i].CR_ENTERPRISE)
        if (this.data[i].CR_ENTERPRISE === v) {
          this.$set(this.sgeoCoordMap, this.data[i].CR_COMPANY_LOCATION, [this.data[i].CR_COMPANY_LONGITUDE, this.data[i].CR_COMPANY_LATITUDE])
          this.$set(this.egeoCoordMap, this.data[i].CR_RECORD_NAME, [this.data[i].CR_ESTATE_LONGITUDE, this.data[i].CR_ESTATE_LATITUDE])
        }
      }
      for (var key in this.sgeoCoordMap) {
        // console.log(key.split('').reverse().join(''));
        this.sname.push(key)
        let arr = [];
        [...this.data].map(x => {
          if (x.CR_COMPANY_LOCATION === key) {
            // console.log(x.CR_RECORD_NAME)
            arr.push([{ 'name': key }, { 'name': x.CR_RECORD_NAME, 'value': x.num }])
          }
        })
        this.sum_arr.push([key, arr]);
        this.geoCoordMap[key] = this.sgeoCoordMap[key]
      }
      // console.log(this.sum_arr)
      for (var key in this.egeoCoordMap) {
        this.geoCoordMap[key] = this.egeoCoordMap[key]
      }
      // console.log(this.sum_arr)
      // console.log(this.sgeoCoordMap)
      this.$forceUpdate()
    },
    // 获取接口数据
    getData(name) {
      axios.get(this.api)
        .then(res => {
          // console.log(res);
          this.data = res.data.data
          for (var i = 0; i < res.data.data.length; i++) {
            this.$set(this.coname, res.data.data[i].CR_ENTERPRISE)
            if (res.data.data[i].CR_ENTERPRISE === name) {
              this.$set(this.sgeoCoordMap, res.data.data[i].CR_COMPANY_LOCATION, [res.data.data[i].CR_COMPANY_LONGITUDE, res.data.data[i].CR_COMPANY_LATITUDE])
              this.$set(this.egeoCoordMap, res.data.data[i].CR_RECORD_NAME, [res.data.data[i].CR_ESTATE_LONGITUDE, res.data.data[i].CR_ESTATE_LATITUDE])
            }
          }
          for (var co in this.coname) {
            this.cname.push({ 'value': co, 'lable': `${this.count++}` })
          }
          // console.log(this.cname)
          for (var key in this.sgeoCoordMap) {
            // console.log(key.split('').reverse().join(''));
            this.sname.push(key)
            let arr = [];
            [...res.data.data].map(x => {
              if (x.CR_COMPANY_LOCATION === key) {
                // console.log(x.CR_RECORD_NAME)
                arr.push([{ 'name': key }, { 'name': x.CR_RECORD_NAME, 'value': x.num }])
              }
            })
            this.sum_arr.push([key, arr]);
            this.geoCoordMap[key] = this.sgeoCoordMap[key]
          }
          // console.log(this.sum_arr)
          for (var key in this.egeoCoordMap) {
            this.geoCoordMap[key] = this.egeoCoordMap[key]
          }
          // console.log(res)
          // console.log(this.coname)
        })
    },
    // 初始化高德地图
    initMap() {
      window._AMapSecurityConfig = {
        securityJsCode: '8cf211a0fbbfd8bf936b57883039dbd5', // 高德地图的code
      }
      AMapLoader.load({
        key: "8cf211a0fbbfd8bf936b57883039dbd5", // 申请好的Web端开发者Key，首次调用 load 时必填
        version: "2.0", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
        plugins: ['AMap.Autocomplete', 'AMap.PlaceSearch', 'AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType', 'AMap.PolyEditor', 'AMap.CircleEditor', 'AMap.MarkerClusterer'], // 需要使用的的插件列表，如比例尺'AMap.Scale'等
      }).then((AMap) => {
        // console.log(AMap);
        var myChart = echarts.init(document.querySelector(".map .chart"));
        var geocoord = this.geoCoordMap
        var planePath = "path://M1705.06,1318.313v-89.254l-319.9-221.799l0.073-208.063c0.521-84.662-26.629-121.796-63.961-121.491c-37.332-0.305-64.482,36.829-63.961,121.491l0.073,208.063l-319.9,221.799v89.254l330.343-157.288l12.238,241.308l-134.449,92.931l0.531,42.034l175.125-42.917l175.125,42.917l0.531-42.034l-134.449-92.931l12.238-241.308L1705.06,1318.313z";
        //var planePath = 'arrow';
        var convertData = function (data) {
          var res = [];
          // console.log(geocoord)
          for (var i = 0; i < data.length; i++) {
            var dataItem = data[i];
            var fromCoord = geocoord[dataItem[0].name];
            var toCoord = geocoord[dataItem[1].name];
            if (fromCoord && toCoord) {
              res.push({
                fromName: dataItem[0].name,
                toName: dataItem[1].name,
                coords: [fromCoord, toCoord],
                value: dataItem[1].value
              });
            }
          }
          // console.log(dataItem);
          return res;
        };
        var color = ["#a6c84c", "#ffa022", "#4622e9", "#46b6e9", "#36bee9", "#46be66", "#400ee9", "#46b449", "#477ee9", "#422ee9"]; //航线的颜色
        var series = [];
        var value = [];
        var vm = this;
        this.sum_arr.forEach(function (item, i) {
          // console.log(item[1].map(x => x[1].value))
          item[1].map(x => vm.svl += x[1].value)
          item[1].map(x => vm.cm += 1)
          item[1].map(x => value.push(x[1].value))
          // console.log(vm.svl)
          series.push(
            // {
            //   name: item[0],
            //   coordinateSystem: 'amap',
            //   type: "lines",
            //   zlevel: 1,
            //   effect: {
            //     show: true,
            //     period: 6,
            //     trailLength: 0.7,
            //     color: "red", //arrow箭头的颜色
            //     symbolSize: 3
            //   },
            //   lineStyle: {
            //     color: color[i],
            //     width: 0,
            //     curveness: 0.2
            //   },
            //   data: convertData(item[1])
            // },
            {
              name: item[0],
              coordinateSystem: 'amap',
              type: "lines",
              zlevel: 2,
              symbol: ["none", "arrow"],
              symbolSize: 10,
              // effect: {
              //   show: true,
              //   period: 6,
              //   trailLength: 0,
              //   symbol: planePath,
              //   symbolSize: 15
              // },
              lineStyle: {
                color: color[i],
                width: 1,
                opacity: 0.6,
                curveness: 0.2
              },
              data: convertData(item[1])
            },
            // {
            //   name: item[0],
            //   coordinateSystem: 'amap',
            //   type: "effectScatter",
            //   // coordinateSystem: "geo",
            //   zlevel: 2,
            //   rippleEffect: {
            //     brushType: "stroke"
            //   },
            //   label: {
            //     show: true,
            //     position: "right",
            //     formatter: "{b}"
            //   },
            //   symbolSize: function (val) {
            //     return val[2] * 8;
            //   },
            //   itemStyle: {
            //     color: color[i],
            //   },
            //   emphasis: {
            //     areaColor: "#2B91B7"
            //   },
            //   data: item[1].map(function (dataItem) {
            //     return {
            //       name: dataItem[1].name,
            //       value: geoCoordMap[dataItem[1].name].concat([dataItem[1].value])
            //     };
            //   })
            // }
          );
        });
        // console.log(convertData(item[1]))
        var option = {
          amap: {// 高德地图配置
            // center: [104.114129, 37.550339], // 地图中心点120.023414, 30.275322
            center: [120.023414, 30.275322], // 地图中心点
            zoom: 11,// 地图缩放级别
            viewMode: '3D',// 地图模式
            resizeEnabled: true,// 是否监控地图容器尺寸变化
            mapStyle: 'amap://styles/blue',// 地图样式
            pitch: 15, //视角高度
            opacity: 0.1,
            title: 'dfsfssdfsd',
            skyColor: "#33216a", //天空颜色
          },
          title: {
            text: '摇号人次流向分布图',
            right: 'center',
            textStyle: {
              color: '#ccc',
              fontSize: 24
            }
          },
          tooltip: {
            trigger: "item",
            formatter: function (params, ticket, callback) {
              if (params.seriesType == "effectScatter") {
                return "线路：" + params.data.name + "" + params.data.value[2];
              } else if (params.seriesType == "lines") {
                return (
                  params.data.fromName +
                  "->" +
                  params.data.toName +
                  "<br />" +
                  params.data.value
                );
              } else {
                return params.name;
              }
            }
          },
          legend: {
            orient: "vertical",
            top: 10,
            left: "right",
            type: 'plain',
            // data: function (params, ticket, callback) { return params.data.value},
            data: this.sname,
            textStyle: {
              color: "#fff",
              fontSize: 14
            },
            selectedMode: "multiple"
          },
          visualMap: { //图例值控制
            type: 'piecewise',
            min: Math.min(...value),
            max: Math.max(...value),
            calculable: true,
            bottom: 80,
            show: true,
            color: ['#f44336', '#fc9700', '#ffde00', '#ffde00', '#00eaff'],
            textStyle: {
              color: '#fff'
            }
          },
          series: series
        };
        myChart.setOption(option, true);
        myChart.getModel().getComponent('amap').getAMap();//获取高德地图实例
        // 监听浏览器缩放，图表对象调用缩放resize函数
        window.addEventListener("resize", function () {
          myChart.resize();
        });
      });
    },
    init() {
      // document.getElementById("id").removeAttribute("_echarts_instance_");
      var myChart = echarts.init(document.querySelector(".map .chart"));
      var geocoord = this.geoCoordMap
      var planePath = "path://M1705.06,1318.313v-89.254l-319.9-221.799l0.073-208.063c0.521-84.662-26.629-121.796-63.961-121.491c-37.332-0.305-64.482,36.829-63.961,121.491l0.073,208.063l-319.9,221.799v89.254l330.343-157.288l12.238,241.308l-134.449,92.931l0.531,42.034l175.125-42.917l175.125,42.917l0.531-42.034l-134.449-92.931l12.238-241.308L1705.06,1318.313z";
      //var planePath = 'arrow';
      var convertData = function (data) {
        var res = [];
        // console.log(geocoord)
        for (var i = 0; i < data.length; i++) {
          var dataItem = data[i];
          var fromCoord = geocoord[dataItem[0].name];
          var toCoord = geocoord[dataItem[1].name];
          if (fromCoord && toCoord) {
            res.push({
              fromName: dataItem[0].name,
              toName: dataItem[1].name,
              coords: [fromCoord, toCoord],
              value: dataItem[1].value
            });
          }
        }
        // console.log(dataItem);
        return res;
      };
      var color = ["#a6c84c", "#ffa022", "#4622e9", "#46b6e9", "#36bee9", "#46be66", "#400ee9", "#46b449", "#477ee9", "#422ee9"]; //航线的颜色
      var series = [];
      var value = [];
      var vm = this;
      this.sum_arr.forEach(function (item, i) {
        // console.log(item[1].map(x => x[1].value))
        item[1].map(x => vm.svl += x[1].value)
        item[1].map(x => vm.cm += 1)
        item[1].map(x => value.push(x[1].value))
        // console.log(vm.svl)
        series.push(
          // {
          //   name: item[0],
          //   coordinateSystem: 'amap',
          //   type: "lines",
          //   zlevel: 1,
          //   effect: {
          //     show: true,
          //     period: 6,
          //     trailLength: 0.7,
          //     color: "red", //arrow箭头的颜色
          //     symbolSize: 3
          //   },
          //   lineStyle: {
          //     color: color[i],
          //     width: 0,
          //     curveness: 0.2
          //   },
          //   data: convertData(item[1])
          // },
          {
            name: item[0],
            coordinateSystem: 'amap',
            type: "lines",
            zlevel: 2,
            symbol: ["none", "arrow"],
            symbolSize: 10,
            // effect: {
            //   show: true,
            //   period: 6,
            //   trailLength: 0,
            //   symbol: planePath,
            //   symbolSize: 15
            // },
            lineStyle: {
              color: color[i],
              width: 1,
              opacity: 0.6,
              curveness: 0.2
            },
            data: convertData(item[1])
          },
          // {
          //   name: item[0],
          //   coordinateSystem: 'amap',
          //   type: "effectScatter",
          //   // coordinateSystem: "geo",
          //   zlevel: 2,
          //   rippleEffect: {
          //     brushType: "stroke"
          //   },
          //   label: {
          //     show: true,
          //     position: "right",
          //     formatter: "{b}"
          //   },
          //   symbolSize: function (val) {
          //     return val[2] * 8;
          //   },
          //   itemStyle: {
          //     color: color[i],
          //   },
          //   emphasis: {
          //     areaColor: "#2B91B7"
          //   },
          //   data: item[1].map(function (dataItem) {
          //     return {
          //       name: dataItem[1].name,
          //       value: geoCoordMap[dataItem[1].name].concat([dataItem[1].value])
          //     };
          //   })
          // }
        );
        // console.log(convertData(item[1]))
      });

      var option = {
        amap: {// 高德地图配置
          // center: [104.114129, 37.550339], // 地图中心点120.023414, 30.275322
          center: [120.023414, 30.275322], // 地图中心点
          zoom: 11,// 地图缩放级别
          viewMode: '3D',// 地图模式
          resizeEnabled: true,// 是否监控地图容器尺寸变化
          mapStyle: 'amap://styles/blue',// 地图样式
          pitch: 15, //视角高度
          opacity: 0.1,
          title: 'dfsfssdfsd',
          skyColor: "#33216a", //天空颜色
        },
        title: {
          text: '摇号人次流向分布图',
          right: 'center',
          textStyle: {
            color: '#ccc',
            fontSize: 24
          }
        },
        tooltip: {
          trigger: "item",
          formatter: function (params, ticket, callback) {
            if (params.seriesType == "effectScatter") {
              return "线路：" + params.data.name + "" + params.data.value[2];
            } else if (params.seriesType == "lines") {
              return (
                params.data.fromName +
                "->" +
                params.data.toName +
                "<br />" +
                params.data.value
              );
            } else {
              return params.name;
            }
          }
        },
        legend: {
          orient: "vertical",
          top: 10,
          left: "right",
          type: 'plain',
          // data: function (params, ticket, callback) { return params.data.value},
          data: this.sname,
          textStyle: {
            color: "#fff",
            fontSize: 14
          },
          selectedMode: "multiple"
        },
        visualMap: { //图例值控制
          type: 'piecewise',
          min: Math.min(...value),
          max: Math.max(...value),
          calculable: true,
          bottom: 80,
          show: true,
          color: ['#f44336', '#fc9700', '#ffde00', '#ffde00', '#00eaff'],
          textStyle: {
            color: '#fff'
          }
        },
        series: series
      };
      myChart.setOption(option, true);
      myChart.getModel().getComponent('amap').getAMap();//获取高德地图实例
      // 监听浏览器缩放，图表对象调用缩放resize函数
      window.addEventListener("resize", function () {
        myChart.resize();
      });
    },
    // 设置定时器
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
  },

  watch: {
    // value: {
    //   handler(newVal, oldVal) {
    //     // console.log(newVal, oldVal)
    //     setTimeout(() => {
    //       this.init()
    //     }, 0);
    //   },
    // deep: true,
    // immediate: true,
    // },
    value: 'init'
  }
};
</script>

<style scoped>
@import '../../css/VisualReports.css';
</style>
