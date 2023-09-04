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
import { SPECIALIZED_AND_NEW } from '../../../api/echarts'
AMapLoader.reset()
export default {
    data() {
        return {
            // 标题配置初始值
            title: '第1-5批专精特新小巨人企业分布',
            title_text_size: 24,
            title_text_bold_flag: true,
            title_text_bold: 'bold',
            title_text_color: 'rgba(0, 0, 0, 1)',
            title_bg_color: 'rgba(255, 255, 255, 1)',

            map: null,
            loca: null,
            point: null,
            geojson: null,
            data_json: null,
            data_geojson: null,
        }
    },
    methods: {
        // 获取接口数据
        async get_datajson() {
            let res = await SPECIALIZED_AND_NEW();
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
                geometry.coordinates = [this.data_json[i].SNC_COMPANY_LON, this.data_json[i].SNC_COMPANY_LAT]
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
                Loca: {
                    // 是否加载 Loca， 缺省不加载
                    version: '2.0.0' // Loca 版本，缺省 1.3.2
                }
            }).then((AMap) => {
                this.map = new AMap.Map('map', {
                    zoom: 4.8,
                    showLabel: true,
                    viewMode: '3D',
                    center: [105.601, 35.32],
                    mapStyle: 'amap://styles/dark',
                })
                // 异步加载插件
                AMap.plugin(['AMap.Scale', 'AMap.ToolBar'], () => {
                    var tool = new AMap.ToolBar();
                    tool.addTo(this.map);
                })
                // 核心控制器
                this.loca = new Loca.Container({
                    map: this.map,
                    opacity: 1,
                })
                this.set_options()
                this.set_pon_style()
                this.set_pon_ani()
                this.loca.add(this.point)
            })
        },
        set_options() {
            // 圆点图层
            this.point = new Loca.PointLayer({
                zIndex: 10,
                blend: 'lighter',
            })
            // geo数据
            var GeoJSONSource = new Loca.GeoJSONSource({
                data: this.geojson
            })
            this.point.setSource(GeoJSONSource)
        },
        // 圆点样式
        set_pon_style() {
            this.point.setStyle({
                radius: 3,
                unit: 'px',
                color: '#3C1FA8',
                borderWidth: 0,
                blurWidth: 2,
            })
        },
        // 图例
        set_map_leng() {
            var lengend = new Loca.Legend({
                loca: this.loca,
                title: {
                    label: '人均GDP',
                    fontColor: 'rgba(255,255,255,0.4)',
                    fontSize: '16px',
                },
                style: {
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    left: '20px',
                    bottom: '40px',
                    fontSize: '12px',
                },
                dataMap: [
                    { label: '> 8万', color: this.color_sel[7] },
                    { label: '< 7万', color: this.color_sel[6] },
                    { label: '< 6万', color: this.color_sel[5] },
                    { label: '< 5万', color: this.color_sel[4] },
                    { label: '< 4万', color: this.color_sel[3] },
                    { label: '< 3万', color: this.color_sel[2] },
                    { label: '< 2万', color: this.color_sel[1] },
                    { label: '< 1万', color: this.color_sel[0] },
                ],
            })
        },
        // 动画
        set_pon_ani() {
            this.point.addAnimate({
                key: 'radius',
                value: [0, 1],
                duration: 500,
                easing: 'Linear',
                transform: 2000,
                random: true,
                delay: 8000,
                yoyo: true,
                repeat: 100000
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