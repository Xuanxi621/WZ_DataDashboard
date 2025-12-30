<template>
  <Chart :use="chartUse" :option="chartOption" />
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
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
import { api } from '../../api'

type PieOption = ComposeOption<
  PieSeriesOption | TooltipComponentOption | LegendComponentOption
>

const color = ['#fbdf88', '#ffa800', '#ff5b00', '#ff3000']
const pieDataRaw = ref<Array<{ name: string; value: number }>>([])

onMounted(async () => {
  try {
    const data = await api.getPieData()
    pieDataRaw.value = data.map(item => ({
      name: item.name,
      value: item.value,
    }))
  } catch (error) {
    console.error('Failed to load chart5 data:', error)
  }
})

const data = computed<PieSeriesOption['data']>(() => {
  return pieDataRaw.value.reduce<PieSeriesOption['data']>((pre, cur, i) => {
    pre?.push(
      {
        value: cur.value,
        name: cur.name,
        itemStyle: {
          borderRadius: 10,
          shadowBlur: 20,
          color: color[i % color.length],
          shadowColor: color[i % color.length],
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
})

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
    data: pieDataRaw.value.map(item => item.name),
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
    data: data.value,
  },
}))
</script>

