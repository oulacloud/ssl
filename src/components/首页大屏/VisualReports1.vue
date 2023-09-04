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
      <!-- <el-popover placement="bottom" v-model="line_set_visible">
        <el-form :inline="true" label-width="70px">
          <el-form-item label="颜色：">
            <div class="line_set_el">
              <el-input v-model="line_color" :placeholder="placeholder" @change="AMapUI_DistrictExplorer()"
                :disabled="slider_set_use">
              </el-input>
              <el-color-picker @change="AMapUI_DistrictExplorer()" v-model="line_color" :predefine="predefineColors"
                :disabled="slider_set_use">
              </el-color-picker>
            </div>
          </el-form-item>
          <el-form-item label="宽度：">
            <div class="line_set_el">
              <el-slider :step="0.1" :max="5" v-model="line_weight" show-input :show-tooltip="false"
                :disabled="slider_set_use" :show-input-controls="false" :debounce="0" @change="AMapUI_DistrictExplorer()">
              </el-slider>
            </div>
          </el-form-item>
          <el-form-item label="透明度：">
            <div class="line_set_el">
              <el-slider :step="0.1" :max="1" :show-input-controls="false" :show-tooltip="false" v-model="line_opacity"
                show-input :disabled="slider_set_use" :debounce="0" @change="AMapUI_DistrictExplorer()">
              </el-slider>
            </div>
          </el-form-item>
        </el-form>
        <el-button slot="reference">线条修改</el-button>
      </el-popover> -->
      <h1 id="view">可视化</h1>
      <el-button id="btn" @click="toggleActive()" type="primary" round>工具箱</el-button>
      <div class="showTime">{{ times }}</div>
    </header>
    <!-- 主体部分 -->
    <section class="mainbox">
      <!-- 左 -->
      <div class="column">
        <div v-loading="loading" element-loading-background="rgba(0, 0, 0, 0)" class="panel bar">
          <h2>2018-2023年摇号人次</h2>
          <div class="chart"></div>
          <div class="panel-footer"></div>
        </div>
        <div class="panel line">
          <h2>2018-2023年摇号人次
            <!-- <a href="javacript:;">2020</a>
            <a href="javascript:;">2021</a> -->
          </h2>
          <div class="chart">图表</div>
          <div class="panel-footer"></div>
        </div>
        <div class="panel pie">
          <h2>2018-2023年摇号人次</h2>
          <div class="chart">图表</div>
          <div class="panel-footer"></div>
        </div>
        <div class="panel Radar">
          <h2>2018-2023年摇号人次</h2>
          <div class="chart">图表</div>
          <div class="panel-footer"></div>
        </div>
        <div class="panel Bar">
          <h2>2018-2023年摇号人次</h2>
          <div class="chart">图表</div>
          <div class="panel-footer"></div>
        </div>
      </div>
      <!-- 中 -->
      <div class="column">
        <div v-loading="loading" element-loading-background="rgba(0, 0, 0, 0)" class="panel line3">
          <h2>摇号不同距离数量分布情况</h2>
          <div class="chart"></div>
          <div class="panel-footer"></div>
        </div>
        <div class="panel bar3">
          <h2>摇号不同距离数量分布情况
            <a href="javacript:;"></a>
            <a href="javascript:;"></a>
          </h2>
          <div class="chart">图表</div>
          <div class="panel-footer"></div>
        </div>
        <div class="panel bar3d">
          <h2>摇号不同距离数量分布情况</h2>
          <div class="chart">图表</div>
          <div class="panel-footer"></div>
        </div>
        <div class="panel pie3">
          <h2>摇号不同距离数量分布情况</h2>
          <div class="chart">图表</div>
          <div class="panel-footer"></div>
        </div>
        <div class="panel scatter3">
          <h2>摇号不同距离数量分布情况</h2>
          <div class="chart">图表</div>
          <div class="panel-footer"></div>
        </div>
      </div>
      <!-- 右 -->
      <div class="column">
        <div class="panel line2">
          <h2>浙江省男女户数-登记人出生城市</h2>
          <div class="chart">图表</div>
          <div class="panel-footer"></div>
        </div>
        <div class="panel radar2">
          <h2>浙江省男女户数-登记人出生城市</h2>
          <div class="chart">图表</div>
          <div class="panel-footer"></div>
        </div>
        <div class="panel bar2">
          <h2>浙江省男女户数-登记人出生城市</h2>
          <div class="chart">图表</div>
          <div class="panel-footer"></div>
        </div>
        <div class="panel linebar2">
          <h2>浙江省男女户数-登记人出生城市</h2>
          <div class="chart">图表</div>
          <div class="panel-footer"></div>
        </div>
        <div class="panel stack2">
          <h2>浙江省男女户数-登记人出生城市</h2>
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
import china from '../map/json/china.json'

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
  console.log($(this).children());
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
        color: '#ffff'
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
  data() {
    return {
      x: [],
      y: [],
      yearData: [],
      backgroundColor: "",
      fontSize: 20,
      color: "",
      slider_set_use: false,
      times: '',//格式化之后的当前时间
      tip: ['杭州市', '温州市', '金华市', '绍兴市', '衢州市', '台州市', '湖州市', '宁波市', '嘉兴市', '丽水市', '舟山市'],
      boy: [155425, 28884, 21014, 15715, 13605, 10129, 6449, 6582, 5315, 4078, 1753],
      girl: [132845, 22998, 17700, 13813, 11701, 8462, 6355, 5666, 5523, 3876, 1628],
      sum1: [288270, 51882, 38714, 29528, 25306, 18591, 12804, 12248, 10838, 7954, 3381],
      distant1: [6, 5, 6, 16, 2, 8, 4, 7, 16, 9, 7, 15, 16, 33, 33, 4, 19, 1, 9, 5, 8, 8],
      distant2: [99, 79, 83, 118, 86, 145, 67, 64, 118, 63, 100, 41, 34, 100, 94, 13, 26, 137, 138, 87, 138, 86],
      distant3: [631, 652, 647, 602, 648, 583, 665, 665, 602, 664, 629, 680, 686, 603, 609, 719, 691, 598, 589, 644, 590, 642],
      gs: ['滨江新区', '西溪区', '云谷区', '体育中心', 'Z空间', '商务广场', '科技广场', '创新园', '安恒公司', '师范大学',
        '肿瘤医院', '爱力中心', '森马电商', '湾信息港', '经开区', '指挥部', '智能小镇', '移动大厦', '国际大厦', '移动研发', '移动大厦', '网管中心'],
      loading: true,
      isActive: false,
      num: 0
    };
  },
  created() {
    vm = this
    this.getData() //获取摇号数据
  },
  // beforeMount(){this.getData()},
  mounted() {
    echarts.registerMap("china", { geoJSON: china })
    this.initWatermark()
    // 获取时间
    this.getTimes()
    setTimeout(() => {
      this.dev0(this.x, this.y);
      this.dev1(this.x, this.y);
      this.dev2(this.x, this.y);
      this.dev3();
      this.dev4(this.yearData);
      this.dev5(this.y);
      this.dev6();
      this.dev7();
      this.dev8();
      this.dev9();
      this.dev10();
      this.dev11();
      this.dev12();
      this.dev13();
      this.dev14();
    }, 1000);
  },
  // 在Vue实例销毁前，清除定时器
  beforeDestroy() {
    if (this.times) {
      clearInterval(this.getTimesInterval);
    }
  },
  methods: {
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
      // ctx.fillStyle = 'rgba(0,0,0,.3)'; // 颜色
      // ctx.fillText('数视灵', canvas.width / 6, canvas.height / 2);// 设置显示文字和偏移量

      //创建虚心水印
      ctx.strokeStyle = 'rgba(0,0,0,.6)';
      ctx.strokeText('数视灵', canvas.width / 6, canvas.height / 2);

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
      axios.get("http://sslapi.nadibao.cn/api/HzYaoHaoData/GetHZ_YAOHAO_PEOPLE_NUM")
        .then(res => {
          for (var i = 0; i < res.data.data.length; i++) {
            this.x[i] = res.data.data[i].NAME
            this.y[i] = parseFloat((res.data.data[i].NUM1 / 10000).toFixed(2))
            // this.y2[i] = parseFloat((res.data.data[i].NUM2 / 10000).toFixed(2))
            // this.rate[i] = parseFloat((res.data.data[i].RATE).toFixed(2))
            this.yearData.push({ value: res.data.data[i].NUM1, name: res.data.data[i].NAME })
          }
          // console.log(this.y)
        }).then(() => this.dev0)
    },
    // 左1柱状
    dev0(x, y) {
      var myChart = echarts.init(document.querySelector(".bar .chart"));
      // 2. 指定配置项和数据
      var option = {
        color: ["#2f89cf"],
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        tooltip: {
          trigger: 'item',
        },
        toolbox: {
          show: true,
          right: '10%',
          feature: {
            myTool: {
              show: true,
              title: '全屏显示',
              //icon从阿里图标复制对应的svg格式代码
              icon: "path://M368.896 192H224a32 32 0 0 0-32 32v137.888a32 32 0 0 0 64 0V256h112.896a32 32 0 0 0 0-64zM784.864 192H640a32 32 0 1 0 0 64h112.864v105.888a32 32 0 1 0 64 0V224a32 32 0 0 0-32-32zM368.896 777.92H256V672a32 32 0 1 0-64 0v137.92a32 32 0 0 0 32 32h144.896a32 32 0 1 0 0-64zM784.864 640a32 32 0 0 0-32 32v105.92H640a32 32 0 1 0 0 64h144.864a32 32 0 0 0 32-32V672a32 32 0 0 0-32-32z",
              onclick: function () {
                //生成全屏显示的图表
                if (setFullScreenToolBox(option, '摇号不同距离数量分布情况')) {
                  chartScreen
                } else { return false }
              }
            },
          }
        },
        // 修改图表的大小
        grid: {
          left: 0,
          top: 10,
          right: 5,
          bottom: 5,
          containLabel: true
        },
        "xAxis": [
          {
            type: "category",
            "data": x,
            axisTick: {
              alignWithLabel: true
            },
            // 修改刻度标签 相关样式
            axisLabel: {
              color: "rgba(255,255,255,.6) ",
              fontSize: 12
            },
            // 不显示x坐标轴的样式
            axisLine: {
              show: false
            }
          }
        ],
        yAxis: [
          {
            type: "value",
            interval: 100000,
            // 修改刻度标签 相关样式
            axisLabel: {
              color: "rgba(255,255,255,.6) ",
              fontSize: 12
            },
            // y轴的线条改为了 2像素
            axisLine: {
              lineStyle: {
                color: "rgba(255,255,255,.1)",
                width: 2
              }
            },
            // y轴分割线的颜色
            splitLine: {
              lineStyle: {
                color: "rgba(255,255,255,.1)"
              }
            }
          }
        ],
        series: [{
          "name": "",
          "type": "pictorialBar",
          symbol: 'path://M214,1079l8-6h16l8,6-8,6H222Z',
          "symbolSize": ['65%', 13],
          "symbolOffset": [0, 7],
          "z": 1,
          itemStyle: {
            opacity: 1,
            color: function (params) {
              var colorList = [
                new echarts.graphic.LinearGradient(1, 0, 0, 0, [{
                  offset: 0,
                  color: '#fe3636',
                },
                {
                  offset: .3,
                  color: '#fe3636'
                },
                {
                  offset: .3,
                  color: '#ff4546'
                },
                {
                  offset: .5,
                  color: '#ff4546'
                },
                {
                  offset: .7,
                  color: '#ff4546'
                },
                {
                  offset: .7,
                  color: '#ff8584'
                },
                {
                  offset: 1,
                  color: '#ff8584'
                }
                ]),
                new echarts.graphic.LinearGradient(1, 0, 0, 0, [{
                  offset: 0,
                  color: '#ffb200',
                },
                {
                  offset: .3,
                  color: '#ffb200'
                },
                {
                  offset: .3,
                  color: '#fec200'
                },
                {
                  offset: .5,
                  color: '#fec200'
                },
                {
                  offset: .7,
                  color: '#fec200'
                },
                {
                  offset: .7,
                  color: '#ffdb17'
                },
                {
                  offset: 1,
                  color: '#ffdb17'
                }
                ]),
                new echarts.graphic.LinearGradient(1, 0, 0, 0, [{
                  offset: 0,
                  color: '#df7100',
                },
                {
                  offset: .3,
                  color: '#df7100'
                },
                {
                  offset: .3,
                  color: '#fd8c00'
                },
                {
                  offset: .5,
                  color: '#fd8c00'
                },
                {
                  offset: .7,
                  color: '#fd8c00'
                },
                {
                  offset: .7,
                  color: '#ff9a00'
                },
                {
                  offset: 1,
                  color: '#ff9a00'
                }
                ]),
                new echarts.graphic.LinearGradient(1, 0, 0, 0, [{
                  offset: 0,
                  color: '#b0b513',
                },
                {
                  offset: .3,
                  color: '#b0b513'
                },
                {
                  offset: .3,
                  color: '#bec81a'
                },
                {
                  offset: .5,
                  color: '#bec81a'
                },
                {
                  offset: .7,
                  color: '#bec81a'
                },
                {
                  offset: .7,
                  color: '#dcdc3c'
                },
                {
                  offset: 1,
                  color: '#dcdc3c'
                }
                ]),
                new echarts.graphic.LinearGradient(1, 0, 0, 0, [{
                  offset: 0,
                  color: '#0078e6',
                },
                {
                  offset: .3,
                  color: '#0078e6'
                },
                {
                  offset: .3,
                  color: '#1593f7'
                },
                {
                  offset: .5,
                  color: '#1593f7'
                },
                {
                  offset: .7,
                  color: '#1593f7'
                },
                {
                  offset: .7,
                  color: '#4daeff'
                },
                {
                  offset: 1,
                  color: '#4daeff'
                }
                ]),
                new echarts.graphic.LinearGradient(1, 0, 0, 0, [{
                  offset: 0,
                  color: '#8906aa',
                },
                {
                  offset: .3,
                  color: '#8906aa'
                },
                {
                  offset: .3,
                  color: '#a11cb6'
                },
                {
                  offset: .5,
                  color: '#a11cb6'
                },
                {
                  offset: .7,
                  color: '#a11cb6'
                },
                {
                  offset: .7,
                  color: '#b030cb'
                },
                {
                  offset: 1,
                  color: '#b030cb'
                }
                ]),
              ];
              return colorList[params.dataIndex]
            },
            shadowColor: 'rgba(115, 106, 28, .7)',
            shadowBlur: 3,
            shadowOffsetX: 0,
            shadowOffsetY: 2
          },
          "data": [1, 1, 1, 1, 1, 1]
        },
        {
          type: 'bar',
          symbol: 'path://M214,1079l8-6h16l8,6-8,6H222Z',
          barWidth: '50%',
          barGap: '-100%',
          "z": 10,
          itemStyle: {
            color: function (params) {
              var colorList = [
                new echarts.graphic.LinearGradient(1, 0, 0, 0, [{
                  offset: 0,
                  color: '#fe3636',
                },
                {
                  offset: .3,
                  color: '#fe3636'
                },
                {
                  offset: .3,
                  color: '#ff4546'
                },
                {
                  offset: .5,
                  color: '#ff4546'
                },
                {
                  offset: .7,
                  color: '#ff4546'
                },
                {
                  offset: .7,
                  color: '#ff8584'
                },
                {
                  offset: 1,
                  color: '#ff8584'
                }
                ]),
                new echarts.graphic.LinearGradient(1, 0, 0, 0, [{
                  offset: 0,
                  color: '#ffb200',
                },
                {
                  offset: .3,
                  color: '#ffb200'
                },
                {
                  offset: .3,
                  color: '#fec200'
                },
                {
                  offset: .5,
                  color: '#fec200'
                },
                {
                  offset: .7,
                  color: '#fec200'
                },
                {
                  offset: .7,
                  color: '#ffdb17'
                },
                {
                  offset: 1,
                  color: '#ffdb17'
                }
                ]),
                new echarts.graphic.LinearGradient(1, 0, 0, 0, [{
                  offset: 0,
                  color: '#df7100',
                },
                {
                  offset: .3,
                  color: '#df7100'
                },
                {
                  offset: .3,
                  color: '#fd8c00'
                },
                {
                  offset: .5,
                  color: '#fd8c00'
                },
                {
                  offset: .7,
                  color: '#fd8c00'
                },
                {
                  offset: .7,
                  color: '#ff9a00'
                },
                {
                  offset: 1,
                  color: '#ff9a00'
                }
                ]),
                new echarts.graphic.LinearGradient(1, 0, 0, 0, [{
                  offset: 0,
                  color: '#b0b513',
                },
                {
                  offset: .3,
                  color: '#b0b513'
                },
                {
                  offset: .3,
                  color: '#bec81a'
                },
                {
                  offset: .5,
                  color: '#bec81a'
                },
                {
                  offset: .7,
                  color: '#bec81a'
                },
                {
                  offset: .7,
                  color: '#dcdc3c'
                },
                {
                  offset: 1,
                  color: '#dcdc3c'
                }
                ]),
                new echarts.graphic.LinearGradient(1, 0, 0, 0, [{
                  offset: 0,
                  color: '#0078e6',
                },
                {
                  offset: .3,
                  color: '#0078e6'
                },
                {
                  offset: .3,
                  color: '#1593f7'
                },
                {
                  offset: .5,
                  color: '#1593f7'
                },
                {
                  offset: .7,
                  color: '#1593f7'
                },
                {
                  offset: .7,
                  color: '#4daeff'
                },
                {
                  offset: 1,
                  color: '#4daeff'
                }
                ]),
                new echarts.graphic.LinearGradient(1, 0, 0, 0, [{
                  offset: 0,
                  color: '#8906aa',
                },
                {
                  offset: .3,
                  color: '#8906aa'
                },
                {
                  offset: .3,
                  color: '#a11cb6'
                },
                {
                  offset: .5,
                  color: '#a11cb6'
                },
                {
                  offset: .7,
                  color: '#a11cb6'
                },
                {
                  offset: .7,
                  color: '#b030cb'
                },
                {
                  offset: 1,
                  color: '#b030cb'
                }
                ]),
              ];
              return colorList[params.dataIndex]
            },
          },
          data: y
        },
        {
          "name": "",
          "type": "pictorialBar",
          "symbolSize": ['50%', 13],
          "symbolOffset": [0, -7],
          "z": 15,
          label: {
            show: true,
            formatter: "{c}",
            position: 'top',
            distance: 2,
            color: '#FFF',
            fontFamily: 'FZYaoti',
            fontWeight: 100,
            textShadowColor: 'rgba(0, 0, 0, .6)',
            fontSize: 14,
            textShadowBlur: '0',
            textShadowOffsetX: 1,
            textShadowOffsetY: 1,
          },
          itemStyle: {
            opacity: 1,
            color: function (params) {
              var colorList = [
                '#fe3636', '#ffb200', '#df7100', '#b0b513', '#0078e6', '#8906aa'
              ];
              return colorList[params.dataIndex]
            },
          },
          "symbolPosition": "end",
          "data": y
        },
        {
          "name": "",
          "type": "pictorialBar",
          symbol: 'path://M214,1079l8-6h16l8,6-8,6H222Z',
          "symbolSize": ['65%', 15],
          "symbolOffset": [0, -8],
          "z": 12,
          itemStyle: {
            opacity: 1,
            color: function (params) {
              var colorList = [
                '#ffa1a1', '#fee253', '#ffa930', '#e4df4f', '#7bc6ff', '#c24ee5'
              ];
              return colorList[params.dataIndex]
            },
          },
          "symbolPosition": "end",
          "data": y
        },
        ]
      };
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
    // 左5柱状
    // dev1(x, y) {
    //   axios.get("http://sslapi.nadibao.cn/api/HzYaoHaoData/GetHZYaoHaoRegDataByYear")
    //     .then(res => {
    //       for (var i = 0; i < res.data.data.length; i++) {
    //         this.year[i] = res.data.data[i].NAME
    //         this.yeardata[i] = res.data.data[i].NUM
    //       }
    //       var myColor = ["#1089E7", "#F57474", "#56D0E3", "#F8B448", "#8B78F6", "#8B00F6"];
    //       // 1. 实例化对象
    //       var myChart = echarts.init(document.querySelector(".Bar .chart"));
    //       // 2. 指定配置和数据
    //       var option = {
    //         grid: {
    //           top: "10%",
    //           left: "22%",
    //           bottom: "10%"
    //           // containLabel: true
    //         },
    //         // 不显示x轴的相关信息
    //         xAxis: {
    //           show: false
    //         },
    //         yAxis: [
    //           {
    //             type: "category",
    //             inverse: true,
    //             data: x,
    //             // 不显示y轴的线
    //             axisLine: {
    //               show: false
    //             },
    //             // 不显示刻度
    //             axisTick: {
    //               show: false
    //             },
    //             // 把刻度标签里面的文字颜色设置为白色
    //             axisLabel: {
    //               color: "#fff"
    //             }
    //           },
    //           {
    //             data: y,
    //             show: false,
    //             inverse: true,
    //             // 不显示y轴的线
    //             axisLine: {
    //               show: false
    //             },
    //             // 不显示刻度
    //             axisTick: {
    //               show: false
    //             },
    //             // 把刻度标签里面的文字颜色设置为白色
    //             axisLabel: {
    //               color: "#fff"
    //             }
    //           }
    //         ],
    //         series: [
    //           {
    //             name: "条",
    //             type: "bar",
    //             data: y,
    //             textStyle: {
    //               fontSize: '10px'
    //             },
    //             yAxisIndex: 0,
    //             // 修改第一组柱子的圆角
    //             itemStyle: {
    //               borderRadius: 20,
    //               // 此时的color 可以修改柱子的颜色
    //               color: function (params) {
    //                 // params 传进来的是柱子对象
    //                 // console.log(params);
    //                 // dataIndex 是当前柱子的索引号
    //                 return myColor[params.dataIndex];
    //               },
    //               fontSize: '10px'
    //             },
    //             // 柱子之间的距离
    //             barCategoryGap: 50,
    //             //柱子的宽度
    //             barWidth: 10,
    //             // 显示柱子内的文字
    //             label: {
    //               show: true,
    //               color: '#fff',
    //               position: "right",
    //               // {c} 会自动的解析为 数据  data里面的数据
    //               // formatter: "{c}%"
    //             }
    //           },
    //           {
    //             name: "框",
    //             type: "bar",
    //             barCategoryGap: 50,
    //             barWidth: 15,
    //             yAxisIndex: 1,
    //             data: [800000, 800000, 800000, 800000, 800000, 800000],
    //             itemStyle: {
    //               color: "none",
    //               borderColor: "#00c1de",
    //               borderWidth: 3,
    //               borderRadius: 15
    //             }
    //           }
    //         ]
    //       };

    //       // 3. 把配置给实例对象
    //       myChart.setOption(option);
    //       // 4. 让图表跟随屏幕自动的去适应
    //       window.addEventListener("resize", function () {
    //         myChart.resize();
    //       });
    //     })
    // },
    dev1(x, y) {
      var myColor = ["#1089E7", "#F57474", "#56D0E3", "#F8B448", "#8B78F6", "#8B00F6"];
      // 1. 实例化对象
      var myChart = echarts.init(document.querySelector(".Bar .chart"));
      // 2. 指定配置和数据
      var option = {
        grid: {
          top: "10%",
          left: "22%",
          bottom: "10%"
          // containLabel: true
        },
        // 不显示x轴的相关信息
        xAxis: {
          show: false
        },
        yAxis: [
          {
            type: "category",
            inverse: true,
            data: x,
            // 不显示y轴的线
            axisLine: {
              show: false
            },
            // 不显示刻度
            axisTick: {
              show: false
            },
            // 把刻度标签里面的文字颜色设置为白色
            axisLabel: {
              color: "#fff"
            }
          },
          {
            data: y,
            show: false,
            inverse: true,
            // 不显示y轴的线
            axisLine: {
              show: false
            },
            // 不显示刻度
            axisTick: {
              show: false
            },
            // 把刻度标签里面的文字颜色设置为白色
            axisLabel: {
              color: "#fff"
            }
          }
        ],
        series: [
          {
            name: "条",
            type: "bar",
            data: y,
            textStyle: {
              fontSize: '10px'
            },
            yAxisIndex: 0,
            // 修改第一组柱子的圆角
            itemStyle: {
              borderRadius: 20,
              // 此时的color 可以修改柱子的颜色
              color: function (params) {
                // params 传进来的是柱子对象
                // console.log(params);
                // dataIndex 是当前柱子的索引号
                return myColor[params.dataIndex];
              },
              fontSize: '10px'
            },
            // 柱子之间的距离
            barCategoryGap: 50,
            //柱子的宽度
            barWidth: 10,
            // 显示柱子内的文字
            label: {
              show: true,
              color: '#fff',
              position: "right",
              // {c} 会自动的解析为 数据  data里面的数据
              formatter: "{c}(万人次)"
            }
          },
          {
            name: "框",
            type: "bar",
            barCategoryGap: 50,
            barWidth: 15,
            yAxisIndex: 1,
            data: [80, 80, 80, 80, 80, 80],
            itemStyle: {
              color: "none",
              borderColor: "#00c1de",
              borderWidth: 3,
              borderRadius: 15
            }
          }
        ]
      };

      // 3. 把配置给实例对象
      myChart.setOption(option);
      // 4. 让图表跟随屏幕自动的去适应
      window.addEventListener("resize", function () {
        myChart.resize();
      });
    },
    // 左2折线
    dev2(x, y) {
      // axios.get("http://sslapi.nadibao.cn/api/HzYaoHaoData/GetHZYaoHaoRegDataByYear")
      //   .then(res => {
      //     for (var i = 0; i < res.data.data.length; i++) {
      //       this.year1[i] = res.data.data[i].NAME
      //       this.yeardata1[i] = res.data.data[i].NUM
      //     }
      // 1. 实例化对象
      var myChart = echarts.init(document.querySelector(".line .chart"));
      // 2.指定配置
      var option = {
        grid: {
          top: "15%",
          left: "15%",
          bottom: "10%"
          // containLabel: true
        },
        legend: {
          name: '人次',
          right: 20,
          top: 20,
          textStyle: {
            color: "rgba(255,255,255,.6)"
          }
        },
        tooltip: {
          trigger: 'axis',
        },
        xAxis: [
          {
            type: "category",
            boundaryGap: false,
            // x轴更换数据
            data: x,
            // 文本颜色为rgba(255,255,255,.6)  文字大小为 12
            axisLabel: {
              color: "rgba(255,255,255,.6)",
              fontSize: 12
            },
            // x轴线的颜色为   rgba(255,255,255,.2)
            axisLine: {
              lineStyle: {
                color: "rgba(255,255,255,.2)"
              }
            }
          }
        ],
        yAxis: [{
          name: "单位（万人次）",
          nameTextStyle: {
            color: "rgba(255,255,255,.6)",
            fontSize: 14
          },
          type: 'value',
          splitLine: {
            show: true,
            lineStyle: {
              color: "rgba(255,255,255,.1)"
            }
          },
          axisLabel: {
            show: true,
            margin: 20,
            textStyle: {
              color: "rgba(255,255,255,.6)",
            },
          },
        }],
        series: [{
          name: '人次',
          type: 'line',
          smooth: true,
          showAllSymbol: true,
          symbol: 'circle',
          symbolSize: 15,
          lineStyle: {
            normal: {
              color: "#6c50f3",
              shadowColor: 'rgba(0, 0, 0, .3)',
              shadowBlur: 0,
              shadowOffsetY: 5,
              shadowOffsetX: 5,
            },
          },
          label: {
            show: true,
            position: 'top',
            textStyle: {
              color: "rgba(255,255,255,.6)",
            }
          },
          itemStyle: {
            color: "#6c50f3",
            borderColor: "#fff",
            borderWidth: 3,
            shadowColor: 'rgba(0, 0, 0, .3)',
            shadowBlur: 0,
            shadowOffsetY: 2,
            shadowOffsetX: 2,
          },
          tooltip: {
            show: false
          },
          areaStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: 'rgba(108,80,243,0.3)'
              },
              {
                offset: 1,
                color: 'rgba(108,80,243,0)'
              }
              ], false),
              shadowColor: 'rgba(108,80,243, 0.9)',
              shadowBlur: 20
            }
          },
          data: y
        }]

      }
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
    // 右1折线
    dev3() {
      var myChart = echarts.init(document.querySelector(".line2 .chart"));
      var option = {
        tooltip: {
          trigger: "axis"
        },
        legend: {
          top: "0%",
          data: ["男性户数", "女性户数"],
          textStyle: {
            color: "rgba(255,255,255,.5)",
            fontSize: "12"
          }
        },
        grid: {
          left: "10",
          top: "30",
          right: "10",
          bottom: "10",
          containLabel: true
        },
        xAxis: [
          {
            type: "category",
            boundaryGap: false,
            // x轴更换数据
            data: this.tip,
            // 文本颜色为rgba(255,255,255,.6)  文字大小为 12
            axisLabel: {
              color: "rgba(255,255,255,.6)",
              fontSize: 12
            },
            // x轴线的颜色为   rgba(255,255,255,.2)
            axisLine: {
              lineStyle: {
                color: "rgba(255,255,255,.2)"
              }
            }
          }
        ],
        yAxis: [
          {
            type: "value",
            axisTick: { show: false },
            axisLine: {
              lineStyle: {
                color: "rgba(255,255,255,.1)"
              }
            },
            axisLabel: {
              color: "rgba(255,255,255,.6)",
              fontSize: 12
            },
            // 修改分割线的颜色
            splitLine: {
              lineStyle: {
                color: "rgba(255,255,255,.1)"
              }
            }
          }
        ],
        series: [
          {
            name: "男性户数",
            type: "line",
            smooth: true,
            zlevel: 2,
            z: 2,
            // 单独修改当前线条的样式
            lineStyle: {
              color: "#0184d5",
              width: "2"
            },
            // 填充颜色设置
            areaStyle: {
              color: new echarts.graphic.LinearGradient(
                0, 0, 0, 1,
                [
                  {
                    offset: 0,
                    color: "rgba(1, 132, 213, 0.4)" // 渐变色的起始颜色
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
            data: this.boy
          },
          {
            name: "女性户数",
            type: "line",
            smooth: true,
            zlevel: 2,
            z: 2,
            lineStyle: {
              color: "#00d887",
              width: 2
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(
                0, 0, 0, 1,
                [
                  {
                    offset: 0,
                    color: "rgba(0, 216, 135, 0.4)"
                  },
                  {
                    offset: 0.8,
                    color: "rgba(0, 216, 135, 0.1)"
                  }
                ],
                false
              ),
              shadowColor: "rgba(0, 0, 0, 0.1)"
            },
            // 设置拐点 小圆点
            symbol: "circle",
            // 拐点大小
            symbolSize: 5,
            // 设置拐点颜色以及边框
            itemStyle: {
              color: "#00d887",
              borderColor: "rgba(221, 220, 107, .1)",
              borderWidth: 12
            },
            // 开始不显示拐点， 鼠标经过显示
            showSymbol: false,
            data: this.girl
          }
        ]
      };
      myChart.setOption(option);
      // 4. 让图表跟随屏幕自动的去适应
      window.addEventListener("resize", function () {
        myChart.resize();
      });
    },
    // 左3饼图
    dev4(x) {
      // 1. 实例化对象
      var myChart = echarts.init(document.querySelector(".pie .chart"));
      // 2.指定配置

      // formatter: "{a} <br/>{b}: {c} ({d}%)"
      var option = {
        color: ["#065aab", "#066eab", "#0682ab", "#0696ab", "#06a0ab"],
        tooltip: {
          trigger: "item",
          formatter: "{b}年度: <br/>{c}人次 ({d}%)"
        },
        legend: {
          show: true,
          left: 'left',
          top: '15px',
          orient: 'vertical',
          // 修改小图标的大小
          itemWidth: 12,
          itemHeight: 12,
          textStyle: {
            color: "rgba(255,255,255,.5)",
            fontSize: 12
          }
        },
        series: [
          {
            type: 'pie',
            radius: ['30%', '70%'],
            roseType: 'area',
            center: ['50%', '50%'],
            label: {
              normal: {
                show: true,
                formatter: '{b}',
                borderRadius: 10,
                textStyle: {
                  fontSize: 12,
                  color: "#aaa"
                },
                position: 'inside',
              },
              emphasis: {
                show: true,
              },
            },
            itemStyle: {
              borderRadius: 10
            },
            labelLine: {
              normal: {
                show: true,
                length: 10,
                length2: 10,
              },
              emphasis: {
                show: false,
              },
            },
            data: x,
          },
        ],
      };
      // 3. 把配置给实例对象
      myChart.setOption(option);
      // 4. 让图表跟随屏幕自动的去适应
      window.addEventListener("resize", function () {
        myChart.resize();
      });
    },
    // 左4饼图
    dev5(x) {
      // 1. 实例化对象
      var myChart = echarts.init(document.querySelector(".Radar .chart"));
      // 2.指定配置
      var min = -10000;
      var max = 700000;
      // formatter: "{a} <br/>{b}: {c} ({d}%)"
      var option = {
        // title: {
        //   text: '2018-2023年摇号人次',
        //   textStyle:{
        //     fontSize:'12px',
        //     position:'center'
        //   }
        // },
        legend: {
          data: ['摇号人次'],
          left: 'left',
          bottom: 'bottom',
          textStyle: {
            color: "rgba(255,255,255,.5)",
            fontSize: "12"
          }
        },
        radar: {
          indicator: [
            { text: '2018年', min: min, max: max },
            { text: '2019年', min: min, max: max },
            { text: '2020年', min: min, max: max },
            { text: '2021年', min: min, max: max },
            { text: '2022年', min: min, max: max },
            { text: '2023年', min: min, max: max }
          ],
          // center: ['25%', '50%'],
          radius: 60,
          alignTicks: false,
          startAngle: 90,
          splitNumber: 4,
          shape: 'circle',
          axisName: {
            formatter: '【{value}】',
            color: '#428BD4'
          },
          splitArea: {
            areaStyle: {
              color: ['#77EADF', '#26C3BE', '#64AFE9', '#428BD4'],
              shadowColor: 'rgba(0, 0, 0, 0.2)',
              shadowBlur: 10
            }
          },
          axisLine: {
            lineStyle: {
              color: 'rgba(211, 253, 250, 0.8)'
            }
          },
          splitLine: {
            lineStyle: {
              color: 'rgba(211, 253, 250, 0.8)'
            }
          }
        },
        series: [
          {
            name: '摇号人次',
            type: 'radar',
            data: [
              {
                value: x,
                name: '摇号数据',
                lineStyle: {
                  color: 'rgba(255, 228, 152, 0.6)',
                  type: 'dashed'
                },
                symbol: 'rect',
                symbolSize: 3,
                label: {
                  show: false,
                  formatter: function (params) {
                    return params.value;
                  }
                },
                areaStyle: {
                  color: new echarts.graphic.RadialGradient(0.1, 0.6, 1, [
                    {
                      color: 'rgba(255, 228, 152, 0.1)',
                      offset: 0
                    },
                    {
                      color: 'rgba(255, 145, 124, 0.9)',
                      offset: 1
                    }
                  ])
                }
              },

            ]
          }
        ]
      };

      // 3. 把配置给实例对象
      myChart.setOption(option);
      // 4. 让图表跟随屏幕自动的去适应
      window.addEventListener("resize", function () {
        myChart.resize();
      });
    },
    // 右2
    dev6() {
      var myChart = echarts.init(document.querySelector(".radar2 .chart"));
      var option = {
        // backgroundColor: 'black',
        "normal": {
          "top": 200,
          "left": 300,
          "width": 500,
          "height": 400,
          "zIndex": 6,
          "backgroundColor": ""
        },
        "color": ["rgba(245, 166, 35, 1)", "rgba(19, 173, 255, 1)"],
        // "title": {
        //   "show": true,
        //   "text": "基础雷达图",
        //   "left": "40%",
        //   "top": "1%",
        //   "textStyle": {
        //     "fontSize": 18,
        //     "color": "#fff",
        //     "fontStyle": "normal",
        //     "fontWeight": "normal"
        //   }
        // },
        "tooltip": {
          "show": true,
          "trigger": "item"
        },
        "legend": {
          "show": true,
          "icon": "circle",
          "left": "35%",
          "top": "90%",
          "orient": "horizontal",
          "textStyle": {
            "fontSize": 14,
            "color": "#fff"
          },
          "data": ["数据1", "数据2"]
        },
        "radar": {
          "center": ["50%", "50%"],
          "radius": "70%",
          "startAngle": 90,
          "splitNumber": 4,
          "shape": "circle",
          "splitArea": {
            "areaStyle": {
              "color": ["transparent"]
            }
          },
          "axisLabel": {
            "show": false,
            "fontSize": 18,
            "color": "#fff",
            "fontStyle": "normal",
            "fontWeight": "normal"
          },
          "axisLine": {
            "show": true,
            "lineStyle": {
              "color": "grey"//
            }
          },
          "splitLine": {
            "show": true,
            "lineStyle": {
              "color": "grey"//
            }
          },
          "indicator": [{
            "name": "杭州市",
            "min": 0,
            "max": 140000
          }, {
            "name": "温州市",
            "min": 0,
            "max": 140000
          }, {
            "name": "金华市",
            "min": 0,
            "max": 140000
          }, {
            "name": "绍兴市",
            "min": 0,
            "max": 140000
          }, {
            "name": "衢州市",
            "min": 0,
            "max": 140000
          }, {
            "name": "台州市",
            "min": 0,
            "max": 140000
          }, {
            "name": "湖州市",
            "min": 0,
            "max": 140000
          }, {
            "name": "宁波市",
            "min": 0,
            "max": 140000
          }, {
            "name": "嘉兴市",
            "min": 0,
            "max": 140000
          }, {
            "name": "丽水市",
            "min": 0,
            "max": 140000
          }, {
            "name": "舟山市",
            "min": 0,
            "max": 140000
          }]
        },
        "series": [{
          "name": "数据1",
          "type": "radar",
          "symbol": "circle",
          "symbolSize": 10,
          "areaStyle": {
            "normal": {
              "color": "rgba(245, 166, 35, 0.4)"
            }
          },
          itemStyle: {
            color: 'rgba(245, 166, 35, 1)',
            borderColor: 'rgba(245, 166, 35, 0.3)',
            borderWidth: 10,
          },
          "lineStyle": {
            "normal": {
              "type": "dashed",

              "color": "rgba(245, 166, 35, 1)",
              "width": 2
            }
          },
          "data": [
            [155425,
              28884,
              21014,
              15715,
              13605,
              10129,
              6449,
              6582,
              5315,
              4078,
              1753,]
          ]
        }, {
          "name": "数据2",
          "type": "radar",
          "symbol": "circle",
          "symbolSize": 10,
          "itemStyle": {
            "normal": {
              color: 'rgba(19, 173, 255, 1)',
              "borderColor": "rgba(19, 173, 255, 0.4)",
              "borderWidth": 10
            }
          },
          "areaStyle": {
            "normal": {
              "color": "rgba(19, 173, 255, 0.5)"
            }
          },
          "lineStyle": {
            "normal": {
              "color": "rgba(19, 173, 255, 1)",
              "width": 2,
              "type": "dashed"
            }
          },
          "data": [
            [132845,
              22998,
              17700,
              13813,
              11701,
              8462,
              6355,
              5666,
              5523,
              3876,
              1628]
          ]
        }]
      };
      myChart.setOption(option);
      // 监听浏览器缩放，图表对象调用缩放resize函数
      window.addEventListener("resize", function () {
        myChart.resize();
      });
    },
    // 右3
    dev7() {
      var myChart = echarts.init(document.querySelector(".bar2 .chart"));
      var option = {
        legend: {
          data: ['帅哥', '美女'],
          bottom: 0,
          right: '30%',
          textStyle: {
            color: '#fff',
          },
        },
        tooltip: {
          show: true,
          trigger: 'axis',
          formatter: '{b}<br/>{a}: {c}人',
          axisPointer: {
            type: 'shadow',
          }
        },
        // toolbox: {
        //   right: 20,
        //   feature: {
        //     saveAsImage: {},
        //     restore: {},
        //     dataView: {},
        //     dataZoom: {},
        //     magicType: {
        //       type: ['line', 'bar']
        //     },
        //     // brush: {},
        //   }
        // },
        grid: [{
          show: false,
          left: '4%',
          top: 20,
          bottom: 20,
          containLabel: true,
          width: '42%',
        }, {
          show: false,
          left: '51.5%',
          top: 55,
          bottom: 20,
          width: '0%',
        }, {
          show: false,
          right: '4%',
          top: 20,
          bottom: 20,
          containLabel: true,
          width: '42%',
        },],
        xAxis: [
          {
            type: 'value',
            inverse: true,
            axisLine: {
              show: false,
            },
            axisTick: {
              show: false,
            },
            position: 'top',
            axisLabel: {
              rotate: 20,
              show: true,
              textStyle: {
                color: '#B2B2B2',
                fontSize: 12,
              },
            },
            splitLine: {
              show: false,
              lineStyle: {
                color: '#000011',
                width: 1,
                type: 'solid',
              },
            },
          }, {
            gridIndex: 1,
            show: false,
          }, {
            gridIndex: 2,
            type: 'value',
            axisLine: {
              show: false,
            },
            axisTick: {
              show: false,
            },
            position: 'top',
            axisLabel: {
              rotate: 20,
              show: true,
              textStyle: {
                color: '#B2B2B2',
                fontSize: 12,
              },
            },
            splitLine: {
              show: false,
              lineStyle: {
                color: '#000011',
                width: 1,
                type: 'solid',
              },
            },
          },],
        yAxis: [{
          type: 'category',
          inverse: true,
          position: 'right',
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            show: false,
            margin: 8,
            textStyle: {
              color: '#9D9EA0',
              fontSize: 12,
            },

          },
          data: this.tip
        }, {
          gridIndex: 1,
          type: 'category',
          inverse: true,
          position: 'left',
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            show: true,
            textStyle: {
              color: '#9D9EA0',
              fontSize: 7,
            },

          },
          data: this.tip.map(function (value) {
            return {
              value: value,
              textStyle: {
                align: 'center'
              }
            }
          }),
        }, {
          gridIndex: 2,
          type: 'category',
          inverse: true,
          position: 'left',
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            show: false,
            textStyle: {
              color: '#9D9EA0',
              fontSize: 12,
            },

          },
          data: this.tip
        },],
        series: [{
          name: '帅哥',
          type: 'bar',
          barGap: 20,
          barWidth: 10,
          label: {
            normal: {
              show: false,
            },
            emphasis: {
              show: true,
              position: 'left',
              offset: [0, 0],
              textStyle: {
                color: '#fff',
                fontSize: 14,
              },
            },
          },
          itemStyle: {
            normal: {
              color: '#659F83',
            },
            emphasis: {
              color: '#08C7AE',
            },
          },
          data: this.boy
        },
        {
          name: '美女',
          type: 'bar',
          barGap: 20,
          barWidth: 10,
          xAxisIndex: 2,
          yAxisIndex: 2,
          label: {
            normal: {
              show: false,
            },
            emphasis: {
              show: true,
              position: 'right',
              offset: [0, 0],
              textStyle: {
                color: '#fff',
                fontSize: 14,
              },
            },
          },
          itemStyle: {
            normal: {
              color: '#F68989',
            },
            emphasis: {
              color: '#F94646',
            },
          },
          data: this.girl
        }]
      };
      myChart.setOption(option);
      // 监听浏览器缩放，图表对象调用缩放resize函数
      window.addEventListener("resize", function () {
        myChart.resize();
      });
    },
    // 右4
    dev8() {
      var myChart = echarts.init(document.querySelector(".linebar2 .chart"));
      var option = {
        // backgroundColor: '#0f375f',
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
            label: {
              show: true,
              backgroundColor: '#333'
            }
          }
        },
        grid: [{
          show: false,
          top: 20,
          bottom: 10,
          containLabel: true,
        }],
        legend: {
          data: ['男性户数', '女性户数'],
          textStyle: {
            color: '#ccc'
          }
        },
        xAxis: {
          data: this.tip,
          axisLine: {
            lineStyle: {
              color: '#ccc'
            }
          }
        },
        yAxis: {
          splitLine: { show: false },
          axisLine: {
            lineStyle: {
              color: '#ccc'
            }
          }
        },
        series: [{
          name: '男性户数',
          type: 'line',
          smooth: true,
          showAllSymbol: true,
          symbol: 'emptyCircle',
          symbolSize: 15,
          data: this.boy
        }, {
          name: '女性户数',
          type: 'bar',
          barWidth: 10,
          itemStyle: {
            normal: {
              barBorderRadius: 5,
              color: new echarts.graphic.LinearGradient(
                0, 0, 0, 1,
                [
                  { offset: 0, color: '#14c8d4' },
                  { offset: 1, color: '#43eec6' }
                ]
              )
            }
          },
          data: this.girl
        }, {
          name: '男性户数',
          type: 'bar',
          barGap: '-100%',
          barWidth: 10,
          itemStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(
                0, 0, 0, 1,
                [
                  { offset: 0, color: 'rgba(20,200,212,0.5)' },
                  { offset: 0.2, color: 'rgba(20,200,212,0.2)' },
                  { offset: 1, color: 'rgba(20,200,212,0)' }
                ]
              )
            }
          },
          z: -12,
          data: this.boy
        }, {
          name: 'dotted',
          type: 'pictorialBar',
          symbol: 'rect',
          itemStyle: {
            normal: {
              color: '#0f375f'
            }
          },
          symbolRepeat: true,
          symbolSize: [12, 4],
          symbolMargin: 1,
          z: -10,
          data: this.boy
        }]
      };
      myChart.setOption(option);
      // 监听浏览器缩放，图表对象调用缩放resize函数
      window.addEventListener("resize", function () {
        myChart.resize();
      });
    },
    // 右5
    dev9() {
      var myChart = echarts.init(document.querySelector(".stack2 .chart"));
      var option = {
        // backgroundColor: "#344b58",
        "tooltip": {
          "trigger": "axis",
          "axisPointer": {
            "type": "shadow",
            textStyle: {
              color: "#fff"
            }

          },
        },
        "grid": {
          "borderWidth": 0,
          "top": 20,
          "bottom": 20,
          textStyle: {
            color: "#fff"
          }
        },
        "calculable": true,
        "xAxis": [{
          "type": "category",
          "axisLine": {
            lineStyle: {
              color: 'rgba(255,255,255,.5)'
            }
          },
          "splitLine": {
            "show": false
          },
          "axisTick": {
            "show": false
          },
          "splitArea": {
            "show": false
          },
          "axisLabel": {
            "interval": 0,
            color: 'rgba(255,255,255,0.7)',
            fontSize: 10,
            rotate: 15
          },
          data: this.tip,
        }],
        "yAxis": [{
          "type": "value",
          "splitLine": {
            "show": false
          },
          "axisLine": {
            "show": false
          },
          "axisTick": {
            "show": false
          },
          "axisLabel": {
            "interval": 0,
            color: 'rgba(255,255,255,0.5)',
            fontSize: 10

          },
          "splitArea": {
            "show": false
          },

        }],
        "series": [{
          "name": "女",
          "type": "bar",
          "stack": "总量",
          "barMaxWidth": 35,
          "barGap": "10%",
          "itemStyle": {
            "normal": {
              "color":
              {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                  offset: 0,
                  color: 'rgba(35, 157, 250, 1)' // 0% 处的颜色
                }, {
                  offset: 1,
                  color: 'rgba(35, 157, 250, 0)' // 100% 处的颜色
                }],
                global: false // 缺省为 false
              }
            }
          },
          "data": this.girl,
        },

        {
          "name": "男",
          "type": "bar",
          "stack": "总量",
          "itemStyle": {
            "normal": {
              "color": {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                  offset: 0,
                  color: 'rgba(35, 250, 187, 1)' // 0% 处的颜色
                }, {
                  offset: 1,
                  color: 'rgba(35, 250, 187, 0)' // 100% 处的颜色
                }],
                global: false // 缺省为 false
              },
              "barBorderRadius": 0
            }
          },
          "data": this.boy
        }, {
          "name": "总数",
          "type": "line",
          symbolSize: 3,
          symbol: 'circle',
          "itemStyle": {
            "normal": {
              "color": 'rgba(255, 196, 53, 1)',
              "barBorderRadius": 0,
            }
          },
          lineStyle: {
            normal: {
              width: 1,
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                  offset: 0,
                  color: 'rgba(255, 67, 2, 1)' // 0% 处的颜色
                }, {
                  offset: 1,
                  color: 'rgba(255, 196, 53, 1)' // 100% 处的颜色
                }],
                global: false // 缺省为 false
              }
            }
          },
          "data": this.sum1
        },
        ]
      };
      myChart.setOption(option);
      // 监听浏览器缩放，图表对象调用缩放resize函数
      window.addEventListener("resize", function () {
        myChart.resize();
      });
    },
    // 中1
    dev10() {
      var myChart = echarts.init(document.querySelector(".line3 .chart"));

      // myChart.showLoading({
      //   text: "图表数据正在努力加载...",
      //   x: "center",
      //   y: "center",
      //   textStyle: {
      //     color: "red",
      //     fontSize: 14
      //   },
      //   effect: "whirling"
      // });
      // myChart.hideLoading();
      var option = {
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
          right: '5%',
          feature: {
            myTool: {
              show: true,
              title: '全屏显示',
              //icon从阿里图标复制对应的svg格式代码
              icon: "path://M368.896 192H224a32 32 0 0 0-32 32v137.888a32 32 0 0 0 64 0V256h112.896a32 32 0 0 0 0-64zM784.864 192H640a32 32 0 1 0 0 64h112.864v105.888a32 32 0 1 0 64 0V224a32 32 0 0 0-32-32zM368.896 777.92H256V672a32 32 0 1 0-64 0v137.92a32 32 0 0 0 32 32h144.896a32 32 0 1 0 0-64zM784.864 640a32 32 0 0 0-32 32v105.92H640a32 32 0 1 0 0 64h144.864a32 32 0 0 0 32-32V672a32 32 0 0 0-32-32z",
              onclick: function () {
                //生成全屏显示的图表
                if (setFullScreenToolBox(option, '摇号不同距离数量分布情况')) {
                  // console.log(chartScreen)
                  myChart.hide()
                  chartScreen
                } else { return false }
              }
            },
          }
        },
        legend: {
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
          data: ['3km以内', '3-10km', '10km以上']
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            axisLabel: {
              color: '#30eee9'
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
            data: this.gs
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '人次',
            // min: 0,
            // max: 1000,
            axisLabel: {
              formatter: '{value}',
              textStyle: {
                color: '#2ad1d2'
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
            name: '3km以内',
            type: 'line',
            stack: '总量',
            symbol: 'circle',
            symbolSize: 8,
            itemStyle: {
              normal: {
                color: '#0092f6',
                lineStyle: {
                  color: "#0092f6",
                  width: 1
                }
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
              }
            },
            markPoint: {
              itemStyle: {
                normal: {
                  color: 'red'
                }
              }
            },
            data: this.distant1
          },
          {
            name: '3-10km',
            type: 'line',
            stack: '总量',
            symbol: 'circle',
            symbolSize: 8,

            itemStyle: {
              normal: {
                color: '#00d4c7',
                lineStyle: {
                  color: "#00d4c7",
                  width: 1
                }
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
              }
            },
            data: this.distant2
          },
          {
            name: '10km以上',
            type: 'line',
            stack: '总量',
            symbol: 'circle',
            symbolSize: 8,
            itemStyle: {
              normal: {
                color: '#aecb56',
                lineStyle: {
                  color: "#aecb56",
                  width: 1
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
                }
              }
            },
            data: this.distant3
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
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        toolbox: {
          show: true,
          right: '10%',
          feature: {
            myTool: {
              show: true,
              title: '全屏显示',
              //icon从阿里图标复制对应的svg格式代码
              icon: "path://M368.896 192H224a32 32 0 0 0-32 32v137.888a32 32 0 0 0 64 0V256h112.896a32 32 0 0 0 0-64zM784.864 192H640a32 32 0 1 0 0 64h112.864v105.888a32 32 0 1 0 64 0V224a32 32 0 0 0-32-32zM368.896 777.92H256V672a32 32 0 1 0-64 0v137.92a32 32 0 0 0 32 32h144.896a32 32 0 1 0 0-64zM784.864 640a32 32 0 0 0-32 32v105.92H640a32 32 0 1 0 0 64h144.864a32 32 0 0 0 32-32V672a32 32 0 0 0-32-32z",
              onclick: function () {
                //生成全屏显示的图表
                if (setFullScreenToolBox(option, '摇号不同距离数量分布情况')) {
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
          data: ['3km以内', '3-10km', '10km以上'],
          right: 'center',
          top: '5%',
          textStyle: {
            color: "#fff"
          },
          itemWidth: 12,
          itemHeight: 10,
          // itemGap: 35
        },
        xAxis: {
          type: 'category',
          data: this.gs,
          axisLine: {
            lineStyle: {
              color: 'white'

            }
          },
          axisLabel: {
            // interval: 0,
            // rotate: 40,
            textStyle: {
              fontFamily: 'Microsoft YaHei'
            }
          },
        },

        yAxis: {
          type: 'value',
          // max: '1200',
          axisLine: {
            show: false,
            lineStyle: {
              color: 'white'
            }
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: 'rgba(255,255,255,0.3)'
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
            color: "#fff"
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
          name: '3km以内',
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
          data: this.distant1
        },
        {
          name: '3-10km',
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
          data: this.distant2
        },
        {
          name: '10km以上',
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
          data: this.distant3
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
        legend: {
          data: ['10km以上', '3-10km', '3km以内'],
          textStyle: { fontSize: 8, color: '#fff' },
          itemWidth: 15,
          itemHeight: 10,
          itemGap: 10,
          bottom: '5%',
          selectedMode: false
        },
        grid: { top: '10%', left: '10%', right: '6%', bottom: '25%' },
        // xAxis
        xAxis: {
          axisTick: { show: true },
          axisLine: { lineStyle: { color: 'rgba(255,255,255, .2)' } },
          axisLabel: { textStyle: { fontSize: 8, color: '#fff' }, },
          data: this.gs
        },

        // yAxis
        yAxis: [{
          axisTick: { show: false },
          axisLine: { show: false, },
          splitLine: { lineStyle: { color: 'rgba(255,255,255, .05)' } },
          axisLabel: { textStyle: { fontSize: 8, color: '#fff' } }
        }, {
          show: true,
          max: 100,
          splitLine: { show: false },
          axisLine: { show: false },
          axisTick: { show: false },
          axisLabel: {
            textStyle: { fontSize: 16, color: '#fff' },
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
          data: this.distant3,
          symbol: 'diamond',
          symbolOffset: ['-50%', '-50%'],
          symbolSize: [6, 3],
          itemStyle: {
            borderColor: '#2fffa4',
            color: '#2fffa4'
          },
        }, {
          z: 1,
          type: 'bar',
          name: '10km以上',
          barWidth: 5,
          barGap: '-50%',
          data: this.distant3,
          itemStyle: {
            color: {
              type: 'linear',
              x: 0, x2: 1, y: 0, y2: 0,
              colorStops: [
                { offset: 0, color: 'rgba(29, 245, 160, .7)' },
                { offset: 0.5, color: 'rgba(29, 245, 160, .7)' },
                { offset: 0.5, color: 'rgba(29, 245, 160, .3)' },
                { offset: 1, color: 'rgba(29, 245, 160, .3)' }
              ]
            }
          },
        }, {
          z: 2,
          name: '上部1',
          type: 'pictorialBar',
          symbolPosition: 'end',
          data: this.distant2,
          symbol: 'diamond',
          symbolOffset: [0, '-50%'],
          symbolSize: [6, 3],
          itemStyle: {
            borderColor: '#32ffee',
            color: '#32ffee'
          },
        }, {
          z: 2,
          type: 'bar',
          name: '3-10km',
          barWidth: 5,
          data: this.distant2,
          itemStyle: {
            color: {
              type: 'linear',
              x: 0, x2: 1, y: 0, y2: 0,
              colorStops: [
                { offset: 0, color: 'rgba(50, 255, 238, .7)' },
                { offset: 0.5, color: 'rgba(50, 255, 238, .7)' },
                { offset: 0.5, color: 'rgba(50, 255, 238, .3)' },
                { offset: 1, color: 'rgba(50, 255, 238, .3)' }
              ]
            }
          },
        }, {
          z: 3,
          name: '上部1',
          type: 'pictorialBar',
          symbolPosition: 'end',
          data: this.distant1,
          symbol: 'diamond',
          symbolOffset: ['50%', '-50%'],
          symbolSize: [6, 3],
          itemStyle: {
            borderColor: '#ffd11a',
            color: '#ffd11a'
          },
        }, {
          z: 3,
          type: 'bar',
          name: '3km以内',
          barWidth: 5,
          data: this.distant1,
          itemStyle: {
            color: {
              type: 'linear',
              x: 0, x2: 1, y: 0, y2: 0,
              colorStops: [
                { offset: 0, color: 'rgba(255, 209, 26, .7)' },
                { offset: 0.5, color: 'rgba(255, 209, 26, .7)' },
                { offset: 0.5, color: 'rgba(255, 209, 26, .3)' },
                { offset: 1, color: 'rgba(255, 209, 26, .3)' }
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
      var d1 = []; this.distant1.map((item, index) => { d1.push({ value: item, name: this.gs[index] }) })
      var d2 = []; this.distant2.map((item, index) => { d2.push({ value: item, name: this.gs[index] }) })
      var d3 = []; this.distant3.map((item, index) => { d3.push({ value: item, name: this.gs[index] }) })
      var option = {
        // backgroundColor: "#0B1837",
        color: ["#EAEA26", "#906BF9", "#FE5656", "#01E17E", "#3DD1F9", "#FFAD05"],
        // title: {
        //     text: '网络/安全设备',
        //     left: '60',
        //     top: 0,
        //     textAlign: 'center',
        //     textStyle: {
        //         color: '#fff',
        //         fontSize: 14,
        //         fontWeight: 0
        //     }
        // },
        grid: {
          left: 10,
          top: 50,
          bottom: 10,
          right: 10,
          containLabel: true
        },
        tooltip: {
          trigger: 'item',
          formatter: "{b} : {c} ({d}%)"
        },
        legend: {
          type: "scroll",
          orient: "vartical",
          // x: "right",
          top: "center",
          right: "0",
          // bottom: "0%",
          itemWidth: 10,
          itemHeight: 8,
          itemGap: 16,
          textStyle: {
            color: '#A3E2F4',
            fontSize: 12,
            fontWeight: 0
          },
          data: this.gs
        },
        polar: {
          center: ['35%', '50%'],
          radius: 100,
        },
        angleAxis: {
          interval: 1,
          type: 'category',
          data: [],
          z: 10,
          axisLine: {
            show: false,
            lineStyle: {
              color: "#0B4A6B",
              width: 1,
              type: "solid"
            },
          },
          axisLabel: {
            interval: 0,
            show: true,
            color: "#0B4A6B",
            margin: 8,
            fontSize: 16
          },
        },
        radiusAxis: {
          min: 40,
          max: 120,
          center: ['35%', '50%'],
          interval: 20,
          axisLine: {
            show: false,
            lineStyle: {
              color: "#0B3E5E",
              width: 1,
              type: "solid"
            },
          },
          axisLabel: {
            formatter: '{value} %',
            show: false,
            padding: [0, 0, 20, 0],
            color: "#0B3E5E",
            fontSize: 16
          },
          splitLine: {
            lineStyle: {
              color: "#0B3E5E",
              width: 2,
              type: "solid"
            }
          }
        },
        calculable: true,
        series: [{
          name: "3km以内",
          type: 'pie',
          center: ['35%', '50%'],
          radius: ["5%", "20%"],
          hoverAnimation: true,
          labelLine: {
            normal: {
              show: false,
              length: 30,
              length2: 55
            },
            emphasis: {
              show: false
            }
          },
          roseType: 'area',
          zlevel: 10,
          label: {
            normal: {
              show: false,
              formatter: "{c}",
              color: "#ffff",
              textStyle: {
                fontSize: 12,
              },
              position: 'inside'
            },
            emphasis: {
              show: true
            }
          },
          data: d1
        }, {
          type: 'pie',
          center: ['35%', '50%'],
          radius: ["55%", "90%"],
          hoverAnimation: false,
          labelLine: {
            normal: {
              show: false,
              length: 30,
              length2: 55
            },
            emphasis: {
              show: false
            }
          },
          name: "10km以上",
          roseType: 'area',
          zlevel: 10,
          label: {
            normal: {
              show: true,
              formatter: "{c}",
              color: "#ffff",
              textStyle: {
                fontSize: 12,
              },
              position: 'inside'
            },
            emphasis: {
              show: true
            }
          },
          data: d3
        }, {
          // stack: 'a',
          name: "3-10km",
          type: 'pie',
          center: ['35%', '50%'],
          radius: ['25%', '50%'],
          roseType: 'area',
          zlevel: 10,
          label: {
            normal: {
              show: true,
              formatter: "{c}",
              color: "#ffff",
              textStyle: {
                fontSize: 12,
              },
              position: 'inside'
            },
            emphasis: {
              show: true
            }
          },
          labelLine: {
            normal: {
              show: true,
              length: 20,
              length2: 55
            },
            emphasis: {
              show: false
            }
          },
          data: d2
        },]
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
      var t1 = ['3km以内', '3-10km', '10km以上']
      var d1 = []; this.distant1.map((item, index) => { d1.push([0, index, item]) })
      var d2 = []; this.distant2.map((item, index) => { d2.push([1, index, item]) })
      var d3 = []; this.distant3.map((item, index) => { d3.push([2, index, item]) })
      var dd = [...new Array([...d1, ...d2, ...d3])][0]
      var gs = this.gs
      // console.log(dd);
      var option = {
        legend: {
          data: ['距离分布情况'],
          left: 'right',
          textStyle: {
            color: 'gold'
          }
        },
        polar: {},
        tooltip: {
          formatter: function (params) {
            return params.value[2] + '=' + gs[params.value[1]] + '=' + t1[params.value[0]];
          }
        },
        angleAxis: {
          type: 'category',
          data: this.gs,
          textStyle: {
            color: '#ffff'
          },
          boundaryGap: false,
          splitLine: {
            show: true,
            lineStyle: {
              color: '#fff',
              type: 'dashed'
            }
          },
          axisLine: {
            show: false
          }
        },
        radiusAxis: {
          type: 'category',
          data: t1,
          axisLine: {
            show: false
          },
          axisLabel: {
            rotate: 45
          }
        },
        series: [{
          name: '距离分布情况',
          type: 'scatter',
          textStyle: {
            color: '#ffff'
          },
          itemStyle: {
            color: 'gold'
          },
          coordinateSystem: 'polar',
          symbolSize: function (val) {
            return val[2] / 30;
          },
          data: dd
        }]
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
@import '../css/VisualReports1.css';
</style>
