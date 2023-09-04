<template>
    <div id="map" class="map">
        <MyTitle :title=this.title :title_text_size=this.title_text_size :title_text_bold=this.title_text_bold
            :title_text_color=this.title_text_color :title_bg_color=this.title_bg_color></MyTitle>
        <MyLengend v-if="len_show" :leng_font_size="leng_font_size" :leng_text_color="leng_text_color"
            :leng_bg_color="leng_bg_color" :colorlist=this.map_colors :datalist=this.data_range></MyLengend>
    </div>
</template>
<script>
import AMapLoader from '@amap/amap-jsapi-loader'
import { INPROVINCE_CITY_NUM } from '../../../api/echarts'
import axios from 'axios'
AMapLoader.reset()
export default {
    data() {
        return {
            // 标题配置初始值
            title: '省内各市摇号登记人数比重赋色图（%）',
            title_text_size: 24,
            title_text_bold_flag: true,
            title_text_bold: 'bold',
            title_text_color: 'rgba(0, 0, 0, 1)',
            title_bg_color: 'rgba(255, 255, 255, 1)',

            // 图例配置初始值
            len_show: true,
            leng_font_size: 20,
            leng_text_color: 'rgba(0, 0, 0, 1)',
            leng_bg_color: 'rgba(255, 255, 255, 0.6)',

            map: null,
            loca: null,
            geojson: null,
            HexagonLayer: null,
            PolygonLayer: null,
            LineLayer: null,
            map_colors: ['#FFFF00', '#DC971A', '#FF00FF', '#FF0000'],
            heights: [100, 200, 300, 900, 1000, 1200, 1500, 3000, 5000],
            lengend: null,
            data_json: null,
            GeoJSONSource: null,
            data_range: [5, 10, 20],
            sum_num: 0,
            step_all: 3000000,
            max_height: 300000,
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
            let res = await INPROVINCE_CITY_NUM();
            this.data_json = res.data.data;
            for (var i = 0; i < this.data_json.length; i++) {
                this.sum_num = this.sum_num + this.data_json[i].NUM;
            }
            this.json_geojson()
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
                    zoom: 7.5,
                    center: [120.109913, 29.181466],
                    pitch: 20,
                    rotation: 10,
                    showLabel: false,
                    viewMode: '3D',
                    mapStyle: 'amap://styles/dark',
                })
                this.loca = new Loca.Container({
                    map: this.map,
                })
                this.get_polygon()
                this.get_line()
                this.set_hex_options()
                this.set_hex_style()
                this.loca.add(this.HexagonLayer)
            })
        },
        // 加载loca面数据
        get_polygon() {
            const cancelToken = axios.CancelToken;
            const source = cancelToken.source();
            axios.get('/static/gaode_json/HZ_City_Pol_GD.json')
                .then(res => {
                    this.geojson_poly = res.data;
                    this.set_polygon();
                })
                .catch(error => {
                    // 捕获错误，判断是否为取消请求导致的错误
                    if (axios.isCancel(error)) {
                        console.log('请求已被取消:', error.message);
                    }
                    else {
                        console.log('请求发生错误:', error.message);
                    }
                })
                .finally(() => {
                    // 请求完成后关闭连接
                    source.cancel();
                });
        },
        // 加载面
        set_polygon() {
            var data_range_len = this.data_range.length
            for (var i = 0; i < this.geojson_poly.features.length; i++) {
                for (var j = 0; j < this.data_json.length; j++) {
                    if (this.geojson_poly.features[i].properties.name == this.data_json[j].CITY_NAME) {
                        var value = this.data_json[j].NUM * 100 / this.sum_num
                        this.geojson_poly.features[i].properties.value = value
                    }
                }
            }
            for (var i = 0; i < this.geojson_poly.features.length; i++) {
                var value = this.geojson_poly.features[i].properties.value
                if (value >= this.data_range[data_range_len - 1]) {
                    this.geojson_poly.features[i].properties.color = this.map_colors[data_range_len]
                    this.geojson_poly.features[i].properties.height = this.heights[data_range_len]
                }
                else {
                    for (var k = 0; k < data_range_len; k++) {
                        if (value < this.data_range[k]) {
                            this.geojson_poly.features[i].properties.color = this.map_colors[k]
                            this.geojson_poly.features[i].properties.height = this.heights[k]
                            break;
                        }
                    }
                }
            }
            var GeoJSONSource = new Loca.GeoJSONSource({
                data: this.geojson_poly
            })
            this.PolygonLayer = new Loca.PolygonLayer({
                loca: this.loca,
                visible: true,
                zIndex: 1,
            })
            this.PolygonLayer.setSource(GeoJSONSource)
            this.set_poly_options()
        },
        // 面配置
        set_poly_options() {
            this.PolygonLayer.setStyle({
                topColor: function (index, feature) {
                    return feature.properties.color
                },
            })
        },
        // 加载loca线数据
        get_line() {
            const cancelToken = axios.CancelToken;
            const source = cancelToken.source();
            axios.get('/static/gaode_json/HZ_City_Line_GD.json')
                .then(res => {
                    this.geojson_line = res.data;
                    this.set_line();
                })
                .catch(error => {
                    // 捕获错误，判断是否为取消请求导致的错误
                    if (axios.isCancel(error)) {
                        console.log('请求已被取消:', error.message);
                    }
                    else {
                        console.log('请求发生错误:', error.message);
                    }
                })
                .finally(() => {
                    // 请求完成后关闭连接
                    source.cancel();
                });
        },
        // 加载线
        set_line() {
            var GeoJSONSource = new Loca.GeoJSONSource({
                data: this.geojson_line
            })
            this.LineLayer = new Loca.LineLayer({
                loca: this.loca,
                zIndex: 2,
            })
            this.LineLayer.setSource(GeoJSONSource)
            this.set_line_options()
        },
        // 线配置
        set_line_options() {
            this.LineLayer.setStyle({
                color: this.storke_Color,
                lineWidth: this.storke_Width,
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
                radius: 8000,
                gap: 0,
                altitude: 0,
                height: function (index, feature) {
                    var height = that.set_hex_height(feature)
                    return height
                },
                topColor: function (index, feature) {
                    // var color = that.set_hex_color(feature)
                    return '#0070C0'
                },
                sideBottomColor: function (index, feature) {
                    // var color = that.set_hex_color(feature)
                    return '#0070C0'
                },
                sideTopColor: function (index, feature) {
                    // var color = that.set_hex_color(feature)
                    return '#0070C0'
                },
                label: {
                    text: function (index, feature) {
                        var text = that.set_hex_text(feature)
                        return text
                    }
                },
            })
        },
        // 高度
        set_hex_height(feature) {
            var height = 0
            var step = this.step_all / this.sum_num
            var value = feature.coordinates[0].properties.NUM
            height = step * value >= this.max_height ? this.max_height : step * value;
            return height
        },
        // 颜色
        set_hex_color(feature) {
            var color = ''
            var data_range_len = this.data_range.length;
            var value = feature.coordinates[0].properties.NUM * 100 / this.sum_num
            if (feature.coordinates[0].properties.PROVINCE_NAME == '浙江省') {
                color = this.map_colors[data_range_len + 1]
            }
            else {
                if (value >= this.data_range[data_range_len - 1]) {
                    color = this.map_colors[data_range_len]
                }
                else {
                    for (var i = 0; i < data_range_len; i++) {
                        if (value < this.data_range[i]) {
                            color = this.map_colors[i]
                            break;
                        }
                    }
                }
            }
            return color
        },
        // 文本
        set_hex_text(feature) {
            var city_name = feature.coordinates[0].properties.CITY_NAME
            var value = feature.coordinates[0].properties.NUM
            var text = {
                content: [city_name + ':', value + '人'].join('\n'),
                style: this.text_style
            }
            return text
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