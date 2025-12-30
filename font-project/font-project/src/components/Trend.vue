<script setup>
import { ref, onMounted, inject, onUnmounted, computed,watch} from "vue";
import {useThemeStore} from "../stores/themeStore.js";
import {storeToRefs} from 'pinia'
import { getThemeValue } from "../utils/theme_utils.js"
const themeStore = useThemeStore()
const { theme } = storeToRefs(themeStore) 
let chartInstance = null;
const allData = ref(null);
const trend_ref = ref(null);
const showChoice = ref(false);
const choiceType = ref("map");
const titleFontSize = ref(0);
const $http = inject("$http");
const $echarts = inject("$echarts");
const initChart = () => {
  chartInstance = $echarts.init(trend_ref.value,theme.value);
  titleFontSize.value = (trend_ref.value.offsetWidth / 100) * 3.6;
  const initOption = {
    grid: {
      left: "3%",
      top: "35%",
      right: "4%",
      bottom: "1%",
      containLabel: true,
    },
    tooltip: {
      trigger: "axis",
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
      axisPointer: {
        type: "cross",
        crossStyle: {
          color: "#72CCFF"
        },
        lineStyle: {
          color: "rgba(114, 204, 255, 0.6)",
          width: 2,
          type: "solid",
          shadowBlur: 10,
          shadowColor: "#72CCFF"
        },
        label: {
          backgroundColor: "rgba(114, 204, 255, 0.8)",
          borderColor: "#72CCFF",
          color: "#fff"
        }
      },
      extraCssText: "box-shadow: 0 0 20px rgba(114, 204, 255, 0.5);"
    },
    legend: {
      left: 20,
      top: "15%",
      icon: "circle",
      textStyle: {
        color: "#fff",
        fontSize: 12
      },
      itemGap: 15
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
        fontSize: 11
      },
      splitLine: {
        show: false
      }
    },
    yAxis: {
      type: "value",
      axisLine: {
        lineStyle: {
          color: theme.value === 'chalk' ? "rgba(255, 255, 255, 0.4)" : "rgba(0, 0, 0, 0.3)"
        }
      },
      axisLabel: {
        color: getThemeValue(theme.value).titleColor,
        fontSize: 11
      },
      splitLine: {
        lineStyle: {
          color: "rgba(114, 204, 255, 0.3)",
          type: "dashed"
        }
      }
    },
    animation: true,
    animationDuration: 1500,
    animationEasing: "elasticOut",
    animationDelay: (idx) => idx * 100
  };
  chartInstance.setOption(initOption);
  screenAdapter();
};

const getData = async () => {
  try {
    const response = await $http.get("trend");
    allData.value = response;
    console.log("获取到的数据:", allData.value);
    updateChart();
  } catch (error) {
    console.log("获取数据失败:", error);
  }
};

const updateChart = () => {
  // 科技蓝主题渐变色
  const colorArr1 = [
    "rgba(65, 105, 225, 0.6)",   // 皇家蓝
    "rgba(100, 180, 255, 0.6)",  // 天蓝
    "rgba(114, 204, 255, 0.6)",  // 浅蓝
    "rgba(135, 206, 250, 0.6)",  // 天蓝色
    "rgba(173, 216, 230, 0.6)",  // 浅蓝色
  ];
  // 全透明的颜色值
  const colorArr2 = [
    "rgba(65, 105, 225, 0)",
    "rgba(100, 180, 255, 0)",
    "rgba(114, 204, 255, 0)",
    "rgba(135, 206, 250, 0)",
    "rgba(173, 216, 230, 0)",
  ];
  // 线条主色（更亮）
  const lineColors = [
    "#4169E1",
    "#64B4FF",
    "#72CCFF",
    "#87CEFA",
    "#ADD8E6"
  ];
  const timeArr = allData.value.common.month;
  //获取数值轴数据
  const valueArr = allData.value[choiceType.value].data;
  //将获取到的多个对象数据处理成series数组中的图形对象，格式为{type:'line',data: 具体数据}
  const seriesArr = valueArr.map((item, index) => {
    return {
      name: item.name,
      type: "line",
      data: item.data,
      stack: "map",
      smooth: true,
      symbol: "circle",
      symbolSize: 8,
      showSymbol: true,
      lineStyle: {
        width: 3,
        shadowColor: lineColors[index],
        shadowBlur: 15,
        shadowOffsetY: 0,
        color: new $echarts.graphic.LinearGradient(0, 0, 1, 0, [
          { offset: 0, color: lineColors[index] },
          { offset: 1, color: lineColors[index] + "80" }
        ])
      },
      itemStyle: {
        color: lineColors[index],
        borderWidth: 3,
        borderColor: "#fff",
        shadowBlur: 10,
        shadowColor: lineColors[index]
      },
      areaStyle: {
        color: new $echarts.graphic.LinearGradient(0, 0, 0, 1, [
          {
            offset: 0,
            color: colorArr1[index],
          },
          {
            offset: 0.5,
            color: colorArr1[index].replace("0.6", "0.3"),
          },
          {
            offset: 1,
            color: colorArr2[index],
          },
        ]),
      },
      emphasis: {
        focus: "series",
        lineStyle: {
          width: 4,
          shadowBlur: 25
        },
        itemStyle: {
          shadowBlur: 25,
          shadowColor: lineColors[index],
          borderWidth: 4
        },
        scale: true
      },
      animationDelay: (idx) => idx * 50
    };
  });
  const legendArr = valueArr.map((item) => {
    return item.name;
  });
  const dataOption = {
    xAxis: {
      data: timeArr,
    },
    legend: {
      data: legendArr,
    },
    series: seriesArr,
  };
  chartInstance.setOption(dataOption);
};

const screenAdapter = () => {
  titleFontSize.value = (trend_ref.value.offsetWidth / 100) * 3.6;
  const adapterOption = {
    legend: {
      itemWidth: titleFontSize.value,
      itemHeight: titleFontSize.value,
      itemGap: titleFontSize.value,
      textStyle: {
        fontSize: titleFontSize.value / 2,
        color: getThemeValue(theme.value).titleColor, // 根据主题动态设置
      },
    },
    xAxis: {
      axisLabel: {
        color: "#fff"
      },
      axisLine: {
        lineStyle: {
          color: "rgba(255, 255, 255, 0.4)"
        }
      }
    },
    yAxis: {
      axisLabel: {
        color: "#fff"
      },
      axisLine: {
        lineStyle: {
          color: "rgba(255, 255, 255, 0.4)"
        }
      }
    }
  };
  chartInstance.setOption(adapterOption);
  chartInstance.resize();
}
defineExpose({
  screenAdapter
});

const selectTypes = computed(() => {
  if (!allData.value) {
    return [];
  } else {
    return allData.value.type.filter((item) => item.key != choiceType.value);
  }
});

const handleSelect = (currentType) => {
  choiceType.value = currentType;
  updateChart();
  showChoice.value = false;
};

const showTitle = computed(() => {
  if (!allData.value) {
    return "";
  } else {
    return allData.value[choiceType.value].title;
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
      const axisLineColor = newVal === 'chalk' ? "rgba(255, 255, 255, 0.4)" : "rgba(0, 0, 0, 0.3)";
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
    <div class="title" :style="comStyle">
      <span>{{ "┃  " + showTitle }}</span>
      <span
        :style="comStyle"
        class="iconfont title-icon"
        @click="showChoice = !showChoice"
        >&#xe6eb;</span
      >
      <div class="select-con" v-show="showChoice" :style="marginStyle">
        <div
          class="select-item"
          v-for="item in selectTypes"
          :key="item.key"
          @click="handleSelect(item.key)"
        >
          {{ item.text }}
        </div>
      </div>
      <!-- 此处的ref需要根据当前图表来命名-->
    </div>
    <div class="com-chart" ref="trend_ref"></div>
  </div>
</template>

<style scoped>
.title {
  position: absolute;
  width: 80%;
  left: 20px;
  right: 20px;
  z-index: 10;
  color: white;
}
.title-icon {
  margin-left: 10px;
  cursor: pointer;
}

.select-con {
  background-color: rgba(0, 0, 0, 0.8);
  border: 1px solid rgba(114, 204, 255, 0.5);
  border-radius: 6px;
  padding: 5px 0;
  margin-top: 5px;
}

.select-item {
  padding: 8px 15px;
  cursor: pointer;
  color: #fff;
  transition: all 0.3s ease;
}

.select-item:hover {
  background-color: rgba(114, 204, 255, 0.2);
  color: #72CCFF;
}
</style>