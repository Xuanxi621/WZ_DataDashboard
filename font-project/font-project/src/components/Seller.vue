<script setup>
import { ref, onMounted, inject, onUnmounted, computed,watch} from "vue";
import {useThemeStore} from "../stores/themeStore.js";
import {storeToRefs} from 'pinia'
import { getThemeValue } from "../utils/theme_utils.js";
const themeStore = useThemeStore()
const { theme } = storeToRefs(themeStore) 
//使用ref定义响应式数据,替代data()选项
let chartInstance = null;
const allData = ref(null);
const seller_ref = ref(null);
const currentPage = ref(1);
const totalPage = ref(0);
const timerId = ref(null);
//使用inject获取全局的$http示例
const $http = inject("$http");
//使用inject获取全局的$echarts实例
const $echarts = inject("$echarts");
//定义方法,直接作为函数声明，替代methods选项
const initChart = () => {
  // 第一步：初始化图表逻辑
  //可以通过seller_ref.value访问DOM元素
  chartInstance = $echarts.init(seller_ref.value, theme.value);
  // 对鼠标事件进行监听
  chartInstance.on("mouseover", () => {
    clearInterval(timerId.value);
  });
  chartInstance.on("mouseout", () => {
    startInterval();
  });
  //对图表进行初始化配置
  const initOption = {
    //标题
    title: {
      text: "┃ 商家销售量统计",
      left: 20,
      top: 20,
      textStyle: {
        fontSize: 66,
        color: "#fff", // 强制使用白色
      },
    },
    //坐标轴网格
    grid: {
      top: "20%",
      left: "3%",
      right: "6%",
      bottom: "3%",
      containLabel: true, ///边距包含文字标签
    },
    //tooltip提示框
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
        type: "shadow",
        shadowStyle: {
          color: "rgba(171, 110, 229, 0.3)"
        }
      },
      formatter: (params) => {
        const color = params[0].color;
        return `<div style="padding: 5px;"><strong style="font-size:14px;">${params[0].name}</strong><br/><hr style="border-color:rgba(255,255,255,0.2);margin:8px 0;"><span style="color:${color}">销量: <strong>${params[0].value}</strong></span></div>`;
      },
      extraCssText: "box-shadow: 0 0 20px rgba(171, 110, 229, 0.5);"
    },
    //X轴
    xAxis: {
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
    //Y轴
    yAxis: {
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
    //数据轴数据
    series: [
      {
        type: "bar",
        label: {
          show: true,
          position: "right",
          textStyle: {
            color: getThemeValue(theme.value).titleColor,
            fontSize: 11,
            fontWeight: "bold"
          },
          formatter: "{c}"
        },
        animation: true,
        animationDuration: 1000,
        animationEasing: "cubicOut",
        itemStyle: {
          color: new $echarts.graphic.LinearGradient(0, 0, 1, 0, [
            {
              offset: 0,
              color: "#4169E1",
            },
            {
              offset: 0.3,
              color: "#64B4FF",
            },
            {
              offset: 0.7,
              color: "#72CCFF",
            },
            {
              offset: 1,
              color: "#87CEFA",
            },
          ]),
          borderWidth: 0,
          shadowBlur: 12,
          shadowColor: "#72CCFF",
          shadowOffsetX: 3,
          shadowOffsetY: 3
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 25,
            shadowColor: "#72CCFF",
            shadowOffsetX: 5,
            shadowOffsetY: 5
          },
          scale: true
        }
      },
    ],
  };
  chartInstance.setOption(initOption);
  screenAdapter();
};
const getData = async () => {
  //获取数据逻辑
  try {
    //使用$http实例获取seller.json数据
    const response = await $http.get("seller");
    allData.value = response;
    console.log("获取到的数据:", allData.value);
    allData.value.sort((a, b) => a.value - b.value);
    totalPage.value =
      allData.value.length % 5 === 0
        ? allData.value.length / 5
        : allData.value / 5 + 1;
    //数据加载完成后立即更新图表
    updateChart();
    startInterval();
  } catch (error) {
    console.error("获取数据失败:", error);
  }
};

const updateChart = () => {
  const start = (currentPage.value - 1) * 5;
  const end = currentPage.value * 5;
  const showData = Array.from(allData.value).slice(start, end); //包含start但是不包含end，注意这里用的是slice方法，千万不要打成splice
  console.log(showData);
  const sellerNames = showData.map((item) => {
    return item.name;
  });
  const sellerValues = showData.map((item) => {
    return item.value;
  });
  //更新图表逻辑
  const dataOption = {
    //Y轴
    yAxis: {
      data: sellerNames,
    },
    //数据轴数据
    series: [
      {
        data: sellerValues,
      },
    ],
  };
  chartInstance.setOption(dataOption);
};

const startInterval = () => {
  if (timerId.value) {
    clearInterval(timerId.value);
  }
  timerId.value = setInterval(() => {
    currentPage.value++;
    if (currentPage.value > totalPage.value) {
      currentPage.value = 1;
    }
    updateChart();
  }, 3000);
};
const screenAdapter = () => {
  //基准值，已经测试好
  const titleFontSize = (seller_ref.value.offsetWidth / 100) * 3.6;
  //和分辨率大小相关的配置项
  const adapterOption = {
    title: {
      textStyle: {
        fontSize: titleFontSize,
        color: getThemeValue(theme.value).titleColor, // 根据主题动态设置
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
    tooltip: {
      axisPointer: {
        lineStyle: {
          width: titleFontSize,
        },
      },
    },
    series: [
      {
        barWidth: titleFontSize,
        label: {
          textStyle: {
            color: "#fff"
          }
        },
        itemStyle: {
          barBorderRadius: [0, titleFontSize / 2, titleFontSize / 2, 0],
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

//使用onMounted生命周期钩子替代mounted选项
onMounted(() => {
  initChart();
  getData();
  //监听页面窗口大小发生变化的事件，执行screenAdapter方法
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
            textStyle: {
              color: textColor
            }
          }
        }]
      })
    }
)
</script>

<template>
  <div class="com-container">
    <div class="com-chart" ref="seller_ref"></div>
  </div>
</template>

<style scoped>
</style>