<script setup>
import { ref, onMounted, inject, onUnmounted, computed,watch} from "vue";
import {useThemeStore} from "../stores/themeStore.js";
import {storeToRefs} from 'pinia'
import { getThemeValue } from "../utils/theme_utils.js";
const themeStore = useThemeStore()
const { theme } = storeToRefs(themeStore) 
let chartInstance = null;
const allData = ref(null);
const stock_ref = ref(null);
const titleFontSize = ref(0);
const currentIndex = ref(0);
const timerId = ref(null);
const $http = inject("$http");
const $echarts = inject("$echarts");
const initChart = () => {
  chartInstance = $echarts.init(stock_ref.value, theme.value);
  chartInstance.on("mouseover", () => {
    clearInterval(timerId.value);
  });
  chartInstance.on("mouseout", () => {
    startInterval();
  });
  const initOption = {
    title: {
      text: "▎库存和销量分析",
      left: 20,
      top: 20,
      textStyle: {
        color: "#fff", // 强制使用白色
      },
    },
    tooltip: {
      trigger: "item",
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
        if (params.name) {
          const name = params.name.split('\n')[0];
          return `<div style="padding: 5px;"><strong style="font-size:14px;color:${params.color}">${name}</strong><br/><hr style="border-color:rgba(255,255,255,0.2);margin:8px 0;"><span style="color:${params.color}">销量: <strong>${params.value}</strong></span></div>`;
        }
        return "";
      },
      extraCssText: "box-shadow: 0 0 20px rgba(79, 247, 120, 0.5);"
    },
  };
  chartInstance.setOption(initOption);
  screenAdapter();
};

const getData = async () => {
  try {
    const response = await $http.get("stock");
    allData.value = response;
    console.log("获取到的数据:", allData.value);
    updateChart();
    startInterval();
  } catch (error) {
    console.log("获取数据失败:", error);
  }
};

const updateChart = () => {
  const start = currentIndex.value * 5;
  const end = (currentIndex.value + 1) * 5;
  const showData = allData.value.slice(start, end);
  const centerArr = [
    ["18%", "40%"],
    ["50%", "40%"],
    ["82%", "40%"],
    ["34%", "75%"],
    ["65%", "75%"],
  ];
  const colorArr = [
    ["#4169E1", "#64B4FF"],
    ["#1E90FF", "#72CCFF"],
    ["#4682B4", "#87CEEB"],
    ["#5F9EA0", "#B0E0E6"],
    ["#6495ED", "#ADD8E6"],
  ];
  const seriesArr = showData.map((item, index) => {
    return {
      type: "pie",
      radius: [titleFontSize.value*2,(titleFontSize.value*2)-10],
      center: centerArr[index],
      hoverAnimation: false, //关闭鼠标移入时饼图的动画效果
      labelLine: false, //隐藏指示线
      label: {
        position: "center",
        color: colorArr[index][0],
        fontSize: 11,
        fontWeight: "bold",
        formatter: "{b}"
      },
      emphasis: {
        scale: true,
        scaleSize: 10,
        itemStyle: {
          shadowBlur: 30,
          shadowColor: colorArr[index][0],
          shadowOffsetX: 0,
          shadowOffsetY: 0
        }
      },
      animationType: "scale",
      animationEasing: "elasticOut",
      animationDelay: index * 100,
      data: [
        {
          name: item.name + "\n\n" + item.sales,
          value: item.sales,
          itemStyle: {
            color: new $echarts.graphic.LinearGradient(0, 1, 0, 0, [
              {
                offset: 0,
                color: colorArr[index][0],
              },
              {
                offset: 1,
                color: colorArr[index][1],
              },
            ]),
          },
        },
        {
          value: item.stock,
        },
      ],
    };
  });
  const dataOption = {
    series: seriesArr,
  };
  chartInstance.setOption(dataOption);
};

const screenAdapter = () => {
  titleFontSize.value = (stock_ref.value.offsetWidth / 100) * 3.6;
  const innerRadius = titleFontSize.value * 2.8;
  const outerRadius = titleFontSize.value * 1.125;
  const adapterOption = {
    title: {
      textStyle: {
        fontSize: titleFontSize.value,
        color: getThemeValue(theme.value).titleColor, // 根据主题动态设置
      },
    },
    series: [
      {
        type: "pie",
        radius: [innerRadius, outerRadius],
        label: {
          fontSize: titleFontSize.value / 2,
          color: getThemeValue(theme.value).titleColor, // 根据主题动态设置
        },
      },
      {
        type: "pie",
        radius: [innerRadius, outerRadius],
        label: {
          fontSize: titleFontSize.value / 2,
          color: getThemeValue(theme.value).titleColor, // 根据主题动态设置
        },
      },
      {
        type: "pie",
        radius: [innerRadius, outerRadius],
        label: {
          fontSize: titleFontSize.value / 2,
          color: getThemeValue(theme.value).titleColor, // 根据主题动态设置
        },
      },
      {
        type: "pie",
        radius: [innerRadius, outerRadius],
        label: {
          fontSize: titleFontSize.value / 2,
          color: getThemeValue(theme.value).titleColor, // 根据主题动态设置
        },
      },
      {
        type: "pie",
        radius: [innerRadius, outerRadius],
        label: {
          fontSize: titleFontSize.value / 2,
          color: getThemeValue(theme.value).titleColor, // 根据主题动态设置
        },
      },
    ],
  };
  chartInstance.setOption(adapterOption);
  chartInstance.resize();
}
defineExpose({
  screenAdapter
});

const startInterval = () => {
  if (timerId.value) {
    clearInterval(timerId.value);
  }
  timerId.value = setInterval(() => {
    currentIndex.value++;
    if (currentIndex.value > 1) {
      currentIndex.value = 0;
    }
    updateChart();
  }, 5000);
};

onMounted(() => {
  initChart();
  getData();
  window.addEventListener("resize", screenAdapter);
});
onUnmounted(() => {
  clearInterval(timerId.value);
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
        series: [{
          label: {
            color: textColor
          }
        }]
      })
    }
)
</script>

<template>
  <div class="com-container">
    <div class="com-chart" ref="stock_ref"></div>
  </div>
</template>

<style scoped>
</style>