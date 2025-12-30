<template>
  <div class="wrapper">
    <Chart :use="chartUse" :option="chartOption" />
    <div class="statistics">
      <div class="statistics-title">收益总计</div>
      <NumberAnimation
        v-if="statistics"
        :value="statistics.total_revenue"
        :options="{ minimumFractionDigits: 2, maximumFractionDigits: 2 }"
        class="statistics-number" />
    </div>
    <div v-for="k in 4" :key="k" class="statistics1">
      <svg class="company-icon" viewBox="0 0 1024 1024" width="1em" height="1em" fill="#fbdf88">
        <path
          d="M597.479619 154.063238V852.358095h52.150857V320.658286l169.252572 58.88a56.32 56.32 0 0 1 25.795047 42.959238l0.170667 4.388571V852.358095H902.095238V926.47619H121.904762v-74.093714h56.953905v-566.613333c0-19.456 10.166857-37.546667 26.843428-47.85981l304.444953-131.705904c38.034286-23.503238 87.332571 3.510857 87.332571 47.859809zM471.771429 482.816l-167.107048 68.266667v80.115809l167.107048-68.242286v-80.14019z m0-175.225905L304.664381 377.904762v80.530286l167.107048-70.339048v-80.457143z" />
      </svg>
      企业数量
      <NumberAnimation
        v-if="statistics"
        :value="statistics.company_count"
        :options="{ maximumFractionDigits: 0 }"
        class="statistics1-number" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { LineChart } from 'echarts/charts'
import {
  GridComponent,
  TooltipComponent,
} from 'echarts/components'
import Chart from './components/Chart.vue'
import NumberAnimation from './components/NumberAnimation.vue'
import { api } from '../../api'

const colors = ['#fbdf88', '#ea580c']
const data = ref<number[]>([])
const statistics = ref<{ total_revenue: number; company_count: number } | null>(null)

onMounted(async () => {
  try {
    const [lineData, stats] = await Promise.all([
      api.getLineChartData(),
      api.getStatistics(),
    ])
    data.value = lineData.map(item => item.value)
    // 确保 total_revenue 是数字类型
    statistics.value = {
      total_revenue: typeof stats.total_revenue === 'string' 
        ? parseFloat(stats.total_revenue) 
        : Number(stats.total_revenue),
      company_count: Number(stats.company_count),
    }
  } catch (error) {
    console.error('Failed to load chart4 data:', error)
  }
})

const chartUse = [LineChart, GridComponent, TooltipComponent]

const chartOption = computed(() => ({
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow',
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
    outerBoundsMode: 'same',
  },
  calculable: true,
  xAxis: {
    show: false,
    data: data.value,
    boundaryGap: false,
  },
  yAxis: {
    show: false,
    type: 'value',
  },
  series: {
    name: 'series1',
    type: 'line',
    symbol: 'none',
    itemStyle: {
      color: colors[0],
    },
    areaStyle: {
      color: {
        type: 'linear',
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
    data: data.value,
  },
}))
</script>

<style scoped>
.wrapper {
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  grid-template-rows: 2fr repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.statistics {
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
}

.statistics-title {
  font-size: 12px;
  color: rgba(0, 0, 0, 0.7);
}

.statistics-number {
  display: flex;
  align-items: baseline;
  gap: 4px;
  font-size: 28px;
  font-weight: 600;
  color: #ea580c;
}

.statistics-number::after {
  content: '亿万元';
  display: inline-block;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.7);
  font-weight: normal;
}

.statistics1 {
  display: flex;
  align-items: center;
  color: rgba(0, 0, 0, 0.8);
}

.statistics1-number {
  font-size: 20px;
  font-weight: 600;
  margin-left: 16px;
  color: #ea580c;
}

.company-icon {
  vertical-align: middle;
  margin-right: 4px;
}
</style>

