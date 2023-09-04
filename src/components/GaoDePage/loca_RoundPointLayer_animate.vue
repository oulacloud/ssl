<template>
    <div class="Lbody">
        <div id="map" class="map">
            <div class="demo-title">
                <h1>圆点</h1>
                <h3>大量密集点</h3>
            </div>
        </div>
    </div>
</template>
<script>
import AMapLoader from '@amap/amap-jsapi-loader'
AMapLoader.reset()
export default {
    data() {
        return {
            map: null,
            loca: null,
            scatter: null,
            red_scatter: null,
            yel_scatter: null,
            geojson: null,
            red_geojson: null,
            yel_geojson: null,
            data_json: null,
            data_geojson: null,
        }
    },
    methods: {
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
                this.initMap(AMap)
            })
        },
        initMap(AMap) {
            this.map = new AMap.Map('map', {
                zoom: 11.7,
                center: [113.97199630737305, 22.5807295363949],
                pitch: 40, // 倾斜角度
                showLabel: false,
                mapStyle: 'amap://styles/dark',
                viewMode: '2D',
            })
            this.loca = new Loca.Container({
                map: this.map,
            })
            this.set_options()
            // 启动渲染动画
            this.set_scatter_style()
            this.loca.animate.start()
        },
        set_options() {
            // 普通点
            this.geojson = new Loca.GeoJSONSource({
                url: 'https://a.amap.com/Loca/static/loca-v2/demos/mock_data/sz_road.json',
            })
            this.scatter = new Loca.ScatterLayer({
                zIndex: 111,
                opacity: 1,
                visible: true,
                zooms: [2, 22],
            })
            this.scatter.setSource(this.geojson)
            // 红色呼吸点
            this.red_geojson = new Loca.GeoJSONSource({
                // data: [],
                url: 'https://a.amap.com/Loca/static/loca-v2/demos/mock_data/sz_road_F.json',
            })
            this.red_scatter = new Loca.ScatterLayer({
                loca: this.loca,
                zIndex: 113,
                opacity: 1,
                visible: true,
                zooms: [2, 22],
            })
            this.red_scatter.setSource(this.red_geojson)
            // 黄色呼吸点
            this.yel_geojson = new Loca.GeoJSONSource({
                // data: [],
                url: 'https://a.amap.com/Loca/static/loca-v2/demos/mock_data/sz_road_E.json',
            })
            this.yel_scatter = new Loca.ScatterLayer({
                loca: this.loca,
                zIndex: 112,
                opacity: 1,
                visible: true,
                zooms: [2, 22],
            })
            this.yel_scatter.setSource(this.yel_geojson)
            this.loca.add(this.scatter)
        },
        set_scatter_style() {
            this.scatter.setStyle({
                color: 'rgba(43,156,75,1)',
                unit: 'meter',
                size: [150, 150],
                borderWidth: 0,
            })
            this.red_scatter.setStyle({
                unit: 'meter',
                size: [2600, 2600],
                borderWidth: 0,
                texture: 'https://a.amap.com/Loca/static/loca-v2/demos/images/breath_red.png',
                duration: 500,
                animate: true,
            })
            this.yel_scatter.setStyle({
                unit: 'meter',
                size: [1000, 1000],
                borderWidth: 0,
                texture: 'https://a.amap.com/Loca/static/loca-v2/demos/images/breath_yellow.png',
                duration: 1000,
                animate: true,
            })
        },
    },
    mounted() {

        // this.json_geojson()
        this.initEnter()
    },
    // vue不能自动销毁实例对象，页面关闭时强制销毁，所有new的实例
    destroyed() {
        this.map && this.map.destroy()
        this.loca && this.loca.destroy()
        this.scatter && this.scatter.destroy()
        this.red_scatter && this.red_scatter.destroy()
        this.yel_scatter && this.yel_scatter.destroy()
        this.yel_geojson && this.yel_geojson.destroy()
    },
}
</script>
<style lang="less">
.map {
    width: 100%;
    height: 95%;
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