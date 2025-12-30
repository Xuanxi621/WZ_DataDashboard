import { onMounted, onUnmounted, watch, type Ref } from 'vue'

export function useRafInterval(
  callback: () => void,
  delay: number | Ref<number>,
  immediate = false
) {
  let rafId: number | null = null
  let lastTime = performance.now()

  const tick = (currentTime: number) => {
    const delayValue = typeof delay === 'number' ? delay : delay.value
    if (delayValue == null || delayValue <= 0) return

    let delta = currentTime - lastTime

    while (delta >= delayValue) {
      callback()
      delta -= delayValue
      lastTime += delayValue
    }

    rafId = requestAnimationFrame(tick)
  }

  const start = () => {
    if (rafId) return
    const delayValue = typeof delay === 'number' ? delay : delay.value
    if (delayValue == null || delayValue <= 0) return

    if (immediate) {
      callback()
      lastTime = performance.now()
    }

    rafId = requestAnimationFrame(tick)
  }

  const stop = () => {
    if (rafId) {
      cancelAnimationFrame(rafId)
      rafId = null
    }
  }

  onMounted(() => {
    start()
  })

  onUnmounted(() => {
    stop()
  })

  if (typeof delay !== 'number') {
    watch(delay, () => {
      stop()
      lastTime = performance.now()
      start()
    })
  }

  return { start, stop }
}

export default useRafInterval

