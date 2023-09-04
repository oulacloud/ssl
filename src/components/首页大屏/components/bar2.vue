<template>
  <div class="LVbody">
    <div id="canvas"></div>
    <!-- 头部显示栏 -->
    <header v-show="false">
      <h1 id="view">摇号数据展示</h1>
      <div class="showTime">{{ times }}</div>
    </header>
    <!-- 主体部分 -->
    <section class="mainbox">
      <!-- 中 -->
      <div class="column">
        <dv-border-box-7 class="border">
          <el-tooltip v-show="true" content="修改样式" placement="top">
            <el-button @click="drawer = true" type="default" icon="el-icon-edit" circle id="edit-btn"></el-button>
          </el-tooltip>

          <!-- 注解 -->
          <el-popover v-show="all_show" placement="top-start" title="" width="200" trigger="hover" class="refer_btn"
            content="注：图表详情信息">
            <el-button slot="reference" icon="el-icon-question" circle></el-button>
          </el-popover>

          <el-button v-show="all_show" @click="copy" icon="el-icon-share" circle>

          </el-button>
          <div class="chart" ref="chart"></div>
        </dv-border-box-7>
        <el-drawer :visible.sync="drawer" direction="ltr" custon-class="drawer">
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
                    <el-switch v-model="le_show" inactive-text="是否显示">
                    </el-switch><br>
                    <el-switch v-model="h_v" inactive-text="图例水平垂直切换">
                    </el-switch>
                    <div class="block">
                      <span class="demonstration">距离顶部距离(%)</span>
                      <el-slider v-model="top" show-input>
                      </el-slider>
                    </div>
                    <div class="block">
                      <span class="demonstration">距离左边距离(%)</span>
                      <el-slider v-model="left" show-input>
                      </el-slider>
                    </div>
                  </el-collapse-item>
                  <el-collapse-item title="背景样式" name="2">
                    <span class="demonstration">背景颜色</span>
                    <el-input v-model="backgroundColor" style="width: 200px;">
                    </el-input>
                    <el-color-picker v-model="backgroundColor" style="position:absolute;">
                    </el-color-picker><br>
                    <span class="demonstration">标题颜色</span>
                    <el-input v-model="titleColor" style="width: 200px;">
                    </el-input>
                    <el-color-picker v-model="titleColor" style="position:absolute;">
                    </el-color-picker>
                    <div class="block">
                      <span class="demonstration">标题距离顶部距离(%)</span>
                      <el-slider v-model="title_top" show-input>
                      </el-slider>
                    </div>
                    <div class="block">
                      <span class="demonstration">标题大小</span>
                      <el-slider v-model="fontSize" show-input>
                      </el-slider>
                    </div>
                  </el-collapse-item>
                  <el-collapse-item title="x轴" name="3">
                    <el-switch v-model="x_show" inactive-text="是否显示">
                    </el-switch>
                    <div class="xaxis">
                      <span class="xaxis_left">单位</span>
                      <el-input class="xaxis_right" v-model="x_unit" placeholder="请输入单位">
                      </el-input>
                    </div>
                  </el-collapse-item>
                  <el-collapse-item title="左侧y轴" name="4">
                    <el-switch v-model="y_show" inactive-text="是否显示">
                    </el-switch>
                    <div class="xaxis">
                      <span class="xaxis_left">单位</span>
                      <el-input class="xaxis_right" v-model="y_unit" placeholder="请输入单位">
                      </el-input>
                    </div>
                  </el-collapse-item>
                  <el-collapse-item title="右侧y轴" name="5">
                    <el-switch v-model="y2_show" inactive-text="是否显示">
                    </el-switch>
                    <div class="xaxis">
                      <span class="xaxis_left">单位</span>
                      <el-input class="xaxis_right" v-model="y2_unit" placeholder="请输入单位">
                      </el-input>
                    </div>
                  </el-collapse-item>
                  <el-collapse-item title="布局" name="6">

                  </el-collapse-item>
                  <el-collapse-item title="字体" name="7">

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
import methods from '../../图表集/js/methods'

var vm = null
var chartScreen = null
function setFullScreenToolBox(option, title) {
  if ($('#fullScreenMask').css('display') === 'block') {
    $('#fullScreenMask').hide();
    $('.column').show();
    vm.all_show = false
    chartScreen.dispose();
    return false;
  }
  vm.all_show = true
  $('#fullScreenMask').show();
  vm.drawChart()
  chartScreen = echarts.init(document.querySelector('.fullScreen'));
  chartScreen.setOption(option);
  $('.column').hide();
  chartScreen.setOption({
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
  mixins: [vintage, macarons, dark, shine, infographic, roma],
  // props: ['all_show'],//接收父组件值
  data() {
    return {
      // 系统参数
      times: '',
      //放大后显示其他配置
      all_show: false,

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
      le_show: this.all_show,
      h_v: this.all_show,
      tool_show: this.all_show,
      label_show: this.all_show,
      graphic_show: !this.all_show,
      top: 5,
      left: 42,
      backgroundColor: '#fff',
      titleColor: '#000000',
      title_top: 0,
      title_left: 50,
      fontSize: 16,
      x_show: this.all_show,
      y_show: this.all_show,
      y2_show: this.all_show,
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
        all_show,
        le_show,
        h_v,
        tool_show,
        label_show,
        graphic_show,
        top,
        left,
        backgroundColor,
        titleColor,
        title_top,
        fontSize,
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
        all_show,
        le_show,
        h_v,
        tool_show,
        label_show,
        graphic_show,
        top,
        left,
        backgroundColor,
        titleColor,
        title_top,
        fontSize,
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
          show: this.tool_show,
          text: this.title_text,
          textAlign: 'center',
          left: `${this.title_left + '%'}`,
          top: `${this.title_top + '%'}`,
          textStyle: {
            color: this.titleColor,
            fontSize: this.fontSize,
          }
        },
        grid: {
          top: "15%",
          left: "10%",
          bottom: "10%",
          containLabel: true
        },
        legend: {
          name: '人次',
          show: this.le_show,
          orient: this.h_v ? 'horizontal' : 'vertical',
          name: '',
          left: `${this.left + '%'}`,
          top: `${this.top + "%"}`,
          textStyle: {
            color: "rgba(0,0,0,.6)"
          },
          data: ['人次', '同比增长']
        },
        graphic: {
          type: 'text',
          ignore: this.graphic_show,
          bottom: 28,
          right: 10,
          style: {
            text: ['数据来源：拿地宝',
              '制作：杭州融地信息技术有限公司'
            ].join('\n'),
            font: '14px Helvetica Neue',
            height: '1.0625rem '

          }
        },
        toolbox: {
          show: true,
          feature: {
            myTool: {
              show: true,
              title: '全屏显示',
              //icon从阿里图标复制对应的svg格式代码
              icon: "path://M368.896 192H224a32 32 0 0 0-32 32v137.888a32 32 0 0 0 64 0V256h112.896a32 32 0 0 0 0-64zM784.864 192H640a32 32 0 1 0 0 64h112.864v105.888a32 32 0 1 0 64 0V224a32 32 0 0 0-32-32zM368.896 777.92H256V672a32 32 0 1 0-64 0v137.92a32 32 0 0 0 32 32h144.896a32 32 0 1 0 0-64zM784.864 640a32 32 0 0 0-32 32v105.92H640a32 32 0 1 0 0 64h144.864a32 32 0 0 0 32-32V672a32 32 0 0 0-32-32z",
              onclick: function () {
                //生成全屏显示的图表
                if (setFullScreenToolBox(option, '2018-2023年摇号情况')) {
                  // chartScreen
                } else { return false }
              }
            },
          }
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
            data: this.name,
            nameLocation: 'center',
            nameTextStyle: { align: 'right', color: '#000', verticalAlign: 'top', lineHeight: 40, },
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
          show: this.y_show,
          name: this.y_unit,
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
          show: this.y2_show,
          name: this.y2_unit,
          splitLine: {
            show: true,
            lineStyle: {
              color: "rgba(0,0,0,.1)"
            }
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
            borderRadius: 8,
          },
          barWidth: '30%',
          label: {
            show: this.label_show,
            position: 'top',
            color: '#000',
            formatter: '{c}'
          },
          data: this.sums
        }, {
          name: '同比增长',
          yAxisIndex: 1,
          type: 'line',
          smooth: true,
          label: {
            show: this.label_show,
            position: 'top',
            color: '#000',
            formatter: '{c}%'
          },
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
