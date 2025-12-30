import { ref, computed } from 'vue'

interface ConfigStore {
  mapPlayComplete: boolean
  cloud: boolean
  bar: boolean
  rotation: boolean
  heat: boolean
  mode: boolean
}

const state = ref<ConfigStore>({
  mapPlayComplete: false,
  cloud: true,
  bar: true,
  rotation: true,
  heat: true,
  mode: true,
})

export const useConfigStore = () => {
  const toggle = (key: keyof Omit<ConfigStore, 'toggle'>) => {
    state.value[key] = !state.value[key]
  }

  const subscribe = <K extends keyof ConfigStore>(
    selector: (s: ConfigStore) => ConfigStore[K],
    callback: (value: ConfigStore[K]) => void
  ) => {
    const currentValue = selector(state.value)
    let lastValue = currentValue

    const check = () => {
      const newValue = selector(state.value)
      if (newValue !== lastValue) {
        lastValue = newValue
        callback(newValue)
      }
    }

    const interval = setInterval(check, 16) // ~60fps

    return () => {
      clearInterval(interval)
    }
  }

  return {
    state: computed(() => state.value),
    toggle,
    subscribe,
    setState: (newState: Partial<ConfigStore>) => {
      Object.assign(state.value, newState)
    },
  }
}

