<template>
  <div :id="id" class="wrapper">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import autofit from 'autofit.js'

const id = ref(`autofit_${Date.now().toString(36)}`)

onMounted(() => {
  autofit.init({ el: `#${id.value}` })
})

onUnmounted(() => {
  autofit.off()
})
</script>

<style scoped>
.wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 10;
  display: flex;
  flex-direction: column;
}
</style>

