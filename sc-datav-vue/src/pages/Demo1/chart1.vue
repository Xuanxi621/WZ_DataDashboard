<template>
  <Chart :use="chartUse" :option="chartOption" />
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { ComposeOption } from 'echarts/core'
import {
  PictorialBarChart,
  type BarSeriesOption,
  type PictorialBarSeriesOption,
} from 'echarts/charts'
import {
  GridComponent,
  TooltipComponent,
  type GridComponentOption,
  type TooltipComponentOption,
} from 'echarts/components'
import { LabelLayout } from 'echarts/features'
import Chart from './components/Chart.vue'
import { api } from '../../api'

type BarOption = ComposeOption<
  | PictorialBarSeriesOption
  | BarSeriesOption
  | TooltipComponentOption
  | GridComponentOption
>

const colors = ['#fbdf88', '#ea580c']
const data = ref<Array<{ name: string; value: number }>>([])

onMounted(async () => {
  try {
    const cities = await api.getTopCities()
    data.value = cities.map(city => ({
      name: city.name,
      value: city.population,
    }))
  } catch (error) {
    console.error('Failed to load chart1 data:', error)
  }
})

const chartUse = [PictorialBarChart, GridComponent, TooltipComponent, LabelLayout]

const chartOption = computed(() => ({
  grid: {
    top: 0,
    bottom: 0,
    left: '8%',
    right: '12%',
  },
  xAxis: {
    show: false,
  },
  yAxis: {
    axisLine: {
      show: false,
    },
    axisTick: {
      show: false,
    },
    axisLabel: {
      fontSize: 14,
      margin: 16,
      inside: false,
      verticalAlign: 'middle' as const,
      color: '#000000',
      formatter: (v: any, i: number) => {
        return `{a|NO.${++i}} ${v}`
      },
      rich: {
        a: {
          color: 'rgba(0, 0, 0,0.6)',
        },
      },
    },
    data: data.value.map((item) => item.name),
    type: 'category' as const,
    inverse: true,
    animationDuration: 300,
    animationDurationUpdate: 300,
  },
  series: [
    {
      type: 'bar' as const,
      data: data.value.map((item) => item.value),
      realtimeSort: true,
      barWidth: 8,
      itemStyle: {
        borderRadius: 4,
        color: {
          type: 'linear' as const,
          x: 1,
          y: 0,
          x2: 0,
          y2: 0,
          colorStops: colors.map((color, index) => ({
            offset: index,
            color: color,
          })),
          global: false,
        },
      },
      showBackground: true,
      backgroundStyle: {
        borderRadius: 4,
      },
      label: {
        show: true,
        color: 'rgba(0, 0, 0,0.8)',
        valueAnimation: true,
        fontSize: 16,
        fontWeight: 'bold' as const,
      },
      labelLayout: (params: any) => {
        return {
          x: '100%',
          y: params.rect.y + params.rect.height / 2,
          verticalAlign: 'middle' as const,
          align: 'right' as const,
        }
      },
    },
    {
      name: 'dot',
      type: 'pictorialBar' as const,
      symbol: 'circle',
      symbolSize: 16,
      z: 12,
      itemStyle: {
        color: colors[0],
        shadowColor: colors[0],
        shadowBlur: 10,
      },
      data: data.value.map((item) => ({
        value: item.value,
        symbolPosition: 'end' as const,
      })),
    },
  ],
  animationDuration: 0,
  animationDurationUpdate: 1000,
  animationEasing: 'linear' as const,
  animationEasingUpdate: 'linear' as const,
}))
</script>

