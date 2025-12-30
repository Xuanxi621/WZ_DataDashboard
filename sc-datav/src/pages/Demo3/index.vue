<template>
  <Suspense>
    <template #default>
      <Demo3 />
    </template>
    <template #fallback>
      <Loading />
    </template>
  </Suspense>
</template>

<script setup lang="ts">
import { defineAsyncComponent } from 'vue'
import Loading from './loading.vue'

const Demo3 = defineAsyncComponent(() => import('./demo3.vue'))
</script>

