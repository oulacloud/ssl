<template>
  <el-container class="container">
    <el-header class="header">
      <h3 class="header_text">可视化图表</h3>
    </el-header>
    <el-main>
      <el-row :gutter="30">
        <el-col :span="8">
          <bar-1></bar-1>
        </el-col>
        <el-col :span="8">
          <bar-2 />
        </el-col>
        <el-col :span="8">
          <bar-3></bar-3>
        </el-col>
      </el-row>
      <el-row :gutter="30">
        <el-col :span="8">
          <bar-4 />
        </el-col>
        <el-col :span="8">
          <bar-5 />
        </el-col>
        <el-col :span="8">
          <bar-6 />
        </el-col>
      </el-row>
      <el-row :gutter="30">
        <el-col :span="8">
          <bar-7 />
        </el-col>
        <el-col :span="8">
          <bar-8 />
        </el-col>
        <el-col :span="8">
          <bar-9 />
        </el-col>
      </el-row>
      <el-row :gutter="30">
        <el-col :span="8">
          <bar-10 />
        </el-col>
        <el-col :span="8">
          <bar-11 />
        </el-col>
        <el-col :span="8">
          <bar-12 />
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>



<script>
import bar1 from "./components/3buy_house.vue";
import bar2 from "./components/4regist.vue";
import bar3 from "./components/5regist_add.vue";
import bar4 from "./components/6have_house_increase.vue";
import bar5 from "./components/7increase_hot.vue";
import bar6 from "./components/8buy_house_loss.vue";
import bar7 from "./components/12boy_girl_percentage1.vue";
import bar8 from "./components/13buy_house_boy_girl.vue";
import bar9 from "./components/15buy_house_family.vue";
import bar10 from "./components/singlebar12";
import bar11 from "./components/singlebar4";
import bar12 from "./components/LH_bar11.vue";
import * as echarts from "echarts";

export default {
  components: {
    bar1,bar2,bar3,bar4,bar5,bar6,bar7,bar8,bar9,bar10,bar11,bar12,
  },

  data() {
    return {};
  },
  methods: {
    handelZoom() {
      console.log("父组件接收到子组件方法的调用");
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
