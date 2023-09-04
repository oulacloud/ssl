<template>
    <div class="Lbody">
        <div class="header">
            <el-select v-model="color_sel" filterable placeholder="请选择" @change="map_pon_leng_change()">
                <el-option v-for="item in colors_list" :key="item.key" :label="item.label" :value="item.value">
                </el-option>
            </el-select>
        </div>
        <div id="map" class="map">
            <MyTitle :title=this.title></MyTitle>
            <MyLengend v-if=this.data_range :colorlist=this.color_sel :datalist=this.data_range :flag='0'></MyLengend>
        </div>
    </div>
</template>
<script>
import AMapLoader from '@amap/amap-jsapi-loader'
import { CPC_POU_AVGSCHY } from '../../api/echarts'
AMapLoader.reset()
export default {
    data() {
        return {
            title: '2020年人口普查分省份总人口数和家庭户人口数',
            map: {},
            loca: {},
            point: {},
            data_json: null,
            geojson: null,
            colors_list: [
                {
                    key: 1,
                    value: ['#00FFFF', '#FFFF00', '#DC971A', '#FF00FF', '#FF0000'],
                    label: '样式1'
                },
                {
                    key: 2,
                    value: ['#FEFFC6', '#FFEE95', '#FFD963', '#FFAF2B', '#FF8718', '#EA0A00', '#C30000', '#8B0000'],
                    label: '样式2'
                },
                {
                    key: 3,
                    value: ['#D3F299', '#9FE084', '#5ACA70', '#00AF53', '#00873A', '#006B31', '#004835', '#003829'],
                    label: '样式3'
                },
                {
                    key: 4,
                    value: ['#18244E', '#211A50', '#67238A', '#A92E9A', '#C12B6E', '#C53634', '#D27E37', '#FAE200'],
                    label: '样式4'
                }
            ],
            radius_range: [80000, 90000, 110000, 140000, 180000, 230000, 290000, 360000],
            data_range: null,
            color_sel: ['#FFFF00', '#DC971A', '#FF00FF', '#FF0000', '#00FFFF'],
            colors_list_num: '',
        }
    },
    methods: {
        css_change() {
            this.color_sel = this.colors_list[this.colors_list_num]
        },
        async get_datajson() {
            let res = await CPC_POU_AVGSCHY()
            this.data_json = res.data.data
            var data_list = []
            for (var i = 0; i < this.data_json.length; i++) {
                data_list.push(this.data_json[i].POPULATION / 10000)
            }
            this.getQuartiles(data_list)
            this.json_geojson()
        },
        // 数据范围
        getQuartiles(data) {
            var list = []
            // 先对数据进行排序
            const sortedData = data.sort((a, b) => a - b);
            const q1Index = Math.floor((sortedData.length + 1) / 5);
            const q1 = Math.round(sortedData[q1Index - 1]);
            list.push(q1)
            const q2Index = Math.floor((sortedData.length + 1) * 2 / 5);
            const q2 = Math.round(sortedData[q2Index - 1]);
            list.push(q2)
            const q3Index = Math.floor((sortedData.length + 3) * 3 / 5);
            const q3 = Math.round(sortedData[q3Index - 1]);
            list.push(q3)
            const q4Index = Math.floor((sortedData.length + 3) * 4 / 5);
            const q4 = Math.round(sortedData[q4Index - 1]);
            list.push(q4)
            this.data_range = list
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
                    zoom: 4.8,
                    showLabel: false,
                    viewMode: '3D',
                    center: [105.601, 35.32],
                    mapStyle: 'amap://styles/dark',
                })
                // 异步加载插件
                // AMap.plugin(['AMap.Scale'], () => {
                //     var tool = new AMap.ToolBar();
                //     tool.addTo(this.map);
                // })
                this.loca = new Loca.Container({
                    map: this.map,
                })
                // 圆点图层
                this.point = new Loca.PointLayer({
                    zIndex: 10,
                    opacity: 1,
                    blend: 'normal',
                })
                // geo数据
                var geojson = new Loca.GeoJSONSource({
                    // url: 'https://a.amap.com/Loca/static/loca-v2/demos/mock_data/gdp.json',
                    data: this.geojson
                })
                this.point.setSource(geojson)
                this.set_pon_style()
                this.set_pon_ani()
                this.set_map_mousemove()
                this.loca.add(this.point)
            })
        },
        // 圆点样式
        set_pon_style() {
            var style = {
                unit: 'meter',
                // 半径
                radius: (index, f) => {
                    // var value = this.set_radius(f)
                    var value = (f.properties.HOUSEPOU / 500) <= 30000 ? 30000 : (f.properties.HOUSEPOU / 500)
                    return value
                },
                color: (index, f) => {
                    var color = this.set_color(f)
                    return color[0]
                },
                borderWidth: 0,
                blurRadius: -1,
            }
            this.point.setStyle(style)
        },
        set_color(f) {
            var color = ''
            var value = f.properties.POPULATION / 10000
            var data_length = this.data_range.length
            if (value >= this.data_range[data_length - 1]) {
                color = [this.color_sel[data_length]]
                return color
            }
            else {
                for (var i = 0; i < this.data_range.length; i++) {
                    if (value < this.data_range[i]) {
                        color = [this.color_sel[i]]
                        return color
                    }
                }
            }

        },
        // 动画
        set_pon_ani() {
            var that = this
            this.map.on('complete', function () {
                that.point.addAnimate({
                    key: 'radius',
                    value: [0, 1],
                    duration: 1000, // 圆点由小=>大=>正常速度
                    easing: 'ElasticOut',
                    // yoyo: false,
                    // repeat: 1,
                })
                that.point.show(600) // 透明=>正常
            })
        },
        // 鼠标移动
        set_map_mousemove() {
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
                // e.pixel.toArray(),像素位置
                // 寻找该像素位置是否有图层要素，没有返回undefined，有则返回元素数组
                const feat = this.point.queryFeature(e.pixel.toArray())
                if (feat) {
                    var data = feat.properties
                    var content = `<div ">${data.PROVINCE}</div><div>总人口：${(data.POPULATION / 10000).toFixed(2) + '万人'}</div><div>家庭户总人口：${(data.HOUSEPOU / 10000).toFixed(2) + '万人'}</div>`
                    text.setText(content);
                    text.setPosition(e.lnglat);
                }
                else {
                    text.hide()
                }
            })
            // var infoWindow = new AMap.InfoWindow()
            // this.map.on('mousemove', (e) => {
            //     // text.show()
            //     // e.pixel.toArray(),像素位置
            //     // 寻找该像素位置是否有图层要素，没有返回undefined，有则返回元素数组
            //     const feat = this.point.queryFeature(e.pixel.toArray())
            //     if (feat) {
            //         var data = feat.properties
            //         infoWindow.setContent(
            //             `<div ">${data.name}</div><div>比重：${(data.value).toFixed(2) + '%'}</div>`
            //         );
            //         infoWindow.open(this.map, [feat.coordinates[0], feat.coordinates[1]]);
            //     }
            //     else {
            //         infoWindow.close();
            //     }
            // })
        },
        map_pon_leng_change() {
            this.set_pon_style()
        },
    },
    async mounted() {
        // 默认下拉框选中第一个
        this.color_sel = this.colors_list[0].value
        await this.get_datajson()
        this.initEnter()
    },
    // vue不能自动销毁实例对象，页面关闭时强制销毁，所有new的实例
    // beforeDestroy() {
    //     this.map && this.map.destroy()
    //     this.loca && this.loca.destroy()
    // },
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