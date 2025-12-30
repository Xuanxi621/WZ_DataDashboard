<template>
  <div ref="chartBox" class="chart-wrapper" :style="style"></div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, nextTick } from 'vue'
import * as echarts from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import type { EChartsOption, EChartsType } from 'echarts'
import useSize from '../composables/useSize'
import { useDebounceEffect } from '../composables/useDebounceEffect'

echarts.use(CanvasRenderer)

interface Props {
  option: EChartsOption
  use: Parameters<typeof echarts.use>[0]
  style?: Record<string, any>
  theme?: string | object
}

const props = defineProps<Props>()

const chartBox = ref<HTMLDivElement | null>(null)
const chart = ref<EChartsType | null>(null)
const size = useSize(chartBox)

echarts.use(props.use)

watch(
  () => props.option,
  (newOption) => {
    if (!chart.value) return
    chart.value.setOption(newOption, {
      notMerge: false,
      lazyUpdate: true,
      replaceMerge: ['series'],
    })
  },
  { deep: true }
)

useDebounceEffect(
  () => {
    if (size.value?.width !== 0 && size.value?.height !== 0) {
      chart.value?.resize()
    }
  },
  size,
  300
)

onMounted(async () => {
  await nextTick()
  if (chartBox.value) {
    chart.value = echarts.init(chartBox.value as HTMLElement, props.theme)
    if (chart.value) {
      chart.value.setOption(props.option)
    }
  }
})

onUnmounted(() => {
  chart.value?.dispose()
  chart.value = null
})

defineExpose({
  chart,
})
</script>

<style scoped>
.chart-wrapper {
  width: 100%;
  height: 100%;
}
</style>

