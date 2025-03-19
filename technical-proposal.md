# vite-Goblite 技术方案

## 1. 项目概述

vite-Goblite 是一个基于浏览器的低代码平台，提供模板选择、在线编码和在线构建功能。用户可以选择预设的模板，在浏览器中编辑代码，并实时构建和预览应用。

## 2. 系统架构

项目采用 Monorepo 结构，使用 pnpm 进行包管理：

```
├── apps/               # 主应用和子应用容器
│   └── main-app/       # 主应用（负责子应用管理）
├── packages/           # 共享工具包
│   ├── core/           # 跨应用共享工具
│   ├── editor/         # 在线编辑代码实现
│   ├── web-container/  # WebContainer 实现（浏览器端构建引擎）
│   └── ai-service/     # AI代码生成服务
├── templates/          # 前端应用模板库
│   ├── vue-template/   # Vue3 + Vite 模板
│   ├── react-template/ # React + Vite 模板
│   └── ...             # 其他模板
└── package.json        # Monorepo 根配置
```

### 2.1 核心组件

- **主应用 (main-app)**：用户交互的主界面，负责模板展示、选择和管理
- **WebContainer**：基于浏览器的构建引擎，负责构建和运行应用
- **Editor**：在线代码编辑器，提供代码编辑功能
- **核心工具包 (core)**：提供跨应用的共享功能
- **模板打包 (templates)**：提供模板打包和加载功能
- **AI代码生成服务 (ai-service)**：提供AI代码生成功能

## 3. 技术栈

- **框架**：Vue 3 / React (取决于各子应用需求)
- **构建工具**：Vite
- **包管理器**：pnpm
- **Monorepo 工具**：pnpm workspace
- **TypeScript**：类型安全
- **Tailwind CSS**：样式系统
- **ESLint**：代码质量
- **WebContainer API**：浏览器内构建引擎
- **Monaco Editor**：代码编辑器
- **AI大模型API**：AI代码生成服务

## 4. 组件设计

### 4.1 主应用 (main-app)

主应用是用户与系统交互的主要界面，负责以下功能：

- 模板展示和选择
- 应用构建和预览
- 编辑器集成
- 项目状态管理

**核心页面/组件**：
- `TemplateGallery`：展示可用模板列表
- `TemplateDetail`：显示模板详细信息
- `WorkspaceContainer`：集成编辑器和预览功能的工作区
- `BuildControls`：构建控制按钮和选项

### 4.2 WebContainer 组件封装

WebContainer 基于 [WebContainers API](https://webcontainers.io/)，提供浏览器内的构建和运行环境。

**核心功能**：
- 初始化 WebContainer 环境
- 加载项目文件
- 安装依赖
- 启动开发服务器
- 提供文件系统操作
- 终端输出捕获和展示

**核心组件/接口**：
- `WebContainerService`：WebContainer 核心服务
- `WebContainerProvider`：React/Vue Provider 组件
- `useWebContainer`：React Hook / Vue Composable
- `WebContainerPreview`：应用预览组件
- `WebContainerTerminal`：终端输出组件

### 4.3 编辑器设计

编辑器基于 Monaco Editor（VS Code 使用的编辑器），提供丰富的代码编辑功能。

**核心功能**：
- 代码编辑（支持多种语言）
- 语法高亮
- 代码补全
- 错误提示
- 文件树导航
- 搜索/替换
- 主题切换
- 快捷键支持

**核心组件**：
- `EditorService`：编辑器核心服务
- `EditorProvider`：React/Vue Provider 组件
- `useEditor`：React Hook / Vue Composable
- `CodeEditor`：代码编辑器组件
- `FileExplorer`：文件浏览器组件
- `EditorToolbar`：编辑器工具栏

### 4.4 核心工具包 (core)

核心工具包提供跨应用的共享功能。

**核心功能**：
- 模板加载和解析
- 文件系统抽象
- WebContainer 工具函数
- 项目配置解析和管理
- 事件总线
- 类型定义

**主要模块**：
- `TemplateService`：模板管理服务
- `FileSystemUtils`：文件系统操作工具
- `WebContainerUtils`：WebContainer 辅助工具
- `ProjectConfigService`：项目配置管理
- `EventBus`：事件总线实现
- `Types`：共享类型定义

### 4.5 模板打包 (templates)

为了简化部署和提高性能，我们将采用直接打包模板的方式，取代原有的模板服务器方案。

**核心功能**：
- 提供 `buildTemplates` 工具，将模板目录打包成符合 WebContainer 渲染格式的包
- 在主应用中直接导入打包后的模板
- 支持获取模板元数据和原始文件内容
- 无需额外的服务器组件

**主要模块**：
- `TemplateBuilder`：模板打包工具
- `TemplateRegistry`：模板注册和管理
- `TemplateLoader`：模板加载和解析

### 4.6 AI代码生成服务 (ai-service)

为了提供智能化的开发体验，我们将添加AI代码生成服务，支持根据模板结构自动生成应用内容。

**核心功能**：
- 分析模板结构并提取关键信息
- 调用AI大模型生成适配模板的代码内容
- 支持流式返回生成结果
- 实时将生成的代码更新到编辑器
- 提供代码生成状态管理和错误处理

**主要模块**：
- `AIServiceProvider`：AI服务的Provider组件
- `useAIService`：React Hook / Vue Composable
- `AICodeGenerator`：代码生成核心类
- `AIStreamHandler`：处理AI流式响应
- `TemplateAnalyzer`：模板结构分析工具

### 4.7 AI代码生成服务的数据结构定义和实现方式

**实现方式**：
- 创建独立的AI服务包，负责与AI大模型API交互
- 使用流式响应处理技术，实时获取生成内容
- 通过事件总线将生成的代码实时传递给编辑器
- 提供代码生成进度和状态反馈

**数据结构**：
```typescript
// AI生成请求参数
export interface AIGenerationRequest {
  // 模板元数据
  templateMetadata: TemplateMetadata;
  // 模板文件结构
  templateStructure: FileSystemTree;
  // 生成配置选项
  options?: AIGenerationOptions;
}

// AI生成配置选项
export interface AIGenerationOptions {
  // 模型ID
  modelId?: string;
  // 温度参数(0-1)，控制生成的随机性
  temperature?: number;
  // 生成的最大令牌数
  maxTokens?: number;
  // 是否启用流式响应
  streamResponse?: boolean;
  // 自定义提示词
  customPrompt?: string;
}

// AI生成状态
export enum AIGenerationStatus {
  IDLE = 'idle',
  ANALYZING = 'analyzing',
  GENERATING = 'generating',
  COMPLETED = 'completed',
  FAILED = 'failed'
}

// AI生成结果
export interface AIGenerationResult {
  // 生成状态
  status: AIGenerationStatus;
  // 生成的文件
  files?: Record<string, string>;
  // 错误信息
  error?: string;
  // 生成进度(0-100)
  progress: number;
}

// AI事件类型
export enum AIEventType {
  GENERATION_STARTED = 'ai-generation-started',
  GENERATION_PROGRESS = 'ai-generation-progress',
  GENERATION_COMPLETED = 'ai-generation-completed',
  GENERATION_FAILED = 'ai-generation-failed',
  FILE_CONTENT_UPDATED = 'ai-file-content-updated'
}
```

### 4.8 AI生成内容的质量控制

**挑战**：
- 如何确保AI生成的代码符合项目规范
- 如何处理生成代码中的潜在错误
- 如何提高生成内容的相关性和质量

**解决方案**：
- 在提示词中明确指定代码风格和规范要求
- 实现基本的代码验证机制，检查语法错误和基本逻辑
- 允许用户提供额外的上下文信息，提高生成内容的相关性
- 支持增量生成和修改，而不是一次性生成所有内容
- 提供反馈机制，让用户评价生成内容的质量，用于改进生成策略

## 5. 技术栈

- **框架**：Vue 3 / React (取决于各子应用需求)
- **构建工具**：Vite
- **包管理器**：pnpm
- **Monorepo 工具**：pnpm workspace
- **TypeScript**：类型安全
- **Tailwind CSS**：样式系统
- **ESLint**：代码质量
- **WebContainer API**：浏览器内构建引擎
- **Monaco Editor**：代码编辑器
- **AI大模型API**：AI代码生成服务

## 6. 工作流程

### 6.1 模板选择与加载

1. 主应用启动时，调用 `TemplateService` 加载所有可用模板
2. `TemplateService` 通过导入打包后的模板包获取模板列表
3. 用户浏览模板列表并选择所需模板
4. 用户确认选择后，系统通过 `TemplateLoader` 加载选中的模板

### 6.2 代码编辑

1. 编辑器加载模板文件并显示文件树
2. 用户通过文件树导航或直接在编辑器中打开文件
3. 用户编辑代码，编辑器提供语法高亮、代码补全等功能
4. 编辑的内容实时保存到内存文件系统

### 6.3 构建与预览

1. 用户完成编辑后点击构建按钮
2. WebContainer 初始化虚拟环境
3. 系统将编辑后的文件加载到 WebContainer
4. WebContainer 安装依赖并启动开发服务器
5. 预览组件连接到开发服务器并展示应用
6. 构建日志实时显示在终端组件中

### 6.4 AI代码生成流程

1. 用户在模板选择页面选择一个模板
2. 用户点击"使用AI生成代码"按钮
3. 系统分析模板结构并提取关键信息
4. 系统调用AI服务，将模板结构信息发送给AI大模型
5. AI大模型根据模板结构生成代码内容
6. 系统实时接收AI生成的代码并更新到编辑器
7. 用户可以在生成过程中查看实时进度
8. 生成完成后，用户可以进一步编辑代码或直接构建应用

## 7. 实现计划

### 7.1 第一阶段：基础架构搭建

1. 初始化 Monorepo 结构
2. 配置 pnpm workspace
3. 设置基础构建工具 (TypeScript, ESLint, Tailwind)
4. 创建核心包 (core) 基础架构

### 7.2 第二阶段：核心功能实现

1. 实现模板服务 (TemplateService)
2. 实现 WebContainer 服务封装
3. 集成 Monaco Editor
4. 实现文件系统工具

### 7.3 第三阶段：应用实现

1. 开发主应用 UI
2. 实现模板选择流程
3. 集成编辑器和 WebContainer
4. 实现构建和预览功能

### 7.4 第四阶段：AI代码生成服务实现

1. 开发 AI代码生成服务 (ai-service)
2. 实现模板结构分析工具
3. 集成 AI大模型API
4. 实现代码生成状态管理和错误处理

### 7.5 第五阶段：优化和完善

1. 性能优化
2. 用户体验改进
3. 错误处理和恢复机制
4. 文档完善

## 8. 技术挑战与解决方案

### 8.1 浏览器环境限制

**挑战**：在浏览器环境中构建和运行应用受到诸多限制

**解决方案**：
- 使用 WebContainers API 提供虚拟环境
- 针对浏览器环境优化构建过程
- 缓存依赖提高性能

### 8.2 性能优化

**挑战**：在浏览器中运行构建工具和编辑器可能导致性能问题

**解决方案**：
- 懒加载组件和功能
- 使用 Web Workers 进行密集计算
- 后端进行构建返回预览地址
- 优化文件系统操作

### 8.3 编辑器与 WebContainer 集成

**挑战**：编辑器和 WebContainer 需要无缝集成

**解决方案**：
- 设计清晰的接口和事件系统
- 使用观察者模式监听文件变化
- 实现统一的文件系统抽象层

### 8.4 AI代码生成集成

**挑战**：
- 如何高效分析模板结构并提取有用信息
- 如何处理AI大模型的响应延迟
- 如何实时将生成的代码更新到编辑器
- 如何处理生成失败或内容不符合预期的情况

**解决方案**：
- 开发专门的模板分析工具，提取关键结构信息
- 使用流式响应技术，实时获取生成内容
- 通过事件总线机制，将生成的代码实时传递给编辑器
- 实现错误重试和回退机制，确保生成过程的稳定性
- 提供用户干预接口，允许用户调整生成参数或中断生成过程

### 8.5 AI生成内容的质量控制

**挑战**：
- 如何确保AI生成的代码符合项目规范
- 如何处理生成代码中的潜在错误
- 如何提高生成内容的相关性和质量

**解决方案**：
- 在提示词中明确指定代码风格和规范要求
- 实现基本的代码验证机制，检查语法错误和基本逻辑
- 允许用户提供额外的上下文信息，提高生成内容的相关性
- 支持增量生成和修改，而不是一次性生成所有内容
- 提供反馈机制，让用户评价生成内容的质量，用于改进生成策略

## 9. 未来规划

1. 增强AI代码生成功能，支持更多场景和自定义需求
2. 实现代码解释和文档生成功能，帮助用户理解代码
3. 添加AI辅助调试功能，帮助用户解决代码问题

```mermaid
sequenceDiagram
    participant User as 用户
    participant App as 主应用
    participant TS as TemplateService
    participant AI as AIService
    participant Editor as 编辑器
    participant WC as WebContainer

    User->>App: 选择模板
    App->>TS: 加载模板
    TS-->>App: 返回模板数据
    User->>App: 点击"使用AI生成代码"
    App->>AI: 发送模板结构
    AI->>AI: 分析模板结构
    AI->>AI: 调用AI大模型
    loop 流式生成
        AI-->>App: 返回部分生成内容
        App->>Editor: 实时更新编辑器内容
        App-->>User: 显示生成进度
    end
    AI-->>App: 生成完成
    App-->>User: 通知生成完成
    User->>App: 点击"构建应用"
    App->>WC: 发送文件到WebContainer
    WC->>WC: 构建应用
    WC-->>App: 返回构建结果
    App-->>User: 显示应用预览
