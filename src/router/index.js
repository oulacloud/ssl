import Vue from 'vue'
import Router from 'vue-router'
// import Home from '@/components/home'
// import Usermess from '@/components/usermess'
// import Test from '@/components/test'
// import Welcome from '@/components/Welcome'


Vue.use(Router)

//大屏展示
const Login = r => require.ensure([], () => r(require('@/components/LoginAndLayout/login')), 'login')
const Home = r => require.ensure([], () => r(require('@/components/LoginAndLayout/home')), 'home')
const VisualReports = r => require.ensure([], () => r(require('@/components/首页大屏/echartAmap')), 'VisualReports')
const VisualReports1 = r => require.ensure([], () => r(require('@/components/首页大屏/VisualReports1')), 'VisualReports1')
const VisualReports2 = r => require.ensure([], () => r(require('@/components/首页大屏/VisualReports2')), 'VisualReports2')
const VisualReports3 = r => require.ensure([], () => r(require('@/components/首页大屏/VisualReports3')), 'VisualReports3')
const test = r => require.ensure([], () => r(require('@/components/首页大屏/test')), 'test')

// 数据管理
const Daikuan = r => require.ensure([], () => r(require('@/components/数据管理/daikuan')), 'daikuan')
const UserList = r => require.ensure([], () => r(require('@/components/数据管理/userList')), 'userList')

// 数据分析
const Echarts_BarRace = r => require.ensure([], () => r(require('@/components/数据分析/Echarts_BarRace')), 'Echarts_BarRace')
const Zhuxiantu = r => require.ensure([], () => r(require('@/components/数据分析/zhuxiantu')), 'zhuxiantu')
const Zhuduidie = r => require.ensure([], () => r(require('@/components/数据分析/zhuduidie')), 'zhuduidie')
const Fangjiadata = r => require.ensure([], () => r(require('@/components/数据分析/fangjiadata')), 'fangjiadata')
const Moveplt = r => require.ensure([], () => r(require('@/components/数据分析/moveplt')), 'moveplt')
const Bar_Line_Chart = r => require.ensure([], () => r(require('@/components/数据分析/Bar_Line_Chart')), 'Bar_Line_Chart')
const Bar_Plus = r => require.ensure([], () => r(require('@/components/数据分析/Bar_Plus')), 'Bar_Plus')
const Line_Chart = r => require.ensure([], () => r(require('@/components/数据分析/Line_Chart')), 'Line_Chart')

const Changeable_Chart = r => require.ensure([], () => r(require('@/components/数据分析/Changeable_Chart')), 'Changeable_Chart')

// 图表集
// 摇号数据
const yaohao1 = r => require.ensure([], () => r(require('@/components/图表集/摇号数据/yaohao1')), 'yaohao1')
const yaohao2 = r => require.ensure([], () => r(require('@/components/图表集/摇号数据/yaohao2')), 'yaohao2')
const yaohao_bar = r => require.ensure([], () => r(require('@/components/图表集/摇号数据/yaohao_bar')), 'yaohao_bar')
const yaohao_line = r => require.ensure([], () => r(require('@/components/图表集/摇号数据/yaohao_line')), 'yaohao_line')
const yaohao_pie = r => require.ensure([], () => r(require('@/components/图表集/摇号数据/yaohao_pie')), 'yaohao_pie')

const yaohao_bar1 = r => require.ensure([], () => r(require('@/components/图表集/摇号数据/yaohao_bar1')), 'yaohao_bar1')
const yaohao_line1 = r => require.ensure([], () => r(require('@/components/图表集/摇号数据/yaohao_line1')), 'yaohao_line1')
const yaohao_pie1 = r => require.ensure([], () => r(require('@/components/图表集/摇号数据/yaohao_pie1')), 'yaohao_pie1')
const yaohao_radar = r => require.ensure([], () => r(require('@/components/图表集/摇号数据/yaohao_radar')), 'yaohao_radar')
const yaohao_hbar = r => require.ensure([], () => r(require('@/components/图表集/摇号数据/yaohao_hbar')), 'yaohao_hbar')
const yaohao_add = r => require.ensure([], () => r(require('@/components/图表集/摇号数据/yaohao_add')), 'yaohao_add')

const fly_al = r => require.ensure([], () => r(require('@/components/图表集/摇号数据/fly_al')), 'fly_al')
const fly_hw = r => require.ensure([], () => r(require('@/components/图表集/摇号数据/fly_hw')), 'fly_hw')
const fly_lj = r => require.ensure([], () => r(require('@/components/图表集/摇号数据/fly_lj')), 'fly_lj')

// PPT部分
const new_buy_house = r => require.ensure([], () => r(require('@/components/图表集/摇号数据/10new_buy_house')), 'new_buy_house')
const new_buy_house_top10 = r => require.ensure([], () => r(require('@/components/图表集/摇号数据/11new_buy_house_top10')), 'new_buy_house_top10')
const old_buy_house_top10 = r => require.ensure([], () => r(require('@/components/图表集/摇号数据/11old_buy_house_top10')), 'old_buy_house_top10')
const boy_girl_percentage = r => require.ensure([], () => r(require('@/components/图表集/摇号数据/12boy_girl_percentage')), 'boy_girl_percentage')
const buy_house_boy_girl = r => require.ensure([], () => r(require('@/components/图表集/摇号数据/13buy_house_boy_girl')), 'buy_house_boy_girl')
const household_percentage = r => require.ensure([], () => r(require('@/components/图表集/摇号数据/14household_percentage')), 'household_percentage')
const buy_house_family = r => require.ensure([], () => r(require('@/components/图表集/摇号数据/15buy_house_family')), 'buy_house_family')
const have_house_percentage = r => require.ensure([], () => r(require('@/components/图表集/摇号数据/16have_house_percentage')), 'have_house_percentage')
const jo_regist_boy_girl_percentage = r => require.ensure([], () => r(require('@/components/图表集/摇号数据/17jo_regist_boy_girl_percentage')), 'jo_regist_boy_girl_percentage')
const joint_ownership_percentage = r => require.ensure([], () => r(require('@/components/图表集/摇号数据/17joint_ownership_percentage')), 'joint_ownership_percentage')
const water_zhejiang_percertage = r => require.ensure([], () => r(require('@/components/图表集/摇号数据/19water_zhejiang_percertage')), 'water_zhejiang_percertage')
const out_province_regist_top10 = r => require.ensure([], () => r(require('@/components/图表集/摇号数据/20out_province_regist_top10')), 'out_province_regist_top10')
const buy_house_bg_more = r => require.ensure([], () => r(require('@/components/图表集/摇号数据/26buy_house_bg_more')), 'buy_house_bg_more')
const buy_house_city_bg_per = r => require.ensure([], () => r(require('@/components/图表集/摇号数据/26buy_house_city_bg_per')), 'buy_house_city_bg_per')
const zhejiang_yh_bg_per = r => require.ensure([], () => r(require('@/components/图表集/摇号数据/27zhejiang_yh_bg_per')), 'zhejiang_yh_bg_per')
const buy_house = r => require.ensure([], () => r(require('@/components/图表集/摇号数据/3buy_house')), 'buy_house')
const region_loss_per = r => require.ensure([], () => r(require('@/components/图表集/摇号数据/40region_loss_per')), 'region_loss_per')
const regist = r => require.ensure([], () => r(require('@/components/图表集/摇号数据/4regist')), 'regist')
const regist_add = r => require.ensure([], () => r(require('@/components/图表集/摇号数据/5regist_add')), 'regist_add')
const have_house_increase = r => require.ensure([], () => r(require('@/components/图表集/摇号数据/6have_house_increase')), 'have_house_increase')
const increase_hot = r => require.ensure([], () => r(require('@/components/图表集/摇号数据/7increase_hot')), 'increase_hot')
const buy_house_loss = r => require.ensure([], () => r(require('@/components/图表集/摇号数据/8buy_house_loss')), 'buy_house_loss')
const rest_buy_house = r => require.ensure([], () => r(require('@/components/图表集/摇号数据/8rest_buy_house')), 'rest_buy_house')
const settled_talent = r => require.ensure([], () => r(require('@/components/图表集/摇号数据/9settled_talent')), 'settled_talent')
const talent_growth = r => require.ensure([], () => r(require('@/components/图表集/摇号数据/9talent_growth')), 'talent_growth')


// 购房数据
const buyhouse_line = r => require.ensure([], () => r(require('@/components/图表集/购房数据/buyhouse_line')), 'buyhouse_line')


// 高德地图
const echarts_map = r => require.ensure([], () => r(require('@/components/GaoDePage/echarts_map')), 'echarts_map') // Echarts地图下钻 
const JS_areaNode = r => require.ensure([], () => r(require('@/components/GaoDePage/JS_areaNode')), 'JS_areaNode') // JS_行政区划
const JS_areaNode_kmz = r => require.ensure([], () => r(require('@/components/GaoDePage/JS_areaNode_kmz')), 'JS_areaNode_kmz') // JS_行政区划_kmz
const loca_RoundPointLayer = r => require.ensure([], () => r(require('@/components/GaoDePage/loca_RoundPointLayer')), 'loca_RoundPointLayer') // Loca-圆点
const rou_cpc_pou_avgschy = r => require.ensure([], () => r(require('@/components/GaoDePage/rou_cpc_pou_avgschy')), 'rou_cpc_pou_avgschy') // rou-人口普查总人口和家庭户人口
const loca_RoundPointLayer_animate = r => require.ensure([], () => r(require('@/components/GaoDePage/loca_RoundPointLayer_animate')), 'loca_RoundPointLayer_animate') // Loca-圆点-动画
const loca_GridLayer_HexagonLayer = r => require.ensure([], () => r(require('@/components/GaoDePage/loca_GridLayer_HexagonLayer')), 'loca_aploca_GridLayer_HexagonLayeri') // Loca-网格蜂窝

const Change = r => require.ensure([], () => r(require('@/components/GaoDePage/Change')), 'Change') // JS_行政区划

const JS_HZDis = r => require.ensure([], () => r(require('@/components/GaoDePage/Example/JS_HZDis')), 'JS_HZDis') // 地图-杭州市-区县市
const JS_Plate_Pon = r => require.ensure([], () => r(require('@/components/GaoDePage/Example/JS_Plate_Pon')), 'JS_Plate_Pon') // 地图-板块-点
const JS_Pro = r => require.ensure([], () => r(require('@/components/GaoDePage/Example/JS_Pro')), 'JS_Pro') // 地图-省
const JS_City = r => require.ensure([], () => r(require('@/components/GaoDePage/Example/JS_City')), 'JS_City') // 地图-城市
const JS_Plate = r => require.ensure([], () => r(require('@/components/GaoDePage/Example/JS_Plate')), 'JS_Plate') // JS_板块_48
const Hex_Pro = r => require.ensure([], () => r(require('@/components/GaoDePage/Example/Hex_Pro')), 'Hex_Pro') // 蜂窝-省
const Hex_ZJCity = r => require.ensure([], () => r(require('@/components/GaoDePage/Example/Hex_ZJCity')), 'Hex_ZJCity') // 蜂窝-浙江省-城市
const Rou_Lot_Pon = r => require.ensure([], () => r(require('@/components/GaoDePage/Example/Rou_Lot_Pon')), 'Rou_Lot_Pon') // 圆点-大量
const Heat_Pro = r => require.ensure([], () => r(require('@/components/GaoDePage/Example/Heat_Pro')), 'Heat_Pro') // 3D热力图-省
const Heat_City = r => require.ensure([], () => r(require('@/components/GaoDePage/Example/Heat_City')), 'Heat_City') // 3D热力图-城市
const Heat_HZDis = r => require.ensure([], () => r(require('@/components/GaoDePage/Example/Heat_HZDis')), 'Heat_HZDis') // 3D热力图-杭州市-区县市
const Con_Pro = r => require.ensure([], () => r(require('@/components/GaoDePage/Example/Con_Pro')), 'Con_Pro') // 3D热力图-杭州市-区县市
const Ech_Pro = r => require.ensure([], () => r(require('@/components/GaoDePage/Example/Ech_Pro')), 'Ech_Pro') // Ech-省
const Lab_Pro = r => require.ensure([], () => r(require('@/components/GaoDePage/Example/Lab_Pro')), 'Lab_Pro') // Lab-省
const Gird_Lot_Pon = r => require.ensure([], () => r(require('@/components/GaoDePage/Example/Gird_Lot_Pon')), 'Gird_Lot_Pon') // Gird-省-点

const gird_city_num_allyear = r => require.ensure([], () => r(require('@/components/GaoDePage/gird_city_num_allyear')), 'gird_city_num_allyear') // gird-分市累计摇号人数
const loca_LineLayer = r => require.ensure([], () => r(require('@/components/GaoDePage/loca_LineLayer')), 'loca_LineLayer') // Loca-飞线
const loca_LineLayer_animate = r => require.ensure([], () => r(require('@/components/GaoDePage/loca_LineLayer_animate')), 'loca_LineLayer_animate') // Loca-飞线-动态
const loca_PolygonLayer = r => require.ensure([], () => r(require('@/components/GaoDePage/loca_PolygonLayer')), 'loca_PolygonLayer') // 多边形
const loca_RoundPointLayer_dynamic = r => require.ensure([], () => r(require('@/components/GaoDePage/loca_RoundPointLayer_dynamic')), 'loca_RoundPointLayer_dynamic') // 圆点动态


// 小王
const test_1 = r => require.ensure([], () => r(require('@/components/custom/test_1')), 'test_1') // test_1
const test_2 = r => require.ensure([], () => r(require('@/components/custom/test_2')), 'test_2') // test_1
const test_3 = r => require.ensure([], () => r(require('@/components/custom/test_3')), 'test_3') // test_1



export default new Router({
  routes: [{
    path: '/',
    name: 'Login',
    component: Login
  },
  {
    path: '/home',
    component: Home,
    children: [
      // 小王
      {
        path: '/test_1',
        name: 'test_1',
        component: test_1,
        meta: ['自定义', 'test_1'],
      },
      {
        path: '/test_2',
        name: 'test_2',
        component: test_2,
        meta: ['自定义', 'test_2'],
      },
      {
        path: '/test_3',
        name: 'test_3',
        component: test_3,
        meta: ['自定义', 'test_3'],
      },
      // 大屏展示
      {
        path: '/VisualReports',
        name: 'VisualReports',
        component: VisualReports,
        meta: ['大屏展示', '大屏原'],
      },
      {
        path: '/VisualReports1',
        name: 'VisualReports1',
        component: VisualReports1,
        meta: ['大屏展示', '大屏展示1'],
      },
      {
        path: '/VisualReports2',
        name: 'VisualReports2',
        component: VisualReports2,
        meta: ['大屏展示', '大屏展示2'],
      },
      {
        path: '/VisualReports3',
        name: 'VisualReports3',
        component: VisualReports3,
        meta: ['大屏展示', '大屏展示3'],
      },
      {
        path: '/test',
        name: 'test',
        component: VisualReports3,
        meta: ['大屏展示', 'test'],
      },

      // 数据管理
      // 用户列表
      {
        path: '/UserList',
        component: UserList,
        meta: ['数据管理', '用户列表'],
      },
      // 货款数据
      {
        path: '/Daikuan',
        component: Daikuan,
        meta: ['数据管理', '货款数据'],
      },

      // 数据分析
      // 柱状动态排序
      {
        path: '/Echarts_BarRace',
        component: Echarts_BarRace,
        meta: ['数据分析', '柱状动态排序'],
      },
      // 柱形堆叠图
      {
        path: '/zhuduidie',
        component: Zhuduidie,
        meta: ['数据分析', '柱形堆叠图'],
      },
      // 3D示意图
      {
        path: '/moveplt',
        component: Moveplt,
        meta: ['数据分析', '3D示意图'],
      },
      // 双柱单线
      {
        path: '/zhuxiantu',
        component: Zhuxiantu,
        meta: ['数据分析', '双柱单线'],
      },
      // 多图-双线
      {
        path: '/fangjiadata',
        component: Fangjiadata,
        meta: ['数据分析', '多图-双线'],
      },
      {
        path: '/Bar_Line_Chart',
        component: Bar_Line_Chart,
        meta: ['数据分析', '柱线图'],
      },
      {
        path: '/Bar_Plus',
        component: Bar_Plus,
        meta: ['数据分析', '堆叠图'],
      },
      {
        path: '/Line_Chart',
        component: Line_Chart,
        meta: ['数据分析', '折线图'],
      },
      
      {
        path: '/Changeable_Chart',
        component: Changeable_Chart,
        meta: ['数据分析', '万能图'],
      },

      // 摇号图表集~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      // 距离
      {
        path: '/yaohao_bar',
        component: yaohao_bar,
        meta: ['图表集', '摇号数据', '距离分布-柱状图'],
      },
      {
        path: '/yaohao_line',
        component: yaohao_line,
        meta: ['图表集', '摇号数据', '距离分布-折线图'],
      },
      {
        path: '/yaohao_pie',
        component: yaohao_pie,
        meta: ['图表集', '摇号数据', '距离分布-玫瑰图'],
      },
      // 5年数量对比情况
      {
        path: '/yaohao_bar1',
        component: yaohao_bar1,
        meta: ['图表集', '摇号数据', '5年-柱状图'],
      },
      {
        path: '/yaohao_line1',
        component: yaohao_line1,
        meta: ['图表集', '摇号数据', '5年-折线图'],
      },
      {
        path: '/yaohao_pie1',
        component: yaohao_pie1,
        meta: ['图表集', '摇号数据', '5年-饼图'],
      },
      {
        path: '/yaohao_radar',
        component: yaohao_radar,
        meta: ['图表集', '摇号数据', '5年-雷达图'],
      },
      {
        path: '/yaohao_hbar',
        component: yaohao_hbar,
        meta: ['图表集', '摇号数据', '5年-柱状图2'],
      },
      {
        path: '/yaohao_add',
        component: yaohao_add,
        meta: ['图表集', '摇号数据', '净增瀑布图'],
      },

      {
        path: '/yaohao2',
        component: yaohao2,
        meta: ['图表集', '摇号数据', '摇号数据2'],
      },
      // 购房图表集~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      {
        path: '/buyhouse_line',
        component: buyhouse_line,
        meta: ['图表集', '购房数据', '类型-堆叠图'],
      },
      // 流向分布
      {
        path: '/fly_al',
        component: fly_al,
        meta: ['图表集', '摇号数据', '流向分布-阿里'],
      },
      {
        path: '/fly_hw',
        component: fly_hw,
        meta: ['图表集', '摇号数据', '流向分布-华为'],
      },
      {
        path: '/fly_lj',
        component: fly_lj,
        meta: ['图表集', '摇号数据', '流向分布-链家'],
      },
      //摇号测试
      {
        path: '/yaohao1',
        component: yaohao1,
        meta: ['图表集', '表格上传测试'],
      },
      //PPT部分
      {
        path: '/new_buy_house',
        component: new_buy_house,
        meta: ['图表集', '摇号数据', 'new_buy_house'],
      },
      {
        path: '/new_buy_house_top10',
        component: new_buy_house_top10,
        meta: ['图表集', '摇号数据', 'new_buy_house_top10'],
      },
      {
        path: '/old_buy_house_top10',
        component: old_buy_house_top10,
        meta: ['图表集', '摇号数据', 'old_buy_house_top10'],
      },
      {
        path: '/boy_girl_percentage',
        component: boy_girl_percentage,
        meta: ['图表集', '摇号数据', 'boy_girl_percentage'],
      },
      {
        path: '/buy_house_boy_girl',
        component: buy_house_boy_girl,
        meta: ['图表集', '摇号数据', 'buy_house_boy_girl'],
      },
      {
        path: '/household_percentage',
        component: household_percentage,
        meta: ['图表集', '摇号数据', 'household_percentage'],
      },
      {
        path: '/buy_house_family',
        component: buy_house_family,
        meta: ['图表集', '摇号数据', 'buy_house_family'],
      },
      {
        path: '/have_house_percentage',
        component: have_house_percentage,
        meta: ['图表集', '摇号数据', 'have_house_percentage'],
      },
      {
        path: '/jo_regist_boy_girl_percentage',
        component: jo_regist_boy_girl_percentage,
        meta: ['图表集', '摇号数据', 'jo_regist_boy_girl_percentage'],
      },
      {
        path: '/joint_ownership_percentage',
        component: joint_ownership_percentage,
        meta: ['图表集', '摇号数据', 'joint_ownership_percentage'],
      },
      {
        path: '/water_zhejiang_percertage',
        component: water_zhejiang_percertage,
        meta: ['图表集', '摇号数据', 'water_zhejiang_percertage'],
      },
      {
        path: '/out_province_regist_top10',
        component: out_province_regist_top10,
        meta: ['图表集', '摇号数据', 'out_province_regist_top10'],
      },
      {
        path: '/buy_house_bg_more',
        component: buy_house_bg_more,
        meta: ['图表集', '摇号数据', 'buy_house_bg_more'],
      },
      {
        path: '/buy_house_city_bg_per',
        component: buy_house_city_bg_per,
        meta: ['图表集', '摇号数据', 'buy_house_city_bg_per'],
      },
      {
        path: '/zhejiang_yh_bg_per',
        component: zhejiang_yh_bg_per,
        meta: ['图表集', '摇号数据', 'zhejiang_yh_bg_per'],
      },
      {
        path: '/buy_house',
        component: buy_house,
        meta: ['图表集', '摇号数据', 'buy_house'],
      },
      {
        path: '/region_loss_per',
        component: region_loss_per,
        meta: ['图表集', '摇号数据', 'region_loss_per'],
      },
      {
        path: '/regist',
        component: regist,
        meta: ['图表集', '摇号数据', 'regist'],
      },
      {
        path: '/regist_add',
        component: regist_add,
        meta: ['图表集', '摇号数据', 'regist_add'],
      },
      {
        path: '/have_house_increase',
        component: have_house_increase,
        meta: ['图表集', '摇号数据', 'have_house_increase'],
      },
      {
        path: '/increase_hot',
        component: increase_hot,
        meta: ['图表集', '摇号数据', 'increase_hot'],
      },
      {
        path: '/buy_house_loss',
        component: buy_house_loss,
        meta: ['图表集', '摇号数据', 'buy_house_loss'],
      },
      {
        path: '/rest_buy_house',
        component: rest_buy_house,
        meta: ['图表集', '摇号数据', 'rest_buy_house'],
      },
      {
        path: '/settled_talent',
        component: settled_talent,
        meta: ['图表集', '摇号数据', 'settled_talent'],
      },
      {
        path: '/talent_growth',
        component: talent_growth,
        meta: ['图表集', '摇号数据', 'talent_growth'],
      },
      // 高德地图
      // Echarts地图下钻
      {
        path: '/echarts_map',
        component: echarts_map,
        meta: ['高德地图', 'Echarts地图下钻'],
      },
      // JS_行政区划
      {
        path: '/JS_areaNode',
        component: JS_areaNode,
        meta: ['高德地图', 'JS_行政区划'],
      },
      // JS_行政区划
      {
        path: '/JS_areaNode_kmz',
        component: JS_areaNode_kmz,
        meta: ['高德地图', 'JS_行政区划_kmz'],
      },
      // 地图-省
      {
        path: '/JS_Pro',
        component: JS_Pro,
        meta: ['高德地图', '地图-省'],
      },
      // 地图-城市
      {
        path: '/JS_City',
        component: JS_City,
        meta: ['高德地图', '地图-城市'],
      },
      // 地图-板块-点
      {
        path: '/JS_Plate_Pon',
        component: JS_Plate_Pon,
        meta: ['高德地图', '地图-板块-点'],
      },
      // 地图-板块
      {
        path: '/JS_Plate',
        component: JS_Plate,
        meta: ['高德地图', '地图-板块'],
      },
      // Loca-圆点
      {
        path: '/loca_RoundPointLayer',
        component: loca_RoundPointLayer,
        meta: ['高德地图', 'Loca-圆点'],
      },
      // 总人口和平均受教育年限
      {
        path: '/rou_cpc_pou_avgschy',
        component: rou_cpc_pou_avgschy,
        meta: ['高德地图', '总人口和家庭户人口'],
      },
      // Loca-圆点-动画
      {
        path: '/loca_RoundPointLayer_animate',
        component: loca_RoundPointLayer_animate,
        meta: ['高德地图', 'Loca-圆点-动画'],
      },
      // Loca-圆点-动态
      {
        path: '/loca_RoundPointLayer_dynamic',
        component: loca_RoundPointLayer_dynamic,
        meta: ['高德地图', 'Loca-圆点-动态'],
      },
      // Loca-网格蜂窝
      {
        path: '/loca_GridLayer_HexagonLayer',
        component: loca_GridLayer_HexagonLayer,
        meta: ['高德地图', 'Loca-网格蜂窝'],
      },
      // Loca-分省累计摇号人数
      {
        path: '/gird_city_num_allyear',
        component: gird_city_num_allyear,
        meta: ['高德地图', 'grid-分市累计摇号人数'],
      },
      // Loca-飞线
      {
        path: '/loca_LineLayer',
        component: loca_LineLayer,
        meta: ['高德地图', 'Loca-飞线'],
      },
      // Loca-飞线-动态
      {
        path: '/loca_LineLayer_animate',
        component: loca_LineLayer_animate,
        meta: ['高德地图', 'Loca-飞线-动态'],
      },
      {
        path: '/Change',
        component: Change,
        meta: ['转换'],
      },
      // 多边形
      {
        path: '/loca_PolygonLayer',
        component: loca_PolygonLayer,
        meta: ['高德地图', '多边形'],
      },
      // Loca-省内分市累计摇号人数
      {
        path: '/Hex_ZJCity',
        component: Hex_ZJCity,
        meta: ['高德地图', '蜂窝-浙江省-城市'],
      },
      // 3D热力图
      {
        path: '/Heat_City',
        component: Heat_City,
        meta: ['高德地图', '3D热力图-市'],
      },
      {
        path: '/Heat_Pro',
        component: Heat_Pro,
        meta: ['高德地图', '3D热力图-省'],
      },
      {
        path: '/JS_HZDis',
        component: JS_HZDis,
        meta: ['高德地图', '地图-杭州市-区县市'],
      },
      {
        path: '/Heat_HZDis',
        component: Heat_HZDis,
        meta: ['高德地图', '3D热力图-杭州市-区县市'],
      },
      // Loca-分省累计摇号人数
      {
        path: '/Hex_Pro',
        component: Hex_Pro,
        meta: ['高德地图', '蜂窝-省'],
      },
      // Loca-圆点-大量
      {
        path: '/Rou_Lot_Pon',
        component: Rou_Lot_Pon,
        meta: ['高德地图', '圆点-大量'],
      },
      // 等直线-省
      {
        path: '/Con_Pro',
        component: Con_Pro,
        meta: ['高德地图', '等直线-省'],
      },
      // Ech_省
      {
        path: '/Ech_Pro',
        component: Ech_Pro,
        meta: ['高德地图', 'Ech_省'],
      },
      // Lab_省
      {
        path: '/Lab_Pro',
        component: Lab_Pro,
        meta: ['高德地图', 'Lab_省'],
      },
      // Lab_省
      {
        path: '/Gird_Lot_Pon',
        component: Gird_Lot_Pon,
        meta: ['高德地图', 'Gird-省-点'],
      },
    ]
  },
  ]
})
