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
        <div class="panel line">
          <h2 style="fontSize:24px">杭州楼盘摇号数据按出生地分类

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
import 'echarts-gl';
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
  // 获取表标线 对应点坐标
  return true;
}
export default {
  data() {
    return {
      x: [],
      y: [],
      source: [
        ['product', '2015', '2016'],
        ['老杭州人', 43.3],
        ['省内新杭州人', 53.9],
        ['省外新杭州人', 85.8],
      ],
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
    this.getData() //获取摇号数据
  },
  // beforeMount(){this.getData()},
  mounted() {
    this.initWatermark()
    // 获取时间
    this.getTimes()
    setTimeout(() => {
      this.dev2();
    }, 1500)
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
    getData() {
      axios.get("http://sslapi.nadibao.cn/api/HzYaoHaoData/GetHZYaoHaoRegDataByYear")
        .then(res => {
          for (var i = 0; i < res.data.data.length; i++) {
            this.x[i] = res.data.data[i].NAME
            this.y[i] = (res.data.data[i].NUM / 10000).toFixed(2)
            this.yearData.push({ value: res.data.data[i].NUM, name: res.data.data[i].NAME })
          }
        })

    },
    dev2() {
      // 1. 实例化对象
      var myChart = echarts.init(document.querySelector(".line .chart"));
      var data = [
        { name: '满意', value: 30, itemStyle: { color: '#c045ed' }, startRatio: 0, endRatio: 0.7,selected:true },
        { name: '非常满意', value: 45, itemStyle: { color: '#6442ee' }, startRatio: 0.7, endRatio: 1 },
        { name: '满意', value: 6, itemStyle: { color: '#3556ee' }, startRatio: 0.7, endRatio: 1 },
        { name: '基本满意', value: 14, itemStyle: { color: '#82cbe4' }, startRatio: 0.7, endRatio: 1 },
        { name: '不满意', value: 5, itemStyle: { color: '#56c0f4' }, startRatio: 0.7, endRatio: 1 },
      ];

      const getPie3D = (pieData, internalDiameterRatio) => {
        //internalDiameterRatio:透明的空心占比
        let series = [];
        let sumValue = 0;
        let startValue = 0;
        let endValue = 0;
        let k = 1;
        pieData.sort((a, b) => {
          return b.value - a.value;
        });
        // 为每一个饼图数据，生成一个 series-surface 配置
        for (let i = 0; i < pieData.length; i++) {
          sumValue += pieData[i].value;
          let seriesItem = {
            name: typeof pieData[i].name === 'undefined' ? `series${i}` : pieData[i].name,
            type: 'surface',
            parametric: true,
            wireframe: {
              show: false,
            },
            pieData: pieData[i],
            pieStatus: {
              selected: false,
              hovered: false,
              k: k,
            },
            radius: '50%',
            center: ['10%', '10%'],
          };

          if (typeof pieData[i].itemStyle != 'undefined') {
            let itemStyle = {};
            typeof pieData[i].itemStyle.color != 'undefined' ? (itemStyle.color = pieData[i].itemStyle.color) : null;
            typeof pieData[i].itemStyle.opacity != 'undefined'
              ? (itemStyle.opacity = pieData[i].itemStyle.opacity)
              : null;
            seriesItem.itemStyle = itemStyle;
          }
          series.push(seriesItem);
        }

        // 使用上一次遍历时，计算出的数据和 sumValue，调用 getParametricEquation 函数，
        // 向每个 series-surface 传入不同的参数方程 series-surface.parametricEquation，也就是实现每一个扇形。

        for (let i = 0; i < series.length; i++) {
          endValue = startValue + series[i].pieData.value;
          series[i].pieData.startRatio = startValue / sumValue;
          series[i].pieData.endRatio = endValue / sumValue;
          series[i].parametricEquation = getParametricEquation(
            series[i].pieData.startRatio,
            series[i].pieData.endRatio,
            false,
            false,
            k,
            series[i].pieData.value
          );
          startValue = endValue;
        }
        let boxHeight = getHeight3D(series, 25); //通过传参设定3d饼/环的高度，26代表26px
        // 准备待返回的配置项，把准备好的 legendData、series 传入。
        let option = {
          labelLine: {
            show: true,
            lineStyle: {
              color: '#404772',
            },
          },
          label: {
            show: true,
            position: 'outside',
            rich: {
              b: {
                fontSize: 24,
                lineHeight: 30,
                fontWeight: 'bold',
                color: '#fff',
              },
              c: {
                fontSize: 18,
                color: '#fff',
              },
            },
            // formatter: '{b|{b}}\n{c|{c}%}',
          },
          tooltip: {
            backgroundColor: '#000A8D',
            formatter: (params) => {
              if (params.seriesName !== 'mouseoutSeries' && params.seriesName !== 'pie2d') {
                let bfb = (
                  (option.series[params.seriesIndex].pieData.endRatio -
                    option.series[params.seriesIndex].pieData.startRatio) *
                  100
                ).toFixed(2);
                return (
                  `${params.seriesName}<br/>` +
                  `<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${params.color};"></span>` +
                  `${bfb}%`
                );
              }
            },
          },
          xAxis3D: {
            min: -1,
            max: 1,
          },
          yAxis3D: {
            min: -1,
            max: 1,
          },
          zAxis3D: {
            min: -1,
            max: 1,
          },
          grid3D: {
            show: false,
            boxHeight: boxHeight, //圆环的高度
            left: 0,
            top: 0, //3d饼图的位置
            viewControl: {
              //3d效果可以放大、旋转等，请自己去查看官方配置
              alpha: 20, //角度
              distance: 250, //调整视角到主体的距离，类似调整zoom
              rotateSensitivity: 0, //设置为0无法旋转
              zoomSensitivity: 0, //设置为0无法缩放
              panSensitivity: 0, //设置为0无法平移
              autoRotate: true, //自动旋转
            },
          },
          series: series,
        };
        return option;
      };

      //获取3d丙图的最高扇区的高度
      const getHeight3D = (series, height) => {
        series.sort((a, b) => {
          return b.pieData.value - a.pieData.value;
        });
        return (height * 25) / series[0].pieData.value;
      };

      // 生成扇形的曲面参数方程，用于 series-surface.parametricEquation
      const getParametricEquation = (startRatio, endRatio, isSelected, isHovered, k, h) => {
        // 计算
        let midRatio = (startRatio + endRatio) / 2;
        let startRadian = startRatio * Math.PI * 2;
        let endRadian = endRatio * Math.PI * 2;
        let midRadian = midRatio * Math.PI * 2;
        // 如果只有一个扇形，则不实现选中效果。
        if (startRatio === 0 && endRatio === 1) {
          isSelected = true;
        }
        // 通过扇形内径/外径的值，换算出辅助参数 k（默认值 1/3）
        k = typeof k !== 'undefined' ? k : 1 / 3;
        // 计算选中效果分别在 x 轴、y 轴方向上的位移（未选中，则位移均为 0）
        let offsetX = isSelected ? Math.cos(midRadian) * 0.1 : 0;
        let offsetY = isSelected ? Math.sin(midRadian) * 0.1 : 0;
        // 计算高亮效果的放大比例（未高亮，则比例为 1）
        let hoverRate = isHovered ? 1.05 : 1;
        // 返回曲面参数方程
        return {
          u: {
            min: -Math.PI,
            max: Math.PI * 3,
            step: Math.PI / 32,
          },
          v: {
            min: 0,
            max: Math.PI * 2,
            step: Math.PI / 20,
          },
          x: function (u, v) {
            if (u < startRadian) {
              return offsetX + Math.cos(startRadian) * (1 + Math.cos(v) * k) * hoverRate;
            }
            if (u > endRadian) {
              return offsetX + Math.cos(endRadian) * (1 + Math.cos(v) * k) * hoverRate;
            }
            return offsetX + Math.cos(u) * (1 + Math.cos(v) * k) * hoverRate;
          },
          y: function (u, v) {
            if (u < startRadian) {
              return offsetY + Math.sin(startRadian) * (1 + Math.cos(v) * k) * hoverRate;
            }
            if (u > endRadian) {
              return offsetY + Math.sin(endRadian) * (1 + Math.cos(v) * k) * hoverRate;
            }
            return offsetY + Math.sin(u) * (1 + Math.cos(v) * k) * hoverRate;
          },
          z: function (u, v) {
            if (u < -Math.PI * 0.5) {
              return Math.sin(u);
            }
            if (u > Math.PI * 2.5) {
              return Math.sin(u) * h * 0.1;
            }
            return Math.sin(v) > 0 ? 1 * h * 0.1 : -1;
          },
        };
      };

      var option = getPie3D(data, 0.8);
      // console.log(option);
      //是否需要label指引线，如果要就添加一个透明的2d饼状图并调整角度使得labelLine和3d的饼状图对齐，并再次setOption
      option.series.push({
        name: 'pie2d',
        type: 'pie',
        labelLine: {
          length: 10,
          length2: 10,
        },
        startAngle: -25, //起始角度，支持范围[0, 360]。
        clockwise: false, //饼图的扇区是否是顺时针排布。上述这两项配置主要是为了对齐3d的样式
        radius: ['65%', '65%'],
        center: ['55%', '48%'], //指示线的位置
        data: data,
        itemStyle: {
          opacity: 0,
        },
      });
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
  }
};
</script>

<style scoped>
@import '../../css/yaohao.css';
</style>
