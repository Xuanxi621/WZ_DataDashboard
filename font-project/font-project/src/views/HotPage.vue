<script setup>
  import { ref } from 'vue'
  import Hot from "../components/Hot.vue";
  const hotComponent = ref(null)
    //定义一个方法，内部调用hot组件的screenAdapter
    const triggerScreenAdapter = () => {
        if (hotComponent.value){
            hotComponent.value.screenAdapter();
        }
    };

    //暴露该方法给父组件
    defineExpose({
        triggerScreenAdapter
    });
</script>

<template>
  <div class="com-page">
    <Hot ref="hotComponent" />
  </div>
</template>

<style scoped>
</style>