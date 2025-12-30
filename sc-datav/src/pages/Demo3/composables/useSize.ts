import { ref, onMounted, onUnmounted, type Ref } from 'vue'

export default function useSize(elementRef: Ref<HTMLElement | null>) {
  const size = ref({ width: 0, height: 0 })

  onMounted(() => {
    if (!elementRef.value) return

    const observer = new ResizeObserver(([entry]) => {
      size.value = {
        width: entry.contentRect.width,
        height: entry.contentRect.height,
      }
    })

    observer.observe(elementRef.value)

    onUnmounted(() => {
      observer.disconnect()
    })
  })

  return size
}

