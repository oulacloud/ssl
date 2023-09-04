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
            threshold: null,
            geojson: null,
            ContourLayer: null,
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
            for(var i=0;i<this.data_json.length;i++){
                if(this.data_json[i].PROVINCE_NAME == '浙江省'){
                    this.data_json.splice(i, 1)
                    break
                }
            }
            var max = this.data_json[0].NUM;
            this.data_json.forEach((item, index) => {
                if (item.NUM > max) {
                    max = item.NUM;
                }
            })
            this.threshold = max / 20
            console.log(this.threshold)
            // console.log(this.data_json)
            // this.json_geojson()
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
                version: "1.4.15",   // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
                plugin: ['AMap.Scale', 'AMap.ToolBar'],
                // AMapUI: {
                //     // 是否加载 AMapUI，缺省不加载
                //     version: '1.1', // AMapUI 缺省 1.1
                //     plugin: [],
                // },
                Loca: {
                    // 是否加载 Loca， 缺省不加载
                    version: '1.3.2' // Loca 版本，缺省 1.3.2
                }
            }).then((AMap) => {
                this.map = new AMap.Map('map', {
                    features: ['bg', 'road'],
                    mapStyle: 'amap://styles/dark',
                    zoom: 9.3,
                    pitch: 56,
                    viewMode: '3D'
                })
                // this.set_options()
                // this.set_map_style()
                // this.ContourLayer.render();
            })
        },
        set_options() {
            this.ContourLayer = new Loca.ContourLayer({
                // shape: {string}, 等高线类型 'isoband'为等高面, 'isoline'为等高线, 必填
                shape: 'isoband',
                map: this.map
            })
            this.ContourLayer.setData(this.data_json, {
                // lnglat: {string}, 数据中经纬度坐标所在的列名称, 必填
                lnglat: 'LON_LAT',
                // value: {string}, 数据中权重数据所在的列名称, 必填
                value: 'NUM'
            })
        },
        set_map_style() {
            this.ContourLayer.setOptions({
                // interpolation: 数据插值设置项，可缺省
                interpolation: {
                    // step: {number}, 用于数据插值的步长，可缺省，缺省值为 500
                    // step 不宜过小，过小的 step 可能会导致绘制性能严重下降
                    step: 10000,
                    // effectRadius: {number}, 每一个原始值在插值过程中影响的范围，可缺省，缺省值为 1000
                    // effectRadius / step 的值不宜过大，建议在 20 以内，可以获得良好的性能效果
                    effectRadius: 10000,
                },
                threshold: this.threshold, // 等高线拆分步长，及按照用户提供的数据每隔 threshold 大小来绘制一条等高线
                // 可缺省，缺省值为 1
                threshold: 3,
                // smoothNumber: {number}, 等高线平滑次数，可缺省，缺省值为 2
                smoothNumber: 3,
                // style: 等高线绘制样式，可缺省
                style: {
                    // height: {number}, 3D 等高线最大高度, 可缺省，缺省值为 5 * 1E4
                    height: 5 * 1E4,
                    // color: {Array}, 绘制等高线使用的颜色序列, 可缺省，缺省值为 ["#3656CD", "#655FE7", '#20C2E1', '#23D561', '#9CD523', '#F1E229', '#FFBF3A', '#FB8C00', '#FF5252', "#BC54E2", "#FF6FCE"]
                    color: ["rgba(7,49,117,0.5)", "rgba(4,71,138,0.5)", "rgba(0,109,176,0.5)", "rgba(6,152,196,0.5)", "rgba(65,182,196,0.5)", "rgba(127,205,187,0.2)", "rgba(199,233,180,0.2)"]
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