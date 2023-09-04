<template>
    <div class="Lbody">
        <div class="map" id="map">
            <MyTitle :title=this.title></MyTitle>
            <MyLengend :colorlist=this.data_colors :datalist=this.data_range></MyLengend>
            <!-- <div style="position: fixed;z-index: 1;margin-top: 20px;margin-left: 20px;">
                <el-tooltip effect="dark" content="设置" placement="top">
                    <el-popover placement="bottom">
                        <el-button slot="reference" type="primary" icon="el-icon-setting"></el-button>
                    </el-popover>
                </el-tooltip>
            </div> -->
        </div>
    </div>
</template>
<script>
import AMapLoader from '@amap/amap-jsapi-loader'
import { HZ_DIS_NUM } from '../../../api/echarts'
import axios from 'axios'
AMapLoader.reset()
export default {
    data() {
        return {
            title: '省内区县市摇号登记人数赋色图',
            flag: 1,
            map: null,
            geojson_poly: null,
            geojson_line: null,
            map_text: [],
            // 省份数据
            data_json: null,
            data_range: [0.5, 1, 2, 5],
            data_colors: ['#FF0000', '#FF00FF', '#FFAA00', '#FFFF00', '#00FFFF'].reverse(),
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
            stroke_Weight: 1,
            strokeColor_list: {
                path: null,
                fillColor: '',
                fillOpacity: '',
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
                    zoom: 4.5,
                    defaultCursor: "pointer",
                    showLabel: false, //显示地图文字标记
                    // viewMode: "2D", //是否3d视角
                    // pitch: 40 //俯仰角度，默认0，[0,83]，2D地图下无效 。（自V1.4.0开始支持）
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
                this.map.setFitView()
            });
        },
        async get_datajson() {
            let res = await HZ_DIS_NUM();
            this.data_json = res.data.data;
            for (var i = 0; i < this.data_json.length; i++) {
                this.sum_num = this.sum_num + this.data_json[i].NUM;
            }
        },
        // 获取面数据
        get_geojson_polygon() {
            const cancelToken = axios.CancelToken;
            const source = cancelToken.source();
            axios.get('/static/gaode_json/HZ_Dis_Pol_GD.json', {
                cancelToken: source.token
            })
                .then(res => {
                    this.geojson_poly = res.data;
                    console.log(this.geojson_poly)
                    this.set_geojson_line();
                    this.set_geojson_polygon();
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
                if (this.flag == 1) {
                    this.map.setFitView();
                    this.flag = 0;
                }
                this.map.add(this.map_text)
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
                    geoJSON: this.geojson_poly,
                    getPolygon: function (geojson, lnglats) {
                        that.strokeColor_list.path = lnglats;
                        //将解析出来的面 进行绘制
                        return new AMap.Polygon(that.strokeColor_list);
                    }
                });
                this.map.add(geojson);
            });
        },
        // 填充面
        set_map_fillColor(geojson, lnglats) {
            // 当前绘制面name
            var city_name = geojson.properties.parent_name;
            var dis_name = geojson.properties.name
            // 数据范围长度
            var data_range_len = this.data_range.length;
            // 赋值该面边界信息
            this.fillColor_list.path = lnglats;
            // 保存值
            var value = 0;
            // 从接口数据中返回与当前绘制面name相同的对应的值
            for (var i = 0; i < this.data_json.length; i++) {
                if (this.data_json[i].CITY == city_name && this.data_json[i].DIS == dis_name) {
                    value = this.data_json[i].NUM * 100 / this.sum_num;
                }
            }
            // 值为空，面颜色赋值为默认
            if (value == 0) {
                this.fillColor_list.fillColor = this.fill_Color_def;
            }
            // else if (geojson.properties.parent.adcode == '浙江省') {
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
            // 面中心点坐标
            var centroid = null;
            // centroid更中心一点，部分面没有
            if (geojson.properties.centroid == undefined) {
                centroid = geojson.properties.center;
            }
            // 没有使用center
            else {
                centroid = geojson.properties.centroid;
            }
            var text = new AMap.Text({
                text: [dis_name, value.toFixed(2) + '%'].join('\n'),
                anchor: 'center',
                draggable: true,
                cursor: 'pointer',
                // angle: 10, // 倾斜角度
                style: this.text_style,
                position: centroid
            });
            this.map_text.push(text);
            // 规范值
            // if (value != '无') {
            //     value = (value * 100).toFixed(2) + '%'
            // }
            var Pol = new AMap.Polygon(this.fillColor_list);
            return Pol;
        },
    },
    async mounted() {
        // this.saveAs()
        this.initEnter();
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