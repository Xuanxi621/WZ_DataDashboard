<template>
  <Suspense>
    <template #default>
      <Demo1 />
    </template>
    <template #fallback>
      <Loading />
    </template>
  </Suspense>
</template>

<script setup lang="ts">
import { defineAsyncComponent } from 'vue'
import Loading from './loading.vue'

const Demo1 = defineAsyncComponent(() => import('./demo1.vue'))
</script>
