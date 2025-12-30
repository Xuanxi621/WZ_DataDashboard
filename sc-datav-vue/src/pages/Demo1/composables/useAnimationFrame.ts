import { onMounted, onUnmounted, watch, type Ref, type ComputedRef } from 'vue'

export default function useAnimationFrame(
  callback: (timestamp: number) => void,
  enabled: boolean | Ref<boolean> | ComputedRef<boolean> = true
) {
  let rafId: number | null = null

  const tick = (timestamp: number) => {
    const shouldRun = typeof enabled === 'boolean' ? enabled : enabled.value
    if (shouldRun) {
      callback(timestamp)
    }
    if (rafId !== null) {
      rafId = requestAnimationFrame(tick)
    }
  }

  const start = () => {
    if (rafId === null) {
      rafId = requestAnimationFrame(tick)
    }
  }

  const stop = () => {
    if (rafId !== null) {
      cancelAnimationFrame(rafId)
      rafId = null
    }
  }

  const isEnabled = typeof enabled === 'boolean' ? enabled : enabled.value

  onMounted(() => {
    if (isEnabled) {
      start()
    }
  })

  onUnmounted(() => {
    stop()
  })

  // 如果 enabled 是响应式的，监听变化
  if (typeof enabled !== 'boolean') {
    watch(enabled, (newVal) => {
      if (newVal) {
        start()
      } else {
        stop()
      }
    }, { immediate: false })
  }

  return { start, stop }
}

