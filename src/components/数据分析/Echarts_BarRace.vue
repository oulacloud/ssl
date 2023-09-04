<template>
    <div id="main" style="width: 1200px;height: 600px;">
    </div>
</template>
<script>
import * as echarts from 'echarts'
import res0 from './Echarts_BarRace_res0.json'
import res1 from './Echarts_BarRace_res1.json'
export default {
    data() {
        return {
        }
    },
    mounted() {
        this.drawChart()
    },
    methods: {
        drawChart() {
            var myChart = echarts.init(document.getElementById('main'));
            var option
            const updateFrequency = 2000;
            const countryColors = {
                Australia: '#00008b',
                Canada: '#f00',
                China: '#ffde00',
                Cuba: '#002a8f',
                Finland: '#003580',
                France: '#ed2939',
                Germany: '#000',
                Iceland: '#003897',
                India: '#f93',
                Japan: '#bc002d',
                'North Korea': '#024fa2',
                'South Korea': '#000',
                'New Zealand': '#00247d',
                Norway: '#ef2b2d',
                Poland: '#dc143c',
                Russia: '#d52b1e',
                Turkey: '#e30a17',
                'United Kingdom': '#00247d',
                'United States': '#b22234'
            };
            const flags = res0;
            const data = res1;
            const years = [];
            for (let i = 0; i < data.length; ++i) {
                if (years.length === 0 || years[years.length - 1] !== data[i][4]) {
                    years.push(data[i][4]);
                }
            }
            function getFlag(countryName) {
                if (!countryName) {
                    return '';
                }
                return (
                    flags.find(function (item) {
                        return item.name === countryName;
                    }) || {}
                ).emoji;
            }
            let startIndex = 10;
            let startYear = years[startIndex];
            option = {
                grid: {
                    top: 10,
                    bottom: 30,
                    left: 150,
                    right: 80
                },
                xAxis: {
                    // 取数据在该轴上的最大值作为最大刻度。
                    // 不设置时会自动计算最大值保证坐标轴刻度的均匀分布。
                    max: 'dataMax',
                    axisLabel: {
                        formatter: function (n) {
                            return Math.round(n) + '';// 刻度取整
                        }
                    }
                },
                dataset: {
                    source: data.slice(1).filter(function (d) {
                        return d[4] === startYear; // data[4]=>year，返回年份为startYear的所有数据
                    })
                },
                yAxis: {
                    type: 'category',
                    inverse: true, // 反向坐标轴
                    max: 10, // 控制显示数量，前11名
                    axisLabel: {
                        show: true,
                        fontSize: 14,
                        formatter: function (value) {
                            return value + '{flag|' + getFlag(value) + '}';
                        },
                        // 富文本，同一系列中给指定文本添加样式
                        rich: {
                            flag: {
                                fontSize: 25,
                                padding: 5
                            }
                        }
                    },
                    animationDuration: 300,
                    animationDurationUpdate: 300
                },
                series: [
                    {
                        // 开启排序
                        realtimeSort: true,
                        // 取datase中的数据（行/列作为序列）
                        seriesLayoutBy: 'column',
                        type: 'bar',
                        itemStyle: {
                            // param=>item系列
                            color: function (param) {
                                return countryColors[param.value[3]] || '#5470c6';
                            }
                        },
                        // 0=>第一序列
                        encode: {
                            x: 0,
                            y: 3
                        },
                        label: {// 图形上的文本标签
                            show: true,
                            precision: 1, // 标签的精度，表示保留一位小数
                            position: 'right', // 标签的位置
                            valueAnimation: true, // 是否开启标签的数字动画
                            fontFamily: 'monospace' // 字体
                        }
                    }
                ],
                animationDuration: 0, // 初始动画时长
                animationDurationUpdate: updateFrequency, // 数据更新动画时长
                animationEasing: 'linear', // 初始动画缓动效果
                animationEasingUpdate: 'linear', // 数据更新动画缓动效果
                graphic: {
                    elements: [
                        {
                            type: 'text',
                            right: 160,
                            bottom: 60,
                            style: {
                                text: startYear,
                                font: 'bolder 80px monospace',
                                fill: 'rgba(100, 100, 100, 0.25)'
                            },
                            z: 100
                        }
                    ]
                }
            };
            // console.log(option);
            myChart.setOption(option);
            for (let i = startIndex; i < years.length - 1; ++i) {
                (function (i) {
                    setTimeout(function () {
                        updateYear(years[i + 1]);
                    }, (i - startIndex) * updateFrequency);
                })(i);
            }
            function updateYear(year) {
                let source = data.slice(1).filter(function (d) {
                    return d[4] === year;
                });
                option.series[0].data = source;
                option.graphic.elements[0].style.text = year;
                myChart.setOption(option);
            }
            myChart.setOption(option);
        },
    }
}
</script>