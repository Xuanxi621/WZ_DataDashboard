<template>
  <Chart :use="chartUse" :option="chartOption" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { PieChart, type PieSeriesOption } from 'echarts/charts'
import type { ComposeOption } from 'echarts/core'
import {
  LegendComponent,
  TooltipComponent,
  type LegendComponentOption,
  type TooltipComponentOption,
} from 'echarts/components'
import Chart from './components/Chart.vue'
import useRafInterval from './composables/useRafInterval'

type PieOption = ComposeOption<
  PieSeriesOption | TooltipComponentOption | LegendComponentOption
>

const color = ['#fbdf88', '#ffa800', '#ff5b00', '#ff3000']

const trafficWay = [
  { name: '第一季度', value: 20 },
  { name: '第二季度', value: 10 },
  { name: '第三季度', value: 30 },
  { name: '第四季度', value: 40 },
]

const data = trafficWay.reduce<PieSeriesOption['data']>((pre, cur, i) => {
  pre?.push(
    {
      value: cur.value,
      name: cur.name,
      itemStyle: {
        borderRadius: 10,
        shadowBlur: 20,
        color: color[i],
        shadowColor: color[i],
      },
    },
    {
      value: 2,
      name: '',
      itemStyle: {
        color: 'rgba(0, 0, 0, 0)',
        borderColor: 'rgba(0, 0, 0, 0)',
        borderWidth: 0,
      },
    }
  )
  return pre
}, [])

useRafInterval(() => {}, 3000, true)

const chartUse = [PieChart, TooltipComponent, LegendComponent]

const chartOption = computed<PieOption>(() => ({
  color: color[0],
  tooltip: {
    show: false,
  },
  legend: {
    icon: 'circle',
    orient: 'vertical',
    data: ['第一季度', '第二季度', '第三季度', '第四季度'],
    top: 'middle',
    right: '10%',
    textStyle: {
      color: '#000000',
    },
    itemGap: 20,
  },
  series: {
    name: '',
    type: 'pie',
    center: ['30%', '50%'],
    radius: [70, 80],
    label: {
      show: false,
    },
    labelLine: {
      show: false,
    },
    data: data,
  },
}))
</script>

