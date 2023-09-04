<template>
    <div class="Lbody">
        <div id="map" class="map">

            <MyTitle :title=this.title :title_text_size=this.title_text_size :title_text_bold=this.title_text_bold
                :title_text_color=this.title_text_color :title_bg_color=this.title_bg_color></MyTitle>
            <MyLengend v-if="len_show" :leng_font_size="leng_font_size" :leng_text_color="leng_text_color"
                :leng_bg_color="leng_bg_color" :colorlist=this.map_colors :datalist=this.data_range></MyLengend>

        </div>
    </div>
</template>
<script>
import AMapLoader from '@amap/amap-jsapi-loader'
// import Num_Interval from '../../组件/Num_Interval.vue'
import axios from 'axios'
AMapLoader.reset()
export default {
    data() {
        return {
            drawer: false, // 显示抽屉

            // 标题配置初始值
            title: '各省摇号登记人数占省外总量比重赋色图（%）',
            title_text_size: 24,
            title_text_bold_flag: true,
            title_text_bold: 'bold',
            title_text_color: 'rgba(0, 0, 0, 1)',
            title_bg_color: 'rgba(255, 255, 255, 1)',

            // 图例配置初始值
            len_show: true,
            leng_font_size: 20,
            leng_text_color: 'rgba(0, 0, 0, 1)',
            leng_bg_color: 'rgba(255, 255, 255, 0.6)',

            map: null,
            loca: null,
            geojson: [],
            LabelsLayer: null,
            PolygonLayer: null,
            LineLayer: null,

            // 地图颜色list
            map_colors_list: [
                { value: '标准', colors: ['#0A602F', '#089330', '#78AB10', '#E2C802', '#ED950D', '#FC6712'] },
                { value: '明亮', colors: ['#4992ff', '#7cffb2', '#fddd60', '#58d9f9', '#05c091', '#ff8a45'] },
                { value: '粉青', colors: ["#fc97af", "#87f7cf", "#f7f494", "#72ccff", "#f7c5a0", "#d4a4eb"] },
                { value: '蓝绿', colors: ["#2ec7c9", "#b6a2de", "#5ab1ef", "#ffb980", "#d87a80", "#8d98b3"] },
                { value: '橘红', colors: ["#893448", "#d95850", "#eb8146", "#ffb248", "#f2d643", "#ebdba4"] },
                { value: '复古', colors: ["#e01f54", "#5e4ea5", "#f5e8c8", "#b8d2c7", "#c6b38e", "#a4d8c2"] },
            ],

            // 主题配置
            current_bg: {
                url: 'amap://styles/normal',
            },
            bg_colors_list: [
                { value: '标准', url: 'amap://styles/normal' },
                { value: '远山黛', url: 'amap://styles/whitesmoke' },
                { value: '马卡龙', url: 'amap://styles/macaron' },
                { value: '涂鸦', url: 'amap://styles/graffiti' },
                { value: '极夜蓝', url: 'amap://styles/darkblue' },
                { value: '靛青蓝', url: 'amap://styles/blue' },
                { value: '草色青', url: 'amap://styles/fresh' },
                { value: '幻影黑', url: 'amap://styles/dark' },
                { value: '月光银', url: 'amap://styles/light' },
                { value: '雅士灰', url: 'amap://styles/grey' },
            ],
            map_colors: null,
            heights: [100, 200, 300, 900, 1000, 1200, 1500, 3000, 5000],
            replace_name: ['省', '自治区', '回族', '维吾尔', '特别行政区', '壮族'],
            lengend: null,
            data_json: null,
            GeoJSONSource: null,
            data_range: [1, 2, 3, 10],
            sum_num: 0,

            // 省份地图设置总高度和最大高度
            step_all: 8000000,
            max_height: 2000000,
            // 柱文本样式
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

            // 地图文本样式
            map_text_style: {
                // 'padding': '.75rem 1.25rem',
                // 'margin-bottom': '1rem',
                'border': 'rgba(0,0,0,0)',
                'background-color': 'rgba(0,0,0,0)',
                'width': '100%',
                'white-space': 'normal',
                // 'border-width': 0,
                // 'box-shadow': '0 2px 6px 0 rgba(114, 124, 245, .5)',
                'text-align': 'center',
                'font-size': null,
                'color': 'rgba(0, 0, 0, 1)',
            },
            map_text_size: 16,
            map_text_show: true,
            map_text: [],
            geojson_poly: null,
            geojson_line: null,
            storke_Color: 'rgba(0,0,0,0.5)',
            storke_Width: 1,
            current_value: null,
            current_active: '',
            current_id: null,
        }
    },
    methods: {
        // 获取接口数据
        async get_datajson() {
            let res = await PROVINCE_NUM_ALLYEAR();
            this.data_json = res.data.data;
            for (var i = 0; i < this.data_json.length; i++) {
                if (this.data_json[i].PROVINCE_NAME != '浙江省') {
                    this.sum_num = this.sum_num + this.data_json[i].NUM;
                }
            }
            // this.getQuartiles()
            this.json_geojson()
        },
        getQuartiles() {
            var data_list = []
            for (var i = 0; i < this.data_json.length; i++) {
                data_list.push(this.data_json[i].NUM / 10000)
            }
            var list = []
            // 先对数据进行排序
            const sortedData = data_list.sort((a, b) => a - b);
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
            for (var i = 0; i < this.data_json.length; i++) {
                var list = {}
                list.coord = [[this.data_json[i].LON],[this.data_json[i].LAT]]
                list.value = this.data_json[i].NUM
                this.geojson.push(list)
            }
            // const list = [{
            //     coord: '123,44',
            //     value: '展示的文字'
            // }, ...];
        },
        initEnter() {
            AMapLoader.load({
                key: "4091cbcc08c517102220173c5e585b88",
                version: "1.4.15",   // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
                plugins: [
                    'AMap.PolygonEditor',
                    'AMap.Autocomplete',
                    'AMap.PlaceSearch',
                    'AMap.Scale',
                    'AMap.OverView',
                    'AMap.ToolBar',
                    'AMap.MapType',
                    'AMap.PolyEditor',
                    'AMap.CircleEditor',
                    'AMap.Geolocation',
                    'AMap.Geocoder',
                    'AMap.AMapUI'
                ],
                AMapUI: {
                    // 是否加载 AMapUI，缺省不加载
                    version: '1.1', // AMapUI 缺省 1.1
                    plugin: [],
                },
                Loca: {
                    // 是否加载 Loca， 缺省不加载
                    version: '1.3.2' // Loca 版本，缺省 1.3.2
                }
            }).then((AMap) => {
                // AMap.plugin(['AMap.MapType'], () => {
                //     this.map.addControl(new AMap.MapType())
                // })

                this.map = new AMap.Map('map', {
                    zoom: 5,
                    pitch: 45,
                    rotation: 20,
                    showLabel: false,
                    viewMode: '3D',
                    mapStyle: this.current_bg.url,
                })
                // this.get_polygon()
                // this.get_line()
                this.set_lab_options()
                this.set_lab_style()
                // this.set_map_text()
                this.loca.add(this.LabelsLayer)
            })
        },
        // 加载loca面数据
        get_polygon() {
            const cancelToken = axios.CancelToken;
            const source = cancelToken.source();
            axios.get('/static/gaode_json/Pro_Pol_GD.json')
                .then(res => {
                    this.geojson_poly = res.data;
                    for (var i = 0; i < this.geojson_poly.features.length; i++) {
                        for (var j = 0; j < this.data_json.length; j++) {
                            if (this.geojson_poly.features[i].properties.name == this.data_json[j].PROVINCE_NAME) {
                                this.geojson_poly.features[i].properties.num = this.data_json[j].NUM
                            }
                        }
                    }
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
            var GeoJSONSource = new Loca.GeoJSONSource({
                data: this.geojson_poly
            })
            this.PolygonLayer = new Loca.PolygonLayer({
                loca: this.loca,
                visible: true,
                zIndex: 1,
            })
            this.PolygonLayer.setSource(GeoJSONSource)
            this.set_poly_options()
        },
        // 面配置
        set_poly_options() {
            var that = this
            this.PolygonLayer.setStyle({
                topColor: function (index, feature) {
                    var color = that.set_poly_color(feature)
                    return color
                },
            })
        },
        // 加载loca线数据
        get_line() {
            const cancelToken = axios.CancelToken;
            const source = cancelToken.source();
            axios.get('/static/gaode_json/Pro_Line.geojson')
                .then(res => {
                    this.geojson_line = res.data;
                    this.set_line();
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
        // 加载线
        set_line() {
            var GeoJSONSource = new Loca.GeoJSONSource({
                data: this.geojson_line
            })
            this.LineLayer = new Loca.LineLayer({
                loca: this.loca,
                zIndex: 2,
            })
            this.LineLayer.setSource(GeoJSONSource)
            this.set_line_options()
        },
        // 线配置
        set_line_options() {
            this.LineLayer.setStyle({
                color: this.storke_Color,
                lineWidth: this.storke_Width,
            })
        },
        // 面颜色
        set_poly_color(feature) {
            var data_range_len = this.data_range.length
            var color = 'grey'
            var value = feature.properties.num * 100 / this.sum_num;
            if (value >= this.data_range[data_range_len - 1]) {
                color = this.map_colors[data_range_len];
            }
            else {
                for (var i = 0; i < data_range_len; i++) {
                    if (value < this.data_range[i]) {
                        color = this.map_colors[i];
                        break;
                    }
                }
            }
            return color
        },
        // 柱配置
        set_lab_options() {
            this.LabelsLayer = new Loca.LabelsLayer({
                map: this.map,
                eventSupport: true,  // 图层事件支持，LabelsLayer 默认开启
                fitView: true,
                // visible: true,
                zIndex: 99,
                collision: false  // 是否开启文字自动避让
            })
            this.LabelsLayer.setData(this.geojson, {
                lnglat: function (obj) {
                    // console.log(obj.value.coord.split(','))
                    return obj.value.coord
                }
            })
        },
        // 配置样式
        set_lab_style() {
            var that = this
            this.LabelsLayer.setOptions({
                style: {
                    direction: 'center',
                    offset: [0, 0],
                    text: function (data) {
                        console.log(data)
                        return data.value.value
                    },
                    fillColor: function (data) {
                       var color = that.set_lab_color(data)
                       return color
                    },
                    fontSize: function (data) {
                        return 12
                    },
                    strokeColor: '#000',
                    strokeWidth: 0,
                    opacity: 1,
                },
                // selectStyle: {
                //     fontSize: function (data) {
                //         var income = +data.value['2018年'];
                //         return income < 20000 ? 12 :
                //             income < 30000 ? 16 :
                //                 income < 40000 ? 20 :
                //                     income < 50000 ? 24 :
                //                         income < 60000 ? 28 : 32;
                //     },
                //     strokeColor: '#000',
                //     strokeWidth: 1,
                // }
            })
        },
        // 颜色
        set_lab_color(data) {
            var color = ''
            var data_range_len = this.data_range.length;
            var value = data.value.value * 100 / this.sum_num
                if (value >= this.data_range[data_range_len - 1]) {
                    color = this.map_colors[data_range_len]
                }
                else {
                    for (var i = 0; i < data_range_len; i++) {
                        if (value < this.data_range[i]) {
                            color = this.map_colors[i]
                            break;
                        }
                    }
            }
            return color
        },
        // 柱文本
        set_hex_text(feature) {
            var pro_name = feature.coordinates[0].properties.PROVINCE_NAME
            var value = feature.coordinates[0].properties.NUM
            var text = {
                content: [pro_name + ':', value + '人'].join('\n'),
                style: this.text_style
            }
            return text
        },
        // 地图文本
        set_map_text() {
            this.map_text_style['font-size'] = this.map_text_size + 'px'
            this.map_text = []
            for (var i = 0; i < this.data_json.length; i++) {
                var pro_name = this.data_json[i].PROVINCE_NAME;
                // 简化name
                this.replace_name.some(item => {
                    pro_name = pro_name.replace(item, '');
                });
                var value = this.data_json[i].NUM * 100 / this.sum_num;
                var text = new AMap.Text({
                    // text: pro_name + (value*100),
                    text: [pro_name, value.toFixed(2) + '%'].join('\n'),
                    anchor: 'center',
                    draggable: true,
                    cursor: 'pointer',
                    // angle: 10, // 倾斜角度
                    style: this.map_text_style,
                    position: [this.data_json[i].LON, this.data_json[i].LAT]
                });
                this.map_text.push(text);
            }
            this.map.add(this.map_text);
        },
        change_colors(item) {
            this.map_colors = item.colors
            this.current_value = item.value
            this.set_poly_options()
        },
        mouseOver(index) {
            this.current_id = index
            this.current_active = 'background-color: #cccccc';
        },
        mouseLeave() {
            this.current_active = '';
        }
    },
    async mounted() {
        this.map_colors = this.map_colors_list[0].colors
        this.current_value = this.map_colors_list[0].value
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
<style lang="less" scoped>
.Lbody {
    width: 100%;
    height: 100%;
}

.map {
    width: 100%;
    height: 100%;
}

.box_fex {
    position: absolute;
    z-index: 1;
}

/deep/ .el-collapse-item__content {
    padding-bottom: 0px;
}

/deep/ .el-drawer__container {
    position: relative;
    left: 0;
    right: 0;
    width: 100%;
}

.eldrawer /deep/ .el-drawer {
    width: 15% !important;
    min-width: 350px !important;
}

.el-collapse-item {
    width: 92%;
    margin: auto;
}

.el-drawer__header {
    margin-bottom: 20px;
}

.block {
    display: flex;
    width: 100%;
    height: 100%;
    margin-bottom: 5%;
}

.block_left {
    flex-grow: 1;
}

.block_right {
    width: 40px;
}

.el-color-picker {
    position: absolute;
}

.el-form-item {
    margin-bottom: 5%;
    // margin-top: 20px;
}

.el-switch {
    margin-bottom: 5%;
}

.col-head {
    width: auto;
    height: 32px;
    text-align: center;
    border: 1px solid #eee;
    padding: 5px;
    border-radius: 4px;
    margin-bottom: 8px;

    .col-head-text {
        display: inline-block;
        line-height: 32px;
        vertical-align: middle;
    }

    .icons {
        height: 25px;
        width: 25px;
        vertical-align: middle;

    }
}

.theme-plan-group {
    background-color: transparent;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    width: auto;
    height: 32px;
    overflow: hidden;
    border: 1px solid #eee;
    padding: 5px;
    border-radius: 4px;
    margin-bottom: 8px;
    cursor: pointer;

    .theme-plan-text {
        width: 32px;
        height: 30px;
        line-height: 30px;
        margin-bottom: 10px;
        margin-left: 10px;
        margin-right: 30px;
        display: inline-block;
        border-radius: 3px;
        font-family: "Hiragino Sans GB";
    }

    .theme-plan-color {
        width: 32px;
        height: 30px;
        line-height: 30px;
        margin-bottom: 10px;
        margin-left: 5px;
        margin-right: 2px;
        display: inline-block;
        border-radius: 3px;
    }
}

.el-radio {
    display: block;
    margin: 10px 0;
}
</style>