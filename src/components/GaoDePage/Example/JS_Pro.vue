<template>
    <div class="Lbody">
        <div class="map" id="map">
            <MyTitle :title=this.title></MyTitle>
            <MyLengend :colorlist=this.data_colors :datalist=this.data_range :flag=this.flag></MyLengend>
        </div>
    </div>
</template>
<script>
import AMapLoader from '@amap/amap-jsapi-loader'
import { PROVINCE_NUM_ALLYEAR } from '../../../api/echarts'
import axios from 'axios'

AMapLoader.reset()
export default {
    data() {
        return {
            flag: 1,
            title: '各省摇号登记人数占省外总量比重赋色图（%）',
            map: null,
            geojson_poly: null,
            geojson_line: null,
            map_text: [],
            // 省份数据
            data_province: null,
            data_range: [1, 2, 3, 10],
            data_colors: ['#0A602F', '#089330', '#78AB10', '#E2C802', '#ED950D', '#FC6712'],
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
            stroke_Opacity: 0.5,
            stroke_Weight: 2,
            strokeColor_list: {
                path: null,
                strokeColor: null,
                strokeOpacity: null,
                strokeWeight: null,
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
            sum_num: 0,
            icon: {
                type: 'image',
                image: 'https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png',
                size: [8, 20],
                anchor: 'bottom-center',
            },
        };
    },
    methods: {
        initEnter() {
            AMapLoader.load({
                key: "4091cbcc08c517102220173c5e585b88",
                version: "2.0",
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
                    resizeEnable: true,
                    expandZoomRange: true,
                    zooms: [3, 20],
                    zoom: 4,
                    defaultCursor: "pointer",
                    showLabel: false, //显示地图文字标记
                });
                AMap.plugin(['AMap.MapType'], () => {
                    this.map.addControl(new AMap.MapType({
                        defaultType: 1 // 默认卫星地图
                    }));
                });
                AMap.plugin(['AMap.ToolBar'], () => {
                    this.map.addControl(new AMap.ToolBar());
                });
                this.get_geojson_polygon();
                this.get_geojson_line();
                this.set_map_text()
                this.map.setFitView()
            });
        },
        async get_datajson() {
            let res = await PROVINCE_NUM_ALLYEAR();
            this.data_province = res.data.data;
            for (var i = 0; i < this.data_province.length; i++) {
                if (this.data_province[i].PROVINCE_NAME != '浙江省') {
                    this.sum_num = this.sum_num + this.data_province[i].NUM;
                }
            }
            this.initEnter()
        },
        set_map_text() {
            for (var i = 0; i < this.data_province.length; i++) {
                var pro_name = this.data_province[i].PROVINCE_NAME;
                // 简化name
                this.replace_name.some(item => {
                    pro_name = pro_name.replace(item, '');
                });
                var value = this.data_province[i].NUM * 100 / this.sum_num;
                var text = new AMap.Text({
                    // text: pro_name + (value*100),
                    text: [pro_name, value.toFixed(2) + '%'].join('\n'),
                    anchor: 'center',
                    draggable: true,
                    cursor: 'pointer',
                    // angle: 10, // 倾斜角度
                    style: this.text_style,
                    position: [this.data_province[i].LON,this.data_province[i].LAT]
                });
                this.map_text.push(text);
            }
            this.map.add(this.map_text);
        },
        // 获取面数据
        get_geojson_polygon() {
            axios.get('/static/gaode_json/Pro_Pol_GD.json')
                .then(res => {
                    this.geojson_poly = res.data;
                    this.set_geojson_polygon();
                });
        },
        // 加载面数据
        set_geojson_polygon() {
            this.fillColor_list.fillOpacity = this.fill_Opacity;
            AMap.plugin(['AMap.GeoJSON'], () => {
                var that = this;
                var geojson = new AMap.GeoJSON({
                    geoJSON: this.geojson_poly,
                    getPolygon: function (geojson, lnglats) {
                        const Pol = that.set_map_fillColor(geojson, lnglats);
                        return Pol;
                    }
                });
                this.map.add(geojson);
            });
        },
        // 获取线数据
        get_geojson_line() {
            axios.get('/static/gaode_json/Pro_Line.geojson')
                .then(res => {
                    this.geojson_line = res.data;
                    this.set_geojson_line();
                });
        },
        // 加载线数据
        set_geojson_line() {
            this.strokeColor_list.strokeColor = this.storke_Color;
            this.strokeColor_list.strokeOpacity = this.stroke_Opacity;
            this.strokeColor_list.strokeWeight = this.stroke_Weight;
            AMap.plugin(['AMap.GeoJSON'], () => {
                var that = this;
                var geojson = new AMap.GeoJSON({
                    geoJSON: this.geojson_line,
                    getPolyline: function (geojson, lnglats) {
                        const Pol = that.set_map_strokeColor(geojson, lnglats);
                        return Pol; // 一定要返回实例 不能删
                    }
                });
                this.map.add(geojson);
            });
        },
        // 填充面
        set_map_fillColor(geojson, lnglats) {
            // 当前绘制面name
            var pro_name = geojson.properties.name;
            // 数据范围长度
            var data_range_len = this.data_range.length;
            // 赋值该面边界信息
            this.fillColor_list.path = lnglats;
            // 保存值
            var value = 0;
            // 从接口数据中返回与当前绘制面name相同的对应的值
            for (var i = 0; i < this.data_province.length; i++) {
                if (this.data_province[i].PROVINCE_NAME == pro_name) {
                    value = this.data_province[i].NUM * 100 / this.sum_num;
                }
            }
            // 值为空，面颜色赋值为默认
            if (value == 0) {
                this.fillColor_list.fillColor = this.fill_Color_def;
            }
            // else if (pro_name == '浙江省') {
            //     this.fillColor_list.fillColor = null
            // }
            // 不为空，判断值所处的范围区间，返回相应颜色区间的颜色
            else {
                if (value >= this.data_range[data_range_len - 1]) {
                    this.fillColor_list.fillColor = this.data_colors[data_range_len];
                }
                else {
                    for (var i = 0; i < data_range_len; i++) {
                        if (value < this.data_range[i]) {
                            this.fillColor_list.fillColor = this.data_colors[i];
                            break;
                        }
                    }
                }
            }
            var Pol = new AMap.Polygon(this.fillColor_list);
            return Pol;
        },
        // 填充线
        set_map_strokeColor(geojson, lnglats) {
            this.strokeColor_list.path = lnglats;
            var Pol = new AMap.Polyline(this.strokeColor_list);
            return Pol;
        }
    },
    async mounted() {
        await this.get_datajson();
    },
    beforeDestroy() {
        this.map && this.map.destroy();
    },
}
</script>
<style lang="less">
@import url('../GaoDeCSS/common_map_css.css');
</style>