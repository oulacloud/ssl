<template>
    <div class="Lbody">
        <input type="file" @change="convertKMZToGeoJSON($event.target.files[0])">
        <div class="map" id="map"> </div>
    </div>
</template>
<script>
import * as kgUtil from 'kml-geojson'
import AMapLoader from '@amap/amap-jsapi-loader'
import axios from 'axios'
AMapLoader.reset()
export default {
    data() {
        return {
            map: null,
            json: "12",
            geojson: null,
        }
    },
    methods: {
        getYhDataByPro() {
            axios.get("http://sslapi.nadibao.cn/api/HzYaoHaoData/GetSecondHouse")
                .then(res => {
                    // for (var i = 0; i < res.data.data.length; i++) {
                    //     this.data_province.push({
                    //         province: res.data.data[i].CODE_NAME,
                    //         value: res.data.data[i].NUM
                    //     })
                    // }
                })
        },
        convertKMZToGeoJSON(file) {
            kgUtil.toGeoJSON(file).then((kg_geojson) => {
                AMap.plugin(['AMap.GeoJSON'], () => {
                    let geojson = new AMap.GeoJSON({
                        geoJSON: kg_geojson,
                    })
                    this.map.add(geojson)
                })
            })
        },
        initEnter() {
            AMapLoader.load({
                key: "4091cbcc08c517102220173c5e585b88",              // 申请好的Web端开发者Key，首次调用 load 时必填
                version: "2.0",   // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
                plugin: ['AMap.GeoJSON', 'AMap.Autocomplete', 'AMap.PlaceSearch', 'AMap.Scale', 'AMap.ToolBar', 'AMap.MapType', 'AMap.PolyEditor', 'AMap.CircleEditor', 'AMap.DistrictLayer'],
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
                }, 3000)
            })
        },
        //初始化地图
        initMap(AMap) {
            //创建地图
            this.map = new AMap.Map("map", {
                cursor: "default",
                resizeEnable: true, //是否监控地图容器尺寸变化，默认值为false
                expandZoomRange: true, //是否支持可以扩展最大缩放级别,和zooms属性配合使用设置为true的时候，zooms的最大级别在PC上可以扩大到20级，移动端还是高清19/非高清20
                zooms: [3, 20], // 区间
                zoom: 8,
                defaultCursor: "pointer", //变成小手 地图默认鼠标样式。参数defaultCursor应符合CSS的cursor属性规范
                showLabel: false, //显示地图文字标记
                // viewMode: "2D", //是否3d视角
                // pitch: 40 //俯仰角度，默认0，[0,83]，2D地图下无效 。（自V1.4.0开始支持）
            })
            // this.get_geojson()
            AMap.plugin(['AMap.MapType'], () => {
                this.map.addControl(new AMap.MapType({
                    defaultType: 1 // 默认卫星地图
                }))
            })
            AMap.plugin(['AMap.ToolBar'], () => {
                this.map.addControl(new AMap.ToolBar())
            })
        },
        get_geojson() {
            var that = this
            $.ajax('/static/gaode_kml/100000_full.kml')
                .done(function (xml) {
                    that.kgUtil_toGeoJSON(xml)
                })
        },
        kgUtil_toGeoJSON(xml) {
            kgUtil.toGeoJSON(xml)
                .then((kg_geojson) => {
                    this.geojson = kg_geojson
                    this.set_map_style()
                })
        },
        set_map_style() {
            AMap.plugin(['AMap.GeoJSON'], () => {
                let geojson = new AMap.GeoJSON({
                    geoJSON: this.geojson,
                    getPolygon: function (geojson, lnglats) {
                        return new AMap.Polygon({
                            path: lnglats,
                            fillOpacity: 1,
                            strokeColor: "rgba(190, 161, 58, 1)",
                            strokeWeight: 1,
                            fillColor: "rgba(151 ,255 ,255,.2)",
                        })
                    }
                })
                this.map.add(geojson)
            })
        },
    },
    mounted() {
        this.initEnter()
    },

}
</script>
<style lang="less">
@import url('./GaoDeCSS/common_map_css.css');
</style>