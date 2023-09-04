<template>
    <div class="block">
        <div style="float: right">
            <el-radio-group @change="showchange" v-model="showvalue">
                <el-radio-button label="全国"></el-radio-button>
                <el-radio-button label="城市"></el-radio-button>
            </el-radio-group>
        </div>
        <div v-show="showquanguo">
            <span class="demonstration">选择日期</span>
            <el-date-picker
                v-model="dateym"
                type="monthrange"
                range-separator="至"
                start-placeholder="开始月份"
                end-placeholder="结束月份"
                format="yyyy 年 MM 月"
                value-format="yyyyMM"
                @change="getData1()"
                unlink-panels>
            </el-date-picker>
        </div>
        <div v-show="showquanguo" id="main1" style="width: 100%;height:400px;"></div>
        <div v-show="showquanguo" id="main2" style="width: 100%;height:400px;top:10px"></div>
        <div v-show="showcity">
            <span class="demonstration">选择日期</span>
            <el-date-picker
            v-model="dateym"
            type="monthrange"
            range-separator="至"
            start-placeholder="开始月份"
            end-placeholder="结束月份"
            format="yyyy 年 MM 月"
            value-format="yyyyMM"
            @change="getData2()"
            unlink-panels>
            </el-date-picker>
            <span class="demonstration">选择城市</span>
            <el-select v-model="value" clearable multiple collapse-tags filterable placeholder="请选择">
                <el-option
                v-for="item in city"
                :key="item.城市"
                :label="item.城市"
                :value="item.城市">
                </el-option>
            </el-select>
        </div>
        <div v-show="showcity">
            12
        </div>
    </div>
  </template>
  <script>
  import * as echarts from 'echarts';
  export default{
    data() {
        return {
            showquanguo:true,
            showcity: false,
            showvalue: '全国',
            labList:[],
            labListc:[],
            tuli1:['新房价格同比（%）','二手房价格同比（%）'],
            tuli2:['新房价格环比（%）','二手房价格环比（%）'],
            plttongbi1:[],
            plthuanbi1:[],
            plttongbi2:[],
            plthuanbi2:[],
            pltxname1:[],
            pltxname2:[],
            title: '',
            title2:'',
            dateym:'',
            city:[],
            test:[{name:'杭州',value:[1,2,3]},{name:'上海',value:[3,4,5]}],
            value:'',
        }
    },
    mounted() {
        this.getData1();
        this.getData2();
    },
    methods: {
        showchange:function(){
            this.showquanguo = !this.showquanguo
            this.showcity = !this.showcity
        },
        getData1() {
            this.labList = []
            this.pltxname1 = []
            this.plttongbi1 = []
            this.plthuanbi1 = []
            this.pltxname2 = []
            this.plttongbi2 = []
            this.plthuanbi2 = []
            this.title = ''
            this.title2 = ''
            var myChart1 = echarts.init(document.getElementById('main1'));
            var myChart2 = echarts.init(document.getElementById('main2'));
            if (this.dateym == '' || this.dateym == null)
            {
                this.$axios.get('/api/fangjiacount')
                .then((res)=>{
                    this.labList=res.data;
                    this.labList.forEach((item,index) => {
                        this.pltxname1[index] = item.日期
                        this.pltxname2[index] = item.日期
                        this.plttongbi1[index] = item.新建价格同比
                        this.plthuanbi1[index] = item.新建价格环比
                        this.plttongbi2[index] = item.二手价格同比
                        this.plthuanbi2[index] = item.二手价格环比
                    }) 
                    this.title = this.pltxname1[0].toString().slice(0,4) + '年全国新房和二手房价格同比变化'
                    this.title2 = this.pltxname1[0].toString().slice(0,4) + '年全国新房和二手房价格同比变化'
                    this.drawChart1(myChart1)
                    this.drawChart2(myChart2)
                })   
            }
            else
            {
                this.title = this.dateym[0].slice(0,4) + '年'
                + this.dateym[0].substring(4) + '月'
                + '-' + this.dateym[1].slice(0,4) + '年'
                + this.dateym[1].substring(4) + '月'
                + '全国新房和二手房价格同比变化'
                this.title2 = this.dateym[0].slice(0,4) + '年'
                + this.dateym[0].substring(4) + '月'
                + '-' + this.dateym[1].slice(0,4) + '年'
                + this.dateym[1].substring(4) + '月'
                + '全国新房和二手房价格环比变化'
                this.$axios.get('/api/fangjiacountd',{
                    params: {
                        mind: this.dateym[0],
                        maxd: this.dateym[1]
                    }
                })
                .then((res)=>{
                    this.labList=res.data;
                    this.labList.forEach((item,index) => {
                        this.pltxname1[index] = item.日期
                        this.pltxname2[index] = item.日期
                        this.plttongbi1[index] = item.新建价格同比
                        this.plthuanbi1[index] = item.新建价格环比
                        this.plttongbi2[index] = item.二手价格同比
                        this.plthuanbi2[index] = item.二手价格环比
                    }) 
                    this.drawChart1(myChart1)
                    this.drawChart2(myChart2)
                })
            }
        },
        getData2() {
            this.$axios.get('/api/fangjiacountcd')
            .then((res)=>{
                this.city = res.data[0]
                this.labListc = res.data[1]
                this.labListc.forEach((item,index) => {
                    
                })
                this.test[0].value[3]=4
                this.plttongbi1.push=1
                this.plttongbi1.push=1
                console.log(this.plttongbi1)
            })
        },
        drawChart1(myChart) {
            myChart.setOption({
                // 背景径向渐变
                backgroundColor: {
                    type: 'radial',
                    x: 0.5,// 0.5为正中心，如果小于渐变中心靠左
                    y: 0.5,// 0.5为正中心，如果小于渐变中心靠上
                    r: 0.7,// 0.5渐变影响范围只有一半，影响圆心到周围的一半
                    colorStops: [{
                        offset: 0, color: '#4D4D4D' // 0% 处的颜色
                    }, {
                        offset: 1, color: '#333333' // 100% 处的颜色
                    }],
                    global: false // 缺省为 false
                },
                // 标题样式
                title:{
                    show:true,//false
                    text:this.title,//主标题文本
                    left: 'center',
                    textStyle:{
                        color:'white',//'red'，字体颜色
                        fontStyle:'normal',//'italic'(倾斜) | 'oblique'(倾斜体) ，字体风格
                        fontWeight:'bold',//'bold'(粗体) | 'bolder'(粗体) | 'lighter'(正常粗细) ，字体粗细
                        fontFamily:'sans-serif',//'sans-serif' | 'serif' | 'monospace' | 'Arial' | 'Courier New' 
                        // 'Microsoft YaHei'(微软雅黑) ，文字字体
                        fontSize:20,//字体大小
                        lineHeight:50,//字体行高
                    }
                    },
                    // 设置坐标留白
                    grid: {
                        x:'10%',
                        x2:'10%',
                        y2:'18%'
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'cross',
                            crossStyle: { color: '#999' }
                        }
                    },
                    // 设置图例
                    legend: {
                        data: this.tuli1,
                        y: 'bottom',
                        x: 'center',
                        textStyle:{
                            color:'#FFFFFF'
                        }
                    },
                    // 工具框
                    toolbox: {
                        feature: {
                            dataView: { show: true, readOnly: false },
                            magicType: { show: true, type: ['line', 'bar'] },
                            restore: { show: true },
                            saveAsImage: { show: true }
                        }
                    },
                    xAxis: [{
                        type: 'category',
                        data: this.pltxname1,
                        axisPointer: { type: 'shadow' },
                        axisLine: {
                            lineStyle: {
                                color: "#4D4D4D",
                            }
                        },
                        axisLabel:{
                            interval: 0, // x轴取值间隔
                            rotate: '45', // x轴倾斜角度
                            textStyle: {
                                color: '#FFFFFF', // 坐标轴文字颜色
                            },
                        }
                    }],
                    yAxis: {
                        type: 'value',
                        interval: 1.0,
                        axisLine: {
                            lineStyle: {
                                color: "#4D4D4D",
                            }
                        },
                        axisLabel:{
                            textStyle: {
                                color: '#FFFFFF', // 坐标轴文字颜色
                            },
                            formatter:function (value, index) {           
						        return value.toFixed(1);      
						    }
                        },
                        splitLine: {
                            show: false,
                            lineStyle: {
                                color: '#4D4D4D',//网格线的颜色
                                width: 1,
                                type: 'solid'
                            }
                        }
                    },
                    series: 
                    [
                        {
                            name: '新房价格同比（%）',
                            type: 'line',
                            // yAxisIndex: 1,
                            // 返回提示框信息格式
                            tooltip: {
                                valueFormatter: function (value) {
                                    return value + '%';
                                }
                            },
                            symbolSize: 7,
                            lineStyle: {
                                width: 4 //线条宽度
                            },
                            // 折点显示值
                            label : 
                            {
                                show: true,
                                textStyle:{
                                    color:'#ff8d7b',
                                    fontSize: 15
                                }
                            },
                            // 系列级个性化折线样式
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: '#FCA12B'
                            },
                            {
                                offset: 1,
                                color: '#ff8d7b'
                            }]),//线条渐变色
                            data: this.plttongbi1
                        },
                        {
                            name: '二手房价格同比（%）',
                            type: 'line',
                            // yAxisIndex: 1,
                            // 返回提示框信息格式
                            tooltip: {
                                valueFormatter: function (value) {
                                    return value + '%';
                                }
                            },
                            symbolSize: 7,
                            lineStyle: {
                                width: 4 //线条宽度
                            },
                            // 折点显示值
                            label : 
                            {
                                show: true,
                                textStyle:{
                                    color:'#1DA9FB',
                                    fontSize: 15
                                }
                            },
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: '#57E2FF'
                            }, 
                            {
                                offset: 1,
                                color: '#1DA9FB'
                            }]),//线条渐变色
                            data: this.plttongbi2
                        },
                    ]
            })
        },
        drawChart2(myChart) {
            myChart.setOption({
                // 背景径向渐变
                backgroundColor: {
                    type: 'radial',
                    x: 0.5,// 0.5为正中心，如果小于渐变中心靠左
                    y: 0.5,// 0.5为正中心，如果小于渐变中心靠上
                    r: 0.7,// 0.5渐变影响范围只有一半，影响圆心到周围的一半
                    colorStops: [{
                        offset: 0, color: '#4D4D4D' // 0% 处的颜色
                    }, {
                        offset: 1, color: '#333333' // 100% 处的颜色
                    }],
                    global: false // 缺省为 false
                },
                // 标题样式
                title:{
                    show:true,//false
                    text:this.title2,//主标题文本
                    left: 'center',
                    textStyle:{
                        color:'white',//'red'，字体颜色
                        fontStyle:'normal',//'italic'(倾斜) | 'oblique'(倾斜体) ，字体风格
                        fontWeight:'bold',//'bold'(粗体) | 'bolder'(粗体) | 'lighter'(正常粗细) ，字体粗细
                        fontFamily:'sans-serif',//'sans-serif' | 'serif' | 'monospace' | 'Arial' | 'Courier New' 
                        // 'Microsoft YaHei'(微软雅黑) ，文字字体
                        fontSize:20,//字体大小
                        lineHeight:50,//字体行高
                    }
                },
                // 设置坐标留白
                grid: {
                    x:'10%',
                    x2:'10%',
                    y2:'18%'
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                        crossStyle: { color: '#999' }
                    }
                },
                // 设置图例
                legend: {
                    data: this.tuli2,
                    y: 'bottom',
                    x: 'center',
                    textStyle:{
                        color:'#FFFFFF'
                    }
                },
                // 工具框
                toolbox: {
                    feature: {
                        dataView: { show: true, readOnly: false },
                        magicType: { show: true, type: ['line', 'bar'] },
                        restore: { show: true },
                        saveAsImage: { show: true }
                    }
                },
                xAxis: [{
                    type: 'category',
                    data: this.pltxname2,
                    axisPointer: { type: 'shadow' },
                    axisLine: {
                        lineStyle: {
                            color: "#4D4D4D",
                        }
                    },
                    axisLabel:{
                        interval: 0, // x轴取值间隔
                        rotate: '45', // x轴倾斜角度
                        textStyle: {
                            color: '#FFFFFF', // 坐标轴文字颜色
                        },
                    }
                }],
                yAxis: {
                    type: 'value',
                    interval: 0.2,
                    axisLine: {
                        lineStyle: {
                            color: "#4D4D4D",
                        }
                    },
                    axisLabel:{
                        textStyle: {
                            color: '#FFFFFF', // 坐标轴文字颜色
                        },
                        formatter:function (value, index) {           
						    return value.toFixed(1);      
						}
                    },
                    splitLine: {
                        show: false,
                        lineStyle: {
                            color: '#4D4D4D',//网格线的颜色
                            width: 1,
                            type: 'solid'
                        }
                    }
                },
                series: 
                [
                    {
                        name: '新房价格环比（%）',
                        type: 'line',
                        // yAxisIndex: 1,
                        // 返回提示框信息格式
                        tooltip: {
                            valueFormatter: function (value) {
                                return value + '%';
                            }
                        },
                        symbolSize: 7,
                        lineStyle: {
                            width: 4 //线条宽度
                        },
                        // 折点显示值
                        label : {
                            show: true,
                            textStyle:{
                                color:'#ff8d7b',
                                fontSize: 15
                            }
                        },
                        // 系列级个性化折线样式
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: '#FCA12B'
                        },
                        {
                            offset: 1,
                            color: '#ff8d7b'
                        }]),//线条渐变色
                        data: this.plthuanbi1
                    },
                    {
                        name: '二手房价格环比（%）',
                        type: 'line',
                        // yAxisIndex: 1,
                        // 返回提示框信息格式
                        tooltip: {
                            valueFormatter: function (value) {
                                return value + '%';
                            }
                        },
                        symbolSize: 7,
                        lineStyle: {
                            width: 4 //线条宽度
                        },
                        // 折点显示值
                        label : {
                            show: true,
                            position: 'bottom',
                            textStyle:{
                                color:'#1DA9FB',
                                fontSize: 15
                            }
                        },
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: '#57E2FF'
                        }, 
                        {
                            offset: 1,
                            color: '#1DA9FB'
                        }]),//线条渐变色
                        data: this.plthuanbi2
                    },
                ]
            })
        },
        drawChart2_1(myChart) {
            myChart.setOption({
                // 背景径向渐变
                backgroundColor: {
                    type: 'radial',
                    x: 0.5,// 0.5为正中心，如果小于渐变中心靠左
                    y: 0.5,// 0.5为正中心，如果小于渐变中心靠上
                    r: 0.7,// 0.5渐变影响范围只有一半，影响圆心到周围的一半
                    colorStops: [{
                        offset: 0, color: '#4D4D4D' // 0% 处的颜色
                    }, {
                        offset: 1, color: '#333333' // 100% 处的颜色
                    }],
                    global: false // 缺省为 false
                },
                // 标题样式
                title:{
                    show:true,//false
                    text:this.title,//主标题文本
                    left: 'center',
                    textStyle:{
                        color:'white',//'red'，字体颜色
                        fontStyle:'normal',//'italic'(倾斜) | 'oblique'(倾斜体) ，字体风格
                        fontWeight:'bold',//'bold'(粗体) | 'bolder'(粗体) | 'lighter'(正常粗细) ，字体粗细
                        fontFamily:'sans-serif',//'sans-serif' | 'serif' | 'monospace' | 'Arial' | 'Courier New' 
                        // 'Microsoft YaHei'(微软雅黑) ，文字字体
                        fontSize:20,//字体大小
                        lineHeight:50,//字体行高
                    }
                    },
                // 设置坐标留白
                grid: {
                    x:'10%',
                    x2:'10%',
                    y2:'18%'
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                        crossStyle: { color: '#999' }
                    }
                },
                // 设置图例
                legend: {
                    data: this.tuli1,
                    y: 'bottom',
                    x: 'center',
                    textStyle:{
                        color:'#FFFFFF'
                    }
                },
                // 工具框
                toolbox: {
                    feature: {
                        dataView: { show: true, readOnly: false },
                        magicType: { show: true, type: ['line', 'bar'] },
                        restore: { show: true },
                        saveAsImage: { show: true }
                    }
                },
                xAxis: [{
                    type: 'category',
                    data: this.pltxname1,
                    axisPointer: { type: 'shadow' },
                    axisLine: {
                        lineStyle: {
                            color: "#4D4D4D",
                        }
                    },
                    axisLabel:{
                        interval: 0, // x轴取值间隔
                        rotate: '45', // x轴倾斜角度
                        textStyle: {
                            color: '#FFFFFF', // 坐标轴文字颜色
                        },
                    }
                }],
                yAxis: {
                    type: 'value',
                    interval: 1.0,
                    axisLine: {
                        lineStyle: {
                            color: "#4D4D4D",
                        }
                    },
                    axisLabel:{
                        textStyle: {
                            color: '#FFFFFF', // 坐标轴文字颜色
                        },
                        formatter:function (value, index) {           
						    return value.toFixed(1);      
						}
                    },
                    splitLine: {
                        show: false,
                        lineStyle: {
                            color: '#4D4D4D',//网格线的颜色
                            width: 1,
                            type: 'solid'
                        }
                    }
                },
                series: ''
            })
        },
    }
  }
  </script>