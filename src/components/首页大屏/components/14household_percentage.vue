<template>
  <div class="LVbody">
    <div id="canvas"></div>
    <!-- 头部显示栏 -->
    <header>
      <h1 id="view">摇号数据展示</h1>
      <div class="showTime">{{ times }}</div>
    </header>
    <!-- 主体部分 -->
    <section class="mainbox">
      <!-- 中 -->
      <div class="column">
        <dv-border-box-7 class="border">
          <el-tooltip content="修改样式" placement="top">
            <el-button @click="drawer = true" type="default" icon="el-icon-edit" circle id="edit-btn"></el-button>
          </el-tooltip>

          <!-- 注解 -->
          <el-popover placement="top-start" title="" width="200" trigger="hover" class="refer_btn" content="注：图表详情信息">
            <el-button slot="reference" icon="el-icon-question" circle></el-button>
          </el-popover>

          <el-button @click="copy" icon="el-icon-share" circle>

          </el-button>
          <div class="chart" ref="chart"></div>
        </dv-border-box-7>
        <el-drawer :visible.sync="drawer" direction="ltr" custon-class="drawer" :modal=false>
          <span slot="title">
            相关参数配置项
          </span>
          <div class="drawer_content">

            <el-tabs type="border-card">
              <el-tab-pane>
                <span slot="label"><i class="el-icon-setting"></i> 定制</span>
                <div class="block">
                  <el-input v-model="title_text" placeholder="请输入图表名称">
                    <span slot="prepend">名称</span>
                  </el-input>
                </div>
                <el-collapse class="drawer_head" v-model="activeName" accordion style="fontSize: 18;">
                  <el-collapse-item title="图例" name="1">
                    <el-switch v-model="le_show" inactive-text="是否显示">隐藏
                    </el-switch><br>
                    <el-switch v-model="h_v" inactive-text="图例水平垂直切换" :disabled="!le_show">
                    </el-switch>
                    <div class="block">
                      <span class="demonstration">距离顶部距离(%)</span>
                      <el-slider v-model="top" show-input :disabled="!le_show">
                      </el-slider>
                    </div>
                    <div class="block">
                      <span class="demonstration">距离左边距离(%)</span>
                      <el-slider v-model="left" show-input :disabled="!le_show">
                      </el-slider>
                    </div>
                  </el-collapse-item>

                  <el-collapse-item title="背景标题样式" name="2">
                    <div class="block">
                      <el-input v-model="backgroundColor" placeholder="请选择背景颜色" class="input">
                        <span slot="prepend">背景颜色</span>
                      </el-input>
                      <el-color-picker show-alpha v-model="backgroundColor" class="colorPicker">
                      </el-color-picker><br>
                    </div>
                    <div class="block">
                      <span class="demonstration">标题距离顶部距离(%)</span>
                      <el-slider v-model="title_top" show-input>
                      </el-slider>
                    </div>
                    <div class="block">
                      <span class="demonstration">标题距离左侧距离(%)</span>
                      <el-slider v-model="title_left" show-input>
                      </el-slider>
                    </div>
                    <div class="block">
                      <el-input v-model="titleColor" placeholder="请选择标题颜色" class="input">
                        <span slot="prepend">标题颜色</span>
                      </el-input>
                      <el-color-picker show-alpha v-model="titleColor" class="colorPicker">
                      </el-color-picker><br>
                    </div>
                    <div class="block">
                      <span class="demonstration">标题大小</span>
                      <el-slider v-model="fontSize" show-input>
                      </el-slider>
                    </div>
                  </el-collapse-item>

                  <el-collapse-item title="布局" name="6">
                    <el-switch v-model="graphic_show" inactive-text="数据来源隐藏">
                    </el-switch>
                    <div class="block">
                      <span class="demonstration">厚度</span>
                      <el-slider v-model="pieH" show-input>
                      </el-slider>
                    </div>
                    <div class="block">
                      <span class="demonstration">扇形之间的间隙大小</span>
                      <el-slider v-model="pieD" show-input>
                      </el-slider>
                    </div>
                    <div class="block">
                      <span class="demonstration">内外半径比例因子</span>
                      <el-slider v-model="pieR" show-input>
                      </el-slider>
                    </div>
                    <el-switch v-model="customText_show" inactive-text="自定义文案隐藏(可拖动)">
                    </el-switch>
                    <el-input type="textarea" v-model="customText" placeholder="请输入自定义文案" :disabled="customText_show">
                    </el-input>
                  </el-collapse-item>

                  <el-collapse-item title="图标签" name="7">
                    <el-switch v-model="itemLabel_show" inactive-text="图标签是否显示" class="switch">
                    </el-switch>
                    <div class="block">
                      <el-input v-model="textColor" placeholder="请选择字体颜色" class="input" :disabled="!itemLabel_show">
                        <span slot="prepend">字体颜色</span>
                      </el-input>
                      <el-color-picker show-alpha v-model="textColor" class="colorPicker" :disabled="!itemLabel_show">
                      </el-color-picker><br>
                    </div>
                  </el-collapse-item>
                </el-collapse>
              </el-tab-pane>

              <el-tab-pane>
                <span slot="label"><i class="el-icon-star-off"></i>主题风格</span>
                <el-upload class="avatar-uploader" action="https://yhyzsapi.nadibao.cn/api/Complaint/Upfile"
                  :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
                  <img v-if="imageUrl" :src="imageUrl" class="avatar">
                  <i v-else class="el-icon-picture avatar-uploader-icon"></i>
                </el-upload>

                <!-- <div class="col-head">
                主题颜色
              </div> -->

                <div class="col-body" v-for="(item, index) in theme" :key="index" @click=changeTheme(item)>
                  <a class="theme-plan-group" style="background-color: transparent;">
                    <div class="theme-plan-text">{{ item.value }}</div>
                    <div v-for="(color, colorIndex) in item.colors" :key="colorIndex" class="theme-plan-color"
                      :style="{ backgroundColor: color }"></div>
                  </a>
                </div>

              </el-tab-pane>

              <el-tab-pane>
                <span slot="label"><i class="el-icon-full-screen"></i>尺寸大小</span>
              </el-tab-pane>
              <el-tab-pane>
                <span slot="label"><i class="el-icon-magic-stick"></i>动画</span>
              </el-tab-pane>
            </el-tabs>

          </div>

        </el-drawer>

      </div>
    </section>

  </div>
</template>

<script>
import * as echarts from 'echarts'
import 'echarts-gl'
import axios from 'axios'
var vm = null
import vintage from '../../../../static/js/vintage'
import macarons from '../../../../static/js/macarons'
import dark from '../../../../static/js/dark'
import shine from '../../../../static/js/shine'
import infographic from '../../../../static/js/infographic'
import roma from '../../../../static/js/roma'
import methods from '../js/methods'

export default {
  mixins: [vintage, macarons, dark, shine, infographic, roma],
  data() {
    return {
      // 系统参数
      times: '',

      //数据
      x: [],
      y1: [],
      y2: [],
      rate: [],
      data: [],
      color: ["#2ec7c9", "#b6a2de", "#5ab1ef", "#ffb980", "#d87a80", "#8d98b3"],

      // 样式配置参数
      drawer: false,
      activeName: '',
      title_text: "杭州摇号户别占比情况",
      le_show: true,
      h_v: true,
      graphic_show: false,
      itemLabel_show: true,
      border_dis: 10,
      top: 5,
      left: 37,
      backgroundColor: '',
      titleColor: '#000000',
      textColor: '#000000',
      title_top: 0,
      title_left: 50,
      fontSize: 16,
      radius: 16,
      customText: '自定义文案',
      customText_show: true,
      pieH: 10,
      pieD: 10,
      pieR: 10,
      imageUrl: '',
      theme: [
        { value: '明亮', colors: ['#4992ff', '#7cffb2', '#fddd60', '#58d9f9', '#05c091', '#ff8a45'] },
        { value: '粉青', colors: ["#fc97af", "#87f7cf", "#f7f494", "#72ccff", "#f7c5a0", "#d4a4eb"] },
        { value: '蓝绿', colors: ["#2ec7c9", "#b6a2de", "#5ab1ef", "#ffb980", "#d87a80", "#8d98b3"] },
        { value: '橘红', colors: ["#893448", "#d95850", "#eb8146", "#ffb248", "#f2d643", "#ebdba4"] },
        { value: '青草', colors: ["#2ec7c9", "#b6a2de", "#5ab1ef", "#ffb980", "#d87a80", "#8d98b3"] },
        { value: '复古', colors: ["#e01f54", "#5e4ea5", "#f5e8c8", "#b8d2c7", "#c6b38e", "#a4d8c2"] },

      ],
      currentTheme: '',
      myChart: null
    };
  },
  created() {
    vm = this
  },
  async mounted() {
    methods.initWatermark()
    // 获取时间
    this.getTimes()
    await this.getData() //获取摇号数据
    // 初始化图表
    this.myChart = echarts.init(this.$refs.chart, this.currentTheme)
    this.drawChart();
  },
  // 在Vue实例销毁前，清除定时器
  beforeDestroy() {
    if (this.times) {
      clearInterval(this.getTimesInterval);
    }
  },
  computed: {
    change() {
      const {
        le_show,
        h_v,
        graphic_show,
        itemLabel_show,
        border_dis,
        top,
        left,
        backgroundColor,
        titleColor,
        textColor,
        title_top,
        title_left,
        fontSize,
        radius,
        customText,
        customText_show,
        pieH,
        pieD,
        pieR,
        imageUrl,
        currentTheme
      } = this
      return {
        le_show,
        h_v,
        graphic_show,
        itemLabel_show,
        border_dis,
        top,
        left,
        backgroundColor,
        titleColor,
        textColor,
        title_top,
        title_left,
        fontSize,
        radius,
        customText,
        customText_show,
        pieH,
        pieD,
        pieR,
        imageUrl,
        currentTheme
      }
    }
  },
  watch: {
    title_text: {
      deep: true,
      immediate: true,
      handler: async function (newval, oldval) {
        if (this.$refs.chart) {
          this.drawChart(this.currentTheme);
          // console.log(newval, oldval)
        }
        // console.log("charts是否存在", this.$refs.chart)
      }
    },
    change(val) {
      if (this.$refs.chart) {
        this.myChart.dispose()
        // console.log()
        this.myChart = echarts.init(this.$refs.chart, this.currentTheme)
        this.drawChart();
      }
      // console.log(val)
    },
  },
  methods: {
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
    // 切换主题
    changeTheme(newtheme) {
      if (newtheme.value == '复古') {
        this.currentTheme = 'vintage'
        // echarts.init(this.$refs.chart,this.currentTheme)
        console.log("调用changeTheme", this.currentTheme)
      } else if (newtheme.value == '明亮') {
        this.currentTheme = 'macarons'
      } else if (newtheme.value == '粉青') {
        this.currentTheme = 'dark'
      } else if (newtheme.value == '蓝绿') {
        this.currentTheme = 'shine'
      } else if (newtheme.value == '橘红') {
        this.currentTheme = 'infographic'
      } else if (newtheme.value == '青草') {
        this.currentTheme = 'roma'
      }

    },
    // 分享链接
    copy() {
      this.$message({
        message: '分享链接已复制到剪贴板',
        type: 'success'
      });
      let sharelink = location.href;
      this.$copyText(sharelink).then(
        res => {
          console.log(res.text)
        },
        err => {
          console.log(err)
        }
      )
    },
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
      console.log(this.imageUrl)
    },
    beforeAvatarUpload(file) {
      // const isJPG = file.type === 'image/jpeg';
      // const isLt2M = file.size / 1024 / 1024 < 2;

      // if (!isJPG) {
      //   this.$message.error('上传头像图片只能是 JPG 格式!');
      // }
      // if (!isLt2M) {
      //   this.$message.error('上传头像图片大小不能超过 2MB!');
      // }
      // return isJPG && isLt2M;
    },
    async getData() {
      await axios.get("http://sslapi.nadibao.cn/api/HzYaoHaoData/Get_PEOPLE_PROVINCE_CITY_NUM_ALLYEAR")
        .then(res => {
          var res = res.data.data
          for (var i = 0; i < res.length; i++) {
            if (res[i].NAME == 'FAMILY_BUYER') {
              this.x[i] = res[i].NAME
              this.y1[i] = parseFloat((res[i].NUM / 10000).toFixed(2))
              this.rate[i] = parseFloat((res[i].RATE).toFixed(2))
              this.data.push({ value: parseFloat((res[i].RATE * 100).toFixed(2)), name: '家庭购房', itemStyle: { color: this.color[i], }, })
            }
            else if (res[i].NAME == 'PERSONAL_BUYER') {
              this.x[i] = res[i].NAME
              this.y1[i] = parseFloat((res[i].NUM / 10000).toFixed(2))
              this.rate[i] = parseFloat((res[i].RATE).toFixed(2))
              this.data.push({ value: parseFloat((res[i].RATE * 100).toFixed(2)), name: '个人购房', itemStyle: { color: this.color[i], }, })
            }
          }
          // console.log(this.y)
        })
    },
    drawChart() {
      // 1. 实例化对象
      // var myChart = echarts.init(document.querySelector(".line .chart"));
      var data = this.data

      function getParametricEquation(startRatio, endRatio, isSelected, isHovered, k) {
        // 计算
        let midRatio = (startRatio + endRatio) / 2;

        let startRadian = startRatio * Math.PI * 2;
        let endRadian = endRatio * Math.PI * 2;
        let midRadian = midRatio * Math.PI * 2;

        // 如果只有一个扇形，则不实现选中效果。
        if (startRatio === 0 && endRatio === 1) {
          isSelected = false;
        }

        // 通过扇形内径/外径的值，换算出辅助参数 k（默认值 1/3）
        k = typeof k !== "undefined" ? k : 1 / 3;

        // 计算选中效果分别在 x 轴、y 轴方向上的位移（未选中，则位移均为 0）
        let offsetX = isSelected ? Math.cos(midRadian) * vm.pieD / 100 : 0;
        let offsetY = isSelected ? Math.sin(midRadian) * vm.pieD / 100 : 0;

        // 计算高亮效果的放大比例（未高亮，则比例为 1）
        let hoverRate = isHovered ? 1.05 : 1;

        // 返回曲面参数方程
        return {
          u: {
            min: -Math.PI,
            max: Math.PI * 3,
            step: Math.PI / 32
          },

          v: {
            min: 0,
            max: Math.PI * 2,
            step: Math.PI / 20
          },

          x: function (u, v) {
            if (u < startRadian) {
              return (
                offsetX +
                Math.cos(startRadian) * (1 + Math.cos(v) * k) * hoverRate
              );
            }
            if (u > endRadian) {
              return (
                offsetX + Math.cos(endRadian) * (1 + Math.cos(v) * k) * hoverRate
              );
            }
            return offsetX + Math.cos(u) * (1 + Math.cos(v) * k) * hoverRate;
          },

          y: function (u, v) {
            if (u < startRadian) {
              return (
                offsetY +
                Math.sin(startRadian) * (1 + Math.cos(v) * k) * hoverRate
              );
            }
            if (u > endRadian) {
              return (
                offsetY + Math.sin(endRadian) * (1 + Math.cos(v) * k) * hoverRate
              );
            }
            return offsetY + Math.sin(u) * (1 + Math.cos(v) * k) * hoverRate;
          },

          z: function (u, v) {
            if (u < -Math.PI * 0.5) {
              return Math.sin(u);
            }
            if (u > Math.PI * 2.5) {
              return Math.sin(u);
            }
            return Math.sin(v) > 0 ? 1 : -1;
          }
        };
      }

      // 生成模拟 3D 饼图的配置项 
      function getPie3D(pieData, internalDiameterRatio) {
        let series = [];
        let sumValue = 0;
        let startValue = 25;
        let endValue = 0;
        let legendData = [];
        let k =
          typeof internalDiameterRatio !== "undefined" ?
            (1 - internalDiameterRatio) / (1 + internalDiameterRatio) :
            1 / 3;

        // 为每一个饼图数据，生成一个 series-surface 配置
        for (let i = 0; i < pieData.length; i++) {
          sumValue += pieData[i].value;

          let seriesItem = {
            name: typeof pieData[i].name === "undefined" ?
              `series${i}` : pieData[i].name,
            type: "surface",
            parametric: true,
            wireframe: {
              show: false
            },
            pieData: pieData[i],
            pieStatus: {
              selected: false,
              hovered: false,
              k: k
            }
          };

          if (typeof pieData[i].itemStyle != "undefined") {
            let itemStyle = {};

            typeof pieData[i].itemStyle.color != "undefined" ?
              (itemStyle.color = pieData[i].itemStyle.color) :
              null;
            typeof pieData[i].itemStyle.opacity != "undefined" ?
              (itemStyle.opacity = pieData[i].itemStyle.opacity) :
              null;

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
            true,
            false,
            k
          );

          startValue = endValue;

          legendData.push(series[i].name);
        }

        // 补充一个透明的圆环，用于支撑高亮功能的近似实现。
        series.push(
          //   {
          //   name: "内圆环",
          //   type: "surface",
          //   parametric: true,
          //   wireframe: {
          //     show: false
          //   },
          //   itemStyle: {
          //     opacity: 1,
          //     color: "rgba(18,236,252,.5)"
          //   },
          //   parametricEquation: {
          //     u: {
          //       min: 0,
          //       max: Math.PI * 2,
          //       step: Math.PI / 20
          //     },
          //     v: {
          //       min: 0,
          //       max: Math.PI,
          //       step: Math.PI / 1.4
          //     },
          //     x: function (u, v) {
          //       return Math.sin(v) * Math.sin(u) + Math.sin(u);
          //     },
          //     y: function (u, v) {
          //       return Math.sin(v) * Math.cos(u) + Math.cos(u);
          //     },
          //     z: function (u, v) {
          //       return Math.cos(v) > 0 ? 0.1 : -0.1;
          //     }
          //   }
          // },
          // {
          //   name: 'pie2d',
          //   type: 'pie',
          //   labelLine: {
          //     length: 100,
          //     length2: 10,
          //   },
          //   startAngle: 80, //起始角度，支持范围[0, 360]。
          //   clockwise: false, //饼图的扇区是否是顺时针排布。上述这两项配置主要是为了对齐3d的样式
          //   radius: ['30%', '30%'],
          //   center: ['50%', '50%'], //指示线的位置
          //   data: data,
          //   itemStyle: {
          //     opacity: 0,
          //   },
          // }
        );
        // 准备待返回的配置项，把准备好的 legendData、series 传入。
        // console.log(typeof name1[1])
        let option = {
          //animation: false,
          backgroundColor: vm.backgroundColor,
          title: {
            text: vm.title_text,
            textAlign: 'center',
            left: `${vm.title_left + '%'}`,
            top: `${vm.title_top + '%'}`,
            textStyle: {
              color: vm.titleColor,
              fontSize: vm.fontSize,
            }
          },
          legend: {
            data: ['家庭购房', '个人购房'],
            show: vm.le_show,
            orient: vm.h_v ? 'horizontal' : 'vertical',
            name: '',
            left: `${vm.left + '%'}`,
            top: `${vm.top + "%"}`,
            textStyle: {
              color: "rgba(0,0,0,.6)"
            },
          },
          graphic: [{
            type: 'text',
            ignore: vm.customText_show,
            draggable: true,
            top: 'center',
            right: 'center',
            style: {
              text: vm.customText,
              font: '14px Helvetica Neue',
              height: '1.0625rem '
            },
            z: 1000
          },
          {
            type: 'text',
            ignore: vm.graphic_show,
            bottom: 28,
            right: 10,
            style: {
              text: ['制作：数视灵'
              ].join('\n'),
              font: '14px Helvetica Neue',
              height: '1.0625rem '
            }
          },
          {
            type: 'text',
            ignore: vm.graphic_show,
            bottom: 28,
            left: 10,
            style: {
              text: ['数据来源：拿地宝',
              ].join('\n'),
              font: '14px Helvetica Neue',
              height: '1.0625rem '
            }
          },],
          // labelLine: {
          //   show: true,
          //   lineStyle: {
          //     color: '#00f',
          //   },
          // },
          // label: {
          //   show: true,
          //   position: 'outside',
          // },
          toolbox: {
            feature: {
              mark: {
                show: true
              },
              // magicType: {
              //   show: true,
              //   type: ['line', 'bar', 'stack']
              // },
              restore: { show: true },
              saveAsImage: {
                show: true
              },
            }
          },
          tooltip: {
            formatter: params => {
              if (params.seriesName !== '内圆环') {
                return `${params.seriesName}<br/><span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${params.color};"></span>${option.series[params.seriesIndex].pieData.value}%`;
              }
            }
          },
          xAxis3D: {
            min: -1.3,
            max: 1.3
          },
          yAxis3D: {
            min: -1.3,
            max: 1.3
          },
          zAxis3D: {
            min: -1.3,
            max: 1.3
          },
          grid3D: {
            show: false,
            boxHeight: vm.pieH,
            // top: '30%',
            left: "0",
            bottom: "50%",
            viewControl: {
              //3d效果可以放大、旋转等，请自己去查看官方配置

              alpha: 20,
              // beta: 40,
              rotateSensitivity: 1,
              zoomSensitivity: 1,
              panSensitivity: 0,
              autoRotate: false,
              //   autoRotateSpeed: 5,
              // autoRotateAfterStill: 10
            },
          },
          series: series
        };
        return option;
      }

      // 传入数据生成 option
      // console.log(data)
      let option = getPie3D(data, this.pieR / 100);
      // 3. 把配置项给实例对象
      this.myChart.setOption(option);
      // 4. 让图表跟随屏幕自动的去适应
      window.addEventListener("resize", function () {
        vm.myChart.resize();
        // })
      })
    },
  }
};
</script>

<style scoped>
@import '../../css/yaohao.css';
</style>
