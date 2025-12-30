<template>
  <div ref="chartBox" class="chart-wrapper" :style="style"></div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, nextTick, toRaw } from 'vue'
import * as echarts from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import type { EChartsOption, EChartsType } from 'echarts'
import useSize from '../composables/useSize'
import { useDebounceEffect } from '../composables/useDebounceEffect'

echarts.use(CanvasRenderer)

interface Props {
  option: EChartsOption
  use: Parameters<typeof echarts.use>[0] | Parameters<typeof echarts.use>[0][]
  style?: Record<string, any>
  theme?: string | object
}

const props = defineProps<Props>()

const chartBox = ref<HTMLDivElement | null>(null)
const chart = ref<EChartsType | null>(null)
const size = useSize(chartBox)
const isInitialized = ref(false)

// 安全的深度克隆函数，避免循环引用
const safeClone = <T>(obj: T): T => {
  if (obj === null || typeof obj !== 'object') {
    return obj
  }
  
  if (obj instanceof Date) {
    return new Date(obj.getTime()) as unknown as T
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => safeClone(item)) as unknown as T
  }
  
  const cloned = {} as T
  const seen = new WeakMap()
  
  const clone = (source: any, target: any) => {
    if (seen.has(source)) {
      return seen.get(source)
    }
    
    seen.set(source, target)
    
    for (const key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        const value = source[key]
        if (value === null || typeof value !== 'object') {
          target[key] = value
        } else if (value instanceof Date) {
          target[key] = new Date(value.getTime())
        } else if (Array.isArray(value)) {
          target[key] = value.map(item => safeClone(item))
        } else if (typeof value === 'function') {
          // 跳过函数
          continue
        } else {
          target[key] = clone(value, {})
        }
      }
    }
    
    return target
  }
  
  return clone(obj, cloned) as T
}

// 注册ECharts组件的函数
// 注意：函数引用本身不会被Vue响应式系统包装，所以可以直接使用
const registerComponents = () => {
  const useValue = props.use
  
  if (Array.isArray(useValue)) {
    // 如果是数组，遍历每个组件并注册
    // 使用类型断言避免TypeScript展开运算符的类型检查问题
    for (const comp of useValue) {
      // 确保组件是函数引用，不是响应式代理
      const component = comp as Parameters<typeof echarts.use>[0]
      if (component && typeof component === 'function') {
        echarts.use(component)
      }
    }
  } else {
    // 单个组件直接注册
    if (useValue && typeof useValue === 'function') {
      echarts.use(useValue)
    }
  }
}

// 在setup中也注册一次，确保组件在初始化前已注册
// 虽然 onMounted 中也会注册，但这里可以提前注册
registerComponents()

watch(
  () => props.option,
  (newOption) => {
    if (!chart.value || !isInitialized.value) return
    // 使用安全的深度克隆函数，避免响应式问题和循环引用
    const rawOption = safeClone(toRaw(newOption))
    chart.value.setOption(rawOption, {
      notMerge: false,
      lazyUpdate: true,
      replaceMerge: ['series'],
    })
  },
  { deep: true }
)

useDebounceEffect(
  () => {
    // 只有在初始化完成后才调用resize，避免在初始化过程中调用
    if (size.value?.width !== 0 && size.value?.height !== 0 && chart.value && isInitialized.value) {
      // 使用nextTick确保在下一个事件循环中调用resize
      nextTick(() => {
        if (chart.value && isInitialized.value) {
          try {
            chart.value.resize()
          } catch (error) {
            // 忽略resize错误，可能是在初始化过程中
            console.warn('Resize error:', error)
          }
        }
      })
    }
  },
  size,
  300
)

onMounted(async () => {
  await nextTick()
  if (chartBox.value) {
    try {
      // 必须在 echarts.init 之前注册组件
      // 这是关键：组件注册必须在实例化之前完成
      registerComponents()
      
      // 初始化图表
      chart.value = echarts.init(chartBox.value as HTMLElement, props.theme) as unknown as EChartsType
      if (chart.value) {
        // 使用安全的深度克隆函数，避免响应式问题和循环引用
        const rawOption = safeClone(toRaw(props.option))
        chart.value.setOption(rawOption, {
          notMerge: false,
          lazyUpdate: false,
        })
        // 标记为已初始化
        isInitialized.value = true
      }
    } catch (error) {
      console.error('Chart initialization error:', error)
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
