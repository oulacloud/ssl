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
      <h1 id="view">摇号数据展示</h1>
      <el-button id="btn" @click="toggleActive()" type="primary" round>工具箱</el-button>
      <div class="showTime">{{ times }}</div>
    </header>
    <!-- 主体部分 -->
    <section class="mainbox">
      <!-- 中 -->
      <div class="column">
        <div class="panel bar">
          <h2 style="fontSize:24px">2018-2023年摇号人次
            <a href="javacript:;"></a>
            <a href="javascript:;"></a>
          </h2>
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
import axios from 'axios'
var vm = null
var chartScreen = null;
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
      loading: true,
      isActive: false,
      num: 0
    };
  },
  created() {
    vm = this
  },
  // beforeMount(){this.getData()},
  mounted() {
    this.initWatermark()
    // 获取时间
    this.getTimes()
    this.getData("http://sslapi.nadibao.cn/api/HzYaoHaoData/GetLotteryTimes") //获取摇号数据
    setTimeout(()=>{
      this.dev0(this.x, this.y);
    },1500)
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
      // ctx.fillText('拿地宝', canvas.width / 6, canvas.height / 2);// 设置显示文字和偏移量

      //创建虚心水印
      ctx.strokeStyle = 'rgba(0,0,0,.6)';
      ctx.strokeText('数视灵', canvas.width / 6, canvas.height / 2);

      // 渐变水印
      // const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
      // gradient.addColorStop(0, 'red');
      // gradient.addColorStop(0.5, 'yellow');
      // gradient.addColorStop(1, 'green');
      // ctx.fillStyle = gradient; // 颜色
      // ctx.fillText('拿地宝', canvas.width / 6, canvas.height / 2);// 设置显示文字和偏移量

      // 将画布转成图片
      const img = canvas.toDataURL();
      const main = document.querySelector('.mainbox');
      const fullScreen = document.querySelector('.fullScreen');
      main.style.backgroundImage = `url(${img})`;
      // fullScreen.style.backgroundImage = `url(${img})`;
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
    getData(x) {
      axios.get(x)
        .then(res => {
          for (var i = 0; i < res.data.data.length; i++) {
            this.x[i] = res.data.data[i].NAME
            this.y[i] = (res.data.data[i].NUM/10000).toFixed(2)
            this.yearData.push({ value: res.data.data[i].NUM, name: res.data.data[i].NAME })
          }
          // console.log(res.data.data)
        })

    },
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
          formatter:'{b}年度:<br>{c} (万人)'
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
                if (setFullScreenToolBox(option, '2018-2023年摇号人次')) {
                  chartScreen
                } else { return false }
              }
            },
          }
        },
        // 修改图表的大小
        grid: {
          left: 0,
          top: '8%',
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
            name:'(万)人次',
            nameTextStyle:{
              color: "rgba(255,255,255,.8) ",
            },
            interval: 10,
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
  }
};
</script>

<style scoped>
@import '../../css/yaohao.css';
</style>
