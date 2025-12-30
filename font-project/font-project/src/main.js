import { createApp } from 'vue'
import { createPinia} from 'pinia'
import './style.css'
import App from './App.vue'
import router from './router'
import * as echarts from 'echarts'
import httpInstance from  './utils/http.js';
import chalk from '../src/assets/theme/chalk.json'
import vintage from '../src/assets/theme/vintage.json'
import '/src/assets/font/iconfont.css'

echarts.registerTheme('chalk',chalk)
echarts.registerTheme('vintage', vintage)
// createApp(App).mount('#app')
const pinia = createPinia()
const app = createApp(App)
//自定义一个%ehcrts指令，目的是将当前页面中的echarts对象给其他组件进行使用
app.provide('$echarts',echarts)
//自定义一个%http指令，目的是将当前页面中的axios对象给其他组件进行使用
app.provide('$http',httpInstance)
//在项目中正式应用路由模块
app.use(router)
app.use(pinia)
app.mount('#app')