<template>
    <div class="Lbody">
        <div id="map" class="map"></div>
        <div class="block_top">
            <MyTitle :title=this.title :title_text_size=this.title_text_size :title_text_bold=this.title_text_bold
                :title_text_color=this.title_text_color :title_bg_color=this.title_bg_color></MyTitle>
            <div class="box_fex">
                <el-button type="primary" @click="test()">返回</el-button>
            </div>

        </div>
    </div>
</template>
<script>
import * as echarts from "echarts";
import { PROVINCE_NUM_ALLYEAR } from '../../../api/echarts'
import { CITY_NUM_ALLYEAR } from '../../../api/echarts'
import axios from "axios"
export default {
    data() {
        return {
            myChart: null,

            // 标题配置初始值
            title: '各省摇号登记人数占省外总量比重赋色图（%）',
            title_text_size: 24,
            title_text_bold_flag: true,
            title_text_bold: 'bold',
            title_text_color: 'rgba(0, 0, 0, 1)',
            title_bg_color: 'rgba(255, 255, 255, 1)',

            // 地图颜色list
            map_colors_list: [
                { value: '标准', colors: ['#0A602F', '#089330', '#78AB10', '#E2C802', '#ED950D', '#FC6712'] },
                { value: '明亮', colors: ['#4992ff', '#7cffb2', '#fddd60', '#58d9f9', '#05c091', '#ff8a45'] },
                { value: '粉青', colors: ["#fc97af", "#87f7cf", "#f7f494", "#72ccff", "#f7c5a0", "#d4a4eb"] },
                { value: '蓝绿', colors: ["#2ec7c9", "#b6a2de", "#5ab1ef", "#ffb980", "#d87a80", "#8d98b3"] },
                { value: '橘红', colors: ["#893448", "#d95850", "#eb8146", "#ffb248", "#f2d643", "#ebdba4"] },
                { value: '复古', colors: ["#e01f54", "#5e4ea5", "#f5e8c8", "#b8d2c7", "#c6b38e", "#a4d8c2"] },
            ],
            map_colors: null,
            current_value: null,

            // 地图
            replace_name: ['省', '自治区', '回族', '维吾尔', '澳门特别行政区', '香港特别行政区', '壮族'],
            line_name: ['北京市', '上海市', '天津市', '重庆市'],
            linesEndCoords: null,
            data_json: [],
            data_json_line: [],
            sum_num: 0,
            // 中心点坐标-起始点
            geoCoordMap: {},
            // data_json value数据
            data_value: {},

            // 当前地图可点击数据
            provincedata: [],
            // 历史点击路径,默认根路径=>全国
            historypath: [{ name: '全国', adcode: '100000', childrenNum: '35' }],
            // 地图请求url-code
            citycode: '100000',
            // childrenNum=0时(无子地图),为.json
            urllast: '_full.json'
        };
    },
    async mounted() {
        this.map_colors = this.map_colors_list[0].colors
        this.current_value = this.map_colors_list[0].value
        await this.get_datajson()
        this.getEchartMap()
    },
    methods: {
        // 获取接口数据
        async get_datajson() {
            let res = await PROVINCE_NUM_ALLYEAR();
            for (var i = 0; i < res.data.data.length; i++) {
                if (res.data.data[i].PROVINCE_NAME != '浙江省') {
                    this.sum_num = this.sum_num + res.data.data[i].NUM
                }
            }
            res.data.data.forEach((element) => {
                var list = {}
                list.name = element.PROVINCE_NAME
                list.value = element.NUM * 100 / this.sum_num
                list.postion = [[Number(element.LON)], [Number(element.LAT)]]
                this.data_json.push(list)
                this.geoCoordMap[element.PROVINCE_NAME] = [Number(element.LON), Number(element.LAT)]
                this.data_value[element.PROVINCE_NAME] = Number(element.NUM * 100 / this.sum_num)
            })
            this.linesEndCoords = {
                山西省: [this.geoCoordMap['山西省'][0], this.geoCoordMap['山西省'][1] + 8],
                陕西省: [this.geoCoordMap['陕西省'][0], this.geoCoordMap['陕西省'][1] + 16],
                宁夏回族自治区: [this.geoCoordMap['宁夏回族自治区'][0], this.geoCoordMap['宁夏回族自治区'][1] + 6],
                甘肃省: [this.geoCoordMap['甘肃省'][0], this.geoCoordMap['甘肃省'][1] + 16],
                河北省: [this.geoCoordMap['河北省'][0] + 12, this.geoCoordMap['河北省'][1]],
                山东省: [this.geoCoordMap['山东省'][0] + 20, this.geoCoordMap['山东省'][1]],
                河南省: [this.geoCoordMap['河南省'][0] + 14, this.geoCoordMap['河南省'][1]],
                安徽省: [this.geoCoordMap['安徽省'][0] + 20, this.geoCoordMap['安徽省'][1]],
                湖北省: [this.geoCoordMap['湖北省'][0] + 14, this.geoCoordMap['湖北省'][1]],
                江西省: [this.geoCoordMap['江西省'][0] + 22, this.geoCoordMap['江西省'][1]],
                福建省: [this.geoCoordMap['福建省'][0] + 9, this.geoCoordMap['福建省'][1]],
                海南省: [this.geoCoordMap['海南省'][0] + 9, this.geoCoordMap['海南省'][1]],
                云南省: [this.geoCoordMap['云南省'][0] - 10, this.geoCoordMap['云南省'][1]],
                广西壮族自治区: [this.geoCoordMap['广西壮族自治区'][0] - 30, this.geoCoordMap['广西壮族自治区'][1]],
                贵州省: [this.geoCoordMap['贵州省'][0], this.geoCoordMap['贵州省'][1] - 10],
                湖南省: [this.geoCoordMap['湖南省'][0], this.geoCoordMap['湖南省'][1] - 11],
                重庆市: [this.geoCoordMap['重庆市'][0], this.geoCoordMap['重庆市'][1] + 15],
                北京市: [this.geoCoordMap['北京市'][0], this.geoCoordMap['北京市'][1] + 10],
                上海市: [this.geoCoordMap['上海市'][0] + 10, this.geoCoordMap['上海市'][1]],
                天津市: [this.geoCoordMap['天津市'][0] + 10, this.geoCoordMap['天津市'][1]],
            }
            // let res_city = await CITY_NUM_ALLYEAR();
            // res_city.data.data.forEach(element => {
            //     var list = {}
            //     list.name = element.CITY_NAME
            //     list.value = element.NUM * 100 / this.sum_num
            //     this.data_json.push(list)
            // })
        },
        getEchartMap() {
            axios.get("/static/gaode_json/Ech_GeoJson.json")
                .then(res => {
                    // 此处将南沙群岛的边界过滤掉，或者也可以直接在geoJson中删除
                    res.data.features = res.data.features.filter(item => item.properties.adcode !== '100000_JD')
                    for (var i = 0; i < res.data.features.length; i++) {
                        if (res.data.features[i].properties.centroid) {
                            res.data.features[i].properties.cp = res.data.features[i].properties.centroid
                        }
                        else {
                            res.data.features[i].properties.cp = res.data.features[i].properties.center
                        }
                    }
                    echarts.registerMap("china", res.data)
                    // 画图时清空上次可点击数据
                    this.provincedata = []
                    // 保存当前地图可点击数据
                    for (var i = 0; i < res.data.features.length; i++) {
                        this.provincedata.push({
                            name: res.data.features[i].properties.name,
                            adcode: res.data.features[i].properties.adcode,
                            childrenNum: res.data.features[i].properties.childrenNum
                        })
                    }
                    if (this.myChart != null && this.myChart != "" && this.myChart != undefined) {
                        this.myChart.dispose();
                    }
                    this.myChart = echarts.init(document.getElementById("map"));
                    // this.ChartClick()
                    this.drawChart()
                })
        },
        ChartClick() {
            // 点击事件,点击会获取param.name为地市名称
            this.myChart.on('click', (param) => {
                // 循环在可点击数据中找到param.name对应的数据
                for (var i = 0; i < this.provincedata.length; i++) {
                    if (param.name == this.provincedata[i].name) {
                        // 首先赋值地图请求url-code和childrenNum=0时(无子地图),为.json
                        this.citycode = this.provincedata[i].adcode
                        if (this.provincedata[i].childrenNum == 0) {
                            this.urllast = '.json'
                        }
                        else {
                            this.urllast = '_full.json'
                        }
                        // 判断点击是否和历史路径最后一项相同
                        // 相同不添加
                        var len = this.historypath.length
                        if (this.provincedata[i].adcode == this.historypath[len - 1].adcode) {
                            break
                        }
                        else {
                            this.historypath.push({
                                name: this.provincedata[i].name,
                                adcode: this.provincedata[i].adcode,
                                childrenNum: this.provincedata[i].childrenNum
                            })
                        }
                        break
                    }
                }
                this.getEchartMap()
            })
        },
        drawChart() {
            var that = this
            let option = {
                animationDuration: 1000, // 设置动画持续时间为 1 秒
                animationEasing: 'cubicOut', // 设置动画缓动效果为 cubicOut
                backgroundColor: "transparent",
                // 工具栏
                toolbox: {
                    show: true,
                    // orient: 'vertical',
                    left: 'right',
                    feature: {
                        dataView: { readOnly: false },
                        restore: {},
                        saveAsImage: {}
                    }
                },
                // 文字提示框
                tooltip: {
                    trigger: "item",
                    backgroundColor: 'rgb(0,0,0,0.75)',
                    borderColor: 'rgb(255,255,255,1)',
                    textStyle: {
                        color: 'rgb(255,255,255)',
                        fontSize: 16,
                        padding: 20,
                        align: 'center'
                    },
                    formatter: function (params) {
                        if (params.value) {
                            var value = params.value.toFixed(2) + '%'
                        }
                        else {
                            var value = '无'
                        }
                        // 假设此轴的 type 为 'time'。
                        return params.name + '<br/>' + value;
                    },
                },
                geo: {
                    //使用 registerMap 注册的地图名称
                    map: "china",
                    //是否开启鼠标缩放和平移漫游
                    roam: true,
                    //当前视角缩放比例
                    zoom: 1,
                    //滚轮缩放的极限控制
                    scaleLimit: {
                        min: 1,
                        max: 6
                    },
                    //地图组件离容器的距离
                    top: 'center',
                    left: 'center',
                    // 文字显示
                    label: {
                        show: true,
                        draggable: true,
                        fontSize: 16,
                        formatter: function (params) {
                            that.replace_name.some(item => {
                                params.name = params.name.replace(item, '')
                            })
                            that.line_name.some(item => {
                                params.name = params.name.replace(item, '')
                            })
                            return params.name;
                        }
                    },
                    emphasis: {
                        // disabled: true,
                        label: {
                            show: true,
                        },
                        itemStyle: {
                            areaColor: 'rgba(190,231,233,1)',
                            borderWidth: 1,
                            borderColor: 'rgba(0,0,0,1)', // 地图线配色
                        }
                    },
                    // 加载地图时设置每个item样式
                    itemStyle: {
                        // 面颜色
                        areaColor: 'rgba(0,0,0,0.5)',
                        borderWidth: 1,
                        borderColor: 'rgba(0,0,0,1)', // 线颜色
                    },
                },
                // 图例
                visualMap: {
                    backgroundColor: 'rgba(255,255,255,1)',
                    textStyle: {
                        color: 'rgba(0,0,0,1)'
                    },
                    inRange: {
                        color: this.map_colors
                    },
                    // formatter: function (value) {
                    //     console.log(value)
                    //     return value + '%';
                    // },
                    pieces: [
                        { lte: 1, label: '<1%' },
                        { gt: 1, lte: 2, label: '1%-2%' },
                        { gt: 2, lte: 3, label: '2%-3%' },
                        { gt: 3, lte: 10, label: '3%-10%' },
                        { gt: 10, label: '>10%' }
                    ],
                },
                series: [
                    { // 含引导线的省份，用lines实现
                        type: 'lines',
                        symbol: 'circle',
                        symbolSize: [6, 4],
                        label: {
                            show: true,
                            fontSize: 16,
                            color: 'rgb(0,0,0,1)',
                            fontWeight: 'bold',
                            formatter: function (params) {
                                return params.name;
                            },
                        },
                        lineStyle: {
                            // type: 'dotted',
                            // shadowBlur: 3,
                            color: 'rgba(0,0,0,1)',
                            width: 1,
                        },
                        data: that.dataLines(),
                    },
                    // 相当于覆盖在geo上面
                    {
                        type: "map",
                        map: "china",
                        geoIndex: 0,
                        selectedMode: false,
                        aspectScale: 0.75, //长宽比
                        showLegendSymbol: true, // 存在legend时显示
                        // label: {
                        //     show: true,
                        //     draggable: true,
                        // },
                        // 拖拽画布
                        roam: true,
                        data: this.data_json,
                    },
                ]
            }
            this.myChart.setOption(option);
            window.addEventListener("resize", function () {
                this.myChart.resize();
            })
        },
        dataLines() {
            var res = [];
            this.line_name.forEach(name => {
                res.push({
                    name: name,
                    value: this.data_value[name],
                    coords: [this.geoCoordMap[name], this.linesEndCoords[name]],
                    visualMap: false, // 取消跟随visualMap颜色
                })
            })
            return res;
        },
        test() {
            var len = this.historypath.length
            if (len == 1) {
                this.getEchartMap()
            }
            else {
                this.citycode = this.historypath[len - 2].adcode
                this.urllast = '_full.json'
                this.historypath.splice(len - 1, 1)
                this.getEchartMap()
            }
        }
    }
};
</script>
<style>
.Lbody {
    width: 100%;
    height: 100%;
    position: relative
}

.map {
    width: 100%;
    height: 100%;
    z-index: 0;
    position: absolute
}

.block {
    z-index: 1;
    float: left;
    position: absolute
}

.box_fex {
    position: absolute;
    right: 0;
    z-index: 1;
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}
</style>