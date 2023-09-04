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
        <div class="panel stack">
          <h2 style="fontSize:24px">购房类型分布情况
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
  },
  // beforeMount(){this.getData()},
  mounted() {
    this.initWatermark()
    // 获取时间
    this.getTimes()
    this.getData("http://sslapi.nadibao.cn/api/HzYaoHaoData/GetHZYaoHaoRegDataByYear") //获取摇号数据
    this.dev9();
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
      ctx.strokeText('拿地宝', canvas.width / 6, canvas.height / 2);

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
            this.y[i] = res.data.data[i].NUM
            this.yearData.push({ value: res.data.data[i].NUM, name: res.data.data[i].NAME })
          }
        })

    },
    dev9() {
      var myChart = echarts.init(document.querySelector(".stack .chart"));
      var name = ['2018', '2019', '2020', '2021', '2022']
      var color = ['#F9F0FD', '#09FAFD', '#F00AFD', '#F9F0FD', '#F9FA0D', '#493A00']
      var le = ['A', 'B', 'C', 'D', 'E', 'F', '总人数']
      var A = [162, 473, 545, 657, 393]
      var B = [122, 243, 545, 647, 323]
      var C = [112, 413, 585, 617, 323]
      var D = [122, 453, 525, 627, 333]
      var E = [112, 473, 525, 627, 335]
      var F = [152, 413, 575, 647, 313]
      var S = [A, B, C, D, E, F]
      var s1 = 0
      var s2 = 0
      var s3 = 0
      var s4 = 0
      var s5 = 0
      var SM = [];
      var series = [];

      [...S].map((x, index) => {
        SM = [s1 += x[0], s2 += x[1], s3 += x[2], s4 += x[3], s5 += x[4]]
        series.push({
          name: le[index],
          type: 'bar',
          barWidth: 30,
          stack: '购房',
          itemStyle: {
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
                // color: 'rgba(35, 250, 187, 0)' // 100% 处的颜色
                color: color[index] // 100% 处的颜色
              }],
              global: false // 缺省为 false
            },
            "borderRadius ": 0
          },
          // showBackground: true,
          // backgroundStyle: {
          //   color: '#F0FAFD'
          // },
          data: x
        });
      })
      series.push({
        name: '总人数',
        type: 'line',
        lineStyle: {
          width: 3,
          color: '#ffbb00', // 线条颜色
          borderColor: 'rgba(0,0,0,.4)'
        },
        areaStyle: { // 区域填充样式
          // 线性渐变，前4个参数分别是x0,y0,x2,y2(范围0~1);相当于图形包围盒中的百分比。如果最后一个参数是‘true’，则该四个值是绝对像素位置。
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
            offset: 0,
            color: 'rgba(255,187,0,.8)'

          },
          {
            offset: 1,
            color: 'rgba(25,163,223, 0)'
          }
          ], false)

        },
        data: SM
      })
      console.log(SM)
      var option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            // show: false
          },
          textStyle: {
            color: "#D7E3FF"
          },
          backgroundColor: "#0F1225",
          padding: [10, 18, 20, 12],
          formatter: function (obj) {
            var str = '';
            str = '<div style="font-size: 12px;"><p style="color:#8DA2D3;lineHeight:18px;height:18px;">' + obj[0].name + '</p>';
            obj.map(item => {
              let subStr = "<div style='lineHeight:22px;height:24px;'><div style='display:inline-block;width:5px;height:5px;margin-right:6px;background:" + item.color + ";border-radius:50%;margin-bottom:2px;'></div>" + item.seriesName + "：" + item.value + "</div>";
              str += subStr;
            });
            str += "</div>";
            return str;
          },
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
                if (setFullScreenToolBox(option, '购房类型分布情况')) {
                  chartScreen
                } else { return false }
              }
            },
          }
        },
        legend: {
          data: le,
          icon: "circle",
          itemGap: 24,
          itemWidth: 10,
          itemHeight: 10,
          icon: "circle",
          orient: "horizontal",
          top:'5%',
          right: 'center',
          textStyle: {
            color: "#5D6C8E",
            fontSize: 14,
            padding: [0, 0, 0, 6],
            fontFamily: "SourceHanSansCN-Regular"
            // lineHeight: 30
          }
        },
        "grid": {
          "borderWidth": 0,
          "top": '10%',
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
            // rotate: 15
          },
          data: name,
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
        "series": series
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
@import '../../css/yaohao.css';
</style>
