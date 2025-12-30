<template>
  <Chart ref="chartRef" :use="chartUse" :option="chartOption" />
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { BarChart, type BarSeriesOption } from 'echarts/charts'
import {
  GridComponent,
  TooltipComponent,
  type GridComponentOption,
  type TooltipComponentOption,
} from 'echarts/components'
import type { ComposeOption, EChartsType } from 'echarts/core'
import Chart from './components/Chart.vue'
import useRafInterval from './composables/useRafInterval'

type BarOption = ComposeOption<
  BarSeriesOption | TooltipComponentOption | GridComponentOption
>

const data = [3000, 2000, 4000, 5000, 4500]
const colors = ['#fbdf88', '#ea580c']
const xData = ['50万以下', '50～100万', '100～500万', '500～1000万', '1000万以上']

const chartRef = ref<{ chart: EChartsType } | null>(null)
const tipIndex = ref(0)

useRafInterval(
  () => {
    const chartInstance = chartRef.value?.chart
    if (chartInstance) {
      chartInstance.dispatchAction({
        type: 'showTip',
        seriesIndex: 0,
        dataIndex: tipIndex.value,
      })
      tipIndex.value = (tipIndex.value + 1) % data.length
    }
  },
  3000,
  true
)

const chartUse = [BarChart, TooltipComponent, GridComponent]

const chartOption = computed<BarOption>(() => ({
  tooltip: {
    trigger: 'axis',
    backgroundColor: 'rgba(255, 245, 232,0.8)',
    borderColor: colors[1],
    borderWidth: 1,
    borderRadius: 8,
    textStyle: {
      color: 'rgba(0, 0, 0,0.8)',
      fontSize: 13,
      align: 'left',
    },
    axisPointer: {
      type: 'line',
      lineStyle: {
        width: 1,
        type: 'dotted',
        color: colors[0],
      },
    },
  },
  grid: {
    top: '20%',
    bottom: '5%',
    left: 10,
    right: 10,
    outerBoundsMode: 'same',
  },
  xAxis: {
    type: 'category',
    axisLine: {
      lineStyle: {
        color: 'rgba(0, 0, 0, 0.1)',
      },
    },
    axisLabel: {
      interval: 0,
      color: 'rgba(0, 0, 0, 0.6)',
    },
    axisTick: {
      show: false,
    },
    data: xData,
  },
  yAxis: {
    type: 'value',
    splitLine: {
      show: false,
    },
    axisLine: {
      show: false,
    },
    axisLabel: {
      color: 'rgba(0, 0, 0, 0.6)',
    },
    axisTick: {
      show: false,
    },
  },
  series: [
    {
      name: '',
      type: 'bar',
      barWidth: 30,
      label: {
        show: true,
        position: 'top',
        color: 'rgba(0, 0, 0, 0.8)',
      },
      itemStyle: {
        borderRadius: [15, 15, 0, 0],
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: colors.map((color, index) => ({
            offset: index,
            color: color,
          })),
          global: false,
        },
      },
      data: data,
    },
  ],
}))
</script>

