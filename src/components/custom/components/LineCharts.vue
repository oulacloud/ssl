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
      <show-table :title="title_text" :resData="resData" />
      
     

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
  data() {
    return {
      dialogVisable: false,
      dialogTableVisible: false,
      barWidth: 10,
      drawer: false,
      resData: {}, // 请求的数据,
      renciData: [], // 人次
      renshuData: [], // 人数
      divisionData: [], // 人次/人数
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
    async getli() {
      let res = await getPptFive();

      this.renciData = res.data.data.map((x) =>
        (x.NUM_RENCI / 10000).toFixed(1)
      );
      this.renshuData = res.data.data.map((x) =>
        (x.NUM_RENSHU / 10000).toFixed(1)
      );
      this.divisionData = res.data.data.map((x) =>
        x.RENCI_DIVISION_RENSHU.toFixed(2)
      );

      this.resData = res.data.data;
      console.log(this.resData);
    },
    drawChart() {
      let options = {
        title: {
          text: this.title_text,
          left: "center",
        },
        tooltip: {
          trigger: "item",
          axisPointer: {
            // Use axis to trigger tooltip
            type: "shadow", // 'shadow' as default; can also be 'line' or 'shadow'
          },
        },
        legend: {
          show: this.legend_show,
          padding: [40, 0, 0, 0],
          orient: this.legend_orient,
        },

        toolbox: {
          show: false,
          feature: {
            saveAsImage: { show: true },
            restore: { show: true },
            magicType: {
              type: ["line", "bar", "stack"],
            },
          },
        },
        grid: {
          left: "1%",
          right: "1%",
          bottom: "1%",
          containLabel: true,
        },
        xAxis: [
          {
            show: this.x_show,
            // name是单位
            name: this.x_unit1,
            position: "bottom",
            type: "value",
            axisLabel: {
              formatter: "{value}",
            },
            axisLine: {
              onZero: false,
            },
          },
          {
            show: this.x_show,
            // name是单位
            name: this.x_unit2,
            position: "top",
            type: "value",
            axisLabel: {
              formatter: "{value}",
            },
          },
        ],
        yAxis: {
          show: this.y_show,
          name: this.y_unit,
          type: "category",
          data: ["2018", "2019", "2020", "2021", "2022", "2023"],
          axisLabel: {
            margin: 10,
          },
        },
        series: [
          {
            name: "登记人次",

            type: "bar",
            barCategoryGap: '50%',
            barWidth: this.barWidth,
            label: {
              show: false,
              formatter: "{c}",
            },
            emphasis: {
              focus: "series",
            },
            data: this._data.renciData,
            showBackground: this.showBackground,
          },
          {
            name: "登记人数",
            type: "bar",

            barWidth: this.barWidth,
            label: {
              show: false,
              formatter: "{c}",
            },
            emphasis: {
              focus: "series",
            },
            data: this._data.renshuData,
            showBackground: this.showBackground,
          },
          {
            name: "人均登记次数",
            type: "line",
            xAxisIndex: 1,
            barWidth: this.barWidth,
            label: {
              show: false,
              formatter: "{c}",
            },
            emphasis: {
              focus: "series",
            },
            data: this._data.divisionData,
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

          console.log(options.legend);
          const modifiedOptions = {
            ...options,
            options: (options.legend.show = true),

            series: options.series.map((series) => ({
              ...series,
              barWidth: 30,
              label: {
                ...series.label,
                show: true,
              },
            })),
            xAxis: options.xAxis.map((xAxis) => ({
              ...xAxis,
              show: true,
            })),
            options: (options.yAxis.show = true),
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

  async mounted() {
    await this.getli();

    // 初始化图表
    this.one = echarts.init(this.$refs.one, this.currentTheme);

    this.drawChart();
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