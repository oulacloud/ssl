// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// import 'default-passive-events'
import Vue from 'vue'
import App from './App'
import router from './router/index'
import * as echarts from 'echarts';
import dataV from '@jiaminghi/data-view'
import 'jquery'
import VueClipboard from 'vue-clipboard2'
import MyLengend from './components/custom/components/myEcharts.vue'
Vue.component('MyLengend',MyLengend)
import MyTitle from './components/custom/components/myTitle.vue'
Vue.component('MyTitle',MyTitle)
import JsonExcel from 'vue-json-excel'
Vue.component('downloadExcel', JsonExcel)

Vue.prototype.$echarts = echarts //Vue.prototype.$echarts = echarts


import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)
import axios from 'axios' 
Vue.prototype.$axios = axios


Vue.use(dataV)
Vue.use(VueClipboard)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})



// import VueAMap from 'vue-amap';
// Vue.use(VueAMap);
// VueAMap.initAMapApiLoader({
//   //申请地址 https://lbs.amap.com/ 选择web端jsAPI
//   key: '4091cbcc08c517102220173c5e585b88',
//   // 插件集合
//   plugin: ['AMap.Autocomplete', 'AMap.PlaceSearch', 'AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType', 'AMap.PolyEditor', 'AMap.CircleEditor', 'AMap.DistrictLayer'],
//   version: '1.4.15',
//   uiVersion: '1.1',
//   Loca: ''
// })

// import AMapLoader from '@amap/amap-jsapi-loader';
// Vue.use(AMapLoader)

// AMapLoader.load({
//     key: "4091cbcc08c517102220173c5e585b88",              // 申请好的Web端开发者Key，首次调用 load 时必填
//     version: "2.0",   // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
//     plugin: ['AMap.Autocomplete', 'AMap.PlaceSearch', 'AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType', 'AMap.PolyEditor', 'AMap.CircleEditor', 'AMap.DistrictLayer'],
//     AMapUI: {
//         // 是否加载 AMapUI，缺省不加载
//         version: '1.1', // AMapUI 缺省 1.1
//         plugin: [],
//     },
//     Loca: {
//         // 是否加载 Loca， 缺省不加载
//         version: '2.0.0' // Loca 版本，缺省 1.3.2
//     }
// })
// .then((AMap) => {
//     // 挂载AMap
//     Vue.prototype.$AMap = AMap;
// });
