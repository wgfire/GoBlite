# Go-Blite 静态站点生成平台

Go-Blite 为静态站点生成平台,支持从Figma导入静态资源到平台进行渲染构建、一键部署以及页面管理。

# 项目介绍（仓库搭建中-未完成）

## 项目结构

该项目采用 monorepo 结构,包含以下子项目:

- `web-site`: Web端开发平台,使用Next.js开发
- `packages/design`: 静态站点设计器，核心开发平台
- `packages/shadcn`: 基础UI组件库,使用TailwindCSS
- `packages/figma`: Figma插件,用于将设计稿导入平台
- `packages/events`: 静态站点业务事件库,处理静态站点业务逻辑

## 技术栈

- React 18
- Next.js 14
- TypeScript
- TailwindCSS
- Vite
- Rollup (用于packages/events)
- ESLint
- Prettier

## 本地开发

### 提交规范

本项目使用 Commitizen 进行规范化的 Git Commit Message 提交。
请使用以下命令进行提交：

```bash
npm run commit
```

按照提示完成提交信息的填写。

## 开发指南

### 协作方式

1. fork此仓库到自己的项目里，项目最新分支默认为main分支
2. 从main分支拉取一个新分支，分支名以feature/开头，例如feature/add-login-component
3. 提交合并发起pr,选择对应的进行合并

### 提交规范

- 使用 npm run commit 选择信息进行提交，提交规范使用了git-cz来进行自定义
- 除了初始化项目搭建外，其他提交不超过5个文件
- 提交必须过eslint ，不可盲目修改 eslint rules

### 环境要求

- Node.js 18+
- pnpm 8+

### 安装依赖

- pnpm install

### 容器参数
 docker build --build-arg BUILD_ENV=demo -t go-blite-app:demo .

## 待处理问题


