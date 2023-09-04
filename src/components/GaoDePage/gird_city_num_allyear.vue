<template>
    <div id="map" class="map">
        <MyTitle :title=this.title></MyTitle>
        <MyLengend :colorlist=this.colors :datalist=this.data_range></MyLengend>
    </div>
</template>
<script>
import AMapLoader from '@amap/amap-jsapi-loader'
import { CITY_NUM_ALLYEAR } from '../../api/echarts'

AMapLoader.reset()
export default {
    data() {
        return {
            title: '各市摇号登记人数占省外总量比重赋色图（%）',
            map: null,
            loca: null,
            geojson: null,
            HexagonLayer: null,
            PolygonLayer: null,
            LineLayer: null,
            colors: ['#00FFFF', '#FFFF00', '#DC971A', '#FF00FF', '#FF0000'],
            heights: [20, 60, 100, 150, 210, 280],
            lengend: null,
            data_json: null,
            GeoJSONSource: null,
            data_range: [0.1, 0.5, 1, 3],
            sum_num: 0,
            step_all: 8000000,
            max_height: 2000000,
            text_style: {
                fontSize: 15,
                fillColor: 'white', // 文字颜色
                // strokeColor: 'rgba(255,0,0,0.5)',
                // strokeWidth: 2,
                // padding: [3, 10],
                // backgroundColor: 'yellow',
                // borderColor: '#ccc',
                // borderWidth: 3,
            },
            geojson_poly: null,
            geojson_line: null,
            storke_Color: 'rgba(0,0,0,0.5)',
            storke_Width: 1,
        }
    },
    methods: {
        // 获取接口数据
        async get_datajson() {
            let res = await CITY_NUM_ALLYEAR();
            this.data_json = res.data.data;
            for (var i = 0; i < this.data_json.length; i++) {
                if (this.data_json[i].PROVINCE_NAME != '浙江省') {
                    this.sum_num = this.sum_num + this.data_json[i].NUM;
                }
            }
            this.json_geojson()
        },
        // 数据转换
        json_geojson() {
            this.geojson = { "type": "FeatureCollection" };
            var features = []
            for (var i = 0; i < this.data_json.length; i++) {
                if (this.data_json[i].PROVINCE_NAME != '浙江省') {
                    var feature = { "type": "Feature" }
                    feature.properties = this.data_json[i]
                    var geometry = { "type": "Point" }
                    geometry.coordinates = [this.data_json[i].LON, this.data_json[i].LAT]
                    feature.geometry = geometry
                    features.push(feature)
                }
            }
            this.geojson.features = features
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
                this.map = new AMap.Map('map', {
                    zoom: 4.5,
                    pitch: 55,
                    rotation: 20,
                    showLabel: false,
                    viewMode: '3D',
                    mapStyle: 'amap://styles/dark',
                })
                this.loca = new Loca.Container({
                    map: this.map,
                })
                this.set_hex_options()
                this.set_hex_style()
                this.set_info_window()
                // this.set_hex_leng()
                this.loca.add(this.HexagonLayer)
            })
        },
        // 柱配置
        set_hex_options() {
            var GeoJSONSource = new Loca.GeoJSONSource({
                data: this.geojson
            })
            this.HexagonLayer = new Loca.HexagonLayer({
                zIndex: 3,
                opacity: 1,
                visible: true,
                zooms: [3, 22],
            })
            this.HexagonLayer.setSource(GeoJSONSource)
        },
        // 配置样式
        set_hex_style() {
            var that = this
            this.HexagonLayer.setStyle({
                unit: 'meter',
                radius: 30000,
                gap: 0,
                altitude: 0,
                height: function (index, feature) {
                    var height = that.set_hex_height(feature)
                    return height * 10000
                },
                topColor: function (index, feature) {
                    var color = that.set_hex_color(feature)
                    return color
                },
                sideBottomColor: function (index, feature) {
                    var color = that.set_hex_color(feature)
                    return color
                },
                sideTopColor: function (index, feature) {
                    var color = that.set_hex_color(feature)
                    return color
                },
                // label: {
                //     text: function (index, feature) {
                //         var text = that.set_hex_text(feature)
                //         return text
                //     }
                // },
            })
        },
        // 高度
        set_hex_height(feature) {
            var height = 0
            var data_range_len = this.data_range.length;
            var value = feature.coordinates[0].properties.NUM * 100 / this.sum_num
            if (feature.coordinates[0].properties.PROVINCE_NAME == '浙江省') {
                height = this.max_height
            }
            else {
                if (value == 0) {
                    height = 0
                }
                else {
                    if (value >= this.data_range[data_range_len - 1]) {
                        height = this.heights[data_range_len];
                        // height = step * value
                    }
                    else {
                        for (var i = 0; i < data_range_len; i++) {
                            if (value < this.data_range[i]) {
                                height = this.heights[i]
                                break;
                            }
                        }
                    }
                }
            }
            return height
        },
        // 颜色
        set_hex_color(feature) {
            var color = ''
            var data_range_len = this.data_range.length;
            var value = feature.coordinates[0].properties.NUM * 100 / this.sum_num
            if (feature.coordinates[0].properties.PROVINCE_NAME == '浙江省') {
                color = this.colors[data_range_len]
            }
            else {
                if (value >= this.data_range[data_range_len - 1]) {
                    color = this.colors[data_range_len]
                }
                else {
                    for (var i = 0; i < data_range_len; i++) {
                        if (value < this.data_range[i]) {
                            color = this.colors[i]
                            break;
                        }
                    }
                }
            }
            return color
        },
        // infowindow
        set_info_window() {
            var text = new AMap.Text({
                text: '纯文本标记',
                anchor: 'center', // 设置文本标记锚点
                draggable: true,
                cursor: 'pointer',
                angle: 0,
                visible: false,
                offset: [0, -25],
                style: {
                    'padding': '5px 10px',
                    'margin-bottom': '1rem',
                    'border-radius': '.25rem',
                    'background-color': 'rgba(0,0,0,0.5)',
                    // 'width': '12rem',
                    'border-width': 0,
                    'box-shadow': '0 2px 6px 0 rgba(255, 255, 255, .3)',
                    'text-align': 'center',
                    'font-size': '16px',
                    'color': '#fff',
                },
            });
            text.setMap(this.map);
            this.map.on('mousemove', (e) => {
                text.show()
                var feat = this.HexagonLayer.queryFeature(e.pixel.toArray());
                if (feat) {
                    var data = feat.coordinates[0].properties
                    var content = `<div ">${data.CITY_NAME}</div><div>人数：${data.NUM}</div>`
                    text.setText(content);
                    text.setPosition(e.lnglat);
                }
                else {
                    text.hide()
                }
            })
        },
        // 文本
        set_hex_text(feature) {
            var pro_name = feature.coordinates[0].properties.CITY_NAME
            var value = feature.coordinates[0].properties.NUM
            var text = {
                content: [pro_name + ':', value + '人'].join('\n'),
                style: this.text_style
            }
            return text
        },
        // 图例
        set_hex_leng() {
            var dataList = []
            for (var i = 0; i <= this.data_range.length; i++) {
                var feature = {}
                if (i == 0) {
                    feature.label = '<' + this.data_range[i] + '%'
                    feature.color = this.colors[i]
                }
                else if (i == this.data_range.length) {
                    feature.label = '>' + this.data_range[i - 1] + '%'
                    feature.color = this.colors[i]
                }
                else {
                    feature.label = this.data_range[i - 1] + '%' + '-' + this.data_range[i] + '%'
                    feature.color = this.colors[i]
                }
                dataList.push(feature)
            }
            // 高度升起动画
            // this.map.on('complete', function () {
            //     setTimeout(function () {
            //         this.HexagonLayer.show(500)
            //         this.HexagonLayer.addAnimate({
            //             key: 'height',
            //             value: [0, 1],
            //             duration: 500,
            //             easing: 'Linear',
            //             transform: 500,
            //             random: true,
            //             delay: 10000,
            //         })
            //     }, 800)
            // })
            // this.loca.animate.start()

            // 图例
            // this.lengend = new Loca.Legend({
            //     loca: this.loca,
            //     title: {
            //         label: '人数占比',
            //         fontColor: 'rgba(255,255,255,0.4)',
            //         fontSize: '16px'
            //     },
            //     style: {
            //         backgroundColor: 'rgba(255,255,255,0.1)',
            //         left: '20px',
            //         bottom: '40px',
            //         fontSize: '12px'
            //     },
            //     dataMap: dataList,
            // })
        },
    },
    async mounted() {
        await this.get_datajson()
        this.initEnter()
    },
    // vue不能自动销毁实例对象，页面关闭时强制销毁，所有new的实例
    destroyed() {
        this.map && this.map.destroy()
        this.loca && this.loca.destroy()
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