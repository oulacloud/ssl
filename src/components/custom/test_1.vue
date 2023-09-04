<template>
  <el-container class="container">
    <el-header class="header">
      <h3 class="header_text">可视化图表</h3>
    </el-header>
    <el-main>
      <el-row :gutter="30">
        <el-col :span="8">
          <line-charts @zoom-in="handelZoom"></line-charts>
        </el-col>
        <el-col :span="8">
          <BarCharts />
        </el-col>
        <el-col :span="8">
          <BarCharts />
        </el-col>
      </el-row>
      <el-row :gutter="30">
        <el-col :span="8">
          <LineCharts />
        </el-col>
        <el-col :span="8">
          <BarCharts />
        </el-col>
        <el-col :span="8">
          <LineCharts />
        </el-col>
      </el-row>
      <el-row :gutter="30">
        <el-col :span="8">
          <LineCharts />
        </el-col>
        <el-col :span="8">
          <BarCharts />
        </el-col>
        <el-col :span="8">
          <LineCharts />
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>



<script>
import BarCharts from "./components/BarCharts.vue";
import LineCharts from "./components/LineCharts.vue";
import NewCharts from "./components/NewCharts.vue";
import * as echarts from "echarts";

export default {
  components: {
    BarCharts,
    LineCharts,
    NewCharts
  },

  data() {
    return {};
  },
  methods: {
    handelZoom() {

      console.log("父组件接收到子组件方法的");

    }
  },

};
</script>

<style lang="less">
.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
.el-col {
  border-radius: 4px;
}

.container {
  display: relative;
  height: 100%;
  width: 100%;
  // background: url("../../../static/10.png");
}

.header {
  background-color: #f0f0f0f0;
}

.header_text {
  font-size: 25px;
  font-weight: 700;
  width: 150px;
  margin: 0 auto;
}

.header_text::before {
  content: "";
  width: 20px;
  height: 20px;

  margin-top: 21px;
  float: left;
  background: url("../../../static/image/sprite.png");
  background-size: 37px 20px;
}

.header_text::after {
  content: "";
  width: 20px;
  height: 20px;
  float: right;
  margin-top: -38px;
  margin-right: -14px;
  background: url("../../../static/image/sprite.png");
  background-size: 37px 20px;
}
</style>
