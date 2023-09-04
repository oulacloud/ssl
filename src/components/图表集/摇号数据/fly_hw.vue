<template>
  <div class="LVbody">
    <!-- 头部显示栏 -->
    <header>
      <h1>可视化</h1>
      <div class="showTime">{{ times }}</div>
    </header>
    <!-- 主体部分 -->
    <section class="mainbox">
      <!-- 左 -->
      <!-- <div class="column">
        <div v-loading="loading" element-loading-background="rgba(0, 0, 0, 0)" class="panel bar">
          <h2>2018-2023年摇号人次</h2>
          <div class="chart"></div>
          <div class="panel-footer"></div>
        </div>
        <div class="panel line">
          <h2>折线图-人员变化
            <a href="javacript:;">2020</a>
            <a href="javascript:;">2021</a>
          </h2>
          <div class="chart">图表</div>
          <div class="panel-footer"></div>
        </div>
        <div class="panel pie">
          <h2>饼形图-年龄分布</h2>
          <div class="chart">图表</div>
          <div class="panel-footer"></div>
        </div>
      </div> -->
      <!-- 中 -->
      <div class="column">
        <!-- no模块制作 -->
        <div class="no">
          <div class="no-hd">
            <ul>
              <li>125811</li>
              <li>100000</li>
            </ul>
          </div>
          <div class="no-bd">
            <ul>
              <li>摇号公司数量</li>
              <li>摇号人次</li>
            </ul>
          </div>
        </div>
        <!-- 地图模块 -->
        <div class="map">
          <div class="map1"></div>
          <div class="map2"></div>
          <div class="map3"></div>
          <div class="chart"></div>
        </div>
      </div>
      <!-- 右 -->
      <!-- <div class="column">
        <div class="panel bar2">
          <h2>柱形图-就业行业</h2>
          <div class="chart">图表</div>
          <div class="panel-footer"></div>
        </div>
        <div class="panel line2">
          <h2>折线图-播放量</h2>
          <div class="chart">图表</div>
          <div class="panel-footer"></div>
        </div>
        <div class="panel pie2">
          <h2>饼形图-地区分布</h2>
          <div class="chart">图表</div>
          <div class="panel-footer"></div>
        </div>
      </div> -->
    </section>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import "echarts-extension-amap";
import AMapLoader from "@amap/amap-jsapi-loader";
// import china from '../map/json/china.json'
import axios from 'axios'
export default {
  data() {
    return {
      coname:[],
      sgeoCoordMap: {},
      sname: [],
      sum_arr: [],
      egeoCoordMap: {},
      geoCoordMap: {},
      start_name: [],
      lo_la_tude: [],
      vl: [],
      end_name: [],
      yearData: [],
      map: null, //初始化 map 对象
      times: '',//格式化之后的当前时间
      year: [],
      yeardata: [],
      loading: true,
    };
  },
  created() {
    var vm = this
  },
  mounted() {
    // echarts.registerMap("china", { geoJSON: china })
    // 获取时间
    this.getTimes()
    this.getData("http://sslapi.nadibao.cn/api/HzYaoHaoData/GetCompanyCross", '华为') //获取数据
    setTimeout(() => {
      this.initMap()
    }, 3000);
  },
  // 在Vue实例销毁前，清除定时器
  beforeDestroy() {
    if (this.times) {
      clearInterval(this.getTimesInterval);
    }
  },
  methods: {
    // 初始化高德地图
    initMap() {
      window._AMapSecurityConfig = {
        securityJsCode: '8cf211a0fbbfd8bf936b57883039dbd5', // 高德地图的code
      }
      AMapLoader.load({
        key: "8cf211a0fbbfd8bf936b57883039dbd5", // 申请好的Web端开发者Key，首次调用 load 时必填
        version: "2.0", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
        plugins: ['AMap.Autocomplete', 'AMap.PlaceSearch', 'AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType', 'AMap.PolyEditor', 'AMap.CircleEditor', 'AMap.MarkerClusterer'], // 需要使用的的插件列表，如比例尺'AMap.Scale'等
      }).then((AMap) => {
        // console.log(AMap);
        var myChart = echarts.init(document.querySelector(".map .chart"));
        // var geoCoordMap = {
        //   西溪联合科技广场: [120.023414, 30.275322],
        //   中铁·逸都: [120.2867279, 30.44059181],
        //   星悦城: [119.8188999, 30.26740817],
        //   翡翠城: [120.0121263, 30.2427274],
        //   凤玺云著府: [119.9560163, 30.26042704],
        //   上和公元里: [120.13659, 30.349477],
        //   虹云之城: [120.3376822, 30.17406837],
        //   云澜天第府: [120.1349258, 30.34506226],
        //   如意云境公寓: [120.1437607, 30.3854332],
        //   春和云境轩: [120.205495, 30.343973],
        //   望林府: [120.1063774, 30.33208704],
        //   河语光年府: [120.1342736, 30.34843405],
        //   紫璋台公寓: [120.0515823, 30.32987213],
        //   蜀惠朝闻花城: [120.2584732, 30.12295774],
        //   观湖之宸公寓: [120.2756872, 30.34058361],
        //   融耀之城: [120.259121, 30.392307],
        //   柳浪东苑: [120.1559732, 30.24268391],
        //   恒文璞悦江南府: [120.1499786, 30.38105965],
        //   '浙江海外高层次人才创新园': [120.01749, 30.281447],
        //   和光尘樾轩: [120.035247802734, 30.3630104064941],
        //   翡翠城: [120.0121262577, 30.2427274017],
        //   中天琤府: [119.810600280762, 30.2668647766113],
        //   紫阅云宸里: [120.073604506785, 30.3216579784848],
        //   阿里巴巴滨江新园区: [120.190325, 30.189719],
        //   滨江·江南名府: [120.28002166748, 30.202091217041],
        //   滨江博语华庭: [120.24159418, 30.18272882],
        //   滨康天曜城: [120.2234428527, 30.186110465],
        //   滨融府: [120.119903564453, 30.3070049285889],
        //   滨信宁望府: [120.285763238674, 30.2054467888486],
        //   滨耀学府: [120.173294067383, 30.1635971069336],
        //   滨与城: [120.18363611, 30.02242166],
        //   滨之澜苑: [120.109046936035, 30.1500816345215],
        //   潮起云上府: [120.266948, 30.200236],
        //   宸瀚里: [120.136680603027, 30.3829765319824],
        //   宸宇府: [120.27921576, 30.13440463],
        //   宸章新邸: [120.095222473145, 30.3308334350586],
        //   春和云境轩: [120.205495, 30.343973],
        //   春来枫华公寓: [120.180908203125, 30.3188457489014],
        //   春提杭玥府: [120.158256530762, 30.3536338806152],
        //   春月杭宁府: [120.107627868652, 30.3218078613281],
        //   翠语华庭: [120.234578, 30.204349],
        //   大诚纪名府: [120.440734863281, 30.27321434021],
        //   大运桥西府: [120.12534023, 30.33661276],
        //   东海闲湖城: [119.98827457, 30.23145327],
        //   东旭府: [120.19051347, 30.08634104],
        //   都会钱塘: [120.38373659, 30.33195904],
        //   翡翠城: [120.0121262577, 30.2427274017],
        //   风荷叠翠府: [120.290451049805, 30.4380702972412],
        //   枫翠岚湾: [120.2543776941, 30.1410528317],
        //   凤玺云著府: [119.9560163306, 30.2604270442],
        //   富阳万达广场: [119.92931449, 30.09301825],
        //   古翠蓝庭: [120.115096596888, 30.2943014701145],
        //   古墩彩虹轩: [120.069816589355, 30.3495960235596],
        //   观品名寓: [120.233306884766, 30.237678527832],
        //   桂语朝阳苑: [120.2617273888, 30.1244422626],
        //   杭珹未来中心: [119.991097373622, 30.2608143174012],
        //   杭望云潮城: [120.337341308594, 30.3069763183594],
        //   杭曜置地中心: [120.117096624903, 30.3148741552514],
        //   杭与城: [119.9805521965, 30.2862716218],
        //   杭语蓝庭: [119.95585015, 30.26200312],
        //   杭源里: [120.146251269245, 30.3031798122022],
        //   和光尘樾轩: [120.035247802734, 30.3630104064941],
        //   和旭晶悦府: [120.16036686, 30.339589],
        //   河映云集: [120.148839901707, 30.3404302180542],
        //   河语光年府: [120.13427363, 30.34843405],
        //   虹云之城: [120.3376822057, 30.1740683705],
        //   湖印光年府: [120.3346351225, 30.3068139392],
        //   湖悦章府: [120.243034362793, 30.1271953582764],
        //   环秀府: [120.028915405273, 30.2995796203613],
        //   汇雅轩: [120.274871826172, 30.1949195861816],
        //   佳印府: [120.239875793457, 30.1272373199463],
        //   锦浦江岸公寓: [120.183319091797, 30.0892372131348],
        //   九龙仓·雍景山: [119.971336364746, 30.1641407012939],
        //   君品名邸: [120.245737, 30.23181],
        //   乐虹湾: [120.22368985, 30.17129784],
        //   良渚文化村绿野花语苑: [120.00130494, 30.35415283],
        //   龙湖·江与锦城: [120.492385864258, 30.3122730255127],
        //   龙湖·湘湖原著: [120.25236535, 30.13585661],
        //   泷悦华府: [120.217147827148, 30.3525772094727],
        //   绿城·桂语听澜轩: [120.234682, 30.205741],
        //   明熙府: [120.240158081055, 30.36350440979],
        //   明旭晶晖里: [120.1632755008, 30.3348811076],
        //   沐宸院: [119.9708291863, 30.2721213634],
        //   沐风宜和雅园: [120.1171875, 30.3080406188965],
        //   农房尚海湾: [120.274993896484, 30.1356105804443],
        //   耦园: [120.0380859375, 30.2702751159668],
        //   蒲荷芸邸: [119.9763142415, 30.2679518882],
        //   沁润公寓: [120.099075317383, 30.3086910247803],
        //   沁语晓庭: [120.1606829183, 30.3539121705],
        //   庆丰拥涛府: [120.264801, 30.200458],
        //   荣望轩: [120.335067749023, 30.2323513031006],
        //   融智创城: [120.485947613, 30.3152550637],
        //   珊瑚世纪雅园: [120.086235046387, 30.1654949188232],
        //   上和公元里: [120.13659, 30.349477],
        //   时代天境: [119.99937651, 30.23342886],
        //   时光里: [120.2769695989, 30.3231087171],
        //   世茂璀璨澜宸: [120.124977111816, 30.3506832122803],
        //   蜀惠朝闻花城: [120.2584731904, 30.1229577394],
        //   水榭山: [120.037567138672, 30.0843563079834],
        //   桃李湖滨: [119.7565379721, 30.2590617142],
        //   天承美筑: [120.1019286215, 30.3406408649],
        //   天尔名庭: [120.110343933105, 30.3043651580811],
        //   天境福邸: [120.05937133, 30.34615962],
        //   听澜越府: [120.380241394043, 30.3285579681396],
        //   万科前宸: [120.110874, 30.362034],
        //   望林府: [120.10637736, 30.33208704],
        //   望运河云庄北区: [120.1267501, 30.35255017],
        //   西径晓风: [119.72449143, 30.27719679],
        //   西野风韵春山明月苑二期: [119.8009218508, 30.2635194433],
        //   溪谷岚湾: [119.98727773, 30.34764061],
        //   溪上云峰府: [119.998006, 30.233519],
        //   湘印府: [120.231155395508, 30.1232051849365],
        //   祥宸府: [120.09313204, 30.33474432],
        //   萧澜隐翠轩: [120.25456237793, 30.1365776062012],
        //   萧政储出2017_12号地块: [120.247184753418, 30.1784992218018],
        //   晓月和风: [120.165690996023, 30.1721205104982],
        //   新越锦宸名邸: [120.26114654541, 30.2079811096191],
        //   星创城映月璟园: [120.091295, 30.348755],
        //   星合映公寓: [120.149822, 30.386665],
        //   星图光年轩: [120.039889, 30.365693],
        //   星未来云邸: [119.92000579834, 30.2396450042725],
        //   星遇光年府: [120.09606, 30.346821],
        //   兴耀星漫里: [120.234264, 30.197744],
        //   秀隐翠园: [120.1148506119, 30.2988948197],
        //   燕语海棠轩: [120.106506, 30.35035],
        //   阳光城翡丽公园: [120.3240860413, 30.201219503],
        //   杨柳郡园: [120.2353286739, 30.3044210378],
        //   养云静舍: [120.109344482422, 30.3030891418457],
        //   艺郡府: [120.290550231934, 30.3671188354492],
        //   映月台公寓: [120.009574890137, 30.2741413116455],
        //   余政储出2017_13号地块: [120.17157911, 30.38670025],
        //   余政储出2018_15号地块: [120.09309387207, 30.4175148010254],
        //   远洋西溪公馆: [120.040054321289, 30.2870140075684],
        //   月映海棠园: [120.09360230807, 30.3453634350047],
        //   月咏新辰轩: [119.953965, 30.261467],
        //   悦东方臻园: [120.553535461426, 30.3201580047607],
        //   云都汇中心: [120.086573, 30.140076],
        //   云湖台公寓: [120.059585571289, 30.3496837615967],
        //   云境名邸: [120.0895177641, 30.1599713313],
        //   云空城星之里: [120.033264160156, 30.3009986877441],
        //   云澜天第府: [120.134925842285, 30.3450622558594],
        //   云起未来: [119.9775506481, 30.2707353971],
        //   云蔚轩: [119.983139038086, 30.2709674835205],
        //   中国铁建·西湖国际城: [120.0604959904, 30.3354071696],
        //   中南君奥时代: [120.3238855181, 30.1994852673],
        //   中天琤府: [119.810600280762, 30.2668647766113],
        //   卓蓝华庭: [120.236335754395, 30.3711376190186],
        //   卓越·蔚蓝领秀二期: [120.237899780273, 30.3708686828613],
        //   紫辰花园: [119.94254616, 30.28000533],
        //   紫樾府: [119.987846374512, 30.2711238861084],

        // };
        var geocoord = this.geoCoordMap
        var ALXXData = [
          [{ 'name': '西溪联合科技广场' }, { 'name': '中铁·逸都', 'value': 1.0 }],
          [{ 'name': '西溪联合科技广场' }, { 'name': '星悦城', 'value': 1.0 }],
          [{ 'name': '西溪联合科技广场' }, { 'name': '翡翠城', 'value': 1.0 }],
          [{ 'name': '西溪联合科技广场' }, { 'name': '凤玺云著府', 'value': 1.0 }],
          [{ 'name': '西溪联合科技广场' }, { 'name': '上和公元里', 'value': 1.0 }],
          [{ 'name': '西溪联合科技广场' }, { 'name': '虹云之城', 'value': 1.0 }],
          [{ 'name': '西溪联合科技广场' }, { 'name': '云澜天第府', 'value': 1.0 }],
          [{ 'name': '西溪联合科技广场' }, { 'name': '如意云境公寓', 'value': 1.0 }],
          [{ 'name': '西溪联合科技广场' }, { 'name': '春和云境轩', 'value': 1.0 }],
          [{ 'name': '西溪联合科技广场' }, { 'name': '望林府', 'value': 1.0 }],
          [{ 'name': '西溪联合科技广场' }, { 'name': '河语光年府', 'value': 1.0 }],
          [{ 'name': '西溪联合科技广场' }, { 'name': '紫璋台公寓', 'value': 1.0 }],
          [{ 'name': '西溪联合科技广场' }, { 'name': '蜀惠朝闻花城', 'value': 1.0 }],
          [{ 'name': '西溪联合科技广场' }, { 'name': '观湖之宸公寓', 'value': 1.0 }],
          [{ 'name': '西溪联合科技广场' }, { 'name': '融耀之城', 'value': 1.0 }],
          [{ 'name': '西溪联合科技广场' }, { 'name': '柳浪东苑', 'value': 1.0 }],
          [{ 'name': '西溪联合科技广场' }, { 'name': '恒文璞悦江南府', 'value': 1.0 }],
        ];

        var ALHWData = [
          [{ 'name': '浙江海外高层次人才创新园' }, { 'name': '和光尘樾轩', 'value': 1.0 }],
          [{ 'name': '浙江海外高层次人才创新园' }, { 'name': '翡翠城', 'value': 1.0 }],
          [{ 'name': '浙江海外高层次人才创新园' }, { 'name': '中天琤府', 'value': 1.0 }],
          [{ 'name': '浙江海外高层次人才创新园' }, { 'name': '紫阅云宸里', 'value': 1.0 }],
        ];

        var ALXYData = [
          [{ 'name': '阿里巴巴滨江新园区' }, { 'name': '滨江·江南名府', 'value': 1.0 }],
          [{ 'name': '阿里巴巴滨江新园区' }, { 'name': '滨江博语华庭', 'value': 2.0 }],
          [{ 'name': '阿里巴巴滨江新园区' }, { 'name': '滨康天曜城', 'value': 2.0 }],
          [{ 'name': '阿里巴巴滨江新园区' }, { 'name': '滨融府', 'value': 1.0 }],
          [{ 'name': '阿里巴巴滨江新园区' }, { 'name': '滨信宁望府', 'value': 1.0 }],
          [{ 'name': '阿里巴巴滨江新园区' }, { 'name': '滨耀学府', 'value': 2.0 }],
          [{ 'name': '阿里巴巴滨江新园区' }, { 'name': '滨与城', 'value': 1.0 }],
          [{ 'name': '阿里巴巴滨江新园区' }, { 'name': '滨之澜苑', 'value': 1.0 }],
          [{ 'name': '阿里巴巴滨江新园区' }, { 'name': '潮起云上府', 'value': 1.0 }],
          [{ 'name': '阿里巴巴滨江新园区' }, { 'name': '宸瀚里', 'value': 1.0 }],
          [{ 'name': '阿里巴巴滨江新园区' }, { 'name': '宸宇府', 'value': 1.0 }],
          [{ 'name': '阿里巴巴滨江新园区' }, { 'name': '宸章新邸', 'value': 1.0 }],
          [{ 'name': '阿里巴巴滨江新园区' }, { 'name': '春和云境轩', 'value': 3.0 }],
          [{ 'name': '阿里巴巴滨江新园区' }, { 'name': '春来枫华公寓', 'value': 1.0 }],
          [{ 'name': '阿里巴巴滨江新园区' }, { 'name': '春提杭玥府', 'value': 1.0 }],
          [{ 'name': '阿里巴巴滨江新园区' }, { 'name': '春月杭宁府', 'value': 1.0 }],
          [{ 'name': '阿里巴巴滨江新园区' }, { 'name': '翠语华庭', 'value': 3.0 }],
          [{ 'name': '阿里巴巴滨江新园区' }, { 'name': '大诚纪名府', 'value': 1.0 }],
          [{ 'name': '阿里巴巴滨江新园区' }, { 'name': '大运桥西府', 'value': 2.0 }],
          [{ 'name': '阿里巴巴滨江新园区' }, { 'name': '东海闲湖城', 'value': 1.0 }],
          [{ 'name': '阿里巴巴滨江新园区' }, { 'name': '东旭府', 'value': 2.0 }],
          [{ 'name': '阿里巴巴滨江新园区' }, { 'name': '都会钱塘', 'value': 1.0 }],
          [{ 'name': '阿里巴巴滨江新园区' }, { 'name': '翡翠城', 'value': 6.0 }],
          [{ 'name': '阿里巴巴滨江新园区' }, { 'name': '风荷叠翠府', 'value': 1.0 }],
          [{ 'name': '阿里巴巴滨江新园区' }, { 'name': '枫翠岚湾', 'value': 1.0 }],
          [{ 'name': '阿里巴巴滨江新园区' }, { 'name': '凤玺云著府', 'value': 11.0 }],
          [{ 'name': '阿里巴巴滨江新园区' }, { 'name': '富阳万达广场', 'value': 1.0 }],
          [{ 'name': '阿里巴巴滨江新园区' }, { 'name': '古翠蓝庭', 'value': 2.0 }],
          [{ 'name': '阿里巴巴滨江新园区' }, { 'name': '古墩彩虹轩', 'value': 1.0 }],
          [{ 'name': '阿里巴巴滨江新园区' }, { 'name': '观品名寓', 'value': 1.0 }],
          [{ 'name': '阿里巴巴滨江新园区' }, { 'name': '桂语朝阳苑', 'value': 1.0 }],
          [{ 'name': '阿里巴巴滨江新园区' }, { 'name': '杭珹未来中心', 'value': 1.0 }],
          [{ 'name': '阿里巴巴滨江新园区' }, { 'name': '杭望云潮城', 'value': 1.0 }],
          [{ 'name': '阿里巴巴滨江新园区' }, { 'name': '杭曜置地中心', 'value': 2.0 }],
          [{ 'name': '阿里巴巴滨江新园区' }, { 'name': '杭与城', 'value': 3.0 }],
          [{ 'name': '阿里巴巴滨江新园区' }, { 'name': '杭语蓝庭', 'value': 3.0 }],
          [{ 'name': '阿里巴巴滨江新园区' }, { 'name': '杭源里', 'value': 1.0 }],
          [{ 'name': '阿里巴巴滨江新园区' }, { 'name': '和光尘樾轩', 'value': 22.0 }],
          [{ 'name': '阿里巴巴滨江新园区' }, { 'name': '和旭晶悦府', 'value': 1.0 }],
          [{ 'name': '阿里巴巴滨江新园区' }, { 'name': '河映云集', 'value': 2.0 }],
          [{ 'name': '阿里巴巴滨江新园区' }, { 'name': '河语光年府', 'value': 1.0 }],
          [{ 'name': '阿里巴巴滨江新园区' }, { 'name': '虹云之城', 'value': 1.0 }],
          [{ 'name': '阿里巴巴滨江新园区' }, { 'name': '湖印光年府', 'value': 1.0 }],
          [{ 'name': '阿里巴巴滨江新园区' }, { 'name': '湖悦章府', 'value': 3.0 }],
          [{ 'name': '阿里巴巴滨江新园区' }, { 'name': '环秀府', 'value': 1.0 }],
          [{ 'name': '阿里巴巴滨江新园区' }, { 'name': '汇雅轩', 'value': 1.0 }],
          [{ 'name': '阿里巴巴滨江新园区' }, { 'name': '佳印府', 'value': 3.0 }],
          [{ 'name': '阿里巴巴滨江新园区' }, { 'name': '锦浦江岸公寓', 'value': 2.0 }],
          [{ 'name': '阿里巴巴滨江新园区' }, { 'name': '九龙仓·雍景山', 'value': 1.0 }],
          [{ 'name': '阿里巴巴滨江新园区' }, { 'name': '君品名邸', 'value': 1.0 }],
          [{ 'name': '阿里巴巴滨江新园区' }, { 'name': '乐虹湾', 'value': 1.0 }],
          [{ 'name': '阿里巴巴滨江新园区' }, { 'name': '良渚文化村绿野花语苑', 'value': 5.0 }],
          [{ 'name': '阿里巴巴滨江新园区' }, { 'name': '龙湖·江与锦城', 'value': 2.0 }],
          [{ 'name': '阿里巴巴滨江新园区' }, { 'name': '龙湖·湘湖原著', 'value': 1.0 }],
          [{ 'name': '阿里巴巴滨江新园区' }, { 'name': '泷悦华府', 'value': 1.0 }],
          [{ 'name': '阿里巴巴滨江新园区' }, { 'name': '绿城·桂语听澜轩', 'value': 1.0 }],
          [{ 'name': '阿里巴巴滨江新园区' }, { 'name': '明熙府', 'value': 1.0 }],
          [{ 'name': '阿里巴巴滨江新园区' }, { 'name': '明旭晶晖里', 'value': 2.0 }],
          [{ 'name': '阿里巴巴滨江新园区' }, { 'name': '沐宸院', 'value': 3.0 }],
          [{ 'name': '阿里巴巴滨江新园区' }, { 'name': '沐风宜和雅园', 'value': 1.0 }],
          [{ 'name': '阿里巴巴滨江新园区' }, { 'name': '农房尚海湾', 'value': 1.0 }],
          [{ 'name': '阿里巴巴滨江新园区' }, { 'name': '耦园', 'value': 1.0 }],
          [{ 'name': '阿里巴巴滨江新园区' }, { 'name': '蒲荷芸邸', 'value': 1.0 }],
          [{ 'name': '阿里巴巴滨江新园区' }, { 'name': '沁润公寓', 'value': 1.0 }],
          [{ 'name': '阿里巴巴滨江新园区' }, { 'name': '沁语晓庭', 'value': 1.0 }],
          [{ 'name': '阿里巴巴滨江新园区' }, { 'name': '庆丰拥涛府', 'value': 1.0 }],
          [{ 'name': '阿里巴巴滨江新园区' }, { 'name': '荣望轩', 'value': 2.0 }],
          [{ 'name': '阿里巴巴滨江新园区' }, { 'name': '融智创城', 'value': 2.0 }],
          [{ 'name': '阿里巴巴滨江新园区' }, { 'name': '珊瑚世纪雅园', 'value': 2.0 }],
          [{ 'name': '阿里巴巴滨江新园区' }, { 'name': '上和公元里', 'value': 2.0 }],
          [{ 'name': '阿里巴巴滨江新园区' }, { 'name': '时代天境', 'value': 1.0 }],
          [{ 'name': '阿里巴巴滨江新园区' }, { 'name': '时光里', 'value': 1.0 }],
          [{ 'name': '阿里巴巴滨江新园区' }, { 'name': '世茂璀璨澜宸', 'value': 1.0 }],
          [{ 'name': '阿里巴巴滨江新园区' }, { 'name': '蜀惠朝闻花城', 'value': 1.0 }],
          [{ 'name': '阿里巴巴滨江新园区' }, { 'name': '水榭山', 'value': 2.0 }],
          [{ 'name': '阿里巴巴滨江新园区' }, { 'name': '桃李湖滨', 'value': 1.0 }],
          [{ 'name': '阿里巴巴滨江新园区' }, { 'name': '天承美筑', 'value': 4.0 }],
          [{ 'name': '阿里巴巴滨江新园区' }, { 'name': '天尔名庭', 'value': 1.0 }],
          [{ 'name': '阿里巴巴滨江新园区' }, { 'name': '天境福邸', 'value': 3.0 }],
          [{ 'name': '阿里巴巴滨江新园区' }, { 'name': '听澜越府', 'value': 1.0 }],
          [{ 'name': '阿里巴巴滨江新园区' }, { 'name': '万科前宸', 'value': 1.0 }],
          [{ 'name': '阿里巴巴滨江新园区' }, { 'name': '望林府', 'value': 2.0 }],
          [{ 'name': '阿里巴巴滨江新园区' }, { 'name': '望运河云庄北区', 'value': 2.0 }],
          [{ 'name': '阿里巴巴滨江新园区' }, { 'name': '西径晓风', 'value': 1.0 }],
          [{ 'name': '阿里巴巴滨江新园区' }, { 'name': '西野风韵春山明月苑二期', 'value': 1.0 }],
          [{ 'name': '阿里巴巴滨江新园区' }, { 'name': '溪谷岚湾', 'value': 12.0 }],
          [{ 'name': '阿里巴巴滨江新园区' }, { 'name': '溪上云峰府', 'value': 2.0 }],
          [{ 'name': '阿里巴巴滨江新园区' }, { 'name': '湘印府', 'value': 2.0 }],
          [{ 'name': '阿里巴巴滨江新园区' }, { 'name': '祥宸府', 'value': 2.0 }],
          [{ 'name': '阿里巴巴滨江新园区' }, { 'name': '萧澜隐翠轩', 'value': 1.0 }],
          [{ 'name': '阿里巴巴滨江新园区' }, { 'name': '萧政储出2017_12号地块', 'value': 1.0 }],
          [{ 'name': '阿里巴巴滨江新园区' }, { 'name': '晓月和风', 'value': 1.0 }],
          [{ 'name': '阿里巴巴滨江新园区' }, { 'name': '新越锦宸名邸', 'value': 1.0 }],
          [{ 'name': '阿里巴巴滨江新园区' }, { 'name': '星创城映月璟园', 'value': 1.0 }],
          [{ 'name': '阿里巴巴滨江新园区' }, { 'name': '星合映公寓', 'value': 2.0 }],
          [{ 'name': '阿里巴巴滨江新园区' }, { 'name': '星图光年轩', 'value': 2.0 }],
          [{ 'name': '阿里巴巴滨江新园区' }, { 'name': '星未来云邸', 'value': 3.0 }],
          [{ 'name': '阿里巴巴滨江新园区' }, { 'name': '星遇光年府', 'value': 2.0 }],
          [{ 'name': '阿里巴巴滨江新园区' }, { 'name': '兴耀星漫里', 'value': 1.0 }],
          [{ 'name': '阿里巴巴滨江新园区' }, { 'name': '秀隐翠园', 'value': 1.0 }],
          [{ 'name': '阿里巴巴滨江新园区' }, { 'name': '燕语海棠轩', 'value': 2.0 }],
          [{ 'name': '阿里巴巴滨江新园区' }, { 'name': '阳光城翡丽公园', 'value': 2.0 }],
          [{ 'name': '阿里巴巴滨江新园区' }, { 'name': '杨柳郡园', 'value': 2.0 }],
          [{ 'name': '阿里巴巴滨江新园区' }, { 'name': '养云静舍', 'value': 2.0 }],
          [{ 'name': '阿里巴巴滨江新园区' }, { 'name': '艺郡府', 'value': 1.0 }],
          [{ 'name': '阿里巴巴滨江新园区' }, { 'name': '映月台公寓', 'value': 1.0 }],
          [{ 'name': '阿里巴巴滨江新园区' }, { 'name': '余政储出2017_13号地块', 'value': 2.0 }],
          [{ 'name': '阿里巴巴滨江新园区' }, { 'name': '余政储出2018_15号地块', 'value': 1.0 }],
          [{ 'name': '阿里巴巴滨江新园区' }, { 'name': '远洋西溪公馆', 'value': 8.0 }],
          [{ 'name': '阿里巴巴滨江新园区' }, { 'name': '月映海棠园', 'value': 1.0 }],
          [{ 'name': '阿里巴巴滨江新园区' }, { 'name': '月咏新辰轩', 'value': 2.0 }],
          [{ 'name': '阿里巴巴滨江新园区' }, { 'name': '悦东方臻园', 'value': 1.0 }],
          [{ 'name': '阿里巴巴滨江新园区' }, { 'name': '云都汇中心', 'value': 1.0 }],
          [{ 'name': '阿里巴巴滨江新园区' }, { 'name': '云湖台公寓', 'value': 4.0 }],
          [{ 'name': '阿里巴巴滨江新园区' }, { 'name': '云境名邸', 'value': 1.0 }],
          [{ 'name': '阿里巴巴滨江新园区' }, { 'name': '云空城星之里', 'value': 10.0 }],
          [{ 'name': '阿里巴巴滨江新园区' }, { 'name': '云澜天第府', 'value': 1.0 }],
          [{ 'name': '阿里巴巴滨江新园区' }, { 'name': '云起未来', 'value': 1.0 }],
          [{ 'name': '阿里巴巴滨江新园区' }, { 'name': '云蔚轩', 'value': 5.0 }],
          [{ 'name': '阿里巴巴滨江新园区' }, { 'name': '中国铁建·西湖国际城', 'value': 3.0 }],
          [{ 'name': '阿里巴巴滨江新园区' }, { 'name': '中南君奥时代', 'value': 1.0 }],
          [{ 'name': '阿里巴巴滨江新园区' }, { 'name': '中天琤府', 'value': 1.0 }],
          [{ 'name': '阿里巴巴滨江新园区' }, { 'name': '卓蓝华庭', 'value': 4.0 }],
          [{ 'name': '阿里巴巴滨江新园区' }, { 'name': '卓越·蔚蓝领秀二期', 'value': 1.0 }],
          [{ 'name': '阿里巴巴滨江新园区' }, { 'name': '紫辰花园', 'value': 2.0 }],
          [{ 'name': '阿里巴巴滨江新园区' }, { 'name': '紫樾府', 'value': 1.0 }],
        ];
        // console.log(this.geoCoordMap)
        var planePath = "path://M1705.06,1318.313v-89.254l-319.9-221.799l0.073-208.063c0.521-84.662-26.629-121.796-63.961-121.491c-37.332-0.305-64.482,36.829-63.961,121.491l0.073,208.063l-319.9,221.799v89.254l330.343-157.288l12.238,241.308l-134.449,92.931l0.531,42.034l175.125-42.917l175.125,42.917l0.531-42.034l-134.449-92.931l12.238-241.308L1705.06,1318.313z";
        //var planePath = 'arrow';
        var convertData = function (data) {
          var res = [];
          // console.log(geocoord)
          for (var i = 0; i < data.length; i++) {
            var dataItem = data[i];
            var fromCoord = geocoord[dataItem[0].name];
            var toCoord = geocoord[dataItem[1].name];
            if (fromCoord && toCoord) {
              res.push({
                fromName: dataItem[0].name,
                toName: dataItem[1].name,
                coords: [fromCoord, toCoord],
                value: dataItem[1].value
              });
            }
          }
          // console.log(dataItem);
          return res;
        };
        var color = ["#a6c84c", "#ffa022", "#46bee9"]; //航线的颜色
        var series = [];
        var value=[];
        // [
        //   ["西溪联合科技广场", ALXXData],
        //   ["浙江海外高层次人才创新园", ALHWData],
        //   ["阿里巴巴滨江新园区", ALXYData]
        // ]
        this.sum_arr.forEach(function (item, i) {
          // console.log(item[1].map(x => x[1].value))
          item[1].map(x => value.push(x[1].value))
          // console.log(value)
          series.push(
            // {
            //   name: item[0],
            //   coordinateSystem: 'amap',
            //   type: "lines",
            //   zlevel: 1,
            //   effect: {
            //     show: true,
            //     period: 6,
            //     trailLength: 0.7,
            //     color: "red", //arrow箭头的颜色
            //     symbolSize: 3
            //   },
            //   lineStyle: {
            //     color: color[i],
            //     width: 0,
            //     curveness: 0.2
            //   },
            //   data: convertData(item[1])
            // },
            {
              name: item[0],
              coordinateSystem: 'amap',
              type: "lines",
              zlevel: 2,
              symbol: ["none", "arrow"],
              symbolSize: 10,
              // effect: {
              //   show: true,
              //   period: 6,
              //   trailLength: 0,
              //   symbol: planePath,
              //   symbolSize: 15
              // },
              lineStyle: {
                color: color[i],
                width: 1,
                opacity: 0.6,
                curveness: 0.2
              },
              data: convertData(item[1])
            },
            // {
            //   name: item[0],
            //   coordinateSystem: 'amap',
            //   type: "effectScatter",
            //   // coordinateSystem: "geo",
            //   zlevel: 2,
            //   rippleEffect: {
            //     brushType: "stroke"
            //   },
            //   label: {
            //     show: true,
            //     position: "right",
            //     formatter: "{b}"
            //   },
            //   symbolSize: function (val) {
            //     return val[2] * 8;
            //   },
            //   itemStyle: {
            //     color: color[i],
            //   },
            //   emphasis: {
            //     areaColor: "#2B91B7"
            //   },
            //   data: item[1].map(function (dataItem) {
            //     return {
            //       name: dataItem[1].name,
            //       value: geoCoordMap[dataItem[1].name].concat([dataItem[1].value])
            //     };
            //   })
            // }
          );
        });
        // console.log(convertData(item[1]))
        var option = {
          amap: {// 高德地图配置
            // center: [104.114129, 37.550339], // 地图中心点120.023414, 30.275322
            center: [120.023414, 30.275322], // 地图中心点
            zoom: 11,// 地图缩放级别
            viewMode: '3D',// 地图模式
            resizeEnabled: true,// 是否监控地图容器尺寸变化
            mapStyle: 'amap://styles/blue',// 地图样式
            pitch: 15, //视角高度
            opacity: 0.1,
            title: 'dfsfssdfsd',
            skyColor: "#33216a", //天空颜色
          },
          title: {
            text: '摇号人次流向分布图',
            right: 'center',
            textStyle: {
              color: '#ccc',
              fontSize: 24
            }
          },
          tooltip: {
            trigger: "item",
            formatter: function (params, ticket, callback) {
              if (params.seriesType == "effectScatter") {
                return "线路：" + params.data.name + "" + params.data.value[2];
              } else if (params.seriesType == "lines") {
                return (
                  params.data.fromName +
                  "->" +
                  params.data.toName +
                  "<br />" +
                  params.data.value
                );
              } else {
                return params.name;
              }
            }
          },
          legend: {
            orient: "vertical",
            top: 10,
            left: "right",
            type: 'plain',
            // data: function (params, ticket, callback) { return params.data.value},
            data: this.sname,
            textStyle: {
              color: "#fff",
              fontSize: 14
            },
            selectedMode: "multiple"
          },
          visualMap: { //图例值控制
            type: 'piecewise',
            min: Math.min(...value),
            max: Math.max(...value),
            calculable: true,
            bottom: 80,
            show: true,
            color: ['#f44336', '#fc9700', '#ffde00', '#ffde00', '#00eaff'],
            textStyle: {
              color: '#fff'
            }
          },
          // geo: {
          //   map: "china",
          //   coordinateSystem:'amap',
          //   label: {
          //     emphasis: {
          //       show: true,
          //       color: "#fff"
          //     }
          //   },
          //   // 把中国地图放大了1.2倍
          //   zoom: 1.2,
          //   roam: true,
          //   scaleLimit: {
          //     min: 0.5, // 最小的缩放值
          //     max: 3, // 最大的缩放值
          //   },
          //   itemStyle: {
          //     normal: {
          //       // 地图省份的背景颜色
          //       areaColor: "rgba(20, 41, 87,0.6)",
          //       borderColor: "#195BB9",
          //       borderWidth: 1
          //     },
          //     emphasis: {
          //       areaColor: "#2B91B7"
          //     }
          //   }
          // },
          series: series
        };
        myChart.setOption(option);
        myChart.getModel().getComponent('amap').getAMap();//获取高德地图实例
        // 监听浏览器缩放，图表对象调用缩放resize函数
        window.addEventListener("resize", function () {
          myChart.resize();
        });
      });
    },
    // 设置定时器
    getTimes() {
      setInterval(this.getTimesInterval, 1000);
    },
    // 获取时间函数
    getTimesInterval() {
      let year = new Date().getFullYear(); //获取当前时间的年份
      let month = new Date().getMonth() + 1; //获取当前时间的月份
      let day = new Date().getDate(); //获取当前时间的天数
      let hours = new Date().getHours(); //获取当前时间的小时
      let minutes = new Date().getMinutes(); //获取当前时间的分数
      let seconds = new Date().getSeconds(); //获取当前时间的秒数
      //当小于 10 的是时候，在前面加 0
      if (hours < 10) {
        hours = "0" + hours;
      }
      if (minutes < 10) {
        minutes = "0" + minutes;
      }
      if (seconds < 10) {
        seconds = "0" + seconds;
      }
      //拼接格式化当前时间
      this.times = "当前时间：" + year + "年" + month + "月" + day + "日" + "-" + hours + "时" + minutes + "分" + seconds + "秒";
    },
    // 获取接口数据
    getData(x, name) {
      axios.get(x, name)
        .then(res => {
          console.log(res);
          for (var i = 0; i < res.data.data.length; i++) {
            this.$set(this.coname, res.data.data[i].CR_ENTERPRISE)
            if (res.data.data[i].CR_ENTERPRISE === name) {
              this.$set(this.sgeoCoordMap, res.data.data[i].CR_COMPANY_LOCATION, [res.data.data[i].CR_COMPANY_LONGITUDE, res.data.data[i].CR_COMPANY_LATITUDE])
              this.$set(this.egeoCoordMap, res.data.data[i].CR_RECORD_NAME, [res.data.data[i].CR_ESTATE_LONGITUDE, res.data.data[i].CR_ESTATE_LATITUDE])
            }
          }
          for (var key in this.sgeoCoordMap) {
            // console.log(key.split('').reverse().join(''));
            this.sname.push(key)
            let arr = [];
            [...res.data.data].map(x => {
              if (x.CR_COMPANY_LOCATION === key) {
                // console.log(x.CR_RECORD_NAME)
                arr.push([{ 'name': key }, { 'name': x.CR_RECORD_NAME, 'value': x.num }])
              }
            })
            this.sum_arr.push([key, arr]);
            this.geoCoordMap[key] = this.sgeoCoordMap[key]
          }
          // console.log(this.sum_arr)
          for (var key in this.egeoCoordMap) {
            this.geoCoordMap[key] = this.egeoCoordMap[key]
          }
          console.log(res)
          console.log(this.coname)
        })
    },
  }
};
</script>

<style scoped>
@import '../../css/VisualReports.css';
</style>
