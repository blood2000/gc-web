import Vue from 'vue'

import Cookies from 'js-cookie'
// require('./mock');
import Element from 'element-ui'
import './assets/styles/element-variables.scss'
import '@/assets/styles/index.scss'; // global css
import '@/assets/styles/ddc.scss'; // ddc css
import '@/assets/styles/dispatch.scss'; // ddc css
import '@/assets/styles/page-layout.scss'// ddc css
import '@/assets/iconfont/iconfont.css'; // 字体图标
// import '@/assets/menu_iconfont/style.css'; // 字体图标
import '@/assets/styles/queryForm.scss'; // 搜索表单组件 css
import App from './App'
import store from './store'
import router from './router'
import directive from './directive' //directive

import './assets/icons' // icon
import './permission' // permission control
import { getDicts } from "@/utils/request";
import { getConfigKey } from "@/api/system/config";
import { parseTime, resetForm, addDateRange, selectDictLabel, selectDictLabels, handleTree } from "@/utils/ruoyi";
import { download } from "@/utils/request";
// 表单校验
import formValidate from '@/utils/formValidate';
// 分页组件
import Pagination from "@/components/Pagination";
// 自定义表格工具组件
import RightToolbar from "@/components/RightToolbar"
// 富文本组件
import Editor from "@/components/Editor"
// 文件上传组件
import FileUpload from "@/components/FileUpload"
// 图片上传组件
import ImageUpload from "@/components/ImageUpload"
// 字典标签组件
import DictTag from '@/components/DictTag'
// // 头部标签组件
// import VueMeta from 'vue-meta'
// 表头
import RefactorTable from '@/components/ddc/tin/RefactorTable';
//左侧标题蓝条
import TitleSideBlueTip   from '@/components/titleSideBlueTip'
import 'iview/dist/styles/iview.css';    // 使用 CSS
import {Switch } from 'iview'
// 高德地图vue组件库
import VueAMap from 'vue-amap';
Vue.use(VueAMap);
VueAMap.initAMapApiLoader({
  key: '2066cb0dafaa492aee47fa1090227a38', // 高德企业key
  plugin: ['AMap.Autocomplete', 'AMap.PlaceSearch', 'AMap.Scale', 'AMap.Driving', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType', 'AMap.PolyEditor', 'AMap.CircleEditor', 'AMap.Geocoder', 'AMap.Marker', 'AMap.MarkerClusterer'],
  v: '1.4.4',
  uiVersion: '1.1.1'
});

import VideoPlayer from 'vue-video-player';
require('video.js/dist/video-js.css');
require('vue-video-player/src/custom-theme.css');
Vue.use(VideoPlayer);
import "videojs-flash";

// 全局方法挂载
Vue.prototype.amapKey = '2066cb0dafaa492aee47fa1090227a38'
Vue.prototype.getDicts = getDicts
Vue.prototype.getConfigKey = getConfigKey
Vue.prototype.parseTime = parseTime
Vue.prototype.resetForm = resetForm
Vue.prototype.addDateRange = addDateRange
Vue.prototype.selectDictLabel = selectDictLabel
Vue.prototype.selectDictLabels = selectDictLabels
Vue.prototype.download = download
Vue.prototype.handleTree = handleTree
Vue.prototype.formValidate = formValidate

Vue.prototype.msgSuccess = function (msg) {
  this.$message({ showClose: true, message: msg, type: "success" });
}

Vue.prototype.msgError = function (msg) {
  this.$message({ showClose: true, message: msg, type: "error" });
}

Vue.prototype.msgWarning = function (msg) {
  this.$message({ showClose: true, message: msg, type: 'warning' });
}

Vue.prototype.msgInfo = function (msg) {
  this.$message.info({ showClose: true, message: msg, type: 'info' });
}

// 全局组件挂载
Vue.component('DictTag', DictTag)
Vue.component('Pagination', Pagination)
Vue.component('RightToolbar', RightToolbar)
Vue.component('Editor', Editor)
Vue.component('FileUpload', FileUpload)
Vue.component('ImageUpload', ImageUpload)
Vue.component('RefactorTable',RefactorTable)
Vue.use(directive)
Vue.component('TitleSideBlueTip',TitleSideBlueTip)
Vue.component('iSwitch',Switch)
// Vue.use(VueMeta)

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online! ! !
 */

Vue.use(Element, {
  size: Cookies.get('size') || 'medium' // set element-ui default size
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
