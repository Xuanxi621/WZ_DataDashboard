# 四川省智慧城市数据大脑 - Vue版

这是Demo1的独立Vue 3项目版本，完全独立运行。

## 技术栈

- **Vue 3** (Composition API + TypeScript)
- **Vite** (构建工具)
- **Three.js** (3D图形)
- **ECharts** (图表)
- **GSAP** (动画)
- **autofit.js** (自适应布局)
- **d3-geo** (地理投影)

## 快速开始

### 1. 安装依赖

```bash
npm install
# 或
pnpm install
# 或
yarn install
```

### 2. 开发运行

```bash
npm run dev
# 或
pnpm dev
# 或
yarn dev
```

项目将在 `http://localhost:5173` 启动

### 3. 构建生产版本

```bash
npm run build
# 或
pnpm build
# 或
yarn build
```

### 4. 预览生产版本

```bash
npm run preview
# 或
pnpm preview
# 或
yarn preview
```

## 项目结构

```
sc-datav-vue/
├── src/
│   ├── pages/
│   │   └── Demo1/          # 主页面
│   │       ├── index.vue  # 入口文件
│   │       ├── demo1.vue  # 主组件
│   │       ├── content.vue # 内容布局
│   │       ├── headder.vue # 头部
│   │       ├── footer.vue  # 底部
│   │       ├── loading.vue # 加载动画
│   │       ├── chart1-6.vue # 6个图表组件
│   │       ├── cityData.ts # 城市数据
│   │       ├── stores/     # 状态管理
│   │       ├── composables/ # Vue组合式函数
│   │       ├── components/ # 通用组件
│   │       ├── helpers/    # 工具函数
│   │       └── 3Dmap/      # 3D地图组件
│   ├── assets/            # 静态资源
│   ├── types/             # TypeScript类型定义
│   ├── App.vue            # 根组件
│   └── main.ts            # 入口文件
├── public/                # 公共资源
├── package.json
├── vite.config.ts
└── tsconfig.json
```

## 功能特性

- ✅ 3D地图可视化
- ✅ 6种不同类型的图表
- ✅ 实时数据更新
- ✅ 响应式布局
- ✅ 动画效果
- ✅ 交互式控制面板

## 注意事项

1. **资源文件**：确保所有资源文件（JSON、PNG、JPG）都已正确复制到 `src/assets/` 目录
2. **浏览器兼容性**：建议使用现代浏览器（Chrome、Firefox、Edge最新版本）
3. **性能**：3D地图渲染需要较好的显卡性能

## 开发说明

### 状态管理

使用Vue的`ref`和`computed`实现状态管理，替代了原项目的zustand。

### 3D地图

使用Three.js直接实现，替代了React Three Fiber。使用CSS2DRenderer来渲染HTML标签和提示框。

### 图表

使用ECharts，通过Vue组件封装，保持与原项目相同的配置和功能。

## 许可证

与原项目保持一致
