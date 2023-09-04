<template>
    <div id="map" class="map">
        <MyTitle :title=this.title></MyTitle>
        <MyLengend :colorlist=this.colors :datalist=this.data_range :flag=this.flag></MyLengend>
    </div>
</template>
<script>
import AMapLoader from '@amap/amap-jsapi-loader'
import { HZ_COMPANY_LOCATION } from '../../api/echarts'
import axios from 'axios'
AMapLoader.reset()
export default {
    data() {
        return {
            flag: 0,
            title: '杭州总部',
            map: null,
            loca: null,
            geojson: null,
            HexagonLayer: null,
            PolygonLayer: null,
            LineLayer: null,
            colors: ['#0A602F', '#089330', '#78AB10', '#E2C802', '#ED950D', '#FC6712'],
            heights: [1000, 4000, 7000, 10000, 13000, 16000, 19000, 21000, 24000],
            data_range: [1, 5, 10, 15, 20],
            lengend: null,
            data_json: null,
            GeoJSONSource: null,
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
            let res = await HZ_COMPANY_LOCATION();
            this.data_json = res.data.data;
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
                    zoom: 10,
                    pitch: 55,
                    rotation: 20,
                    showLabel: false,
                    viewMode: '3D',
                    mapStyle: 'amap://styles/dark',
                })
                this.loca = new Loca.Container({
                    map: this.map,
                })
                this.get_polygon()
                // this.set_hex_options()
                // this.set_hex_style()
                // this.set_hex_leng()

            })
        },
        // 加载loca面数据
        get_polygon() {
            const cancelToken = axios.CancelToken;
            const source = cancelToken.source();
            axios.get('/static/gaode_json/HzPlate_Pol_GD.json')
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
                var value = 0
                for (var j = 0; j < this.data_json.length; j++) {
                    var point = [this.data_json[j].SCL_GAODE_LON, this.data_json[j].SCL_GAODE_LAT];
                    var isPointInRing = AMap.GeometryUtil.isPointInRing(point, this.geojson_poly.features[i].geometry.coordinates[0][0]);
                    if (isPointInRing) {
                        value++;
                    }
                }
                this.geojson_poly.features[i].properties.value = value
            }
            for (var i = 0; i < this.geojson_poly.features.length; i++) {
                var value = this.geojson_poly.features[i].properties.value
                if (value >= this.data_range[data_range_len - 1]) {
                    this.geojson_poly.features[i].properties.color = this.colors[data_range_len]
                    this.geojson_poly.features[i].properties.height = this.heights[data_range_len]
                }
                else {
                    for (var k = 0; k < data_range_len; k++) {
                        if (value < this.data_range[k]) {
                            this.geojson_poly.features[i].properties.color = this.colors[k]
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
                // loca: this.loca,
                // visible: true,
                opacity: 0.8,
                zIndex: 1,
                shininess: 10,
                hasSide: true,
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
                sideTopColor: function (index, feature) {
                    return feature.properties.color
                },
                sideBottomColor: function (index, feature) {
                    return feature.properties.color
                },
                height: function (index, feature) {
                    return feature.properties.height
                },
            })
            this.loca.add(this.PolygonLayer)
            this.set_info_window()
        },
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
                var feat = this.PolygonLayer.queryFeature(e.pixel.toArray());
                if (feat) {
                    var data = feat.properties
                    var content = `<div ">${data.name}</div><div>总部数量：${data.value}</div>`
                    text.setText(content);
                    text.setPosition(e.lnglat);
                }
                else {
                    text.hide()
                }
            })
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