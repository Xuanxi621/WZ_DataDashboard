import { ref, onMounted, onUnmounted, type Ref } from 'vue'
import { gsap } from 'gsap'

type Direction = 'toBottom' | 'toTop' | 'toLeft' | 'toRight'

export default function useMoveTo<T extends HTMLElement = HTMLElement>(
  direction: Direction,
  duration: number = 1,
  delay: number = 0,
  fixedTransform: string = ''
) {
  const eleRef = ref<T | null>(null)
  const tweenRef = ref<gsap.core.Tween | null>(null)

  const restart = (includeDelay = true) => {
    tweenRef.value?.restart(includeDelay)
  }

  const reverse = () => {
    tweenRef.value?.reverse()
  }

  onMounted(() => {
    if (eleRef.value) {
      const transformFrom = {
        toTop: `translate(0px, 100%)`,
        toBottom: `translate(0px, -100%)`,
        toLeft: `translate(100%, 0px)`,
        toRight: `translate(-100%, 0px)`,
      }[direction]

      tweenRef.value = gsap.fromTo(
        eleRef.value,
        {
          opacity: 0,
          transform: `${transformFrom} ${fixedTransform}`,
        },
        {
          opacity: 1,
          transform: `translate(0px, 0px) ${fixedTransform}`,
          duration,
          delay,
        }
      )

      tweenRef.value?.pause()
    }
  })

  onUnmounted(() => {
    tweenRef.value?.kill()
  })

  return { ref: eleRef, restart, reverse }
}

