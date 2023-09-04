<style scoped>
/* 子页选中后bg颜色 */
.el-menu-item:hover {
  background-color: rgb(38, 52, 69) !important;
}

/* 主页背景颜色 */
.el-menu {
  border-right: none !important;
  background-color: #304156 !important;
}

.el-submenu {
  background-color: #3d526d;
}

/* 深选择器：如果相对设置了scoped的子组件里的元素进行控制可以使用'>>>'或者'deep'设置选中或悬浮的颜色*/
.el-submenu /deep/ .el-submenu__title:hover {
  background-color: rgb(38, 52, 69) !important;
}

/* 无选项时其余bg颜色，应与itembg一致 */
.el-aside {
  background-color: #304156;
}

/* 子页展开后颜色 */
.el-menu-item {
  background-color: #3d526d !important;
}

.el-menu-item [class^=el-icon-] {
  margin-right: 15px !important;
}

.el-submenu [class^=el-icon-] {
  margin-right: 15px !important;
}

/* 专为首页设置，因为标签问题 */
.itembg {
  background-color: #304156 !important;
}

/* 首页选中后bg颜色，与el-menu-item:hover一致 */
.itembg:hover {
  background-color: rgb(38, 52, 69) !important;
}

.toggle-button {
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>

<template>
  <el-aside :width="isCollapse ? '64px' : '15%'" :style="{ 'min-width': isCollapse ? '64px' : '350px' }">
    <div class="toggle-button" @click="toggleCollapse">|||</div>
    <el-menu :default-active="defaultActive" :collapse="isCollapse" text-color="#bfcbd9" active-text-color="#409EFF"
      class="el-menu-vertical-demo" :collapse-transition="false" router>
      <div v-for="(item, index) in submenuList" :key="index">
        <!-- 一级菜单（没有任何子级菜单）-->
        <el-menu-item class="itembg" :index="item.path" v-if="!item.menuList">
          <i :class="item.icon"></i>
          {{ item.title }}
        </el-menu-item>
        <!-- 一级菜单（有子级菜单）-->
        <el-submenu :index="item.path" v-else>
          <template slot="title">
            <i :class="item.icon"></i>
            {{ item.title }}
          </template>
          <!-- 遍历二级菜单容器 -->
          <div v-for="(i, index) in item.menuList" :key="index">
            <!-- 判断二级菜单（没有三级菜单）-->
            <el-menu-item :index="i.path" v-if="!i.list">
              <i :class="i.icon"></i>
              {{ i.title }}
            </el-menu-item>
            <!-- 判断二级菜单（有三级菜单）-->
            <el-submenu :index="i.path" v-if="i.list">
              <template slot="title">
                <i :class="i.icon"></i>
                {{ i.title }}
              </template>
              <div v-for="(j, index) in i.list" :key="index">
                <!-- 判断三级菜单（没有四级菜单）-->
                <el-menu-item :index="j.path" v-if="!j.list">
                  <i :class="j.icon"></i>
                  {{ j.title }}
                </el-menu-item>
                <!-- 判断三级菜单（有四级菜单）-->
                <el-submenu :index="j.path" v-if="j.list">
                  <template slot="title">
                    <i :class="j.icon"></i>
                    {{ j.title }}
                  </template>
                  <el-menu-item :index="k.path" v-for="(k, index) in j.list" :key="index">
                    <i :class="k.icon"></i>
                    {{ k.title }}
                  </el-menu-item>
                </el-submenu>
              </div>
            </el-submenu>
          </div>
        </el-submenu>
      </div>
    </el-menu>
  </el-aside>
</template>
<script>
export default {
  computed: {
    defaultActive: function () {
      return this.$route.path.replace('/', '');
    }
  },
  data() {
    return {
      startRouter: true,//开启路由标识， ，启用该模式会在激活导航时以 index 作为 path 进行路由跳转
      isCollapse: false,
      submenuList: [
        // 首页大屏
        {
          title: '首页大屏',
          path: '首页大屏',
          icon: 'el-icon-menu',
          menuList: [
            // 大屏展示原
            {
              title: '大屏原',
              path: '/VisualReports'
            },
            // 大屏展示1
            {
              title: '大屏展示1',
              path: '/VisualReports1'
            },
            // 大屏展示2
            {
              title: '大屏展示2',
              path: '/VisualReports2'
            },
            // 大屏展示3
            {
              title: '大屏展示3',
              path: '/VisualReports3'
            },
            // test
            {
              title: 'test',
              path: '/test'
            },
          ]
        },

        // 数据管理
        {
          title: '数据管理',
          path: '数据管理',
          icon: 'el-icon-menu',
          menuList: [
            // 用户列表
            {
              title: '用户列表',
              path: '/UserList'
            },
            // 货款数据
            {
              title: '货款数据',
              path: '/Daikuan'
            },
          ]
        },

        // 数据分析
        {
          title: '数据分析',
          path: '数据分析',
          icon: 'el-icon-menu',
          menuList: [
            // 柱状动态排序
            {
              title: '柱状动态排序',
              path: '/Echarts_BarRace'
            },
            // 柱形堆叠图
            {
              title: '柱形堆叠图',
              path: '/zhuduidie'
            },
            // 3D示意图
            {
              title: '3D示意图',
              path: '/moveplt'
            },
            // 双柱单线
            {
              title: '双柱单线',
              path: '/zhuxiantu'
            },
            // 多图-双线
            {
              title: '多图-双线',
              path: '/fangjiadata'
            },
            // 上传
            {
              title: '上传',
              path: '上传',
              list: [
                {
                  title: '万能图',
                  path: '/Changeable_Chart'
                },
                {
                  title: '柱线图',
                  path: '/Bar_Line_Chart'
                },
                {
                  title: '堆叠图',
                  path: '/Bar_Plus'
                },
                {
                  title: '折线图',
                  path: '/Line_Chart'
                },
                {
                  title: '柱线包含图',
                  path: '/Bar_Inner'
                },
              ]
            },
          ]
        },

        // 高德地图
        {
          title: '高德地图',
          path: '高德地图',
          icon: 'el-icon-menu',
          menuList: [
            // Echarts地图下钻
            {
              title: 'Echarts地图下钻',
              path: '/echarts_map'
            },
            {
              title: 'Lab_文字图层_省',
              path: '/Lab_Pro',
            },
            // JS_行政区划
            {
              title: '地图_JS',
              path: '地图_JS',
              list: [
                // JS_行政区划
                {
                  title: 'JS_行政区划',
                  path: '/JS_areaNode'
                },
                // JS_行政区划_kmz
                {
                  title: 'JS_行政区划_kmz',
                  path: '/JS_areaNode_kmz'
                },
                // 地图-省
                {
                  title: '地图-省',
                  path: '/JS_Pro'
                },
                // JS_行政区划_市
                {
                  title: '地图-城市',
                  path: '/JS_CITY'
                },
                // 地图-板块-点
                {
                  title: '地图-板块-点',
                  path: '/JS_Plate_Pon'
                },
                // 地图—板块
                {
                  title: '板块平均中签率',
                  path: '/JS_Plate'
                },
                {
                  title: '地图-杭州市-区县市',
                  path: '/JS_HZDis'
                },
              ]
            },
            {
              title: 'Loca-圆点',
              path: 'Loca-圆点',
              list: [
                // Loca-圆点
                {
                  title: 'Loca-圆点',
                  path: '/loca_RoundPointLayer'
                },
                // 总人口和家庭户人口
                {
                  title: 'rou-总人口和家庭户人口',
                  path: '/rou_cpc_pou_avgschy'
                },
                // Loca-圆点-大量
                {
                  title: '圆点-大量',
                  path: '/Rou_Lot_Pon'
                },
                // Loca-圆点-动画
                {
                  title: 'Loca-圆点-动画',
                  path: '/loca_RoundPointLayer_animate'
                },
                // Loca-圆点-动态
                {
                  title: 'Loca-圆点-动态',
                  path: '/loca_RoundPointLayer_dynamic'
                },
              ]
            },
            {
              title: 'Loca-网格蜂窝',
              path: 'Loca-网格蜂窝',
              list: [
                {
                  title: 'Loca-杭州二手房',
                  path: '/loca_GridLayer_HexagonLayer'
                },
                {
                  title: '蜂窝-省',
                  path: '/Hex_Pro'
                },
                {
                  title: 'gird-分市累计摇号人数',
                  path: '/gird_city_num_allyear'
                },
                {
                  title: '蜂窝-浙江省-城市',
                  path: '/Hex_ZJCity'
                },
                {
                  title: '网格-点',
                  path: '/Gird_Lot_Pon'
                },
              ]
            },

            {
              title: 'Loca-飞线',
              path: 'Loca-飞线',
              list: [
                // Loca-飞线
                {
                  title: 'Loca-飞线',
                  path: '/loca_LineLayer'
                },
                // Loca-飞线-动态
                {
                  title: 'Loca-飞线-动态',
                  path: '/loca_LineLayer_animate'
                },
              ]
            },
            {
              title: '转换',
              path: '/Change'
            },
            // Loca-多边形
            {
              title: 'Loca-多边形',
              path: '/loca_PolygonLayer'
            },
            // Loca-3D热力图
            {
              title: 'Loca-3D热力图',
              path: 'Loca-3D热力图',
              list: [
                {
                  title: '3D热力图-市',
                  path: '/Heat_City'
                },
                {
                  title: '3D热力图-省',
                  path: '/Heat_Pro'
                },
                {
                  title: '3D热力图-杭州市-区县市',
                  path: '/Heat_HZDis'
                }
              ]
            },
            // 等值线
            {
              title: '等值线',
              path: '等值线',
              list: [
                {
                  title: '等值线-省',
                  path: '/Con_Pro'
                },
              ]
            },
            // Ech-Map
            {
              title: 'Ech-Map',
              path: 'Ech-Map',
              list: [
                {
                  title: 'Ech-省',
                  path: '/Ech_pro'
                },
              ]
            },
          ]
        },

        // 图表集~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        {
          title: '图表集',
          path: '图表集', // path无用，请唯一
          icon: 'el-icon-menu',
          menuList: [
            {
              title: '摇号数据',
              path: '/摇号数据',
              list: [
                {
                  title: '五年数量对比',
                  path: '/五年数量对比',
                  list: [
                    {
                      title: '5年-柱状图',
                      path: '/yaohao_bar1'
                    },
                    {
                      title: '5年-折线图',
                      path: '/yaohao_line1'
                    },
                    {
                      title: '5年-饼图',
                      path: '/yaohao_pie1'
                    },
                    {
                      title: '5年-雷达图',
                      path: '/yaohao_radar'
                    },
                    {
                      title: '5年-柱状图2',
                      path: '/yaohao_hbar'
                    },
                    {
                      title: '净增瀑布图',
                      path: '/yaohao_add'
                    },
                  ]
                },
                {
                  title: '距离分布',
                  path: '/',
                  list: [
                    {
                      title: '距离分布-柱状图',
                      path: '/yaohao_bar'
                    },
                    {
                      title: '距离分布-折线图',
                      path: '/yaohao_line'
                    },
                    {
                      title: '距离分布-玫瑰图',
                      path: '/yaohao_pie'
                    },
                  ]
                },
                {
                  title: '流向分布',
                  path: '/流向分布',
                  list: [
                    {
                      title: '流向分布-阿里',
                      path: '/fly_al'
                    },
                    {
                      title: '流向分布-华为',
                      path: '/fly_hw'
                    },
                    {
                      title: '流向分布-链家',
                      path: '/fly_lj'
                    },
                  ]
                },
                {
                  title: 'PPT数据',
                  path: '/PPT数据',
                  list: [
                    {
                      title: '新杭州人购房占比',
                      path: '/new_buy_house',
                    },
                    {
                      title: '新杭州人购房板块TOP10',
                      path: '/new_buy_house_top10',
                    },
                    {
                      title: '老杭州人购房板块TOP10',
                      path: '/old_buy_house_top10',
                    },
                    {
                      title: '杭州摇号男女购房占比',
                      path: '/boy_girl_percentage',
                    },
                    {
                      title: '摇号购房登记男女占比',
                      path: '/buy_house_boy_girl',
                    },
                    {
                      title: '杭州摇号户别占比',
                      path: '/household_percentage',
                    },
                    {
                      title: '杭州购房登记户别占比',
                      path: '/buy_house_family',
                    },
                    {
                      title: '杭州摇号有无房占比',
                      path: '/have_house_percentage',
                    },
                    {
                      title: '杭州共有产权登记男女占比',
                      path: '/jo_regist_boy_girl_percentage',
                    },
                    {
                      title: '杭州摇号共有产权人数占比',
                      path: '/joint_ownership_percentage',
                    },
                    {
                      title: '浙江省摇号总户数占比',
                      path: '/water_zhejiang_percertage',
                    },
                    {
                      title: '省外摇号登记人数TOP10',
                      path: '/out_province_regist_top10',
                    },
                    {
                      title: '杭州市摇号按性别比重多的省份',
                      path: '/buy_house_bg_more',
                    },
                    {
                      title: '杭州市摇号按性别所占省份',
                      path: '/buy_house_city_bg_per',
                    },
                    {
                      title: '浙江省人在杭州摇号男女占比',
                      path: '/zhejiang_yh_bg_per',
                    },
                    {
                      title: '杭州购房人数情况比较',
                      path: '/buy_house',
                    },
                    {
                      title: '区流摇率走势',
                      path: '/region_loss_per',
                    },
                    {
                      title: '累计摇号登记次数占比',
                      path: '/regist',
                    },
                    {
                      title: '登记人数增长情况',
                      path: '/regist_add',
                    },
                    {
                      title: '累计净增购房人有无房占比',
                      path: '/have_house_increase',
                    },
                    {
                      title: '杭州市摇号套均竞争热度',
                      path: '/increase_hot',
                    },
                    {
                      title: '买房人数流失情况',
                      path: '/buy_house_loss',
                    },
                    {
                      title: '剩余买房人数',
                      path: '/rest_buy_house',
                    },
                    {
                      title: '杭州市落户人才摇号占比',
                      path: '/settled_talent',
                    },
                    {
                      title: '杭州人才摇号增速',
                      path: '/talent_growth',
                    },
                  ]
                },
              ]
            },
            {
              title: '购房数据',
              path: '/购房数据',
              list: [
                {
                  title: '对比图',
                  path: '/对比图',
                  list: [
                    {
                      title: '购房-堆叠图',
                      path: '/buyhouse_line'
                    },
                  ]
                },
                {
                  title: '其他分布',
                  path: '/',
                  list: [

                  ]
                },
              ]
            },
            {
              title: '摇号数据1',
              path: '/yaohao1'
            }
          ]
        },
        // 小王
        {
          title: '自定义',
          path: '自定义',
          icon: 'el-icon-menu',
          menuList: [
            // test_1
            {
              title: '框架',
              path: '/test_1'
            },
            // test_2
            {
              title: '上传',
              path: '/test_2'
            },
            {
              title: '样式',
              path: '/test_3'
            },
          ]
        },
      ]
    }
  },

  methods: {
    // 点击按钮，切换菜单的折叠与展开
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
    },
  }
};
</script>

