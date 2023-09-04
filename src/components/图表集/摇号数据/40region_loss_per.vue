<template>
  <div class="Lbody" id="Lbody">
    <div class="box_fex">
      <el-tooltip content="修改样式" placement="top">
        <el-button @click="drawer = true" type="default" icon="el-icon-edit" circle id="edit-btn"></el-button>
      </el-tooltip>
      <el-popover placement="top-start" title="" width="200" trigger="hover" class="refer_btn" content="注：图表详情信息">
        <el-button slot="reference" icon="el-icon-question" circle></el-button>
      </el-popover>
      <el-button @click="copy" icon="el-icon-share" circle>
      </el-button>
    </div>
    <div class="eldrawer">
      <el-drawer :visible.sync="drawer" direction="ltr" custon-class="drawer" :modal=false title="修改配置项">
        <el-tabs type="border-card">
          <!-- 图表选项 -->
          <el-tab-pane>
            <span slot="label"><i class="el-icon-setting"></i>图表选项</span>

            <!-- 标题文本控制 -->
            <el-collapse accordion>
              <el-collapse-item title="标题文本" name="1.1">

                <!-- 标题内容 -->
                <div class="block">
                  <el-input v-model="title_text" placeholder="请输入图表标题">
                    <span slot="prepend">标题</span>
                  </el-input>
                </div>

                <!-- 标题大小 -->
                <el-form label-width="80px" label-position="left">
                  <el-form-item label="字体大小">
                    <el-slider v-model="title_size" show-input>
                    </el-slider>
                  </el-form-item>
                </el-form>

                <!-- 距离顶部距离 -->
                <el-form label-width="80px" label-position="left">
                  <el-form-item label="顶部距离">
                    <el-slider v-model="title_top" show-input>
                    </el-slider>
                  </el-form-item>
                </el-form>

                <!-- 距离左边距离 -->
                <el-form label-width="80px" label-position="left">
                  <el-form-item label="左边距离">
                    <el-slider v-model="title_left" show-input>
                    </el-slider>
                  </el-form-item>
                </el-form>

                <!-- 标题颜色 -->
                <div class="block">
                  <div class="block_left">
                    <el-input v-model="title_color" placeholder="请选择标题颜色" class="input">
                      <span slot="prepend">标题颜色</span>
                    </el-input>
                  </div>
                  <div class="block_right">
                    <el-color-picker show-alpha v-model="title_color" class="colorPicker">
                    </el-color-picker>
                  </div>
                </div>

                <!-- 背景颜色 -->
                <div class="block">
                  <div class="block_left">
                    <el-input v-model="title_bg_color" placeholder="请选择背景颜色" class="input">
                      <span slot="prepend">背景颜色</span>
                    </el-input>
                  </div>
                  <div class="block_right">
                    <el-color-picker show-alpha v-model="title_bg_color" class="colorPicker">
                    </el-color-picker>
                  </div>
                </div>

              </el-collapse-item>
            </el-collapse>

            <!-- 图例选项 -->
            <el-collapse accordion>
              <el-collapse-item title="图例选项" name="1.2">

                <!-- 图例显示 -->
                <el-switch v-model="leg_show" inactive-text="是否显示">隐藏
                </el-switch>

                <!-- 图例水平垂直切换 -->
                <el-switch v-model="leg_h_v" inactive-text="水平/垂直">
                </el-switch>

                <!-- 距离顶部距离 -->
                <el-form label-width="80px" label-position="left">
                  <el-form-item label="顶部距离">
                    <el-slider v-model="leg_top" show-input>
                    </el-slider>
                  </el-form-item>
                </el-form>

                <!-- 距离左边距离 -->
                <el-form label-width="80px" label-position="left">
                  <el-form-item label="左边距离">
                    <el-slider v-model="leg_left" show-input>
                    </el-slider>
                  </el-form-item>
                </el-form>

              </el-collapse-item>
            </el-collapse>

            <!-- X轴选项 -->
            <el-collapse accordion>
              <el-collapse-item title="X轴选项" name="1.2">

                <!-- 刻度标签 -->
                <div class="block">
                  <el-switch v-model="x_label_show" inactive-text="标签显示" class="switch">
                  </el-switch>
                </div>

                <!-- 字体加粗 -->
                <div class="block">
                  <el-switch v-model="x_font_bold" inactive-text="是否粗体" class="switch">
                  </el-switch>
                </div>

                <!-- 标签颜色 -->
                <div class="block">
                  <div class="block_left">
                    <el-input v-model="x_font_color" placeholder="请选择字体颜色" class="input">
                      <span slot="prepend">标签颜色</span>
                    </el-input>
                  </div>
                  <div class="block_right">
                    <el-color-picker show-alpha v-model="x_font_color" class="colorPicker">
                    </el-color-picker>
                  </div>
                </div>

                <!-- 轴线显示 -->
                <div class="block">
                  <el-switch v-model="x_line_show" inactive-text="轴线显示" class="switch">
                  </el-switch>
                </div>

                <!-- 字体大小 -->
                <el-form label-width="80px" label-position="left">
                  <el-form-item label="字体大小">
                    <el-slider v-model="x_font_size" show-input>
                    </el-slider>
                  </el-form-item>
                </el-form>

                <!-- x轴单位 -->
                <div class="block">
                  <div class="block_left">
                    <el-input v-model="x_unit" placeholder="请输入单位" class="input">
                      <span slot="prepend">x轴单位</span>
                    </el-input>
                  </div>
                </div>

                <!-- 倾斜角度 -->
                <el-form label-width="80px" label-position="left">
                  <el-form-item label="倾斜角度">
                    <el-slider v-model="x_rotate" :max=90 show-input>
                    </el-slider>
                  </el-form-item>
                </el-form>

              </el-collapse-item>
            </el-collapse>

            <!-- y轴选项 -->
            <el-collapse accordion>
              <el-collapse-item title="Y轴选项" name="1.2">

                <!-- 刻度标签 -->
                <div class="block">
                  <el-switch v-model="y_label_show" inactive-text="标签显示" class="switch">
                  </el-switch>
                </div>

                <!-- 字体加粗 -->
                <div class="block">
                  <el-switch v-model="y_font_bold" inactive-text="是否粗体" class="switch">
                  </el-switch>
                </div>

                <!-- 标签颜色 -->
                <div class="block">
                  <div class="block_left">
                    <el-input v-model="y_font_color" placeholder="请选择字体颜色" class="input">
                      <span slot="prepend">标签颜色</span>
                    </el-input>
                  </div>
                  <div class="block_right">
                    <el-color-picker show-alpha v-model="y_font_color" class="colorPicker">
                    </el-color-picker>
                  </div>
                </div>

                <!-- 轴线显示 -->
                <div class="block">
                  <el-switch v-model="y_line_show" inactive-text="轴线显示" class="switch">
                  </el-switch>
                </div>

                <!-- 字体大小 -->
                <el-form label-width="80px" label-position="left">
                  <el-form-item label="字体大小">
                    <el-slider v-model="y_font_size" show-input>
                    </el-slider>
                  </el-form-item>
                </el-form>

                <!-- y轴单位 -->
                <div class="block">
                  <div class="block_left">
                    <el-input v-model="y_unit" placeholder="请输入单位" class="input">
                      <span slot="prepend">Y轴单位</span>
                    </el-input>
                  </div>
                </div>

              </el-collapse-item>
            </el-collapse>

            <!-- 布局 -->
            <el-collapse accordion>
              <el-collapse-item title="布局" name="1.2">

                <!-- 左右缩放距离 -->
                <el-form label-width="80px" label-position="left">
                  <el-form-item label="左右缩放">
                    <el-slider v-model="width_dis" show-input>
                    </el-slider>
                  </el-form-item>
                </el-form>

                <!-- 上下缩放距离 -->
                <el-form label-width="80px" label-position="left">
                  <el-form-item label="上下缩放">
                    <el-slider v-model="height_dis" show-input>
                    </el-slider>
                  </el-form-item>
                </el-form>

                <!-- 自定义文案 -->
                <el-switch v-model="customText_show" inactive-text="自定义文案">
                </el-switch>
                <div class="block">
                  <el-input type="textarea" v-model="customText" placeholder="请输入自定义文案" :disabled="customText_show">
                  </el-input>
                </div>

              </el-collapse-item>
            </el-collapse>

          </el-tab-pane>
        </el-tabs>
      </el-drawer>
    </div>
    <div ref="chart" class="chart"></div>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import axios from 'axios'
import elementResizeDetectorMaker from 'element-resize-detector'
var vm = null

export default {
  data() {
    return {
      myChart: null,
      drawer: false,
      data_1: [],
      data_2: [],
      data: {},
      width_dis: 10,
      height_dis: 30,
      customText_show: false,
      customText: '',
      colors_list: [
        { value: '1', colors: ['rgba(25,202,173,0.5)', 'rgba(25,202,173,1)'] },
        { value: '2', colors: ['rgba(140,199,181,0.5)', 'rgba(140,199,181,1)'] },
        { value: '3', colors: ["rgba(160,238,225,0.5)", "rgba(140,199,181,1)"] },
        { value: '4', colors: ["rgba(190,231,233,0.5)", "rgba(190,231,233,1)"] },
        { value: '5', colors: ["rgba(199,237,199,0.5)", "rgba(199,237,199,1)"] },
      ],

      // 标题
      title_text: "2018-2023年杭州市摇号情况",
      title_left: 50,
      title_top: 0,
      title_color: "rgba(0,0,0,1)",
      title_size: 20,
      title_bg_color: "rgba(255,255,255,0)",

      // 图例
      leg_h_v: true,
      leg_show: true,
      leg_left: 50,
      leg_top: 5,
      leg_text_color: "rgba(0,0,0,1)",
      leg_text_size: 12,
      legendWidth: 0,

      //x轴
      x_data: [],
      x_label_show: true,
      x_unit: '单位',
      x_font_color: 'rgba(0,0,0,1)',
      x_font_size: 12,
      x_font_bold: true,
      x_line_show: true,
      x_rotate: 0,

      //y轴
      y_unit: '单位',
      y_label_show: true,
      y_line_show: true,
      y_font_bold: true,
      y_font_color: 'rgba(0,0,0,1)',
      y_font_size: 12,
    }
  },
  created() {
    vm = this
  },
  async mounted() {
    // methods.initWatermark()
    await this.getData() //获取摇号数据
    this.myChart = echarts.init(this.$refs.chart)
    this.initListenToDiv(this.$refs.chart)
    this.drawChart()
    this.get_itemWidth()
  },
  computed: {
    change() {
      const {
        // title
        title_text,
        title_left,
        title_top,
        title_color,
        title_bg_color,
        title_size,
        // leg
        leg_h_v,
        leg_show,
        leg_left,
        leg_top,
        leg_text_color,
        // x
        x_label_show,
        x_unit,
        x_font_color,
        x_font_size,
        x_font_bold,
        x_line_show,
        x_rotate,
        //y
        y_font_bold,
        y_font_color,
        y_line_show,
        y_label_show,
        y_font_size,
        y_unit,
        // grid
        width_dis,
        height_dis,
        customText_show,
        customText,
      } = this
      return {
        title_text,
        title_left,
        title_top,
        title_color,
        title_bg_color,
        title_size,
        leg_h_v,
        leg_show,
        leg_left,
        leg_top,
        leg_text_color,
        x_label_show,
        x_unit,
        x_font_color,
        x_font_size,
        x_font_bold,
        x_line_show,
        x_rotate,
        y_font_bold,
        y_font_color,
        y_line_show,
        y_label_show,
        y_font_size,
        y_unit,
        width_dis,
        height_dis,
        customText_show,
        customText,
      }
    }
  },
  watch: {
    legendWidth: {
      deep: true,
      immediate: true,
      handler: async function (newval, oldval) {
        if (this.myChart) {
          // this.myChart.dispose()
          this.drawChart()
        }
      }
    },
    change() {
      if (this.myChart) {
        this.drawChart()
      }
    },
  },
  methods: {
    initListenToDiv(ref) {
      let erd = elementResizeDetectorMaker()
      let that = this
      erd.listenTo(ref, () => {
        that.$nextTick(function () {
          //使echarts尺寸重置
          that.myChart.resize()
        })
      })
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
    async getData() {
      await axios.get("http://sslapi.nadibao.cn/api/HzYaoHaoData/Get_MID_YEAR_ADD_NUM_ONEYEAR_AND_ALLYEAAR")
        .then(res => {
          for (var i = 0; i < res.data.data.length; i++) {
            this.x_data.push(res.data.data[i].NAME)
            this.data_1.push(parseFloat((res.data.data[i].NUM_RENCI / 10000).toFixed(2)))
            this.data_2.push(parseFloat((res.data.data[i].NUM_RENSHU / 10000).toFixed(2)))
          }
        })
    },
    get_itemWidth() {
      const chartOptions = this.myChart.getOption()
      const legendData = chartOptions.series
      const fontsize = chartOptions.legend[0].textStyle.fontSize
      const itemWidth = chartOptions.legend[0].itemWidth
      const itemGap = chartOptions.legend[0].itemGap
      this.legendWidth = 0
      for (let i = 0; i < legendData.length; i++) {
        var length = legendData[i].name.length
        var fontwidth = length * fontsize
        this.legendWidth = this.legendWidth + fontwidth + itemWidth
      }
      var len = legendData.length - 1
      this.legendWidth = this.legendWidth + itemGap * len
    },
    drawChart() {
      function getTableLine(num) {
        var list = [];
        var bottom = 128;
        var height = 21;
        for (var i = 0; i < num; i++) {
          list.push({
            type: 'line',
            bottom: bottom - i * height,
            right: "4.9%",
            style: {
              fill: '#333'
            },
            shape: {
              x1: 0,
              y1: 0,
              x2: 2000,
              y2: 0
            }
          });
        }
        return list;
      }
      var lineList = getTableLine(3);
      // 2.指定配置
      var option = {
        backgroundColor: '#fff', //背景色
        title: [{
          backgroundColor: this.title_bg_color,
          text: this.title_text,
          textAlign: 'center',
          left: this.title_left + '%',
          top: this.title_top + '%',
          textStyle: {
            color: this.title_color,
            fontSize: this.title_size,
          }
        },
        {
          text: ' \n摇号人次\n摇号人数',
          bottom: 82,
          left: 10,
          textStyle: {
            lineHeight: 20,
            fontSize: 13,
            fontWeight: 'normal',
            formatter: function (value) {
              return '{table|' + value + '}';
            },
            rich: {
              table: {
                align: 'center'
              }
            }
          }
        }],
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
        tooltip: {
          show: true,
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#283b56'
            }
          }
        },
        legend: {
          type: 'plain',
          orient: this.leg_h_v ? 'horizontal' : 'vertical',
          show: this.leg_show,
          left: this.leg_left + '%',
          top: this.leg_top + "%",
          textStyle: {
            color: this.leg_text_color,
            fontSize: this.leg_text_size,
          },
          padding: [0, 0, 0, -this.legendWidth / 2]
        },
        grid: {
          top: this.height_dis / 2 + "%",
          left: this.width_dis / 2 + '%',
          right: this.width_dis / 2 + '%',
          bottom: this.height_dis / 2 + "%",
          containLabel: true
        },
        graphic: lineList,
        xAxis: {
          show: true,
          name: this.x_unit,
          nameLocation: 'end',
          type: 'category',
          nameTextStyle: {
            color: this.x_font_color,
            fontSize: this.y_font_size,
          },
          data: this.x_data,
          axisLine: {
            show: this.x_line_show,
            lineStyle: {
              color: '#B5B5B5',
            },
          },
          axisTick: {
            length: 68,
          },
          // axisLabel: {
          //   margin: 20, //刻度标签与轴线之间的距离。
          //   interval: 0, // 强制全部显示
          //   rotate: this.x_rotate, //标签倾斜度数
          //   show: this.x_label_show,
          //   fontFamily: 'Microsoft YaHei',
          //   color: this.x_font_color,
          //   fontSize: this.x_font_size,
          //   fontStyle: this.x_font_bold ? 'bold' : '',
          // },
          axisLabel: {
            formatter: function (value, index) {
              return '{table|' + value +
                '}\n{table|' + vm.data_1[index] +
                '}\n{table|' + vm.data_2[index] + '}';
            },
            rich: {
              table: {
                lineHeight: 20,
                align: 'center'
              }
            }
          }
        },
        yAxis: [
          {
            name: this.y_unit,
            nameTextStyle: {
              color: this.y_font_color,
              fontSize: this.y_font_size,
            },
            type: 'value',
            axisLine: {
              show: this.y_line_show,
              lineStyle: {
                color: '#B5B5B5',
              },
            },
            splitLine: {
              show: this.y_line_show,
              lineStyle: {
                // 使用深浅的间隔色
                color: ["#B5B5B5"],
                type: "dashed",
                opacity: 0.3,
              },
            },
            axisLabel: {
              show: this.y_label_show,
              fontFamily: 'Microsoft YaHei',
              color: this.y_font_color,
              fontSize: this.y_font_size,
            },
          },
        ],
        series: [
          {
            name: '摇号次数',
            type: 'line',
            smooth: true,
            label: {
              show: true,
              position: 'top',
              // formatter: '{c}%',
              color: '#000'
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
            data: this.data_1
          },
          {
            name: '摇号人数',
            type: 'line',
            smooth: true,
            label: {
              show: true,
              position: 'top',
              color: '#000'
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
            data: this.data_2
          }
        ],
      };

      // 3. 把配置项给实例对象
      this.myChart.setOption(option);
    },
  }
};
</script>

<style lang="less" scoped>
.Lbody {
  width: 100%;
  height: 100%;
}

.chart {
  width: 100%;
  height: calc(100% - 40px);
}

.box_fex {
  width: 100%;
  height: 40px;
}

/deep/ .el-collapse-item__content {
  padding-bottom: 0px;
}

/deep/ .el-drawer__container {
  position: relative;
  left: 0;
  right: 0;
  width: 100%;
}

.eldrawer /deep/ .el-drawer {
  width: 15% !important;
  min-width: 350px !important;
}

.el-collapse-item {
  width: 92%;
  margin: auto;
}

.el-drawer__header {
  margin-bottom: 20px;
}

.block {
  display: flex;
  width: 100%;
  height: 100%;
  margin-bottom: 5%;
}

.block_left {
  flex-grow: 1;
}

.block_right {
  width: 40px;
}

.el-color-picker {
  position: absolute;
}

.el-form-item {
  margin-bottom: 5%;
  // margin-top: 20px;
}

.el-switch {
  margin-bottom: 5%;
}

.col-head {
  width: auto;
  height: 32px;
  text-align: center;
  border: 1px solid #eee;
  padding: 5px;
  border-radius: 4px;
  margin-bottom: 8px;

  .col-head-text {
    display: inline-block;
    line-height: 32px;
    vertical-align: middle;
  }

  .icons {
    height: 25px;
    width: 25px;
    vertical-align: middle;

  }
}

.theme-plan-group {
  background-color: transparent;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  width: auto;
  height: 32px;
  overflow: hidden;
  border: 1px solid #eee;
  padding: 5px;
  border-radius: 4px;
  margin-bottom: 8px;
  cursor: pointer;

  .theme-plan-text {
    width: 32px;
    height: 30px;
    line-height: 30px;
    margin-bottom: 10px;
    margin-left: 10px;
    margin-right: 30px;
    display: inline-block;
    border-radius: 3px;
    font-family: "Hiragino Sans GB";
  }

  .theme-plan-color {
    width: 32px;
    height: 30px;
    line-height: 30px;
    margin-bottom: 10px;
    margin-left: 5px;
    margin-right: 2px;
    display: inline-block;
    border-radius: 3px;
  }
}

.el-radio {
  display: block;
  margin: 10px 0;
}
</style>
