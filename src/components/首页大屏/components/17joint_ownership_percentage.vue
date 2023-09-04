<template>
  <el-card id="echartsCard">
    <div id="canvas"></div>
    <div class="chart_box" @click="zoom">
      <div class="chart" ref="chart"></div>
    </div>
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
                  <span class="demonstration">内外半径比例因子</span>
                  <el-slider v-model="pieR" show-input>
                  </el-slider>
                </div>
                <el-switch v-model="customText_show" inactive-text="自定义文案隐藏(可拖动)">
                </el-switch>
                <el-input type="textarea" v-model="customText" placeholder="请输入自定义文案" :disabled="customText_show">
                </el-input>
              </el-collapse-item>

              <el-collapse-item title="数据标签" name="7">
                <el-switch v-model="itemLabel_show" inactive-text="数据标签是否显示" class="switch">
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
        </el-tabs>

      </div>

    </el-drawer>

    <el-dialog :visible.sync="dialogVisable" :fullscreen="true" :before-close="destory" center>
      <el-tooltip v-show="dialogVisable" content="修改样式" placement="top">
        <el-button @click="drawer = true" type="default" icon="el-icon-edit" circle id="edit-btn"></el-button>
      </el-tooltip>

      <!-- 注解 -->
      <el-popover v-show="dialogVisable" placement="top-start" title="" width="200" trigger="hover" class="refer_btn"
        content="注：图表详情信息">
        <el-button slot="reference" icon="el-icon-question" circle></el-button>
      </el-popover>

      <el-button v-show="dialogVisable" @click="copy" icon="el-icon-share" circle>

      </el-button>
      <show-table :title="title_text" :resData="resData" />
      <div id="fullScreenMask">
        <div class="chart" ref="fullOne"></div>
      </div>
    </el-dialog>

  </el-card>
</template>

<script>
import * as echarts from 'echarts'
import showTable from "./showTable.vue"
import methods from '../../图表集/js/methods'
import 'echarts-gl'
import axios from 'axios'
var vm = null
import vintage from '../../../../static/js/vintage'
import macarons from '../../../../static/js/macarons'
import dark from '../../../../static/js/dark'
import shine from '../../../../static/js/shine'
import infographic from '../../../../static/js/infographic'
import roma from '../../../../static/js/roma'

export default {
  mixins: [vintage, macarons, dark, shine, infographic, roma],
  components: { showTable },
  data() {
    return {
      // 系统参数
      times: '',
      //放大后显示其他配置
      dialogVisable: false,
      dialogTableVisible: false,
      resData: {}, // 请求的数据,
      fullChart: null,
      tool_show: true,

      // 数据
      x: [],
      y: [],
      optionData: [],
      option: '',

      // 样式配置参数
      drawer: false,
      activeName: '',
      title_text: "杭州摇号人次例年占比",
      le_show: true,
      h_v: true,
      graphic_show: false,
      itemLabel_show: true,
      border_dis: 10,
      top: 10,
      left: 30,
      backgroundColor: '',
      titleColor: '#000000',
      textColor: '#000000',
      title_top: 3,
      title_left: 50,
      fontSize: 16,
      radius: 16,
      customText: '自定义文案',
      customText_show: true,
      pieR: 80,
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
    // methods.initWatermark()
    await this.getData() //获取摇号数据
    // 初始化图表
    this.myChart = echarts.init(this.$refs.chart, this.currentTheme)
    this.drawChart();
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
      handler: function (newval, oldval) {
        if (this.$refs.fullOne) {
          this.fullChart.dispose()
          // console.log()
          this.fullChart = echarts.init(this.$refs.fullOne, this.currentTheme)
          this.fullChart.setOption(this.drawChart());
        }
        // console.log("charts是否存在", this.$refs.chart)
      },
    },
    change(val) {
      if (this.$refs.fullOne) {
        this.fullChart.dispose()
        // console.log()
        this.fullChart = echarts.init(this.$refs.fullOne, this.currentTheme)
        this.fullChart.setOption(this.drawChart());
      }
      // console.log(val)
    },
  },
  methods: {
    zoom() {
      this.dialogVisable = true;
      this.$nextTick(() => {
        const chartFull = this.$refs.fullOne;

        if (chartFull) {
          this.fullChart = echarts.init(this.$refs.fullOne, this.currentTheme);
          let options = this.drawChart();

          // console.log(options);
          this.fullChart.setOption(options);
        }
      })
      // console.log("触发子组件的函数");

      this.$emit("zoom-in");
    },
    destory(done) {
      this.$confirm("确认关闭?")
        .then((_) => {
          this.dialogVisable = false;
          this.fullChart.dispose();
          this.drawChart();
          done();
        })
        .catch((_) => { });
    },
    showTable() {
      this.dialogTableVisible = !this.dialogTableVisible;
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
      await axios.get("http://sslapi.nadibao.cn/api/HzYaoHaoData/Get_MID_YEAR_ADD_NUM_ONEYEAR_AND_ALLYEAAR")
        .then(res => {
          this.resData = res.data.data;
          for (var i = 0; i < this.resData.length; i++) {
            this.x[i] = this.resData[i].NAME
            this.y[i] = parseFloat((this.resData[i].NUM_RENCI / 10000).toFixed(2))
            // this.renshu[i] = parseFloat((this.resData[i].NUM_RENSHU / 10000).toFixed(2))
            // this.rate[i] = parseFloat((this.resData[i].RENCI_DIVISION_RENSHU).toFixed(2))
            // this.nd[i] = parseFloat((this.resData[i].NUM_ONEYEAR / 10000).toFixed(2))
            // this.cz[i] = parseFloat((this.resData[i].NUM_ALLYEAR / 10000).toFixed(2))
            // this.lj[i] = parseFloat((this.resData[i].NUM_ONE_CUT_ALL / 10000).toFixed(2))
            // this.cj[i] = parseFloat((this.resData[i].NUM_HOUSE_DEAL / 10000).toFixed(2))
            // this.sy[i] = parseFloat((this.resData[i].NUM_REST_RENSHU / 10000).toFixed(2))
            // this.ls[i] = parseFloat((this.resData[i].NUM_LOST_RENSHU / 10000).toFixed(2))
            this.optionData.push({ value: parseFloat((this.resData[i].NUM_RENCI / 10000).toFixed(2)), name: this.resData[i].NAME, itemStyle: { color: this.theme[1].colors[i] } })
          }
          // console.log(this.res)
        })
    },
    drawChart() {
      //构建3d饼状图
      // let myChart = echarts.init(document.querySelector(".line .chart"));
      // 传入数据生成 option
      this.option = this.getPie3D(this.optionData, this.pieR / 100);
      this.myChart.setOption(this.option);
      return this.option
      //是否需要label指引线，如果要就添加一个透明的2d饼状图并调整角度使得labelLine和3d的饼状图对齐，并再次setOption
      // this.option.series.push({
      //   name: 'pie2d',
      //   type: 'pie',
      //   labelLine: {
      //     length: 10,
      //     length2: 10
      //   },
      //   startAngle: -20, //起始角度，支持范围[0, 360]。
      //   clockwise: false,//饼图的扇区是否是顺时针排布。上述这两项配置主要是为了对齐3d的样式
      //   radius: ['20%', '50%'],
      //   center: ['50%', '50%'],
      //   data: this.optionData,
      //   itemStyle: {
      //     opacity: 0
      //   }
      // });
      // this.myChart.setOption(this.option);
      this.bindListen(this.myChart);
    },

    getPie3D(pieData, internalDiameterRatio) {
      //internalDiameterRatio:透明的空心占比
      let that = this;
      let series = [];
      let sumValue = 0;
      let startValue = 0;
      let endValue = 0;
      let legendData = [];
      let legendBfb = [];
      let k = 1 - internalDiameterRatio;
      pieData.sort((a, b) => {
        return (b.value - a.value);
      });
      // 为每一个饼图数据，生成一个 series-surface 配置
      for (let i = 0; i < pieData.length; i++) {
        sumValue += pieData[i].value;
        let seriesItem = {
          name: typeof pieData[i].name === 'undefined' ? `series${i}` : pieData[i].name,
          type: 'surface',
          parametric: true,
          wireframe: {
            show: false
          },
          pieData: pieData[i],
          pieStatus: {
            selected: false,
            hovered: false,
            k: k
          },
          center: ['10%', '50%']
        };

        if (typeof pieData[i].itemStyle != 'undefined') {
          let itemStyle = {};
          typeof pieData[i].itemStyle.color != 'undefined' ? itemStyle.color = pieData[i].itemStyle.color : null;
          typeof pieData[i].itemStyle.opacity != 'undefined' ? itemStyle.opacity = pieData[i].itemStyle.opacity : null;
          seriesItem.itemStyle = itemStyle;
        }
        series.push(seriesItem);
      }

      // 使用上一次遍历时，计算出的数据和 sumValue，调用 getParametricEquation 函数，
      // 向每个 series-surface 传入不同的参数方程 series-surface.parametricEquation，也就是实现每一个扇形。
      legendData = [];
      legendBfb = [];
      for (let i = 0; i < series.length; i++) {
        endValue = startValue + series[i].pieData.value;
        series[i].pieData.startRatio = startValue / sumValue;
        series[i].pieData.endRatio = endValue / sumValue;
        series[i].parametricEquation = this.getParametricEquation(series[i].pieData.startRatio, series[i].pieData.endRatio,
          false, false, k, series[i].pieData.value);
        startValue = endValue;
        let bfb = that.fomatFloat(series[i].pieData.value / sumValue, 4);
        legendData.push({
          name: series[i].name,
          value: bfb
        });
        legendBfb.push({
          name: series[i].name,
          value: bfb
        });
      }
      let boxHeight = this.getHeight3D(series, 26);//通过传参设定3d饼/环的高度，26代表26px
      // 准备待返回的配置项，把准备好的 legendData、series 传入。
      let option = {
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
          show: vm.dialogVisable ? vm.le_show : false,
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
          ignore: vm.dialogVisable ? vm.customText_show : true,
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
          ignore: vm.dialogVisable ? vm.graphic_show : true,
          bottom: 28,
          right: 10,
          style: {
            text: ['数据来源：拿地宝'
            ].join('\n'),
            font: '14px Helvetica Neue',
            height: '1.0625rem '
          }
        },
        {
          type: 'text',
          ignore: vm.dialogVisable ? vm.graphic_show : true,
          bottom: 28,
          left: 10,
          style: {
            text: ['制作：数视灵',
            ].join('\n'),
            font: '14px Helvetica Neue',
            height: '1.0625rem '
          }
        },],
        toolbox: {
          show: vm.dialogVisable ? vm.tool_show : false,
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
            if (params.seriesName !== 'mouseoutSeries' && params.seriesName !== 'pie2d') {
              let bfb = ((option.series[params.seriesIndex].pieData.endRatio - option.series[params.seriesIndex].pieData.startRatio) *
                100).toFixed(2);
              return `${params.seriesName}<br/>` +
                `<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${params.color};"></span>` +
                `${bfb}%`;
            }
          }
        },
        xAxis3D: {
          min: -1,
          max: 1
        },
        yAxis3D: {
          min: -1,
          max: 1
        },
        zAxis3D: {
          min: -1,
          max: 1
        },
        grid3D: {
          show: false,
          boxHeight: boxHeight, //圆环的高度
          viewControl: { //3d效果可以放大、旋转等，请自己去查看官方配置
            alpha: 40, //角度
            distance: 300,//调整视角到主体的距离，类似调整zoom
            rotateSensitivity: 1, //设置为0无法旋转
            zoomSensitivity: 1, //设置为0无法缩放
            panSensitivity: 1, //设置为0无法平移
            autoRotate: false //自动旋转
          }
        },
        series: series
      };
      return option;
    },

    //获取3d丙图的最高扇区的高度
    getHeight3D(series, height) {
      series.sort((a, b) => {
        return (b.pieData.value - a.pieData.value);
      })
      return height * 25 / series[0].pieData.value;
    },

    // 生成扇形的曲面参数方程，用于 series-surface.parametricEquation
    getParametricEquation(startRatio, endRatio, isSelected, isHovered, k, h) {
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
          step: Math.PI / 32
        },
        v: {
          min: 0,
          max: Math.PI * 2,
          step: Math.PI / 20
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
            return Math.sin(u) * h * .1;
          }
          return Math.sin(v) > 0 ? 1 * h * .1 : -1;
        }
      };
    },

    fomatFloat(num, n) {
      var f = parseFloat(num);
      if (isNaN(f)) {
        return false;
      }
      f = Math.round(num * Math.pow(10, n)) / Math.pow(10, n); // n 幂
      var s = f.toString();
      var rs = s.indexOf('.');
      //判定如果是整数，增加小数点再补0
      if (rs < 0) {
        rs = s.length;
        s += '.';
      }
      while (s.length <= rs + n) {
        s += '0';
      }
      return s;
    },

    bindListen(myChart) {
      // 监听鼠标事件，实现饼图选中效果（单选），近似实现高亮（放大）效果。
      let that = this;
      let selectedIndex = '';
      let hoveredIndex = '';
      // 监听点击事件，实现选中效果（单选）
      // myChart.on('click', function (params) {
      //   // 从 option.series 中读取重新渲染扇形所需的参数，将是否选中取反。
      //   let isSelected = !that.option.series[params.seriesIndex].pieStatus.selected;
      //   let isHovered = that.option.series[params.seriesIndex].pieStatus.hovered;
      //   let k = that.option.series[params.seriesIndex].pieStatus.k;
      //   let startRatio = that.option.series[params.seriesIndex].pieData.startRatio;
      //   let endRatio = that.option.series[params.seriesIndex].pieData.endRatio;
      //   // 如果之前选中过其他扇形，将其取消选中（对 option 更新）
      //   if (selectedIndex !== '' && selectedIndex !== params.seriesIndex) {
      //     that.option.series[selectedIndex].parametricEquation = that.getParametricEquation(that.option.series[
      //       selectedIndex].pieData
      //       .startRatio, that.option.series[selectedIndex].pieData.endRatio, false, false, k, that.option.series[
      //         selectedIndex].pieData
      //       .value);
      //     that.option.series[selectedIndex].pieStatus.selected = false;
      //   }
      //   // 对当前点击的扇形，执行选中/取消选中操作（对 option 更新）
      //   that.option.series[params.seriesIndex].parametricEquation = that.getParametricEquation(startRatio, endRatio,
      //     isSelected,
      //     isHovered, k, that.option.series[params.seriesIndex].pieData.value);
      //   that.option.series[params.seriesIndex].pieStatus.selected = isSelected;
      //   // 如果本次是选中操作，记录上次选中的扇形对应的系列号 seriesIndex
      //   isSelected ? selectedIndex = params.seriesIndex : null;
      //   // 使用更新后的 option，渲染图表
      //   myChart.setOption(that.option);
      // });
      // 监听 mouseover，近似实现高亮（放大）效果
      myChart.on('mouseover', function (params) {
        // 准备重新渲染扇形所需的参数
        let isSelected;
        let isHovered;
        let startRatio;
        let endRatio;
        let k;
        // 如果触发 mouseover 的扇形当前已高亮，则不做操作
        if (hoveredIndex === params.seriesIndex) {
          return;
          // 否则进行高亮及必要的取消高亮操作
        } else {
          // 如果当前有高亮的扇形，取消其高亮状态（对 option 更新）
          if (hoveredIndex !== '') {
            // 从 option.series 中读取重新渲染扇形所需的参数，将是否高亮设置为 false。
            isSelected = that.option.series[hoveredIndex].pieStatus.selected;
            isHovered = false;
            startRatio = that.option.series[hoveredIndex].pieData.startRatio;
            endRatio = that.option.series[hoveredIndex].pieData.endRatio;
            k = that.option.series[hoveredIndex].pieStatus.k;
            // 对当前点击的扇形，执行取消高亮操作（对 option 更新）
            that.option.series[hoveredIndex].parametricEquation = that.getParametricEquation(startRatio, endRatio,
              isSelected,
              isHovered, k, that.option.series[hoveredIndex].pieData.value);
            that.option.series[hoveredIndex].pieStatus.hovered = isHovered;
            // 将此前记录的上次选中的扇形对应的系列号 seriesIndex 清空
            hoveredIndex = '';
          }
          // 如果触发 mouseover 的扇形不是透明圆环，将其高亮（对 option 更新）
          if (params.seriesName !== 'mouseoutSeries' && params.seriesName !== 'pie2d') {
            // 从 option.series 中读取重新渲染扇形所需的参数，将是否高亮设置为 true。
            isSelected = that.option.series[params.seriesIndex].pieStatus.selected;
            isHovered = true;
            startRatio = that.option.series[params.seriesIndex].pieData.startRatio;
            endRatio = that.option.series[params.seriesIndex].pieData.endRatio;
            k = that.option.series[params.seriesIndex].pieStatus.k;
            // 对当前点击的扇形，执行高亮操作（对 option 更新）
            that.option.series[params.seriesIndex].parametricEquation = that.getParametricEquation(startRatio, endRatio,
              isSelected, isHovered, k, that.option.series[params.seriesIndex].pieData.value + 5);
            that.option.series[params.seriesIndex].pieStatus.hovered = isHovered;
            // 记录上次高亮的扇形对应的系列号 seriesIndex
            hoveredIndex = params.seriesIndex;
          }
          // 使用更新后的 option，渲染图表
          myChart.setOption(that.option);
        }
      });
      // 修正取消高亮失败的 bug
      myChart.on('globalout', function () {
        // 准备重新渲染扇形所需的参数
        let isSelected;
        let isHovered;
        let startRatio;
        let endRatio;
        let k;
        if (hoveredIndex !== '') {
          // 从 option.series 中读取重新渲染扇形所需的参数，将是否高亮设置为 true。
          isSelected = that.option.series[hoveredIndex].pieStatus.selected;
          isHovered = false;
          k = that.option.series[hoveredIndex].pieStatus.k;
          startRatio = that.option.series[hoveredIndex].pieData.startRatio;
          endRatio = that.option.series[hoveredIndex].pieData.endRatio;
          // 对当前点击的扇形，执行取消高亮操作（对 option 更新）
          that.option.series[hoveredIndex].parametricEquation = that.getParametricEquation(startRatio, endRatio,
            isSelected,
            isHovered, k, that.option.series[hoveredIndex].pieData.value);
          that.option.series[hoveredIndex].pieStatus.hovered = isHovered;
          // 将此前记录的上次选中的扇形对应的系列号 seriesIndex 清空
          hoveredIndex = '';
        }
        // 使用更新后的 option，渲染图表
        myChart.setOption(that.option);
      });
    }
  }
};
</script>

<style scoped>
@import '../../css/yaohao.css';
</style>
