<template>
    <div>
        <div>
        <el-radio-group @change="showchange(showvalue)" v-model="showvalue">
            <el-radio-button label="购房类型（比重）"></el-radio-button>
            <el-radio-button label="购房类型（绝对值）"></el-radio-button>
            <el-radio-button label="人才类型（比重）"></el-radio-button>
            <el-radio-button label="人才类型（绝对值）"></el-radio-button>
        </el-radio-group>
    </div>
    <div v-if="showmain" id="main" style="width: 100%;height:600px;"></div>
    <div v-if="showmain2" id="main2" style="width: 100%;height:600px;"></div>
    <div v-if="showmain3" id="main3" style="width: 100%;height:600px;"></div>
    <div v-if="showmain4" id="main4" style="width: 100%;height:600px;"></div>
    </div>
    
  </template>
  <script>
  import * as echarts from 'echarts';
  var myChart;
  export default{
    data() {
        return {
            showmain:true,
            showvalue: '购房类型（比重）',
            showmain2: false,
            showmain3: false,
            showmain4: false,
            tuli:['高层次人才','无房','有房','总人数'],
            tuli2:['中专','大专','本科','硕士','博士','中级专业技术人员','高级专业技术人员','其他人才','总人数'],
            data:[
                {"年": 2018, "高层次人才": 0, "无房": 52729, "有房": 77527},
                {"年": 2019, "高层次人才": 0, "无房": 69365, "有房": 131434},
                {"年": 2020, "高层次人才": 1717, "无房": 62431, "有房": 106003},
                {"年": 2021, "高层次人才": 5423, "无房": 78268, "有房": 87189},
                {"年": 2022, "高层次人才": 2499, "无房": 18222, "有房": 28631},
	        ],
            data2:[
                // {"年":2018,"买房人数":131148,"中专":1,"大专":1530,"本科":3172,"硕士":499,"博士":53,"中级专业技术人员":61,"高级专业技术人员":15,"其他人才":10},
                // {"年":2019,"买房人数":236787,"中专":9,"大专":4139,"本科":10043,"硕士":1558,"博士":126,"中级专业技术人员":141,"高级专业技术人员":21,"其他人才":56},
                // {"年":2020,"买房人数":237322,"中专":6,"大专":5082,"本科":13901,"硕士":3365,"博士":306,"中级专业技术人员":119,"高级专业技术人员":38,"其他人才":57},
                // {"年":2021,"买房人数":257322,"中专":1,"大专":5045,"本科":14413,"硕士":4139,"博士":543,"中级专业技术人员":138,"高级专业技术人员":36,"其他人才":40},
                // {"年":2022,"买房人数":105683,"中专":0,"大专":1693,"本科":5824,"硕士":1856,"博士":261,"中级专业技术人员":66,"高级专业技术人员":16,"其他人才":8},
                {"年":2019,"中专":30,"大专":18276,"本科":24325,"硕士":4066,"博士":421,"初级专业技术人员":0,"中级专业技术人员":1,"高级专业技术人员":1,"其他人才":247},
                {"年":2020,"中专":8,"大专":15208,"本科":32175,"硕士":8296,"博士":925,"初级专业技术人员":2,"中级专业技术人员":7,"高级专业技术人员":4,"其他人才":98},
                {"年":2021,"中专":3,"大专":16849,"本科":29044,"硕士":8089,"博士":836,"初级专业技术人员":0,"中级专业技术人员":3,"高级专业技术人员":1,"其他人才":19},
                {"年":2022,"中专":0,"大专":2,"本科":22756,"硕士":6459,"博士":998,"初级专业技术人员":0,"中级专业技术人员":813,"高级专业技术人员":192,"其他人才":58},
            ],
        }
    },
    mounted() {
        this.getdata()
    },
    methods: {   
        showchange:function(val){
            if(val == "购房类型（比重）"){
                this.showmain = true
                this.showmain2 = false
                this.showmain3 = false
                this.showmain4 = false
                this.$nextTick(() => {
                    this.getdata()
                })
            }
            else if(val == "购房类型（绝对值）"){
                console.log(val)
                this.showmain = false
                this.showmain2 = true
                this.showmain3 = false
                this.showmain4 = false
                this.$nextTick(() => {
                    this.getdata2()
                })
            }
            else if(val == "人才类型（比重）") {
                this.showmain = false
                this.showmain2 = false
                this.showmain3 = true
                this.showmain4 = false
                this.$nextTick(() => {
                    this.getdata3()
                })
            }
            else{
                this.showmain = false
                this.showmain2 = false
                this.showmain3 = false
                this.showmain4 = true
                this.$nextTick(() => {
                    this.getdata4()
                })
            }
        },
        getdata() {
            this.drawChart()
        },
        drawChart() {
            if (myChart != null && myChart != "" && myChart != undefined) {
                myChart.dispose(); //销毁
            }
            myChart = echarts.init(document.getElementById('main'));
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
                    text:'2018-2022年杭州市购房类型统计图',//主标题文本
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
                tooltip: {
                    trigger: 'axis',
                        axisPointer: {
                            // Use axis to trigger tooltip
                            type: 'shadow' // 'shadow' as default; can also be 'line' or 'shadow'
                        }
                },
                legend: {
                    data: this.tuli,
                    y: 'bottom',
                        x: 'center',
                    textStyle:{
                        color:'#FFFFFF'
                    }
                },
                grid: {
                        x:'6%',
                        x2:'6%',
                        y2:'10%'
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
                xAxis: {
                    type: 'category',
                    data: initDataName(this.data),
                    axisLine: {
                        lineStyle: {
                            color: "#4D4D4D",
                        }
                    },
                    axisLabel:{
                        color: '#FFFFFF', // 坐标轴文字颜色
                    },
                    splitLine: {
                        show: false,
                    }
                },
                yAxis: [{
                    type: 'value',
                    axisLine: {
                        lineStyle: {
                            color: "#4D4D4D",
                        }
                        },
                    axisLabel:{
                        color: '#FFFFFF', // 坐标轴文字颜色
                    },
                    splitLine: {
                        show: true,
                        lineStyle: {
                            color: '#4D4D4D',//网格线的颜色
                            width: 1,
                            type: 'solid'
                        }
                    }
                },
                {
                    type: 'value',
                    axisLine: {
                        lineStyle: {
                            color: "#4D4D4D",
                        }
                        },
                    axisLabel:{
                        color: '#FFFFFF', // 坐标轴文字颜色
                    },
                    splitLine: {
                        show: true,
                        lineStyle: {
                            color: '#4D4D4D',//网格线的颜色
                            width: 1,
                            type: 'solid'
                        }
                    }
                }
            ],
            series: [{
				name: '高层次人才',
				type: 'bar',
				stack: '总量',
                barWidth: 80,
				label: {
					show: true,
					position: 'inside',//在左边显示
                    color: 'white',
					formatter: '{c}%'// 给计算后的数值添加%
				},
				//data: [13, 68.28, 85]
				data:initData(this.data,'高层次人才')// 计算对应的百分比
			},
			{
				name: '无房',
				type: 'bar',
				stack: '总量',
				label: {
					show: true,
					formatter: '{c}%',
                    position: 'inside',
                    color: 'white'
				},
				data:initData(this.data,'无房')
			},
			{
				name: '有房',
				type: 'bar',
				stack: '总量',
				label: {
					show: true,
					position: 'inside',// 在右边显示
					formatter: '{c}%',
                    color: 'white'
				},
				data:initData(this.data,'有房')
			},
			{
				name: '总人数',
				type: 'line',
				// label: {
				// 	show: true,
                //     fontSize: 15,
                //     color: 'white'
				// },
                yAxisIndex: 1,
				data:sumData(this.data)
			}
		]
            });
            function initDataName(data){
		        var nameList = []
		        for (var i = 0; i < data.length; i++) {
			        nameList.push(data[i].年)
		        }
		        return nameList
	        }
            function initData(data,val){
		        var serie = [];
                for (var i = 0; i < data.length; i++) {
			        var num = 0
			        if(val == '高层次人才'){//计算统计值
				        num = data[i].高层次人才
			        }else if (val == '无房') {//计算最高值
				        num = data[i].无房
			        }
                    else{
                        num = data[i].有房
                    }
			        var total = (parseFloat(data[i].高层次人才) + parseFloat(data[i].无房) + parseFloat(data[i].有房)).toFixed(2);
			        var numcount = Percentage(num,total)
                    serie.push(numcount);
                }
                return serie;
	        }
	        //计算两者占比
	        function Percentage(num, total) {
		        return (Math.round(num / total * 10000) / 100.00);// 小数点后两位百分比
	        }
            function sumData(data) {
                var serie = [];
                for (var i = 0; i < data.length; i++) {
			        var total = (parseFloat(data[i].高层次人才) + parseFloat(data[i].无房) + parseFloat(data[i].有房)).toFixed(2);
                    serie.push(total);
                }
                return serie
            }
        },
        getdata2() {
            this.drawChart2()
        },
        drawChart2() {
            if (myChart != null && myChart != "" && myChart != undefined) {
                myChart.dispose(); //销毁
            }
            myChart = echarts.init(document.getElementById('main2'));
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
                    text:'2018-2022年杭州市购房类型统计图',//主标题文本
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
                tooltip: {
                    trigger: 'axis',
                        axisPointer: {
                            // Use axis to trigger tooltip
                            type: 'shadow' // 'shadow' as default; can also be 'line' or 'shadow'
                        }
                },
                legend: {
                    data: this.tuli,
                    y: 'bottom',
                        x: 'center',
                    textStyle:{
                        color:'#FFFFFF'
                    }
                },
                grid: {
                        x:'6%',
                        x2:'6%',
                        y2:'10%'
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
                xAxis: {
                    type: 'category',
                    data: initDataName(this.data),
                    axisLine: {
                        lineStyle: {
                            color: "#4D4D4D",
                        }
                    },
                    axisLabel:{
                        color: '#FFFFFF', // 坐标轴文字颜色
                    },
                    splitLine: {
                        show: false,
                    }
                },
                yAxis: [{
                    type: 'value',
                    axisLine: {
                        lineStyle: {
                            color: "#4D4D4D",
                        }
                        },
                    axisLabel:{
                        color: '#FFFFFF', // 坐标轴文字颜色
                    },
                    splitLine: {
                        show: true,
                        lineStyle: {
                            color: '#4D4D4D',//网格线的颜色
                            width: 1,
                            type: 'solid'
                        }
                    }
                },
                {
                    type: 'value',
                    axisLine: {
                        lineStyle: {
                            color: "#4D4D4D",
                        }
                        },
                    axisLabel:{
                        color: '#FFFFFF', // 坐标轴文字颜色
                    },
                    splitLine: {
                        show: true,
                        lineStyle: {
                            color: '#4D4D4D',//网格线的颜色
                            width: 1,
                            type: 'solid'
                        }
                    }
                }
            ],
            series: [{
				name: '高层次人才',
				type: 'bar',
				stack: '总量',
                barWidth: 80,
				label: {
					show: true,
					position: 'inside',
                    color: 'white',
				},
				//data: [13, 68.28, 85]
				data:initData(this.data,'高层次人才')
			},
			{
				name: '无房',
				type: 'bar',
				stack: '总量',
				label: {
					show: true,
                    position: 'inside',
                    color: 'white'
				},
				data:initData(this.data,'无房')
			},
			{
				name: '有房',
				type: 'bar',
				stack: '总量',
				label: {
					show: true,
					position: 'inside',// 在右边显示
                    color: 'white'
				},
				data:initData(this.data,'有房')
			},
			{
				name: '总人数',
				type: 'line',
				// label: {
				// 	show: true,
                //     fontSize: 15,
                //     color: 'white'
				// },
                yAxisIndex: 1,
				data:sumData(this.data)
			}
		]
            });
            function initDataName(data){
		        var nameList = []
		        for (var i = 0; i < data.length; i++) {
			        nameList.push(data[i].年)
		        }
		        return nameList
	        }
            function initData(data,val){
		        var serie = [];
                for (var i = 0; i < data.length; i++) {
			        var num = 0
			        if(val == '高层次人才'){
				        num = data[i].高层次人才
			        }else if (val == '无房') {
				        num = data[i].无房
			        }
                    else{
                        num = data[i].有房
                    }
                    serie.push(num);
                }
                return serie;
	        }
            function sumData(data) {
                var serie = [];
                for (var i = 0; i < data.length; i++) {
			        var total = (parseFloat(data[i].高层次人才) + parseFloat(data[i].无房) + parseFloat(data[i].有房)).toFixed(2);
                    serie.push(total);
                }
                return serie
            }
        },
        getdata3() {
            this.drawChart3()
        },
        drawChart3() {
            if (myChart != null && myChart != "" && myChart != undefined) {
                myChart.dispose(); //销毁
            }
            myChart = echarts.init(document.getElementById('main3'));
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
                    text:'2019-2022年杭州市人才类型统计图',//主标题文本
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
                tooltip: {
                    trigger: 'axis',
                        axisPointer: {
                            // Use axis to trigger tooltip
                            type: 'shadow' // 'shadow' as default; can also be 'line' or 'shadow'
                        }
                },
                legend: {
                    data: this.tuli2,
                    y: 'bottom',
                        x: 'center',
                    textStyle:{
                        color:'#FFFFFF'
                    }
                },
                grid: {
                        x:'6%',
                        x2:'6%',
                        y2:'10%'
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
                xAxis: {
                    type: 'category',
                    data: initDataName(this.data2),
                    axisLine: {
                        lineStyle: {
                            color: "#4D4D4D",
                        }
                    },
                    axisLabel:{
                        color: '#FFFFFF', // 坐标轴文字颜色
                    },
                    splitLine: {
                        show: false,
                    }
                },
                yAxis: [{
                    type: 'value',
                    axisLine: {
                        lineStyle: {
                            color: "#4D4D4D",
                        }
                        },
                    axisLabel:{
                        color: '#FFFFFF', // 坐标轴文字颜色
                    },
                    splitLine: {
                        show: true,
                        lineStyle: {
                            color: '#4D4D4D',//网格线的颜色
                            width: 1,
                            type: 'solid'
                        }
                    }
                },
                {
                    type: 'value',
                    axisLine: {
                        lineStyle: {
                            color: "#4D4D4D",
                        }
                        },
                    axisLabel:{
                        color: '#FFFFFF', // 坐标轴文字颜色
                    },
                    splitLine: {
                        show: true,
                        lineStyle: {
                            color: '#4D4D4D',//网格线的颜色
                            width: 1,
                            type: 'solid'
                        }
                    }
                }
            ],
            series: [{
				name: '中专',
				type: 'bar',
				stack: '总量',
                barWidth: 80,
				label: {
					show: true,
					position: 'inside',//在左边显示
                    color: 'white',
					formatter: '{c}%'// 给计算后的数值添加%
				},
				//data: [13, 68.28, 85]
				data:initData(this.data2,'中专')// 计算对应的百分比
			},
			{
				name: '大专',
				type: 'bar',
				stack: '总量',
				label: {
					show: true,
					formatter: '{c}%',
                    position: 'inside',
                    color: 'white'
				},
				data:initData(this.data2,'大专')
			},
			{
				name: '本科',
				type: 'bar',
				stack: '总量',
				label: {
					show: true,
					position: 'inside',// 在右边显示
					formatter: '{c}%',
                    color: 'white'
				},
				data:initData(this.data2,'本科')
			},
            {
				name: '硕士',
				type: 'bar',
				stack: '总量',
				label: {
					show: true,
					position: 'inside',// 在右边显示
					formatter: '{c}%',
                    color: 'white'
				},
				data:initData(this.data2,'硕士')
			},
            {
				name: '博士',
				type: 'bar',
				stack: '总量',
				label: {
					show: true,
					position: 'inside',// 在右边显示
					formatter: '{c}%',
                    color: 'white'
				},
				data:initData(this.data2,'博士')
			},
            {
				name: '中级专业技术人员',
				type: 'bar',
				stack: '总量',
				label: {
					show: true,
					position: 'inside',// 在右边显示
					formatter: '{c}%',
                    color: 'white'
				},
				data:initData(this.data2,'中级专业技术人员')
			},
            {
				name: '高级专业技术人员',
				type: 'bar',
				stack: '总量',
				label: {
					show: true,
					position: 'inside',// 在右边显示
					formatter: '{c}%',
                    color: 'white'
				},
				data:initData(this.data2,'高级专业技术人员')
			},
            {
				name: '其他人才',
				type: 'bar',
				stack: '总量',
				label: {
					show: true,
					position: 'inside',// 在右边显示
					formatter: '{c}%',
                    color: 'white'
				},
				data:initData(this.data2,'其他人才')
			},
			{
				name: '总人数',
				type: 'line',
				// label: {
				// 	show: true,
                //     fontSize: 15,
                //     color: 'white'
				// },
                yAxisIndex: 1,
				data:sumData(this.data2)
			}
		]
            });
            function initDataName(data){
		        var nameList = []
		        for (var i = 0; i < data.length; i++) {
			        nameList.push(data[i].年)
		        }
		        return nameList
	        }
            function initData(data,val){
		        var serie = [];
                for (var i = 0; i < data.length; i++) {
			        var num = 0
			        if(val == '中专'){//计算统计值
				        num = data[i].中专
			        }else if (val == '大专') {//计算最高值
				        num = data[i].大专
			        }else if (val == '本科') {//计算最高值
				        num = data[i].本科
			        }else if (val == '硕士') {//计算最高值
				        num = data[i].硕士
			        }else if (val == '博士') {//计算最高值
				        num = data[i].博士
			        }else if (val == '中级专业技术人员') {//计算最高值
				        num = data[i].中级专业技术人员
			        }else if (val == '高级专业技术人员') {//计算最高值
				        num = data[i].高级专业技术人员
			        }
                    else{
                        num = data[i].其他人才
                    }
			        var total = (parseFloat(data[i].中专) + parseFloat(data[i].大专) + parseFloat(data[i].本科)
                    + parseFloat(data[i].硕士) + parseFloat(data[i].博士) + parseFloat(data[i].中级专业技术人员)
                    + parseFloat(data[i].高级专业技术人员 + parseFloat(data[i].其他人才))).toFixed(2);
			        var numcount = Percentage(num,total)
                    serie.push(numcount);
                }
                return serie;
	        }
	        //计算两者占比
	        function Percentage(num, total) {
		        return (Math.round(num / total * 10000) / 100.00);// 小数点后两位百分比
	        }
            function sumData(data) {
                var serie = [];
                for (var i = 0; i < data.length; i++) {
			        var total = (parseFloat(data[i].中专) + parseFloat(data[i].大专) + parseFloat(data[i].本科)
                    + parseFloat(data[i].硕士) + parseFloat(data[i].博士) + parseFloat(data[i].中级专业技术人员)
                    + parseFloat(data[i].高级专业技术人员 + parseFloat(data[i].其他人才))).toFixed(2);
                    serie.push(total);
                }
                return serie
            }
        },
        getdata4() {
            this.drawChart4()
        },
        drawChart4() {
            if (myChart != null && myChart != "" && myChart != undefined) {
                myChart.dispose(); //销毁
            }
            myChart = echarts.init(document.getElementById('main4'));
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
                    text:'2019-2022年杭州市人才类型统计图',//主标题文本
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
                tooltip: {
                    trigger: 'axis',
                        axisPointer: {
                            // Use axis to trigger tooltip
                            type: 'shadow' // 'shadow' as default; can also be 'line' or 'shadow'
                        }
                },
                legend: {
                    data: this.tuli2,
                    y: 'bottom',
                        x: 'center',
                    textStyle:{
                        color:'#FFFFFF'
                    }
                },
                grid: {
                        x:'6%',
                        x2:'6%',
                        y2:'10%'
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
                xAxis: {
                    type: 'category',
                    data: initDataName(this.data2),
                    axisLine: {
                        lineStyle: {
                            color: "#4D4D4D",
                        }
                    },
                    axisLabel:{
                        color: '#FFFFFF', // 坐标轴文字颜色
                    },
                    splitLine: {
                        show: false,
                    }
                },
                yAxis: [{
                    type: 'value',
                    axisLine: {
                        lineStyle: {
                            color: "#4D4D4D",
                        }
                        },
                    axisLabel:{
                        color: '#FFFFFF', // 坐标轴文字颜色
                    },
                    splitLine: {
                        show: true,
                        lineStyle: {
                            color: '#4D4D4D',//网格线的颜色
                            width: 1,
                            type: 'solid'
                        }
                    }
                },
                {
                    type: 'value',
                    axisLine: {
                        lineStyle: {
                            color: "#4D4D4D",
                        }
                        },
                    axisLabel:{
                        color: '#FFFFFF', // 坐标轴文字颜色
                    },
                    splitLine: {
                        show: true,
                        lineStyle: {
                            color: '#4D4D4D',//网格线的颜色
                            width: 1,
                            type: 'solid'
                        }
                    }
                }
            ],
            series: [{
				name: '中专',
				type: 'bar',
                barWidth: 80,
				stack: '总量',
				label: {
					show: true,
					position: 'inside',//在左边显示
                    color: 'white',
				},
				//data: [13, 68.28, 85]
				data:initData(this.data2,'中专')// 计算对应的百分比
			},
			{
				name: '大专',
				type: 'bar',
				stack: '总量',
				label: {
					show: true,
                    position: 'inside',
                    color: 'white'
				},
				data:initData(this.data2,'大专')
			},
			{
				name: '本科',
				type: 'bar',
				stack: '总量',
				label: {
					show: true,
					position: 'inside',// 在右边显示
                    color: 'white'
				},
				data:initData(this.data2,'本科')
			},
            {
				name: '硕士',
				type: 'bar',
				stack: '总量',
				label: {
					show: true,
					position: 'inside',// 在右边显示
                    color: 'white'
				},
				data:initData(this.data2,'硕士')
			},
            {
				name: '博士',
				type: 'bar',
				stack: '总量',
				label: {
					show: true,
					position: 'inside',// 在右边显示
                    color: 'white'
				},
				data:initData(this.data2,'博士')
			},
            {
				name: '中级专业技术人员',
				type: 'bar',
				stack: '总量',
				label: {
					show: true,
					position: 'inside',// 在右边显示
                    color: 'white'
				},
				data:initData(this.data2,'中级专业技术人员')
			},
            {
				name: '高级专业技术人员',
				type: 'bar',
				stack: '总量',
				label: {
					show: true,
					position: 'inside',// 在右边显示
                    color: 'white'
				},
				data:initData(this.data2,'高级专业技术人员')
			},
            {
				name: '其他人才',
				type: 'bar',
				stack: '总量',
				label: {
					show: true,
					position: 'inside',// 在右边显示
                    color: 'white'
				},
				data:initData(this.data2,'其他人才')
			},
			{
				name: '总人数',
				type: 'line',
				// label: {
				// 	show: true,
                //     fontSize: 15,
                //     color: 'white'
				// },
                yAxisIndex: 1,
				data:sumData(this.data2)
			}
		]
            });
            function initDataName(data){
		        var nameList = []
		        for (var i = 0; i < data.length; i++) {
			        nameList.push(data[i].年)
		        }
		        return nameList
	        }
            function initData(data,val){
		        var serie = [];
                for (var i = 0; i < data.length; i++) {
			        var num = 0
			        if(val == '中专'){
				        num = data[i].中专
			        }else if (val == '大专') {
				        num = data[i].大专
			        }else if (val == '本科') {
				        num = data[i].本科
			        }else if (val == '硕士') {
				        num = data[i].硕士
			        }else if (val == '博士') {
				        num = data[i].博士
			        }else if (val == '中级专业技术人员') {
				        num = data[i].中级专业技术人员
			        }else if (val == '高级专业技术人员') {
				        num = data[i].高级专业技术人员
			        }
                    else{
                        num = data[i].其他人才
                    }
                    serie.push(num);
                }
                return serie;
	        }
            function sumData(data) {
                var serie = [];
                for (var i = 0; i < data.length; i++) {
			        var total = (parseFloat(data[i].中专) + parseFloat(data[i].大专) + parseFloat(data[i].本科)
                    + parseFloat(data[i].硕士) + parseFloat(data[i].博士) + parseFloat(data[i].中级专业技术人员)
                    + parseFloat(data[i].高级专业技术人员 + parseFloat(data[i].其他人才))).toFixed(2);
                    serie.push(total);
                }
                return serie
            }
        },
    }
  }
  </script>