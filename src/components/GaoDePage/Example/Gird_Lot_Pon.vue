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
            map: null,
            loca: null,
            GridLayer: null,
            geojson: [],
            data_json: null,
            data_geojson: null,

            // 标题配置初始值
            title: '第1-5批专精特新小巨人企业分布',
            title_text_size: 24,
            title_text_bold_flag: true,
            title_text_bold: 'bold',
            title_text_color: 'rgba(0, 0, 0, 1)',
            title_bg_color: 'rgba(255, 255, 255, 1)',

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
                url: 'amap://styles/dark',
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

            // 地图文本样式
            current_value: null,
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
            for (var i = 0; i < this.data_json.length; i++) {
                var list = {}
                list.city = this.data_json[i].SNC_COMPANY_CITY
                list.name = this.data_json[i].SNC_COMPANY_NAME
                list.value = 1
                list.coord = [this.data_json[i].SNC_COMPANY_LON, this.data_json[i].SNC_COMPANY_LAT]
                this.geojson.push(list)
            }
        },
        initEnter() {
            AMapLoader.load({
                key: "4091cbcc08c517102220173c5e585b88",
                version: "1.4.15",   // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
                plugin: ['AMap.Scale', 'AMap.ToolBar'],
                Loca: {
                    // 是否加载 Loca， 缺省不加载
                    version: '1.3.2' // Loca 版本，缺省 1.3.2
                }
            }).then((AMap) => {
                this.map = new AMap.Map('map', {
                    zoom: 4.8,
                    showLabel: true,
                    viewMode: '3D',
                    showLabel: false,
                    center: [105.601, 35.32],
                    mapStyle: this.current_bg.url,
                })
                // 核心控制器
                // this.loca = new Loca.Container({
                //     map: this.map,
                //     opacity: 1,
                // })
                this.set_options()
                this.set_gird_style()
            })
        },
        set_options() {
            // 圆点图层
            this.GridLayer = new Loca.GridLayer({
                map: this.map,
                fitView: true
            })
            this.GridLayer.setData(this.geojson, {
                lnglat: 'coord',
                // value: 'value',
            })
        },
        // 圆点样式
        set_gird_style() {
            var that = this
            this.GridLayer.setOptions({
                unit: 'px',
                mode: 'sum',
                style: {
                    color: that.map_colors,
                    radius: 15,
                    opacity: 0.9,
                    gap: 2,
                    height: [0, 0],
                    text: {
                        content: function (v) {
                            return v.value.sum;
                        },
                        direction: 'center',  // 文字方位 
                        //offset: [2, -5],  // 偏移大小
                        fontSize: 12,  // 文字大小
                        fillColor: '#03101F',
                        strokeColor: 'rgba(255,255,255,0)',  // 文字描边颜色
                        strokeWidth: 0,  // 文字描边宽度
                    }
                }
            }).render()
        },
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