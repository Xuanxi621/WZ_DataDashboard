<script setup>
    import { ref } from 'vue'
    import Seller from "../components/Seller.vue";
    const sellerComponent = ref(null)
    //定义一个方法，内部调用seller组件的screenAdapter
    const triggerScreenAdapter = () => {
        if (sellerComponent.value){
            sellerComponent.value.screenAdapter();
        }
    };

    //暴露该方法给父组件
    defineExpose({
        triggerScreenAdapter
    });
</script>

<template>
    <div class="com-page">
        <Seller ref="sellerComponent" />
    </div>
</template>

<style scoped>

</style>