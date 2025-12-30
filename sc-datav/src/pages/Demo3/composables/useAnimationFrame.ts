import { onMounted, onUnmounted } from 'vue'

export default function useAnimationFrame(
  callback: (timestamp: number) => void,
  enabled = true
) {
  let rafId: number | null = null

  const tick = (timestamp: number) => {
    if (enabled) {
      callback(timestamp)
    }
    rafId = requestAnimationFrame(tick)
  }

  onMounted(() => {
    if (enabled) {
      rafId = requestAnimationFrame(tick)
    }
  })

  onUnmounted(() => {
    if (rafId) {
      cancelAnimationFrame(rafId)
    }
  })

  return { start: () => (rafId = requestAnimationFrame(tick)), stop: () => rafId && cancelAnimationFrame(rafId) }
}

