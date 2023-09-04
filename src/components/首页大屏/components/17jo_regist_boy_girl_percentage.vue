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
                    </el-switch>
                    <div class="block">
                      <span class="demonstration">图表中心x</span>
                      <el-slider v-model="border_dis" show-input>
                      </el-slider>
                    </div>
                    <div class="block">
                      <span class="demonstration">图表中心y</span>
                      <el-slider v-model="border_dis2" show-input>
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
      tool_show:true,

      // 数据
      x: [],
      y: [],
      yearData: [],

      // 样式配置参数
      drawer: false,
      activeName: '',
      title_text: "杭州共有产权登记男女比例",
      le_show: false,
      h_v: true,
      graphic_show: false,
      itemLabel_show: true,
      border_dis: 50,
      border_dis2: 50,
      top: 7,
      left: 37,
      backgroundColor: '',
      titleColor: '#000000',
      textColor: '#000000',
      title_top: 3,
      title_left: 50,
      fontSize: 16,
      radius: 16,
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
    // await this.getData() //获取摇号数据
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
        border_dis2,
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
        border_dis2,
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
      await axios.get("http://sslapi.nadibao.cn/api/HzYaoHaoData/GetHZYaoHaoRegDataByYear")
        .then(res => {
          this.resData = res.data.data;
          for (var i = 0; i < this.resData.length; i++) {
            this.x[i] = this.resData[i].NAME
            this.y[i] = this.resData[i].NUM
            this.yearData.push({ value: this.resData[i].NUM, name: this.resData[i].NAME })
          }
        })
    },
    drawChart() {
      // var myChart = echarts.init(document.querySelector(".stack .chart"));
      const res = [{
        "label": "男",
        "value": 670
      },
      {
        "label": "女",
        "value": 263
      }
      ]
      this.resData = [...res]
      const border =
        'data:image/png;base64,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';
      const man =
        'data:image/png;base64,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';
      const woman =
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACtWK6eAAAAAXNSR0IArs4c6QAAE3FJREFUeF7tnQuQHNV1hs/fI6EHQsIEXMaxwcXDDpadUJYBCwLenZYEFAELqN0ZCcQbYhAQCVuEODGIuLCDw9M2DhhhhMCoR4vFqxwcoZldXuZhHjEOrwRiHBwoBEaAYCXtqu+f6gEFvXa3p6e753bPmSpXudC955z7//fb0zNzuweiL1VAFRhSAag2qoAqMLQCCojuDlVgGAUUEN0eqoAContAFYimgHaQaLrprDZRQAFpE6N1mdEUUECi6aaz2kQBBaRNjNZlRlNAAYmmm85qEwUUkDYxWpcZTQEFJJpuOqtNFFBA2sRoXWY0BRSQaLrprDZRQAFpE6N1mdEUUECi6aaz2kQBBaRNjNZlRlNAAYmmm85qEwUUkJSM5nEHTJSBCZPF4Z8ZYC+QXxTBLgLuIMQOIjJBIDvVy6G8JSLvCbhGiDUCriLltw7kRaF5XtYOPoO7HlqTUultnUYBScB+zpmxvQya/cRwf0L2l+B/Ip+ONxV/L5THAHlMBI+K3/84eh5eG28OjaaAxLQHOKtjZzE4huJ0ibBDgFExhQ4ZhoMiqEJMjziDt+PWB1eHnKjDhlFAAWlie/DIKeNl/MTjCWeWiHQ0ESr+qeQKCH+GSu+S+IO3T0QFJILX7HI/bxyZC8jxIjIxQoj0plDeoshipzB4LW69/7/SS5yPTApIAz6yu/MgOrhEBF9tYJo9Q8l/hZi/RaXvP+wpyu5KFJAQ/rBU3JOQfxbB0SGG2z7EULjEkcLfw7v3VduLbXV9CsgwDgSfRplB/7sQObfVRiWRH8KF8GoXJxE7LzEVkCGcZHlaB8XcLIJP5cXsba6DfAEis1GpPZnrdUZcnAKyhXDsmjbJFHg1RE6MqGn2plF8glc6Y823sbhvXfYWkFzFCsgm2nL2IXvTH71SILslJ7nNkfk01o+ajttXrLK5yjRrU0A+VLt+SUXeIZBJaRpgXS7yf2Gcw9Gz8rfW1daCghSQ4OhTuTiHxI0CKbTAA/tSUvohPBqV2gr7iku3orYHhOXiRRQsTFf2TGQzEDMHXu+tmag2oSLbGhC/VLwSwLyEtM1+WJKAnAWvdm32FxNtBW0LiF92b4DIKdFka69ZoMxDpXp1e636g9W2JSDaORrf6hCeDK+2uPGZ2Z7RdoCwu7ObjlPJtm2tqJ6DEB4Mr/fRVmRvVc62AoRdHfvSKTwikDGtEjzjeVdhYGBfLH/gtYyvI3T5bQNIcEMTWfiNiHwytDo6cGsFyCecSu3L7SJN2wBiSu69ApnWLsYmuU4KLy14tQuSzGFL7LYAhGV3LkV+ZIvoma+j/vEvp7bD+5HcA1I/X2VGPS2CsZnfmHYt4BX0r5uc96er5B4QU3YfEJG/tGtv5aMaCq8seLXz8rGaba8i14Cw251GR+7Ns4EtXRtlAI7shqXV11taR4LJcw2IKbu/FpG2+cQlwX0yZGhSritUql9vRe40cuYWEHa7M+nI7WmI2NY5KD4G/c9ged8f8qhDbgEx5eKjIgieaKivhBWgmGsKXu/ZCadpSfhcAlL/xrxQeKolirZj0uD+EdO/cx4ffZpLQPxy8UYITmrHvdqqNUN4Zh6PxecOEB510A4cN/YNPW+VNip8xvFqX0g7a9L58gdIqXgageuTFk7jb60A6H8xb09tzB0gplxcnpMnIGaOQQgXwKtdlrnChyk4V4BwoTh8zl0jkPF5Mik7a2HN8WpuduodudJ8AVJ/GiJ7R162jkhEgeA7kf63J+LuJ/oTid+CoLkCxC+5FwNyYQt01JQfKgDIDCyt5uZ4T64AMSU3ePDb13S3tk4BGPkmllUvb10F8WbOFyBl9yUR2SNeiTRaIwpQuLjg1U5uZI7NY3MDCLumjmNhfG6ufW3eNCPU9rjjVffLcP2blZ4fQErFLxF4Ii/GZHgd7ztedUKG688pIN3FQ+jgvrwYk+V1YHRhAm5e8X6W17Cx9vx0kFnudFLa/mHLNmxK+NgdPSv/x4Zamq0hP4CU3L8i5O5mBdH5zSsAckpefrEqR4B0HkM4P2/eXo3QrAJ5+i4kR4AUuwgsa9Zcnd+8AhDpgle9rflIrY+QH0DKbokiXusl1QpgTAnLenPxx0oB0f0cuwIKSOySNh+Q2kGaFzGmCApITELGGUYBiVPN5mIpIM3pl8hsBSQRWSMFVUAiyZbsJAUkWX0bia6ANKJWSmMVkJSEDpFGAQkhUtpDFJC0FR86nwJijxf/X4kCYo8pCog9XiggFnqhgFhoinYQe0xRQOzxQjuIhV4oIBaaoh3EHlMUEHu80A5ioRcKiIWmaAexxxQFxB4vtINY6IUCYqEp2kHsMUUBsccL7SAWeqGAWGiKdhB7TFFA7PFCO4iFXiggFpqiHcQeUxQQe7zQDmKhFwqIhaZoB7HHFAXEHi+0g1johQJioSnaQewxRQGxxwvtIBZ6oYBYaIp2EHtMUUDs8UI7iIVeKCAWmqIdxB5TFBB7vNAOYqEXCoiFpmgHsccUBcQeL7SDWOiFAmKhKdpB7DFFAbHHC+0gFnqhgFhoinYQe0xRQOzxQjuIhV4oIBaaoh3EHlMUEHu80A5ioRcKiIWmaAexxxQFxB4vtINY6IUCYqEp2kHsMUUBsccL7SAWeqGAWGiKdhB7TFFA7PFCO4iFXiggFpqiHcQeUxQQe7zQDmKhFwqIhaZoB7HHFAXEHi+0g1johQJioSnaQewxRQGxxwvtIBZ6oYBYaIp2EHtMUUDs8UI7iIVeKCAWmqIdxB5TFBB7vNAOYqEXCoiFpmgHsccUBcQeL7SDWOiFAmKhKdpB7DFFAbHHi486SNfBu0hhzOS0S6OYH4kg9byh1kl5DsBZocbGOchf/wx6HngjzpCtioVWJc5LXlNyHxbIV+xcDx9zvNoBdtaWjaoUkCZ8YnfxSEKWCLBjE2GSm0p5B8JuVGorkkuS78gKSAR/2TV1J1MY90MIZkeYnvoUUm5w1q6bj7seWpN68ownVEAaNPDDrnGDALs0OLXVw1+FmBPg9VZbXUiW8isgId1i18G70Bl9jQBdIadYOYzCxU7/+nO1m4SzRwEJoRO7i7PoyA9EsHOI4VkY8iogp2Jp9ZdZKLaVNSogw6jPo2d8nGM2XC+Co1ppUlK5SVnirPf/Bnf0vZ1UjqzHVUCGcJClzhMMMB3EJwQyLetGb6t+Cq+EyIGgXIxK7Z48rrHZNSkgWyjI8vRPkv4iAQ4Xyh3Yp3qsed4NNtK5zYptzXxyAyCnw6stNmX3VRHZlcJbnHXmHO0mm7ukgGyiB8vuqaRcLpBJH/xn3ut4tRn1/1cunkRikUAK1mz0SIVwNXwcgZ7qw8F0U3Lf3mS9r8PI6VhWuztS6BxOUkCCzX9Mx6c4unDjNi6lHnS86sEbfWd38RA6CDbPxEzuBfJFFGQabq39fmP9plwcEMHoTddD4VLHX3s2eh5+K5PrjLHotgeEpc4zKLhMgB220pV8wqnUvrzZ5pl9yN70R90jwJ4x+pBCKN6HdWbmlpdQpuxyiOSrQHMGKr13plCctSnaFhDOLu5Og8Ui0jGkO+RLTqW215b/zpkdO3Ks8wsRHGits5teOpI3OvvUTsNCMZvBHny3U9hu1XBroEjF8fvPatdu0naAUARSds+hyHdFZPvhNzhXO15tp22NYVdXwThv3QTIcdZCQvEh8g1Uqldvew2dn2PBeX7E+sk3QDm1Hd+btBUgLBX3pMhNAhw04qb4YICBVx0FkaEuQ4Td7jfoyPdFxAkZM51h5HsAZw53tITl4oEUPBS6ILIHZnBuXo6yh1l3WwDCheLIs+58gt8RYFwYYTaOgd//JyNdXrBUPJyC2wQyvpHYCY59Bb6Zjp7eF4a9fApOIzu4q7E6+CYEZ8OrVhqbl83RuQeEJfezBJeIINJ9EYC/D5b2jXgZwlmdk0kn+LLt0y3dCpRfw/QfNhLUQY0sFU8jcH20enkXYE7F0r43o83PxqzcAlLvGs8Vz6dgoUDGRLUDoIultVqY+cExeDrjfymQ/cKMj31McAk06Z3j8JMnBsPE9svFhRBcFGbsEGP+CMNzsKy2tIkYVk/NJSDscj9Ph8GNTFOaVR/CE+DVbg4bh2dMGc13Jv0s1VO/JAH8A7xq8MFD6JdfchcFhxZDTxhyIO/C+lGn4/YVw34i1nye9CPkDhCWO79Ncf4xLikhvABe7dJG47FcvKjevZJ+UfoBMwteb4PvJURM2Q0uCQ+Lp0SuhsG5WFa9JZ54dkTJDSCc5f45Tb1r/EWc0pJyXaFS/XqUmCx3HkVBRQRjo8wPMedV+P4R6On79xBjtxpiSu4LAvlslLlDNxPeg4FRJ+Wlm2QekOCSxrw76UJQLhBgVKxm14N9dB4rSmx2dezLQuHfROTjUeYPM+cp+AOHNvORqym5G5I5W8bVIOeh0rsk5jWnHi7TgLBU/FL9oQnJPnbnvx2v2tSxEh5z8K4cPXqFAF+IxWHKnXh3uxLuuWd91Hgsd3yGUvhd1Pmh5jH73SSzgPgl91JAzg9lVJODHK/atE6cM2N7DmxYKsCRzZRDke8UvOqFzcSo98XuzkPpOMnfUUi+DZEFqNQWNVtzK+Y3bXzaRbOruD+d+qN2PpdWboi/H7y+x5vNFxxzMR+AvaDhWJSB4FgLvOptDc/dxgSW3W9R5JI4YoWKQVmJwYETsPyB10KNt2RQZgDhSR1jzdrCJYDMS/tYB2j+GpXen8TlGcuds0kER17Cvmf6I8Q/LA5IN67BlIo/F+CYuNYUKk7wnC6Y8+D1/jTUeAsGZQKQ+pkh1s9QbXWyNg0NSS4qVGqnx5mLXe5UFhicCP7Y8HH5PAbMdCzv+0Oc+U2p+JoAn4gzZuhYGeomVgPCrqnjjDPu+xCZK0DraqU861SqsT9/t37k3peVQ4IfbKTtCjNx84r3Q2++EAM5292DRl4KMTTJIe9C+E14tYhHXZIs7aPYrdt0I6yPs4pFUn4qgt3TkWL4LPCxI3pWvhN3LTzugIncsP1yAdxNY5O8qlCpzY87XxCPs9wTSQnuhWn9K/gjgMFT4N3/SuuL2boC6wAJPu0xA/7lEJ7R0q6xhVagORaV3uVJmBicGzPPFRcBOFmCezjA04IHKiSRK4jpl9xbrLqPhVwDwQJUqtclteaoca0ChKXiDAquF8huUReU1DxSflyoVOcmFb/+l73knifAk/BW9iWZp6XvP4ZdGGtw5JRN75lPUocwsa0AhEcdtIMZP/YqiJwSpujWjOHrjldL9E0tS8WzBc5D8FY+ldQaOavzq6STKIBN1R7c6CVyPiq1f2kqTkyTWw4Iy51HUJzgjdquMa0psTAwMh3LqiuTSmDKxZcp8quCV0vsqfHxneBNSoWNcXkfxJwEr+/lpDMNF79lgAQPPjBjnR9AMKeVAjSSO3iAQcGrlhuZE3Zs8CRHwrmpfpuvwz2SuMwIPhWkM/5Ni+58HEme90FeIJXaNcPd9jxSkGb+vSWAsFw8moJrEzjA14wWoeZCnD+Fd2/wNMJYX6bs/qeI7F1/L0K5oVCpnhZrgvrxkvr985fFHTfxeOT9gDmxFd0kVUDqPzzjjLsGQCJ/hRM3qr55eXWhUgu+zY/txXLnfIpzxaYBQU5BpfZkXEmCkwhc6/yuZV8ONr0QrgPl71CpXdV0qAYCpAZI/VdoyR9m8IdntpITYr4Cr/fRBnQecuiHzwJ+QYAJmw2iPOJUqlPjyBHE8EvF6wHE3pXiqq+BOA/C909GT9+LDcyJPDRxQOo/IbCdf51AZkau0r6Jq+BLJ3qqzzZTGo+cMp7jJ/1qqJu84vqyMPj4mJDLm6nVtrlg/Xlfm3XdJGpMFBB2u8cTcrVAtvnwtSQWlGbMRu9X37I2Uy7eOdJvj4AyF5Xqj6Ouyy8Xr4AgkW/ko9YU47yH4fsnJNlNEgOE5eIcCjJ/R9lIZsKYb2FZ7/dGGrcNOJaL4Ogw8yA8E14t+FCjoZcpucGzuo5taFIGB8OYw7CsN7hrM/ZXcoCUimcSiPyXL/aVJhvwQdBfgErfIyOlqT/Xd0zBE8ihI43d9N9BBm9Q/ynMnPpPxkGCh+Q1dSdkmFw2jAE5P6k37wpIvA7/AuAV23qOVnAoUTZMmEfh/Oi/q87nIVg41FMNPziEyAUJ34Icr2IxRFNAYhAx3RB8hiJPi+BloewGkckC2Te2Gsj3ROQ3hDwrxGoI9xIg+MTL+tMIsWmwSaCMAuKeRcg1SQiiMVWBLS4/s3iJpYDoNk5HAe0g6eisWTKqgAKSUeO07HQUUEDS0VmzZFQBBSSjxmnZ6SiggKSjs2bJqAIKSEaN07LTUUABSUdnzZJRBRSQjBqnZaejgAKSjs6aJaMKKCAZNU7LTkcBBSQdnTVLRhVQQDJqnJadjgIKSDo6a5aMKqCAZNQ4LTsdBRSQdHTWLBlVIJOAZFRrLVsV2EyBxO5JV51VgTwooIDkwUVdQ2IKKCCJSauB86CAApIHF3UNiSmggCQmrQbOgwIKSB5c1DUkpoACkpi0GjgPCiggeXBR15CYAgpIYtJq4DwooIDkwUVdQ2IKKCCJSauB86CAApIHF3UNiSmggCQmrQbOgwIKSB5c1DUkpoACkpi0GjgPCiggeXBR15CYAgpIYtJq4DwooIDkwUVdQ2IK/B+IUbsy/TKDbgAAAABJRU5ErkJggg==';
      const color = ['rgba(196,36,255,1)', 'rgba(196,36,20,1)'];
      const data = [];
      for (let i = 0; i < res.length; i++) {
        data.push({
          value: res[i].value,
          name: res[i].label,
          itemStyle: {
            borderWidth: 5,
            shadowBlur: 20,
            borderColor: color[i],
            shadowColor: color[i]
          }
        }, 
        // {
        //   value: res[0].value / 10,
        //   name: '',
        //   itemStyle: {
        //     labelLine: {
        //       show: false
        //     },
        //     color: 'rgba(0, 0, 0, 0)',
        //     borderColor: 'rgba(0, 0, 0, 0)',
        //     borderWidth: 0
        //   },
        //   label: {
        //     show: false
        //   },
        // }
        );
      }
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
        graphic: {
          elements: [{
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
        },
        {
            type: 'image',
            z: 3,
            style: {
              image: border,
              width: this.dialogVisable ? 300 : 120,
              height: this.dialogVisable ? 300 : 120,
            },
            left: 'center',
            top: 'center',
            position: [100, 100]
          },
          {
            type: 'image',
            z: 3,
            style: {
              image: man,
              width: this.dialogVisable ? 85 : 35,
              height: this.dialogVisable ? 85 : 35,
            },
            left: '36%',
            top: 'center'
          },
          {
            type: 'image',
            z: 3,
            style: {
              image: woman,
              width: this.dialogVisable ? 85 : 35,
              height: this.dialogVisable ? 100 : 40,
            },
            right: '36%',
            top: 'center'
          }
          ]
        },
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
        tooltip: {
          trigger: 'item',
          formatter: '{b} : {d}%'
        },
        series: [{
          name: '',
          type: 'pie',
          center: [`${this.border_dis + '%'}`, `${this.border_dis2 + '%'}`],
          clockwise: false,
          radius: this.dialogVisable ? [175, 180]:[70,75],
          emphasis:{scale:true},
          label: {
            show: this.dialogVisable ? this.itemLabel_show : false,
            color: this.textColor,
            fontSize: 24,
            formatter: '{b}:{d}%'
          },
          itemStyle: {
            labelLine: {
              width: 4,
              length: 30,
              length2: 50,
              show: true,
              color: '#0ff'
            }
          },
          data
        }]
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
