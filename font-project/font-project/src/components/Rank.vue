<script setup>
import { ref, onMounted, inject, onUnmounted, computed,watch} from "vue";
import {useThemeStore} from "../stores/themeStore.js";
import {storeToRefs} from 'pinia'
import { getThemeValue } from "../utils/theme_utils.js";
const themeStore = useThemeStore()
const { theme } = storeToRefs(themeStore) 
let chartInstance = null;
const allData = ref(null);
const rank_ref = ref(0);
const seller_ref = ref(null);
const titleFontSize = ref(0);
const startValue = ref(0);
const endValue = ref(9);
const timerId = ref(null);
const $http = inject("$http");
const $echarts = inject("$echarts");
const initChart = () => {
  chartInstance = $echarts.init(rank_ref.value, theme.value);
  titleFontSize.value = (rank_ref.value.offsetWidth / 100) * 3.6;
  const initOption = {
    title: {
      text: "┃ 地区销售排行",
      left: 20,
      top: 20,
      textStyle: {
        color: getThemeValue(theme.value).titleColor, // 根据主题动态设置
      },
    },
    grid: {
      top: "40%",
      left: "5%",
      right: "5%",
      bottom: "5%",
      containLabel: true,
    },
    tooltip: {
      show: true,
      trigger: "axis",
      axisPointer: {
        type: "shadow",
        shadowStyle: {
          color: "rgba(0, 186, 139, 0.3)"
        }
      },
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
      formatter: (params) => {
        const color = params[0].color;
        return `<div style="padding: 5px;"><strong style="font-size:14px;">${params[0].name}</strong><br/><hr style="border-color:rgba(255,255,255,0.2);margin:8px 0;"><span style="color:${color}">销量: <strong>${params[0].value}</strong></span></div>`;
      },
      extraCssText: "box-shadow: 0 0 20px rgba(0, 186, 139, 0.5);"
    },
    xAxis: {
      type: "category",
      axisLine: {
        lineStyle: {
          color: theme.value === 'chalk' ? "rgba(255, 255, 255, 0.4)" : "rgba(0, 0, 0, 0.3)"
        }
      },
      axisLabel: {
        color: getThemeValue(theme.value).titleColor,
        fontSize: 11,
        rotate: 0
      },
      splitLine: {
        show: false
      }
    },
    yAxis: {
      type: "value",
      axisLine: {
        lineStyle: {
          color: "rgba(26, 26, 46, 0.3)"
        }
      },
      axisLabel: {
        color: "rgba(255, 255, 255, 0.7)",
        fontSize: 11
      },
      splitLine: {
        lineStyle: {
          color: "rgba(114, 204, 255, 0.3)",
          type: "dashed"
        }
      }
    },
    series: [
      {
        type: "bar",
        animation: true,
        animationDuration: 1000,
        animationEasing: "cubicOut",
        label: {
          show: true,
          position: "right",
          color: getThemeValue(theme.value).titleColor,
          fontSize: 11,
          formatter: "{c}"
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 25,
            shadowColor: (arg) => {
              let targetColor = null;
              if (arg.value > 300) {
                targetColor = colorArr[0][1];
              } else if (arg.value > 200) {
                targetColor = colorArr[1][1];
              } else {
                targetColor = colorArr[2][1];
              }
              return targetColor;
            },
            shadowOffsetY: 5
          },
          scale: true
        }
      },
    ],
  };
  chartInstance.setOption(initOption);
  chartInstance.on("mouseover", () => {
    clearInterval(timerId.value);
  });
  chartInstance.on("mouseout", () => {
    startInterval();
  });
  screenAdapter();
};

const getData = async () => {
  try {
    const response = await $http.get("rank");
    allData.value = response;
    allData.value.sort((a, b) => {
      return b.value - a.value;
    });
    console.log("获取到的数据:", allData.value);
    updateChart();
    startInterval();
  } catch (error) {
    console.log("获取数据失败:", error);
  }
};

const updateChart = () => {
  const colorArr = [
    ["#4169E1", "#64B4FF", "#87CEFA"],  // 深蓝到浅蓝
    ["#1E90FF", "#72CCFF", "#ADD8E6"],  // 蓝色渐变
    ["#4682B4", "#87CEEB", "#B0E0E6"],  // 钢蓝到天蓝
  ];
  const provinceArr = allData.value.map((item) => {
    return item.name;
  });
  const valueArr = allData.value.map((item) => {
    return item.value;
  });
  const dataOption = {
    xAxis: {
      data: provinceArr,
    },
    dataZoom: {
      show: false,
      startValue: startValue.value,
      endValue: endValue.value,
    },
    series: [
      {
        data: valueArr,
        itemStyle: {
          color: (arg) => {
            let targetColor = null;
            if (arg.value > 300) {
              targetColor = colorArr[0];
            } else if (arg.value > 200) {
              targetColor = colorArr[1];
            } else {
              targetColor = colorArr[2];
            }
            return new $echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: targetColor[0],
              },
              {
                offset: 0.3,
                color: targetColor[1],
              },
              {
                offset: 0.7,
                color: targetColor[2] || targetColor[1],
              },
              {
                offset: 1,
                color: targetColor[1],
              },
            ]);
          },
          borderWidth: 0,
          shadowBlur: 10,
          shadowColor: (arg) => {
            let targetColor = null;
            if (arg.value > 300) {
              targetColor = colorArr[0][1];
            } else if (arg.value > 200) {
              targetColor = colorArr[1][1];
            } else {
              targetColor = colorArr[2][1];
            }
            return targetColor + "80";
          },
          shadowOffsetY: 3
        },
      },
    ],
  };
  chartInstance.setOption(dataOption);
};

const screenAdapter = () => {
  titleFontSize.value = (rank_ref.value.offsetWidth / 100) * 3.6; //
  const adapterOption = {
    title: {
      textStyle: {
        fontSize: titleFontSize.value,
        color: getThemeValue(theme.value).titleColor, // 强制使用白色
      },
    },
    xAxis: {
      axisLabel: {
        color: getThemeValue(theme.value).titleColor
      },
      axisLine: {
        lineStyle: {
          color: theme.value === 'chalk' ? "rgba(255, 255, 255, 0.4)" : "rgba(0, 0, 0, 0.3)"
        }
      }
    },
    yAxis: {
      axisLabel: {
        color: getThemeValue(theme.value).titleColor
      },
      axisLine: {
        lineStyle: {
          color: theme.value === 'chalk' ? "rgba(255, 255, 255, 0.4)" : "rgba(0, 0, 0, 0.3)"
        }
      }
    },
    series: [
      {
        barWidth: titleFontSize.value,
        label: {
          color: "#fff"
        },
        itemStyle: {
          barBorderRadius: [
            titleFontSize.value / 2,
            titleFontSize.value / 2,
            0,
            0,
          ],
        },
      },
    ],
  };
  chartInstance.setOption(adapterOption);
  chartInstance.resize();
}
defineExpose({
  screenAdapter
})
;

const startInterval = () => {
  if (timerId.value) {
    clearInterval(timerId.value);
  }
  timerId.value = setInterval(() => {
    startValue.value++;
    endValue.value++;
    if (endValue.value > allData.value.length - 1) {
      startValue.value = 0;
      endValue.value = 9;
    }
    updateChart();
  }, 2000);
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
      const axisLineColor = newVal === 'chalk' ? "rgba(255, 255, 255, 0.4)" : "rgba(0, 0, 0, 0.3)";
      chartInstance.setOption({
        title: {
          textStyle: {
            color: textColor
          }
        },
        xAxis: {
          axisLabel: {
            color: textColor
          },
          axisLine: {
            lineStyle: {
              color: axisLineColor
            }
          }
        },
        yAxis: {
          axisLabel: {
            color: textColor
          },
          axisLine: {
            lineStyle: {
              color: axisLineColor
            }
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
    <div class="com-chart" ref="rank_ref"></div>
  </div>
</template>

<style scoped>
</style>