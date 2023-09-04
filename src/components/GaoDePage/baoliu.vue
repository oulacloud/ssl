<template>
    <div class="Lbody">
        <download-excel class="export-excel-wrapper" :data=this.list :fields="json_fields" :header="title"
            name="需要导出的表格名字.xls">
            <el-button type="success">导出</el-button>
        </download-excel>
        <div class="map" id="map"> </div>
    </div>
    <!-- <input type="file" @change="convertKMZToGeoJSON($event.target.files[0])"> -->
</template>
<script>
import * as kgUtil from 'kml-geojson'
import AMapLoader from '@amap/amap-jsapi-loader'
import axios from 'axios'
AMapLoader.reset()
export default {
    data() {
        return {
            json_fields: {
                "name": 'name',
                "value": 'value',
            },
            list: [],
            map: null,
            geojson: null,
        }
    },
    methods: {
        convertKMZToGeoJSON(file) {
            console.log(file)
            kgUtil.toGeoJSON(file).then((geojoson) => {
                console.log(geojoson)
            })
        },
        initEnter() {
            AMapLoader.load({
                key: "4091cbcc08c517102220173c5e585b88",              // 申请好的Web端开发者Key，首次调用 load 时必填
                version: "1.4.15",   // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
                plugin: ['AMap.Autocomplete', 'AMap.PlaceSearch', 'AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType', 'AMap.PolyEditor', 'AMap.CircleEditor', 'AMap.DistrictLayer'],
                AMapUI: {
                    // 是否加载 AMapUI，缺省不加载
                    version: '1.1', // AMapUI 缺省 1.1
                    plugin: [],
                },
                Loca: {
                    // 是否加载 Loca， 缺省不加载
                    version: '1.3.2' // Loca 版本，缺省 1.3.2
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
                showLabel: true, //显示地图文字标记
                // viewMode: "2D", //是否3d视角
                // pitch: 40 //俯仰角度，默认0，[0,83]，2D地图下无效 。（自V1.4.0开始支持）
            })
            this.get_geojson()
            let geojson = new AMap.GeoJSON({
                geoJSON: this.geojson,
            })
            geojson.setMap(this.map)
        },
        get_geojson() {
            var that = this
            $.ajax('/static/gaode_kml/分省.kml')
                .done(function (xml) {
                    kgUtil.toGeoJSON(xml)
                        .then((geojson) => {
                            that.geojson = geojson
                        })
                })
        },
    },
    mounted() {
        var res = {}
        res.name = pro_name
        res.value = centroid
        this.list.push(res)
        this.initEnter()
    },
}
</script>
<style lang="less">
@import url('./高德css/common_map_css.css');
</style>