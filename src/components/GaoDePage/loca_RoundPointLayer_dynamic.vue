<template>
    <div class="Lbody">
        <div class="map" id="map">
            <div class="demo-title">
                <h1>圆点—孔子学院：文化资产的分布及影响</h1>
                <h3>大小点表达孔子学院在各国的开设分布及影响，学院的开设数量随时间发生变化</h3>
            </div>
            <div class="count">
            <div class="num"> 1000</div>
            <div class="txt">locations</div>
        </div>
        </div>
        <canvas id="player"></canvas>
    </div>
</template>
<script>
import AMapLoader from '@amap/amap-jsapi-loader'
import universities from './GaoDeJS/confucius_data.json'
export default {
    data() {
        return {
            map: null,
            loca: null,
            point: null,
            geojson: null,
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
            var map = new AMap.Map('map', {
                zoom: 2.4,
                showLabel: false,
                viewMode: '3D',
                center: [-7.3828125, 8.059229627200192],
                mapStyle: 'amap://styles/45311ae996a8bea0da10ad5151f72979',
            })
            var loca = new Loca.Container({
                map,
            })
            var pl = new Loca.PointLayer({
                zIndex: 10,
                opacity: 1,
            })
            var yearRange = [0o5, 17];
            function updateSource(curYear) {
                let features = universities.features.filter(f => {
                    let yy = f.properties.date.split('-').pop();
                    return yy <= curYear;
                })
                let n = features.length;
                let dom = document.getElementsByClassName('num')[0];
                dom.innerText = n;
                var geo = new Loca.GeoJSONSource({
                    data: {
                        "type": "FeatureCollection",
                        "features": features,
                    },
                })
                pl.setSource(geo)
            }
            updateSource(yearRange[0])
            var colors = [
                'rgba(255, 195, 136,0.8)',
                'rgba(255, 195, 136,0.8)',
                'rgba(255, 178, 105,0.8)',
                'rgba(255, 161, 94,0.8)',
                'rgba(253, 143, 91,0.8)',
                'rgba(249, 125, 90,0.8)',
                'rgba(242, 108, 88,0.8)',
                'rgba(233, 91, 86,0.8)',
                'rgba(224, 75, 81,0.8)',
                'rgba(213, 58, 75,0.8)',
                'rgba(201, 44, 66,0.8)',
                'rgba(187, 29, 54,0.8)',
                'rgba(172, 15, 41,0.8)',
                'rgba(156, 4, 24,0.8)',
            ]
            var style = {
                radius: 7,
                unit: 'px',
                color: (index, feature) => {
                    let dateStr = feature.properties.date;
                    let yy = dateStr.split('-').pop();
                    let i = yy - 0o5;
                    let ind = i < 0 ? 0 : i >= colors.length ? colors.length - 1 : i;
                    colors = colors[ind]
                    return colors;
                },
                borderWidth: 0,
            }
            pl.setStyle(style);
            loca.add(pl);
            // 图例
            var lengend = new Loca.Legend({
                loca: loca,
                title: {
                    label: '年份',
                    fontColor: 'rgba(255,255,255,0.4)',
                    fontWeight: 'normal',
                    fontSize: '16px'
                },
                style: {
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    left: '20px',
                    bottom: '120px',
                    fontSize: '12px'
                },
                dataMap: [
                    { label: '2017年', color: colors[12] },
                    // { label: '2016年', color: colors[11] },
                    { label: '2015年', color: colors[10] },
                    // { label: '2014年', color: colors[9] },
                    { label: '2013年', color: colors[8] },
                    // { label: '2012年', color: colors[7] },
                    { label: '2011年', color: colors[6] },
                    // { label: '2010年', color: colors[5] },
                    { label: '2009年', color: colors[4] },
                    // { label: '2008年', color: colors[3] },
                    { label: '2007年', color: colors[2] },
                    // { label: '2006年', color: colors[1] },
                    { label: '2005年', color: colors[0] },
                ],
            })
            addPlayBar()
            function addPlayBar() {
                var canvasDom = document.getElementById('player');

                var _style = getComputedStyle(canvasDom);
                let height = _style.getPropertyValue('height');
                let width = _style.getPropertyValue('width');
                canvasDom.height = parseInt(height.slice(0, -2));
                canvasDom.width = parseInt(width.slice(0, -2));

                var dots = new Array(13).fill(1).map((n, i) => {
                    return {
                        progress: i * (1 / 12),
                        text: `${2005 + i}年`,
                    }
                })
                this.player = new PlayBar({
                    canvas: canvasDom,
                    option: {
                        progressTextCallback: (progress) => {
                            for (let i = 1; i < dots.length; i++) {
                                let cur = dots[i];
                                let pre = dots[i - 1]
                                if (cur.progress >= progress && pre.progress < progress) {
                                    return cur && cur.text
                                }
                            }
                            return ''
                        },
                        background: "rgba(0,0,0,0)",
                        dot: {
                            color: "#444D64",
                            radius: 6,
                            borderWidth: 4,
                            hoverColor: "#CCC",
                        },
                        progressDot: {
                            color: "#C5582D",
                            radius: 10,
                        },
                        progressColor: "#C5582D",
                        button: {
                            radius: 20,
                            color: "#B44322",
                            pause: true,
                        },
                        gap: 30,
                        step: 1 / 12,
                        playTimeLength: 15,
                        padding: 20,
                        lineColor: "#55617F",
                        lineWidth: 3,
                        fontColor: "#727272",
                        fontSize: 12,
                    },
                    data: {
                        dots: dots,
                        progress: 0,
                    }
                })
                player.play();
                player.on('play', (e) => {
                    player.play();
                })
                player.on('pause', (e) => {
                    this.player.pause();
                })
                player.on('click', (e) => {
                    for (let i = 1; i < dots.length; i++) {
                        let cur = dots[i];
                        let pre = dots[i - 1]
                        if (cur.progress >= e.progress && pre.progress < e.progress) {
                            player.setProgress(cur.progress)
                            updateData(cur.progress)
                            break;
                        }
                    }
                })
                player.on('progress', (e) => {
                    updateData(e.progress);
                    // console.log('e.progress', e.progress);
                    if (e.progress >= 1) {
                        setTimeout(() => {
                            player.setProgress(0)
                            player.play();
                        }, 200)
                    }
                })
                function updateData(progress) {
                    let prog = progress >= 1 ? 1 : progress;
                    let len = yearRange[yearRange.length - 1] - yearRange[0]
                    let ind = len * prog + yearRange[0]
                    updateSource(ind)
                }
            }
        },
    },
    mounted() {
        this.initEnter()
    },
    // vue不能自动销毁实例对象，页面关闭时强制销毁，所有new的实例
    destroyed() {
        this.map && this.map.destroy()
        this.loca && this.loca.destroy()
        this.geojson && this.geojson.destroy()
    },
}
</script>
<style lang="less">
.Lbody {
    width: 100%;
    height: 100%;
}

.map {
    width: 100%;
    height: 100%;
}

.player {
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 80%;
    height: 90px;
    padding: 10px;
    background: rgba(100, 100, 100, 0.3);
}

.count {
    position: absolute;
    bottom: 40px;
    left: 50px;
    z-index: 1;
}

.num {
    font-size: 26px;
    color: #B44322;
}

.txt {
    font-size: 16px;
    color: #775032;
}

.demo-title {
    position: absolute;
    top: 25px;
    left: 25px;
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