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
                  <el-collapse-item title="x轴" name="3">
                    <el-switch v-model="x_show" inactive-text="是否显示" class="switch">
                    </el-switch>
                    <div class="block">
                      <el-input v-model="xLabelColor" placeholder="请选择字体颜色" class="input" :disabled="!x_show">
                        <span slot="prepend">字体颜色</span>
                      </el-input>
                      <el-color-picker show-alpha v-model="xLabelColor" class="colorPicker" :disabled="!x_show">
                      </el-color-picker><br>
                    </div>
                    <div class="block">
                      <el-input v-model="x_unit" placeholder="请输入单位" class="input" :disabled="!x_show">
                        <span slot="prepend">x轴单位</span>
                      </el-input>
                    </div>
                  </el-collapse-item>

                  <el-collapse-item title="布局" name="6">
                    <el-switch v-model="graphic_show" inactive-text="数据来源隐藏">
                    </el-switch>
                    <div class="block">
                      <span class="demonstration">图表两边缩放距离(%)</span>
                      <el-slider v-model="border_dis" show-input>
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
// import 'echarts-gl'
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

      // 数据
      tip: ['杭州市',],
      boy: [],
      girl: [],

      // 样式配置参数
      drawer: false,
      activeName: '',
      title_text: "2018-2023杭州摇号男女购房占比",
      le_show: true,
      h_v: true,
      graphic_show: false,
      itemLabel_show: false,
      border_dis: 20,
      top: 5,
      left: 37,
      backgroundColor: '',
      titleColor: '#000000',
      textColor: '#000000',
      xLabelColor: '#000000',
      title_top: 0,
      title_left: 36,
      fontSize: 16,
      radius: 16,
      customText: '自定义文案',
      customText_show: true,
      x_show: true,
      y_show: true,
      x_unit: '占比(%)',
      y_unit: '',
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
        xLabelColor,
        yLabelColor,
        y2LabelColor,
        title_top,
        title_left,
        fontSize,
        radius,
        customText,
        customText_show,
        x_show,
        y_show,
        y2_show,
        x_unit,
        y_unit,
        y2_unit,
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
        xLabelColor,
        yLabelColor,
        y2LabelColor,
        title_top,
        title_left,
        fontSize,
        radius,
        customText,
        customText_show,
        x_show,
        y_show,
        y2_show,
        x_unit,
        y_unit,
        y2_unit,
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
        if (this.$refs.chart) {
          this.drawChart(this.currentTheme);
          // console.log(newval, oldval)
        }
        // console.log("charts是否存在", this.$refs.chart)
      },
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
      await axios.get('http://sslapi.nadibao.cn/api/HzYaoHaoData/Get_PROVINCE_SEX_NUM_ALLYEAR')
        .then(res => {
          for (var i = 0; i < res.data.data.length; i++) {
            if (i = res.data.data.length - 1) {
              this.boy.push((res.data.data[i].MALE_RATE * 100).toFixed(2))
              this.girl.push((res.data.data[i].FEMALE_RATE * 100).toFixed(2))
              // this.yearData.push({ value: res.data.data[i].NUM, name: res.data.data[i].NAME })
            }
          }
        })

    },
    drawChart() {
      // var myChart = echarts.init(document.querySelector(".bar2 .chart"));
      var man = 'path://M512 88m-88 0a88 88 0 1 0 176 0 88 88 0 1 0-176 0Z,M744.9 619.6c-21.3 5.7-43.3-6.9-49-28.3l-64.1-239c-1.2-4.5-7.9-3.6-7.9 1V1008c0 8.8-7.2 16-16 16h-64c-8.8 0-16-7.2-16-16V640c0-8.8-7.2-16-16-16s-16 7.2-16 16v368c0 8.8-7.2 16-16 16h-64c-8.8 0-16-7.2-16-16V353.3c0-4.7-6.7-5.6-7.9-1l-64.1 239c-5.7 21.3-27.7 34-49 28.3-21.3-5.7-34-27.6-28.3-49l69.5-260C339 240.7 402.4 192 474.8 192h74.3c72.5 0 135.9 48.7 154.6 118.7l69.5 260c5.7 21.3-6.9 43.2-28.3 48.9z'
      var woman = 'path://M512 88m-88 0a88 88 0 1 0 176 0 88 88 0 1 0-176 0Z,M744.9 619.6c-21.3 5.7-43.3-7-49-28.3l-64.1-239c-1.2-4.5-7.9-3.6-7.9 1v132c0 19.4 2.9 38.6 8.7 57.1l48.8 156.8c3.2 10.3-4.5 20.8-15.3 20.8H628c-2.2 0-4 1.8-4 4v284c0 8.8-7.2 16-16 16h-64c-8.8 0-16-7.2-16-16V724c0-2.2-1.8-4-4-4h-24c-2.2 0-4 1.8-4 4v284c0 8.8-7.2 16-16 16h-64c-8.8 0-16-7.2-16-16V724c0-2.2-1.8-4-4-4h-38.3c-10.8 0-18.5-10.5-15.3-20.8l48.8-156.8c5.8-18.5 8.7-37.7 8.7-57.1v-132c0-4.7-6.7-5.5-7.9-1l-64.1 239c-5.7 21.3-27.7 34-49 28.3-17.9-4.8-29.7-21-29.7-38.6 0-3.4 0.4-6.9 1.4-10.4l69.5-260C339 240.7 402.4 192 474.8 192h74.3c72.4 0 135.9 48.7 154.6 118.7l69.5 260c5.7 21.3-6.9 43.2-28.3 48.9z'
      var option = {
        backgroundColor: this.backgroundColor,
        title: [
          {
            text: this.title_text,
            left: `${this.title_left + '%'}`,
            top: `${this.title_top + '%'}`,
            textStyle: {
              color: this.titleColor,
              fontSize: this.fontSize,
            }
          },
          {
            text: '男性比例',
            left: '45%',
            top: '68%',
            textAlign: 'center',
            textStyle: {
              fontWeight: 'bold',
              fontSize: '20',
              color: '#2ABEFE',
              textAlign: 'center',
            },
          },
          {
            text: '女性比例',
            left: '55%',
            top: '68%',
            textAlign: 'center',
            textStyle: {
              fontWeight: 'bold',
              fontSize: '20',
              color: 'rgba(0,200,0,1)',
              textAlign: 'center',
            },
          }
        ],
        legend: {
          data: ['男性比例', '女性比例'],
          show: this.le_show,
          orient: this.h_v ? 'horizontal' : 'vertical',
          name: '',
          left: `${this.left + '%'}`,
          top: `${this.top + "%"}`,
          textStyle: {
            color: "rgba(0,0,0,.6)"
          }
        },
        graphic: [{
          type: 'text',
          ignore: this.customText_show,
          draggable: true,
          top: 'center',
          right: 'center',
          style: {
            text: this.customText,
            font: '14px Helvetica Neue',
            height: '1.0625rem '
          },
          z: 1000
        },
        {
          type: 'text',
          ignore: this.graphic_show,
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
          ignore: this.graphic_show,
          bottom: 28,
          left: 10,
          style: {
            text: ['数据来源：拿地宝',
            ].join('\n'),
            font: '14px Helvetica Neue',
            height: '1.0625rem '
          }
        },],
        tooltip: {
          show: true,
          trigger: 'axis',
          formatter: '{b}: {c}%',
          axisPointer: {
            type: 'shadow',
          }
        },
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
        grid: [{
          show: false,
          left: `${this.border_dis / 2 + '%'}`,
          right: '60%',
          top: '30%',
          bottom: '25%',
          containLabel: true,
        },
        {
          show: false,
          left: '51%',
          right: '5%',
          top: '13.4%',
          bottom: 20,
          width: '0%',
        },
        {
          show: false,
          right: `${this.border_dis / 2 + '%'}`,
          left: '60%',
          top: '30%',
          bottom: '25%',
          containLabel: true,
        },],
        xAxis: [
          {
            type: 'value',
            show: this.x_show,
            // name是单位
            name: this.x_unit,
            inverse: true,
            axisLine: {
              show: false,
            },
            axisTick: {
              show: false,
            },
            position: 'top',
            nameTextStyle: { color: this.xLabelColor, lineHeight: 40, },
            axisLabel: {
              color: this.xLabelColor,
              fontSize: 12
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: this.xLabelColor,
                width: 1,
                opacity: 0.1
              },
            },
          }, {
            gridIndex: 1,
            show: false,
          }, {
            gridIndex: 2,
            type: 'value',
            show: this.x_show,
            // name是单位
            name: this.x_unit,
            axisLine: {
              show: false,
            },
            axisTick: {
              show: false,
            },
            position: 'top',
            nameTextStyle: { color: this.xLabelColor, lineHeight: 40, },
            axisLabel: {
              color: this.xLabelColor,
              fontSize: 12
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: this.xLabelColor,
                width: 1,
                opacity: 0.1
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
          },
          textStyle: {
            color: '#9D9EA0',
            fontSize: 12,
          },
          data: this.tip
        },
        {
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
            show: false,
          },
          textStyle: {
            color: '#9D9EA0',
            fontSize: 14,
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
          },
          textStyle: {
            color: '#9D9EA0',
            fontSize: 12,
          },
          data: this.tip
        },],
        series: [
          { //阴影
            name: '阴影',
            tooltip: {
              show: false
            },
            xAxisIndex: 0,
            yAxisIndex: 0,
            "type": "pictorialBar",
            "animationDuration": 0,
            itemStyle: {
              color: 'rgba(110,110,110,0.2)',
            },
            "symbolRepeat": "fixed",
            "symbolMargin": "8",
            symbol: man,
            // "symbolClip": true,
            "symbolSize": [40, 60],
            "symbolPosition": "start",
            "symbolOffset": [
              0, 0
            ],
            // "symbolBoundingData": 5000,
            "data": [100],
            z: 1
          },
          { //数据
            name: '男性比例',
            xAxisIndex: 0,
            yAxisIndex: 0,
            "type": "pictorialBar",
            "animationDuration": 0,
            itemStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 1,
                y2: 0,
                colorStops: [{
                  offset: 0,
                  color: '#3279e2' // 0% 处的颜色
                }, {
                  offset: 1,
                  color: '#45b9e7' // 100% 处的颜色
                }],
                globalCoord: false // 缺省为 false
              } //底色
            },
            label: {
              show: this.itemLabel_show,
              position: 'top',
              formatter: '{c}%',
              color: this.textColor
            },
            "symbolRepeat": "fixed",
            "symbolMargin": "8",
            symbol: man,
            "symbolClip": true,
            "symbolSize": [40, 60],
            "symbolPosition": "start",
            "symbolOffset": [
              0, 0
            ],
            "data": this.boy,
            z: 2
          },
          {//阴影
            name: '阴影',
            tooltip: {
              show: false
            },
            xAxisIndex: 2,
            yAxisIndex: 2,
            "type": "pictorialBar",
            "animationDuration": 0,
            itemStyle: {
              color: 'rgba(110,110,110,0.2)'
            },
            "symbolRepeat": "fixed",
            "symbolMargin": "8",
            symbol: woman,
            // "symbolClip": true,
            "symbolSize": [40, 60],
            "symbolPosition": "start",
            "symbolOffset": [
              0, 0
            ],
            // "symbolBoundingData": 5000,
            "data": [100],
            z: 1
          },
          { //数据
            name: '女性比例',
            xAxisIndex: 2,
            yAxisIndex: 2,
            "type": "pictorialBar",
            "animationDuration": 0,
            itemStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 1,
                y2: 0,
                colorStops: [{
                  offset: 0,
                  color: '#007900' // 0% 处的颜色
                }, {
                  offset: 1,
                  color: '#45b9e7' // 100% 处的颜色
                }],
                globalCoord: false // 缺省为 false
              } //底色
            },
            label: {
              show: this.itemLabel_show,
              position: 'top',
              formatter: '{c}%',
              color: this.textColor
            },
            "symbolRepeat": "fixed",
            "symbolMargin": "8",
            symbol: woman,
            "symbolClip": true,
            "symbolSize": [40, 60],
            "symbolPosition": "start",
            "symbolOffset": [
              0, 0
            ],
            // "symbolBoundingData": 5000,
            "data": this.girl,
            z: 2
          },
          { // 男性圆环图
            name: '',
            type: 'pie',
            clockwise: false,
            radius: ['15%', '18%'],
            itemStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 1,
                y2: 0,
                colorStops: [{
                  offset: 0,
                  color: '#3279e2' // 0% 处的颜色
                }, {
                  offset: 1,
                  color: '#45b9e7' // 100% 处的颜色
                }],
                globalCoord: false // 缺省为 false
              }, //底色
              shadowColor: 'rgba(100,0,100,0.5)',
              shadowBlur: 0,
              label: {
                show: false
              },
              labelLine: {
                show: false
              },
            },
            emphasis: { scale: true },
            center: ['45%', '55%'],
            data: [{
              value: this.boy,
              name: '男性比例',
              label: {
                position: 'center',
                formatter: '{c}%',
                show: true,
                fontSize: '20px',
                fontWeight: 'bold',
                color: '#2ABEFE'
              },

            }, {
              value: this.girl,
              name: '',
              label: {
                show: false
              },
              itemStyle: {
                color: 'rgba(110,110,110,0.5)',
              },

              position: 'center',
            }
            ]
          },
          { // 女性圆环图
            name: '',
            type: 'pie',
            clockwise: true,
            radius: ['15%', '18%'],
            itemStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 1,
                y2: 0,
                colorStops: [{
                  offset: 0,
                  color: '#007900' // 0% 处的颜色
                }, {
                  offset: 1,
                  color: '#45b9e7' // 100% 处的颜色
                }],
                globalCoord: false // 缺省为 false
              }, //底色
              shadowColor: 'rgba(100,0,100,0.5)',
              shadowBlur: 0,
              label: {
                show: false
              },
              labelLine: {
                show: false
              },
            },
            emphasis: { scale: true },
            center: ['55%', '55%'],
            data: [{
              value: this.girl,
              name: '女性比例',
              label: {
                position: 'center',
                formatter: '{c}%',
                show: true,
                fontSize: '20px',
                fontWeight: 'bold',
                color: 'rgba(0,200,0,1)'
              },
            }, {
              value: this.boy,
              name: '',
              label: {
                show: false
              },
              itemStyle: {
                color: 'rgba(110,110,110,0.5)',
              },
              position: 'center',
            }
            ],
            z: 10
          }
        ]
      };
      this.myChart.setOption(option);
      // 监听浏览器缩放，图表对象调用缩放resize函数
      window.addEventListener("resize", function () {
        vm.myChart.resize();
      });
    },
  }
};
</script>

<style scoped>
@import '../../css/yaohao.css';
</style>


