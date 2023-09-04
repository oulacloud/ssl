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
              <el-collapse-item title="左侧x轴" name="3">
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
                    <span slot="prepend">左侧x轴单位</span>
                  </el-input>
                </div>
              </el-collapse-item>
              <el-collapse-item title="右侧x轴" name="5">
                <el-switch v-model="x2_show" inactive-text="是否显示" class="switch">
                </el-switch>
                <div class="block">
                  <el-input v-model="x2LabelColor" placeholder="请选择字体颜色" class="input" :disabled="!x2_show">
                    <span slot="prepend">字体颜色</span>
                  </el-input>
                  <el-color-picker show-alpha v-model="x2LabelColor" class="colorPicker" :disabled="!x2_show">
                  </el-color-picker><br>
                </div>
                <div class="block">
                  <el-input v-model="x2_unit" placeholder="请输入单位" class="input" :disabled="!x2_show">
                    <span slot="prepend">右侧x轴单位</span>
                  </el-input>
                </div>
              </el-collapse-item>
              <el-collapse-item title="y轴" name="4">
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
                    <span slot="prepend">y轴单位</span>
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
                  <span class="demonstration">两图表间距因子</span>
                  <el-slider v-model="radius" show-input>
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
      tip: [],
      boy: [],
      girl: [],

      // 样式配置参数
      drawer: false,
      activeName: '',
      title_text: "杭州市摇号按省份性别比例",
      le_show: true,
      h_v: true,
      graphic_show: false,
      itemLabel_show: true,
      border_dis: 15,
      top: 7,
      left: 37,
      backgroundColor: '',
      titleColor: '#000000',
      textColor: '#000000',
      xLabelColor: '#000000',
      yLabelColor: '#000000',
      x2LabelColor: '#000000',
      title_top: 3,
      title_left: 50,
      fontSize: 16,
      radius: 55,
      customText: '自定义文案',
      customText_show: true,
      x_show: true,
      y_show: true,
      x2_show: true,
      x_unit: '单位:人',
      y_unit: '',
      x2_unit: '单位:人',
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
        x2LabelColor,
        title_top,
        title_left,
        fontSize,
        radius,
        customText,
        customText_show,
        x_show,
        y_show,
        x2_show,
        x_unit,
        y_unit,
        x2_unit,
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
        x2LabelColor,
        title_top,
        title_left,
        fontSize,
        radius,
        customText,
        customText_show,
        x_show,
        y_show,
        x2_show,
        x_unit,
        y_unit,
        x2_unit,
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
      await axios.get('http://sslapi.nadibao.cn/api/HzYaoHaoData/Get_PROVINCE_SEX_NUM_ALLYEAR')
        .then(res => {
          this.resData = res.data.data;
          for (var i = 0; i < this.resData.length; i++) {
            if (i !== this.resData.length - 1) {
              this.boy.push(this.resData[i].MALE_NUM)
              this.girl.push(this.resData[i].FEMALE_NUM)
              this.tip.push(this.resData[i].PROVINCE_NAME)
              // this.yearData.push({ value: this.resData[i].NUM, name: this.resData[i].NAME })
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
        graphic: [{
          type: 'text',
          ignore: this.dialogVisable ? this.customText_show : true,
          bottom: 28,
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
        legend: {
          data: ['男性人数', '女性人数'],
          orient: this.h_v ? 'horizontal' : 'vertical',
          show: this.dialogVisable ? this.le_show : false,
          left: `${this.left + '%'}`,
          top: `${this.top + "%"}`,
          textStyle: {
            color: this.textColor
          },
        },
        tooltip: {
          show: true,
          trigger: 'axis',
          formatter: '{b}<br/>{a}: {c}人',
          axisPointer: {
            type: 'shadow',
          }
        },
        grid: [{
          show: false,
          left: `${this.border_dis / 2 + '%'}`,
          right: `${this.radius + '%'}`,
          top: '10%',
          bottom: 40,
          containLabel: true,
        }, {
          show: false,
          left: '51%',
          top: '13.4%',
          bottom: 40,
          width: '0%',
        }, {
          show: false,
          right: `${this.border_dis / 2 + '%'}`,
          left: `${this.radius + '%'}`,
          top: '10%',
          bottom: 40,
          containLabel: true,
        },],
        xAxis: [
          {
            type: 'value',
            // x轴更换数据
            show: this.dialogVisable ? this.x_show : false,
            // name是单位
            name: this.x_unit,
            inverse: true,
            nameLocation: 'center',
            nameTextStyle: { align: 'top', color: this.xLabelColor, lineHeight: 40, },
            // x轴更换数据
            position: 'top',
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
          }, {
            gridIndex: 1,
            show: false,
          }, {
            gridIndex: 2,
            type: 'value',
            // x轴更换数据
            show: this.dialogVisable ? this.x2_show : false,
            // name是单位
            name: this.x2_unit,
            nameLocation: 'center',
            nameTextStyle: { align: 'top', color: this.x2LabelColor, lineHeight: 40, },
            // x轴更换数据
            position: 'top',
            // 文本颜色为rgba(0,0,0,.6)  文字大小为 12
            axisLabel: {
              color: this.x2LabelColor,
              fontSize: 12
            },
            // x轴线的颜色为   rgba(0,0,0,.2)
            axisLine: {
              lineStyle: {
                color: this.x2LabelColor,
                opacity: 0.2
              }
            },
            axisTick: {
              //x轴刻度相关设置
              alignWithLabel: false,
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
            color: '#9D9EA0',
            fontSize: 12,

          },
          data: this.tip
        },
        {
          gridIndex: 1,
          type: 'category',
          name: this.y_unit,
          show: this.dialogVisable ? this.y_show : false,
          nameTextStyle: {
            color: this.yLabelColor,
            fontSize: 14,
          },
          inverse: true,
          position: 'center',
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            show: this.dialogVisable ? this.y_show : false,
            color: this.yLabelColor,
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
        },
        {
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
            color: '#9D9EA0',
            fontSize: 12,
          },
          data: this.tip
        },],
        dataZoom: [{
          "show": this.dialogVisable ? true : false,
          "height": '70%',
          width: 12,
          yAxisIndex: [0, 1, 2], // 表示这个 dataZoom 组件控制 第一个 和 第三个 yAxis
          bottom: '10%',
          "start": 10,
          "end": 30,
          handleIcon: 'path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z',
          handleSize: '110%',
          handleStyle: {
            color: "#d3dee5",

          },
          textStyle: {
            color: "#000"
          },
          borderColor: "#90979c"
        },
          // {
          //   // "type": "inside",
          //   "show": true,
          //   "height": 15,
          //   "start": 1,
          //   "end": 35
          // }
        ],
        series: [
          { //数据
            name: '男性人数',
            xAxisIndex: 0,
            yAxisIndex: 0,
            "type": "pictorialBar",
            // "animationDuration": 0,
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
              show: this.dialogVisable ? this.itemLabel_show : false,
              position: 'left',
              formatter: '{c}',
              color: this.textColor
            },
            "symbolRepeat": "fixed",
            "symbolMargin": "8",
            symbol: man,
            "symbolClip": true,
            "symbolSize": [15, 20],
            "symbolPosition": "start",
            "symbolOffset": [
              0, 0
            ],
            // "symbolBoundingData": 5000,
            "data": this.boy,
          },
          { //数据
            name: '女性人数',
            xAxisIndex: 2,
            yAxisIndex: 2,
            "type": "pictorialBar",
            // "animationDuration": 0,
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
              show: this.dialogVisable ? this.itemLabel_show : false,
              position: 'right',
              formatter: '{c}',
              color: this.textColor
            },
            "symbolRepeat": "fixed",
            "symbolMargin": "8",
            symbol: woman,
            "symbolClip": true,
            "symbolSize": [15, 20],
            "symbolPosition": "start",
            "symbolOffset": [
              0, 0
            ],
            // "symbolBoundingData": 5000,
            "data": this.girl,
          },]
      };
      this.myChart.setOption(option);
      return option
    },
  }
};
</script>

<style scoped>
@import '../../css/yaohao.css';
</style>
