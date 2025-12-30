# Demo3 - Vue版本

这是Demo1的Vue 3重构版本，将React代码转换为Vue 3的Composition API写法。

## 文件结构

```
Demo3/
├── index.vue              # 入口文件，使用Suspense进行懒加载
├── demo3.vue              # 主组件，包含Map和Content
├── loading.vue            # 加载组件
├── content.vue            # 内容布局组件
├── headder.vue            # 头部组件
├── footer.vue             # 底部组件
├── chart1-6.vue          # 6个图表组件
├── cityData.ts            # 城市数据
├── stores/
│   └── index.ts           # 状态管理（使用Vue的reactive替代zustand）
├── composables/           # Vue组合式函数（替代React Hooks）
│   ├── useMoveTo.ts
│   ├── useRafInterval.ts
│   ├── useSize.ts
│   ├── useAnimationFrame.ts
│   └── useDebounceEffect.ts
├── components/            # 通用组件
│   ├── Chart.vue          # ECharts封装组件
│   ├── AutoFit.vue        # 自适应组件
│   ├── SeamVirtualScroll.vue  # 虚拟滚动表格
│   └── NumberAnimation.vue    # 数字动画组件
├── helpers/
│   └── loadTexture.ts    # 纹理加载工具
└── 3Dmap/                 # 3D地图相关组件
    ├── index.vue          # 3D场景入口
    ├── scene.vue          # 场景组件
    ├── base.vue           # 地图基础组件
    ├── city.vue           # 城市组件
    ├── bar.vue            # 柱状图组件
    ├── cloud.vue          # 云朵组件
    ├── heatmap.vue        # 热力图组件
    ├── lights.vue         # 灯光组件
    ├── bottom.vue         # 底部网格组件
    ├── shape.vue          # 形状组件
    ├── label.vue          # 标签组件
    └── tooltip.vue        # 提示框组件
```

## 主要转换说明

### 1. 状态管理
- **React (zustand)** → **Vue (reactive + computed)**
- 使用Vue的`ref`和`computed`替代zustand的状态管理
- 实现了类似的`subscribe`方法用于响应式订阅

### 2. Hooks转换
- **React Hooks** → **Vue Composables**
- `useMoveTo` → `composables/useMoveTo.ts`
- `useRafInterval` → `composables/useRafInterval.ts`
- `useSize` → `composables/useSize.ts`
- `useAnimationFrame` → `composables/useAnimationFrame.ts`
- `useDebounceEffect` → `composables/useDebounceEffect.ts`

### 3. 组件转换
- **React组件 (.tsx)** → **Vue组件 (.vue)**
- 使用`<template>`、`<script setup>`和`<style scoped>`
- `styled-components` → Vue的`<style scoped>`
- React的`ref` → Vue的`ref`和`defineExpose`

### 4. 图表组件
- 使用Vue封装的`Chart.vue`组件
- 保持ECharts的配置和功能不变
- 使用Vue的`computed`来管理图表配置

### 5. 3D地图组件
- **React Three Fiber** → **Three.js直接使用**
- 由于Vue没有官方的Three.js集成库，3D地图组件需要直接使用Three.js
- 建议使用`@vue-threejs`或直接操作Three.js对象
- 当前实现提供了基础框架，需要进一步完善Three.js场景的创建和管理

## 注意事项

1. **3D地图组件**：由于React Three Fiber是React特定的库，Vue版本需要直接使用Three.js。当前实现提供了基础结构，但需要进一步完善Three.js场景的创建、更新和销毁逻辑。

2. **依赖项**：确保安装了以下依赖：
   - `vue` (^3.x)
   - `echarts`
   - `three`
   - `gsap`
   - `autofit.js`
   - `d3-geo`
   - 其他项目依赖

3. **类型定义**：保持与Demo1相同的TypeScript类型定义，确保类型安全。

4. **样式**：所有`styled-components`的样式都已转换为Vue的`<style scoped>`，保持相同的视觉效果。

## 使用方式

在路由或父组件中引入：

```vue
<template>
  <Demo3 />
</template>

<script setup lang="ts">
import Demo3 from '@/pages/Demo3/index.vue'
</script>
```

## 待完善功能

1. **3D地图完整实现**：需要完善Three.js场景的创建、更新和交互逻辑
2. **性能优化**：根据Vue的特性进行性能优化
3. **测试**：添加单元测试和集成测试

