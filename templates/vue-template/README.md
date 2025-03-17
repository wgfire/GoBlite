# Vue 3 落地页模板

这是一个基于 Vue 3、Vite 和 Tailwind CSS 的现代落地页模板，适合创建产品展示、营销活动等页面。

## 特性

- 🚀 基于 Vue 3 和 Vite 构建
- 💪 使用 TypeScript 提供类型安全
- 🎨 集成 Tailwind CSS 实现快速样式开发
- 📱 响应式设计，适配各种设备
- 🧩 模块化组件，易于定制
- 🔍 SEO 友好

## 项目结构

```
/
├── public/              # 静态资源
├── src/                 # 源代码
│   ├── assets/          # 资源文件
│   ├── components/      # 组件
│   ├── views/           # 页面
│   ├── router/          # 路由配置
│   ├── App.vue          # 应用入口
│   └── main.ts          # 主入口文件
├── index.html           # HTML 入口
├── vite.config.ts       # Vite 配置
├── tsconfig.json        # TypeScript 配置
├── tailwind.config.js   # Tailwind 配置
└── package.json         # 包配置
```

## 开发指南

### 安装依赖

```bash
npm install
# 或
yarn
# 或
pnpm install
```

### 启动开发服务器

```bash
npm run dev
# 或
yarn dev
# 或
pnpm dev
```

### 构建生产版本

```bash
npm run build
# 或
yarn build
# 或
pnpm build
```

## 自定义

- 修改 `src/views/` 下的页面组件
- 在 `src/components/` 中添加或修改组件
- 通过 `tailwind.config.js` 自定义设计系统
- 在 `src/assets/` 中添加自定义图片和其他资源

## 许可

MIT
