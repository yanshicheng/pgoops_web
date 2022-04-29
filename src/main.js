import Vue from 'vue'
import Json2yaml from 'json2yaml'
import Cookies from 'js-cookie'
import MonacoEditor from 'vue-monaco-editor'
// MonacoEditor.languages.registerCompletionItemProvider(
//   'yaml');

Vue.component('MonacoEditor', MonacoEditor)
import Highlight from './utils/highlights'
Vue.use(Highlight)
import Prism from 'prismjs'
Vue.use(Prism)

import VueCodeMirror from 'vue-codemirror'
import 'codemirror/lib/codemirror.css'
Vue.use(VueCodeMirror)

// import AnsiUp from "ansi_up";
// Vue.use(AnsiUp)
// import hljs from 'highlight  .js';
// import 'highlight.js/styles/googlecode.css' //样式文件
//
// Vue.directive('highlight',function (el) {
//   let blocks = el.querySelectorAll('pre code');
//   setTimeout(() =>{
//     blocks.forEach((block)=>{
//       hljs.highlightBlock(block)
//     })
//   }, 200)
// })
// Vue.use(hljs)
// import hljs from 'highlight.js';
// import javascript from 'highlight.js/lib/languages/javascript';
// import hljsVuePlugin from '@highlightjs/vue-plugin';
//
// hljs.registerLanguage('javascript', javascript);
//
// Vue.use(hljsVuePlugin)

// Tell Vue.js to use vue-highlightjs

// Vue.use(Prism)
// Vue.prototype.$prism = Prism
Vue.use(Json2yaml)
// import hljs from 'highlight.js'
// import 'highlight.js/styles/atom-one-dark.css'
//
// Vue.use(hljs)

// Vue.directive('v-highlightjs', function (el) {
//   let blocks = el.querySelectorAll('pre code');
//   blocks.forEach((block) => {
//     hljs.highlightBlock(block)
//     block.innerHTML = `<ol><li>${block.innerHTML.replace(
//       /\n/g,
//       `</li><li class='line'>`
//     )}</li></ol>`;
//   })
// })
// import hljs from 'highlight.js'
// import 'highlight.js/styles/atom-one-dark.css'
// Vue.directive('highlight', function (el) {
//   const blocks = el.querySelectorAll('pre code');
//   blocks.forEach((block) => {
//     hljs.highlightBlock(block);
//     // 从这开始是设置行号
//     block.innerHTML = `<ol><li>${block.innerHTML.replace(
//       /\n/g,
//       `</li><li class='line'>`
//     )}</li></ol>`;
//   });
// });

// Vue.directive('highlight', function (el) {
//   let blocks = el.querySelectorAll('pre code');
//   blocks.forEach((block) => {
//     hljs.highlightBlock(block)
//   })
// })
// // 自定义指令
// Vue.directive('highlight', function (el) {
//   const blocks = el.querySelectorAll('pre code')
//   blocks.forEach((block) => {
//     hljs.highlightBlock(block)
//     // 从这开始是设置行号
//     block.innerHTML = `<ol><li>${block.innerHTML.replace(
//       /\n/g,
//       `</li><li class='line'>`
//     )}</li></ol>`
//   })
// })
// Vue.use(hljs.vuePlugin)

const echarts = require('echarts')
Vue.prototype.$echarts = echarts
import 'normalize.css/normalize.css' // a modern alternative to CSS resets

import Element from 'element-ui'
import './styles/element-variables.scss'
// import enLang from 'element-ui/lib/locale/lang/zh-CN'// 如果使用中文语言包请默认支持，无需额外引入，请删除该依
import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import './icons' // icon
import './permission' // permission control
import './utils/error-log' // error log

import * as filters from './filters' // global filters

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
// if (process.env.NODE_ENV === 'production') {
//   const { mockXHR } = require('../mock')
//   mockXHR()
// }

Vue.use(Element, {
  size: Cookies.get('size') || 'medium' // set element-ui default size
  // locale: enLang // 如果使用中文，无需设置，请删除
})

// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
