<script setup>
    import { ref } from 'vue'
    import Rank from "../components/Rank.vue";
    const rankComponent = ref(null)
    //定义一个方法，内部调用rank组件的screenAdapter
    const triggerScreenAdapter = () => {
        if (rankComponent.value){
            rankComponent.value.screenAdapter();
        }
    };

    //暴露该方法给父组件
    defineExpose({
        triggerScreenAdapter
    });
</script>

<template>
    <div class="com-page">
        <Rank ref="rankComponent" />
    </div>
</template>

<style scoped>

</style>