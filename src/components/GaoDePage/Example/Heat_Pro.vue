<template>
    <div class="Lbody">
        <div id="map" class="map">
            <MyTitle :title=this.title :title_text_size=this.title_text_size :title_text_bold=this.title_text_bold
                :title_text_color=this.title_text_color :title_bg_color=this.title_bg_color></MyTitle>
        </div>
    </div>
</template>
<script>
import AMapLoader from '@amap/amap-jsapi-loader'
import { PROVINCE_NUM_ALLYEAR } from '../../../api/echarts'
AMapLoader.reset()
export default {
    data() {
        return {
            title: '各省摇号登记人数热力图',
            map: null,
            loca: null,
            data_json: null,
            geojson: null,
            HeatMapLayer: null,
            pointColors: ['#42105F', '#56167D', '#6A1B9A', '#942D93', '#BE408C', '#E85285', '#EE7B91', '#F4A49E'],
            scatter: null,
            text: null,
            title_text_size: 24,
            title_text_bold_flag: true,
            title_text_bold: 'bold',
            title_text_color: 'rgba(0, 0, 0, 1)',
            title_bg_color: 'rgba(255, 255, 255, 1)',
        }
    },
    methods: {
        // 获取接口数据
        async get_datajson() {
            let res = await PROVINCE_NUM_ALLYEAR();
            this.data_json = res.data.data;
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
                    zoom: 5,
                    pitch: 45,
                    showLabel: false,
                    viewMode: '3D',
                    mapStyle: 'amap://styles/dark',
                })
                this.loca = new Loca.Container({
                    map: this.map,
                })
                this.set_options()
                this.set_map_style()
                this.loca.add(this.HeatMapLayer)
            })
        },
        set_options() {
            var GeoJSONSource = new Loca.GeoJSONSource({
                data: this.geojson
            })
            this.HeatMapLayer = new Loca.HeatMapLayer({
                // loca,
                zIndex: 10,
                opacity: 1,
                visible: true,
                zooms: [2, 22],
            })
            this.HeatMapLayer.setSource(GeoJSONSource)
        },
        set_map_style() {
            var that = this
            this.HeatMapLayer.setStyle({
                radius: 75,
                unit: 'px',
                height: 120,
                //radius: 35,
                //unit: 'px',
                //height: 100,
                gradient: {
                    0.1: '#2A85B8',
                    0.2: '#16B0A9',
                    0.3: '#29CF6F',
                    0.4: '#5CE182',
                    0.5: '#7DF675',
                    0.6: '#FFF100',
                    0.7: '#FAA53F',
                    1: '#D04343',
                },
                value: function (index, feature) {
                    var value = feature.properties.NUM
                    return Math.log10(value)
                },
                // min: -10000,
                // max: 5000,
                heightBezier: [0, .53, .37, .98],
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

.header {
    position: relative;
    width: 100%;
    height: 5%;
    min-width: 100px;
    min-height: 40px;
    // display: flex;
    // justify-content: space-between;
    /* 控制子元素在主轴方向上的对齐方式 */
    // align-items: center;
    /* 控制子元素在交叉轴方向上的对齐方式 */
}

.Lbody {
    width: 100%;
    height: 100%;
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