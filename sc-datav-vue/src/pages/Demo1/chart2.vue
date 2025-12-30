<template>
  <Chart ref="chartRef" :use="chartUse" :option="chartOption" />
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { ComposeOption, EChartsType } from 'echarts/core'
import { LineChart, type LineSeriesOption } from 'echarts/charts'
import {
  DataZoomComponent,
  GridComponent,
  LegendComponent,
  MarkPointComponent,
  TooltipComponent,
  type DataZoomComponentOption,
  type GridComponentOption,
  type LegendComponentOption,
  type MarkPointComponentOption,
  type TooltipComponentOption,
} from 'echarts/components'
import Chart from './components/Chart.vue'
import useRafInterval from './composables/useRafInterval'

type LineOption = ComposeOption<
  | LineSeriesOption
  | TooltipComponentOption
  | GridComponentOption
  | LegendComponentOption
  | DataZoomComponentOption
  | MarkPointComponentOption
>

import { api } from '../../api'

const colors = ['#fbdf88', '#ea580c']
const dataType = { type1: '今年同期', type2: '去年同期' }

const data = ref<[string[], number[], number[]]>([[], [], []])

onMounted(async () => {
  try {
    const timeSeriesData = await api.getTimeSeriesData()
    data.value = [
      timeSeriesData.map(item => item.date),
      timeSeriesData.map(item => item.current_year_value),
      timeSeriesData.map(item => item.last_year_value),
    ]
  } catch (error) {
    console.error('Failed to load chart2 data:', error)
  }
})

const chartRef = ref<{ chart: EChartsType } | null>(null)
const xLength = ref(0)

useRafInterval(() => {
  const chartInstance = chartRef.value?.chart
  if (chartInstance && data.value[0].length > 0) {
    chartInstance.dispatchAction({
      type: 'dataZoom',
      startValue: xLength.value,
      endValue: xLength.value + 8,
    })
    xLength.value = (xLength.value + 1) % (data.value[0].length - 8)
  }
}, 2000)

const chartUse = [
  LineChart,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  DataZoomComponent,
  MarkPointComponent,
]

const chartOption = computed(() => ({
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow' as const,
    },
    textStyle: {
      color: 'rgba(0, 0, 0,0.8)',
    },
    backgroundColor: 'rgba(255, 245, 232,0.8)',
    borderColor: colors[1],
    borderWidth: 1,
    borderRadius: 8,
  },
  grid: {
    top: 16,
    bottom: 16,
    left: 16,
    right: 16,
    outerBoundsMode: 'same' as const,
  },
  legend: {
    right: 16,
    top: 0,
    data: Object.values(dataType).map((item, index) => ({
      name: item,
      value: 2000,
      icon: 'none',
      textStyle: {
        color: colors[index],
      },
    })),
  },
  calculable: true,
  xAxis: {
    type: 'category' as const,
    boundaryGap: false,
    axisLine: {
      lineStyle: {
        color: 'rgba(0, 0, 0, 0.1)',
      },
    },
    axisLabel: {
      interval: 0,
      color: 'rgba(0, 0, 0, 0.6)',
    },
    splitLine: {
      show: false,
    },
    axisTick: {
      show: false,
    },
    data: data.value[0],
  },
  yAxis: {
    type: 'value' as const,
    axisLabel: {
      interval: 0,
      color: 'rgba(0, 0, 0, 0.6)',
    },
    splitLine: {
      show: false,
    },
    axisLine: {
      show: true,
      lineStyle: {
        color: 'rgba(0, 0, 0, 0.1)',
      },
    },
  },
  dataZoom: {
    type: 'slider' as const,
    show: false,
    realtime: true,
    startValue: 0,
    endValue: 8,
  },
  series: [
    {
      name: '今年同期',
      type: 'line' as const,
      symbol: 'none' as const,
      smooth: true,
      itemStyle: {
        color: colors[0],
      },
      areaStyle: {
        color: {
          type: 'linear' as const,
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: colors[0] },
            { offset: 1, color: 'rgba(255,255,255,0.1)' },
          ],
          global: false,
        },
      },
      markPoint: {
        symbol: 'rect' as const,
        symbolSize: [50, 20],
        symbolOffset: [0, -10],
        label: {
          color: '#ffffff',
        },
        data: [
          {
            type: 'max' as const,
            name: '最大值',
          },
        ],
      },
      data: data.value[1],
    },
    {
      name: '去年同期',
      type: 'line' as const,
      symbol: 'none' as const,
      smooth: true,
      itemStyle: {
        color: colors[1],
      },
      areaStyle: {
        color: {
          type: 'linear' as const,
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: colors[1] },
            { offset: 1, color: 'rgba(255,255,255,0.1)' },
          ],
          global: false,
        },
      },
      markPoint: {
        symbol: 'rect' as const,
        symbolSize: [50, 20],
        symbolOffset: [0, -10],
        label: {
          color: '#ffffff',
        },
        data: [
          {
            type: 'max' as const,
            name: '最大值',
          },
        ],
      },
      data: data.value[2],
    },
  ],
}))
</script>

