<template>
  <div class="LVbody">
    <div id="canvas"></div>
    <!-- 头部显示栏 -->
    <header>
      <el-popover v-show="isActive" placement="bottom">
        <el-form :inline="false" label-width="90px">
          <el-form-item label="背景颜色：">
            <div class="line_set_el">
              <el-input v-model="backgroundColor" :disabled="slider_set_use">
              </el-input>
              <el-color-picker @change="getBackcolor(backgroundColor)" v-model="backgroundColor"
                :disabled="slider_set_use">
              </el-color-picker>
            </div>
          </el-form-item>
          <el-form-item label="标题颜色：">
            <div class="line_set_el">
              <el-input v-model="color" :disabled="slider_set_use">
              </el-input>
              <el-color-picker @change="setBackcolor(color)" v-model="color" :disabled="slider_set_use">
              </el-color-picker>
            </div>
          </el-form-item>
          <el-form-item label="标题大小：">
            <div class="line_set_el">
              <el-slider v-model="fontSize" show-input :show-tooltip="true" :disabled="slider_set_use"
                :show-input-controls="false" @change="setfontSize(fontSize)">
              </el-slider>
            </div>
          </el-form-item>
        </el-form>
        <el-button id="btn1" type="primary" plain slot="reference" icon="el-icon-setting"
          style="margin:2px">基础配置</el-button>
      </el-popover>
      <h1 id="view">可视化</h1>
      <el-button id="btn" @click="toggleActive()" type="primary" round>工具箱</el-button>
      <div class="showTime">{{ times }}</div>
    </header>
    <!-- 主体部分 -->
    <section class="mainbox">
      <!-- 左 -->
      <div class="column">
        <div class="panel bar">
          <!-- <el-button :icon="isFull?'el-icon-crop':'el-icon-full-screen'" class="icon-screen" @click="fullScreenEvent()" circle></el-button> -->
          <bar1 class="fchart" :all_show="isFull" position="relative"></bar1>
        </div>
        <div class="panel line">
          <h2>2018-2023年摇号情况
            <!-- <a href="javacript:;">2020</a>
            <a href="javascript:;">2021</a> -->
          </h2>
          <div class="chart">图表</div>
          <div class="panel-footer"></div>
        </div>
        <div class="panel pie">
          <h2>2018-2023年摇号情况</h2>
          <div class="chart">图表</div>
          <div class="panel-footer"></div>
        </div>
        <div class="panel Radar">
          <h2>2018-2023年摇号情况</h2>
          <div class="chart">图表</div>
          <div class="panel-footer"></div>
        </div>
        <div class="panel Bar">
          <h2>2018-2023年摇号情况</h2>
          <div class="chart">图表</div>
          <div class="panel-footer"></div>
        </div>
      </div>
      <!-- 中 -->
      <div class="column">
        <div element-loading-background="rgba(0, 0, 0, 0)" class="panel line3">
          <h2>2018-2023年累计净增购房人有无房情况</h2>
          <div class="chart"></div>
          <div class="panel-footer"></div>
        </div>
        <div class="panel bar3">
          <h2>2018-2023年累计净增购房人有无房情况
            <a href="javacript:;"></a>
            <a href="javascript:;"></a>
          </h2>
          <div class="chart">图表</div>
          <div class="panel-footer"></div>
        </div>
        <div class="panel bar3d">
          <h2>2018-2023年累计净增购房人有无房情况</h2>
          <div class="chart">图表</div>
          <div class="panel-footer"></div>
        </div>
        <div class="panel pie3">
          <h2>2018-2023年累计净增购房人有无房情况</h2>
          <div class="chart">图表</div>
          <div class="panel-footer"></div>
        </div>
        <div class="panel scatter3">
          <h2>2018-2023年累计净增购房人有无房情况</h2>
          <div class="chart">图表</div>
          <div class="panel-footer"></div>
        </div>
      </div>
      <!-- 右 -->
      <div class="column">
        <div class="panel line2">
          <h2>2018-2023年杭州市落户人才摇号情况</h2>
          <div class="chart">图表</div>
          <div class="panel-footer"></div>
        </div>
        <div class="panel radar2">
          <h2>2018-2023年杭州市落户人才摇号情况</h2>
          <div class="chart">图表</div>
          <div class="panel-footer"></div>
        </div>
        <div class="panel bar2">
          <h2>2018-2023年杭州市落户人才摇号情况</h2>
          <div class="chart">图表</div>
          <div class="panel-footer"></div>
        </div>
        <div class="panel linebar2">
          <h2>2018-2023年杭州市落户人才摇号情况</h2>
          <div class="chart">图表</div>
          <div class="panel-footer"></div>
        </div>
        <div class="panel stack2">
          <h2>2018-2023年杭州人才摇号增速</h2>
          <div class="chart">图表</div>
          <div class="panel-footer"></div>
        </div>
      </div>
      <div id="fullScreenMask">
        <div class="fullScreen"></div>
      </div>
    </section>

  </div>
</template>

<script>
import * as echarts from 'echarts'
import bar1 from './子图表/bar1.vue'
import 'echarts-gl'
import 'echarts-liquidfill/src/liquidFill.js'; //在这里引入
import "echarts-wordcloud";
// import china from '../map/json/china.json'

// import "echarts-ext/* ension-amap";
import AMapLoader from "@amap/amap-jsapi-loader";
import axios from 'axios'
var vm = null
var chartScreen = null
function setFullScreenToolBox(option, title) {
  if ($('#fullScreenMask').css('display') === 'block') {
    $('#fullScreenMask').hide();
    $('.column').show();
    $('#view').show();
    $('#btn').hide();
    $('#btn1').hide();
    chartScreen.dispose();
    vm.num = 0;
    return false;
  }
  $('#fullScreenMask').show();
  $('#view').hide();
  $('#btn').show();
  $('#btn').click(function () { $('#btn1').show() });
  chartScreen = echarts.init(document.querySelector('.fullScreen'));
  chartScreen.setOption(option);
  $('.column').hide();
  chartScreen.setOption({
    title: {
      text: title,
      // subtext: '',
      left: 'center',
      textStyle: {
        color: '#000f'
      }
    },
    toolbox: {
      feature: {
        mark: {
          show: true
        },
        dataView: {
          show: true,
          readOnly: false
        },
        magicType: {
          show: true,
          type: ['line', 'bar', 'stack']
        },
        saveAsImage: {
          show: true
        },
        myTool: {
          title: '退出全屏',
          icon: 'M749.248 704H864a32 32 0 1 0 0-64H672a32 32 0 0 0-32 32v192a32 32 0 1 0 64 0v-114.752l137.36 137.36a32 32 0 1 0 45.232-45.264L749.248 704zM320 749.248V864a32 32 0 1 0 64 0V672a32 32 0 0 0-32-32H160a32 32 0 1 0 0 64h114.752l-137.36 137.36a32 32 0 1 0 45.264 45.232L320 749.248zM749.248 320H864a32 32 0 1 1 0 64H672a32 32 0 0 1-32-32V160a32 32 0 1 1 64 0v114.752l137.36-137.36a32 32 0 1 1 45.232 45.264L749.248 320zM320 274.752V160a32 32 0 1 1 64 0v192a32 32 0 0 1-32 32H160a32 32 0 1 1 0-64h114.752l-137.36-137.36a32 32 0 1 1 45.264-45.232L320 274.752z',
        }
      }
    }
  });
  return true;
}
export default {
  components: {
    bar1,
  },
  data() {
    return {
      isFull: false,
      
      x: [],
      renci: [],
      renshu: [],
      rate: [],
      nd: [],
      lj: [],
      cz: [],
      cj: [],
      sy: [],
      ls: [],
      data: [],
      dataMax: 100,
      coname: [],
      sgeoCoordMap: {},
      arr: [],
      egeoCoordMap: {},
      backgroundColor: "",
      fontSize: 20,
      color: '',
      bgc: ['#929fff', '#9de0ff', '#ffa897', '#af87fe', '#7dc3fe', '#bb60b2', '#433e7c', '#f47a75', '#009db2', '#024b51', '#0780cf', '#765005',],
      slider_set_use: false,
      times: '',//格式化之后的当前时间
      loading: true,
      isActive: false,
      num: 0,
      // data2
      x1: [],
      le: ['人才', '无房', '有房',],
      rencai: [],
      wufang: [],
      youfang: [],
      Prencai: [],
      Pwufang: [],
      Pyoufang: [],
      ps: [],
      //data3
      name: [],
      le3: ['中专', '大专', '本科', '硕士', '博士', '初技', '中技', '高技', '其他', '未知'],
      zz: [],
      dz: [],
      bk: [],
      ss: [],
      bs: [],
      cj1: [],
      zj: [],
      gj: [],
      qt: [],
      non: [],
      sums: [],
      zzl: ['',],
      sum3: [],
      sum3t: []
    };
  },
  created() {
    vm = this
    this.getData1("http://sslapi.nadibao.cn/api/HzYaoHaoData/GetCompanyCross", '阿里') //获取数据
    this.getData3() //获取摇号数据
    this.getData() //获取摇号数据
    this.getData2() //获取摇号数据

  },
  // beforeMount(){this.getData()},
  mounted() {
    this.isFullScreen()
    this.initWatermark()
    // 获取时间
    this.getTimes()
    setTimeout(() => {
      this.dev0();
      this.dev1();
      this.dev2();
      this.dev3();
      this.dev4();
      this.dev5();
      this.dev6();
      this.dev7();
      this.dev8();
      this.dev9();
      this.dev10();
      this.dev11();
      this.dev12();
      this.dev13();
      this.dev14();
    }, 2000);
  },
  // 在Vue实例销毁前，清除定时器
  beforeDestroy() {
    if (this.times) {
      clearInterval(this.getTimesInterval);
    }
  },
  methods: {
    fullScreenEvent() {
      let el = document.querySelector('.fchart');
      if (this.isFull) {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
      } else {
        if (el.requestFullscreen) {
          el.requestFullscreen();
        } else if (el.mozRequestFullScreen) {
          el.mozRequestFullScreen();
        } else if (el.webkitRequestFullScreen) {
          el.webkitRequestFullScreen();
        } else if (el.msRequestFullscreen) {
          el.msRequestFullscreen();
        }
      }
    },
    isFullScreen(){
      let isFullscreen =
      document.fullscreenElement ||
      document.mozFullScreenElement ||
      document.webkitFullscreenElement ||
      document.fullScreen ||
      document.mozFullScreen ||
      document.webkitIsFullScreen;
    isFullscreen = !!isFullscreen;
    let that = this;
    document.addEventListener("fullscreenchange", () => {
      that.isFull = !that.isFull;
    });
    document.addEventListener("mozfullscreenchange", () => {
      that.isFull = !that.isFull;
    });
    document.addEventListener("webkitfullscreenchange", () => {
      that.isFull = !that.isFull;
    });
    document.addEventListener("msfullscreenchange", () => {
      that.isFull = !that.isFull;
    });
    },
    getBackcolor(backgroundColor) {
      chartScreen = echarts.init(document.querySelector('.fullScreen'));
      chartScreen.setOption({
        backgroundColor: backgroundColor
      })
    },
    setfontSize(fontSize) {
      chartScreen = echarts.init(document.querySelector('.fullScreen'));
      chartScreen.setOption({
        title: {
          textStyle: {
            fontSize: fontSize,
          }
        },
      })
    },
    setBackcolor(Color) {
      chartScreen = echarts.init(document.querySelector('.fullScreen'));
      chartScreen.setOption({
        title: {
          textStyle: {
            color: Color
          }
        },
      })
    },
    toggleActive: function () {
      this.num++;
      if (this.num == 1) { this.isActive = true } else { this.isActive = !this.isActive; }
    },
    // 获取飞行接口数据
    getData1(x, name) {
      axios.get(x, name)
        .then(res => {
          // console.log(res);
          for (var i = 0; i < res.data.data.length; i++) {
            this.$set(this.coname, res.data.data[i].CR_ENTERPRISE)
            if (res.data.data[i].CR_ENTERPRISE === name) {
              this.$set(this.sgeoCoordMap, res.data.data[i].CR_COMPANY_LOCATION, [res.data.data[i].CR_COMPANY_LONGITUDE, res.data.data[i].CR_COMPANY_LATITUDE])
              this.$set(this.egeoCoordMap, res.data.data[i].CR_RECORD_NAME, [res.data.data[i].CR_ESTATE_LONGITUDE, res.data.data[i].CR_ESTATE_LATITUDE])
            }
          };
          [...res.data.data].map(x => {
            if (x.CR_COMPANY_LOCATION === '阿里巴巴滨江新园区') {
              // console.log(x.CR_RECORD_NAME)
              this.arr.push({ 'name': x.CR_RECORD_NAME, 'value': x.num })
            }
          })
          // console.log(res)
          // console.log(this.coname)
        })
    },
    //添加水印
    initWatermark() {
      // 创建一个canvas
      const canvas = document.createElement('canvas');
      // 设置画布的宽高
      canvas.width = 300;
      canvas.height = 300;
      // 获取画笔
      const ctx = canvas.getContext('2d');
      // 水印，水印实际上就是将文字添加到画布上
      ctx.font = '50px Arial'; // 设置字体大小和字体
      ctx.rotate(-0.4);// 设置文字旋转角度

      // 创建实体水印
      ctx.fillStyle = 'rgba(0,0,0,.1)'; // 颜色
      ctx.fillText('数视灵', canvas.width / 6, canvas.height / 2);// 设置显示文字和偏移量

      //创建虚心水印
      // ctx.strokeStyle = 'rgba(0,0,0,.3)';
      // ctx.strokeText('数视灵', canvas.width / 6, canvas.height / 2);

      // 渐变水印
      // const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
      // gradient.addColorStop(0, 'red');
      // gradient.addColorStop(0.5, 'yellow');
      // gradient.addColorStop(1, 'green');
      // ctx.fillStyle = gradient; // 颜色
      // ctx.fillText('数视灵', canvas.width / 6, canvas.height / 2);// 设置显示文字和偏移量

      // 将画布转成图片
      const img = canvas.toDataURL();
      const main = document.querySelector('.mainbox');
      main.style.backgroundImage = `url(${img})`;
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
    getData() {
      axios.get("http://sslapi.nadibao.cn/api/HzYaoHaoData/Get_MID_YEAR_ADD_NUM_ONEYEAR_AND_ALLYEAAR")
        .then(res => {
          for (var i = 0; i < res.data.data.length; i++) {
            this.x[i] = res.data.data[i].NAME
            this.renci[i] = parseFloat((res.data.data[i].NUM_RENCI / 10000).toFixed(2))
            this.renshu[i] = parseFloat((res.data.data[i].NUM_RENSHU / 10000).toFixed(2))
            this.rate[i] = parseFloat((res.data.data[i].RENCI_DIVISION_RENSHU).toFixed(2))
            this.nd[i] = parseFloat((res.data.data[i].NUM_ONEYEAR / 10000).toFixed(2))
            this.cz[i] = parseFloat((res.data.data[i].NUM_ALLYEAR / 10000).toFixed(2))
            this.lj[i] = parseFloat((res.data.data[i].NUM_ONE_CUT_ALL / 10000).toFixed(2))
            this.cj[i] = parseFloat((res.data.data[i].NUM_HOUSE_DEAL / 10000).toFixed(2))
            this.sy[i] = parseFloat((res.data.data[i].NUM_REST_RENSHU / 10000).toFixed(2))
            this.ls[i] = parseFloat((res.data.data[i].NUM_LOST_RENSHU / 10000).toFixed(2))
            this.data.push({ value: parseFloat((res.data.data[i].NUM_RENCI / 10000).toFixed(2)), name: res.data.data[i].NAME })
          }
          // console.log(this.res)
        }).then(() => this.dev0)
    },
    getData2() {
      axios.get("http://sslapi.nadibao.cn/api/HzYaoHaoData/Get_MID_YEAR_PEOPLE_TYPE_ADD_NUM")
        .then(res => {
          for (var i = 0; i < res.data.data.length; i++) {
            this.x1[i] = res.data.data[i].MYPTAN_YEAR_NAME
            this.rencai[i] = res.data.data[i].MYPTAN_NUM1 + res.data.data[i].MYPTAN_NUM4
            this.wufang[i] = res.data.data[i].MYPTAN_NUM2 + res.data.data[i].MYPTAN_NUM5
            this.youfang[i] = res.data.data[i].MYPTAN_NUM3 + res.data.data[i].MYPTAN_NUM6
          }
          var S = [this.rencai, this.wufang, this.youfang]
          var s1 = 0
          var s2 = 0
          var s3 = 0
          var s4 = 0
          var s5 = 0
          var s6 = 0
          var SM = [];

          [...S].map((x, index) => {
            SM = [s1 += x[0], s2 += x[1], s3 += x[2], s4 += x[3], s5 += x[4], s6 += x[5]]
          })
          for (var i = 0; i < SM.length; i++) {
            this.Prencai.push(parseFloat((this.rencai[i] * 100 / SM[i]).toFixed(2)))
            this.Pwufang.push(parseFloat((this.wufang[i] * 100 / SM[i]).toFixed(2)))
            this.Pyoufang.push(parseFloat((this.youfang[i] * 100 / SM[i]).toFixed(2)))
          }
          this.ps = [this.Prencai, this.Pwufang, this.Pyoufang];
        }).then(() => this.dev14())
    },
    getData3() {
      axios.get("http://sslapi.nadibao.cn/api/HzYaoHaoData/Get_MID_TALENT_BUYER_TYPE_NUM_ALLYEAR")
        .then(res => {
          var data = res.data.data
          for (var i = 0; i < data.length; i++) {
            this.name[i] = data[i].YEAR_NAME
            this.zz[i] = data[i].TYPE_ZHONGZHUAN_NUM
            this.dz[i] = data[i].TYPE_DAZHUAN_NUM
            this.bk[i] = data[i].TYPE_BENKE_NUM
            this.ss[i] = data[i].TYPE_SHUOSHI_NUM
            this.bs[i] = data[i].TYPE_BOSHI_NUM
            this.cj1[i] = data[i].TYPE_CHUJI_NUM
            this.zj[i] = data[i].TYPE_ZHONGJI_NUM
            this.gj[i] = data[i].TYPE_GAOJI_NUM
            this.qt[i] = data[i].TYPE_ELSE_NUM
            this.non[i] = data[i].TYPE_NONE_NUM
            this.sums[i] = this.zz[i] + this.dz[i] + this.bk[i] + this.ss[i] + this.bs[i] + this.cj1[i] + this.zj[i] + this.gj[i] + this.qt[i] + this.non[i]
            this.sum3t.push([this.zz[i], this.dz[i], this.bk[i], this.ss[i], this.bs[i], this.cj1[i], this.zj[i], this.gj[i], this.qt[i], this.non[i]])
          }
          this.sum3.push(this.zz, this.dz, this.bk, this.ss, this.bs, this.cj1, this.zj, this.gj, this.qt, this.non);
          [...this.sums].map((x, i) => {
            if (i < this.sums.length - 1) {
              this.zzl.push(((this.sums[i + 1] - this.sums[i]) * 100 / this.sums[i]).toFixed(2))
            }
          })
          // console.log(this.sum3t)
        })
    },
    // 左1柱状
    dev0() {
      // var myChart = echarts.init(document.querySelector(".bar .chart"));
      // 2. 指定配置项和数据
      var option = {
        backgroundColor: '#fff', //背景色
        tooltip: {
          trigger: "axis",
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          },
          // borderRadius: 5,
          // borderColor: "#6baab2",
          // borderWidth: 1,
          formatter: function (params) { // params[0].data.nameCode
            let dot = '<span style="display:inline-block;margin-right:5px;border-radius:50%;width:10px;height:10px;background-color:#02C4DD"></span>';
            return (
              params[0].name +
              "<br>" +
              "摇号人次 ：" +
              params[0].value +
              '(万人次)'
            );
          }
        },
        toolbox: {
          show: true,
          right: '3%',
          feature: {
            myTool: {
              show: true,
              title: '全屏显示',
              //icon从阿里图标复制对应的svg格式代码
              icon: "path://M368.896 192H224a32 32 0 0 0-32 32v137.888a32 32 0 0 0 64 0V256h112.896a32 32 0 0 0 0-64zM784.864 192H640a32 32 0 1 0 0 64h112.864v105.888a32 32 0 1 0 64 0V224a32 32 0 0 0-32-32zM368.896 777.92H256V672a32 32 0 1 0-64 0v137.92a32 32 0 0 0 32 32h144.896a32 32 0 1 0 0-64zM784.864 640a32 32 0 0 0-32 32v105.92H640a32 32 0 1 0 0 64h144.864a32 32 0 0 0 32-32V672a32 32 0 0 0-32-32z",
              onclick: function () {
                //生成全屏显示的图表
                if (setFullScreenToolBox(option, '2018-2023年摇号情况')) {
                  chartScreen
                } else { return false }
              }
            },
          }
        },
        grid: {
          top: "20%",
          left: "10%",
          bottom: "10%",
          containLabel: true
        },
        xAxis: {
          data: this.x,
          triggerEvent: true,
          axisTick: {
            show: false
          },
          axisLine: {
            show: false
          },
          axisLabel: {
            show: true,
            rotate: 0,
            interval: 0,
            padding: [12, 0, 0, 0],
            fontSize: 12,
            color: "rgba(0,0,0,1)"
          },
        },
        yAxis: {
          name: "单位：万人次",
          triggerEvent: true,
          nameTextStyle: {
            color: "rgba(0,0,0,1)",
            fontSize: 12,
            padding: [0, 0, 10, -20]
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: 'rgba(0,0,0,.1)'
            }
          },
          axisTick: {
            show: false
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: 'rgba(0,0,0,.1)'
            }
          },
          axisLabel: {
            show: true,
            color: "rgba(0,0,0,1)",
            fontSize: 12
          },
        },
        // color: ["#e54035"],
        series: [{
          type: 'pictorialBar',
          symbol: 'path://M35,0L35,70L0,70z M35,0L35,70L70,70z',
          data: this.renci,
          barWidth: '50%',
          symbolOffset: [0, -15],
          z: 1,
          label: {
            show: true,
            color: "rgba(0,0,0,1)",
            position: 'top',
          },
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
              offset: 0,
              color: '#f7f3c6'
            }, {
              offset: 0.5,
              color: '#f7f3c6'
            }, {
              offset: 0.5,
              color: '#c0c192'
            }, {
              offset: 1,
              color: '#c0c192'
            }]),
            opacity: 1,
            shadowColor: '#669c75',
            shadowBlur: 0,
            shadowOffsetX: 1,
            shadowOffsetY: 0,
          }
        },
        {
          name: '人次',
          type: 'pictorialBar',
          symbol: 'diamond',
          barWidth: '50%',
          symbolSize: ['100%', 30],
          z: 2,
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
              offset: 0,
              color: '#e2deaa'
            }, {
              offset: 0.5,
              color: '#e2deaa'
            }, {
              offset: 0.5,
              color: '#b2b380'
            }, {
              offset: 1,
              color: '#b2b380'
            }]),
            opacity: 1,
            shadowColor: '#669c75',
            shadowBlur: 0,
            shadowOffsetX: 0,
            shadowOffsetY: 5,
          },
          data: this.renci,
        },
        {
          name: "hill",
          type: "bar",
          barWidth: '20%',
          symbol: "path://M0,10 L10,10 C5.5,10 5.5,5 5,0 C4.5,5 4.5,10 0,10 z",
          itemStyle: {
            color: "rgba(11,47,68,.2)"
          },
          data: [...this.renci].map(x => 100),
          z: 0
        }
        ]
      }
      this.loading = true
      // 3. 把配置项给实例对象
      myChart.setOption(option, true);
      this.loading = false

      // 4. 让图表跟随屏幕自动的去适应
      window.addEventListener("resize", function () {
        myChart.resize();
      });
      // })
    },
    // 左2折线
    dev1() {
      // 1. 实例化对象
      var myChart = echarts.init(document.querySelector(".line .chart"));
      var piePane = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAKElEQVQ4jWP8//8/AwXgPxMluhkYGBhGDRg1YNQAKhnAwsDAQFF+BgBtSwUd6uvSywAAAABJRU5ErkJggg=='
      var piePatternImg = new Image();
      piePatternImg.src = piePane;
      // 图标
      var cpu = 'image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFgAAABYCAYAAABxlTA0AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQyIDc5LjE2MDkyNCwgMjAxNy8wNy8xMy0wMTowNjozOSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo0NzgyQTBDQTI3MjcxMUU4ODA3MEFBRjc3RkNBNDJBOSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo0NzgyQTBDQjI3MjcxMUU4ODA3MEFBRjc3RkNBNDJBOSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjQ3ODJBMEM4MjcyNzExRTg4MDcwQUFGNzdGQ0E0MkE5IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjQ3ODJBMEM5MjcyNzExRTg4MDcwQUFGNzdGQ0E0MkE5Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+n1oX5AAACiRJREFUeNrsXUuIHUUU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'
      var memory = 'image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFgAAABYCAYAAABxlTA0AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQyIDc5LjE2MDkyNCwgMjAxNy8wNy8xMy0wMTowNjozOSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo0NkZDRThCRDI3MjcxMUU4OTI4QUM3NDRGMEMxNjdDMSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo0NkZDRThCRTI3MjcxMUU4OTI4QUM3NDRGMEMxNjdDMSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjQ2RkNFOEJCMjcyNzExRTg5MjhBQzc0NEYwQzE2N0MxIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjQ2RkNFOEJDMjcyNzExRTg5MjhBQzc0NEYwQzE2N0MxIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+2qH1MwAACnBJREFUeNrsXWuoVUUU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'
      var disk = 'image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFgAAABYCAYAAABxlTA0AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQyIDc5LjE2MDkyNCwgMjAxNy8wNy8xMy0wMTowNjozOSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo0NjczMjI5MjI3MjcxMUU4OTIzNUNGREYwREM2MEQ2RCIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo0NjczMjI5MzI3MjcxMUU4OTIzNUNGREYwREM2MEQ2RCI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjQ2NzMyMjkwMjcyNzExRTg5MjM1Q0ZERjBEQzYwRDZEIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjQ2NzMyMjkxMjcyNzExRTg5MjM1Q0ZERjBEQzYwRDZEIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+e59NdAAACT1JREFUeNrsXTuPHEUQ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'


      // 2.指定配置
      var option = {
        backgroundColor: '#fff', //背景色
        // tooltip: {
        //   trigger: 'axis',
        //   borderColor: 'rgba(0,0,0,.3)',
        //   backgroundColor: 'rgba(13,5,30,.6)',
        //   textStyle: {
        //     color: 'white', //设置文字颜色
        //   },
        //   borderWidth: 1,
        //   padding: 5,

        // },
        toolbox: {
          show: true,
          right: '3%',
          feature: {
            myTool: {
              show: true,
              title: '全屏显示',
              //icon从阿里图标复制对应的svg格式代码
              icon: "path://M368.896 192H224a32 32 0 0 0-32 32v137.888a32 32 0 0 0 64 0V256h112.896a32 32 0 0 0 0-64zM784.864 192H640a32 32 0 1 0 0 64h112.864v105.888a32 32 0 1 0 64 0V224a32 32 0 0 0-32-32zM368.896 777.92H256V672a32 32 0 1 0-64 0v137.92a32 32 0 0 0 32 32h144.896a32 32 0 1 0 0-64zM784.864 640a32 32 0 0 0-32 32v105.92H640a32 32 0 1 0 0 64h144.864a32 32 0 0 0 32-32V672a32 32 0 0 0-32-32z",
              onclick: function () {
                //生成全屏显示的图表
                if (setFullScreenToolBox(option, '2018-2023年摇号情况')) {
                  chartScreen
                } else { return false }
              }
            },
          }
        },
        // color: ['#fbc292', '#06fbfe',  '#f06e91'],
        legend: {
          type: 'scroll',
          // orient: 'vertical',
          // selectedMode: false, //图例点击失效
          right: 'center',
          top: '8%',
          textStyle: {
            color: '#000',
            fontSize: 12,
          },

          // data: datas.legendData,
        },
        grid: {
          containLabel: true,
          left: '10%',
          top: '20%',
          bottom: '10%',
          right: '10%',
        },
        xAxis: {
          type: 'category',
          data: this.x,
          axisLine: {
            show: true,
            lineStyle: {
              color: '#B5B5B5',
            },
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            margin: 20, //刻度标签与轴线之间的距离。
            textStyle: {
              fontFamily: 'Microsoft YaHei',
              color: '#000',
            },
            fontSize: 12,
            fontStyle: 'bold',
          },
        },
        yAxis: [
          {
            name: '人次(万人)',
            nameTextStyle: { color: '#000' },
            type: 'value',
            axisLine: {
              show: true,
              lineStyle: {
                color: '#B5B5B5',
              },
            },
            splitLine: {
              show: true,
              lineStyle: {
                // 使用深浅的间隔色
                color: ["#B5B5B5"],
                type: "dashed",
                opacity: 0.3,
              },
            },
            axisLabel: {
              show: true,
              textStyle: {
                fontFamily: 'Microsoft YaHei',
                color: '#000',
              },
              fontSize: 14,
            },
          },
          {
            type: 'value',
            splitLine: {
              show: true,
              lineStyle: {
                color: "rgba(0,0,0,.1)"
              }
            },
            axisLabel: {
              show: true,
              textStyle: {
                fontFamily: 'Microsoft YaHei',
                color: '#000',
              },
              fontSize: 14,
            },
            name: '人均次数'
          }
        ],
        series: [
          {
            name: '摇号次数',
            yAxisIndex: 0,
            type: 'bar',
            data: this.renci,
            stack: 'zs',
            barMaxWidth: 'auto',
            barWidth: '30%',
            label: {
              color: "rgba(0,0,0,1)",
              show: true,
              position: 'inside',
            },
            itemStyle: {
              color: {
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                type: 'linear',
                global: false,
                colorStops: [
                  {
                    offset: 0,
                    color: '#017ebb',
                  },
                  {
                    offset: 1,
                    color: '#06fbfe',
                  },
                ],
              },
            },
          },

          {
            name: '摇号人数',
            yAxisIndex: 0,
            data: this.renshu,
            stack: 'zs',
            type: 'bar',
            barMaxWidth: 'auto',
            barWidth: '30%',
            label: {
              color: "rgba(0,0,0,1)",
              show: true,
              position: 'inside',
            },
            itemStyle: {
              color: {
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                type: 'linear',
                global: false,
                colorStops: [
                  {
                    offset: 0,
                    color: '#fbc292',
                  },
                  {
                    offset: 1,
                    color: '#f06e91',
                  },
                ],
              },
            },
          },
          // 背景阴影网格
          // {
          //   type: 'bar',
          //   barGap: '-100%',
          //   itemStyle: {
          //     color: {
          //       image: piePatternImg,
          //       repeat: 'repeat'
          //     },
          //     opacity: 0.05
          //   },
          //   barWidth: '30%',

          //   data: [...this.renci].map(x => 100),
          //   z: 1
          // },
          // 背景阴影
          // {
          //   type: 'bar',
          //   barGap: '-100%',
          //   itemStyle: {
          //     color: '#536dfe',
          //     opacity: 0.2
          //   },
          //   barWidth: '30%',

          //   data: [...this.renci].map(x => 100),
          //   z: 1
          // },
          {
            name: 'glyph',
            type: 'pictorialBar',
            barGap: '-100%',
            symbolPosition: 'end',
            symbolSize: ['20%', '5%'],
            symbolOffset: [0, '-100%'],
            selectedMode: false,
            zlevel: 3,
            // data:[...data1].map(x=>({value:x,symbol:cpu}))
            data: [{
              value: 100,
              symbol: cpu,
            }, {
              value: 100,
              symbol: memory,
            }, {
              value: 100,
              symbol: disk,
            }, {
              value: 100,
              symbol: memory,
            }, {
              value: 100,
              symbol: memory,
            }, {
              value: 100,
              symbol: memory,
            },]
          },
          {
            name: '人均次数',
            yAxisIndex: 1,
            type: 'line',
            data: [...this.rate],
            smooth: true,
            symbol: 'arrow',
            symbolSize: 10,
            label: {
              color: "rgba(0,0,0,1)",
              show: true,
              position: 'top',
            },
            itemStyle: {
              normal: {
                lineStyle: {
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {
                      offset: 0,
                      color: 'rgba(255, 227, 168, 0)',
                    },
                    {
                      offset: 0.5,
                      color: 'rgba(255, 227, 168, 1)',
                    },
                    {
                      offset: 1,
                      color: 'rgba(255, 227, 168, 0)',
                    },
                  ]),
                  shadowColor: 'rgba(255, 120, 0,1)',
                  shadowBlur: 8,
                },
                areaStyle: {
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {
                      offset: 0,
                      color: 'rgba(197, 106, 255, 0.6)',
                    },
                    {
                      offset: 0.6,
                      color: 'rgba(255, 120, 0, 0)',
                    },
                  ]),
                },
              },
            },
          },
        ],
      };

      // 3. 把配置项给实例对象
      myChart.setOption(option);
      // 4. 让图表跟随屏幕自动的去适应
      window.addEventListener("resize", function () {
        myChart.resize();
        // })
      })

      // 5.点击切换效果
      // $(".line h2").on("click", "a", function () {
      //     // alert(1);
      //     // console.log($(this).index());
      //     // 点击 a 之后 根据当前a的索引号 找到对应的 yearData的相关对象
      //     // console.log(yearData[$(this).index()]);
      //     var obj = yearData[$(this).index()];
      //     option.series[0].data = obj.data[0];
      //     option.series[1].data = obj.data[1];
      //     // 需要重新渲染
      //     myChart.setOption(option);
      // });
    },
    // 左3饼图
    dev2() {
      // 1. 实例化对象
      var myChart = echarts.init(document.querySelector(".pie .chart"));
      // 2.指定配置
      var arrName = getArrayValue(this.data, "name");
      var arrValue = getArrayValue(this.data, "value");
      var sumValue = 100;
      var objData = array2obj(this.data, "name");
      var optionData = getData(this.data)

      function getArrayValue(array, key) {
        var key = key || "value";
        var res = [];
        if (array) {
          array.forEach(function (t) {
            res.push(t[key]);
          });
        }
        return res;
      }

      function array2obj(array, key) {
        var resObj = {};
        for (var i = 0; i < array.length; i++) {
          resObj[array[i][key]] = array[i];
        }
        return resObj;
      }

      function getData(data) {
        var res = {
          series: [
            {
              name: "大环",
              type: 'gauge',
              splitNumber: 15,
              radius: '97%',
              inside: ['50%', '50%'],
              startAngle: 90,
              endAngle: -269.9999,
              axisLine: {
                show: false,
                lineStyle: {
                  color: [
                    [1, '#1f59a7']
                  ]
                }
              },
              axisTick: {
                show: false
              },
              splitLine: {
                show: true,
                length: '7%',
                lineStyle: {
                  color: 'auto',
                  width: 3.5
                }
              },
              axisLabel: {
                show: false
              },
              detail: {
                show: false
              }
            },
            {
              name: '小环',
              type: 'gauge',
              splitNumber: 15,
              radius: '96%',
              center: ['50%', '50%'],
              startAngle: 90,
              endAngle: -269.9999,
              axisLine: {
                show: false
              },
              axisTick: {
                show: true,
                lineStyle: {
                  color: '#1f59a7',
                  width: 2.5
                },
                length: '5%',
                splitNumber: 5
              },
              splitLine: {
                show: false
              },
              axisLabel: {
                show: false
              },
              detail: {
                show: false
              }
            },
          ],
          yAxis: []
        };
        for (let i = 0; i < data.length; i++) {
          res.series.push({
            name: '年份',
            type: 'pie',
            clockWise: true,
            z: 2,
            // emphasis:{itemStyle: false},
            radius: [85 - i * 15 + '%', 80 - i * 15 + '%'],
            center: ["50%", "50%"],
            label: {
              show: true,
              formatter: '{d}%',
              color: "rgba(0,0,0,1)",
              fontSize: 14,
              position: 'inside'
            },
            labelLine: {
              show: false
            },
            data: [{
              value: data[i].value,
              name: data[i].name
            }, {
              value: sumValue - data[i].value,
              name: '',
              itemStyle: {
                color: "rgba(0,0,0,0)",
                borderWidth: 0
              },
              tooltip: {
                show: false
              },
              label: {
                show: false
              },
              // emphasis:{itemStyle: false},
            }]
          });
          res.series.push({
            name: '背景线',
            type: 'pie',
            silent: true,
            z: 1,
            clockwise: true,
            // emphasis:{itemStyle: false},
            radius: [83 - i * 15 + '%', 82 - i * 15 + '%'],
            center: ["50%", "50%"],
            label: {
              show: false
            },
            itemStyle: {
              label: {
                show: false,
              },
              labelLine: {
                show: false
              },
              borderWidth: 5,
            },
            data: [{
              value: 100,
              itemStyle: {
                color: "rgba(0,0,0,.2)",
                borderWidth: 0
              },
              tooltip: {
                show: false
              },
              // emphasis:{disabled: false},
            }]
          });
          res.yAxis.push(data[data.length - i - 1].name);
        }
        return res;
      }

      var option = {
        backgroundColor: 'rgba(255,255,255,1)',
        color: [{
          type: 'linear',
          x: 0,
          y: 0,
          x2: 1,
          y2: 1,
          colorStops: [{
            offset: 0,
            color: 'rgba(10,31,95,1)'
          }, {
            offset: 1,
            color: 'rgba(1,232,254,1)'
          }],
          global: false
        }],
        grid: {
          top: '5%',
          bottom: '50%',
          left: "50%",
          containLabel: false
        },
        toolbox: {
          show: true,
          right: '3%',
          feature: {
            myTool: {
              show: true,
              title: '全屏显示',
              //icon从阿里图标复制对应的svg格式代码
              icon: "path://M368.896 192H224a32 32 0 0 0-32 32v137.888a32 32 0 0 0 64 0V256h112.896a32 32 0 0 0 0-64zM784.864 192H640a32 32 0 1 0 0 64h112.864v105.888a32 32 0 1 0 64 0V224a32 32 0 0 0-32-32zM368.896 777.92H256V672a32 32 0 1 0-64 0v137.92a32 32 0 0 0 32 32h144.896a32 32 0 1 0 0-64zM784.864 640a32 32 0 0 0-32 32v105.92H640a32 32 0 1 0 0 64h144.864a32 32 0 0 0 32-32V672a32 32 0 0 0-32-32z",
              onclick: function () {
                //生成全屏显示的图表
                if (setFullScreenToolBox(option, '2018-2023年摇号情况')) {
                  chartScreen
                } else { return false }
              }
            },
          }
        },
        yAxis: [{
          type: 'category',
          inverse: false,
          z: 3,
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            interval: 0,
            inside: false,
            textStyle: {
              color: 'rgba(10,31,95,1)',
              fontSize: 14,
              // align:'center'
            },
            show: true
          },
          data: optionData.yAxis
        }],
        xAxis: [{
          show: false
        }],
        series: optionData.series
      };
      // 3. 把配置给实例对象
      myChart.setOption(option);
      // 4. 让图表跟随屏幕自动的去适应
      window.addEventListener("resize", function () {
        myChart.resize();
      });
    },
    // 左4
    // dev3() {
    //   // 1. 实例化对象
    //   var myChart = echarts.init(document.querySelector(".Radar .chart"));
    //   // 2.指定配置
    //   var option = {
    //     title: {
    //       text: '水球图练习',
    //       subtext: '作者 : 泓皓',
    //     },
    //     tooltip: {
    //       show: true
    //     },
    //     toolbox: {
    //       show: true,
    //       right: '10%',
    //       feature: {
    //         myTool: {
    //           show: true,
    //           title: '全屏显示',
    //           //icon从阿里图标复制对应的svg格式代码
    //           icon: "path://M368.896 192H224a32 32 0 0 0-32 32v137.888a32 32 0 0 0 64 0V256h112.896a32 32 0 0 0 0-64zM784.864 192H640a32 32 0 1 0 0 64h112.864v105.888a32 32 0 1 0 64 0V224a32 32 0 0 0-32-32zM368.896 777.92H256V672a32 32 0 1 0-64 0v137.92a32 32 0 0 0 32 32h144.896a32 32 0 1 0 0-64zM784.864 640a32 32 0 0 0-32 32v105.92H640a32 32 0 1 0 0 64h144.864a32 32 0 0 0 32-32V672a32 32 0 0 0-32-32z",
    //           onclick: function () {
    //             //生成全屏显示的图表
    //             if (setFullScreenToolBox(option, '模板标题')) {
    //               chartScreen
    //             } else { return false }
    //           }
    //         },
    //       }
    //     },
    //     series: [{
    //       type: 'liquidFill',
    //       name: 'liquidFill',
    //       data: [{
    //         value: 0.45,
    //         name: '喝水'
    //       }, 0.45, 0.4],
    //       color: ['green', 'cyan', 'blue'],
    //       radius: '40%',
    //       outline: { show: false },
    //       //自定义路径
    //       // shape: 'path://M836.246588 713.185882L828.235294 798.117647H210.823529L120.470588 0h783.058824l-19.877647 210.823529H1024v60.235295h-146.070588L842.691765 645.210353 963.764706 512h60.235294l-187.753412 201.185882zM963.764706 271.058824h60.235294v240.941176h-60.235294V271.058824zM0 813.176471h1024l-169.743059 210.823529H169.743059L0 813.176471z',
    //       shape: 'path://M342.528 704.341333a128 128 0 1 0 192.725333-110.421333V447.573333c0-35.2-28.8-64-64-64s-64 28.8-64 64V593.066667a127.914667 127.914667 0 0 0-64.725333 111.232z,M661.376 532.224c0.682667-6.4 1.024-12.928 1.024-19.456v-256c0-105.6-86.442667-192-192-192a192.554667 192.554667 0 0 0-192 192v256c0 7.424 0.426667 14.805333 1.28 22.058667a256 256 0 1 0 381.738667-2.602667zM343.765333 256.128c0-70.4 57.6-128 128-128s128 57.6 128 128v304.938667l3.285334 3.029333a191.061333 191.061333 0 0 1 60.586666 139.989333 192 192 0 1 1-319.872-143.146666V256.128zM727.04 194.346667a96 96 0 1 1 192 0 96 96 0 0 1-192 0z m64 0a32 32 0 1 0 64 0 32 32 0 0 0-64 0z',
    //       center: ['25%', '25%'],
    //       // 文字样式
    //       label: {
    //         formatter: '{a}\n{b}\nValue : {c}',
    //         textStyle: {
    //           color: 'red',
    //           insideColor: 'yellow',
    //           fontSize: 20
    //         },
    //       },
    //     },
    //     {
    //       type: 'liquidFill',
    //       data: [0.42, 0.5, 0.4, 0.3],
    //       direction: 'left',
    //       radius: '40%',
    //       shape: 'arrow',
    //       center: ['75%', '25%'],
    //       label: {
    //         textStyle: {
    //           color: 'red',
    //           insideColor: 'yellow',
    //         },
    //       },
    //     },
    //     {
    //       type: 'liquidFill',
    //       data: [0.43, 0.5, 0.4, 0.3],
    //       radius: '40%',
    //       shape: 'circle',
    //       center: ['25%', '75%'],
    //       backgroundStyle: {
    //         borderColor: '#156ACF',
    //         borderWidth: 1,
    //         shadowColor: 'rgba(0, 0, 0, 0.4)',
    //         shadowBlur: 20
    //       },
    //       outline: {
    //         show: false
    //       },
    //       //关闭动画
    //       waveAnimation: false,
    //     },
    //     {
    //       type: 'liquidFill',
    //       data: [0.44, 0.5, 0.4, 0.3],
    //       radius: '50%',
    //       shape: 'pin',
    //       center: ['75%', '75%'],
    //       //振幅
    //       amplitude: 0,
    //       waveAnimation: false,
    //       outline: {
    //         show: false
    //       },
    //       backgroundStyle: {
    //         shadowColor: 'rgba(0, 0, 0, 0.4)',
    //         shadowBlur: 20
    //       }
    //     }]
    //   };

    //   // 3. 把配置给实例对象
    //   myChart.setOption(option);
    //   // 4. 让图表跟随屏幕自动的去适应
    //   window.addEventListener("resize", function () {
    //     myChart.resize();
    //   });
    // },
    dev3() {
      // 1. 实例化对象
      var myChart = echarts.init(document.querySelector(".Radar .chart"));
      // 2.指定配置
      var option = {
        color: ['#2ecc71', '#1abc9c', '#1abc9c', '#4ba477', '#3bbf7c'],
        backgroundColor: 'rgba(255,255,255,1)',
        // title: {
        //   text: '2018-2023年',
        //   subtext: '历年摇号情况',
        //   textStyle: { //主标题
        //     color: '#3E4956',
        //     fontWeight: 'bold',
        //     // fontSize:50,
        //     fontFamily: 'Haettenschweiler',
        //   },
        //   subtextStyle: {//副标题
        //     color: '#3E4956',
        //     fontSize: 12,
        //   },
        //   itemGap: 12,//主副标题之间的距离
        //   top: '36%',
        //   left: '1%',
        // },
        tooltip: {
          trigger: 'item',
          formatter: "{b}年:\n{c}(万人次)"
        },
        toolbox: {
          show: true,
          right: '3%',
          feature: {
            myTool: {
              show: true,
              title: '全屏显示',
              //icon从阿里图标复制对应的svg格式代码
              icon: "path://M368.896 192H224a32 32 0 0 0-32 32v137.888a32 32 0 0 0 64 0V256h112.896a32 32 0 0 0 0-64zM784.864 192H640a32 32 0 1 0 0 64h112.864v105.888a32 32 0 1 0 64 0V224a32 32 0 0 0-32-32zM368.896 777.92H256V672a32 32 0 1 0-64 0v137.92a32 32 0 0 0 32 32h144.896a32 32 0 1 0 0-64zM784.864 640a32 32 0 0 0-32 32v105.92H640a32 32 0 1 0 0 64h144.864a32 32 0 0 0 32-32V672a32 32 0 0 0-32-32z",
              onclick: function () {
                //生成全屏显示的图表
                if (setFullScreenToolBox(option, '2018-2023年摇号情况')) {
                  chartScreen
                } else { return false }
              }
            },
          }
        },
        calculable: true,
        series: [{
          name: '摇号次数',
          type: 'treemap',
          width: '88%',
          height: '70%',
          left: '10%',
          //right:'30%',
          roam: true, //是否开启拖拽漫游（移动和缩放）
          nodeClick: true,//点击节点后的行为,false无反应
          label: {
            textStyle: { fontWeight: 'bold', fontSize: '14', color: "rgba(0,0,0,1)", }
          },
          itemStyle: {
            label: {
              color: "rgba(0,0,0,1)",
              show: true,
              formatter: "{b}"
            },
            borderWidth: 2,
            borderColor: '#000',
            /* emphasis: {
               label: {
                 show: true
               },
               color: '#cc99cc',
               borderWidth: 3,
               borderColor: '#996699'
             }*/
          },
          data: this.data
        }]
      };
      // 3. 把配置给实例对象
      myChart.setOption(option);
      // 4. 让图表跟随屏幕自动的去适应
      window.addEventListener("resize", function () {
        myChart.resize();
      });
    },
    // 左5柱状
    dev4() {
      var myColor = ["#1089E7", "#F57474", "#56D0E3", "#F8B448", "#8B78F6", "#8B00F6"];
      var maskImage = new Image();
      maskImage.src = 'data:image/png;base64,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'
      // 1. 实例化对象
      var myChart = echarts.init(document.querySelector(".Bar .chart"));
      // 2. 指定配置和数据
      var option = {
        backgroundColor: 'rgba(255,255,255,1)',
        tooltip: {
          show: true
        },
        toolbox: {
          show: true,
          right: '3%',
          feature: {
            myTool: {
              show: true,
              title: '全屏显示',
              //icon从阿里图标复制对应的svg格式代码
              icon: "path://M368.896 192H224a32 32 0 0 0-32 32v137.888a32 32 0 0 0 64 0V256h112.896a32 32 0 0 0 0-64zM784.864 192H640a32 32 0 1 0 0 64h112.864v105.888a32 32 0 1 0 64 0V224a32 32 0 0 0-32-32zM368.896 777.92H256V672a32 32 0 1 0-64 0v137.92a32 32 0 0 0 32 32h144.896a32 32 0 1 0 0-64zM784.864 640a32 32 0 0 0-32 32v105.92H640a32 32 0 1 0 0 64h144.864a32 32 0 0 0 32-32V672a32 32 0 0 0-32-32z",
              onclick: function () {
                //生成全屏显示的图表
                if (setFullScreenToolBox(option, '2018-2023年摇号情况')) {
                  chartScreen
                } else { return false }
              }
            },
          }
        },
        series: [
          {
            type: 'wordCloud',
            sizeRange: [14, 50],
            rotationRange: [0, 90],
            maskImage: maskImage, //按背景渲染云词
            textPadding: 0,
            gridSize: 5, //用于标记画布可用性的网格大小（以像素为单位）//字距越大，字距越大。
            shape: 'path://M392.2944 1013.2992c107.7248-76.032 220.7744-178.1248 324.3008-297.9328 25.856-29.952 50.176-59.8016 72.8576-89.5488,M482.4576 195.6864C343.04 58.5728 203.0592-13.7216 110.336 18.2272c-130.7136 44.9536-125.0816 282.9824 0.6144 562.688 21.6576 48.0256 46.8992 97.3824 75.52 147.0464 62.1568 107.8784 133.0688 204.8512 205.824 285.3888 107.7248-76.032 220.7744-178.1248 324.3008-297.9328 25.856-29.952 50.176-59.8016 72.8576-89.5488,M110.9504 580.864c21.6576 48.0256 46.8992 97.3824 75.52 147.0464 62.1568 107.8784 133.0688 204.8512 205.824 285.3888,M482.4576 195.6864c189.7984-146.8416 370.7904-218.5728 464.896-169.8304 126.0032 65.1264 53.9648 323.2256-157.9008 599.9616-22.6816 29.696-47.0016 59.5968-72.8576 89.5488-103.5264 119.808-216.576 221.9008-324.3008 297.9328-72.7552-80.5376-143.7184-177.5104-205.824-285.3888-28.6208-49.7152-53.8624-99.0208-75.52-147.0464', //按背景渲染云词
            width: '45%',
            height: '70%',
            left: 'center',
            top: 'center',
            drawOutOfBound: false,
            emphasis: {
              disabled: true,
              focus: 'none' //self
            },
            textStyle: {
              fontFamily: "sans-serif",
              color: function () {
                let index = Math.floor(Math.random() * myColor.length);
                return myColor[index];
              },
            },
            data: this.arr
          },
        ]
      }
      // 3. 把配置给实例对象
      myChart.setOption(option);
      // 4. 让图表跟随屏幕自动的去适应
      window.addEventListener("resize", function () {
        myChart.resize();
      });
    },
    // 右1折线
    dev5() {
      var myChart = echarts.init(document.querySelector(".line2 .chart"));
      var le3 = this.le3
      var co = ['#929fff', '#9de0ff', '#ffa897', '#af87fe', '#7dc3fe', '#bb60b2', '#433e7c', '#f47a75', '#009db2', '#024b51', '#0780cf', '#765005']
      var optionData = getData(this.sum3)
      // console.log(this.sum3)
      function getData(data) {
        var res = {
          series: [],
        };
        for (var i = 0; i < data.length; i++) {
          // console.log(res.series)
          res.series.push(
            {
              name: le3[i],
              type: "line",
              smooth: true,
              zlevel: 2,
              z: 2,
              // 单独修改当前线条的样式
              lineStyle: {
                color: co[i],
                width: "2"
              },
              // 填充颜色设置
              areaStyle: {
                color: new echarts.graphic.LinearGradient(
                  0, 0, 0, 1,
                  [
                    {
                      offset: 0,
                      // color: "rgba(1, 168, 213, 0.4)"
                      color: co[i] // 渐变色的起始颜色
                    },
                    {
                      offset: 0.8,
                      color: "rgba(1, 132, 213, 0.1)" // 渐变线的结束颜色
                    }
                  ],
                  false
                ),
                shadowColor: "rgba(0, 0, 0, 0.1)"
              },
              // 设置拐点
              symbol: "circle",
              // 拐点大小
              symbolSize: 8,
              // 开始不显示拐点， 鼠标经过显示
              showSymbol: false,
              // 设置拐点颜色以及边框
              itemStyle: {
                color: "#0184d5",
                borderColor: "rgba(221, 220, 107, .1)",
                borderWidth: 12
              },
              data: data[i]
            }
          )
        }
        return res;
      }

      // console.log(optionData.series)
      var option = {
        backgroundColor: 'rgba(255,255,255,1)',
        tooltip: {
          trigger: "axis"
        },
        toolbox: {
          show: true,
          right: '3%',
          feature: {
            myTool: {
              show: true,
              title: '全屏显示',
              //icon从阿里图标复制对应的svg格式代码
              icon: "path://M368.896 192H224a32 32 0 0 0-32 32v137.888a32 32 0 0 0 64 0V256h112.896a32 32 0 0 0 0-64zM784.864 192H640a32 32 0 1 0 0 64h112.864v105.888a32 32 0 1 0 64 0V224a32 32 0 0 0-32-32zM368.896 777.92H256V672a32 32 0 1 0-64 0v137.92a32 32 0 0 0 32 32h144.896a32 32 0 1 0 0-64zM784.864 640a32 32 0 0 0-32 32v105.92H640a32 32 0 1 0 0 64h144.864a32 32 0 0 0 32-32V672a32 32 0 0 0-32-32z",
              onclick: function () {
                //生成全屏显示的图表
                if (setFullScreenToolBox(option, '2018-2023年杭州市落户人才摇号情况')) {
                  chartScreen
                } else { return false }
              }
            },
          }
        },
        legend: {
          type: 'scroll',
          top: "4%",
          width: '50%',
          data: this.le3,
          textStyle: {
            color: "rgba(0,0,0,.5)",
            fontSize: "12"
          }
        },
        grid: {
          left: "10",
          top: "15%",
          right: "10",
          bottom: "10",
          containLabel: true
        },
        xAxis: [
          {
            type: "category",
            // boundaryGap: false,
            // x轴更换数据
            data: this.name,
            // 文本颜色为rgba(0,0,0,.6)  文字大小为 12
            axisLabel: {
              color: "rgba(0,0,0,.6)",
              fontSize: 12
            },
            // x轴线的颜色为   rgba(0,0,0,.2)
            axisLine: {
              lineStyle: {
                color: "rgba(0,0,0,.2)"
              }
            }
          }
        ],
        yAxis: [
          {
            name: '单位:人',
            nameTextStyle: { color: '#000' },
            type: "value",
            axisTick: { show: false },
            axisLine: {
              lineStyle: {
                color: "rgba(0,0,0,.1)"
              }
            },
            axisLabel: {
              color: "rgba(0,0,0,.6)",
              fontSize: 12
            },
            // 修改分割线的颜色
            splitLine: {
              lineStyle: {
                color: "rgba(0,0,0,.1)"
              }
            }
          }
        ],
        series: optionData.series
      };
      myChart.setOption(option);
      // 4. 让图表跟随屏幕自动的去适应
      window.addEventListener("resize", function () {
        myChart.resize();
      });
    },
    // 右2
    dev6() {
      var myChart = echarts.init(document.querySelector(".radar2 .chart"));
      const luffyData = [...this.name].map((res, index) => ({ name: res, value: this.sum3t[index], zlevel: index, animationEasing: 'elasticInOut' }))
      const powerColor = ['#4cd137', '#f0932b', '#EA2027', '#1e272e', '#8F33CC', '#c7ecee', '#f368e0', '#0652DD', '#ffdd59', '#474787', '#00FFFF']

      var option = {
        backgroundColor: 'rgba(255,255,255,1)',
        tooltip: {},
        toolbox: {
          show: true,
          right: '3%',
          feature: {
            myTool: {
              show: true,
              title: '全屏显示',
              //icon从阿里图标复制对应的svg格式代码
              icon: "path://M368.896 192H224a32 32 0 0 0-32 32v137.888a32 32 0 0 0 64 0V256h112.896a32 32 0 0 0 0-64zM784.864 192H640a32 32 0 1 0 0 64h112.864v105.888a32 32 0 1 0 64 0V224a32 32 0 0 0-32-32zM368.896 777.92H256V672a32 32 0 1 0-64 0v137.92a32 32 0 0 0 32 32h144.896a32 32 0 1 0 0-64zM784.864 640a32 32 0 0 0-32 32v105.92H640a32 32 0 1 0 0 64h144.864a32 32 0 0 0 32-32V672a32 32 0 0 0-32-32z",
              onclick: function () {
                //生成全屏显示的图表
                if (setFullScreenToolBox(option, '2018-2023年杭州市落户人才摇号情况')) {
                  chartScreen
                } else { return false }
              }
            },
          }
        },
        legend: {
          type: 'scroll',
          show: true,
          top: '8%',
          right: 'center',
          borderRadius: 5,
          textStyle: {
            color: "#000",
          },
          tooltip: {
            show: true
          },
          // data: this.name
        },
        radar: {
          center: ['50%', '55%'],
          radius: '65%', //雷达图的半径
          startAngle: 90, //旋转
          splitNumber: 5, //圆圈线的数量
          shape: 'circle',
          name: {
            textStyle: {
              color: '#000',
              backgroundColor: '#999',
              borderRadius: 3,
              padding: [3, 5]
            }
          },
          textStyle: {
            fontSize: 20
          },
          indicator: [...this.le3].map((x) => ({
            name: x,
            // max: 10000 
          }))
        },
        color: powerColor,
        series: []
      }
      let tempSeries = {
        type: 'radar',
        areaStyle: {
          opacity: 0.8,
        },
        emphasis: {
          areaStyle: {
            opacity: 0.8,
            shadowBlur: 10,
          },
        },
        label: {
          show: true,
          color: '#000',
          position: "inside",
          fontSize: 16
        },
        lineStyle: {
          shadowBlur: 20,
          opacity: 0.8,
        }
      }
      let tempData = [...luffyData]
      let tempColor = [...powerColor]
      const intv = setInterval(function () {
        if (tempData.length === 0) {
          clearInterval(intv)
          return
        }
        let copySeries = JSON.parse(JSON.stringify(tempSeries))
        copySeries.data = [tempData.shift()]
        copySeries.zlevel = copySeries.data[0].zlevel
        copySeries.animationEasing = copySeries.data[0].animationEasing
        // copySeries.lineStyle.shadowColor = tempColor.shift()
        option.series.push(copySeries)
        myChart.setOption(option)
      }, 1000)
      myChart.setOption(option);
      // 监听浏览器缩放，图表对象调用缩放resize函数
      window.addEventListener("resize", function () {
        myChart.resize();
      });
    },
    // 右3
    dev7() {
      var myChart = echarts.init(document.querySelector(".bar2 .chart"));
      // mock 数据
      const dataArr = {
        xdata: this.name,
        result: [...this.le3].map((res, i) => ({ name: res, data: this.sum3[i] }))
      }
      // 头部菱形
      const diamondData = dataArr.result.reduce((pre, cur, index) => {
        pre[index] = cur.data.map((el, id) => el + (pre[index - 1] ? pre[index - 1][id] : 0))
        return pre
      }, [])

      // color
      const color = [
        [{ offset: 0, color: "#dc0707", }, { offset: 0.5, color: "#dc0707", }, { offset: 0.5, color: "#af0808", }, { offset: 1, color: "#af0808", }],
        [{ offset: 0, color: "#f67c20", }, { offset: 0.5, color: "#f67c20", }, { offset: 0.5, color: "#cc681e", }, { offset: 1, color: "#cc681e", }],
        [{ offset: 0, color: "#efff37", }, { offset: 0.5, color: "#efff37", }, { offset: 0.5, color: "#d5e700", }, { offset: 1, color: "#d5e700", }],
        [{ offset: 0, color: "#32ffee", }, { offset: 0.5, color: "#32ffee", }, { offset: 0.5, color: "#00e8d5", }, { offset: 1, color: "#00e8d5", }],
        [{ offset: 0, color: "#46c9ff", }, { offset: 0.5, color: "#46c9ff", }, { offset: 0.5, color: "#00b4ff", }, { offset: 1, color: "#00b4ff", }],
        [{ offset: 0, color: "#54a0ff", }, { offset: 0.5, color: "#54a0ff", }, { offset: 0.5, color: "#1f83ff", }, { offset: 1, color: "#1f83ff", }],
        [{ offset: 0, color: "#46c9ff", }, { offset: 0.5, color: "#46c9ff", }, { offset: 0.5, color: "#00b4ff", }, { offset: 1, color: "#00b4ff", }],
        [{ offset: 0, color: "#32ffee", }, { offset: 0.5, color: "#32ffee", }, { offset: 0.5, color: "#00e8d5", }, { offset: 1, color: "#00e8d5", }],
        [{ offset: 0, color: "#efff37", }, { offset: 0.5, color: "#efff37", }, { offset: 0.5, color: "#d5e700", }, { offset: 1, color: "#d5e700", }],
        [{ offset: 0, color: "#f67c20", }, { offset: 0.5, color: "#f67c20", }, { offset: 0.5, color: "#cc681e", }, { offset: 1, color: "#cc681e", }],
      ]

      // series
      let series = dataArr.result.reduce((p, c, i, array) => {
        p.push({
          z: i + 1,
          stack: '总量',
          type: 'bar',
          name: c.name,
          barGap: '-100%',
          barWidth: 30,
          data: c.data,
          itemStyle: { color: { type: 'linear', x: 0, x2: 1, y: 0, y2: 0, colorStops: color[i] } },
        }, {
          z: i + 10,
          type: 'pictorialBar',
          symbolPosition: 'end',
          symbol: 'diamond',
          symbolOffset: [0, '-50%'],
          symbolSize: [30, 10],
          data: diamondData[i],
          itemStyle: { color: { type: 'linear', x: 0, x2: 1, y: 0, y2: 0, colorStops: color[i] } },
          tooltip: { show: false },
        })

        // 是否最后一个了？
        if (p.length === (array.length) * 2) {
          p.push({
            z: array.length * 2,
            type: "pictorialBar",
            symbolPosition: "start",
            data: dataArr.result[0].data,
            symbol: "diamond",
            symbolOffset: ["0%", "50%"],
            symbolSize: [30, 10],
            itemStyle: { color: { type: 'linear', x: 0, x2: 1, y: 0, y2: 0, colorStops: color[0] } },
            tooltip: { show: false },
          })
          return p
        }
        return p
      }, [])
      // tooltip
      const tooltip = { trigger: "axis" }
      const toolbox = {
        show: true,
        right: '3%',
        feature: {
          myTool: {
            show: true,
            title: '全屏显示',
            //icon从阿里图标复制对应的svg格式代码
            icon: "path://M368.896 192H224a32 32 0 0 0-32 32v137.888a32 32 0 0 0 64 0V256h112.896a32 32 0 0 0 0-64zM784.864 192H640a32 32 0 1 0 0 64h112.864v105.888a32 32 0 1 0 64 0V224a32 32 0 0 0-32-32zM368.896 777.92H256V672a32 32 0 1 0-64 0v137.92a32 32 0 0 0 32 32h144.896a32 32 0 1 0 0-64zM784.864 640a32 32 0 0 0-32 32v105.92H640a32 32 0 1 0 0 64h144.864a32 32 0 0 0 32-32V672a32 32 0 0 0-32-32z",
            onclick: function () {
              //生成全屏显示的图表
              if (setFullScreenToolBox(option, '2018-2023年杭州市落户人才摇号情况')) {
                chartScreen
              } else { return false }
            }
          },
        }
      }
      // legend
      const legend = {
        data: dataArr.result.map(item => item.name),
        textStyle: { fontSize: 14, color: '#000' },
        type: 'scroll',
        itemWidth: 25,
        itemHeight: 15,
        itemGap: 15,
        bottom: '0%',
        // 禁止点击
        selectedMode: false,
      }
      // grid
      const grid = { top: '15%', left: '3%', right: '3%', bottom: '15%', containLabel: true }

      // xAxis
      const xAxis = {
        axisTick: { show: true },
        axisLine: { lineStyle: { color: 'rgba(0,0,0, .2)' } },
        axisLabel: { textStyle: { fontSize: 12, color: '#000' }, },
        data: dataArr.xdata
      }

      // yAxis
      const yAxis = [{
        name: '单位:人次',
        nameTextStyle: { color: '#000' },
        splitLine: { lineStyle: { color: 'rgba(0,0,0, .05)' } },
        axisLine: { show: false, },
        axisLabel: { textStyle: { fontSize: 12, color: '#000' } }
      }]

      // 渲染
      var option = { tooltip, toolbox, xAxis, yAxis, series, grid, legend, backgroundColor: 'rgba(255, 255, 255, 1)' }
      myChart.setOption(option);
      // 监听浏览器缩放，图表对象调用缩放resize函数
      window.addEventListener("resize", function () {
        myChart.resize();
      });
    },
    // 右4
    dev8() {
      var myChart = echarts.init(document.querySelector(".linebar2 .chart"));
      var data1 = [...this.sum3].map((x) => ([...x].map((res, i) => ([i, 0, res]))))
      // console.log(data1)
      var le3 = this.le3
      var co = ['#929fff', '#9de0ff', '#ffa897', '#af87fe', '#7dc3fe', '#bb60b2', '#433e7c', '#f47a75', '#009db2', '#024b51', '#0780cf', '#765005']
      var optionData = getData(data1)
      // console.log(this.sum3)
      function getData(data) {
        var res = {
          series: [],
        };
        for (var i = 0; i < data.length; i++) {
          // console.log(res.series)
          res.series.push(
            {
              type: 'bar3D',
              name: le3[i],
              barSize: 15,
              itemStyle: {
                color: co[i]
              },
              data: data[i],
              stack: 'stack',
              shading: 'lambert',
              emphasis: {
                label: {
                  color: "rgba(0,0,0,1)",
                  show: true,
                }
              }
            }
          )
        }
        return res;
      }
      var option = {
        backgroundColor: 'rgba(255,255,255,1)',
        toolbox: {
          show: true,
          right: '3%',
          feature: {
            myTool: {
              show: true,
              title: '全屏显示',
              //icon从阿里图标复制对应的svg格式代码
              icon: "path://M368.896 192H224a32 32 0 0 0-32 32v137.888a32 32 0 0 0 64 0V256h112.896a32 32 0 0 0 0-64zM784.864 192H640a32 32 0 1 0 0 64h112.864v105.888a32 32 0 1 0 64 0V224a32 32 0 0 0-32-32zM368.896 777.92H256V672a32 32 0 1 0-64 0v137.92a32 32 0 0 0 32 32h144.896a32 32 0 1 0 0-64zM784.864 640a32 32 0 0 0-32 32v105.92H640a32 32 0 1 0 0 64h144.864a32 32 0 0 0 32-32V672a32 32 0 0 0-32-32z",
              onclick: function () {
                //生成全屏显示的图表
                if (setFullScreenToolBox(option, '2018-2023年杭州市落户人才摇号情况')) {
                  chartScreen
                } else { return false }
              }
            },
          }
        },
        legend: {
          type: 'scroll',
          show: true,
          top: '8%',
          right: 'center',
          borderRadius: 5,
          textStyle: {
            color: "#000",
          },
        },
        tooltip: {
          show: true,
          textStyle: { color: '#fff' },
          backgroundColor: 'rgba(0,0,0,0.3)',
        },
        xAxis3D: {
          name: '',
          type: 'category',
          data: this.name,
          axisLine: {
            lineStyle: {
              color: 'rgba(0,0,0,0)',
              width: 0
            }
          },
          // splitLine: {
          //   show: false
          // },
          axisLabel: {
            interval: 0,
            rotate: 45,
            textStyle: {
              color: '#000',
              fontSize: 12,
            }
          },
          axisTick: {
            show: false
          },

        },
        yAxis3D: {
          name: '',
          type: 'category',
          data: [''],
          axisLine: {
            lineStyle: {
              color: 'rgba(0,0,0,0)',
              width: 0
            }
          },
          // splitLine: {
          //   show: false
          // },
          // axisLabel: {
          //   show: false
          // },
          axisTick: {
            show: false
          },
        },
        zAxis3D: {
          name: '',
          type: 'value',
          axisLine: {
            lineStyle: {
              color: '#0F0',
              width: 0
            }
          },
          // splitLine: {
          //   show: false
          // },
          axisLabel: {
            interval: 0,
            rotate: 45,
            textStyle: {
              color: '#000',
              fontSize: 12,
            }
          },
          axisTick: {
            show: false
          },
        },
        grid3D: {
          boxWidth: 200,
          // left: "10",
          // top: "15%",
          // right: "10",
          // bottom: "10",
          boxDepth: 30,
          axisPointer: {
            show: false
          },
          light: {
            main: {
              intensity: 1.2
            },
            ambient: {
              intensity: 0.3
            }
          },
          viewControl: {
            alpha: 30,
            beta: 0,
            autoRotate: true,
            zoomSensitivity: 0,
            autoRotateAfterStill: 15,
            distance: 200
          }
        },
        series: optionData.series
      };
      myChart.setOption(option);
      // 监听浏览器缩放，图表对象调用缩放resize函数
      window.addEventListener("resize", function () {
        myChart.resize();
      });
    },
    // 右5
    // dev9() {
    //   var myChart = echarts.init(document.querySelector(".stack2 .chart"));
    //   var data = [...this.sum3].map((x) => ([...x].map((res, i) => ({name:this.name[i],value:res,itemStyle: { color: this.bgc[i], },}))))
    //   // console.log(data)
    //   function getParametricEquation(startRatio, endRatio, isSelected, isHovered, k) {
    //     // 计算
    //     let midRatio = (startRatio + endRatio) / 2;

    //     let startRadian = startRatio * Math.PI * 2;
    //     let endRadian = endRatio * Math.PI * 2;
    //     let midRadian = midRatio * Math.PI * 2;

    //     // 如果只有一个扇形，则不实现选中效果。
    //     if (startRatio === 0 && endRatio === 1) {
    //       isSelected = false;
    //     }

    //     // 通过扇形内径/外径的值，换算出辅助参数 k（默认值 1/3）
    //     k = typeof k !== "undefined" ? k : 1 / 3;

    //     // 计算选中效果分别在 x 轴、y 轴方向上的位移（未选中，则位移均为 0）
    //     let offsetX = isSelected ? Math.cos(midRadian) * 0.1 : 0;
    //     let offsetY = isSelected ? Math.sin(midRadian) * 0.1 : 0;

    //     // 计算高亮效果的放大比例（未高亮，则比例为 1）
    //     let hoverRate = isHovered ? 1.05 : 1;

    //     // 返回曲面参数方程
    //     return {
    //       u: {
    //         min: -Math.PI,
    //         max: Math.PI * 3,
    //         step: Math.PI / 32
    //       },

    //       v: {
    //         min: 0,
    //         max: Math.PI * 2,
    //         step: Math.PI / 20
    //       },

    //       x: function (u, v) {
    //         if (u < startRadian) {
    //           return (
    //             offsetX +
    //             Math.cos(startRadian) * (1 + Math.cos(v) * k) * hoverRate
    //           );
    //         }
    //         if (u > endRadian) {
    //           return (
    //             offsetX + Math.cos(endRadian) * (1 + Math.cos(v) * k) * hoverRate
    //           );
    //         }
    //         return offsetX + Math.cos(u) * (1 + Math.cos(v) * k) * hoverRate;
    //       },

    //       y: function (u, v) {
    //         if (u < startRadian) {
    //           return (
    //             offsetY +
    //             Math.sin(startRadian) * (1 + Math.cos(v) * k) * hoverRate
    //           );
    //         }
    //         if (u > endRadian) {
    //           return (
    //             offsetY + Math.sin(endRadian) * (1 + Math.cos(v) * k) * hoverRate
    //           );
    //         }
    //         return offsetY + Math.sin(u) * (1 + Math.cos(v) * k) * hoverRate;
    //       },

    //       z: function (u, v) {
    //         if (u < -Math.PI * 0.5) {
    //           return Math.sin(u);
    //         }
    //         if (u > Math.PI * 2.5) {
    //           return Math.sin(u);
    //         }
    //         return Math.sin(v) > 0 ? 1 : -1;
    //       }
    //     };
    //   }
    //   // 生成模拟 3D 饼图的配置项
    //   function getPie3D(pieData, internalDiameterRatio) {
    //     let series = [];
    //     let sumValue = 0;
    //     let startValue = 0;
    //     let endValue = 0;
    //     let legendData = [];
    //     let k =
    //       typeof internalDiameterRatio !== "undefined" ?
    //         (1 - internalDiameterRatio) / (1 + internalDiameterRatio) :
    //         1 / 3;

    //     // 为每一个饼图数据，生成一个 series-surface 配置
    //     for (let i = 0; i < pieData.length; i++) {
    //       sumValue += pieData[i].value;

    //       let seriesItem = {
    //         name: typeof pieData[i].name === "undefined" ?
    //           `series${i}` : pieData[i].name,
    //         type: "surface",
    //         parametric: true,
    //         wireframe: {
    //           show: false
    //         },
    //         pieData: pieData[i],
    //         pieStatus: {
    //           selected: false,
    //           hovered: false,
    //           k: k
    //         }
    //       };

    //       if (typeof pieData[i].itemStyle != "undefined") {
    //         let itemStyle = {};

    //         typeof pieData[i].itemStyle.color != "undefined" ?
    //           (itemStyle.color = pieData[i].itemStyle.color) :
    //           null;
    //         typeof pieData[i].itemStyle.opacity != "undefined" ?
    //           (itemStyle.opacity = pieData[i].itemStyle.opacity) :
    //           null;

    //         seriesItem.itemStyle = itemStyle;
    //       }
    //       series.push(seriesItem);
    //     }

    //     // 使用上一次遍历时，计算出的数据和 sumValue，调用 getParametricEquation 函数，
    //     // 向每个 series-surface 传入不同的参数方程 series-surface.parametricEquation，也就是实现每一个扇形。
    //     for (let i = 0; i < series.length; i++) {
    //       endValue = startValue + series[i].pieData.value;

    //       series[i].pieData.startRatio = startValue / sumValue;
    //       series[i].pieData.endRatio = endValue / sumValue;
    //       series[i].parametricEquation = getParametricEquation(
    //         series[i].pieData.startRatio,
    //         series[i].pieData.endRatio,
    //         true,
    //         false,
    //         1
    //       );

    //       startValue = endValue;

    //       legendData.push(series[i].name);
    //     }

    //     // 补充一个透明的圆环，用于支撑高亮功能的近似实现。
    //     series.push({
    //       name: "内圆环",
    //       type: "surface",
    //       parametric: true,
    //       wireframe: {
    //         show: false
    //       },
    //       itemStyle: {
    //         opacity: 1,
    //         color: "rgba(18,236,252,.5)"
    //       },
    //       parametricEquation: {
    //         u: {
    //           min: 0,
    //           max: Math.PI * 2,
    //           step: Math.PI / 20
    //         },
    //         v: {
    //           min: 0,
    //           max: Math.PI,
    //           step: Math.PI / 1.4
    //         },
    //         x: function (u, v) {
    //           return Math.sin(v) * Math.sin(u) + Math.sin(u);
    //         },
    //         y: function (u, v) {
    //           return Math.sin(v) * Math.cos(u) + Math.cos(u);
    //         },
    //         z: function (u, v) {
    //           return Math.cos(v) > 0 ? 0.1 : -0.1;
    //         }
    //       }
    //     });
    //     // 准备待返回的配置项，把准备好的 legendData、series 传入。
    //     // console.log(typeof name1[1])
    //     let option = {
    //       //animation: false,
    //       legend: {
    //         show: true,
    //         type:'scroll',
    //         // data: legendData,
    //         top: '5%',
    //         textStyle:{
    //           color:'gold'
    //         }
    //       },
    //       tooltip: {
    //         formatter: params => {
    //           if (params.seriesName !== '内圆环') {
    //             return `${params.seriesName}<br/><span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${params.color};"></span>${option.series[params.seriesIndex].pieData.value}`;
    //           }
    //         }
    //       },
    //       toolbox: {
    //       show: true,
    //       right: '10%',
    //       feature: {
    //         myTool: {
    //           show: true,
    //           title: '全屏显示',
    //           //icon从阿里图标复制对应的svg格式代码
    //           icon: "path://M368.896 192H224a32 32 0 0 0-32 32v137.888a32 32 0 0 0 64 0V256h112.896a32 32 0 0 0 0-64zM784.864 192H640a32 32 0 1 0 0 64h112.864v105.888a32 32 0 1 0 64 0V224a32 32 0 0 0-32-32zM368.896 777.92H256V672a32 32 0 1 0-64 0v137.92a32 32 0 0 0 32 32h144.896a32 32 0 1 0 0-64zM784.864 640a32 32 0 0 0-32 32v105.92H640a32 32 0 1 0 0 64h144.864a32 32 0 0 0 32-32V672a32 32 0 0 0-32-32z",
    //           onclick: function () {
    //             //生成全屏显示的图表
    //             if (setFullScreenToolBox(option, '2018-2023年摇号情况')) {
    //               chartScreen
    //             } else { return false }
    //           }
    //         },
    //       }
    //     },
    //       xAxis3D: {
    //         min: -1.3,
    //         max: 1.3
    //       },
    //       yAxis3D: {
    //         min: -1.3,
    //         max: 1.3
    //       },
    //       zAxis3D: {
    //         min: -1.3,
    //         max: 1.3
    //       },
    //       grid3D: {
    //         show: false,
    //         boxHeight: 10,
    //         // top: '30%',
    //         left: "0",
    //         bottom: "50%",
    //         viewControl: {
    //           //3d效果可以放大、旋转等，请自己去查看官方配置
    //           alpha: 20,
    //           // beta: 40,
    //           rotateSensitivity: 1,
    //           zoomSensitivity: 1,
    //           panSensitivity: 0,
    //           autoRotate: true,
    //           //   autoRotateSpeed: 5,
    //           //   autoRotateAfterStill: 10
    //         },
    //       },
    //       series: series
    //     };
    //     return option;
    //   }

    //   // 传入数据生成 option
    //   // console.log(data)
    //   let option = getPie3D(data[1], 0.59);
    //   myChart.setOption(option);
    //   // 监听浏览器缩放，图表对象调用缩放resize函数
    //   window.addEventListener("resize", function () {
    //     myChart.resize();
    //   });
    // },
    dev9() {
      var myChart = echarts.init(document.querySelector(".stack2 .chart"));
      // 2.指定配置
      var option = {
        backgroundColor: 'rgba(255,255,255,1)',
        grid: {
          top: "20%",
          left: "5%",
          right: "5%",
          bottom: "10%",
          containLabel: true
        },
        legend: {
          name: '人次',
          right: 'center',
          top: '5%',
          textStyle: {
            color: "rgba(0,0,0,.6)"
          },
          data: ['人次', '同比增长']
        },
        tooltip: {
          trigger: 'axis',
        },
        toolbox: {
          show: true,
          right: '3%',
          feature: {
            myTool: {
              show: true,
              title: '工具拓展',
              //icon从阿里图标复制对应的svg格式代码
              icon: "path://M368.896 192H224a32 32 0 0 0-32 32v137.888a32 32 0 0 0 64 0V256h112.896a32 32 0 0 0 0-64zM784.864 192H640a32 32 0 1 0 0 64h112.864v105.888a32 32 0 1 0 64 0V224a32 32 0 0 0-32-32zM368.896 777.92H256V672a32 32 0 1 0-64 0v137.92a32 32 0 0 0 32 32h144.896a32 32 0 1 0 0-64zM784.864 640a32 32 0 0 0-32 32v105.92H640a32 32 0 1 0 0 64h144.864a32 32 0 0 0 32-32V672a32 32 0 0 0-32-32z",
              onclick: function () {
                //生成全屏显示的图表
                if (setFullScreenToolBox(option, '2018-2023年杭州人才摇号增速')) {
                  chartScreen
                } else { return false }
              }
            },
          }
        },
        xAxis: [
          {
            type: "category",
            // boundaryGap: true,
            // x轴更换数据
            data: this.name,
            // 文本颜色为rgba(0,0,0,.6)  文字大小为 12
            axisLabel: {
              color: "rgba(0,0,0,.6)",
              fontSize: 12
            },
            // x轴线的颜色为   rgba(0,0,0,.2)
            axisLine: {
              lineStyle: {
                color: "rgba(0,0,0,.2)"
              }
            },
            axisTick: {
              //x轴刻度相关设置
              alignWithLabel: false,
            },
          }
        ],
        yAxis: [{
          name: "人次",
          alignTicks: true,
          nameTextStyle: {
            color: "rgba(0,0,0,.6)",
            fontSize: 14
          },
          type: 'value',
          splitLine: {
            show: true,
            lineStyle: {
              color: "rgba(0,0,0,.1)"
            }
          },
          axisLabel: {
            show: true,
            margin: 20,
            color: "rgba(0,0,0,.6)",
          },
        },
        {
          type: 'value',
          nameTextStyle: {
            color: "rgba(0,0,0,.6)",
            fontSize: 14
          },
          axisLabel: {
            show: true,
            margin: 20,
            color: "rgba(0,0,0,.6)",
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: "rgba(0,0,0,.5)"
            }
          },
          name: '同比增长'
        }],
        series: [{
          name: '人次',
          yAxisIndex: 0,
          type: 'bar',
          itemStyle: {
            color: new echarts.graphic.LinearGradient(
              0, 1, 0, 0, [{
                offset: 0,
                color: '#2af598'
              }, {
                offset: 1,
                color: '#009efd'
              }]
            ),
            barBorderRadius: 8,
          },
          barWidth: '30%',
          label: {
            show: true,
            position: 'top',
            color: '#000',
            formatter: '{c}'
          },
          data: this.sums
        }, {
          name: '同比增长',
          yAxisIndex: 1,
          smooth: true,
          type: 'line',
          label: {
            show: true,
            position: 'top',
            color: '#000',
            formatter: '{c}%'
          },
          itemStyle: {
            normal: {
              lineStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: 'rgba(255, 227, 168, 0)',
                  },
                  {
                    offset: 0.5,
                    color: 'rgba(255, 227, 168, 1)',
                  },
                  {
                    offset: 1,
                    color: 'rgba(255, 227, 168, 0)',
                  },
                ]),
                shadowColor: 'rgba(255, 120, 0,1)',
                shadowBlur: 8,
              },
              areaStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: 'rgba(197, 106, 255, 0.8)',
                  },
                  {
                    offset: 0.8,
                    color: 'rgba(255, 120, 0, 0.1)',
                  },
                ]),
              },
            },
          },
          data: this.zzl
        }]

      }
      myChart.setOption(option);
      // 监听浏览器缩放，图表对象调用缩放resize函数
      window.addEventListener("resize", function () {
        myChart.resize();
      });
    },
    // 中1
    dev10() {
      var myChart = echarts.init(document.querySelector(".line3 .chart"));
      var color = ['#F9F00D', '#F9F07D', '#F9F0DD', '#493A00', '#F00AFD', '#F9F0FD']

      var option = {
        backgroundColor: 'rgba(255,255,255,1)',
        grid: {
          left: '9%',
          right: '10%',
          top: '20%',
          bottom: '15%',
          containLabel: true
        },
        tooltip: {
          show: true,
          trigger: 'item'
        },
        toolbox: {
          show: true,
          right: '3%',
          feature: {
            myTool: {
              show: true,
              title: '全屏显示',
              //icon从阿里图标复制对应的svg格式代码
              icon: "path://M368.896 192H224a32 32 0 0 0-32 32v137.888a32 32 0 0 0 64 0V256h112.896a32 32 0 0 0 0-64zM784.864 192H640a32 32 0 1 0 0 64h112.864v105.888a32 32 0 1 0 64 0V224a32 32 0 0 0-32-32zM368.896 777.92H256V672a32 32 0 1 0-64 0v137.92a32 32 0 0 0 32 32h144.896a32 32 0 1 0 0-64zM784.864 640a32 32 0 0 0-32 32v105.92H640a32 32 0 1 0 0 64h144.864a32 32 0 0 0 32-32V672a32 32 0 0 0-32-32z",
              onclick: function () {
                //生成全屏显示的图表
                if (setFullScreenToolBox(option, '2018-2023年累计净增购房人有无房情况')) {
                  // console.log(chartScreen)
                  myChart.hide()
                  chartScreen
                } else { return false }
              }
            },
          }
        },
        legend: {
          type: "scroll",
          show: true,
          x: 'center',
          top: '5%',
          y: '35',
          icon: 'stack',
          itemWidth: 10,
          itemHeight: 10,
          textStyle: {
            color: '#1bb4f6'
          },
          data: this.le
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            axisLabel: {
              color: '#000'
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: '#397cbc'
              }
            },
            axisTick: {
              show: false,
            },
            splitLine: {
              show: false,
              lineStyle: {
                color: '#195384'
              }
            },
            data: this.x1
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '人次',
            nameTextStyle: { color: '#000' },
            // min: 0,
            // max: 1000,
            axisLabel: {
              formatter: '{value}',
              textStyle: {
                color: '#000'
              }
            },
            axisLine: {
              lineStyle: {
                color: '#27b4c2'
              }
            },
            axisTick: {
              show: false,
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: '#11366e'
              }
            }
          },
          // {
          //   type: 'value',
          //   name: '占比',
          //   min: 0,
          //   max: 1000,
          //   axisLabel: {
          //     formatter: '{value} %',
          //     textStyle: {
          //       color: '#186afe'
          //     }
          //   },
          //   axisLine: {
          //     lineStyle: {
          //       color: '#186afe'
          //     }
          //   },
          //   axisTick: {
          //     show: false,
          //   },
          //   splitLine: {
          //     show: true,
          //     lineStyle: {
          //       color: '#11366e'
          //     }
          //   }
          // }
        ],
        series: [
          {
            name: '人才',
            type: 'line',
            stack: '总量',
            symbol: 'circle',
            symbolSize: 8,
            itemStyle: {
              color: '#0092f6',
              lineStyle: {
                color: "#0092f6",
                width: 1
              },
            },
            areaStyle: {
              //color: '#94C9EC'
              color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
                offset: 0,
                color: 'rgba(7,44,90,0.3)'
              }, {
                offset: 1,
                color: 'rgba(0,146,246,0.9)'
              }]),
            },
            markPoint: {
              itemStyle: {
                color: 'red'
              }
            },
            data: this.rencai
          },
          {
            name: '无房',
            type: 'line',
            stack: '总量',
            symbol: 'circle',
            symbolSize: 8,

            itemStyle: {
              color: '#00d4c7',
              lineStyle: {
                color: "#00d4c7",
                width: 1
              },
            },
            areaStyle: {
              //color: '#94C9EC'
              color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
                offset: 0,
                color: 'rgba(7,44,90,0.3)'
              }, {
                offset: 1,
                color: 'rgba(0,212,199,0.9)'
              }]),
            },
            data: this.wufang
          },
          {
            name: '有房',
            type: 'line',
            stack: '总量',
            symbol: 'circle',
            symbolSize: 8,
            itemStyle: {
              color: '#aecb56',
              lineStyle: {
                color: "#aecb56",
                width: 1
              },
            },
            areaStyle: {
              //color: '#94C9EC'
              color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
                offset: 0,
                color: 'rgba(7,44,90,0.3)'
              }, {
                offset: 1,
                color: 'rgba(114,144,89,0.9)'
              }]),
            },
            data: this.youfang
          }
        ]
      };
      myChart.setOption(option);
      // 监听浏览器缩放，图表对象调用缩放resize函数
      window.addEventListener("resize", function () {
        myChart.resize();
      });
    },
    // 中2
    dev11() {
      var myChart = echarts.init(document.querySelector(".bar3 .chart"));
      var option = {
        backgroundColor: 'rgba(255,255,255,1)',
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        toolbox: {
          show: true,
          right: '3%',
          feature: {
            myTool: {
              show: true,
              title: '全屏显示',
              //icon从阿里图标复制对应的svg格式代码
              icon: "path://M368.896 192H224a32 32 0 0 0-32 32v137.888a32 32 0 0 0 64 0V256h112.896a32 32 0 0 0 0-64zM784.864 192H640a32 32 0 1 0 0 64h112.864v105.888a32 32 0 1 0 64 0V224a32 32 0 0 0-32-32zM368.896 777.92H256V672a32 32 0 1 0-64 0v137.92a32 32 0 0 0 32 32h144.896a32 32 0 1 0 0-64zM784.864 640a32 32 0 0 0-32 32v105.92H640a32 32 0 1 0 0 64h144.864a32 32 0 0 0 32-32V672a32 32 0 0 0-32-32z",
              onclick: function () {
                //生成全屏显示的图表
                if (setFullScreenToolBox(option, '2018-2023年累计净增购房人有无房情况')) {
                  chartScreen
                } else { return false }
              }
            },
          }
        },
        grid: {
          left: '2%',
          right: '4%',
          bottom: '14%',
          top: '16%',
          containLabel: true
        },
        legend: {
          type: "scroll",
          data: this.le,
          right: 'center',
          top: '5%',
          textStyle: {
            color: "#000"
          },
          itemWidth: 12,
          itemHeight: 10,
          // itemGap: 35
        },
        xAxis: {
          type: 'category',
          data: this.x1,
          axisLine: {
            lineStyle: {
              color: 'white'

            }
          },
          axisLabel: {
            // interval: 0,
            // rotate: 40,
            textStyle: {
              fontFamily: 'Microsoft YaHei',
              color: "rgba(0,0,0,1)",
            }
          },
        },

        yAxis: {
          type: 'value',
          // max: '1200',
          axisLine: {
            show: false,
            lineStyle: {
              color: 'rgba(0,0,0,0.7)'
            }
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: 'rgba(0,0,0,0.3)'
            }
          },
          axisLabel: {}
        },
        "dataZoom": [{
          "show": true,
          "height": 12,
          "xAxisIndex": [
            0
          ],
          bottom: '8%',
          "start": 10,
          "end": 90,
          handleIcon: 'path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z',
          handleSize: '110%',
          handleStyle: {
            color: "#d3dee5",

          },
          textStyle: {
            color: "#000"
          },
          borderColor: "#90979c"
        }, {
          "type": "inside",
          "show": true,
          "height": 15,
          "start": 1,
          "end": 35
        }],
        series: [{
          name: '人才',
          type: 'bar',
          barWidth: '15%',
          itemStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: '#fccb05'
              }, {
                offset: 1,
                color: '#f5804d'
              }]),
              barBorderRadius: 12,
            },
          },
          data: this.rencai
        },
        {
          name: '无房',
          type: 'bar',
          barWidth: '15%',
          itemStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: '#8bd46e'
              }, {
                offset: 1,
                color: '#09bcb7'
              }]),
              barBorderRadius: 11,
            }

          },
          data: this.wufang
        },
        {
          name: '有房',
          type: 'bar',
          barWidth: '15%',
          itemStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: '#248ff7'
              }, {
                offset: 1,
                color: '#6851f1'
              }]),
              barBorderRadius: 11,
            }
          },
          data: this.youfang
        }]
      };
      myChart.setOption(option);
      // 监听浏览器缩放，图表对象调用缩放resize函数
      window.addEventListener("resize", function () {
        myChart.resize();
      });
    },
    // 中3
    dev12() {
      var myChart = echarts.init(document.querySelector(".bar3d .chart"));

      var option = {
        backgroundColor: 'rgba(255,255,255,1)',
        tooltip: {
          trigger: "axis",
          textStyle: { fontSize: '100%' },
          formatter: params => {
            let rander = params.map(item => item.seriesType !== "pictorialBar" ? `<div>${item.seriesName}: ${item.seriesType !== "line" ? item.value : item.value + "%"}</div>` : '').join('')
            return `
            <div>${params[0].axisValue}</div>
            ${rander}`
          }
        },
        toolbox: {
          show: true,
          right: '3%',
          feature: {
            myTool: {
              show: true,
              title: '全屏显示',
              //icon从阿里图标复制对应的svg格式代码
              icon: "path://M368.896 192H224a32 32 0 0 0-32 32v137.888a32 32 0 0 0 64 0V256h112.896a32 32 0 0 0 0-64zM784.864 192H640a32 32 0 1 0 0 64h112.864v105.888a32 32 0 1 0 64 0V224a32 32 0 0 0-32-32zM368.896 777.92H256V672a32 32 0 1 0-64 0v137.92a32 32 0 0 0 32 32h144.896a32 32 0 1 0 0-64zM784.864 640a32 32 0 0 0-32 32v105.92H640a32 32 0 1 0 0 64h144.864a32 32 0 0 0 32-32V672a32 32 0 0 0-32-32z",
              onclick: function () {
                //生成全屏显示的图表
                if (setFullScreenToolBox(option, '2018-2023年累计净增购房人有无房情况')) {
                  chartScreen
                } else { return false }
              }
            },
          }
        },
        legend: {
          type: "scroll",
          data: this.le,
          textStyle: { fontSize: 14, color: '#000' },
          itemWidth: 18,
          itemHeight: 12,
          itemGap: 10,
          bottom: '3%',
          selectedMode: false
        },
        grid: { top: '15%', left: '10%', right: '6%', bottom: '15%', containLabel: true },
        // xAxis
        xAxis: {
          axisTick: { show: true },
          axisLine: { lineStyle: { color: 'rgba(0,0,0, .2)' } },
          axisLabel: { textStyle: { fontSize: 12, color: '#000' }, },
          data: this.x1
        },

        // yAxis
        yAxis: [
          {
            name: '人次',
            axisTick: { show: false },
            axisLine: { show: false, },
            splitLine: { lineStyle: { color: 'rgba(0,0,0, .05)' } },
            axisLabel: { fontSize: 12, color: '#000' }
          }, {
            show: true,
            max: 100,
            splitLine: { show: false },
            axisLine: { show: false },
            axisTick: { show: false },
            axisLabel: {
              fontSize: 16,
              color: '#000',
              formatter: params => {
                return `${params}%`
              }
            }
          }],

        // series
        series: [{
          z: 1,
          name: '上部1',
          type: 'pictorialBar',
          symbolPosition: 'end',
          data: this.youfang,
          symbol: 'diamond',
          symbolOffset: ['-50%', '-50%'],
          symbolSize: ['20%', 8],
          itemStyle: {
            borderColor: '#2fffa4',
            color: '#2fffa4'
          },
        }, {
          z: 1,
          type: 'bar',
          name: '有房',
          barWidth: '15%',
          barGap: '-50%',
          data: this.youfang,
          itemStyle: {
            color: {
              type: 'linear',
              x: 0, x2: 1, y: 0, y2: 0,
              colorStops: [
                { offset: 0, color: 'rgba(29, 245, 160, 1)' },
                { offset: 0.5, color: 'rgba(29, 245, 160, 1)' },
                { offset: 0.5, color: 'rgba(29, 245, 160, .7)' },
                { offset: 1, color: 'rgba(29, 245, 160, .7)' }
              ]
            }
          },
        }, {
          z: 2,
          name: '上部1',
          type: 'pictorialBar',
          symbolPosition: 'end',
          data: this.wufang,
          symbol: 'diamond',
          symbolOffset: ['0%', '-50%'],
          symbolSize: ['20%', 8],
          itemStyle: {
            borderColor: '#32ffee',
            color: '#32ffee'
          },
        }, {
          z: 2,
          type: 'bar',
          name: '无房',
          barWidth: '15%',
          data: this.wufang,
          itemStyle: {
            color: {
              type: 'linear',
              x: 0, x2: 1, y: 0, y2: 0,
              colorStops: [
                { offset: 0, color: 'rgba(50, 255, 238, 1)' },
                { offset: 0.5, color: 'rgba(50, 255, 238, 1)' },
                { offset: 0.5, color: 'rgba(50, 255, 238, .7)' },
                { offset: 1, color: 'rgba(50, 255, 238, .7)' }
              ]
            }
          },
        }, {
          z: 3,
          name: '上部1',
          type: 'pictorialBar',
          symbolPosition: 'end',
          data: this.rencai,
          symbol: 'diamond',
          symbolOffset: ['50%', '-50%'],
          symbolSize: ['20%', 8],
          itemStyle: {
            borderColor: '#ffd11a',
            color: '#ffd11a'
          },
        }, {
          z: 3,
          type: 'bar',
          name: '人才',
          barWidth: '15%',
          data: this.rencai,
          itemStyle: {
            color: {
              type: 'linear',
              x: 0, x2: 1, y: 0, y2: 0,
              colorStops: [
                { offset: 0, color: 'rgba(255, 209, 26, 1)' },
                { offset: 0.5, color: 'rgba(255, 209, 26, 1)' },
                { offset: 0.5, color: 'rgba(255, 209, 26, .7)' },
                { offset: 1, color: 'rgba(255, 209, 26, .7)' }
              ]
            }
          },
        }]
      };
      myChart.setOption(option);
      // 监听浏览器缩放，图表对象调用缩放resize函数
      window.addEventListener("resize", function () {
        myChart.resize();
      });
    },
    // 中4
    dev13() {
      var myChart = echarts.init(document.querySelector(".pie3 .chart"));
      // var d1 = []; this.rencai.map((item, index) => { d1.push({ value: item, name: this.x1[index] }) })
      // var d2 = []; this.wufang.map((item, index) => { d2.push({ value: item, name: this.x1[index] }) })
      // var d3 = []; this.youfang.map((item, index) => { d3.push({ value: item, name: this.x1[index] }) })
      var series = [];
      [...this.x1].map((x, i) => {
        var p = [{ value: this.rencai[i], name: this.le[0] }, { value: this.wufang[i], name: this.le[1] }, { value: this.youfang[i], name: this.le[2] }]
        // console.log(p)
        series.push({
          name: x,
          type: 'pie',
          center: ['50%', '50%'],
          radius: [19 + i * 11 + '%', 13 + i * 11 + '%'],
          hoverAnimation: true,
          labelLine: {
            show: false,
            length: 30,
            length2: 55,
            emphasis: {
              show: false
            }
          },
          // roseType: 'area',
          zlevel: 10,
          label: {
            show: false,
            formatter: "{c}",
            color: "#000",
            fontSize: 12,
            position: 'inside',
            emphasis: {
              show: true
            }
          },
          data: p
        })
      })
      var option = {
        backgroundColor: "rgba(255,255,255,1)",
        color: ["#EAEA26", "#906BF9", "#FE5656", "#01E17E", "#3DD1F9", "#FFAD05"],
        grid: {
          top: '12%',
          bottom: '55%',
          left: "50%",
          containLabel: false
        },
        tooltip: {
          trigger: 'item',
          formatter: "{b} : {c} ({d}%)"
        },
        toolbox: {
          show: true,
          right: '3%',
          feature: {
            myTool: {
              show: true,
              title: '全屏显示',
              //icon从阿里图标复制对应的svg格式代码
              icon: "path://M368.896 192H224a32 32 0 0 0-32 32v137.888a32 32 0 0 0 64 0V256h112.896a32 32 0 0 0 0-64zM784.864 192H640a32 32 0 1 0 0 64h112.864v105.888a32 32 0 1 0 64 0V224a32 32 0 0 0-32-32zM368.896 777.92H256V672a32 32 0 1 0-64 0v137.92a32 32 0 0 0 32 32h144.896a32 32 0 1 0 0-64zM784.864 640a32 32 0 0 0-32 32v105.92H640a32 32 0 1 0 0 64h144.864a32 32 0 0 0 32-32V672a32 32 0 0 0-32-32z",
              onclick: function () {
                //生成全屏显示的图表
                if (setFullScreenToolBox(option, '2018-2023年累计净增购房人有无房情况')) {
                  chartScreen
                } else { return false }
              }
            },
          }
        },
        legend: [
          {
            // type: "scroll",
            // orient: "vartical",
            // x: "right",
            // top: "center",
            right: "center",
            bottom: "5%",
            itemWidth: 20,
            itemHeight: 12,
            itemGap: 16,
            textStyle: {
              color: '#000',
              fontSize: 15,
              fontWeight: 0
            },
            data: this.le
          },
          // {
          //   // type: "scroll",
          //   orient: "vartical",
          //   selectedMode:false,
          //   // x: "right",
          //   top: "center",
          //   right: "5%",
          //   // bottom: "5%",
          //   itemWidth: 20,
          //   itemHeight: 12,
          //   itemGap: 16,
          //   textStyle: {
          //     color: '#A3E2F4',
          //     fontSize: 15,
          //     fontWeight: 0
          //   },
          //   data: this.x1
          // },
        ],
        yAxis: [{
          type: 'category',
          inverse: false,
          zlevel: 11,
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            interval: 0,
            inside: false,
            textStyle: {
              color: "rgba(0,0,0,1)",
              fontSize: 14,
              // align:'center'
            },
            show: true
          },
          data: this.x1
        }],
        xAxis: [{
          show: false
        }],
        // polar: {
        //   center: ['50%', '50%'],
        //   radius: 100,
        // },
        // angleAxis: {
        //   interval: 1,
        //   type: 'category',
        //   data: [],
        //   z: 10,
        //   axisLine: {
        //     show: false,
        //     lineStyle: {
        //       color: "#0B4A6B",
        //       width: 1,
        //       type: "solid"
        //     },
        //   },
        //   axisLabel: {
        //     interval: 0,
        //     show: true,
        //     color: "#0B4A6B",
        //     margin: 8,
        //     fontSize: 16
        //   },
        // },
        // radiusAxis: {
        //   min: 40,
        //   max: 120,
        //   center: ['50%', '50%'],
        //   interval: 20,
        //   axisLine: {
        //     show: false,
        //     lineStyle: {
        //       color: "#0B3E5E",
        //       width: 1,
        //       type: "solid"
        //     },
        //   },
        //   axisLabel: {
        //     formatter: '{value} %',
        //     show: false,
        //     padding: [0, 0, 20, 0],
        //     color: "#0B3E5E",
        //     fontSize: 16
        //   },
        //   splitLine: {
        //     lineStyle: {
        //       color: "#0B3E5E",
        //       width: 2,
        //       type: "solid"
        //     }
        //   }
        // },
        calculable: true,
        series: series
      };
      myChart.setOption(option);
      // 监听浏览器缩放，图表对象调用缩放resize函数
      window.addEventListener("resize", function () {
        myChart.resize();
      });
    },
    // 中5
    dev14() {
      var myChart = echarts.init(document.querySelector(".scatter3 .chart"));
      var option = {
        backgroundColor: 'rgba(255,255,255,1)',
        legend: {
          top: '10%',
          textStyle: {
            color: '#a4a8b4'
          },
        },
        toolbox: {
          show: true,
          right: '3%',
          feature: {
            myTool: {
              show: true,
              title: '全屏显示',
              //icon从阿里图标复制对应的svg格式代码
              icon: "path://M368.896 192H224a32 32 0 0 0-32 32v137.888a32 32 0 0 0 64 0V256h112.896a32 32 0 0 0 0-64zM784.864 192H640a32 32 0 1 0 0 64h112.864v105.888a32 32 0 1 0 64 0V224a32 32 0 0 0-32-32zM368.896 777.92H256V672a32 32 0 1 0-64 0v137.92a32 32 0 0 0 32 32h144.896a32 32 0 1 0 0-64zM784.864 640a32 32 0 0 0-32 32v105.92H640a32 32 0 1 0 0 64h144.864a32 32 0 0 0 32-32V672a32 32 0 0 0-32-32z",
              onclick: function () {
                //生成全屏显示的图表
                if (setFullScreenToolBox(option, '2018-2023年累计净增购房人有无房情况')) {
                  chartScreen
                } else { return false }
              }
            },
          }
        },
        grid: {
          left: '3%',
          top: '20%',
          right: '8%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'value',
          max: 100,
          splitLine: {
            lineStyle: {
              color: 'rgba(0,0,0,0.3)'
            }
          },
          axisTick: {
            show: false
          },
          axisLine: {
            show: false
          },
          axisLabel: {
            // margin: 10,
            color: '#a4a8b4',
          }
        },
        yAxis: {
          type: 'category',
          data: this.x1,
          axisLine: {
            lineStyle: {
              color: 'rgba(0,0,0,0.3)'
            }
          },
          splitLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            // margin: 10,
            color: '#a4a8b4',
          }
        },
        color: [
          new echarts.graphic.LinearGradient(1, 0, 0, 0, [{
            offset: 0,
            color: 'rgba(235,112,236,.8)'
          },
          {
            offset: 0.8,
            color: 'rgba(77,75,221,.8)'
          },
          {
            offset: 1,
            color: 'rgba(77,75,221,0)'
          }
          ]),
          new echarts.graphic.LinearGradient(1, 0, 0, 0, [{
            offset: 0,
            color: 'rgba(255,157,96,.8)'
          },
          {
            offset: 0.8,
            color: 'rgba(246,84,157,.8)'
          },
          {
            offset: 1,
            color: 'rgba(246,84,157,0)'
          }
          ]),
          new echarts.graphic.LinearGradient(1, 0, 0, 0, [{
            offset: 0,
            color: 'rgba(132,225,145,.8)'
          },
          {
            offset: 0.8,
            color: 'rgba(106,185,242,.8)'
          },
          {
            offset: 1,
            color: 'rgba(106,185,242,0)'
          }
          ]),
        ],
        series: [{
          name: '',
          type: 'bar',
          xAxisIndex: 0, //使用的 x 轴的 index，在单个图表实例中存在多个 x 轴的时候有用。
          yAxisIndex: 0, //使用的 y 轴的 index，在单个图表实例中存在多个 y轴的时候有用。
          data: [...this.Prencai].map(x => 100),
          barWidth: 5,
          itemStyle: {
            color: 'rgba(255, 255, 255, .1)',
          },
          z: 1
        },
        {
          name: '人才',
          type: 'bar',
          stack: 'Tik Tok',
          barWidth: '35%',
          itemStyle: {
            shadowColor: '#000',
            shadowBlur: 10,
            shadowOffsetY: 0,
            shadowOffsetX: 0,
            borderColor: new echarts.graphic.LinearGradient(1, 0, 0, 0, [{
              offset: 0,
              color: 'rgba(240,82,255,1)'
            },
            {
              offset: 0.8,
              color: 'rgba(77,75,221,1)'
            },
            {
              offset: 1,
              color: 'rgba(77,75,221,0)'
            }
            ],
              false
            ),
            borderWidth: 1,
          },
          label: {
            show: true,
            position: 'right',
            offset: [20, 0],
            formatter: '{c}%',
            align: 'center',
            baseline: 'middle',
            fontSize: 14,
            fontWeight: '400',
            color: '#000',
            textShadowColor: '#000',
            textShadowBlur: '0',
            textShadowOffsetX: 1,
            textShadowOffsetY: 1,
          },
          data: this.Prencai
        },
        {
          name: '无房',
          type: 'bar',
          stack: 'Tik Tok',
          barWidth: '35%',
          itemStyle: {
            shadowColor: '#000',
            shadowBlur: 10,
            shadowOffsetY: 0,
            shadowOffsetX: 0,
            borderColor: new echarts.graphic.LinearGradient(1, 0, 0, 0, [{
              offset: 0,
              color: 'rgba(255,151,60,.8)'
            },
            {
              offset: 0.8,
              color: 'rgba(246,84,157,.8)'
            },
            {
              offset: 1,
              color: 'rgba(246,84,157,0)'
            }
            ],
              false
            ),
            borderWidth: 1,
          },
          label: {
            show: true,
            position: 'right',
            offset: [20, 0],
            formatter: '{c}%',
            align: 'center',
            baseline: 'middle',
            fontSize: 14,
            fontWeight: '400',
            color: '#000',
            textShadowColor: '#000',
            textShadowBlur: '0',
            textShadowOffsetX: 1,
            textShadowOffsetY: 1,
          },
          data: this.Pwufang
        },
        {
          name: '有房',
          type: 'bar',
          stack: 'Tik Tok',
          barWidth: '35%',
          itemStyle: {
            shadowColor: '#000',
            shadowBlur: 10,
            shadowOffsetY: 0,
            shadowOffsetX: 0,
            borderColor: new echarts.graphic.LinearGradient(1, 0, 0, 0, [{
              offset: 0,
              color: 'rgba(102,255,124,.8)'
            },
            {
              offset: 0.8,
              color: 'rgba(106,185,242,.8)'
            },
            {
              offset: 1,
              color: 'rgba(106,185,242,0)'
            }
            ],
              false
            ),
            borderWidth: 1,
          },
          label: {
            show: true,
            position: 'right',
            offset: [20, 0],
            formatter: '{c}%',
            align: 'center',
            baseline: 'middle',
            fontSize: 14,
            fontWeight: '400',
            color: '#000',
            textShadowColor: '#000',
            textShadowBlur: '0',
            textShadowOffsetX: 1,
            textShadowOffsetY: 1,
          },
          data: this.Pyoufang
        },
        {
          name: '',
          type: 'bar',
          data: [...this.Prencai].map(x => 100),
          barWidth: 10,
          itemStyle: {
            color: 'rgba(255, 255, 255, .1)',
          },
          z: 1
        },
        ]
      };
      myChart.setOption(option);
      // 监听浏览器缩放，图表对象调用缩放resize函数
      window.addEventListener("resize", function () {
        myChart.resize();
      });
    },
  }
};
</script>

<style scoped>
@import '../css/VisualReports2.css';
</style>
