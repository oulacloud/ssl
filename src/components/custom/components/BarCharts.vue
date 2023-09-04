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
      

      <div class="fullCharts">
        <div class="mycharts" ref="fullOne">
          <!-- 展示table  -->
            <show-table :title="title_text" :resData="resData" />
        </div>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
import { GetPptSix } from "../../../api/echarts";
import * as echarts from "echarts";
import showTable from "./showTable.vue";
export default {
  components: {
    showTable,
  },
  data() {
    return {
      dialogVisable: false,
      dialogTableVisible: false,
      drawer: false,
      manData: [], // 人才
      haveHouse: [], // 有房
      noHouse: [], // 无房
      yData: [], // y轴数据
      activeName: "",
      title_text: "2018-2022年累计净增购房人有无房比例",
      x_show: false,
      y_show: false,
      x_unit: "",
      y_unit: "",
      imageUrl: "",
      barWidth: 10,
      legend_show: false,
      showBackground: false,
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
      resData: {},
    };
  },
  methods: {
    async getli() {
      let res = await GetPptSix();

      this.yData = res.data.data.map((x) => x.MYPTAN_YEAR_NAME);

      this.manData = res.data.data.map((x) =>
        (
          ((x.MYPTAN_NUM1 + x.MYPTAN_NUM4) /
            (x.MYPTAN_NUM1 +
              x.MYPTAN_NUM2 +
              x.MYPTAN_NUM3 +
              x.MYPTAN_NUM4 +
              x.MYPTAN_NUM5 +
              x.MYPTAN_NUM6)) *
          100
        ).toFixed(2)
      );

      this.noHouse = res.data.data.map((x) =>
        (
          ((x.MYPTAN_NUM2 + x.MYPTAN_NUM5) /
            (x.MYPTAN_NUM1 +
              x.MYPTAN_NUM2 +
              x.MYPTAN_NUM3 +
              x.MYPTAN_NUM4 +
              x.MYPTAN_NUM5 +
              x.MYPTAN_NUM6)) *
          100
        ).toFixed(2)
      );

      this.haveHouse = res.data.data.map((x) =>
        (
          ((x.MYPTAN_NUM3 + x.MYPTAN_NUM6) /
            (x.MYPTAN_NUM1 +
              x.MYPTAN_NUM2 +
              x.MYPTAN_NUM3 +
              x.MYPTAN_NUM4 +
              x.MYPTAN_NUM5 +
              x.MYPTAN_NUM6)) *
          100
        ).toFixed(2)
      );

      this.resData = res.data.data;
      console.log(this.resData)
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
        },
        graphic: {
          type: "text",
          bottom: 28,
          right: 10,
          style: {},
        },
        toolbox: {
          show: false,
          feature: {
            saveAsImage: { show: true },
          },
        },
        grid: {
          left: "1%",
          right: "1%",
          bottom: "1%",

          containLabel: true,
        },
        xAxis: {
          show: this.x_show,
          // name是单位
          name: this.x_unit,
          max: "100",
          type: "value",
          axisLabel: {
            formatter: "{value}%",
          },
        },
        yAxis: {
          show: this.y_show,
          name: this.y_unit,
          type: "category",
          data: ["2018", "2019", "2020", "2021", "2022"],
          axisLabel: {
            margin: 30,
          },
        },
        series: [
          {
            name: "高层次人才",

            type: "bar",
            stack: "total",
            barWidth: this.barWidth,
            label: {
              show: false,
              formatter: "{c}%",
            },
            emphasis: {
              focus: "series",
            },
            data: this._data.manData,
            showBackground: this.showBackground,
          },
          {
            name: "无房",
            type: "bar",
            stack: "total",
            barWidth: this.barWidth,
            label: {
              show: false,
              formatter: "{c}%",
            },
            emphasis: {
              focus: "series",
            },
            data: this._data.noHouse,
            showBackground: this.showBackground,
          },
          {
            name: "有房",
            type: "bar",
            barWidth: this.barWidth,
            stack: "total",
            label: {
              show: false,
              formatter: "{c}%",
            },
            emphasis: {
              focus: "series",
            },
            data: this._data.haveHouse,
            showBackground: this.showBackground,
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

          console.log(options);
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

            options: ((options.yAxis.show = true), (options.xAxis.show = true)),
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

<style scoped>
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

.fullCharts {
  height: 700px;
  width: 100%;
}
</style>