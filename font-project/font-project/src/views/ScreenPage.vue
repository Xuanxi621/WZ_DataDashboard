<script setup>
  import {ref,nextTick,computed} from 'vue'
  import { storeToRefs } from 'pinia';
  import {useThemeStore} from "../stores/themeStore.js";
  import { getThemeValue } from '../utils/theme_utils.js';
  const themeStore = useThemeStore();
  const{ changeTheme } = themeStore
  const { theme } = storeToRefs(themeStore);
import HotPage from "./HotPage.vue"
import MapPage from "./MapPage.vue"
import RankPage from "./RankPage.vue"
import SellerPage from "./SellerPage.vue"
import StockPage from "./StockPage.vue"
import TrendPage from "./TrendPage.vue"


const trendRef = ref(null);
const sellerRef = ref(null);
const mapRef = ref(null);
const rankRef = ref(null);
const hotRef = ref(null);
const stockRef = ref(null);
const fullScreenStatus = ref({
  trend:false,
  seller:false,
  map:false,
  rank:false,
  hot:false,
  stock:false,
})

const changeSize = (chartName) => {
  fullScreenStatus.value[chartName] = !fullScreenStatus.value[chartName];
  nextTick(() => {
    switch (chartName) {
      case "trend":
        if (trendRef.value) trendRef.value.triggerScreenAdapter();
        break;
      case "seller":
        if (sellerRef.value) sellerRef.value.triggerScreenAdapter();
        break;
      case "map":
        if (mapRef.value) mapRef.value.triggerScreenAdapter();
        break;
      case "rank":
        if (rankRef.value) rankRef.value.triggerScreenAdapter();
        break;
      case "hot":
        if (hotRef.value) hotRef.value.triggerScreenAdapter();
        break;
      case "stock":
        if (stockRef.value) stockRef.value.triggerScreenAdapter();
        break;
    }
  })
}
const themeSrc = computed(() => {
  return '/static/img/' + getThemeValue(theme.value).themeSrc
})

const containerStyle = computed( () =>{
  return{
    backgroundColor:getThemeValue(theme.value).backgroundColor,
    color:getThemeValue(theme.value).titleColor
  }
})
</script>

<template>
  <div class="screen-container" :style="containerStyle">
  <header class="screen-header">
    <div>
      <img src="C:\Users\27200\Desktop\font-project\font-project\public\static\img\header_border_dark.png" alt="">
    </div>
    <span class="title">电商平台大数据可视化大屏</span>
    <div class="title-right">
      <img class="qiehuan" :src="themeSrc" @click="changeTheme" alt="">
    </div>
  </header>
  <div class="screen-body">
    <section class="screen-left">
      <div id="left-top" :class="[fullScreenStatus.trend?'fullscreen':'']">
        <!--销量趋势图trend-->
        <trend-page ref="trendRef" />
        <div class="resize" @click.stop="changeSize('trend')">
          <span v-if="!fullScreenStatus.trend" class="iconfont icon-expand-alt"></span>
          <span v-else class="iconfont icon-compress-alt"></span>
        </div>
      </div>
      <div id="left-bottom" :class="[fullScreenStatus.seller?'fullscreen':'']">
        <!--商家销售图seller-->
        <seller-page ref="sellerRef" />
        <div class="resize" @click.stop="changeSize('seller')">
          <span v-if="!fullScreenStatus.seller" class="iconfont icon-expand-alt"></span>
          <span v-else class="iconfont icon-compress-alt"></span>
        </div>
      </div>
    </section>
    <section class="screen-middle">
      <div id="middle-top" :class="[fullScreenStatus.map?'fullscreen':'']">
        <!--商家分布图map-->
        <map-page ref="mapRef" />
        <div class="resize" @click.stop="changeSize('map')">
          <span v-if="!fullScreenStatus.map" class="iconfont icon-expand-alt"></span>
          <span v-else class="iconfont icon-compress-alt"></span>
        </div>
      </div>
      <div id="middle-bottom" :class="[fullScreenStatus.rank?'fullscreen':'']">
        <!--地区销量排行图rank-->
        <rank-page ref="rankRef" />
        <div class="resize" @click.stop="changeSize('rank')">
          <span v-if="!fullScreenStatus.rank" class="iconfont icon-expand-alt"></span>
          <span v-else class="iconfont icon-compress-alt"></span>
        </div>
      </div>
    </section>
    <section class="screen-right">
      <div id="right-top" :class="[fullScreenStatus.hot?'fullscreen':'']">
        <!--热销占比图hot-->
        <hot-page ref="hotRef" />
        <div class="resize" @click.stop="changeSize('hot')">
          <span v-if="!fullScreenStatus.hot" class="iconfont icon-expand-alt"></span>
          <span v-else class="iconfont icon-compress-alt"></span>
        </div>
      </div>
      <div id="right-bottom" :class="[fullScreenStatus.stock?'fullscreen':'']">
        <!--库存销量图stock-->
        <stock-page ref="stockRef" />
        <div class="resize" @click.stop="changeSize('stock')">
          <span v-if="!fullScreenStatus.stock" class="iconfont icon-expand-alt"></span>
          <span v-else class="iconfont icon-compress-alt"></span>
        </div>
      </div>
    </section>
  </div>
</div>
</template>

<style scoped>
	.fullscreen {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  width: 100vw !important;
  height: 100vh !important;
  margin: 0 !important;
  padding: 20px !important;
  z-index: 9999 !important;
  border-radius: 0 !important;
  background: linear-gradient(135deg, 
    rgba(232, 244, 248, 0.95) 0%, 
    rgba(208, 232, 240, 0.9) 25%,
    rgba(184, 220, 240, 0.95) 50%,
    rgba(160, 208, 232, 0.9) 75%,
    rgba(200, 228, 240, 0.95) 100%) !important;
  pointer-events: auto !important;
}

.fullscreen .com-container {
  width: 100% !important;
  height: 100% !important;
  border-radius: 12px !important;
}

.fullscreen .com-chart {
  width: 100% !important;
  height: 100% !important;
}
 
.screen-container {
  width: 100%;
  height: 100%;
  padding: 0 20px;
  background: 
    linear-gradient(135deg, 
      rgba(232, 244, 248, 0.85) 0%, 
      rgba(208, 232, 240, 0.8) 25%,
      rgba(184, 220, 240, 0.85) 50%,
      rgba(160, 208, 232, 0.8) 75%,
      rgba(200, 228, 240, 0.85) 100%);
  color: #1a1a2e;
  box-sizing: border-box;
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(10px);
  z-index: 1;
}

.screen-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border: 2px solid transparent;
  border-image: linear-gradient(135deg, 
    rgba(114, 204, 255, 0.6) 0%, 
    rgba(100, 180, 255, 0.6) 25%,
    rgba(135, 206, 250, 0.6) 50%,
    rgba(173, 216, 230, 0.6) 75%,
    rgba(114, 204, 255, 0.6) 100%) 1;
  pointer-events: none;
  z-index: 1;
}

@keyframes borderRotate {
  0% {
    filter: hue-rotate(0deg);
  }
  100% {
    filter: hue-rotate(360deg);
  }
}

.screen-header {
  width: 100%;
  height: 64px;
  font-size: 20px;
  position: relative;
  z-index: 2;
  background: linear-gradient(180deg, 
    rgba(114, 204, 255, 0.15) 0%, 
    transparent 100%);
  border-bottom: 1px solid rgba(114, 204, 255, 0.3);
  backdrop-filter: blur(10px);
}
.screen-header > div {
  img {
    width: 100%;
  }
}
.screen-header .title {
  position: absolute;
  left: 50%;
  top: 50%;
  font-size: 24px;
  font-weight: bold;
  transform: translate(-50%, -50%);
  background: linear-gradient(135deg, #4169E1 0%, #6495ED 50%, #72CCFF 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 30px rgba(65, 105, 225, 0.4);
  letter-spacing: 2px;
  text-transform: uppercase;
}
.screen-header .title-right {
  display: flex;
  align-items: center;
  position:absolute;
  right: 0px;
  top: 50%;
  transform: translateY(-80%);
}
.screen-header .qiehuan {
  width: 28px;
  height: 21px;
  cursor: pointer;
}
.screen-header .datetime {
  font-size: 15px;
  margin-left: 10px;
}
.screen-header .logo {
  position: absolute;
  left: 0px;
  top: 50%;
  transform: translateY(-80%);
}
.screen-header .logo img {
  height: 35px;
  width: 128px;
}
 
.screen-body {
  width: 100%;
  height: 100%;
  display: flex;
  margin-top: 10px;
  position: relative;
  z-index: 2;
  gap: 15px;
}
.screen-body .screen-left{
  height: 100%;
  width: 27.6%;
}
.screen-body .screen-left #left-top{
  height: 53%;
  position: relative;
  background: linear-gradient(135deg, rgba(232, 244, 248, 0.9) 0%, rgba(208, 232, 240, 0.85) 100%);
  border-radius: 12px;
  border: 1px solid rgba(114, 204, 255, 0.4);
  transform-style: preserve-3d;
  box-shadow: 
    0 15px 40px rgba(65, 105, 225, 0.2),
    0 8px 20px rgba(114, 204, 255, 0.3),
    inset 0 2px 8px rgba(255, 255, 255, 0.6),
    inset 0 -2px 8px rgba(114, 204, 255, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.8),
    inset 0 -1px 0 rgba(100, 180, 255, 0.2),
    0 0 60px rgba(114, 204, 255, 0.2);
  transition: all 0.3s ease;
}

.screen-body .screen-left #left-top:hover {
  transform: translateY(-3px) rotateX(1deg);
  box-shadow: 
    0 20px 50px rgba(65, 105, 225, 0.25),
    0 10px 25px rgba(114, 204, 255, 0.35),
    inset 0 2px 8px rgba(255, 255, 255, 0.7),
    inset 0 -2px 8px rgba(114, 204, 255, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.9),
    inset 0 -1px 0 rgba(100, 180, 255, 0.25),
    0 0 80px rgba(114, 204, 255, 0.3);
}

.screen-body .screen-left #left-bottom{
  height: 31%;
  margin-top: 25px;
  position: relative;
  background: linear-gradient(135deg, rgba(232, 244, 248, 0.9) 0%, rgba(208, 232, 240, 0.85) 100%);
  border-radius: 12px;
  border: 1px solid rgba(114, 204, 255, 0.4);
  transform-style: preserve-3d;
  box-shadow: 
    0 15px 40px rgba(65, 105, 225, 0.2),
    0 8px 20px rgba(114, 204, 255, 0.3),
    inset 0 2px 8px rgba(255, 255, 255, 0.6),
    inset 0 -2px 8px rgba(114, 204, 255, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.8),
    inset 0 -1px 0 rgba(100, 180, 255, 0.2),
    0 0 60px rgba(114, 204, 255, 0.2);
  transition: all 0.3s ease;
}

.screen-body .screen-left #left-bottom:hover {
  transform: translateY(-3px) rotateX(1deg);
  box-shadow: 
    0 20px 50px rgba(65, 105, 225, 0.25),
    0 10px 25px rgba(114, 204, 255, 0.35),
    inset 0 2px 8px rgba(255, 255, 255, 0.7),
    inset 0 -2px 8px rgba(114, 204, 255, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.9),
    inset 0 -1px 0 rgba(100, 180, 255, 0.25),
    0 0 80px rgba(114, 204, 255, 0.3);
}
.screen-body .screen-middle{
  height: 100%;
  width: 41.5%;
  margin-left: 0;
  margin-right: 0;
}
.screen-body .screen-middle #middle-top{
  width: 100%;
  height: 56%;
  position: relative;
  background: linear-gradient(135deg, rgba(232, 244, 248, 0.9) 0%, rgba(208, 232, 240, 0.85) 100%);
  border-radius: 12px;
  border: 1px solid rgba(114, 204, 255, 0.4);
  transform-style: preserve-3d;
  box-shadow: 
    0 15px 40px rgba(65, 105, 225, 0.2),
    0 8px 20px rgba(114, 204, 255, 0.3),
    inset 0 2px 8px rgba(255, 255, 255, 0.6),
    inset 0 -2px 8px rgba(114, 204, 255, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.8),
    inset 0 -1px 0 rgba(100, 180, 255, 0.2),
    0 0 60px rgba(114, 204, 255, 0.2);
  transition: all 0.3s ease;
}

.screen-body .screen-middle #middle-top:hover {
  transform: translateY(-3px) rotateX(1deg);
  box-shadow: 
    0 20px 50px rgba(65, 105, 225, 0.25),
    0 10px 25px rgba(114, 204, 255, 0.35),
    inset 0 2px 8px rgba(255, 255, 255, 0.7),
    inset 0 -2px 8px rgba(114, 204, 255, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.9),
    inset 0 -1px 0 rgba(100, 180, 255, 0.25),
    0 0 80px rgba(114, 204, 255, 0.3);
}

.screen-body .screen-middle #middle-bottom{
  margin-top: 25px;
  width: 100%;
  height: 28%;
  position: relative;
  background: linear-gradient(135deg, rgba(232, 244, 248, 0.9) 0%, rgba(208, 232, 240, 0.85) 100%);
  border-radius: 12px;
  border: 1px solid rgba(114, 204, 255, 0.4);
  transform-style: preserve-3d;
  box-shadow: 
    0 15px 40px rgba(65, 105, 225, 0.2),
    0 8px 20px rgba(114, 204, 255, 0.3),
    inset 0 2px 8px rgba(255, 255, 255, 0.6),
    inset 0 -2px 8px rgba(114, 204, 255, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.8),
    inset 0 -1px 0 rgba(100, 180, 255, 0.2),
    0 0 60px rgba(114, 204, 255, 0.2);
  transition: all 0.3s ease;
}

.screen-body .screen-middle #middle-bottom:hover {
  transform: translateY(-3px) rotateX(1deg);
  box-shadow: 
    0 20px 50px rgba(65, 105, 225, 0.25),
    0 10px 25px rgba(114, 204, 255, 0.35),
    inset 0 2px 8px rgba(255, 255, 255, 0.7),
    inset 0 -2px 8px rgba(114, 204, 255, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.9),
    inset 0 -1px 0 rgba(100, 180, 255, 0.25),
    0 0 80px rgba(114, 204, 255, 0.3);
}
.screen-body .screen-right{
  height: 100%;
  width: 27.6%;
}
.screen-body .screen-right #right-top{
  height: 46%;
  position: relative;
  background: linear-gradient(135deg, rgba(232, 244, 248, 0.9) 0%, rgba(208, 232, 240, 0.85) 100%);
  border-radius: 12px;
  border: 1px solid rgba(114, 204, 255, 0.4);
  transform-style: preserve-3d;
  box-shadow: 
    0 15px 40px rgba(65, 105, 225, 0.2),
    0 8px 20px rgba(114, 204, 255, 0.3),
    inset 0 2px 8px rgba(255, 255, 255, 0.6),
    inset 0 -2px 8px rgba(114, 204, 255, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.8),
    inset 0 -1px 0 rgba(100, 180, 255, 0.2),
    0 0 60px rgba(114, 204, 255, 0.2);
  transition: all 0.3s ease;
}

.screen-body .screen-right #right-top:hover {
  transform: translateY(-3px) rotateX(1deg);
  box-shadow: 
    0 20px 50px rgba(65, 105, 225, 0.25),
    0 10px 25px rgba(114, 204, 255, 0.35),
    inset 0 2px 8px rgba(255, 255, 255, 0.7),
    inset 0 -2px 8px rgba(114, 204, 255, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.9),
    inset 0 -1px 0 rgba(100, 180, 255, 0.25),
    0 0 80px rgba(114, 204, 255, 0.3);
}

.screen-body .screen-right #right-bottom{
  height: 38%;
  margin-top: 25px;
  position: relative;
  background: linear-gradient(135deg, rgba(232, 244, 248, 0.9) 0%, rgba(208, 232, 240, 0.85) 100%);
  border-radius: 12px;
  border: 1px solid rgba(114, 204, 255, 0.4);
  transform-style: preserve-3d;
  box-shadow: 
    0 15px 40px rgba(65, 105, 225, 0.2),
    0 8px 20px rgba(114, 204, 255, 0.3),
    inset 0 2px 8px rgba(255, 255, 255, 0.6),
    inset 0 -2px 8px rgba(114, 204, 255, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.8),
    inset 0 -1px 0 rgba(100, 180, 255, 0.2),
    0 0 60px rgba(114, 204, 255, 0.2);
  transition: all 0.3s ease;
}

.screen-body .screen-right #right-bottom:hover {
  transform: translateY(-3px) rotateX(1deg);
  box-shadow: 
    0 20px 50px rgba(65, 105, 225, 0.25),
    0 10px 25px rgba(114, 204, 255, 0.35),
    inset 0 2px 8px rgba(255, 255, 255, 0.7),
    inset 0 -2px 8px rgba(114, 204, 255, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.9),
    inset 0 -1px 0 rgba(100, 180, 255, 0.25),
    0 0 80px rgba(114, 204, 255, 0.3);
}
 
.resize {
  position: absolute;
  right: 20px;
  top: 20px;
  cursor: pointer;
  z-index: 10000 !important;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(114, 204, 255, 0.3);
  border: 2px solid rgba(114, 204, 255, 0.6);
  border-radius: 8px;
  transition: all 0.3s ease;
  backdrop-filter: blur(5px);
  pointer-events: auto !important;
  box-shadow: 0 2px 8px rgba(114, 204, 255, 0.3);
}

.resize:hover {
  background: rgba(114, 204, 255, 0.5);
  border-color: rgba(114, 204, 255, 0.9);
  box-shadow: 0 0 20px rgba(114, 204, 255, 0.6);
  transform: scale(1.15);
}

.resize > span {
  pointer-events: none !important;
  user-select: none;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.resize .iconfont {
  color: #fff;
  font-size: 20px;
  text-shadow: 0 0 10px rgba(114, 204, 255, 0.8);
  pointer-events: none;
}

.fullscreen .resize {
  z-index: 10001 !important;
  right: 30px !important;
  top: 30px !important;
}
</style>