<template>
    <div class="Lbody">
        <div id="map" class="map">
            <div class="demo-title">
                <h1>连接线——中国各年代的建交国家</h1>
                <h3>通过连接线展示中国与各国建立外交关系历年的变化</h3>
            </div>
            <div class="time-container">
                <div class="item active">
                    <span data-year="50" data-info="50年代"></span>
                </div>
                <div class="item">
                    <span data-year="60" data-info="60年代"></span>
                </div>
                <div class="item">
                    <span data-year="70" data-info="70年代"></span>
                </div>
                <div class="item">
                    <span data-year="80" data-info="80年代"></span>
                </div>
                <div class="item">
                    <span data-year="90" data-info="90年代"></span>
                </div>
                <div class="item">
                    <span data-year="2000" data-info="2000年后"></span>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import AMapLoader from '@amap/amap-jsapi-loader'
import axios from 'axios'
AMapLoader.reset()
export default {
    data() {
        return {
            map: null,
            loca: null,
            labelLayer: null,
            linkLayer: null,
            scatterLayer1: null,
            scatterLayer2: null,
            scatterLayer3: null,
            centerPoint: null,
            lineGeoMap: null,
            scatterGeoMap: null,
        }
    },
    methods: {
        initEnter() {
            AMapLoader.load({
                key: "4091cbcc08c517102220173c5e585b88",
                version: "2.0",   // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
                plugin: ['AMap.Scale', 'AMap.ToolBar'],
                AMapUI: {
                    // 是否加载 AMapUI，缺省不加载
                    version: '1.1', // AMapUI 缺省 1.1
                    plugin: [],
                },
                Loca: {
                    // 是否加载 Loca， 缺省不加载
                    version: '2.0.0' // Loca 版本，缺省 1.3.2
                }
            }).then((AMap) => {
                this.initMap(AMap)
            })
        },
        initMap(AMap) {
            this.map = new AMap.Map('map', {
                zoom: 3.2,
                pitch: 32,
                showLabel: false,
                viewMode: '3D',
                center: [59.890102, 29.256014],
                mapStyle: 'amap://styles/dark',
            })
            this.loca = new Loca.Container({
                map: this.map,
            })
            this.set_options()
            this.set_map_style()
            this.set_map_source()
        },
        set_options() {
            // 文字图层
            this.labelLayer = new AMap.LabelsLayer({
                // 禁止掩膜
                rejectMapMask: true,
                // 开启标注避让
                collision: true,
                // 开启标注淡入动画
                animation: true,
            })
            this.map.add(this.labelLayer)
            this.linkLayer = new Loca.LinkLayer({
                zIndex: 20,
                opacity: 1,
                visible: true,
                zooms: [2, 22],
            })
            this.scatterLayer1 = new Loca.ScatterLayer({
                zIndex: 10,
                opacity: 1,
                visible: true,
                zooms: [2, 22],
            })
            this.scatterLayer2 = new Loca.ScatterLayer({
                zIndex: 10,
                opacity: 0.8,
                visible: true,
                zooms: [2, 22],
            })
            this.scatterLayer3 = new Loca.ScatterLayer({
                zIndex: 10,
                opacity: 0.8,
                visible: true,
                zooms: [2, 22],
            })
            this.centerPoint = new Loca.GeoJSONSource({
                data: {
                    'type': 'FeatureCollection',
                    'features': [
                        {
                            'type': 'Feature',
                            'geometry': {
                                'type': 'Point',
                                'coordinates': [116.39, 39.9],
                            },
                        },
                    ],
                },
            })
            this.scatterLayer3.setSource(this.centerPoint)
        },
        set_map_style() {
            this.scatterLayer3.setStyle({
                size: [300000, 300000],
                unit: 'meter',
                texture: 'https://a.amap.com/Loca/static/static/center-point.png',
            })
            this.loca.add(this.scatterLayer3)
        },
        set_map_source() {
            // 将指定年代数据转为geojson，type 0 1点的样式
            var filterGeoJSON_point = (json, type) => {
                var newJSON = {
                    type: 'FeatureCollection',
                    features: [...json.features.filter((item) => item.properties.type === type)],
                }
                return new Loca.GeoJSONSource({
                    data: newJSON,
                })
            }
            var filterGeoJSON_line = (json) => {
                var newJSON = {
                    type: 'FeatureCollection',
                    features: [...json.features],
                }
                return new Loca.GeoJSONSource({
                    data: newJSON,
                })
            }
            var setLabelsLayer = (data) => {
                this.labelLayer.clear()
                data.features.forEach((item) => {
                    var labelsMarker = new AMap.LabelMarker({
                        name: item.properties.flagName,
                        position: item.geometry.coordinates,
                        zooms: [2, 22],
                        opacity: 1,
                        zIndex: 10,
                        text: {
                            content: item.properties.country,
                            direction: 'bottom',
                            offset: [0, -5],
                            style: {
                                fontSize: 13,
                                fontWeight: 'normal',
                                fillColor: '#fff',
                            },
                        },
                    })
                    this.labelLayer.add(labelsMarker);
                })
                this.labelLayer.add(
                    new AMap.LabelMarker({
                        name: 'china',
                        position: [116.39, 39.9],
                        zooms: [2, 22],
                        opacity: 1,
                        zIndex: 10,
                        rank: 100,
                        text: {
                            content: '中国',
                            direction: 'bottom',
                            offset: [0, -5],
                            style: {
                                fontSize: 13,
                                fontWeight: 'normal',
                                fillColor: '#fff',
                            },
                        },
                    }),
                )
            }
            // 点数据
            axios('https://a.amap.com/Loca/static/static/diplomacy-point.json')
                .then((res) => {
                    this.scatterGeoMap = res.data
                    setLabelsLayer(this.scatterGeoMap[50])
                    var source1 = filterGeoJSON_point(this.scatterGeoMap[50], 0)
                    var source2 = filterGeoJSON_point(this.scatterGeoMap[50], 1)
                    this.scatterLayer1.setSource(source1)
                    this.scatterLayer2.setSource(source2)
                    // 蓝点
                    this.scatterLayer1.setStyle({
                        size: [500000, 500000],
                        unit: 'miter',
                        animate: true,
                        duration: 1000,
                        texture: 'https://a.amap.com/Loca/static/static/green.png',
                    })
                    // 红点
                    this.scatterLayer2.setStyle({
                        size: [500000, 500000],
                        unit: 'miter',
                        animate: true,
                        duration: 1000,
                        texture: 'https://a.amap.com/Loca/static/static/orange.png',
                    })
                    this.loca.add(this.scatterLayer1)
                    this.loca.add(this.scatterLayer2)
                    this.loca.animate.start()
                })
            // 线数据
            axios('https://a.amap.com/Loca/static/static/diplomacy-line.json')
                .then((res) => {
                    this.lineGeoMap = res.data
                    this.linkLayer.setSource(filterGeoJSON_line(this.lineGeoMap[50]))
                    this.linkLayer.setStyle({
                        lineColors: function (index, item) {
                            return item.link.properties.type === 0 ? ['#25CDEA', '#12BFBF'] : ['#FFD87B', '#FF4F00']
                        },
                        height: function (index, item) {
                            return item.distance / 3;
                        },
                        smoothSteps: function (index, item) {
                            return 200
                        },
                    })
                    this.loca.add(this.linkLayer)
                })
            var items = document.querySelectorAll('.item')
            var that = this
            for (var i = 0; i < items.length; i++) {
                (function (j) {
                    items[j].onclick = () => {
                        var element = items[j]
                        var key = element.children[0].dataset.year;
                        document.querySelector('div.item.active').classList.remove('active')
                        element.classList.add('active')
                        that.linkLayer.setSource(filterGeoJSON_line(that.lineGeoMap[key]))
                        setLabelsLayer(that.scatterGeoMap[key])
                        that.scatterLayer1.setSource(filterGeoJSON_point(that.scatterGeoMap[key], 0))
                        that.scatterLayer2.setSource(filterGeoJSON_point(that.scatterGeoMap[key], 1))
                    }
                })(i)
            }
        }
    },
    mounted() {
        this.initEnter()
    },
    // vue不能自动销毁实例对象，页面关闭时强制销毁，所有new的实例
    destroyed() {
        this.map && this.map.destroy()
        this.loca && this.loca.destroy()
        this.labelLayer && this.labelLayer.destroy()
        this.linkLayer && this.linkLayer.destroy()
        this.scatterLayer1 && this.scatterLayer1.destroy()
        this.scatterLayer2 && this.scatterLayer2.destroy()
        this.scatterLayer3 && this.scatterLayer3.destroy()
        this.centerPoint && this.centerPoint.destroy()
        this.scatterGeoMap && this.scatterGeoMap.destroy()
    },
}
</script>
<style  lang="less">
.Lbody {
    width: 100%;
    height: 100%;
}

.map {
    width: 100%;
    height: 100%;
}

.demo-title {
    position: absolute;
    top: 25px;
    left: 25px;
    z-index: 1;
}

h1 {
    font-size: 18px;
    margin: 0;
    color: rgb(180, 180, 190);
}

h3 {
    font-size: 12px;
    font-weight: normal;
    margin-top: 5px;
    color: rgb(150, 150, 150);
}

.time-container {
    z-index: 1;
    display: flex;
    justify-content: space-around;
    align-items: center;
    width: 80vw;
    height: 100px;
    max-width: 800px;
    position: absolute;
    bottom: 30px;
    left: 50%;
    transform: translateX(-50%);
    background-color: rgba(38, 38, 38, 0.4);
}

.item {
    width: 20px;
    height: 20px;
    background-color: #12bfbf;
    position: relative;
    border-radius: 50%;
}

.item:hover {
    cursor: pointer;
}

.item::before,
.item::after {
    content: '';
    display: block;
    position: absolute;
    z-index: -1;
    top: 50%;
    transform: translateY(-50%);
    background-color: #12bfbf;
    width: 13.3333333333vw;
    height: 2px;
    max-width: 133.3333333333px;
}

.item::before {
    left: calc(-13.3333333333vw + 10px);
}

.item::after {
    right: calc(-13.3333333333vw + 10px);
}

.item:first-child::before {
    width: 0;
}

.item:last-child::after {
    width: 0;
}

.item.active {
    background-color: #12bfbf;
}

.item.active span {
    background-color: #12bfbf;
    font-weight: 700;
}

.item.active span::before {
    font-size: 15px;
}

.item.active span::after {
    font-size: 15px;
}

.item span {
    width: 14px;
    height: 14px;
    color: #ffffff;
    background-color: #ffffff;
    border-radius: 50%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

.item span::after {
    visibility: visible;
    position: absolute;
    left: 50%;
    content: attr(data-info);
    top: 25px;
    transform: translateX(-50%);
    font-size: 14px;
    width: 70px;
    text-align: center;
}

@media (min-width: 1000px) {
    .item::before {
        left: -123.3333333333px;
    }

    .item::after {
        right: -123.3333333333px;
    }
}

@media (max-width: 850px) {
    .item {
        width: 10px;
        height: 10px;
    }

    .item::before,
    .item::after {
        height: 3px;
    }

    .item::before {
        left: calc(-13.3333333333vw + 5px);
    }

    .item::after {
        right: calc(-13.3333333333vw + 5px);
    }
}

@media (max-width: 600px) {
    .flex-parent {
        justify-content: initial;
    }

    .time-container {
        flex-wrap: wrap;
        justify-content: center;
        width: 100%;
        height: auto;
        margin-top: 15vh;
    }

    .item {
        width: 60px;
        height: 60px;
        margin: 0 10px 50px;
    }

    .item::before,
    .item::after {
        content: none;
    }

    .item span {
        width: 100%;
        height: 100%;
        display: block;
    }

    .item span::after {
        top: 50%;
        transform: translate(-50%, -50%);
        color: #12bfbf;
    }

    .item.active span::after {
        color: #fff;
    }
}
</style>