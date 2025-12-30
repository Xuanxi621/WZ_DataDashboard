<template>
  <div class="wrapper">
    <Map />
    <Content />
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent } from 'vue'
import Map from './3Dmap/index.vue'

const Content = defineAsyncComponent(() => import('./content.vue'))
</script>

<style scoped>
.wrapper {
  position: relative;
  width: 100vw;
  height: 100vh;
}
</style>

