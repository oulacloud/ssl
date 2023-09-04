<template>
    <div class="Lbody">
        <div class="map" id="map">
            <MyTitle :title=this.title></MyTitle>
            <MyLengend v-if=this.data_range :colorlist=this.data_colors :datalist=this.data_range :flag='1'></MyLengend>
        </div>
    </div>
</template>

<script>
import AMapLoader from '@amap/amap-jsapi-loader'
import { HZ_PLATE_RATE } from '../../../api/echarts'
import axios from 'axios'
AMapLoader.reset()
export default {
    data() {
        return {
            title: '2018-2023年各板块平均中签率',
            map: null,
            geojson_poly: null, // 面json
            geojson_line: null, // 线json
            infoWindow: null,
            map_text: [],
            // 省份数据
            data_plate: null,
            data_polygon: {},
            // 点标记
            icon: {
                type: 'image',
                image: 'https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png',
                size: [8, 20],
                anchor: 'bottom-center',
            },
            markers: [],
            data_range: [10, 20, 30, 40, 50],
            data_colors: ['#FF0000', '#FF00FF', '#FFAA00', '#FFFF00', '#00FFFF', '#92D050'],
            fill_Color_def: 'grey',
            fill_Opacity: 1,
            fillColor_list: {
                path: null,
                strokeColor: null,
                fillColor: null,
                fillOpacity: null,
                zIndex: 0
            },
            replace_name: ['省', '自治区', '回族', '维吾尔', '特别行政区', '壮族'],
            storke_Color: 'black',
            stroke_Opacity: 1,
            stroke_Weight: 2,
            strokeColor_list: {
                path: null,
                strokeColor: null,
                strokeOpacity: null, //线透明度
                strokeWeight: null, //线粗细度
                zindex: 1
            },
            text_style: {
                // 'padding': '.75rem 1.25rem',
                // 'margin-bottom': '1rem',
                'border': 'rgba(0,0,0,0)',
                'background-color': 'rgba(0,0,0,0)',
                'width': '100%',
                'white-space': 'normal',
                // 'border-width': 0,
                // 'box-shadow': '0 2px 6px 0 rgba(114, 124, 245, .5)',
                'text-align': 'center',
                'font-size': '16px',
                'color': '#000000',
            },
        }
    },
    methods: {
        initEnter() {
            AMapLoader.load({
                key: "4091cbcc08c517102220173c5e585b88",              // 申请好的Web端开发者Key，首次调用 load 时必填
                version: "2.0",   // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
                plugin: ['AMap.GeoJSON', 'AMap.Autocomplete', 'AMap.PlaceSearch', 'AMap.Scale', 'AMap.ToolBar', 'AMap.MapType', 'AMap.PolyEditor', 'AMap.CircleEditor', 'AMap.DistrictLayer'],
                // AMapUI: {
                //     // 是否加载 AMapUI，缺省不加载
                //     version: '1.1', // AMapUI 缺省 1.1
                //     plugin: [],
                // },
                // Loca: {
                //     // 是否加载 Loca， 缺省不加载
                //     version: '2.0.0' // Loca 版本，缺省 1.3.2
                // }
            }).then((AMap) => {
                //创建地图
                this.map = new AMap.Map("map", {
                    cursor: "default",
                    resizeEnable: true, //是否监控地图容器尺寸变化，默认值为false
                    expandZoomRange: true, //是否支持可以扩展最大缩放级别,和zooms属性配合使用设置为true的时候，zooms的最大级别在PC上可以扩大到20级，移动端还是高清19/非高清20
                    zooms: [8, 20], // 区间
                    zoom: 10,
                    center: [120.109913, 30.181466],
                    defaultCursor: "pointer", //变成小手 地图默认鼠标样式。参数defaultCursor应符合CSS的cursor属性规范
                    showLabel: false, //显示地图文字标记
                    // viewMode: "2D", //是否3d视角
                    // pitch: 40 //俯仰角度，默认0，[0,83]，2D地图下无效 。（自V1.4.0开始支持）
                })
                AMap.plugin(['AMap.MapType'], () => {
                    this.map.addControl(new AMap.MapType({
                        defaultType: 1 // 默认卫星地图
                    }))
                })
                AMap.plugin(['AMap.ToolBar'], () => {
                    this.map.addControl(new AMap.ToolBar())
                })
                this.infoWindow = new AMap.InfoWindow({ offset: new AMap.Pixel(0, -30) })
                this.get_geojson_line()
                this.get_geojson_polygon()
            })
        },
        async get_datajson() {
            // this.data_plate = await (await HZ_COMPANY_LOCATION()).data.data
            let res = await HZ_PLATE_RATE()
            this.data_plate = res.data.data
        },
        // 获取面数据
        get_geojson_polygon() {
            axios.get('/static/gaode_json/HzPlate_Pol_GD.json')
                .then(res => {
                    this.geojson_poly = res.data
                    this.set_geojson_polygon()
                })
        },
        // 加载面数据
        set_geojson_polygon() {
            this.fillColor_list.fillOpacity = this.fill_Opacity
            AMap.plugin(['AMap.GeoJSON'], () => {
                var that = this
                var geojson = new AMap.GeoJSON({
                    geoJSON: this.geojson_poly,
                    getPolygon: function (geojson, lnglats) {
                        const Pol = that.set_map_fillColor(geojson, lnglats)
                        return Pol
                    }
                })
                this.map.add(geojson)
            })
        },
        // 获取线数据
        get_geojson_line() {
            axios.get('/static/gaode_json/HzPlate_Line_GD.json')
                .then(res => {
                    this.geojson_line = res.data
                    this.set_geojson_line()
                })
        },
        // 加载线数据
        set_geojson_line() {
            this.strokeColor_list.strokeColor = this.storke_Color
            this.strokeColor_list.strokeOpacity = this.stroke_Opacity
            this.strokeColor_list.strokeWeight = this.stroke_Weight
            AMap.plugin(['AMap.GeoJSON'], () => {
                var that = this
                var geojson = new AMap.GeoJSON({
                    geoJSON: this.geojson_line,
                    getPolyline: function (geojson, lnglats) {
                        const Pol = that.set_map_strokeColor(geojson, lnglats)
                        return Pol // 一定要返回实例 不能删
                    }
                })
                this.map.add(geojson)
            })
        },
        // 填充面
        set_map_fillColor(geojson, lnglats) {
            var name = geojson.properties.name
            var value = 0
            this.data_plate.forEach(element => {
                if (name == element.NAME) {
                    value = element.RATE
                }
            })
            // 数据范围长度
            var data_range_len = this.data_range.length
            // 赋值该面边界信息
            this.fillColor_list.path = lnglats
            // 值为空，面颜色赋值为默认
            if (value == 0) {
                this.fillColor_list.fillColor = this.fill_Color_def
            }
            // 不为空，判断值所处的范围区间，返回相应颜色区间的颜色
            else {
                if (value >= this.data_range[data_range_len - 1]) {
                    this.fillColor_list.fillColor = this.data_colors[data_range_len]
                }
                else {
                    for (var i = 0; i < data_range_len; i++) {
                        if (value < this.data_range[i]) {
                            this.fillColor_list.fillColor = this.data_colors[i]
                            break
                        }
                    }
                }
            }
            var Pol = new AMap.Polygon(this.fillColor_list)
            return Pol
        },
        // 填充线
        set_map_strokeColor(geojson, lnglats) {
            this.strokeColor_list.path = lnglats
            var Pol = new AMap.Polyline(this.strokeColor_list)
            return Pol
        },
        // data_change() {
        //     var geojson = { "type": "FeatureCollection" };
        //     var features = []
        //     var feature = { "type": "Feature" }
        //     var geometry = { "type": "MultiLineString" }
        //     geometry.coordinates = this.dataasd
        //     feature.geometry = geometry
        //     features.push(feature)
        //     geojson.features = features
        //     var content = JSON.stringify({
        //         jiedao: geojson,
        //     })
        //     var blob = new Blob([content], {
        //         type: "text/plain;charset=utf-8"
        //     })
        //     saveAs(blob, "jiedao_8hou.json")
        // }
    },
    async mounted() {
        this.initEnter()
        await this.get_datajson()
    },
    destroyed() {
        this.map && this.map.destroy()
    },
}
</script>
<style lang="less">
@import url('../GaoDeCSS/common_map_css.css');
</style>