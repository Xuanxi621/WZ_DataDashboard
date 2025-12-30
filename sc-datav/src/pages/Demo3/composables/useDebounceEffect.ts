import { watch, type WatchSource } from 'vue'

export function useDebounceEffect<T extends WatchSource>(
  effect: () => void,
  deps: T,
  delay: number
) {
  let timer: ReturnType<typeof setTimeout> | null = null

  watch(
    deps,
    () => {
      if (timer) {
        clearTimeout(timer)
      }
      timer = setTimeout(() => {
        effect()
      }, delay)
    },
    { deep: true, immediate: true }
  )
}

