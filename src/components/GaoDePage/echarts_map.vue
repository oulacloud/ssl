<template>
    <div style="width:100%;height:100%;">
        <div id="echartMap" class="echartMap" style="width:100%;height:100%;border:3px solid gold">
            <el-button type="primary" style="z-index: 100;display: inline-flex;" @click="test()">返回</el-button>
        </div>

    </div>
</template>
<script>
import * as echarts from "echarts";
import axios from "axios"
var myChart
export default {
    data() {
        return {
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
    mounted() {
        this.getEchartMap()
    },
    methods: {
        getEchartMap() {

            axios.get("https://geo.datav.aliyun.com/areas_v3/bound/" + this.citycode + this.urllast)
                .then(res => {
                    echarts.registerMap("map", res.data)
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
                    if (myChart != null && myChart != "" && myChart != undefined) {
                        myChart.dispose();
                    }
                    myChart = echarts.init(document.getElementById("echartMap"));
                    // 点击事件,点击会获取param.name为地市名称
                    myChart.on('click', (param) => {
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
                    var data = [
                        { name: "北京市", value: 177 },
                        { name: "天津市", value: 42 },
                        { name: "河北省", value: 102 },
                        { name: "山西省", value: 81 },
                        { name: "内蒙古自治区", value: 47 },
                        { name: "辽宁省", value: 67 },
                        { name: "吉林省", value: 82 },
                        { name: "黑龙江省", value: 66 },
                        { name: "上海市", value: 24 },
                        { name: "江苏省", value: 92 },
                        { name: "浙江省", value: 114 },
                        { name: "安徽省", value: 109 },
                        { name: "福建省", value: 116 },
                        { name: "江西省", value: 91 },
                        { name: "山东省", value: 119 },
                        { name: "河南省", value: 137 },
                        { name: "湖北省", value: 116 },
                        { name: "湖南省", value: 114 },
                        { name: "重庆市", value: 91 },
                        { name: "四川省", value: 125 },
                        { name: "贵州省", value: 62 },
                        { name: "云南省", value: 83 },
                        { name: "西藏自治区", value: 9 },
                        { name: "陕西省", value: 80 },
                        { name: "甘肃省", value: 56 },
                        { name: "青海省", value: 10 },
                        { name: "宁夏回族自治区", value: 18 },
                        { name: "新疆维吾尔自治区", value: 67 },
                        { name: "广东省", value: 123 },
                        { name: "广西壮族自治区", value: 59 },
                        { name: "海南省", value: 14 }
                    ];
                    let option = {
                        animationDuration: 1000, // 设置动画持续时间为 1 秒
                        animationEasing: 'cubicOut', // 设置动画缓动效果为 cubicOut
                        backgroundColor: "transparent",
                        title: {
                            text: "",
                            left: "center",
                            textStyle: {
                                color: "black"
                            }
                        },
                        tooltip: {
                            trigger: "item",
                            formatter: "{b}<br/>{c} "
                        },
                        visualMap: {
                            min: 0,
                            max: 100,
                            text: ['High', 'Low'],
                            calculable: true,
                            seriesIndex: [0],//这个对应的是series的数组下标
                            inRange: {
                                color: ["#00467F", "#A5CC82"]
                            }
                        },
                        //series就是地图上的数据（去掉就没有数据了）
                        series: [
                            {
                                type: "map",
                                map: "map",
                                geoIndex: 0,
                                aspectScale: 0.75, //长宽比
                                showLegendSymbol: false, // 存在legend时显示
                                label: {
                                    show: true,
                                },
                                emphasis: {
                                    label: {
                                        show: true,
                                        color: "#fff"
                                    }
                                },
                                // 拖拽画布
                                roam: true,
                                data: data,
                            },
                        ]
                    };
                    myChart.setOption(option);
                    window.addEventListener("resize", function () {
                        myChart.resize();
                    });
                })
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
canvas {
    animation: fadeIn 2s
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