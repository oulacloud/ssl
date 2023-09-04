<template>
    <div class="Lbody">
        <div id="map" class="map">
            <div class="demo-title">
                <h1>飞线</h1>
                <h3>北京市的人口流入流出情况</h3>
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
            inLineSource: null,
            inLinelayer: null,
            outLineSource: null,
            outLinelayer: null,
            scatter: null,
            scatterGeo: null,
            headColors: ['#ECFFB1', '#146968', '#146968', '#146968', '#146968', '#146968', '#146968', '#146968'],
            trailColors: [
                'rgba(255,178,6, 0.2)',
                'rgba(255,178,6, 0.2)',
                'rgba(20,105,104, 0.2)',
                'rgba(20,105,104, 0.2)',
                'rgba(20,105,104, 0.2)',
                'rgba(20,105,104, 0.2)',
                'rgba(20,105,104, 0.2)',
                'rgba(20,105,104, 0.2)',
            ],
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
                zoom: 5.12,
                center: [109.595668, 35.447184],
                showLabel: false,
                viewMode: '3D',
                mapStyle: 'amap://styles/dark',
            })
            this.loca = new Loca.Container({
                map:this.map,
            })
            this.set_options()
            this.set_inline_style()
            this.loca.animate.start()
        },
        set_options() {
            // 进入北京方向的线
            this.inLineSource = new Loca.GeoJSONSource({
                url: 'https://a.amap.com/Loca/static/loca-v2/demos/mock_data/data-line-in.json',
            })
            this.inLinelayer = new Loca.PulseLineLayer({
                // loca,
                zIndex: 11,
                opacity: 1,
                visible: true,
                zooms: [2, 22],
            })
            this.inLinelayer.setSource(this.inLineSource)
            this.loca.add(this.inLinelayer)
            // 出北京方向的线
            this.outLineSource = new Loca.GeoJSONSource({
                url: 'https://a.amap.com/Loca/static/loca-v2/demos/mock_data/data-line-out.json',
            })
            this.outLinelayer = new Loca.PulseLineLayer({
                // loca,
                zIndex: 11,
                opacity: 1,
                visible: true,
                zooms: [2, 22],
            })
            this.outLinelayer.setSource(this.outLineSource)
            this.loca.add(this.outLinelayer)
            // 下方呼吸点层
            this.scatter = new Loca.ScatterLayer({
                // loca,
                zIndex: 10,
                opacity: 1,
                visible: true,
                zooms: [2, 22],
            })
            this.scatterGeo = new Loca.GeoJSONSource({
                url: 'https://a.amap.com/Loca/static/loca-v2/demos/mock_data/data-scatter.json',
            })
            this.scatter.setSource(this.scatterGeo)
            this.loca.add(this.scatter)
        },
        set_inline_style() {
            this.inLinelayer.setStyle({
                altitude: 0,
                lineWidth: (_, feature) => feature.properties.lineWidthRatio * 4 + 1,
                headColor: (_, feature) => this.headColors[feature.properties.type],
                trailColor: (_, feature) => this.trailColors[feature.properties.type],
                interval: 0.5,
                duration: 2000,
            })
            this.outLinelayer.setStyle({
                altitude: 0,
                lineWidth: (_, feature) => feature.properties.lineWidthRatio * 1 + 3,
                headColor: (_, feature) => this.headColors[feature.properties.type],
                trailColor: (_, feature) => this.trailColors[feature.properties.type],
                interval: 0.25,
                duration: 5000,
            })
            this.scatter.setStyle({
                unit: 'px',
                size: (_, feature) => {
                    var size = feature.properties.lineWidthRatio * 2 + 30
                    return [size, size]
                },
                borderWidth: 0,
                texture: 'https://a.amap.com/Loca/static/loca-v2/demos/images/breath_yellow.png',
                duration: 2000,
                animate: true,
            })
        },
    },
    mounted() {
        this.initEnter()
    },
    // vue不能自动销毁实例对象，页面关闭时强制销毁，所有new的实例
    destroyed() {
        this.map && this.map.destroy()
        this.loca && this.loca.destroy()
        this.inLineSource && this.inLineSource.destroy()
        this.inLinelayer && this.inLinelayer.destroy()
        this.outLineSource && this.outLineSource.destroy()
        this.outLinelayer && this.outLinelayer.destroy()
        this.scatter && this.scatter.destroy()
        this.scatterGeo && this.scatterGeo.destroy()
    },
}
</script>
<style  lang="less">
.map {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
}

.demo-title {
    position: absolute;
    top: 25px;
    left: 25px;
    z-index: 1;
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