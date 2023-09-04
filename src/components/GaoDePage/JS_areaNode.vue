// 图层叠加问题，同一图层不能叠加绘制（例：重复绘制浙江省地图，禁止在浙江省地图再次绘制）
<template>
    <div class="Lbody">
        <div class="header">
            <!-- 线条 -->
            <el-popover placement="bottom">
                <div class="line_popover">
                    <el-form :inline="true" label-width="100px">
                        <el-form-item label="线条颜色:">
                            <div class="line_set_el">
                                <el-input v-model="line_color" :placeholder="line_placeholder" @change="render_fullList()"
                                    :disabled="slider_set_use">
                                </el-input>
                                <el-color-picker class="line_color_picker" @change="render_fullList()" v-model="line_color"
                                    :predefine="predefineColors" :disabled="slider_set_use">
                                </el-color-picker>
                            </div>
                        </el-form-item>
                        <el-form-item label="线条宽度:">
                            <div class="line_set_el">
                                <el-slider :step="0.1" :max="5" v-model="line_weight" show-input :show-tooltip="false"
                                    :disabled="slider_set_use" :debounce="0" @change="render_fullList()">
                                </el-slider>
                            </div>
                        </el-form-item>
                        <el-form-item label="线条透明度:">
                            <div class="line_set_el">
                                <el-slider :step="0.1" :max="1" :show-tooltip="false" v-model="line_opacity" show-input
                                    :disabled="slider_set_use" :debounce="0" @change="render_fullList()">
                                </el-slider>
                            </div>
                        </el-form-item>
                        <el-form-item label="背景透明度:">
                            <div class="line_set_el">
                                <el-slider :step="0.1" :max="1" :show-tooltip="false" @change="render_select()"
                                    v-model="fullList_fillOpacity" show-input :disabled="slider_set_use" :debounce="0">
                                </el-slider>
                            </div>
                        </el-form-item>
                    </el-form>
                </div>
                <el-button slot="reference">样式修改</el-button>
            </el-popover>
            <!-- 区间 -->
            <el-popover>
                <div class="data_popover">
                    <el-form label-width="80px" :model="data_range_form" ref="data_range_form">
                        <el-form-item v-for="(domain, index) in data_range_form.domains" :label="'数据范围' + (index + 1) + ':'"
                            :key="domain.key" :prop="'domains.' + index">
                            <Num_Interval class="data_input" :precision="6" v-model="domain.list">
                            </Num_Interval>
                            <el-color-picker v-model="domain.fillColor" class="data_color_picker" @change="render_select()"
                                :disabled="slider_set_use">
                            </el-color-picker>
                            <el-button class="data_button" type="danger" icon="el-icon-delete" circle
                                @click.prevent="removeDomain(domain)"></el-button>
                        </el-form-item>
                        <div style="text-align: center;">
                            <el-button type="primary" @click="render_select()">提交</el-button>
                            <el-button @click="addDomain()">新增区间</el-button>
                        </div>
                    </el-form>
                </div>
                <el-button slot="reference">数据修改</el-button>
            </el-popover>
            <el-button type="primary" @click="change_Map()">切换地图</el-button>
        </div>
        <div style="z-index: 0;position: relative;" class="map" id="container_depth1" v-loading="loading"
            v-show="map_show_depth1">
            <div style="z-index: 1;" class="drag-box" v-drag id="drag">
            </div>
        </div>
        <div class="map" id="container_depth2" v-loading="loading" v-show="map_show_depth2"> </div>
    </div>
</template>
<script>
import axios from 'axios'
import Num_Interval from '../组件/Num_Interval.vue'
import AMapLoader from '@amap/amap-jsapi-loader'
AMapLoader.reset()
export default {
    components: {      //注册组件
        Num_Interval
    },
    data() {
        return {
            map_show_depth1: true,
            map_show_depth2: false,
            loading: true, // 加载
            slider_set_use: true, // 弹出框修改项是否可用
            marker: {}, //点标记
            markers: [], //点集合
            text_depth1: {},
            texts_depth1: [],
            text_depth2: {},
            texts_depth2: [],
            text_marker_style: {
                // 'padding': '.75rem 1.25rem',
                // 'margin-bottom': '1rem',
                'border': 'rgba(0,0,0,0)',
                'background-color': 'rgba(0,0,0,0)',
                'width': '100%',
                // 'border-width': 0,
                // 'box-shadow': '0 2px 6px 0 rgba(114, 124, 245, .5)',
                'text-align': 'center',
                'font-size': '0.75rem',
                'color': '#000000',
            },
            map_depth1: null, //地图对象
            map_depth2: null,
            infoWindow: null,
            districtExplorer_depth1: null,
            districtExplorer_stroke_depth1: {},
            districtExplorer_stroke_depth2: {},
            depth: 1, //地图层级深度：0的时候只显示国家面，depth为1的时候显示省级，当国家为中国时设置depth为2的可以显示市一级
            ignore_city: [
                '北京市', '上海市', '天津市', '重庆市',
                '台湾省', '香港特别行政区', '澳门特别行政区'
            ], // 全国城市时，无市级省份
            childrenNum: '',
            // 默认填充颜色
            fullList_fillColor: "#072942",
            fullList_fillOpacity: 1,
            // 填充省市区样式
            fullList: {
                fillColor: "",
                cursor: "default",
                bubble: true,
                strokeColor: "", //线颜色
                strokeOpacity: 0, //线透明度
                strokeWeight: 0, //线宽
                fillOpacity: 1 //填充透明度
            },
            strokeList: {
                cursor: "default",
                bubble: true,
                strokeColor: "", //线颜色
                fillColor: "", // 填充色
                strokeOpacity: "", //线透明度
                strokeWeight: "", //线宽
                fillOpacity: 0 //填充透明度
            },
            // 当前地区节点=>当前地区等级=>当前地区子节点数
            areaNode: '',
            areaNode_len: '',
            level_current: '',
            level_cNum: '',
            line_color: '#409EFF', // 初始边界颜色
            line_opacity: 1,
            line_weight: 1,
            // 窗体信息格式
            info: [],
            // 省份数据
            data_province: [
                { province: "北京市", value: 0.00218791103927924 },
                { province: "天津市", value: 0.00223519398904755 },
                { province: "河北省", value: 0.0246988935789754 },
                { province: "山西省", value: 0.0248493393282382 },
                { province: "内蒙古自治区", value: 0.0123709390393824 },
                { province: "辽宁省", value: 0.0239939477824297 },
                { province: "吉林省", value: 0.0213074165455937 },
                { province: "黑龙江省", value: 0.0446780890810774 },
                { province: "上海市", value: 0.00349034138289733 },
                { province: "江苏省", value: 0.0771012972722036 },
                // { province: "浙江省", value: 114 },
                { province: "安徽省", value: 0.194010539799348 },
                { province: "福建省", value: 0.0304674134507097 },
                { province: "江西省", value: 0.131837759303995 },
                { province: "山东省", value: 0.0579044196662683 },
                { province: "河南省", value: 0.122032994902038 },
                { province: "湖北省", value: 0.0738559675381058 },
                { province: "湖南省", value: 0.0374523946664833 },
                { province: "重庆市", value: 0.0072256944145941 },
                { province: "四川省", value: 0.026521436370045 },
                { province: "贵州省", value: 0.00749219831328823 },
                { province: "云南省", value: 0.00446179107813722 },
                { province: "西藏自治区", value: 0.000150445749262816 },
                { province: "陕西省", value: 0.0190163427068199 },
                { province: "甘肃省", value: 0.0174560053644656 },
                { province: "青海省", value: 0.00209334513974261 },
                { province: "宁夏回族自治区", value: 0.0034301630831922 },
                { province: "新疆维吾尔自治区", value: 0.0105655900482286 },
                { province: "广东省", value: 0.00775010531202448 },
                { province: "广西壮族自治区", value: 0.00814126426010781 },
                { province: "海南省", value: 0.00122075979401828 }
            ],
            // 城市数据
            data_city: [
                { province: "浙江省", city: "杭州市", value: "0.577099413847136" },
                { province: "浙江省", city: "嘉兴市", value: "0.0216950604263767" },
                { province: "浙江省", city: "湖州市", value: "0.0256294289162076" },
                { province: "浙江省", city: "温州市", value: "0.103856521626019" },
                { province: "浙江省", city: "绍兴市", value: "0.0591215911979011" },
                { province: "浙江省", city: "衢州市", value: "0.0506765072573689" },
                { province: "浙江省", city: "丽水市", value: "0.0159235859987713" },
                { province: "浙江省", city: "舟山市", value: "0.00676807438077723" },
                { province: "浙江省", city: "宁波市", value: "0.0245127566795211" },
                { province: "浙江省", city: "金华市", value: "0.0775026565992728" },
                { province: "浙江省", city: "台州市", value: "0.0372144030706485" },
                { province: "北京市", city: "北京市", value: "110" },
            ],
            // 区县数据
            data_district: [
                { province: "浙江省", city: "杭州市", district: "临安区", value: "10" },
                { province: "浙江省", city: "杭州市", district: "余杭区", value: "20" },
                { province: "浙江省", city: "杭州市", district: "临平区", value: "30" },
                { province: "浙江省", city: "杭州市", district: "钱塘区", value: "40" },
                { province: "浙江省", city: "杭州市", district: "萧山区", value: "50" },
                { province: "浙江省", city: "杭州市", district: "拱墅区", value: "60" },
                { province: "浙江省", city: "杭州市", district: "桐庐县", value: "70" },
                { province: "浙江省", city: "杭州市", district: "淳安县", value: "80" },
                { province: "浙江省", city: "杭州市", district: "建德市", value: "90" },
                { province: "浙江省", city: "杭州市", district: "富阳区", value: "100" },
                { province: "浙江省", city: "杭州市", district: "滨江区", value: "110" },
                { province: "浙江省", city: "杭州市", district: "上城区", value: "120" },
                { province: "浙江省", city: "杭州市", district: "下城区", value: "120" },
                { province: "浙江省", city: "杭州市", district: "西湖区", value: "130" },
            ],
            // 暂存展示的城市数据
            data_city_show: [],
            // 暂存展示的区县数据
            data_district_show: [],
            adcodes_CHN: [100000], // 初始地图视角=>全国
            adcodes_CHN_feature: [], // province:'',adcode:''
            adcode_list: [],
            // 预定义颜色
            predefineColors: [
                '#409EFF',
                '#000000',
                '#d87c7c',
                '#919e8b',
                '#d7ab82',
                '#d95850',
                '#73a373',
                '#73b9bc',
            ],
            line_placeholder: '请输入#******或rgb(*,*,*)',
            data_range_form: {
                domains: [{ list: [0, 0.01], fillColor: '#00FFDD' }, { list: [0.01, 0.02], fillColor: '#FFFF00' }, { list: [0.02, 0.03], fillColor: '#FFDD00' }, { list: [0.03, 0.1], fillColor: '#FF00FF' }, { list: [0.1, 10000], fillColor: '#FF0000' }],
            },
            num_interval: [], // 数值区间
        }
    },
    //自定义指令
    directives: {
        drag: {
            // 指令的定义
            bind: function (el) {
                let oDiv = el;  // 获取当前元素
                oDiv.onmousedown = (e) => {
                    // 算出鼠标相对元素的位置
                    let disX = e.clientX - oDiv.offsetLeft;
                    let disY = e.clientY - oDiv.offsetTop;
                    document.onmousemove = (e) => {
                        // 用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
                        let left = e.clientX - disX;
                        let top = e.clientY - disY;
                        oDiv.style.left = left + 'px';
                        oDiv.style.top = top + 'px';
                    };
                    document.onmouseup = (e) => {
                        document.onmousemove = null;
                        document.onmouseup = null;
                    }
                }
            }
        }
    },
    methods: {
        initEnter(AMap) {
            setTimeout(() => {
                this.initMap(AMap)
            }, 3000)
            // this.getYhDataByPro()
        },
        getYhDataByPro() {
            axios.get("http://sslapi.nadibao.cn/api/HzYaoHaoData/GetHZYaoHaoRegDataForHouseRate")
                .then(res => {
                    console.log(res.data)
                    // for (var i = 0; i < res.data.data.length; i++) {
                    //     this.data_province.push({
                    //         province: res.data.data[i].CODE_NAME,
                    //         value: res.data.data[i].NUM
                    //     })
                    // }
                })
        },
        //初始化地图
        initMap(AMap) {
            //创建地图
            this.map_depth1 = new AMap.Map("container_depth1", {
                cursor: "default",
                resizeEnable: true, //是否监控地图容器尺寸变化，默认值为false
                expandZoomRange: true, //是否支持可以扩展最大缩放级别,和zooms属性配合使用设置为true的时候，zooms的最大级别在PC上可以扩大到20级，移动端还是高清19/非高清20
                zooms: [3, 20], // 区间
                zoom: 8,
                defaultCursor: "pointer", //变成小手 地图默认鼠标样式。参数defaultCursor应符合CSS的cursor属性规范
                showLabel: true, //显示地图文字标记
                // viewMode: "2D", //是否3d视角
                // pitch: 40 //俯仰角度，默认0，[0,83]，2D地图下无效 。（自V1.4.0开始支持）
            })
            this.map_depth2 = new AMap.Map("container_depth2", {
                cursor: "default",
                resizeEnable: true, //是否监控地图容器尺寸变化，默认值为false
                expandZoomRange: true, //是否支持可以扩展最大缩放级别,和zooms属性配合使用设置为true的时候，zooms的最大级别在PC上可以扩大到20级，移动端还是高清19/非高清20
                zooms: [3, 20], // 区间
                zoom: 4,
                defaultCursor: "pointer", //变成小手 地图默认鼠标样式。参数defaultCursor应符合CSS的cursor属性规范
                showLabel: true, //显示地图文字标记
                // viewMode: "2D", //是否3d视角
                // pitch: 40 //俯仰角度，默认0，[0,83]，2D地图下无效 。（自V1.4.0开始支持）
            })
            this.MapControl_infowindow() // 地图控件&信息窗体
            this.AMapUI_DistrictExplorer() // 行政区划浏览
        },
        // 地图控件:https://lbs.amap.com/api/javascript-api/guide/overlays/toolbar
        // 信息窗体:https://lbs.amap.com/api/javascript-api-v2/guide/overlays/info-window
        MapControl_infowindow() {
            // 地图控件，默认卫星
            // 异步一下
            AMap.plugin(['AMap.MapType'], () => {
                this.map_depth1.addControl(new AMap.MapType({
                    defaultType: 1 // 默认卫星地图
                }))
                this.map_depth2.addControl(new AMap.MapType({
                    defaultType: 1 // 默认卫星地图
                }))
            })
            this.infoWindow = new AMap.InfoWindow({
                offset: new AMap.Pixel(0, -10), // 基点指向marker的头部位置
            })
        },
        // 行政区划浏览：https://lbs.amap.com/api/amap-ui/reference-amap-ui/geo/district-explorer
        AMapUI_DistrictExplorer() {
            this.loading = true
            this.slider_set_use = true
            // 延迟加载
            setTimeout(() => {
                AMapUI.loadUI(["geo/DistrictExplorer"], DistrictExplorer => {
                    var districtExplorer_stroke_depth1 = new DistrictExplorer({
                        eventSupport: true,
                        map: this.map_depth1
                    })
                    this.districtExplorer_stroke_depth1 = districtExplorer_stroke_depth1
                    var districtExplorer_stroke_depth2 = new DistrictExplorer({
                        eventSupport: true,
                        map: this.map_depth2
                    })
                    this.districtExplorer_stroke_depth2 = districtExplorer_stroke_depth2
                    var districtExplorer_depth1 = new DistrictExplorer({
                        eventSupport: true,
                        map: this.map_depth1
                    })
                    this.districtExplorer_depth1 = districtExplorer_depth1
                    this.AMapUI_DistrictExplorer_depth_1(districtExplorer_depth1)
                    this.featureClick(districtExplorer_depth1) // 点击区域
                    this.outsideClick(districtExplorer_depth1) // 点击非区域（非加载区域）
                    // featureMove一定要在点击之后调用，因为featureMove使用了其中的数据（data_city_show和data_district_show）
                    this.featureOver(districtExplorer_depth1) // 鼠标移入
                    this.featureMove(districtExplorer_depth1) // 鼠标移动
                    this.featureOut(districtExplorer_depth1) // 鼠标移出
                    var districtExplorer_depth2 = new DistrictExplorer({
                        eventSupport: true,
                        map: this.map_depth2
                    })
                    this.AMapUI_DistrictExplorer_depth_2(districtExplorer_depth2)
                })
            }, 1000)
            this.loading_show()
        },
        // 绘制depth:1
        AMapUI_DistrictExplorer_depth_1(districtExplorer) {
            this.initMap_Change(districtExplorer, this.adcodes_CHN)
        },
        // 绘制depth:2
        AMapUI_DistrictExplorer_depth_2(districtExplorer) {
            districtExplorer.loadMultiAreaNodes([100000], (error, areaNodes) => {
                // 使用事件（点击 移动 等）需开启
                districtExplorer.setAreaNodesForLocating(areaNodes)
                //清除已有的绘制内容
                districtExplorer.clearFeaturePolygons()
                // 循环获取省及对应adcode
                for (var i = 0, len = areaNodes.length; i < len; i++) {
                    this.getadcode_province(areaNodes[i])
                }
                this.render_province_depth2(districtExplorer)
            })
        },
        change_Map() {
            this.map_show_depth1 = !this.map_show_depth1
            this.map_show_depth2 = !this.map_show_depth2
            this.render_fullList()
        },
        // 获取省份和编码
        getadcode_province(areaNodes) {
            this.adcodes_CHN_feature = areaNodes.getSubFeatures()
            for (var i = 0; i < this.adcodes_CHN_feature.length; i++) {
                this.adcode_list.push(this.adcodes_CHN_feature[i].properties.adcode)
            }
        },
        // 绘制地图（省市区，包括返回）
        initMap_Change(districtExplorer, adcode) {
            districtExplorer.loadMultiAreaNodes(adcode, (error, areaNodes) => {
                // 使用事件（点击 移动 等）需开启
                districtExplorer.setAreaNodesForLocating(areaNodes)
                //清除已有的绘制内容
                districtExplorer.clearFeaturePolygons()
                for (var i = 0, len = areaNodes.length; i < len; i++) {
                    this.level_current = areaNodes[i]._data.geoData.parent.properties.level // 区域等级
                    this.level_cNum = areaNodes[i]._data.geoData.parent.properties.childrenNum // 子区域数量
                    this.areaNode = areaNodes[i]
                    this.areaNode_len = areaNodes.length
                    this.render_select(districtExplorer)
                }
                //更新地图视野
                this.map_depth1.setFitView(districtExplorer.getAllFeaturePolygons())
            })
        },
        // 根据当前区域等级调用绘制函数
        // flag标识页面加载和刷新，加载时需重新生成文字信息，刷新时无需重新加载（文字不会闪烁）
        render_select() {
            var districtExplorer = this.districtExplorer_depth1
            if (this.level_current == 'province' & this.level_cNum != 0) {
                this.render_city(districtExplorer)
            }
            else if (this.level_current == 'city' & this.level_cNum != 0) {
                this.render_district(districtExplorer)
            }
            else if (this.level_current == 'country' & this.level_cNum != 0) {
                this.render_province(districtExplorer)
            }
            // 台湾和下钻到区时（台湾省无市无区）
            else {
                this.render_single_district(districtExplorer)
            }
            this.removeArea_depth1()
            this.initTown_depth1()
        },
        //内部区域feature被点击
        featureClick(districtExplorer) {
            districtExplorer.on("featureClick", (e, feature) => {
                // 不在路径中
                if (!this.adcodes_CHN.includes(feature.properties.adcode)) {
                    this.adcodes_CHN.push(feature.properties.adcode) //绘制地图区域
                    // 放入路径后取最后一个
                    var len = this.adcodes_CHN.length
                    var adcode = this.adcodes_CHN[len - 1]
                    this.initMap_Change(districtExplorer, [adcode])
                }
            })
        },
        //外部区域被点击
        outsideClick(districtExplorer) {
            districtExplorer.on("outsideClick", e => {
                // this.removeArea() //清除地图上的文字marker标记
                var len = this.adcodes_CHN.length
                if (len > 1) {
                    this.adcodes_CHN.splice(len - 1)
                    var adcode = this.adcodes_CHN[len - 2]
                    this.initMap_Change(districtExplorer, [adcode])
                }
            })
        },
        // 鼠标移入
        featureOver(districtExplorer) {
            districtExplorer.on("featureMouseover", (e, feature) => {
                if (feature.properties.level == 'province') {
                    for (var i = 0; i < this.data_province.length; i++) {
                        if (this.data_province[i].province == feature.properties.name) {
                            var value = this.data_province[i].value
                        }
                    }
                }
                else if (feature.properties.level == 'city') {
                    for (var i = 0; i < this.data_city_show.length; i++) {
                        if (this.data_city_show[i].city == feature.properties.name) {
                            var value = this.data_city_show[i].value
                        }
                    }
                }
                else if (feature.properties.level == 'district') {
                    for (var i = 0; i < this.data_district_show.length; i++) {
                        if (this.data_district_show[i].district == feature.properties.name) {
                            var value = this.data_district_show[i].value
                        }
                    }
                }
                this.infoWindow.setContent(
                    `<div class="description">
                        <h5 class="title">${feature.properties.name}</h5>
                        <div class="mt-3 detail">
                            value：${(value * 100).toFixed(2) + "%"}<br />
                        </div>
                    </div>`
                )
                var position = []
                if (feature.properties.centroid != undefined) {
                    position = [feature.properties.centroid[0], feature.properties.centroid[1]]
                }
                else {
                    position = [feature.properties.center[0], feature.properties.center[1]]
                }
                this.infoWindow.open(this.map_depth1, position)
            })
        },
        // 鼠标移出
        featureOut(districtExplorer) {
            districtExplorer.on("featureMouseout", (e, feature) => {
                this.infoWindow.close()
            })
        },
        // 鼠标移动
        featureMove(districtExplorer) {
            districtExplorer.on("featureMousemove", (e, feature) => {
                if (feature.properties.level == 'province') {
                    for (var i = 0; i < this.data_province.length; i++) {
                        if (this.data_province[i].province == feature.properties.name) {
                            var value = this.data_province[i].value
                        }
                    }
                }
                else if (feature.properties.level == 'city') {
                    for (var i = 0; i < this.data_city_show.length; i++) {
                        if (this.data_city_show[i].city == feature.properties.name) {
                            var value = this.data_city_show[i].value
                        }
                    }
                }
                else if (feature.properties.level == 'district') {
                    for (var i = 0; i < this.data_district_show.length; i++) {
                        if (this.data_district_show[i].district == feature.properties.name) {
                            var value = this.data_district_show[i].value
                        }
                    }
                }
                this.infoWindow.setContent(
                    `<div class="description">
                        <h5 class="title">${feature.properties.name}</h5>
                        <div class="mt-3 detail">
                            value：${(value * 100).toFixed(2) + "%"}<br />
                        </div>
                    </div>`
                )
                this.infoWindow.open(this.map_depth1, e.originalEvent.lnglat)
            })
        },
        // 填充省
        render_province(districtExplorer) {
            var data = this.data_province
            var that = this
            // 清除已有的绘制内容
            districtExplorer.clearFeaturePolygons()
            // 绘制子级区划（此方法中无法使用this获取）
            districtExplorer.renderSubFeatures(this.areaNode, function (feature, i) {
                for (var i = 0; i < data.length; i++) {
                    if (data[i].province == feature.properties.name) {
                        for (var j = 0; j < that.data_range_form.domains.length; j++) {
                            var min = that.data_range_form.domains[j].list[0]
                            var max = that.data_range_form.domains[j].list[1]
                            var fillColor = that.data_range_form.domains[j].fillColor
                            if (data[i].value <= max & data[i].value > min) {
                                that.fullList.fillColor = fillColor
                                that.fullList.fillOpacity = that.fullList_fillOpacity
                                return that.fullList
                            }
                        }
                    }
                }
                that.fullList.fillColor = that.fullList_fillColor
                that.fullList.fillOpacity = that.fullList_fillOpacity
                return that.fullList
            })
            this.render_fullList()
        },
        // 填充省市
        render_city(districtExplorer) {
            // 清除已有的绘制内容
            districtExplorer.clearFeaturePolygons()
            // 清空，此处是地图下钻后显示指定省份的城市信息
            // 将数据中点击省份的城市数据取出
            this.data_city_show = []
            for (var i = 0; i < this.data_city.length; i++) {
                if (this.areaNode._data.geoData.parent.properties.name == this.data_city[i].province) {
                    this.data_city_show.push({
                        province: this.data_city[i].province,
                        city: this.data_city[i].city,
                        value: this.data_city[i].value
                    })
                }
            }
            var that = this
            // 绘制子级区划
            districtExplorer.renderSubFeatures(this.areaNode, function (feature, i) {
                for (var i = 0; i < that.data_city_show.length; i++) {
                    if (that.data_city_show[i].city == feature.properties.name) {
                        for (var j = 0; j < that.data_range_form.domains.length; j++) {
                            var min = that.data_range_form.domains[j].list[0]
                            var max = that.data_range_form.domains[j].list[1]
                            var fillColor = that.data_range_form.domains[j].fillColor
                            if (that.data_city_show[i].value <= max & that.data_city_show[i].value > min) {
                                that.fullList.fillColor = fillColor
                                return that.fullList
                            }
                        }
                    }
                }
                that.fullList.fillColor = that.fullList_fillColor
                that.fullList.fillOpacity = that.fullList_fillOpacity
                return that.fullList
            })
            this.render_fullList()
        },
        // 填充市区
        render_district(districtExplorer) {
            // 清除已有的绘制内容
            districtExplorer.clearFeaturePolygons()
            var that = this
            // 不知道有没有市没有区县划分
            if (this.level_cNum == 0) {
                that.fullList.fillColor = that.fullList_fullColor
                // 绘制父区域
                districtExplorer.renderParentFeature(this.areaNode, that.fullList)
            }
            // 清空
            this.data_district_show = []
            for (var i = 0; i < this.data_district.length; i++) {
                if (this.areaNode._data.geoData.parent.properties.name == this.data_district[i].city) {
                    this.data_district_show.push({
                        province: this.data_district[i].province,
                        city: this.data_district[i].city,
                        district: this.data_district[i].district,
                        value: this.data_district[i].value
                    })
                }
            }
            var data = this.data_district_show
            // 绘制子级区划
            districtExplorer.renderSubFeatures(this.areaNode, function (feature, i) {
                for (i = 0; i < data.length; i++) {
                    if (data[i].district == feature.properties.name & data[i].value > 100) {
                        that.fullList.fillColor = "red"
                        return that.fullList
                    }
                    else if (data[i].district == feature.properties.name & data[i].value <= 100 & data[i].value > 80) {
                        that.fullList.fillColor = "pink"
                        return that.fullList
                    }
                    else if (data[i].district == feature.properties.name & data[i].value <= 80 & data[i].value > 50) {
                        that.fullList.fillColor = "yellow"
                        return that.fullList
                    }
                    else if (data[i].district == feature.properties.name & data[i].value <= 50) {
                        that.fullList.fillColor = "green"
                        return that.fullList
                    }
                }
                that.fullList.fillColor = that.fullList_fillColor
                that.fullList.fillOpacity = that.fullList_fillOpacity
                return that.fullList
            })
            this.render_fullList()
        },
        // 全国省份城市
        render_province_depth2(districtExplorer) {
            var that = this
            districtExplorer.loadMultiAreaNodes(this.adcode_list, (error, areaNodes) => {
                console.log(areaNodes)
                // 使用事件（点击 移动 等）需开启
                districtExplorer.setAreaNodesForLocating(areaNodes)
                //清除已有的绘制内容
                districtExplorer.clearFeaturePolygons()
                for (var i = 0; i < areaNodes.length; i++) {
                    var parent_name = areaNodes[i]._data.geoData.parent.properties.name
                    if (that.ignore_city.includes(parent_name)) {
                        for (var j = 0; j < that.data_city.length; j++) {
                            if (that.data_city[j].city == parent_name) {
                                if (that.data_city[j].value > 100) {
                                    that.fullList.fillColor = "red"
                                }
                                else if (that.data_city[j].value <= 100 & that.data_city[j].value > 80) {
                                    that.fullList.fillColor = "pink"
                                }
                                else if (that.data_city[j].value <= 80 & that.data_city[j].value > 50) {
                                    that.fullList.fillColor = "yellow"
                                }
                                else if (that.data_city[j].value <= 50) {
                                    that.fullList.fillColor = "green"
                                }
                            }
                        }
                        districtExplorer.renderParentFeature(areaNodes[i], that.fullList)
                    }
                    else {
                        // 绘制子级区划
                        districtExplorer.renderSubFeatures(areaNodes[i], function (feature, i) {
                            for (i = 0; i < that.data_city.length; i++) {
                                if (that.data_city[i].city == feature.properties.name) {
                                    if (that.data_city[i].value > 100) {
                                        that.fullList.fillColor = "red"
                                        return that.fullList
                                    }
                                    else if (that.data_city[i].value <= 100 & that.data_city[i].value > 80) {
                                        that.fullList.fillColor = "pink"
                                        return that.fullList
                                    }
                                    else if (that.data_city[i].value <= 80 & that.data_city[i].value > 50) {
                                        that.fullList.fillColor = "yellow"
                                        return that.fullList
                                    }
                                    else if (that.data_city[i].value <= 50) {
                                        that.fullList.fillColor = "green"
                                        return that.fullList
                                    }
                                }
                            }
                            that.fullList.fillColor = that.fullList_fillColor
                            that.fullList.fillOpacity = that.fullList_fillOpacity
                            return that.fullList
                        })
                    }
                    this.removeArea_depth2()
                    this.initTown_depth2(areaNodes[i])
                }
                //更新地图视野
                this.map_depth2.setFitView(districtExplorer.getAllFeaturePolygons())
            })
            this.render_fullList()
        },
        // 台湾省和单个区使用
        render_single_district(districtExplorer) {
            // 清除已有的绘制内容
            districtExplorer.clearFeaturePolygons()
            var district_or_TaiWan = []
            for (var i = 0; i < this.data_district_show.length; i++) {
                if (this.areaNode._data.geoData.parent.properties.name == this.data_district_show[i].district) {
                    district_or_TaiWan.push({
                        province: this.data_district_show[i].province,
                        city: this.data_district_show[i].city,
                        district: this.data_district_show[i].district,
                        value: this.data_district_show[i].value
                    })
                }
            }
            for (var i = 0; i < district_or_TaiWan.length; i++) {
                if (district_or_TaiWan[i].value > 100) {
                    this.fullList.fillColor = "red"
                }
                else if (district_or_TaiWan[i].value <= 100 & district_or_TaiWan[i].value > 80) {
                    this.fullList.fillColor = "pink"
                }
                else if (district_or_TaiWan[i].value <= 80 & district_or_TaiWan[i].value > 50) {
                    this.fullList.fillColor = "yellow"
                }
                else if (district_or_TaiWan[i].value <= 50) {
                    this.fullList.fillColor = "green"
                }
                else {
                    this.fullList.fillColor = this.fullList_fillColor
                    that.fullList.fillOpacity = that.fullList_fillOpacity
                }
            }
            // 绘制父亲级区划
            districtExplorer.renderParentFeature(this.areaNode, this.fullList)
            this.render_fullList()
        },
        // 绘制线条;flag=>台湾或单个区绘制父区域
        render_fullList() {
            this.strokeList.strokeColor = this.line_color
            this.strokeList.strokeOpacity = this.line_opacity
            this.strokeList.strokeWeight = this.line_weight
            var that = this
            if (this.map_show_depth1 == true) {
                var districtExplorer = this.districtExplorer_stroke_depth1
                districtExplorer.clearFeaturePolygons()
                var len = this.adcodes_CHN.length
                var adcode = [this.adcodes_CHN[len - 1]]
                districtExplorer.loadMultiAreaNodes(adcode, (error, areaNodes) => {
                    if (that.level_cNum == 0) {
                        for (var i = 0, len = areaNodes.length; i < len; i++) {
                            districtExplorer.renderParentFeature(areaNodes[i], that.strokeList)
                        }
                    }
                    else {
                        for (var i = 0, len = areaNodes.length; i < len; i++) {
                            districtExplorer.renderSubFeatures(areaNodes[i], that.strokeList)
                        }
                    }
                })
            }
            else if (this.map_show_depth2 == true) {
                var districtExplorer = this.districtExplorer_stroke_depth2
                districtExplorer.clearFeaturePolygons()
                districtExplorer.loadMultiAreaNodes(this.adcode_list, (error, areaNodes) => {
                    for (var i = 0; i < areaNodes.length; i++) {
                        var parent_name = areaNodes[i]._data.geoData.parent.properties.name
                        if (that.ignore_city.includes(parent_name)) {
                            districtExplorer.renderParentFeature(areaNodes[i], that.strokeList)
                        }
                        else {
                            // 绘制子级区划
                            districtExplorer.renderSubFeatures(areaNodes[i], that.strokeList)
                        }
                    }
                })
            }
        },
        // childNum=0
        initCity_depth1() {
            var feature = this.areaNode._data.geoData.parent
            if (
                feature.properties.adcode == undefined ||
                feature.properties.adcode == null ||
                feature.properties.adcode == ""
            ) {
                adcode = ""
            }
            // this.removeArea() //清空文字点标记
            var position = []
            if (feature.properties.centroid != undefined) {
                position = [feature.properties.centroid[0], feature.properties.centroid[1]]
            }
            else {
                position = [feature.properties.center[0], feature.properties.center[1]]
            }
            this.text_depth1 = new AMap.Text({
                text: feature.properties.name,
                anchor: 'center', // 设置文本标记锚点
                draggable: true, // 是
                cursor: 'pointer', // 鼠标样式
                // angle: 10, // 倾斜角度
                style: this.text_marker_style,
                position: position
            })
            this.texts_depth1.push(this.text_depth1)
            this.map_depth1.add(this.texts_depth1)
        },
        initCity_depth2(adcode_depth2) {
            var feature = adcode_depth2._data.geoData.parent
            if (
                feature.properties.adcode == undefined ||
                feature.properties.adcode == null ||
                feature.properties.adcode == ""
            ) {
                adcode = ""
            }
            // this.removeArea() //清空文字点标记
            var position = []
            if (feature.properties.centroid != undefined) {
                position = [feature.properties.centroid[0], feature.properties.centroid[1]]
            }
            else {
                position = [feature.properties.center[0], feature.properties.center[1]]
            }
            this.text_depth2 = new AMap.Text({
                text: feature.properties.name,
                anchor: 'center', // 设置文本标记锚点
                draggable: true, // 是
                cursor: 'pointer', // 鼠标样式
                // angle: 10, // 倾斜角度
                style: this.text_marker_style,
                position: position
            })
            this.texts_depth2.push(this.text_depth2)
            this.map_depth2.add(this.texts_depth2)
        },
        // 个别市可能没有区划，此时该市无lngLatSubList属性
        // 台湾省无市；同时下钻到区后也无此属性
        initTown_depth1() {
            if (this.areaNode.adcode == undefined || this.areaNode.adcode == null || this.areaNode.adcode == "") {
                adcode = "";
            }
            // 传国=>100000，绘制省；传省=>410000，绘制该省的市；穿市=>410100，绘制该市的区
            // lngLatSubList有该属性表示改省或市下还有划分
            if (this.areaNode._data.geoData.lngLatSubList) {
                this.areaNode._data.geoData.lngLatSubList.forEach(item => {
                    var position = []
                    if (item.properties.centroid != undefined) {
                        position = [item.properties.centroid[0], item.properties.centroid[1]]
                    }
                    else {
                        position = [item.properties.center[0], item.properties.center[1]]
                    }
                    this.text_depth1 = new AMap.Text({
                        text: item.properties.name,
                        anchor: 'center', // 设置文本标记锚点
                        draggable: true, // 是
                        cursor: 'pointer', // 鼠标样式
                        // angle: 10, // 倾斜角度
                        style: this.text_marker_style,
                        position: position
                    })
                    this.texts_depth1.push(this.text_depth1);
                })
            }
            else {
                this.initCity_depth1()
            }
            this.map_depth1.add(this.texts_depth1)
        },
        initTown_depth2(adcode_depth2) {
            if (adcode_depth2 == undefined || adcode_depth2 == null || adcode_depth2 == "") {
                adcode = "";
            }
            // if (this.areaNode_len == 1) {
            //     this.removeArea()
            // }
            // 传国=>100000，绘制省；传省=>410000，绘制该省的市；穿市=>410100，绘制该市的区
            // lngLatSubList有该属性表示改省或市下还有划分
            if (adcode_depth2._data.geoData.lngLatSubList) {
                adcode_depth2._data.geoData.lngLatSubList.forEach(item => {
                    var position = []
                    if (item.properties.centroid != undefined) {
                        position = [item.properties.centroid[0], item.properties.centroid[1]]
                    }
                    else {
                        position = [item.properties.center[0], item.properties.center[1]]
                    }
                    this.text_depth2 = new AMap.Text({
                        text: item.properties.name,
                        anchor: 'center', // 设置文本标记锚点
                        draggable: true, // 是
                        cursor: 'pointer', // 鼠标样式
                        // angle: 10, // 倾斜角度
                        style: this.text_marker_style,
                        position: position
                    })
                    this.texts_depth2.push(this.text_depth2);
                })
            }
            else {
                this.initCity_depth2(adcode_depth2)
            }
            this.map_depth2.add(this.texts_depth2)
        },
        // 清空省市区域坐标
        removeArea_depth1() {
            this.map_depth1.remove(this.texts_depth1)
            this.texts_depth1 = []
        },
        removeArea_depth2() {
            this.map_depth2.remove(this.texts_depth2)
            this.texts_depth2 = []
        },
        // loading
        loading_show() {
            setTimeout(() => {
                this.loading = false
                this.slider_set_use = false
            }, 3000)
        },
        // 控制地图文字显示
        texts_show() {
            this.map_depth1.remove(this.texts)
        },
        // 删除数据区间
        removeDomain(item) {
            var index = this.data_range_form.domains.indexOf(item)
            if (index !== -1) {
                this.data_range_form.domains.splice(index, 1)
            }
        },
        // 添加数据区间
        addDomain() {
            this.data_range_form.domains.push({
                list: '',
                key: Date.now()
            });
        },
        // 图例
        map_lengend() {

        }
    },
    mounted() {
        AMapLoader.load({
            key: "4091cbcc08c517102220173c5e585b88",              // 申请好的Web端开发者Key，首次调用 load 时必填
            version: "1.4.15",   // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
            plugin: ['AMap.Autocomplete', 'AMap.PlaceSearch', 'AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType', 'AMap.PolyEditor', 'AMap.CircleEditor', 'AMap.DistrictLayer'],
            AMapUI: {
                // 是否加载 AMapUI，缺省不加载
                version: '1.1', // AMapUI 缺省 1.1
                plugin: [],
            },
            Loca: {
                // 是否加载 Loca， 缺省不加载
                version: '1.3.2' // Loca 版本，缺省 1.3.2
            }
        })
            .then((AMap) => {
                // 挂载AMap
                this.initEnter(AMap)
            })
    },
    // vue不能自动销毁实例对象，页面关闭时强制销毁，所有new的实例
    destroyed() {
        this.map_depth1 && this.map_depth1.destroy()
        this.map_depth2 && this.map_depth2.destroy()
    },
}
</script>
<style lang="less">
.Lbody {
    width: 100%;
    height: 100%;
}

// 线条颜色修改form宽
.line_set_el {
    width: 206px;
}

// 线条弹出框弹出框宽度
.line_popover {
    width: 350px;
}

// 数据弹出框宽度
.data_popover {
    width: 460px;
}

.data_input {
    width: 300px;
}

// 滑块宽度，越小越宽
.el-slider__runway.show-input {
    margin-right: 110px;
}

// 滑块输入框宽度
.el-slider__input {
    width: 100px;
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

.lineSel {
    height: 40px;
}

.span1 {
    width: 50px;
    height: 100%;
}

// .el-input {
//     width: 70%;
//     height: 100%;

//     .el-input__inner {
//         height: 100%;
//     }
// }

.line_color_picker {
    position: absolute;
    right: 0;
}

.data_color_picker {
    position: absolute;
    top: 0;
    right: 40px;
}

.data_button {
    position: absolute;
    top: 0;
    right: 0;
}

.el-color-picker__trigger /deep/ {
    border: 0;
}

.map {
    width: 100%;
    height: 95%;
}

.markerCss {
    // font-size: 0.75rem;
    // font-weight: 700;
    // color: #000000;
    // width: auto;
    // 'padding': '.75rem 1.25rem',
    // 'margin-bottom': '1rem',
    // 'border-radius': '.25rem',
    // 'background-color': 'white',
    width: 100%;
    // 'border-width': 0,
    // 'box-shadow': '0 2px 6px 0 rgba(114, 124, 245, .5)',
    text-align: center;
    font-size: 1rem;
    color: #000000;
}

.drag-box {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 100px;
    height: 100px;
    background: #fff;
    border-radius: 5px;
    margin: 0 auto;
    box-shadow: 0 4px 12px rgba(0, 0, 0, .15);
}
</style>
  