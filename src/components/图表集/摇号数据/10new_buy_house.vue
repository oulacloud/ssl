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
          <el-popover placement="top-start" title="" width="200" trigger="hover" class="refer_btn" content="注：信息详情">
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
                    </el-switch><br>
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

      // 返回数据参数
      x: [],
      y: [],
      source: [],
      name: ['老杭州人', '省内新杭州人', '省外新杭州人'],

      // 样式配置参数
      drawer: false,
      activeName: '',
      title_text: "2018-2023年购房人数情况比较",
      le_show: true,
      h_v: true,
      graphic_show: false,
      itemLabel_show: true,
      border_dis: 10,
      top: 5,
      left: 30,
      backgroundColor: '',
      titleColor: '#000000',
      textColor: '#000000',
      title_top: 0,
      title_left: 36,
      fontSize: 16,
      radius: 40,
      customText: '自定义文案',
      customText_show: true,
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
      handler: async function (newval, oldval) {
        if (this.$refs.chart) {
          this.source = []
          await this.getData()
          this.drawChart(this.currentTheme);
          // console.log(newval, oldval)
        }
        // console.log("charts是否存在", this.$refs.chart)
      },
    },
    async change(val) {
      if (this.$refs.chart) {
        this.myChart.dispose()
        // console.log()
        this.myChart = echarts.init(this.$refs.chart, this.currentTheme)
        this.source = []
        await this.getData()
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
          var data = res.data.data
          this.source.push(['product', '2015', '2016'])
          var v1 = 0
          // console.log(data)
          for (var i = 0; i < data.length; i++) {
            if (data[i].NAME === 'CITY_LOCAL' || data[i].NAME === 'OUTCITY_INPROVINCE' || data[i].NAME === 'OUTCITY_OUTPROVINCE') {
              var v2 = parseFloat((data[i].NUM / 10000).toFixed(2))
              this.source.push([this.name[v1], v2])
              v1++
            }
          };
        })
    },
    drawChart() {
      // 1. 实例化对象
      // var myChart = echarts.init(this.$refs.chart);
      // 颜色系列
      var color = ['#37FFC9', '#FFBBDD', '#19D6FF', '#32A1FF', '#cccccc', '#ff1111'];
      let color1 = [], color2 = [], color3 = [];
      color.forEach((item) => {
        color1.push(hexToRgba(item, 0.9),);
        color2.push(hexToRgba(item, 0.7),);
        color3.push(hexToRgba(item, 0.4),);
      });
      // console.log(color1)
      var radius = ['28%', '32%'];
      // 每层圆环大小
      let radius2 = [Number(radius[1].split('%')[0]) + 0 + '%', Number(radius[1].split('%')[0]) + 4 + '%'];
      let radius3 = [Number(radius[1].split('%')[0]) + 4 + '%', Number(radius[1].split('%')[0]) + 8 + '%'];

      // 2.指定配置
      let markLineData = []
      let source = this.source
      // 添加“其他”
      addOtherData(source, 2);

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
        legend: {
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
          formatter: '{c}(万人)<br>({d}%)',
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
        dataset: {
          source: source
        },
        series: [{
          type: 'pie',
          radius: ['25%', '50%'],
          center: ['25%', '50%'],
          itemStyle: {
            label: {
              show: false
            },
            labelLine: {
              show: false
            },
            shadowBlur: 40,
            shadowColor: 'rgba(40, 40, 40,0.5)',
          },
          label: {
            show: this.itemLabel_show,
            position: "inside",
            formatter: '{c}(万人)\n({d}%)',
            color: this.textColor
          },
          startAngle: 45, // 起始角度 45
          clockwise: false, // 逆时针
          markLine: {
            lineStyle: {
              type: 'solid',
              color: "#BFBFBF"
            },
            symbol: 'none',
            data: markLineData
          }
        },
        {
          type: 'pie',
          radius: radius3,
          center: ['75%', '50%'],
          encode: {
            itemName: 'product',
            value: '2016',
          },
          startAngle: 90,
          selectedMode: 'single',
          selectedOffset: 0,
          itemStyle: {
            color: (params) => {
              return color1[params.dataIndex];
            },
          },
          label: {
            show: this.itemLabel_show,
            color: this.textColor,
            position: 'inside',
            formatter: '{b}:{d}%',
            align: 'left',
            padding: [0, -50, 10, -60],
          },
          z: 666,
        },
        {
          type: 'pie',
          radius: radius2,
          center: ['75%', '50%'],
          encode: {
            itemName: 'product',
            value: '2016',
          },
          startAngle: 90,
          selectedMode: 'single',
          selectedOffset: 0,
          itemStyle: {
            color: (params) => {
              return color2[params.dataIndex];
            },
          },
          label: {
            show: false,
            formatter: '{b}:{d}%',
          },
          z: 666,
        },
        {
          type: 'pie',
          radius: radius,
          center: ['75%', '50%'],
          encode: {
            itemName: 'product',
            value: '2016',
          },
          startAngle: 90,
          selectedMode: 'single',
          selectedOffset: 0,
          itemStyle: {
            color: (params) => {
              return color3[params.dataIndex];
            },
          },
          label: {
            show: false,
            formatter: '{b}:{d}%',
          },
          z: 666,
        },
        ]
      };
      // myChart = this.myChart
      this.opt = option
      // 获取表标线 对应点坐标
      function getMarkLineData(percent) {
        // 1.获取画布 width,height

        let height = vm.myChart.getHeight()
        let width = vm.myChart.getWidth()

        // 2.  根据 series[0].center 获取圆心坐标
        let x0 = width * 0.25 // 圆心x轴坐标

        //3.圆边上点坐标
        // let x1   =   x0   +   r   *   cos(ao   *   3.14   /180   )
        // let y1   =   y0   +   r   *   sin(ao   *   3.14   /180   )

        // “其他” 终点坐标series[0].startAngle 45
        let x1 = x0 + (height / 4) * Math.cos(45 * 3.14 / 180)
        let y1 = (height * 0.5) - (height / 4) * Math.sin(45 * 3.14 / 180)

        let ao = 360 * (percent / 100) // 扇形角度

        let ao1 = 0 // 用来计算的坐标角度
        ao1 = (ao <= 45) ? (45 - ao) : (360 - (ao - 45))
        if (ao1 < 270 && ao1 > 45) ao1 = 270 // 角度当270用，要不样式不好看

        let x2 = 0, y2 = 0;
        x2 = x0 + (height / 4) * Math.cos(ao1 * 3.14 / 180)
        y2 = (height * 0.5) - (height / 4) * Math.sin(ao1 * 3.14 / 180)

        return [[{ x: x1, y: y1 }, { x: "75%", y: "30%" }], [{ x: x2, y: y2 }, { x: "75%", y: "70%" }]]
      }
      //颜色16进制换算rgba,添加透明度
      function hexToRgba(hex, opacity) {
        return (
          'rgba(' +
          parseInt('0x' + hex.slice(1, 3)) +
          ',' +
          parseInt('0x' + hex.slice(3, 5)) +
          ',' +
          parseInt('0x' + hex.slice(5, 7)) +
          ',' +
          opacity +
          ')'
        );
      }
      // 添加其他
      function addOtherData(datasetSource, len) {
        let percent = 0
        let sum = 0 // 总计
        datasetSource.forEach((data, rowIndex) => {
          if (rowIndex > 0) { // 第一行数据不算
            let count = 0
            for (let key of data) {
              let value = isNaN(key) ? 0 : Number(key)
              if (count === 1) sum += value
              count++
            }
          }
        })
        let endData = datasetSource.slice(datasetSource.length - len)
        let other = ["其他"]
        for (let i = 0; i < endData.length; i++) {
          let j = 0;
          for (let key of endData[i]) {
            let value = isNaN(key) ? 0 : key
            if (j) other[j] ? (other[j] += value) : other.push(value)
            j++
          }
          endData[i].splice(1, 0, "")
        }
        datasetSource.push(other)
        // "其他"占比
        percent = sum ? ((other[1] / sum) * 100).toFixed(2) : 100
        markLineData = getMarkLineData(percent)
        // console.log(markLineData)
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

/* * {
  margin: 0;
  padding: 0;
} */
</style>
