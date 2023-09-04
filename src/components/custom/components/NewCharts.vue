<template>
  <el-card id="echartsCard">
    <div class="chart_box" @click="zoom">
      <!-- 图表 -->
      <div class="mycharts" ref="one"></div>
    </div>

    <el-dialog
      :visible.sync="dialogVisable"
      :fullscreen="true"
      :before-close="destory"
      center
    >
      <!-- 展示table  -->
      <!-- <show-table :title="title_text" :resData="resData" /> -->

      <div class="fullCharts">
        <div class="mycharts" ref="fullOne"></div>
      </div>
    </el-dialog>
  </el-card>
</template>
  
  <script>
import { getPptFive } from "../../../api/echarts";
import * as echarts from "echarts";
import showTable from "./showTable.vue";
export default {
  components: { showTable },
  props: {
    chartName: {
      type: String,
      require: true,
    },
    resultData: {
      type: Array,
      require: true,
    },
  },
  data() {
    return {
      dialogVisable: false,
      dialogTableVisible: false,
      barWidth: 10,
      drawer: false,
      resData: {}, // 请求的数据,
      barData: [],
      lineData: [],
      xData: [],
      yData: [], // y轴数据
      activeName: "",
      title_text: "2018-2022年购房人数情况比较",
      x_show: false,
      y_show: false,
      x_unit1: "",
      x_unit2: "",
      y_unit: "",
      imageUrl: "",
      legend_show: false,
      legend_orient: "horizontal",
      showBackground: true,
      theme: [
        {
          value: "明亮",
          colors: [
            "#4992ff",
            "#7cffb2",
            "#fddd60",
            "#58d9f9",
            "#05c091",
            "#ff8a45",
          ],
        },
        {
          value: "粉青",
          colors: [
            "#fc97af",
            "#87f7cf",
            "#f7f494",
            "#72ccff",
            "#f7c5a0",
            "#d4a4eb",
          ],
        },
        {
          value: "蓝绿",
          colors: [
            "#2ec7c9",
            "#b6a2de",
            "#5ab1ef",
            "#ffb980",
            "#d87a80",
            "#8d98b3",
          ],
        },
        {
          value: "橘红",
          colors: [
            "#893448",
            "#d95850",
            "#eb8146",
            "#ffb248",
            "#f2d643",
            "#ebdba4",
          ],
        },
        {
          value: "青草",
          colors: [
            "#2ec7c9",
            "#b6a2de",
            "#5ab1ef",
            "#ffb980",
            "#d87a80",
            "#8d98b3",
          ],
        },
        {
          value: "复古",
          colors: [
            "#e01f54",
            "#5e4ea5",
            "#f5e8c8",
            "#b8d2c7",
            "#c6b38e",
            "#a4d8c2",
          ],
        },
      ],
      currentTheme: "",
      one: null,
      fullOne: null,
    };
  },
  methods: {
    // 处理传来的props的数据
    drawChart() {
    //   this.barData = this.$props.resultData.map((x) => x.second);
    //   this.lineData = this.$props.resultData.map((x) => x.third);
    //   this.xData = this.$props.resultData.map((x) => x.first);
    //   console.log("第一次",this.barData)
      let options = {
        backgroundColor: this.backgroundColor,
        title: {
          text: this.$props.chartName,
          left: "center",
        },
        grid: {
          left: "1%",
          right: "1%",
          bottom: "1%",
          top:"22%",
          containLabel: true,
        },
        legend: {
          show: this.legend_show,
          padding: [40, 0, 0, 0],
          textStyle: {
            color: "rgba(0,0,0,.6)",
          },
        },
        tooltip: {
          trigger: "axis",
        },
        xAxis: [
          {
            type: "category",
            // boundaryGap: true,
            show: this.x_show,
            // name是单位
            name: this.x_unit,
            data: this.$props.resultData.map((x) => x.first),
            nameLocation: "center",
            nameTextStyle: {
              align: "right",
              color: "#000",
              verticalAlign: "top",
              lineHeight: 40,
            },
            // 文本颜色为rgba(0,0,0,.6)  文字大小为 12
            axisLabel: {
              color: "rgba(0,0,0,.6)",
              fontSize: 12,
            },
            // x轴线的颜色为   rgba(0,0,0,.2)
            axisLine: {
              lineStyle: {
                color: "rgba(0,0,0,.2)",
              },
            },
            axisTick: {
              //x轴刻度相关设置
              alignWithLabel: false,
            },
          },
        ],
        yAxis: [
          {
            show: this.y_show,
            name: this.y_unit,
            alignTicks: true,
            nameTextStyle: {
              color: "rgba(0,0,0,.6)",
              fontSize: 14,
            },
            type: "value",
            splitLine: {
              show: true,
              lineStyle: {
                color: "rgba(0,0,0,.1)",
              },
            },
            axisLabel: {
              show: true,
              margin: 20,
              color: "rgba(0,0,0,.6)",
            },
          },
          {
            type: "value",
            show: this.y_show,
            name: this.y_unit,
            splitLine: {
              show: true,
              lineStyle: {
                color: "rgba(0,0,0,.1)",
              },
            },
          },
        ],
        series: [
          {
            name: "成交套数",
            yAxisIndex: 0,
            type: "bar",
            barCategoryGap: '50%',
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                {
                  offset: 0,
                  color: "#2af598",
                },
                {
                  offset: 1,
                  color: "#009efd",
                },
              ]),
              borderRadius: 8,
            },
            barWidth: "30%",
            label: {
              show: false,
              position: "top",
              color: "#000",
              formatter: "{c}",
            },
            data: this.$props.resultData.map((x) => x.second),
          },
          {
            name: "成交均价(元/㎡)",
            yAxisIndex: 1,
            type: "line",
            smooth: true,
            label: {
              show: false,
              position: "top",
              color: "#000",
              formatter: "{c}",
            },
            lineStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "rgba(255, 227, 168, 0)",
                },
                {
                  offset: 0.5,
                  color: "rgba(255, 227, 168, 1)",
                },
                {
                  offset: 1,
                  color: "rgba(255, 227, 168, 0)",
                },
              ]),
              shadowColor: "rgba(255, 120, 0,1)",
              shadowBlur: 8,
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "rgba(197, 106, 255, 0.8)",
                },
                {
                  offset: 0.6,
                  color: "rgba(255, 120, 0, 0.1)",
                },
              ]),
            },
            data: this.$props.resultData.map((x) => x.third),
          },
        ],
      };

      this.one.setOption(options);

      return options;
    },
    zoom() {
      this.dialogVisable = true;

      this.$nextTick(() => {
        const chartFull = this.$refs.fullOne;

        if (chartFull) {
          this.fullOne = echarts.init(this.$refs.fullOne, this.currentTheme);

          let options = this.drawChart();

          console.log(options.legend.show);
          const modifiedOptions = {
            ...options,
            options: (options.legend.show = true),

            series: options.series.map((series) => ({
              ...series,
              label: {
                ...series.label,
                show: true,
              },
            })),
            xAxis: options.xAxis.map((xAxis) => ({
              ...xAxis,
              show: true,
            })),
            yAxis: options.yAxis.map((yAxis) => ({
                ...yAxis,
                show: true
            }))
          };

          console.log(modifiedOptions);
          this.fullOne.setOption(modifiedOptions);
        }
      });

      console.log("触发子组件的函数");

      this.$emit("zoom-in");
    },
    destory(done) {
      this.$confirm("确认关闭?")
        .then((_) => {
          this.fullOne.dispose();
          done();
        })
        .catch((_) => {});
    },
    showTable() {
      this.dialogTableVisible = !this.dialogTableVisible;
    },
  },

  mounted() {
    // 初始化图表

    console.log("mounted",this.$props.resultData)
    this.one = echarts.init(this.$refs.one, this.currentTheme);

    this.$nextTick(() => {
        this.drawChart();
    })
    
  },
};
</script>
  
<style lang="less" scoped>
#echartsCard {
  height: 100%;
  width: 100%;
  background-size: 100% 100%;
}

.mycharts {
  height: 100%;
  width: 100%;
}

.chart_box {
  height: 300px;
  width: 100%;
  margin: 0 auto;
}

// #echartsCard:hover {
//   background: #000;
// }

.fullCharts {
  height: 700px;
  width: 100%;
}
</style>