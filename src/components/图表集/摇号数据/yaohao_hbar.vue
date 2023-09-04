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
        <div class="panel Bar">
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
    this.getData("http://sslapi.nadibao.cn/api/HzYaoHaoData/GetHZYaoHaoRegDataByYear") //获取摇号数据
    setTimeout(()=>{
      this.dev1(this.x, this.y);
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
            this.y[i] = res.data.data[i].NUM
            this.yearData.push({ value: res.data.data[i].NUM, name: res.data.data[i].NAME })
          }
        })

    },
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
            barCategoryGap: '20%',
            //柱子的宽度
            barWidth: '30%',
            // 显示柱子内的文字
            label: {
              show: true,
              color: '#fff',
              position: "right",
              // {c} 会自动的解析为 数据  data里面的数据
              // formatter: "{c}%"
            }
          },
          {
            name: "框",
            type: "bar",
            barCategoryGap: '20%',
            barWidth: '32%',
            yAxisIndex: 1,
            data: [800000, 800000, 800000, 800000, 800000, 800000],
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
  }
};
</script>

<style scoped>
@import '../../css/yaohao.css';
</style>
