<script setup>
    import { ref } from 'vue'
    import Map from "../components/Map.vue";

    const mapComponent = ref(null)
    //定义一个方法，内部调用map组件的screenAdapter
    const triggerScreenAdapter = () => {
        if (mapComponent.value){
            mapComponent.value.screenAdapter();
        }
    };

    //暴露该方法给父组件
    defineExpose({
        triggerScreenAdapter
    });
</script>

<template>
    <div class="com-page">
        <Map ref="mapComponent" />
    </div>
</template>

<style scoped>

</style>