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
                  <el-collapse-item title="左侧y轴" name="4">
                    <el-switch v-model="y_show" inactive-text="是否显示" class="switch">
                    </el-switch>
                    <div class="block">
                      <el-input v-model="yLabelColor" placeholder="请选择字体颜色" class="input" :disabled="!y_show">
                        <span slot="prepend">字体颜色</span>
                      </el-input>
                      <el-color-picker show-alpha v-model="yLabelColor" class="colorPicker" :disabled="!y_show">
                      </el-color-picker><br>
                    </div>
                    <div class="block">
                      <el-input v-model="y_unit" placeholder="请输入单位" class="input" :disabled="!y_show">
                        <span slot="prepend">左y轴单位</span>
                      </el-input>
                    </div>
                  </el-collapse-item>
                  <el-collapse-item title="右侧y轴" name="5">
                    <el-switch v-model="y2_show" inactive-text="是否显示" class="switch">
                    </el-switch>
                    <div class="block">
                      <el-input v-model="y2LabelColor" placeholder="请选择字体颜色" class="input" :disabled="!y2_show">
                        <span slot="prepend">字体颜色</span>
                      </el-input>
                      <el-color-picker show-alpha v-model="y2LabelColor" class="colorPicker" :disabled="!y2_show">
                      </el-color-picker><br>
                    </div>
                    <div class="block">
                      <el-input v-model="y2_unit" placeholder="请输入单位" class="input" :disabled="!y2_show">
                        <span slot="prepend">右y轴单位</span>
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
                    <div class="block">
                      <span class="demonstration">柱状图圆角半径</span>
                      <el-slider v-model="radius" show-input>
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
      name: [],
      le3: ['中专', '大专', '本科', '硕士', '博士', '初技', '中技', '高技', '其他', '未知'],
      zz: [],
      dz: [],
      bk: [],
      ss: [],
      bs: [],
      cj: [],
      zj: [],
      gj: [],
      qt: [],
      non: [],
      sums: [],
      zzl: ['',],
      sum3: [],

      // 样式配置参数
      drawer: false,
      activeName: '',
      title_text: "2018-2023年杭州人才摇号增速",
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
      xLabelColor: '#000000',
      yLabelColor: '#000000',
      y2LabelColor: '#000000',
      title_top: 0,
      title_left: 36,
      fontSize: 16,
      radius: 16,
      customText: '自定义文案',
      customText_show: true,
      x_show: true,
      y_show: true,
      y2_show: true,
      x_unit: '年份',
      y_unit: '人次',
      y2_unit: '同比增长',
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
      // console.log(this.imageUrl)
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
      await axios.get("http://sslapi.nadibao.cn/api/HzYaoHaoData/Get_MID_TALENT_BUYER_TYPE_NUM_ALLYEAR")
        .then(res => {
          for (var i = 0; i < res.data.data.length; i++) {
            this.name[i] = res.data.data[i].YEAR_NAME
            this.zz[i] = res.data.data[i].TYPE_ZHONGZHUAN_NUM
            this.dz[i] = res.data.data[i].TYPE_DAZHUAN_NUM
            this.bk[i] = res.data.data[i].TYPE_BENKE_NUM
            this.ss[i] = res.data.data[i].TYPE_SHUOSHI_NUM
            this.bs[i] = res.data.data[i].TYPE_BOSHI_NUM
            this.cj[i] = res.data.data[i].TYPE_CHUJI_NUM
            this.zj[i] = res.data.data[i].TYPE_ZHONGJI_NUM
            this.gj[i] = res.data.data[i].TYPE_GAOJI_NUM
            this.qt[i] = res.data.data[i].TYPE_ELSE_NUM
            this.non[i] = res.data.data[i].TYPE_NONE_NUM
            this.sums[i] = this.zz[i] + this.dz[i] + this.bk[i] + this.ss[i] + this.bs[i] + this.cj[i] + this.zj[i] + this.gj[i] + this.qt[i] + this.non[i]
          }
          this.sum3.push(this.zz, this.dz, this.bk, this.ss, this.bs, this.cj, this.zj, this.gj, this.qt, this.non);
          [...this.sums].map((x, i) => {
            if (i < this.sums.length - 1) {
              this.zzl.push(((this.sums[i + 1] - this.sums[i]) * 100 / this.sums[i]).toFixed(2))
            }
          })
          // console.log(this.sums,this.zzl)
        })
    },
    drawChart() {
      // 1. 实例化对象
      // var myChart = echarts.init(document.querySelector(".line .chart"));
      // 2.指定配置
      var option = {
        backgroundColor: this.backgroundColor,
        title: {
          text: this.title_text,
          left: `${this.title_left + '%'}`,
          top: `${this.title_top + '%'}`,
          textStyle: {
            color: this.titleColor,
            fontSize: this.fontSize,
          }
        },
        toolbox: {
          feature: {
            mark: {
              show: true
            },
            magicType: {
              show: true,
              type: ['line', 'bar', 'stack']
            },
            restore: { show: true },
            saveAsImage: {
              show: true
            },
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
        grid: {
          top: "15%",
          left: `${this.border_dis / 2 + '%'}`,
          right: `${this.border_dis / 2 + '%'}`,
          bottom: "10%",
          containLabel: true
        },
        legend: {
          name: '',
          orient: this.h_v ? 'horizontal' : 'vertical',
          show: this.le_show,
          left: `${this.left + '%'}`,
          top: `${this.top + "%"}`,
          textStyle: {
            color: this.textColor
          },
          data: ['人次','同比增长']
        },
        tooltip: {
          trigger: 'axis',
        },
        xAxis: [
          {
            type: "category",
            // boundaryGap: true,
            show: this.x_show,
            // name是单位
            name: this.x_unit,
            nameLocation: 'center',
            nameTextStyle: { align: 'right', color: this.xLabelColor, verticalAlign: 'top', lineHeight: 40, },
            // x轴更换数据
            data: this.name,
            // 文本颜色为rgba(0,0,0,.6)  文字大小为 12
            axisLabel: {
              color: this.xLabelColor,
              fontSize: 12
            },
            // x轴线的颜色为   rgba(0,0,0,.2)
            axisLine: {
              lineStyle: {
                color: this.xLabelColor,
                opacity: 0.2
              }
            },
            axisTick: {
              //x轴刻度相关设置
              alignWithLabel: false,
            },
          }
        ],
        yAxis: [{
          name: this.y_unit,
          show: this.y_show,
          alignTicks: true,
          nameTextStyle: {
            color: this.yLabelColor,
            fontSize: 14,
          },
          type: 'value',
          splitLine: {
            show: true,
            lineStyle: {
              color: this.yLabelColor,
              opacity: 0.1
            }
          },
          axisLabel: {
            show: true,
            margin: 20,
            color: this.yLabelColor,
          },
        },
        {
          type: 'value',
          show: this.y2_show,
          name: this.y2_unit,
          nameTextStyle: {
            color: this.y2LabelColor,
            fontSize: 14,
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: this.y2LabelColor,
              opacity: 0.1
            }
          },
          axisLabel: {
            show: true,
            margin: 20,
            formatter:'{value}%',
            color: this.y2LabelColor,
          },
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
            borderRadius: this.radius / 2,
          },
          barWidth: '30%',
          label: {
            show: this.itemLabel_show,
            position: 'top',
            formatter: '{c}',
            color: this.textColor
          },
          data: this.sums
        }, {
          name: '同比增长',
          yAxisIndex: 1,
          type: 'line',
          smooth: true,
          label: {
            show: this.itemLabel_show,
            position: 'top',
            formatter: '{c}%',
            color: this.textColor
          },
          lineStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: 'rgba(255, 227, 168, 1)',
              },
              {
                offset: 0.5,
                color: 'rgba(0, 0, 255, .5)',
              },
              {
                offset: 1,
                color: 'rgba(255, 227, 168, 1)',
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
                offset: 0.6,
                color: 'rgba(255, 120, 0, 0.1)',
              },
            ]),
          },
          data: this.zzl
        }]

      }
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
