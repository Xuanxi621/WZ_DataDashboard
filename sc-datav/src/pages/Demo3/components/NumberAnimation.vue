<template>
  <div ref="elRef" :class="className" :style="style"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'

interface Props {
  value: number
  duration?: number
  delay?: number
  options?: Intl.NumberFormatOptions
  className?: string
  style?: Record<string, any>
}

const props = withDefaults(defineProps<Props>(), {
  duration: 2,
  delay: 0,
  options: () => ({}),
  className: '',
  style: () => ({}),
})

const fromVal = ref<{ current: number }>({ current: 0 })
const elRef = ref<HTMLDivElement | null>(null)

onMounted(() => {
  if (!elRef.value) return

  let tween: gsap.core.Tween

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        tween = gsap.to(fromVal.value, {
          current: props.value,
          duration: props.duration,
          delay: props.delay,
          ease: 'power1.out',
          onUpdate() {
            if (elRef.value) {
              elRef.value.innerHTML = fromVal.value.current.toLocaleString(
                'zh-CN',
                props.options
              )
            }
          },
        })
      }
    },
    {
      threshold: 0.1,
    }
  )

  observer.observe(elRef.value)

  onUnmounted(() => {
    tween?.kill()
    observer.disconnect()
  })
})
</script>

