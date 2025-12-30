<script setup>
    import { ref } from 'vue'
    import Trend from "../components/Trend.vue";
    const trendComponent = ref(null)
    //定义一个方法，内部调用trend组件的screenAdapter
    const triggerScreenAdapter = () => {
        if (trendComponent.value){
            trendComponent.value.screenAdapter();
        }
    };

    //暴露该方法给父组件
    defineExpose({
        triggerScreenAdapter
    });
</script>

<template>
    <div class="com-page">
        <Trend ref="trendComponent" />
    </div>
</template>

<style scoped>

</style>