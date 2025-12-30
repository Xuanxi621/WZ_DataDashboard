<script setup>
import { ref, onMounted, inject,onUnmounted,computed,watch} from "vue";
import {useThemeStore} from "../stores/themeStore.js";
import { storeToRefs } from 'pinia'
import { getThemeValue } from "../utils/theme_utils.js";
const themeStore = useThemeStore()
const { theme } = storeToRefs(themeStore) 
import axios from "axios";
import { getProvinceMapInfo } from "../utils/map_utils.js";
let chartInstance = null;
const allData = ref(null);
const map_ref = ref(null);
const mapData = ref(null)
const recordMap = ref({})
const titleFontSize = ref(0)
const $http = inject("$http");
const $echarts = inject("$echarts");
const initChart = () => {
  if (!map_ref.value || !$echarts) return;

  chartInstance = $echarts.init(map_ref.value,theme.value);
  titleFontSize.value = map_ref.value.offsetWidth / 100*3.6
  const initOption = {
    title: {
      text: '┃ 商家分布',
      left: '20px',
      top: '10px',
      textStyle: {
        fontSize: 24, // 放大标题字号
        fontWeight: 'bold', // 加粗标题
        color: getThemeValue(theme.value).titleColor, // 根据主题动态设置
      },
    },
    geo: {
      type: 'map',
      map: 'china',
      top: '15%',
      bottom: '10%',
      center: [105, 35], // 中国地图默认中心点（保证显示完整）
      zoom: 1.2, // 合适的缩放比例（避免地图过小/过大）
      itemStyle: {
        areaColor: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: '#2E72BF' },
            { offset: 0.5, color: '#3E82CF' },
            { offset: 1, color: '#1E62AF' }
          ]
        },
        borderColor: 'rgba(114, 204, 255, 0.5)',
        borderWidth: 1.5,
        shadowBlur: 10,
        shadowColor: 'rgba(46, 114, 191, 0.5)'
      },
      emphasis: {
        itemStyle: {
          areaColor: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: '#4E92DF' },
              { offset: 0.5, color: '#5EA2EF' },
              { offset: 1, color: '#3E82CF' }
            ]
          },
          borderColor: '#72CCFF',
          borderWidth: 3,
          shadowBlur: 20,
          shadowColor: '#72CCFF'
        },
        label: {
          show: true,
          color: '#fff',
          fontSize: 13,
          fontWeight: 'bold',
          textShadowBlur: 10,
          textShadowColor: '#72CCFF'
        }
      },
      label: {
        show: false
      }
    },
    legend:{
      left:'5%',
      bottom:'5%',
      orient:'vertical'
    }
  }
  chartInstance.setOption(initOption);
  chartInstance.on('click',async(arg)=>{
  const provinceInfo = getProvinceMapInfo(arg.name)
  // 错误：recordMap[provinceInfo.key] → 正确：recordMap.value[provinceInfo.key]
  if(!recordMap.value[provinceInfo.key]){ 
    const changeMap = await axios.get('http://localhost:5173'+provinceInfo.path)
    recordMap.value[provinceInfo.key] = changeMap.data // 加.value
    $echarts.registerMap(provinceInfo.key,changeMap.data)
  }
  const changeOption = {
    geo: {
      map: provinceInfo.key,
      center: recordMap.value[provinceInfo.key].features[0]?.properties?.cp || [105, 38], // 省份中心点
      zoom: 3, // 省份地图的缩放比例
      itemStyle: { 
        areaColor: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: '#2E72BF' },
            { offset: 0.5, color: '#3E82CF' },
            { offset: 1, color: '#1E62AF' }
          ]
        },
        borderColor: 'rgba(114, 204, 255, 0.5)',
        borderWidth: 1.5,
        shadowBlur: 10,
        shadowColor: 'rgba(46, 114, 191, 0.5)'
      },
      emphasis: {
        itemStyle: {
          areaColor: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: '#4E92DF' },
              { offset: 0.5, color: '#5EA2EF' },
              { offset: 1, color: '#3E82CF' }
            ]
          },
          borderColor: '#72CCFF',
          borderWidth: 3,
          shadowBlur: 20,
          shadowColor: '#72CCFF'
        },
        label: {
          show: true,
          color: '#fff',
          fontSize: 13,
          fontWeight: 'bold',
          textShadowBlur: 10,
          textShadowColor: '#72CCFF'
        }
      },
      label: { 
        show: true, 
        color: '#fff',
        fontSize: 10
      }
    }
  }
  chartInstance.setOption(changeOption) 
})
}

const getData = async () => {
  try {
    const response = await axios.get('http://localhost:5173/static/map/china.json')
    mapData.value = await $http.get('map')
    allData.value = response.data;
    console.log("获取数据成功:", allData.value);
    console.log("获取地图散点数据成功:",mapData.value)
    $echarts.registerMap('china',allData.value)
    updateChart()
  } catch (error) {
    console.log("获取数据失败:", error);
  }
};

const updateChart = () => {
  if (!mapData.value || !chartInstance || mapData.value.length === 0) {
    console.warn("散点数据未就绪");
    return;
  }

  const colorMap = {
    "黄金用户": "#4169E1",
    "白金用户": "#72CCFF",
    "钻石用户": "#87CEFA"
  };

  const legendArr = mapData.value.map(item => item.name);
  const seriesArr = mapData.value.map(item => {
    const validPoints = item.children.map(child => {
      const lng = Number(child.value[0]);
      const lat = Number(child.value[1]);
      if (lng < 73 || lng > 135 || lat < 3 || lat > 53) {
        console.warn(`非法坐标：${child.name} → 经度${lng}，纬度${lat}`);
        return null;
      }
      return { value: [lng, lat], name: child.name };
    }).filter(Boolean);

    return {
      type: 'effectScatter',
      rippleEffect: { 
        scale: 8, 
        brushType: 'fill',
        period: 3,
        number: 3
      },
      name: item.name,
      data: validPoints,
      coordinateSystem: 'geo',
      symbolSize: (val) => {
        return 10;
      },
      itemStyle: { 
        color: colorMap[item.name],
        shadowBlur: 15,
        shadowColor: colorMap[item.name],
        borderColor: '#fff',
        borderWidth: 2
      },
      label: { 
        show: false, 
        formatter: '{b}', 
        color: "#fff",
        fontSize: 11,
        fontWeight: 'bold',
        textShadowBlur: 5,
        textShadowColor: colorMap[item.name]
      },
      emphasis: { 
        label: { 
          show: true,
          fontSize: 13,
          fontWeight: 'bold',
          textShadowBlur: 10,
          textShadowColor: colorMap[item.name]
        },
        itemStyle: {
          shadowBlur: 30,
          shadowColor: colorMap[item.name],
          borderWidth: 3,
          scale: 1.3
        }
      },
      animation: true,
      animationDuration: 1500,
      animationEasing: 'elasticOut',
      animationDelay: (idx) => idx * 50
    };
  });

  const dataOption = {
    // 原生图例配置：图标为圆点，颜色与散点对应
    legend: { 
      data: legendArr, 
      textStyle: { color: "#fff" },
      icon: "circle", // 图例图标设为圆点
      itemWidth: 12, // 圆点大小
      itemHeight: 12,
      // 为每个图例项指定颜色
      formatter: (name) => name,
      textStyle: { color: "#fff" }
    },
    // 全局颜色映射：系列名对应颜色
    color: Object.values(colorMap),
    tooltip: {
      trigger: 'item',
      backgroundColor: "rgba(0, 0, 0, 0.85)",
      borderColor: "rgba(114, 204, 255, 0.5)",
      borderWidth: 2,
      borderRadius: 8,
      padding: [10, 15],
      textStyle: {
        color: "#fff",
        fontSize: 13,
        fontWeight: "bold"
      },
      formatter: (params) => {
        if (params.seriesType === 'effectScatter') {
          const color = params.color || '#72CCFF';
          return `<div style="padding: 5px;"><strong style="font-size:14px;color:${color}">${params.seriesName}</strong><br/><hr style="border-color:rgba(255,255,255,0.2);margin:8px 0;"><span>城市：<strong>${params.data.name || params.name}</strong></span></div>`;
        }
        return `<div style="padding: 5px;"><strong style="font-size:14px;">${params.name}</strong></div>`;
      },
      extraCssText: "box-shadow: 0 0 20px rgba(114, 204, 255, 0.5);"
    },
    series: seriesArr
  };
  chartInstance.setOption(dataOption);
};


const screenAdapter = () => {
  titleFontSize.value = map_ref.value.offsetWidth / 100*3.6
  const adapterOption = {
    title:{
      textStyle:{
        fontSize: titleFontSize.value,
        color: getThemeValue(theme.value).titleColor, // 根据主题动态设置
      }
    },
    legend:{
      itemWidth:titleFontSize.value/2,
      itemHeight:titleFontSize.value/2,
      itemGap:titleFontSize.value/2,
      textStyle:{
        fontSize:titleFontSize.value/2,
        color: getThemeValue(theme.value).titleColor // 根据主题动态设置
      }
    },
    geo: {
      label: {
        color: getThemeValue(theme.value).titleColor
      },
      emphasis: {
        label: {
          color: getThemeValue(theme.value).titleColor
        }
      }
    }
  }
  chartInstance.setOption(adapterOption)
  chartInstance.resize()
}
defineExpose({
  screenAdapter
});

const revertMap = () => {
  const revertOption = {
    geo:{
      map: 'china',
    }
  }
  chartInstance.setOption(revertOption)
}

onMounted(async () => {
  // 加100ms延迟，等DOM完全挂载后再初始化图表
  await new Promise(resolve => setTimeout(resolve, 100));
  initChart(); 
  await getData(); // 数据请求改为异步等待，确保图表初始化后再更数据
  window.addEventListener('resize',screenAdapter)
})
onUnmounted(() =>{

})

const marginStyle = computed(() => {
  return {
    marginLeft: titleFontSize.value + "px",
  };
})

// 监听 theme 的变化
watch(
    theme, // 要监听的目标（响应式变量）
    (newVal, oldVal) => { // 变化时的回调（新值，旧值）
      chartInstance.dispose() // 注销当前实例
      initChart()
      screenAdapter()
      updateChart()
      // 根据主题设置文字颜色
      const textColor = getThemeValue(newVal).titleColor;
      chartInstance.setOption({
        title: {
          textStyle: {
            color: textColor
          }
        },
        legend: {
          textStyle: {
            color: textColor
          }
        },
        geo: {
          label: {
            color: textColor
          },
          emphasis: {
            label: {
              color: textColor
            }
          }
        }
      })
    }
)
</script>

<template>
  <div class="com-container" @dblclick="revertMap">
    <div class="com-chart" ref="map_ref" ></div>
  </div>
</template>

<style scoped>
.com-container {
  width: 100%; /* 适配父容器宽度 */
  height: 100%; /* 适配父容器高度 */
  background: transparent; /* 继承大屏的深色背景 */
}
.com-chart {
  width: 100%;
  height: 100%;
}
</style>