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
              <el-collapse-item title="左图x轴" name="3">
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
                    <span slot="prepend">左图x轴单位</span>
                  </el-input>
                </div>
              </el-collapse-item>
              <el-collapse-item title="右图x轴" name="5">
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
                    <span slot="prepend">右图x轴单位</span>
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
                  <span class="demonstration">柱圆角半径</span>
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
                <div class="block">
                  <span class="demonstration">上图数据条颜色配置</span>
                  <el-input v-model="itemsColor" placeholder="请选择柱底部颜色" class="input">
                    <span slot="prepend">柱底部颜色</span>
                  </el-input>
                  <el-color-picker show-alpha v-model="itemsColor" class="colorPicker">
                  </el-color-picker><br>
                </div>
                <div class="block">
                  <el-input v-model="itemeColor" placeholder="请选择柱顶部颜色" class="input">
                    <span slot="prepend">柱顶部颜色</span>
                  </el-input>
                  <el-color-picker show-alpha v-model="itemeColor" class="colorPicker">
                  </el-color-picker><br>
                </div>
                <div class="block">
                  <span class="demonstration">折线数据条颜色配置</span>
                  <el-switch v-model="smooth" inactive-text="折线是否平滑" class="switch">
                  </el-switch>
                  <el-input v-model="items2Color" placeholder="请选择柱底部颜色" class="input">
                    <span slot="prepend">折线上部颜色</span>
                  </el-input>
                  <el-color-picker show-alpha v-model="items2Color" class="colorPicker">
                  </el-color-picker><br>
                </div>
                <div class="block">
                  <el-input v-model="iteme2Color" placeholder="请选择柱顶部颜色" class="input">
                    <span slot="prepend">折线下部颜色</span>
                  </el-input>
                  <el-color-picker show-alpha v-model="iteme2Color" class="colorPicker">
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
import methods from '../../图表集/js/methods'
// import 'echarts-gl'
import axios from 'axios'
import showTable from "./showTable.vue"
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
      renci: [],
      renshu: [],
      rate: [],
      nd: [],
      lj: [],
      cz: [],
      cj: [],
      sy: [],
      ls: [],
      data: [],


      // 样式配置参数
      drawer: false,
      activeName: '',
      title_text: "2018-2023年摇号情况",
      le_show: true,
      h_v: true,
      graphic_show: false,
      itemLabel_show: true,
      border_dis: 10,
      top: 7,
      left: 40,
      backgroundColor: '',
      titleColor: '#000000',
      textColor: '#000000',
      kColor: '#00c1de',
      itemsColor: 'rgba(77, 187, 255, 0.7)',
      itemeColor: "rgba(77, 187, 255, 0.7)",
      items2Color: 'rgba(251, 148, 53, .7)',
      iteme2Color: "rgba(251, 148, 53, .7)",
      xLabelColor: '#000000',
      yLabelColor: '#000000',
      y2LabelColor: '#000000',
      title_top: 3,
      title_left: 50,
      fontSize: 16,
      radius: 50,
      customText: '自定义文案',
      customText_show: true,
      x_show: true,
      y_show: true,
      y2_show: true,
      x_unit: '摇号人次展示情况',
      y_unit: '',
      y2_unit: '摇号人数展示情况',
      smooth: false,
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
      myChart: null,
      legendWidth: 0
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
    // this.get_itemWidth()
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
        kColor,
        itemsColor,
        itemeColor,
        items2Color,
        iteme2Color,
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
        smooth,
        imageUrl,
        currentTheme,
        legendWidth
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
        kColor,
        itemsColor,
        itemeColor,
        items2Color,
        iteme2Color,
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
        smooth,
        imageUrl,
        currentTheme,
        legendWidth
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
        // console.log("调用changeTheme", this.currentTheme,newtheme.value)
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
      // this.imageUrl = URL.createObjectURL(file);
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
    // get_itemWidth() {
    //         const chartOptions = this.myChart.getOption();
    //         const legendData = chartOptions.legend[0].data;  // Assuming the legend data is in the first legend component
    //         const textStyle = chartOptions.legend[0].textStyle;

    //         const font = textStyle.fontSize + ' ' + textStyle.fontFamily;

    //         let legendWidth = 0;

    //         // Create a hidden element to calculate the width
    //         const hiddenElement = document.createElement('div');
    //         hiddenElement.style.visibility = 'hidden';
    //         hiddenElement.style.position = 'absolute';
    //         hiddenElement.style.font = font;

    //         document.body.appendChild(hiddenElement);

    //         // Calculate the width of each legend item and find the maximum width
    //         for (let i = 0; i < legendData.length; i++) {
    //             hiddenElement.innerHTML = legendData[i];
    //             const itemWidth = hiddenElement.clientWidth;
    //             if (itemWidth > legendWidth) {
    //                 legendWidth = itemWidth;
    //             }
    //         }
    //         this.legendWidth = legendWidth * legendData.length
    //         console.log(legendData)
    //     },
    async getData() {
      await axios.get("http://sslapi.nadibao.cn/api/HzYaoHaoData/Get_MID_YEAR_ADD_NUM_ONEYEAR_AND_ALLYEAAR")
        .then(res => {
          this.resData = res.data.data;
          for (var i = 0; i < this.resData.length; i++) {
            this.x[i] = this.resData[i].NAME
            this.renci[i] = parseFloat((this.resData[i].NUM_RENCI / 10000).toFixed(2))
            this.renshu[i] = parseFloat((this.resData[i].NUM_RENSHU / 10000).toFixed(2))
            this.rate[i] = parseFloat((this.resData[i].RENCI_DIVISION_RENSHU).toFixed(2))
            this.nd[i] = parseFloat((this.resData[i].NUM_ONEYEAR / 10000).toFixed(2))
            this.cz[i] = parseFloat((this.resData[i].NUM_ALLYEAR / 10000).toFixed(2))
            this.lj[i] = parseFloat((this.resData[i].NUM_ONE_CUT_ALL / 10000).toFixed(2))
            this.cj[i] = parseFloat((this.resData[i].NUM_HOUSE_DEAL / 10000).toFixed(2))
            this.sy[i] = parseFloat((this.resData[i].NUM_REST_RENSHU / 10000).toFixed(2))
            this.ls[i] = parseFloat((this.resData[i].NUM_LOST_RENSHU / 10000).toFixed(2))
            this.data.push({ value: parseFloat((this.resData[i].NUM_RENCI / 10000).toFixed(2)), name: this.resData[i].NAME })
          }
          // console.log(this.res)
        })
    },
    drawChart() {
      // var myChart = echarts.init(document.querySelector(".bar .chart"));
      // 2. 指定配置项和数据
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
        toolbox: {
          show: this.dialogVisable ? this.tool_show : false,
          feature: {
            mark: {
              show: true
            },
            // magicType: {
            //   show: true,
            //   type: ['line', 'bar',]
            // },
            restore: { show: true },
            saveAsImage: {
              show: true
            },
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
          bottom: 20,
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
          bottom: 20,
          left: 10,
          style: {
            text: ['制作：数视灵',
            ].join('\n'),
            font: '14px Helvetica Neue',
            height: '1.0625rem '
          }
        },],
        grid: [
          {
            show: false,
            left: this.dialogVisable ? `${this.border_dis / 2 + '%'}` : '-20%',
            right: '50%',
            top: '15%',
            bottom: '10%',
            containLabel: true
          },
          {
            show: false,
            right: this.dialogVisable ? `${this.border_dis / 2 + '%'}` : '0%',
            left: '50%',
            top: '15%',
            bottom: '10%',
            // width: '80%',
            containLabel: false
          },
        ],
        // {
        //   top: "15%",
        //   left: this.dialogVisable ? `${this.border_dis / 2 + '%'}` : '-10%',
        //   right: `${this.border_dis / 2 + '%'}`,
        //   bottom: "10%",
        //   containLabel: true
        // },
        legend: {
          name: '',
          // padding:[0,0,0,-this.legendWidth/2],
          orient: this.h_v ? 'horizontal' : 'vertical',
          show: this.dialogVisable ? this.le_show : false,
          left: `${this.left + '%'}`,
          top: `${this.top + "%"}`,
          textStyle: {
            color: this.textColor
          },
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          },
          formatter: function (params) {
            const a = params[0];
            // console.log(params)
            var a1 = `${a.seriesName}: ${a.value > 0 ? a.value : -a.value}`;
            return a1;
          },
        },
        xAxis: [
          {
            type: "value",
            position: 'top',
            gridIndex: 0,
            show: this.dialogVisable ? this.x_show : false,
            // name是单位
            name: this.x_unit,
            nameLocation: 'center',
            nameTextStyle: { align: 'center', color: this.xLabelColor, verticalAlign: 'center', fontSize: 14, },
            // x轴更换数据
            // position: 'top',
            // 文本颜色为rgba(0,0,0,.6)  文字大小为 12
            axisLabel: {
              color: this.xLabelColor,
              fontSize: 14,
              lineHeight: 5
            },
            splitLine: {
              show: false,
            },
            axisLine: {
              show: false,
            },
            axisTick: {
              show: false,
            },
            axisLabel: {
              show: false
            },
            data: this.renci,
          },
          {
            type: "value",
            position: 'top',
            gridIndex: 1,
            show: this.dialogVisable ? this.y2_show : false,
            // name是单位
            name: this.y2_unit,
            nameLocation: 'center',
            nameTextStyle: { align: 'center', color: this.y2LabelColor, verticalAlign: 'center', fontSize: 14, },
            // x轴更换数据
            // position: 'top',
            // 文本颜色为rgba(0,0,0,.6)  文字大小为 12
            axisLabel: {
              color: this.y2LabelColor,
              fontSize: 12,
              lineHeight: 5
            },
            splitLine: {
              show: false,
            },
            axisLine: {
              show: false,
            },
            axisTick: {
              show: false,
            },
            axisLabel: {
              show: false
            },
            data: this.renshu,
          },
        ],
        yAxis: [{
          name: this.y_unit,
          nameLocation: 'start',
          nameTextStyle: { align: 'center', color: this.yLabelColor, verticalAlign: 'center', lineHeight: 0, },
          show: this.dialogVisable ? this.y_show : false,
          alignTicks: false,
          data: this.x,
          nameTextStyle: {
            color: this.yLabelColor,
            fontSize: 12,
          },
          gridIndex: 0,
          type: 'category',
          splitLine: {
            show: false,
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
          name: '',
          nameLocation: 'start',
          nameTextStyle: { align: 'center', color: this.yLabelColor, verticalAlign: 'center', lineHeight: 0, },
          show: false,
          alignTicks: false,
          data: this.x,
          // nameTextStyle: {
          //   color: this.y2LabelColor,
          //   fontSize: 14,
          // },
          gridIndex: 1,
          type: 'category',
          splitLine: {
            show: false,
          },
          axisLine: { show: false },
          axisTick: {
            //x轴刻度相关设置
            show: false,
          },
          axisLabel: {
            show: false,
            formatter: function (params) {
              // 对数据进行加法运算
              var value = params * (-1);
              return value;
            },
            margin: 20,
            color: this.y2LabelColor,
          },
        },
        ],
        series: [
          {
            name: "摇号人次",
            type: "bar",
            xAxisIndex: 0,
            yAxisIndex: 0,
            barWidth: '30%',
            // showBackground: true,
            backgroundStyle: {
              color: 'rgba(0,133,245,0.3)'
            },
            label: {
              show: this.dialogVisable ? this.itemLabel_show : false,
              position: 'inside',
              color: this.textColor,
            },
            itemStyle: {
              borderRadius: this.radius,
              color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                {
                  "offset": 0,
                  "color": vm.itemsColor
                },
                {
                  "offset": 1,
                  "color": vm.itemeColor
                }
              ])
            },
            data: this.renci,
            z: 10,
            zlevel: 0
          },
          {
            // 下图
            name: "摇号人数",
            type: "line",
            xAxisIndex: 1,
            yAxisIndex: 1,
            smooth: this.smooth,
            // symbol: 'arrow',
            // symbolSize: 10,
            label: {
              show: this.dialogVisable ? this.itemLabel_show : false,
              position: 'right',
              formatter: '{c}',
              color: this.textColor
            },
            lineStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: vm.items2Color,
                },
                {
                  offset: 1,
                  color: vm.iteme2Color,
                },
              ]),
              shadowColor: vm.items2Color,
              shadowBlur: 8,
            },
            // areaStyle: {
            //   show:false,
            //   color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
            //     {
            //       offset: 0,
            //       color: 'rgba(197, 106, 255, 0)',
            //     },
            //     {
            //       offset: 0.6,
            //       color: 'rgba(255, 120, 0, 0.6)',
            //     },
            //   ]),
            // },
            data: this.renshu,
            z: 10,
            zlevel: 0
          }
        ],
      }
      // 3. 把配置项给实例对象
      this.myChart.setOption(option, true);
      return option
    },
  }
};
</script>

<style scoped>
@import '../../css/yaohao.css';
</style>
