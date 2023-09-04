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
                    </el-switch><br>
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
// import 'echarts-gl'
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
      tool_show:true,

      // 数据
      x: [],
      y: [],
      source: [
      ],
      rencai: [],
      wufang: [],
      youfang: [],
      Prencai: [],
      Pwufang: [],
      Pyoufang: [],

      // 样式配置参数
      drawer: false,
      activeName: '',
      title_text: "2018-2023年杭州摇号有无房比例",
      le_show: true,
      h_v: true,
      graphic_show: false,
      itemLabel_show: true,
      border_dis: 10,
      top: 10,
      left: 34,
      backgroundColor: '',
      titleColor: '#000000',
      textColor: '#000000',
      title_top: 3,
      title_left: 50,
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
        if (this.$refs.fullOne) {
          this.fullChart.dispose()
          this.source = []
          await this.getData()
          this.fullChart = echarts.init(this.$refs.fullOne, this.currentTheme)
          this.fullChart.setOption(this.drawChart());
        }
        // console.log("charts是否存在", this.$refs.chart)
      },
    },
    async change(val) {
      if (this.$refs.fullOne) {
        this.fullChart.dispose()
        this.source = []
        await this.getData()
        this.fullChart = echarts.init(this.$refs.fullOne, this.currentTheme)
        this.fullChart.setOption(this.drawChart());
      }
      // console.log(val)
    },
  },
  methods: {
    zoom() {
      this.dialogVisable = true;
      this.$nextTick(async () => {
        const chartFull = this.$refs.fullOne;
        if (chartFull) {
          this.source = []
          await this.getData()
          this.fullChart = echarts.init(this.$refs.fullOne, this.currentTheme);
          this.fullChart.setOption(this.drawChart());
        }
      })
      // console.log("触发子组件的函数");

      this.$emit("zoom-in");
    },
    destory(done) {
      this.$confirm("确认关闭?")
        .then(async (_) => {
          this.dialogVisable = false;
          this.fullChart.dispose();
          this.source = []
          await this.getData()
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
      await axios.get("http://sslapi.nadibao.cn/api/HzYaoHaoData/Get_MID_YEAR_PEOPLE_TYPE_ADD_NUM")
        .then(res => {
          this.resData = res.data.data
          this.source.push(['product', '2015', '2016'])
          for (var i = 0; i < this.resData.length; i++) {
            this.x[i] = this.resData[i].MYPTAN_YEAR_NAME
            this.rencai[i] = this.resData[i].MYPTAN_NUM1 + this.resData[i].MYPTAN_NUM4
            this.wufang[i] = this.resData[i].MYPTAN_NUM2 + this.resData[i].MYPTAN_NUM5
            this.youfang[i] = this.resData[i].MYPTAN_NUM3 + this.resData[i].MYPTAN_NUM6
          }
        })
    },
    drawChart() {
      // 1. 实例化对象
      // var myChart = echarts.init(document.querySelector(".line .chart"));
      var color = ['#F9F00D', '#493A00', '#F9F07D', '#F9F0DD', '#F00AFD', '#F9F0FD']
      // const color = ['#00FFFF', 'rgba(196,36,255,1)'];
      var le = ['有房', '普通无房', '人才无房',];
      [this.youfang, this.wufang, this.rencai].map((x, index) => {
        var s = 0;
        [...x].map(res => { return s += res })
        this.source.push([le[index], s])
      })
      // console.log(this.source)
      // 2.指定配置
      let markLineData = []
      let source = this.source
      var option = {
        backgroundColor: this.backgroundColor,
        title: {
          text: this.title_text,
          textAlign: 'center',
          left: `${this.title_left + '%'}`,
          top: `${this.title_top + '%'}`,
          textStyle: {
            color: this.titleColor,
            fontSize: this.fontSize,
          }
        },
        legend: {
          show: this.dialogVisable ? this.le_show : false,
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
          ignore: this.dialogVisable ? this.customText_show : true,
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
          ignore: this.dialogVisable ? this.graphic_show : true,
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
          ignore: this.dialogVisable ? this.graphic_show : true,
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
          show: this.dialogVisable ? this.tool_show : false,
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
        grid: getBarHeight(),
        tooltip: { formatter: '{c}\n({d}%)' },
        dataset: {
          source: source
        },
        xAxis: [
          {
            show: false,
            type: 'category',
            data: ['无房']
          }
        ],
        yAxis: [
          {
            show: false,
            max: "dataMax",
            type: 'value'
          }
        ],
        series: [{
          type: 'pie',
          selectedMode: 'single',
          radius: ['10%', '50%'],
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
            show: this.dialogVisable ? this.itemLabel_show : false,
            color: this.textColor,
            position: "inside",
            formatter: '{c}\n({d}%)'
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
        }
        ]
      };
      // 添加“其他”
      addOtherData(source, 2, option);
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

        return [[{ x: x1, y: y1 }, { x: "75%", y: "35%" }], [{ x: x2, y: y2 }, { x: "75%", y: "65%" }]]
      }
      // 添加其他
      function addOtherData(datasetSource, len, option) {
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
        let endData = datasetSource.splice(datasetSource.length - len)
        let other = ["其他"]
        for (let i = 0; i < endData.length; i++) {
          let j = 0;
          for (let key of endData[i]) {
            let value = isNaN(key) ? 0 : key
            if (j) other[j] ? (other[j] += value) : other.push(value)
            j++
          }
        }
        datasetSource.push(other)
        // "其他"占比
        percent = sum ? ((other[1] / sum) * 100).toFixed(2) : 100
        option.series[0].markLine.data = getMarkLineData(percent)
        let minHeight = 0
        if (!other[1]) { // 设置最小最小高度，防止为0时没有高度
          height = myChart.getHeight() * 0.3
          minHeight = height / len

        }
        getBarSeries(endData, option, minHeight)
      }
      // 获取柱形图的高
      function getBarHeight() {
        let height = vm.myChart.getHeight()
        return [{ x: '75%', y: '35%', width: '100', height: height * 0.3 }]
      }

      function getBarSeries(endData, option, minHeight) {
        let series = []
        endData.forEach((item, i) => {
          let obj = {
            name: item[0],
            type: 'bar',
            stack: '系列2',
            data: [item[1]],
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: 'rgba(0,244,255,.5)' // 0% 处的颜色
              }, {
                offset: 1,
                color: color[i] // 100% 处的颜色
              }], false),
              borderRadius: [0, 30, 0, 30],
              shadowColor: 'rgba(0,160,221,1)',
              shadowBlur: 4,
            },
            barMinHeight: minHeight,
            label: {
              show: vm.dialogVisable ? vm.itemLabel_show : false,
              position: "inside",
              formatter: '{b}\n{c}',
              color: vm.textColor
            },
            tooltip: {
              type: 'axis',
              formatter: '{b}\n{c}人'
            }
          }
          series.push(obj)
        })
        option.series = option.series.concat(series)
      }
      // 3. 把配置项给实例对象
      this.myChart.setOption(option);
      return option
    },
  }
};
</script>

<style scoped>
@import '../../css/yaohao.css';
</style>
