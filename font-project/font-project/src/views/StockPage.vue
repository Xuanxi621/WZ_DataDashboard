<script setup>
    import { ref } from 'vue'
    import Stock from "../components/Stock.vue";
    const stockComponent = ref(null)
    //定义一个方法，内部调用stock组件的screenAdapter
    const triggerScreenAdapter = () => {
        if (stockComponent.value){
            stockComponent.value.screenAdapter();
        }
    };

    //暴露该方法给父组件
    defineExpose({
        triggerScreenAdapter
    });
</script>

<template>
    <div class="com-page">
        <Stock ref="stockComponent" />
    </div>
</template>

<style scoped>

</style>