<template>
  <div class="LVbody">
    <!-- 头部显示栏 -->
    <header>
      <h1>可视化</h1>
      <div class="showTime">{{ times }}</div>
    </header>
    <!-- 主体部分 -->
    <section class="mainbox">
      <!-- 左 -->
      <div class="column">
        <div v-loading="loading" element-loading-background="rgba(0, 0, 0, 0)" class="panel bar">
          <h2>2018-2023年摇号人次</h2>
          <div class="chart"></div>
          <div class="panel-footer"></div>
        </div>
        <div class="panel line">
          <h2>2018-2023年摇号人次
            <!-- <a href="javacript:;">2020</a>
            <a href="javascript:;">2021</a> -->
          </h2>
          <div class="chart">图表</div>
          <div class="panel-footer"></div>
        </div>
        <div class="panel pie">
          <h2>2018-2023年摇号人次</h2>
          <div class="chart">图表</div>
          <div class="panel-footer"></div>
        </div>
        <div class="panel Radar">
          <h2>2018-2023年摇号人次</h2>
          <div class="chart">图表</div>
          <div class="panel-footer"></div>
        </div>
        <div class="panel Bar">
          <h2>2018-2023年摇号人次</h2>
          <div class="chart">图表</div>
          <div class="panel-footer"></div>
        </div>
      </div>
      <!-- 中 -->
      <div class="column">
        <div v-loading="loading" element-loading-background="rgba(0, 0, 0, 0)" class="panel line3">
          <h2>摇号不同距离数量分布情况</h2>
          <div class="chart"></div>
          <div class="panel-footer"></div>
        </div>
        <div class="panel bar3">
          <h2>摇号不同距离数量分布情况
            <a href="javacript:;"></a>
            <a href="javascript:;"></a>
          </h2>
          <div class="chart">图表</div>
          <div class="panel-footer"></div>
        </div>
        <div class="panel bar3d">
          <h2>摇号不同距离数量分布情况</h2>
          <div class="chart">图表</div>
          <div class="panel-footer"></div>
        </div>
        <div class="panel pie3">
          <h2>摇号不同距离数量分布情况</h2>
          <div class="chart">图表</div>
          <div class="panel-footer"></div>
        </div>
        <div class="panel scatter3">
          <h2>摇号不同距离数量分布情况</h2>
          <div class="chart">图表</div>
          <div class="panel-footer"></div>
        </div>
      </div>
      <!-- 右 -->
      <div class="column">
        <div class="panel line2">
          <h2>浙江省男女户数-登记人出生城市</h2>
          <div class="chart">图表</div>
          <div class="panel-footer"></div>
        </div>
        <div class="panel radar2">
          <h2>浙江省男女户数-登记人出生城市</h2>
          <div class="chart">图表</div>
          <div class="panel-footer"></div>
        </div>
        <div class="panel bar2">
          <h2>浙江省男女户数-登记人出生城市</h2>
          <div class="chart">图表</div>
          <div class="panel-footer"></div>
        </div>
        <div class="panel linebar2">
          <h2>浙江省男女户数-登记人出生城市</h2>
          <div class="chart">图表</div>
          <div class="panel-footer"></div>
        </div>
        <div class="panel stack2">
          <h2>浙江省男女户数-登记人出生城市</h2>
          <div class="chart">图表</div>
          <div class="panel-footer"></div>
        </div>
      </div>
    </section>

  </div>
</template>

<script>
import * as echarts from 'echarts'
import china from '../map/json/china.json'
import axios from 'axios'
export default {
  data() {
    return {
      times: '',//格式化之后的当前时间
      data: [],
      year: [],
      yeardata: [],
      year1: [],
      yeardata1: [],
      yeardata2: [],
      tip: ['杭州市', '温州市', '金华市', '绍兴市', '衢州市', '台州市', '湖州市', '宁波市', '嘉兴市', '丽水市', '舟山市'],
      boy: [155425, 28884, 21014, 15715, 13605, 10129, 6449, 6582, 5315, 4078, 1753],
      girl: [132845, 22998, 17700, 13813, 11701, 8462, 6355, 5666, 5523, 3876, 1628],
      sum1: [288270, 51882, 38714, 29528, 25306, 18591, 12804, 12248, 10838, 7954, 3381],
      distant1: [6, 5, 6, 16, 2, 8, 4, 7, 16, 9, 7, 15, 16, 33, 33, 4, 19, 1, 9, 5, 8, 8],
      distant2: [99, 79, 83, 118, 86, 145, 67, 64, 118, 63, 100, 41, 34, 100, 94, 13, 26, 137, 138, 87, 138, 86],
      distant3: [631, 652, 647, 602, 648, 583, 665, 665, 602, 664, 629, 680, 686, 603, 609, 719, 691, 598, 589, 644, 590, 642],
      gs: ['滨江新区', '西溪区', '云谷区', '体育中心', 'Z空间', '商务广场', '科技广场', '创新园', '安恒公司', '师范大学',
        '肿瘤医院', '爱力中心', '森马电商', '湾信息港', '经开区', '指挥部', '智能小镇', '移动大厦', '国际大厦', '移动研发', '移动大厦', '网管中心'],
      loading: true
    };
  },
  mounted() {
    echarts.registerMap("china", { geoJSON: china })
    // 获取时间
    // this.getData()
    this.getTimes()
    this.dev0(this.year, this.yeardata)
    this.dev1(this.year, this.yeardata)
    this.dev2(this.year, this.yeardata)
    this.dev3()
    this.dev4(this.yeardata2)
    // console.log(this.yeardata1)
    this.dev5(this.yeardata)
    this.dev6()
    this.dev7()
    this.dev8()
    this.dev9()
    this.dev10()
    this.dev11()
    this.dev12()
    // this.dev13()
    // this.dev14()
  },
  // 在Vue实例销毁前，清除定时器

  beforeDestroy() {
    if (this.times) {
      clearInterval(this.getTimesInterval);
    }
  },
  methods: {
    // 设置定时器
    getTimes() {
      setInterval(this.getTimesInterval, 1000);
    },
    // 获取时间函数
    getTimesInterval() {
      let year = new Date().getFullYear(); //获取当前时间的年份
      let month = new Date().getMonth() + 1; //获取当前时间的月份
      let day = new Date().getDate(); //获取当前时间的天数
      let hours = new Date().getHours(); //获取当前时间的小时
      let minutes = new Date().getMinutes(); //获取当前时间的分数
      let seconds = new Date().getSeconds(); //获取当前时间的秒数
      //当小于 10 的是时候，在前面加 0
      if (hours < 10) {
        hours = "0" + hours;
      }
      if (minutes < 10) {
        minutes = "0" + minutes;
      }
      if (seconds < 10) {
        seconds = "0" + seconds;
      }
      //拼接格式化当前时间
      this.times = "当前时间：" + year + "年" + month + "月" + day + "日" + "-" + hours + "时" + minutes + "分" + seconds + "秒";
    },
    // 左1柱状
    // getData(){
    //   axios.get("http://sslapi.nadibao.cn/api/HzYaoHaoData/GetHZYaoHaoRegDataByYear")
    //     .then(res => {
    //       for (var i = 0; i < res.data.data.length; i++) {
    //         this.year[i] = res.data.data[i].NAME
    //         this.yeardata[i] = res.data.data[i].NUM
    //       }
    //       // console.log(this.year,this.yeardata)
    //       return this.year,this.yeardata
    //     })
    // },
    dev0(x, y) {
      axios.get("http://sslapi.nadibao.cn/api/HzYaoHaoData/GetHZYaoHaoRegDataByYear")
        .then(res => {
          for (var i = 0; i < res.data.data.length; i++) {
            this.year[i] = res.data.data[i].NAME
            this.yeardata[i] = res.data.data[i].NUM
          }
          // 1实例化对象
          // console.log(res)
          var myChart = echarts.init(document.querySelector(".bar .chart"));
          // 2. 指定配置项和数据
          var option = {
            color: ["#2f89cf"],
            tooltip: {
              trigger: "axis",
              axisPointer: {
                // 坐标轴指示器，坐标轴触发有效
                type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
              }
            },
            // 修改图表的大小
            grid: {
              left: 0,
              top: 10,
              right: 5,
              bottom: 5,
              containLabel: true
            },
            "xAxis": [
              {
                type: "category",
                "data": x,
                axisTick: {
                  alignWithLabel: true
                },
                // 修改刻度标签 相关样式
                axisLabel: {
                  color: "rgba(255,255,255,.6) ",
                  fontSize: 12
                },
                // 不显示x坐标轴的样式
                axisLine: {
                  show: false
                }
              }
            ],
            yAxis: [
              {
                type: "value",
                interval: 100000,
                // 修改刻度标签 相关样式
                axisLabel: {
                  color: "rgba(255,255,255,.6) ",
                  fontSize: 12
                },
                // y轴的线条改为了 2像素
                axisLine: {
                  lineStyle: {
                    color: "rgba(255,255,255,.1)",
                    width: 2
                  }
                },
                // y轴分割线的颜色
                splitLine: {
                  lineStyle: {
                    color: "rgba(255,255,255,.1)"
                  }
                }
              }
            ],
            "series": [
              {
                name: "摇号人数",
                type: "bar",
                barWidth: 20,
                // barCategoryGap: 35,
                "data": y,
                encode: {
                  x: 0,
                  y: 1
                },
                itemStyle: {
                  // 修改柱子圆角
                  borderRadius: 5
                }
              }
            ]
          };
          this.loading = true
          // 3. 把配置项给实例对象
          myChart.setOption(option);
          this.loading = false
          // 4. 让图表跟随屏幕自动的去适应
          window.addEventListener("resize", function () {
            myChart.resize();
          });
        })
    },
    // 左5柱状
    dev1(x, y) {
      axios.get("http://sslapi.nadibao.cn/api/HzYaoHaoData/GetHZYaoHaoRegDataByYear")
        .then(res => {
          for (var i = 0; i < res.data.data.length; i++) {
            this.year[i] = res.data.data[i].NAME
            this.yeardata[i] = res.data.data[i].NUM
          }
          var myColor = ["#1089E7", "#F57474", "#56D0E3", "#F8B448", "#8B78F6", "#8B00F6"];
          // 1. 实例化对象
          var myChart = echarts.init(document.querySelector(".Bar .chart"));
          // 2. 指定配置和数据
          var option = {
            grid: {
              top: "10%",
              left: "22%",
              bottom: "10%"
              // containLabel: true
            },
            // 不显示x轴的相关信息
            xAxis: {
              show: false
            },
            yAxis: [
              {
                type: "category",
                inverse: true,
                data: x,
                // 不显示y轴的线
                axisLine: {
                  show: false
                },
                // 不显示刻度
                axisTick: {
                  show: false
                },
                // 把刻度标签里面的文字颜色设置为白色
                axisLabel: {
                  color: "#fff"
                }
              },
              {
                data: y,
                show: false,
                inverse: true,
                // 不显示y轴的线
                axisLine: {
                  show: false
                },
                // 不显示刻度
                axisTick: {
                  show: false
                },
                // 把刻度标签里面的文字颜色设置为白色
                axisLabel: {
                  color: "#fff"
                }
              }
            ],
            series: [
              {
                name: "条",
                type: "bar",
                data: y,
                textStyle: {
                  fontSize: '10px'
                },
                yAxisIndex: 0,
                // 修改第一组柱子的圆角
                itemStyle: {
                  borderRadius: 20,
                  // 此时的color 可以修改柱子的颜色
                  color: function (params) {
                    // params 传进来的是柱子对象
                    // console.log(params);
                    // dataIndex 是当前柱子的索引号
                    return myColor[params.dataIndex];
                  },
                  fontSize: '10px'
                },
                // 柱子之间的距离
                barCategoryGap: 50,
                //柱子的宽度
                barWidth: 10,
                // 显示柱子内的文字
                label: {
                  show: true,
                  color: '#fff',
                  position: "right",
                  // {c} 会自动的解析为 数据  data里面的数据
                  // formatter: "{c}%"
                }
              },
              {
                name: "框",
                type: "bar",
                barCategoryGap: 50,
                barWidth: 15,
                yAxisIndex: 1,
                data: [800000, 800000, 800000, 800000, 800000, 800000],
                itemStyle: {
                  color: "none",
                  borderColor: "#00c1de",
                  borderWidth: 3,
                  borderRadius: 15
                }
              }
            ]
          };

          // 3. 把配置给实例对象
          myChart.setOption(option);
          // 4. 让图表跟随屏幕自动的去适应
          window.addEventListener("resize", function () {
            myChart.resize();
          });
        })
    },
    // 左2折线
    dev2(x, y) {
      // var yearData = [
      //   {
      //     year: "2020", // 年份
      //     data: [
      //       // 两个数组是因为有两条线
      //       [24, 40, 101, 134, 90, 230, 210, 230, 120, 230, 210, 120],
      //       [40, 64, 191, 324, 290, 330, 310, 213, 180, 200, 180, 79]
      //     ],

      //   },
      //   {
      //     year: "2021", // 年份
      //     data: [
      //       // 两个数组是因为有两条线
      //       [123, 175, 112, 197, 121, 67, 98, 21, 43, 64, 76, 38],
      //       [143, 131, 165, 123, 178, 21, 82, 64, 43, 60, 19, 34]
      //     ]
      //   }
      // ];

      axios.get("http://sslapi.nadibao.cn/api/HzYaoHaoData/GetHZYaoHaoRegDataByYear")
        .then(res => {
          for (var i = 0; i < res.data.data.length; i++) {
            this.year1[i] = res.data.data[i].NAME
            this.yeardata1[i] = res.data.data[i].NUM
          }
          // 1. 实例化对象
          var myChart = echarts.init(document.querySelector(".line .chart"));
          // 2.指定配置
          var option = {
            // title: {
            //   show: true,//false
            //   text: "2018-2023年摇号人次",//主标题文本
            //   left: 'center',
            //   top: '1px',
            //   textStyle: {
            //     color: 'white',//'red'，字体颜色
            //     fontStyle: 'normal',//'italic'(倾斜) | 'oblique'(倾斜体) ，字体风格
            //     fontWeight: 'bold',//'bold'(粗体) | 'bolder'(粗体) | 'lighter'(正常粗细) ，字体粗细
            //     fontFamily: 'sans-serif',//'sans-serif' | 'serif' | 'monospace' | 'Arial' | 'Courier New'
            //     // 'Microsoft YaHei'(微软雅黑) ，文字字体
            //     fontSize: 10,//字体大小
            //     // lineHeight: 3,//字体行高
            //   }
            // },
            color: ["#2f89cf"],
            tooltip: {
              trigger: "axis",
              axisPointer: {
                // 坐标轴指示器，坐标轴触发有效
                type: "line" // 默认为直线，可选为：'line' | 'shadow'
              }
            },
            // 修改图表的大小
            grid: {
              left: 0,
              top: 10,
              right: 5,
              bottom: 5,
              containLabel: true
            },
            // toolbox: {
            //   feature: {
            //     dataView: { show: true, readOnly: false },
            //     magicType: { show: true, type: ['line', 'bar'] },
            //     restore: { show: true },
            //     saveAsImage: { show: true }
            //   }
            // },
            xAxis: [
              {
                type: "category",
                data: x,
                axisTick: {
                  alignWithLabel: true
                },
                // 修改刻度标签 相关样式
                axisLabel: {
                  color: "rgba(255,255,255,.6) ",
                  fontSize: 12
                },
                // 不显示x坐标轴的样式
                axisLine: {
                  show: false
                }
              }
            ],
            yAxis: [
              {
                type: "value",
                interval: 100000,
                // 修改刻度标签 相关样式
                axisLabel: {
                  color: "rgba(255,255,255,.6) ",
                  fontSize: 12
                },
                // y轴的线条改为了 2像素
                axisLine: {
                  lineStyle: {
                    color: "rgba(255,255,255,.1)",
                    width: 2
                  }
                },
                // y轴分割线的颜色
                splitLine: {
                  lineStyle: {
                    color: "rgba(255,255,255,.1)"
                  }
                }
              }
            ],
            series: [
              {
                name: "摇号人数",
                type: "line",
                barWidth: 20,
                // barCategoryGap: 35,
                data: y,
                encode: {
                  x: 0,
                  y: 1
                },
                itemStyle: {
                  // 修改柱子圆角
                  borderRadius: 5
                }
              }
            ]

          }
          // 3. 把配置项给实例对象
          myChart.setOption(option);
          // 4. 让图表跟随屏幕自动的去适应
          window.addEventListener("resize", function () {
            myChart.resize();
          })
        })

      // 5.点击切换效果
      // $(".line h2").on("click", "a", function () {
      //     // alert(1);
      //     // console.log($(this).index());
      //     // 点击 a 之后 根据当前a的索引号 找到对应的 yearData的相关对象
      //     // console.log(yearData[$(this).index()]);
      //     var obj = yearData[$(this).index()];
      //     option.series[0].data = obj.data[0];
      //     option.series[1].data = obj.data[1];
      //     // 需要重新渲染
      //     myChart.setOption(option);
      // });
    },
    // 右1折线
    dev3() {
      var myChart = echarts.init(document.querySelector(".line2 .chart"));
      var option = {
        tooltip: {
          trigger: "axis"
        },
        legend: {
          top: "0%",
          data: ["男性户数", "女性户数"],
          textStyle: {
            color: "rgba(255,255,255,.5)",
            fontSize: "12"
          }
        },
        grid: {
          left: "10",
          top: "30",
          right: "10",
          bottom: "10",
          containLabel: true
        },
        xAxis: [
          {
            type: "category",
            boundaryGap: false,
            // x轴更换数据
            data: this.tip,
            // 文本颜色为rgba(255,255,255,.6)  文字大小为 12
            axisLabel: {
              color: "rgba(255,255,255,.6)",
              fontSize: 12
            },
            // x轴线的颜色为   rgba(255,255,255,.2)
            axisLine: {
              lineStyle: {
                color: "rgba(255,255,255,.2)"
              }
            }
          }
        ],
        yAxis: [
          {
            type: "value",
            axisTick: { show: false },
            axisLine: {
              lineStyle: {
                color: "rgba(255,255,255,.1)"
              }
            },
            axisLabel: {
              color: "rgba(255,255,255,.6)",
              fontSize: 12
            },
            // 修改分割线的颜色
            splitLine: {
              lineStyle: {
                color: "rgba(255,255,255,.1)"
              }
            }
          }
        ],
        series: [
          {
            name: "男性户数",
            type: "line",
            smooth: true,
            zlevel: 2,
            z: 2,
            // 单独修改当前线条的样式
            lineStyle: {
              color: "#0184d5",
              width: "2"
            },
            // 填充颜色设置
            areaStyle: {
              color: new echarts.graphic.LinearGradient(
                0, 0, 0, 1,
                [
                  {
                    offset: 0,
                    color: "rgba(1, 132, 213, 0.4)" // 渐变色的起始颜色
                  },
                  {
                    offset: 0.8,
                    color: "rgba(1, 132, 213, 0.1)" // 渐变线的结束颜色
                  }
                ],
                false
              ),
              shadowColor: "rgba(0, 0, 0, 0.1)"
            },
            // 设置拐点
            symbol: "circle",
            // 拐点大小
            symbolSize: 8,
            // 开始不显示拐点， 鼠标经过显示
            showSymbol: false,
            // 设置拐点颜色以及边框
            itemStyle: {
              color: "#0184d5",
              borderColor: "rgba(221, 220, 107, .1)",
              borderWidth: 12
            },
            data: this.boy
          },
          {
            name: "女性户数",
            type: "line",
            smooth: true,
            zlevel: 2,
            z: 2,
            lineStyle: {
              color: "#00d887",
              width: 2
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(
                0, 0, 0, 1,
                [
                  {
                    offset: 0,
                    color: "rgba(0, 216, 135, 0.4)"
                  },
                  {
                    offset: 0.8,
                    color: "rgba(0, 216, 135, 0.1)"
                  }
                ],
                false
              ),
              shadowColor: "rgba(0, 0, 0, 0.1)"
            },
            // 设置拐点 小圆点
            symbol: "circle",
            // 拐点大小
            symbolSize: 5,
            // 设置拐点颜色以及边框
            itemStyle: {
              color: "#00d887",
              borderColor: "rgba(221, 220, 107, .1)",
              borderWidth: 12
            },
            // 开始不显示拐点， 鼠标经过显示
            showSymbol: false,
            data: this.girl
          }
        ]
      };
      myChart.setOption(option);
      // 4. 让图表跟随屏幕自动的去适应
      window.addEventListener("resize", function () {
        myChart.resize();
      });
    },
    // 左3饼图
    dev4(x) {
      axios.get("http://sslapi.nadibao.cn/api/HzYaoHaoData/GetHZYaoHaoRegDataByYear")
        .then(res => {

          for (var i = 0; i < res.data.data.length; i++) {
            // this.year1[i] = res.data.data[i].NAME
            this.yeardata2.push({ value: res.data.data[i].NUM, name: res.data.data[i].NAME })
          }
          // console.log(res.data.data);
          // 1. 实例化对象
          var myChart = echarts.init(document.querySelector(".pie .chart"));
          // 2.指定配置

          // formatter: "{a} <br/>{b}: {c} ({d}%)"
          var option = {
            color: ["#065aab", "#066eab", "#0682ab", "#0696ab", "#06a0ab"],
            tooltip: {
              trigger: "item",
              formatter: "{b}年度: <br/>{c}人次 ({d}%)"
            },
            legend: {
              left: 'left',
              top: '15px',
              orient: 'vertical',
              // 修改小图标的大小
              itemWidth: 12,
              itemHeight: 12,
              textStyle: {
                color: "rgba(255,255,255,.5)",
                fontSize: 12
              }
            },
            series: [
              {
                name: "2018-2023年摇号人次",
                type: "pie",
                // 这个radius可以修改饼形图的大小
                // radius 第一个值是内圆的半径 第二个值是外圆的半径
                radius: ["40%", "70%"],
                center: ["50%", "50%"],
                avoidLabelOverlap: false,
                // 图形上的文字
                label: {
                  show: false,
                  position: "center"
                },
                // 链接文字和图形的线是否显示
                labelLine: {
                  show: false
                },
                data: x
                // [
                //   { value: 1, name: "0岁以下" },
                //   { value: 4, name: "20-29岁" },
                //   { value: 2, name: "30-39岁" },
                //   { value: 2, name: "40-49岁" },
                //   { value: 1, name: "50岁以上" }
                // ]
              }
            ]
          };

          // 3. 把配置给实例对象
          myChart.setOption(option);
          // 4. 让图表跟随屏幕自动的去适应
          window.addEventListener("resize", function () {
            myChart.resize();
          });
        })
    },
    // 左4饼图
    dev5(x) {
      axios.get("http://sslapi.nadibao.cn/api/HzYaoHaoData/GetHZYaoHaoRegDataByYear")
        .then(res => {

          for (var i = 0; i < res.data.data.length; i++) {
            this.year1[i] = res.data.data[i].NAME
            this.yeardata1[i] = res.data.data[i].NUM
          }
          // console.log(res.data.data);
          // 1. 实例化对象
          var myChart = echarts.init(document.querySelector(".Radar .chart"));
          // 2.指定配置

          // formatter: "{a} <br/>{b}: {c} ({d}%)"
          var option = {
            // title: {
            //   text: '2018-2023年摇号人次',
            //   textStyle:{
            //     fontSize:'12px',
            //     position:'center'
            //   }
            // },
            legend: {
              data: ['摇号人次'],
              left: 'left',
              bottom: 'bottom',
              textStyle: {
                color: "rgba(255,255,255,.5)",
                fontSize: "12"
              }
            },
            radar: {
              indicator: [
                { text: '2018', max: 700000 },
                { text: '2019', max: 700000 },
                { text: '2020', max: 700000 },
                { text: '2021', max: 700000 },
                { text: '2022', max: 700000 },
                { text: '2023', max: 700000 }
              ],
              // center: ['25%', '50%'],
              radius: 60,
              startAngle: 90,
              splitNumber: 4,
              shape: 'circle',
              axisName: {
                formatter: '【{value}】',
                color: '#428BD4'
              },
              splitArea: {
                areaStyle: {
                  color: ['#77EADF', '#26C3BE', '#64AFE9', '#428BD4'],
                  shadowColor: 'rgba(0, 0, 0, 0.2)',
                  shadowBlur: 10
                }
              },
              axisLine: {
                lineStyle: {
                  color: 'rgba(211, 253, 250, 0.8)'
                }
              },
              splitLine: {
                lineStyle: {
                  color: 'rgba(211, 253, 250, 0.8)'
                }
              }
            },
            series: [
              {
                name: '摇号人次',
                type: 'radar',
                data: [
                  {
                    value: x,
                    name: '摇号数据',
                    lineStyle: {
                      color: 'rgba(255, 228, 152, 0.6)',
                      type: 'dashed'
                    },
                    symbol: 'rect',
                    symbolSize: 3,
                    label: {
                      show: false,
                      formatter: function (params) {
                        return params.value;
                      }
                    },
                    areaStyle: {
                      color: new echarts.graphic.RadialGradient(0.1, 0.6, 1, [
                        {
                          color: 'rgba(255, 228, 152, 0.1)',
                          offset: 0
                        },
                        {
                          color: 'rgba(255, 145, 124, 0.9)',
                          offset: 1
                        }
                      ])
                    }
                  },

                ]
              }
            ]
          };

          // 3. 把配置给实例对象
          myChart.setOption(option);
          // 4. 让图表跟随屏幕自动的去适应
          window.addEventListener("resize", function () {
            myChart.resize();
          });
        })
    },
    // 右2
    dev6() {
      var myChart = echarts.init(document.querySelector(".radar2 .chart"));
      var option = {
        // backgroundColor: 'black',
        "normal": {
          "top": 200,
          "left": 300,
          "width": 500,
          "height": 400,
          "zIndex": 6,
          "backgroundColor": ""
        },
        "color": ["rgba(245, 166, 35, 1)", "rgba(19, 173, 255, 1)"],
        // "title": {
        //   "show": true,
        //   "text": "基础雷达图",
        //   "left": "40%",
        //   "top": "1%",
        //   "textStyle": {
        //     "fontSize": 18,
        //     "color": "#fff",
        //     "fontStyle": "normal",
        //     "fontWeight": "normal"
        //   }
        // },
        "tooltip": {
          "show": true,
          "trigger": "item"
        },
        "legend": {
          "show": true,
          "icon": "circle",
          "left": "35%",
          "top": "90%",
          "orient": "horizontal",
          "textStyle": {
            "fontSize": 14,
            "color": "#fff"
          },
          "data": ["数据1", "数据2"]
        },
        "radar": {
          "center": ["50%", "50%"],
          "radius": "70%",
          "startAngle": 90,
          "splitNumber": 4,
          "shape": "circle",
          "splitArea": {
            "areaStyle": {
              "color": ["transparent"]
            }
          },
          "axisLabel": {
            "show": false,
            "fontSize": 18,
            "color": "#fff",
            "fontStyle": "normal",
            "fontWeight": "normal"
          },
          "axisLine": {
            "show": true,
            "lineStyle": {
              "color": "grey"//
            }
          },
          "splitLine": {
            "show": true,
            "lineStyle": {
              "color": "grey"//
            }
          },
          "indicator": [{
            "name": "杭州市",
            "max": 140000
          }, {
            "name": "温州市",
            "max": 140000
          }, {
            "name": "金华市",
            "max": 140000
          }, {
            "name": "绍兴市",
            "max": 140000
          }, {
            "name": "衢州市",
            "max": 140000
          }, {
            "name": "台州市",
            "max": 140000
          }, {
            "name": "湖州市",
            "max": 140000
          }, {
            "name": "宁波市",
            "max": 140000
          }, {
            "name": "嘉兴市",
            "max": 140000
          }, {
            "name": "丽水市",
            "max": 140000
          }, {
            "name": "舟山市",
            "max": 140000
          }]
        },
        "series": [{
          "name": "数据1",
          "type": "radar",
          "symbol": "circle",
          "symbolSize": 10,
          "areaStyle": {
            "normal": {
              "color": "rgba(245, 166, 35, 0.4)"
            }
          },
          itemStyle: {
            color: 'rgba(245, 166, 35, 1)',
            borderColor: 'rgba(245, 166, 35, 0.3)',
            borderWidth: 10,
          },
          "lineStyle": {
            "normal": {
              "type": "dashed",

              "color": "rgba(245, 166, 35, 1)",
              "width": 2
            }
          },
          "data": [
            [155425,
              28884,
              21014,
              15715,
              13605,
              10129,
              6449,
              6582,
              5315,
              4078,
              1753,]
          ]
        }, {
          "name": "数据2",
          "type": "radar",
          "symbol": "circle",
          "symbolSize": 10,
          "itemStyle": {
            "normal": {
              color: 'rgba(19, 173, 255, 1)',
              "borderColor": "rgba(19, 173, 255, 0.4)",
              "borderWidth": 10
            }
          },
          "areaStyle": {
            "normal": {
              "color": "rgba(19, 173, 255, 0.5)"
            }
          },
          "lineStyle": {
            "normal": {
              "color": "rgba(19, 173, 255, 1)",
              "width": 2,
              "type": "dashed"
            }
          },
          "data": [
            [132845,
              22998,
              17700,
              13813,
              11701,
              8462,
              6355,
              5666,
              5523,
              3876,
              1628]
          ]
        }]
      };
      myChart.setOption(option);
      // 监听浏览器缩放，图表对象调用缩放resize函数
      window.addEventListener("resize", function () {
        myChart.resize();
      });
    },
    // 右3
    dev7() {
      var myChart = echarts.init(document.querySelector(".bar2 .chart"));
      var option = {
        legend: {
          data: ['帅哥', '美女'],
          bottom: 0,
          right: '30%',
          textStyle: {
            color: '#fff',
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
        // toolbox: {
        //   right: 20,
        //   feature: {
        //     saveAsImage: {},
        //     restore: {},
        //     dataView: {},
        //     dataZoom: {},
        //     magicType: {
        //       type: ['line', 'bar']
        //     },
        //     // brush: {},
        //   }
        // },
        grid: [{
          show: false,
          left: '4%',
          top: 20,
          bottom: 20,
          containLabel: true,
          width: '42%',
        }, {
          show: false,
          left: '51.5%',
          top: 55,
          bottom: 20,
          width: '0%',
        }, {
          show: false,
          right: '4%',
          top: 20,
          bottom: 20,
          containLabel: true,
          width: '42%',
        },],
        xAxis: [
          {
            type: 'value',
            inverse: true,
            axisLine: {
              show: false,
            },
            axisTick: {
              show: false,
            },
            position: 'top',
            axisLabel: {
              rotate: 20,
              show: true,
              textStyle: {
                color: '#B2B2B2',
                fontSize: 12,
              },
            },
            splitLine: {
              show: false,
              lineStyle: {
                color: '#000011',
                width: 1,
                type: 'solid',
              },
            },
          }, {
            gridIndex: 1,
            show: false,
          }, {
            gridIndex: 2,
            type: 'value',
            axisLine: {
              show: false,
            },
            axisTick: {
              show: false,
            },
            position: 'top',
            axisLabel: {
              rotate: 20,
              show: true,
              textStyle: {
                color: '#B2B2B2',
                fontSize: 12,
              },
            },
            splitLine: {
              show: false,
              lineStyle: {
                color: '#000011',
                width: 1,
                type: 'solid',
              },
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
            textStyle: {
              color: '#9D9EA0',
              fontSize: 12,
            },

          },
          data: this.tip
        }, {
          gridIndex: 1,
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
            show: true,
            textStyle: {
              color: '#9D9EA0',
              fontSize: 7,
            },

          },
          data: this.tip.map(function (value) {
            return {
              value: value,
              textStyle: {
                align: 'center'
              }
            }
          }),
        }, {
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
            textStyle: {
              color: '#9D9EA0',
              fontSize: 12,
            },

          },
          data: this.tip
        },],
        series: [{
          name: '帅哥',
          type: 'bar',
          barGap: 20,
          barWidth: 10,
          label: {
            normal: {
              show: false,
            },
            emphasis: {
              show: true,
              position: 'left',
              offset: [0, 0],
              textStyle: {
                color: '#fff',
                fontSize: 14,
              },
            },
          },
          itemStyle: {
            normal: {
              color: '#659F83',
            },
            emphasis: {
              color: '#08C7AE',
            },
          },
          data: this.boy
        },
        {
          name: '美女',
          type: 'bar',
          barGap: 20,
          barWidth: 10,
          xAxisIndex: 2,
          yAxisIndex: 2,
          label: {
            normal: {
              show: false,
            },
            emphasis: {
              show: true,
              position: 'right',
              offset: [0, 0],
              textStyle: {
                color: '#fff',
                fontSize: 14,
              },
            },
          },
          itemStyle: {
            normal: {
              color: '#F68989',
            },
            emphasis: {
              color: '#F94646',
            },
          },
          data: this.girl
        }]
      };
      myChart.setOption(option);
      // 监听浏览器缩放，图表对象调用缩放resize函数
      window.addEventListener("resize", function () {
        myChart.resize();
      });
    },
    // 右4
    dev8() {
      var myChart = echarts.init(document.querySelector(".linebar2 .chart"));
      var option = {
        // backgroundColor: '#0f375f',
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
            label: {
              show: true,
              backgroundColor: '#333'
            }
          }
        },
        grid: [{
          show: false,
          top: 20,
          bottom: 10,
          containLabel: true,
        }],
        legend: {
          data: ['男性户数', '女性户数'],
          textStyle: {
            color: '#ccc'
          }
        },
        xAxis: {
          data: this.tip,
          axisLine: {
            lineStyle: {
              color: '#ccc'
            }
          }
        },
        yAxis: {
          splitLine: { show: false },
          axisLine: {
            lineStyle: {
              color: '#ccc'
            }
          }
        },
        series: [{
          name: '男性户数',
          type: 'line',
          smooth: true,
          showAllSymbol: true,
          symbol: 'emptyCircle',
          symbolSize: 15,
          data: this.boy
        }, {
          name: '女性户数',
          type: 'bar',
          barWidth: 10,
          itemStyle: {
            normal: {
              barBorderRadius: 5,
              color: new echarts.graphic.LinearGradient(
                0, 0, 0, 1,
                [
                  { offset: 0, color: '#14c8d4' },
                  { offset: 1, color: '#43eec6' }
                ]
              )
            }
          },
          data: this.girl
        }, {
          name: '男性户数',
          type: 'bar',
          barGap: '-100%',
          barWidth: 10,
          itemStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(
                0, 0, 0, 1,
                [
                  { offset: 0, color: 'rgba(20,200,212,0.5)' },
                  { offset: 0.2, color: 'rgba(20,200,212,0.2)' },
                  { offset: 1, color: 'rgba(20,200,212,0)' }
                ]
              )
            }
          },
          z: -12,
          data: this.boy
        }, {
          name: 'dotted',
          type: 'pictorialBar',
          symbol: 'rect',
          itemStyle: {
            normal: {
              color: '#0f375f'
            }
          },
          symbolRepeat: true,
          symbolSize: [12, 4],
          symbolMargin: 1,
          z: -10,
          data: this.boy
        }]
      };
      myChart.setOption(option);
      // 监听浏览器缩放，图表对象调用缩放resize函数
      window.addEventListener("resize", function () {
        myChart.resize();
      });
    },
    // 右5
    dev9() {
      var myChart = echarts.init(document.querySelector(".stack2 .chart"));
      var option = {
        // backgroundColor: "#344b58",
        "tooltip": {
          "trigger": "axis",
          "axisPointer": {
            "type": "shadow",
            textStyle: {
              color: "#fff"
            }

          },
        },
        "grid": {
          "borderWidth": 0,
          "top": 20,
          "bottom": 20,
          textStyle: {
            color: "#fff"
          }
        },
        "calculable": true,
        "xAxis": [{
          "type": "category",
          "axisLine": {
            lineStyle: {
              color: 'rgba(255,255,255,.5)'
            }
          },
          "splitLine": {
            "show": false
          },
          "axisTick": {
            "show": false
          },
          "splitArea": {
            "show": false
          },
          "axisLabel": {
            "interval": 0,
            color: 'rgba(255,255,255,0.7)',
            fontSize: 10,
            rotate: 15
          },
          data: this.tip,
        }],
        "yAxis": [{
          "type": "value",
          "splitLine": {
            "show": false
          },
          "axisLine": {
            "show": false
          },
          "axisTick": {
            "show": false
          },
          "axisLabel": {
            "interval": 0,
            color: 'rgba(255,255,255,0.5)',
            fontSize: 10

          },
          "splitArea": {
            "show": false
          },

        }],
        "series": [{
          "name": "女",
          "type": "bar",
          "stack": "总量",
          "barMaxWidth": 35,
          "barGap": "10%",
          "itemStyle": {
            "normal": {
              "color":
              {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                  offset: 0,
                  color: 'rgba(35, 157, 250, 1)' // 0% 处的颜色
                }, {
                  offset: 1,
                  color: 'rgba(35, 157, 250, 0)' // 100% 处的颜色
                }],
                global: false // 缺省为 false
              }
            }
          },
          "data": this.girl,
        },

        {
          "name": "男",
          "type": "bar",
          "stack": "总量",
          "itemStyle": {
            "normal": {
              "color": {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                  offset: 0,
                  color: 'rgba(35, 250, 187, 1)' // 0% 处的颜色
                }, {
                  offset: 1,
                  color: 'rgba(35, 250, 187, 0)' // 100% 处的颜色
                }],
                global: false // 缺省为 false
              },
              "barBorderRadius": 0
            }
          },
          "data": this.boy
        }, {
          "name": "总数",
          "type": "line",
          symbolSize: 3,
          symbol: 'circle',
          "itemStyle": {
            "normal": {
              "color": 'rgba(255, 196, 53, 1)',
              "barBorderRadius": 0,
            }
          },
          lineStyle: {
            normal: {
              width: 1,
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                  offset: 0,
                  color: 'rgba(255, 67, 2, 1)' // 0% 处的颜色
                }, {
                  offset: 1,
                  color: 'rgba(255, 196, 53, 1)' // 100% 处的颜色
                }],
                global: false // 缺省为 false
              }
            }
          },
          "data": this.sum1
        },
        ]
      };
      myChart.setOption(option);
      // 监听浏览器缩放，图表对象调用缩放resize函数
      window.addEventListener("resize", function () {
        myChart.resize();
      });
    },
    // 中1
    dev10() {
      var myChart = echarts.init(document.querySelector(".line3 .chart"));
      var option = {
        grid: {
          left: '9%',
          right: '10%',
          top: '20%',
          bottom: '15%',
          containLabel: true
        },
        tooltip: {
          show: true,
          trigger: 'item'
        },
        legend: {
          show: true,
          x: 'center',
          top: '12%',
          y: '35',
          icon: 'stack',
          itemWidth: 10,
          itemHeight: 10,
          textStyle: {
            color: '#1bb4f6'
          },
          data: ['3km以内', '3-10km', '10km以上']
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            axisLabel: {
              color: '#30eee9'
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: '#397cbc'
              }
            },
            axisTick: {
              show: false,
            },
            splitLine: {
              show: false,
              lineStyle: {
                color: '#195384'
              }
            },
            data: this.gs
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '立方米',
            // min: 0,
            // max: 1000,
            axisLabel: {
              formatter: '{value}',
              textStyle: {
                color: '#2ad1d2'
              }
            },
            axisLine: {
              lineStyle: {
                color: '#27b4c2'
              }
            },
            axisTick: {
              show: false,
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: '#11366e'
              }
            }
          },
          // {
          //   type: 'value',
          //   name: '占比',
          //   min: 0,
          //   max: 1000,
          //   axisLabel: {
          //     formatter: '{value} %',
          //     textStyle: {
          //       color: '#186afe'
          //     }
          //   },
          //   axisLine: {
          //     lineStyle: {
          //       color: '#186afe'
          //     }
          //   },
          //   axisTick: {
          //     show: false,
          //   },
          //   splitLine: {
          //     show: true,
          //     lineStyle: {
          //       color: '#11366e'
          //     }
          //   }
          // }
        ],
        series: [
          {
            name: '3km以内',
            type: 'line',
            stack: '总量',
            symbol: 'circle',
            symbolSize: 8,
            itemStyle: {
              normal: {
                color: '#0092f6',
                lineStyle: {
                  color: "#0092f6",
                  width: 1
                },
                areaStyle: {
                  //color: '#94C9EC'
                  color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
                    offset: 0,
                    color: 'rgba(7,44,90,0.3)'
                  }, {
                    offset: 1,
                    color: 'rgba(0,146,246,0.9)'
                  }]),
                }
              }
            },
            markPoint: {
              itemStyle: {
                normal: {
                  color: 'red'
                }
              }
            },
            data: this.distant1
          },
          {
            name: '3-10km',
            type: 'line',
            stack: '总量',
            symbol: 'circle',
            symbolSize: 8,

            itemStyle: {
              normal: {
                color: '#00d4c7',
                lineStyle: {
                  color: "#00d4c7",
                  width: 1
                },
                areaStyle: {
                  //color: '#94C9EC'
                  color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
                    offset: 0,
                    color: 'rgba(7,44,90,0.3)'
                  }, {
                    offset: 1,
                    color: 'rgba(0,212,199,0.9)'
                  }]),
                }
              }
            },
            data: this.distant2
          },
          {
            name: '10km以上',
            type: 'line',
            stack: '总量',
            symbol: 'circle',
            symbolSize: 8,
            itemStyle: {
              normal: {
                color: '#aecb56',
                lineStyle: {
                  color: "#aecb56",
                  width: 1
                },
                areaStyle: {
                  //color: '#94C9EC'
                  color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
                    offset: 0,
                    color: 'rgba(7,44,90,0.3)'
                  }, {
                    offset: 1,
                    color: 'rgba(114,144,89,0.9)'
                  }]),
                }
              }
            },
            data: this.distant3
          }
        ]
      };
      myChart.setOption(option);
      // 监听浏览器缩放，图表对象调用缩放resize函数
      window.addEventListener("resize", function () {
        myChart.resize();
      });
    },
    // 中2
    dev11() {
      var myChart = echarts.init(document.querySelector(".bar3 .chart"));
      var option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          left: '2%',
          right: '4%',
          bottom: '14%',
          top: '16%',
          containLabel: true
        },
        legend: {
          data: ['3km以内', '3-10km', '10km以上'],
          right: 10,
          top: 12,
          textStyle: {
            color: "#fff"
          },
          itemWidth: 12,
          itemHeight: 10,
          // itemGap: 35
        },
        xAxis: {
          type: 'category',
          data: this.gs,
          axisLine: {
            lineStyle: {
              color: 'white'

            }
          },
          axisLabel: {
            // interval: 0,
            // rotate: 40,
            textStyle: {
              fontFamily: 'Microsoft YaHei'
            }
          },
        },

        yAxis: {
          type: 'value',
          // max: '1200',
          axisLine: {
            show: false,
            lineStyle: {
              color: 'white'
            }
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: 'rgba(255,255,255,0.3)'
            }
          },
          axisLabel: {}
        },
        "dataZoom": [{
          "show": true,
          "height": 12,
          "xAxisIndex": [
            0
          ],
          bottom: '8%',
          "start": 10,
          "end": 90,
          handleIcon: 'path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z',
          handleSize: '110%',
          handleStyle: {
            color: "#d3dee5",

          },
          textStyle: {
            color: "#fff"
          },
          borderColor: "#90979c"
        }, {
          "type": "inside",
          "show": true,
          "height": 15,
          "start": 1,
          "end": 35
        }],
        series: [{
          name: '3km以内',
          type: 'bar',
          barWidth: '15%',
          itemStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: '#fccb05'
              }, {
                offset: 1,
                color: '#f5804d'
              }]),
              barBorderRadius: 12,
            },
          },
          data: this.distant1
        },
        {
          name: '3-10km',
          type: 'bar',
          barWidth: '15%',
          itemStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: '#8bd46e'
              }, {
                offset: 1,
                color: '#09bcb7'
              }]),
              barBorderRadius: 11,
            }

          },
          data: this.distant2
        },
        {
          name: '10km以上',
          type: 'bar',
          barWidth: '15%',
          itemStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: '#248ff7'
              }, {
                offset: 1,
                color: '#6851f1'
              }]),
              barBorderRadius: 11,
            }
          },
          data: this.distant3
        }]
      };
      myChart.setOption(option);
      // 监听浏览器缩放，图表对象调用缩放resize函数
      window.addEventListener("resize", function () {
        myChart.resize();
      });
    },
    // 中3
    dev12() {
      var myChart = echarts.init(document.querySelector(".bar3d .chart"));

      var option = {
        tooltip: {
          trigger: "axis",
          textStyle: { fontSize: '100%' },
          formatter: params => {
            let rander = params.map(item => item.seriesType !== "pictorialBar" ? `<div>${item.seriesName}: ${item.seriesType !== "line" ? item.value : item.value + "%"}</div>` : '').join('')
            return `
            <div>${params[0].axisValue}</div>
            ${rander}`
          }
        },
        legend: {
          data: ['10km以上', '3-10km', '3km以内'],
          textStyle: { fontSize: 8, color: '#fff' },
          itemWidth: 15,
          itemHeight: 10,
          itemGap: 10,
          bottom: '5%',
          selectedMode: false
        },
        grid: { top: '10%', left: '10%', right: '6%', bottom: '25%' },
        // xAxis
        xAxis: {
          axisTick: { show: true },
          axisLine: { lineStyle: { color: 'rgba(255,255,255, .2)' } },
          axisLabel: { textStyle: { fontSize: 8, color: '#fff' }, },
          data: this.gs
        },

        // yAxis
        yAxis: [{
          axisTick: { show: false },
          axisLine: { show: false, },
          splitLine: { lineStyle: { color: 'rgba(255,255,255, .05)' } },
          axisLabel: { textStyle: { fontSize: 8, color: '#fff' } }
        }, {
          show: true,
          max: 100,
          splitLine: { show: false },
          axisLine: { show: false },
          axisTick: { show: false },
          axisLabel: {
            textStyle: { fontSize: 16, color: '#fff' },
            formatter: params => {
              return `${params}%`
            }
          }
        }],

        // series
        series: [{
          z: 1,
          name: '上部1',
          type: 'pictorialBar',
          symbolPosition: 'end',
          data: this.distant3,
          symbol: 'diamond',
          symbolOffset: ['-50%', '-50%'],
          symbolSize: [6, 3],
          itemStyle: {
            borderColor: '#2fffa4',
            color: '#2fffa4'
          },
        }, {
          z: 1,
          type: 'bar',
          name: '10km以上',
          barWidth: 5,
          barGap: '-50%',
          data: this.distant3,
          itemStyle: {
            color: {
              type: 'linear',
              x: 0, x2: 1, y: 0, y2: 0,
              colorStops: [
                { offset: 0, color: 'rgba(29, 245, 160, .7)' },
                { offset: 0.5, color: 'rgba(29, 245, 160, .7)' },
                { offset: 0.5, color: 'rgba(29, 245, 160, .3)' },
                { offset: 1, color: 'rgba(29, 245, 160, .3)' }
              ]
            }
          },
        }, {
          z: 2,
          name: '上部1',
          type: 'pictorialBar',
          symbolPosition: 'end',
          data: this.distant2,
          symbol: 'diamond',
          symbolOffset: [0, '-50%'],
          symbolSize: [6, 3],
          itemStyle: {
            borderColor: '#32ffee',
            color: '#32ffee'
          },
        }, {
          z: 2,
          type: 'bar',
          name: '3-10km',
          barWidth: 5,
          data: this.distant2,
          itemStyle: {
            color: {
              type: 'linear',
              x: 0, x2: 1, y: 0, y2: 0,
              colorStops: [
                { offset: 0, color: 'rgba(50, 255, 238, .7)' },
                { offset: 0.5, color: 'rgba(50, 255, 238, .7)' },
                { offset: 0.5, color: 'rgba(50, 255, 238, .3)' },
                { offset: 1, color: 'rgba(50, 255, 238, .3)' }
              ]
            }
          },
        }, {
          z: 3,
          name: '上部1',
          type: 'pictorialBar',
          symbolPosition: 'end',
          data: this.distant1,
          symbol: 'diamond',
          symbolOffset: ['50%', '-50%'],
          symbolSize: [6, 3],
          itemStyle: {
            borderColor: '#ffd11a',
            color: '#ffd11a'
          },
        }, {
          z: 3,
          type: 'bar',
          name: '3km以内',
          barWidth: 5,
          data: this.distant1,
          itemStyle: {
            color: {
              type: 'linear',
              x: 0, x2: 1, y: 0, y2: 0,
              colorStops: [
                { offset: 0, color: 'rgba(255, 209, 26, .7)' },
                { offset: 0.5, color: 'rgba(255, 209, 26, .7)' },
                { offset: 0.5, color: 'rgba(255, 209, 26, .3)' },
                { offset: 1, color: 'rgba(255, 209, 26, .3)' }
              ]
            }
          },
        }]
      };
      myChart.setOption(option);
      // 监听浏览器缩放，图表对象调用缩放resize函数
      window.addEventListener("resize", function () {
        myChart.resize();
      });
    },
    // 中4
    dev13() {
      var myChart = echarts.init(document.querySelector(".pie3 .chart"));
      var d1 = []; this.distant1.map((item, index) => { d1.push({ value: item, name: this.gs[index] }) })
      var d2 = []; this.distant2.map((item, index) => { d2.push({ value: item, name: this.gs[index] }) })
      var d3 = []; this.distant3.map((item, index) => { d3.push({ value: item, name: this.gs[index] }) })
      var option = {
        // backgroundColor: "#0B1837",
        color: ["#EAEA26", "#906BF9", "#FE5656", "#01E17E", "#3DD1F9", "#FFAD05"],
        // title: {
        //     text: '网络/安全设备',
        //     left: '60',
        //     top: 0,
        //     textAlign: 'center',
        //     textStyle: {
        //         color: '#fff',
        //         fontSize: 14,
        //         fontWeight: 0
        //     }
        // },
        grid: {
          left: 10,
          top: 50,
          bottom: 10,
          right: 10,
          containLabel: true
        },
        tooltip: {
          trigger: 'item',
          formatter: "{b} : {c} ({d}%)"
        },
        legend: {
          type: "scroll",
          orient: "vartical",
          // x: "right",
          top: "center",
          right: "0",
          // bottom: "0%",
          itemWidth: 16,
          itemHeight: 8,
          itemGap: 16,
          textStyle: {
            color: '#A3E2F4',
            fontSize: 12,
            fontWeight: 0
          },
          data: this.gs
        },
        polar: {
          center: ['35%', '50%'],
          radius: 100,
        },
        angleAxis: {
          interval: 1,
          type: 'category',
          data: [],
          z: 10,
          axisLine: {
            show: false,
            lineStyle: {
              color: "#0B4A6B",
              width: 1,
              type: "solid"
            },
          },
          axisLabel: {
            interval: 0,
            show: true,
            color: "#0B4A6B",
            margin: 8,
            fontSize: 16
          },
        },
        radiusAxis: {
          min: 40,
          max: 120,
          center: ['35%', '50%'],
          interval: 20,
          axisLine: {
            show: false,
            lineStyle: {
              color: "#0B3E5E",
              width: 1,
              type: "solid"
            },
          },
          axisLabel: {
            formatter: '{value} %',
            show: false,
            padding: [0, 0, 20, 0],
            color: "#0B3E5E",
            fontSize: 16
          },
          splitLine: {
            lineStyle: {
              color: "#0B3E5E",
              width: 2,
              type: "solid"
            }
          }
        },
        calculable: true,
        series: [{
          name: "3km以内",
          type: 'pie',
          center: ['35%', '50%'],
          radius: ["5%", "20%"],
          hoverAnimation: true,
          labelLine: {
            normal: {
              show: false,
              length: 30,
              length2: 55
            },
            emphasis: {
              show: false
            }
          },
          roseType: 'area',
          zlevel: 10,
          label: {
            normal: {
              show: false,
              formatter: "{c}",
              color: "#ffff",
              textStyle: {
                fontSize: 12,
              },
              position: 'inside'
            },
            emphasis: {
              show: true
            }
          },
          data: d1
        }, {
          type: 'pie',
          center: ['35%', '50%'],
          radius: ["55%", "90%"],
          hoverAnimation: false,
          labelLine: {
            normal: {
              show: false,
              length: 30,
              length2: 55
            },
            emphasis: {
              show: false
            }
          },
          name: "10km以上",
          roseType: 'area',
          zlevel: 10,
          label: {
            normal: {
              show: true,
              formatter: "{c}",
              color: "#ffff",
              textStyle: {
                fontSize: 12,
              },
              position: 'inside'
            },
            emphasis: {
              show: true
            }
          },
          data: d3
        }, {
          // stack: 'a',
          name: "3-10km",
          type: 'pie',
          center: ['35%', '50%'],
          radius: ['25%', '50%'],
          roseType: 'area',
          zlevel: 10,
          label: {
            normal: {
              show: true,
              formatter: "{c}",
              color: "#ffff",
              textStyle: {
                fontSize: 12,
              },
              position: 'inside'
            },
            emphasis: {
              show: true
            }
          },
          labelLine: {
            normal: {
              show: true,
              length: 20,
              length2: 55
            },
            emphasis: {
              show: false
            }
          },
          data: d2
        },]
      };
      myChart.setOption(option);
      // 监听浏览器缩放，图表对象调用缩放resize函数
      window.addEventListener("resize", function () {
        myChart.resize();
      });
    },
    // 中5
    dev14() {
      var myChart = echarts.init(document.querySelector(".scatter3 .chart"));
      var t1 = ['3km以内', '3-10km', '10km以上']
      var d1 = []; this.distant1.map((item, index) => { d1.push([0, index, item]) })
      var d2 = []; this.distant2.map((item, index) => { d2.push([1, index, item]) })
      var d3 = []; this.distant3.map((item, index) => { d3.push([2, index, item]) })
      var dd = [...new Array([...d1, ...d2, ...d3])][0]
      var gs = this.gs
      console.log(dd);
      var option = {
        legend: {
          data: ['距离分布情况'],
          left: 'right',
          textStyle:{
            color:'gold'
          }
        },
        polar: {},
        tooltip: {
          formatter: function (params) {
            return params.value[2] + '=' + gs[params.value[1]] + '=' + t1[params.value[0]];
          }
        },
        angleAxis: {
          type: 'category',
          data: this.gs,
          textStyle:{
            color:'#ffff'
          },
          boundaryGap: false,
          splitLine: {
            show: true,
            lineStyle: {
              color: '#fff',
              type: 'dashed'
            }
          },
          axisLine: {
            show: false
          }
        },
        radiusAxis: {
          type: 'category',
          data: t1,
          axisLine: {
            show: false
          },
          axisLabel: {
            rotate: 45
          }
        },
        series: [{
          name: '距离分布情况',
          type: 'scatter',
          textStyle:{
            color:'#ffff'
          },
          itemStyle:{
            color:'gold'
          },
          coordinateSystem: 'polar',
          symbolSize: function (val) {
            return val[2] / 30;
          },
          data: dd
        }]
      };
      myChart.setOption(option);
      // 监听浏览器缩放，图表对象调用缩放resize函数
      window.addEventListener("resize", function () {
        myChart.resize();
      });
    },
  }
};
</script>

<style scoped>
@import '../css/VisualReports.css';
</style>
