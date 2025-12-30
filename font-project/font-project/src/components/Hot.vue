<script setup>
import { all } from "axios";
import { ref, onMounted, inject, onUnmounted, computed,watch} from "vue";
import { useThemeStore } from "../stores/themeStore.js"
import { storeToRefs } from 'pinia'
import { getThemeValue } from "../utils/theme_utils.js";
const themeStore = useThemeStore()
const { theme } = storeToRefs(themeStore)
let chartInstance = null;
const allData = ref(null);
const hot_ref = ref(null);
const titleFontSize = ref(0);
const currentIndex = ref(0);
const $http = inject("$http");
const $echarts = inject("$echarts");
const initChart = () => {
  chartInstance = $echarts.init(hot_ref.value,theme.value);
  const initOption = {
    title: {
      text: "┃ 热销商品的占比",
      left: 20,
      top: 20,
      textStyle: {
        color: "#fff", // 强制使用白色
      },
    },
    legend: {
      icon: "circle",
      top: "15%",
      textStyle: {
        color: getThemeValue(theme.value).titleColor,
        fontSize: 12
      },
      itemGap: 15,
      itemWidth: 12,
      itemHeight: 12
    },
    tooltip: {
      show: true,
      backgroundColor: "rgba(0, 0, 0, 0.85)",
      borderColor: "rgba(114, 204, 255, 0.5)",
      borderWidth: 2,
      borderRadius: 8,
      padding: [10, 15],
      textStyle: {
        color: getThemeValue(theme.value).titleColor,
        fontSize: 13,
        fontWeight: "bold"
      },
      formatter: (arg) => {
        const thirdCategory = arg.data.children;
        //计算出所有三级分类的数据总和
        let total = 0;
        thirdCategory.forEach((item) => {
          total += item.value;
        });
        let retStr = `<div style="padding: 5px;"><strong style="font-size:14px;color:${arg.color}">${arg.name}</strong><br><hr style="border-color:rgba(114,204,255,0.3);margin:8px 0;">`;
        thirdCategory.forEach((item) => {
          const percent = parseInt((item.value / total) * 100);
          retStr += `<div style="margin:5px 0;"><span style="display:inline-block;width:12px;height:12px;background:${arg.color};margin-right:8px;border-radius:2px;box-shadow:0 0 5px ${arg.color};"></span><span>${item.name}: <strong style="color:${arg.color}">${percent}%</strong></span></div>`;
        });
        retStr += "</div>";
        return retStr;
      },
      extraCssText: "box-shadow: 0 0 20px rgba(255, 107, 155, 0.5);"
    },
    series: [
      {
        type: "pie",
        label: {
          show: false,
        },
        labelLine: {
          show: false,
        },
        emphasis: {
          scale: true,
          scaleSize: 15,
          itemStyle: {
            shadowBlur: 30,
            shadowColor: (params) => params.color,
            shadowOffsetX: 0,
            shadowOffsetY: 0
          },
          label: {
            show: false,
          },
          labelLine: {
            show: false,
          },
        },
        animationType: "scale",
        animationEasing: "elasticOut",
        animationDuration: 1000,
        animationDelay: (idx) => idx * 150
      },
    ],
  };
  chartInstance.setOption(initOption);
  screenAdapter();
};

const getData = async () => {
  try {
    const response = await $http.get("hot");
    allData.value = response;
    console.log("获取到的数据:", allData.value);
    updateChart();
  } catch (error) {
    console.log("获取数据失败:", error);
  }
};

const updateChart = () => {
  // 科技蓝主题配色
  const techBlueColors = [
    "#4169E1", "#64B4FF", "#72CCFF", "#87CEFA", "#ADD8E6",
    "#1E90FF", "#4682B4", "#5F9EA0", "#6495ED", "#B0E0E6"
  ];
  
  const legendData = allData.value[currentIndex.value].children.map((item) => {
    return item.name;
  });
  const seriesData = allData.value[currentIndex.value].children.map((item, index) => {
    return {
      name: item.name,
      value: item.value,
      children: item.children,
      itemStyle: {
        color: techBlueColors[index % techBlueColors.length]
      }
    };
  });
  const dataOption = {
    color: techBlueColors,
    legend: {
      data: legendData,
    },
    series: [
      {
        data: seriesData,
      },
    ],
  };
  chartInstance.setOption(dataOption);
};

const screenAdapter = () => {
  titleFontSize.value = (hot_ref.value.offsetWidth / 100) * 3.6;
  const adapterOption = {
    title: {
      textStyle: {
        fontSize: titleFontSize.value,
        color: getThemeValue(theme.value).titleColor, // 根据主题动态设置
      },
    },
    legend: {
      itemWidth: titleFontSize.value,
      itemHeight: titleFontSize.value,
      itemGap: titleFontSize.value / 2,
      textStyle: {
        fontSize: titleFontSize.value / 2,
        color: getThemeValue(theme.value).titleColor, // 根据主题动态设置
      },
    },
    series: [
      {
        radius: titleFontSize.value * 4.5,
        center: ["50%", "60%"],
      },
    ],
  };
  chartInstance.setOption(adapterOption);
  chartInstance.resize();
}
defineExpose({
  screenAdapter
});

const toLeft = () => {
  currentIndex.value--;
  if (currentIndex.value < 0) {
    currentIndex.value = allData.value.length - 1;
  }
  updateChart();
};

const toRight = () => {
  currentIndex.value++;
  if (currentIndex.value > allData.value.length - 1) {
    currentIndex.value = 0;
  }
  updateChart();
};

const cateName = computed(() => {
  if (!allData.value) {
    return "";
  } else {
    return allData.value[currentIndex.value].name;
  }
});

const comStyle = computed(() => {
  return {
    fontSize: titleFontSize.value + "px",
    color: getThemeValue(theme.value).titleColor, // 根据主题动态设置颜色
  };
});

const marginStyle = computed(() => {
  return {
    marginLeft: titleFontSize.value + "px",};
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
        }
      })
    }
)

onMounted(() => {
  initChart();
  getData();
  window.addEventListener("resize", screenAdapter);
});
onUnmounted(() => {});
</script>

<template>
  <div class="com-container">
    <div class="com-chart" ref="hot_ref"></div>
    <span class="iconfont arr-left" @click="toLeft" :style="comStyle">&#xe6ef;</span>
    <span class="iconfont arr-right" @click="toRight" :style="comStyle">&#xe6ed;</span>
    <span class="cate-name" :style="comStyle">{{ cateName }}</span>
  </div>
</template>

<style scoped>
.arr-left {
  position: absolute;
  left: 10%;
  top: 50%;
  transform: translate(-50%);
  cursor: pointer;
  z-index: 10;
  pointer-events: auto;
  font-size: 24px;
  text-shadow: 0 0 10px rgba(114, 204, 255, 0.8);
}
.arr-right {
  position: absolute;
  right: 10%;
  top: 50%;
  transform: translate(-50%);
  cursor: pointer;
  z-index: 10;
  pointer-events: auto;
  font-size: 24px;
  text-shadow: 0 0 10px rgba(114, 204, 255, 0.8);
}
.cate-name {
  position: absolute;
  left: 80%;
  bottom: 20px;
  z-index: 10;
  font-weight: bold;
  text-shadow: 0 0 10px rgba(114, 204, 255, 0.8);
}
</style>