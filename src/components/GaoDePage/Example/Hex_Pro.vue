<template>
    <div class="Lbody">
        <div id="map" class="map">

            <MyTitle :title=this.title :title_text_size=this.title_text_size :title_text_bold=this.title_text_bold
                :title_text_color=this.title_text_color :title_bg_color=this.title_bg_color></MyTitle>
            <MyLengend v-if="len_show" :leng_font_size="leng_font_size" :leng_text_color="leng_text_color"
                :leng_bg_color="leng_bg_color" :colorlist=this.map_colors :datalist=this.data_range></MyLengend>

            <div class="box_fex">

                <!-- 修改按钮 -->
                <el-tooltip content="修改样式" placement="top">
                    <el-button @click="drawer = true" type="default" icon="el-icon-edit" circle id="edit-btn"></el-button>
                </el-tooltip>

                <!-- 注解 -->
                <el-popover placement="top-start" title="" width="200" trigger="hover" class="refer_btn"
                    content="年度净增购房人在2019-2021年稳定在18-20万人，2022年仅净增6.1万人。累计净增购房人2022年仅5.2万人，环比下降了70%，大于商品住宅的下降幅度55%，在市场下行趋势下对新增需求影响更为明显。年度净增购房人比累计净增购房人要高，说明高出的这部分人在上年缺席购房后再次参与购房，2021年有1.6万人，2022年有0.9万人，高于2020年。在购房难度下降、利率下降等趋势下，仍有部分客户重入楼市的积极性高于2020年。">
                    <el-button slot="reference" icon="el-icon-question" circle></el-button>
                </el-popover>

                <el-button icon="el-icon-share" circle>

                </el-button>
            </div>
            <div class="eldrawer">
                <el-drawer :visible.sync="drawer" direction="ltr" :modal="false" custon-class="drawer" title="修改配置项">
                    <el-tabs type="border-card">

                        <!-- 地图选项 -->
                        <el-tab-pane>
                            <span slot="label"><i class="el-icon-setting"></i>地图选项</span>

                            <!-- 标题文本控制 -->
                            <el-collapse accordion>
                                <el-collapse-item title="标题文本" name="1.1">

                                    <!-- 标题加粗 -->
                                    <el-switch v-model="title_text_bold_flag" active-text="是否加粗">
                                    </el-switch>

                                    <!-- 标题大小 -->
                                    <el-form label-width="80px" label-position="left">
                                        <el-form-item label="字体大小">
                                            <el-slider show-input v-model="title_text_size">
                                            </el-slider>
                                        </el-form-item>
                                    </el-form>

                                    <!-- 标题内容 -->
                                    <div class="block">
                                        <el-input v-model="title" placeholder="请输入地图标题">
                                            <span slot="prepend">标题</span>
                                        </el-input>
                                    </div>

                                    <!-- 标题颜色 -->
                                    <div class="block">
                                        <div class="block_left">
                                            <el-input v-model="title_text_color" placeholder="请输入文字颜色">
                                                <span slot="prepend">字体颜色</span>
                                            </el-input>
                                        </div>
                                        <div class="block_right">
                                            <el-color-picker v-model="title_text_color" show-alpha>
                                            </el-color-picker>
                                        </div>
                                    </div>

                                    <!-- 背景颜色 -->
                                    <div class="block">
                                        <div class="block_left">
                                            <el-input v-model="title_bg_color" placeholder="请输入背景颜色">
                                                <span slot="prepend">背景颜色</span>
                                            </el-input>
                                        </div>
                                        <div class="block_right">
                                            <el-color-picker v-model="title_bg_color" show-alpha>
                                            </el-color-picker>
                                        </div>
                                    </div>

                                </el-collapse-item>
                            </el-collapse>

                            <!-- 地图文本控制 -->
                            <el-collapse accordion>
                                <el-collapse-item title="地图文本" name="1.2">

                                    <!-- 地图text -->
                                    <el-switch v-model="map_text_show" active-text="是否显示">
                                    </el-switch>

                                    <!-- text大小 -->
                                    <el-form label-width="80px" label-position="left">
                                        <el-form-item label="字体大小">
                                            <el-slider show-input v-model="map_text_size">
                                            </el-slider>
                                        </el-form-item>
                                    </el-form>

                                    <!-- text颜色 -->
                                    <div class="block">
                                        <div class="block_left">
                                            <el-input v-model="map_text_style['color']" placeholder="请输入文字颜色">
                                                <span slot="prepend">字体颜色</span>
                                            </el-input>
                                        </div>
                                        <div class="block_right">
                                            <el-color-picker v-model="map_text_style['color']" show-alpha>
                                            </el-color-picker>
                                        </div>
                                    </div>

                                    <!-- text背景颜色 -->
                                    <div class="block">
                                        <div class="block_left">
                                            <el-input v-model="map_text_style['background-color']" placeholder="请输入背景颜色">
                                                <span slot="prepend">背景颜色</span>
                                            </el-input>
                                        </div>
                                        <div class="block_right">
                                            <el-color-picker v-model="map_text_style['background-color']" show-alpha>
                                            </el-color-picker>
                                        </div>
                                    </div>

                                </el-collapse-item>
                            </el-collapse>

                            <!-- 图例选项 -->
                            <el-collapse accordion>
                                <el-collapse-item title="图例选项" name="1.2">

                                    <!-- 图例显示 -->
                                    <el-switch v-model="len_show" active-text="是否显示">
                                    </el-switch>

                                    <!-- 图例text大小 -->
                                    <el-form label-width="80px" label-position="left">
                                        <el-form-item class="" label="字体大小">
                                            <el-slider show-input v-model="leng_font_size">
                                            </el-slider>
                                        </el-form-item>
                                    </el-form>

                                    <!-- 图例text颜色 -->
                                    <div class="block">
                                        <div class="block_left">
                                            <el-input v-model="leng_text_color" placeholder="请输入文字颜色">
                                                <span slot="prepend">字体颜色</span>
                                            </el-input>
                                        </div>
                                        <div class="block_right">
                                            <el-color-picker v-model="leng_text_color" show-alpha>
                                            </el-color-picker>
                                        </div>
                                    </div>

                                    <!-- 图例背景颜色 -->
                                    <div class="block">
                                        <div class="block_left">
                                            <el-input v-model="leng_bg_color" placeholder="请输入背景颜色">
                                                <span slot="prepend">背景颜色</span>
                                            </el-input>
                                        </div>
                                        <div class="block_right">
                                            <el-color-picker v-model="leng_bg_color" show-alpha>
                                            </el-color-picker>
                                        </div>
                                    </div>

                                </el-collapse-item>
                            </el-collapse>

                            <!-- 数据范围选项 -->
                            <el-collapse accordion>
                                <el-collapse-item title="数据范围选项" name="1.2">

                                    <div class="block">
                                        <div class="block_left">
                                            <el-form label-width="80px">
                                                <el-form-item :label="'数据范围1:'">
                                                    <el-input :placeholder="'小于' + this.data_range[0]" :disabled="true"
                                                        style="width: 35%; margin-left: 10px" />
                                                    -
                                                    <el-input v-model="data_range[0]"
                                                        style="width: 35%; margin-left: 10px" />
                                                </el-form-item>
                                            </el-form>
                                        </div>
                                        <div class="block_right">
                                            <el-color-picker v-model="map_text_style['color']" show-alpha>
                                            </el-color-picker>
                                        </div>
                                    </div>

                                    <!-- 图例text大小 -->
                                    <!-- <el-form label-width="80px" :model="data_range" ref="data_range">
                                    <el-form-item :label="'数据范围1:'">
                                        <el-input :placeholder="'小于' + this.data_range[0]"
                                            style="width: 40%; margin-right: 10px" :disabled="true" />
                                        -
                                        <el-input v-model="data_range[0]" style="width: 40%; margin-left: 10px" />
                                    </el-form-item>
                                </el-form> -->

                                </el-collapse-item>
                            </el-collapse>

                        </el-tab-pane>

                        <!-- 主题风格 -->
                        <el-tab-pane>
                            <span slot="label"><i class="el-icon-star-off"></i>主题风格</span>

                            <!-- 背景主题 -->
                            <el-collapse accordion>
                                <el-collapse-item title="背景主题" name="2.1">
                                    <el-radio-group v-model="current_bg.url">
                                        <el-radio v-for="item in bg_colors_list" :key="item.url" :value="item.url"
                                            :label="item.url">{{ item.value }}</el-radio>
                                    </el-radio-group>
                                </el-collapse-item>
                            </el-collapse>

                            <!-- 地图主题 -->
                            <el-collapse accordion>
                                <el-collapse-item title="地图主题" name="2.1">
                                    <div class="col-head">
                                        <span class="col-head-text">{{ current_value }}</span>
                                        <img :src="'../../static/svg/draw.svg'" alt="SVG image" class="icons">
                                    </div>
                                    <div @mouseover="mouseOver(index)" @mouseleave="mouseLeave()" class="col-body"
                                        v-for="(item, index) in map_colors_list" :key="index" @click=change_colors(item)>
                                        <a class="theme-plan-group" :style="current_id == index ? current_active : ''">
                                            <div class="theme-plan-text">{{ item.value }}</div>
                                            <div v-for="(color, colorIndex) in item.colors" :key="colorIndex"
                                                class="theme-plan-color" :style="{ backgroundColor: color }"></div>
                                        </a>
                                    </div>
                                </el-collapse-item>
                            </el-collapse>

                        </el-tab-pane>
                    </el-tabs>
                </el-drawer>
            </div>

        </div>
    </div>
</template>
<script>
import AMapLoader from '@amap/amap-jsapi-loader'
import { PROVINCE_NUM_ALLYEAR } from '../../../api/echarts'
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
            geojson: null,
            HexagonLayer: null,
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
    watch: {
        // 地图文本控制
        map_text_show: {
            deep: true,
            immediate: true,
            handler: function () {
                if (this.map) {
                    if (this.map_text_show) {
                        this.map.add(this.map_text)
                    }
                    else {
                        this.map.remove(this.map_text)
                    }
                }
            }
        },

        // 地图文本大小
        map_text_size: {
            deep: true,
            immediate: true,
            handler: function () {
                if (this.map) {
                    this.map_text_style['font-size'] = this.map_text_size + 'px'
                }
            }
        },

        // 标题是否加粗
        title_text_bold_flag: {
            deep: true,
            immediate: true,
            handler: function () {
                if (this.map) {
                    if (this.title_text_bold_flag) {
                        this.title_text_bold = 'bold'
                    }
                    else {
                        this.title_text_bold = ''
                    }
                }
            }
        },

        // 地图背景主题
        current_bg: {
            deep: true,
            immediate: true,
            handler: function () {
                if (this.map) {
                    this.map.setMapStyle(this.current_bg.url)
                }
            }
        },
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
                    version: '2.0.0' // Loca 版本，缺省 1.3.2
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
                this.loca = new Loca.Container({
                    map: this.map,
                })
                this.get_polygon()
                this.get_line()
                this.set_hex_options()
                this.set_hex_style()
                this.set_map_text()
                this.loca.add(this.HexagonLayer)
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
        set_hex_options() {
            var GeoJSONSource = new Loca.GeoJSONSource({
                data: this.geojson
            })
            this.HexagonLayer = new Loca.HexagonLayer({
                zIndex: 3,
                opacity: 1,
                visible: true,
                zooms: [3, 22],
            })
            this.HexagonLayer.setSource(GeoJSONSource)
        },
        // 配置样式
        set_hex_style() {
            var that = this
            this.HexagonLayer.setStyle({
                unit: 'meter',
                radius: 50000,
                gap: 0,
                altitude: 0,
                height: function (index, feature) {
                    var height = that.set_hex_height(feature)
                    return height
                },
                topColor: function (index, feature) {
                    // var color = that.set_hex_color(feature)
                    return '#0070C0'
                },
                sideBottomColor: function (index, feature) {
                    // var color = that.set_hex_color(feature)
                    return '#0070C0'
                },
                sideTopColor: function (index, feature) {
                    // var color = that.set_hex_color(feature)
                    return '#0070C0'
                },
                // label: {
                //     text: function (index, feature) {
                //         var text = that.set_hex_text(feature)
                //         return text
                //     }
                // },
            })
        },
        // 高度
        set_hex_height(feature) {
            var height = 0
            var step = this.step_all / this.sum_num
            var value = feature.coordinates[0].properties.NUM
            if (feature.coordinates[0].properties.PROVINCE_NAME == '浙江省') {
                height = this.max_height
            }
            else {
                height = step * value >= this.max_height ? this.max_height : step * value;
            }
            return height
        },
        // 颜色
        set_hex_color(feature) {
            var color = ''
            var data_range_len = this.data_range.length;
            var value = feature.coordinates[0].properties.NUM * 100 / this.sum_num
            if (feature.coordinates[0].properties.PROVINCE_NAME == '浙江省') {
                color = this.map_colors[data_range_len + 1]
            }
            else {
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