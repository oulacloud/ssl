<template>
    <div id="map" class="map">
        <MyTitle :title=this.title></MyTitle>
        <MyLengend :colorlist=this.colors :datalist=this.range :flag="0"></MyLengend>
    </div>
</template>
<script>
import AMapLoader from '@amap/amap-jsapi-loader'
import axios from 'axios'
AMapLoader.reset()
export default {
    data() {
        return {
            title: '杭州市二手房均价',
            map: null,
            loca: null,
            geojson: null,
            HexagonLayer: null,
            colors: ['#96CA8D', '#FFFF00', '#DC971A', '#FF00FF' , '#00FFFF', '#FF0000'],
            heights: [200, 500, 800, 1100, 1400, 1700, 2000, 2300, 2600, 2900],
            lengend: null,
            data_json: null,
            GeoJSONSource: null,
            range: [20000, 30000, 40000, 50000, 60000]
        }
    },
    methods: {
        // 获取接口数据
        get_datajson() {
            axios.get("http://sslapi.nadibao.cn/api/HzYaoHaoData/GetSecondHouse")
                .then(res => {
                    this.data_json = res.data.data
                    this.json_geojson()
                })
        },
        // 数据转换
        json_geojson() {
            this.geojson = { "type": "FeatureCollection" };
            var features = []
            for (var i = 0; i < this.data_json.length; i++) {
                var feature = { "type": "Feature" }
                feature.properties = this.data_json[i]
                var geometry = { "type": "Point" }
                geometry.coordinates = [this.data_json[i].LON, this.data_json[i].LAT]
                feature.geometry = geometry
                features.push(feature)
            }
            this.geojson.features = features
            this.data_json = null
        },
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
                setTimeout(() => {
                    this.initMap(AMap)
                }, 300)
            })
        },
        initMap(AMap) {
            this.map = new AMap.Map('map', {
                zoom: 11.43,
                center: [120.2446746826172, 30.199146446037616],
                pitch: 55,
                rotation: 20,
                showLabel: false,
                viewMode: '3D',
                mapStyle: 'amap://styles/dark',
            })
            this.loca = new Loca.Container({
                map: this.map,
            })
            this.set_options()
            this.set_hex_style()
            this.loca.add(this.HexagonLayer)
        },
        set_options() {
            var GeoJSONSource = new Loca.GeoJSONSource({
                // url: 'https://a.amap.com/Loca/static/loca-v2/demos/mock_data/hz_road_level.json',
                data: this.geojson
            })
            this.HexagonLayer = new Loca.HexagonLayer({
                zIndex: 10,
                opacity: 1,
                visible: true,
                zooms: [2, 22],
            })
            this.HexagonLayer.setSource(GeoJSONSource)
        },
        set_hex_style() {
            var that = this
            this.HexagonLayer.setStyle({
                unit: 'meter',
                radius: 100,
                gap: 0,
                altitude: 0,
                height: function (index, feature) {
                    var ranks = feature.coordinates[0].properties.PRICE
                    var length = that.range.length
                    if (ranks == null) {
                        ranks = 0
                    }
                    if (ranks >= that.range[length - 1]) {
                        return that.heights[length]
                    }
                    else {
                        for (var i = 0; i < length; i++) {
                            if (ranks < that.range[i]) {
                                return that.heights[i]
                            }
                        }
                    }
                },
                topColor: function (index, feature) {
                    var ranks = feature.coordinates[0].properties.PRICE
                    var length = that.range.length
                    if (ranks == null) {
                        return that.colors[0]
                    }
                    if (ranks >= that.range[length - 1]) {
                        return that.colors[length]
                    }
                    else {
                        for (var i = 0; i < length; i++) {
                            if (ranks < that.range[i]) {
                                return that.colors[i]
                            }
                        }
                    }
                },
                sideBottomColor: function (index, feature) {
                    var ranks = feature.coordinates[0].properties.PRICE
                    var length = that.range.length
                    if (ranks == null) {
                        return that.colors[0]
                    }
                    if (ranks >= that.range[length - 1]) {
                        return that.colors[length]
                    }
                    else {
                        for (var i = 0; i < length; i++) {
                            if (ranks < that.range[i]) {
                                return that.colors[i]
                            }
                        }
                    }
                },
                sideTopColor: function (index, feature) {
                    var ranks = feature.coordinates[0].properties.PRICE
                    var length = that.range.length
                    if (ranks == null) {
                        return that.colors[0]
                    }
                    if (ranks >= that.range[length - 1]) {
                        return that.colors[length]
                    }
                    else {
                        for (var i = 0; i < length; i++) {
                            if (ranks < that.range[i]) {
                                return that.colors[i]
                            }
                        }
                    }
                },
                // label: {
                //     text: {
                //         content: (index, feature) => feature.coordinates[0].properties.NAME
                //     }
                // },
            })

        },
    },
    mounted() {
        this.get_datajson()
        this.initEnter()
    },
    // vue不能自动销毁实例对象，页面关闭时强制销毁，所有new的实例
    destroyed() {
        this.map && this.map.destroy()
        this.loca && this.loca.destroy()
        this.HexagonLayer && this.HexagonLayer.destroy()
        this.GeoJSONSource && this.GeoJSONSource.destroy()
    },
}
</script>
<style lang="less">
.map {
    width: 100%;
    height: 100%;
}

.demo-title {
    position: absolute;
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
</style>