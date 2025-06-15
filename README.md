# Nano - AI 驱动的低代码平台

Nano 是一个创新的 AI 驱动的低代码平台，旨在简化 Web 应用程序的开发流程。它集成了实时代码编辑、基于模板的代码生成以及强大的 WebContainer 实时预览功能，为开发者提供了一个高效、智能的开发环境。

## 核心功能

- **实时代码编辑器**: 内置功能丰富的代码编辑器，支持多种语言高亮和智能提示，提供流畅的编码体验。
- **AI 驱动的代码生成**: 利用先进的 AI 模型（通过 LangGraph 集成），平台能够根据用户需求智能生成代码片段或完整组件，加速开发进程。
- **模板化项目创建**: 提供丰富的项目模板库，用户可以快速选择并基于模板创建新项目，减少从零开始的配置工作。
- **WebContainer 实时预览**: 集成 WebContainer 技术，为用户提供一个隔离且高性能的沙盒环境，实现代码的即时运行和实时预览，所见即所得。
- **文件系统管理**: 直观的文件浏览器和文件标签页功能，方便用户管理项目文件，进行文件的打开、编辑和保存。
- **智能聊天助手**: 内置聊天功能，可能用于与 AI 助手进行交互，获取开发建议、代码解释或执行特定操作。

## 技术架构

Nano 平台采用现代化的前端技术栈和模块化设计，确保了其高性能、可扩展性和可维护性。

- **前端框架**: 基于 [React](https://react.dev/) 构建用户界面，提供组件化、响应式的开发体验。
- **构建工具**: 使用 [Vite](https://vitejs.dev/) 作为开发服务器和打包工具，实现极速的开发启动和热模块更新。
- **状态管理**: 采用 [Jotai](https://jotai.org/) 进行轻量级和原子化的状态管理，确保应用状态的清晰和高效。
- **代码编辑器**: 集成 [CodeMirror](https://codemirror.net/)，提供强大的代码编辑能力，支持语法高亮、自动补全等。
- **样式**: 使用 [Tailwind CSS](https://tailwindcss.com/) 作为 CSS 框架，实现快速、灵活的 UI 开发和响应式设计。
- **沙盒环境**: 核心预览功能由 [WebContainer](https://webcontainers.io/) 提供支持，允许在浏览器中直接运行 Node.js 环境和前端应用。
- **AI/LLM 集成**: 通过 [LangGraph](https://python.langchain.com/v0.2/docs/concepts/#langgraph) 框架与多种大型语言模型（如 OpenAI, Google GenAI, DeepSeek 等）进行集成，为 AI 驱动的功能提供强大支持。
- **UI 组件库**: 使用 [Radix UI](https://www.radix-ui.com/) 和自定义 UI 组件，确保界面的一致性和可访问性。

## LangGraph Agent 功能流程

本项目利用 [LangGraph](https://python.langchain.com/v0.2/docs/concepts/#langgraph) 框架构建了多个智能代理（Agent），以实现复杂的对话和代码生成工作流。LangGraph 的核心思想是通过定义有状态的图（StateGraph）来编排 AI 代理的执行流程。

### 核心概念

1.  **状态 (State)**: 每个 Agent 都有一个定义其当前状态的数据结构（例如 `ChatState`, `RouterState`, `TemplateAgentState`）。状态通过 `Annotation.Root` 定义，并使用 `messagesStateReducer` 等 reducer 函数来合并和更新数据，确保 Agent 在多轮交互中保持上下文。

2.  **节点 (Nodes)**: 工作流由一系列节点组成，每个节点负责执行特定的任务。例如：

    - `userInputNode`: 处理用户的原始输入，并将其格式化为消息添加到状态中。
    - `llmNode`: 调用大型语言模型（LLM）来生成回复或执行特定任务。
    - `routerAnalysisNode`: 分析用户意图，判断用户请求的类型（如通用聊天、模板创建、文档分析等）。
    - `templateAgentNode`: 专门处理与模板相关的请求，它本身是一个子图，内部包含更细致的逻辑。
    - `queryTemplateInfoNode`: 在 `templateAgent` 内部，用于查询模板信息或判断是否需要生成代码。
    - `generateCodeNode`: 在 `templateAgent` 内部，根据用户需求和模板结构生成具体的代码。

3.  **边 (Edges)**: 节点之间通过边连接，定义了工作流的执行顺序和逻辑流转。

    - **直接边 (`addEdge`)**: 定义从一个节点到另一个节点的直接转换。
    - **条件边 (`addConditionalEdges`)**: 允许工作流根据当前状态的条件进行分支。例如，`routerDecisionNode` 会根据 `routerAnalysisNode` 的结果，将请求路由到不同的子 Agent 或直接结束。

4.  **记忆 (Memory)**: 通过 `MemorySaver` 机制，LangGraph 能够自动保存和恢复 Agent 的状态，使得 Agent 可以在长时间的对话中保持连贯的上下文。

### 主要 Agent 类型

本项目中实现了以下几种关键的 LangGraph Agent：

- **聊天代理 (`ChatAgent`)**:

  - **功能**: 负责处理基本的用户对话，将用户输入传递给 LLM，并返回 LLM 的回复。
  - **流程**: `START` -> `processUserInput` -> `llm` -> `END`。

- **路由代理 (`RouterAgent`)**:

  - **功能**: 作为整个系统的入口点，它分析用户的初始意图，并将请求路由到最合适的子 Agent 进行处理。
  - **流程**: `START` -> `processUserInput` -> `analysis` (意图分析) -> `routerDecision` (路由决策) -> (根据意图路由到 `templateAgent` 或其他 Agent) -> `END`。
  - 如果意图是通用聊天，`analysis` 节点会直接生成回复并结束流程。

- **模板代理 (`TemplateAgent`)**:
  - **功能**: 专门处理与代码模板相关的请求，包括查询模板信息、根据模板生成代码等。
  - **流程**: `processUserInput` -> `queryTemplateInfo` (查询模板信息并判断是否生成代码) -> (如果需要生成代码) `generateCode` -> `END`。
  - 这个 Agent 作为一个子图被 `RouterAgent` 调用。

### 工作流示例 (以代码生成为例)

1.  用户输入一个请求，例如“基于 React 模板创建一个包含登录表单的组件”。
2.  `RouterAgent` 的 `userInputNode` 接收输入。
3.  `routerAnalysisNode` 分析用户意图，识别出这是“模板创建”请求。
4.  `routerDecisionNode` 将请求路由到 `templateAgentNode`。
5.  `templateAgentNode` 内部的 `queryTemplateInfoNode` 进一步分析用户需求和当前模板信息。
6.  如果 `queryTemplateInfoNode` 判断需要生成代码，则将流程传递给 `generateCodeNode`。
7.  `generateCodeNode` 根据用户需求和模板的结构信息，调用 LLM 生成具体的代码文件操作（如创建 `LoginForm.tsx`）。
8.  生成的代码操作被返回，并最终由前端应用执行，完成代码文件的创建或修改。

通过这种模块化和可编排的 Agent 设计，本项目能够灵活地处理各种复杂的 AI 交互场景。

## 快速开始

（此处将提供如何快速启动和运行项目的说明，例如安装依赖、启动开发服务器等）

## 项目结构

```
.
├── public/                 # 静态资源和模板文件
├── src/                    # 应用程序源代码
│   ├── App.tsx             # 主应用组件
│   ├── assets/             # 静态资源
│   ├── components/         # 可复用 UI 组件
│   │   ├── Chat/           # 聊天功能相关组件
│   │   ├── Editor/         # 代码编辑器组件
│   │   ├── FileExplorer/   # 文件浏览器组件
│   │   ├── FileTabs/       # 文件标签页组件
│   │   ├── TemplateForm/   # 模板表单组件
│   │   ├── TemplateGallery/# 模板画廊组件
│   │   ├── Toolbar/        # 工具栏组件
│   │   ├── ui/             # 通用 UI 组件 (基于 Radix UI)
│   │   └── WebContainer/   # WebContainer 相关组件
│   ├── core/               # 核心业务逻辑和钩子
│   │   ├── ai/             # AI/LLM 集成逻辑 (LangChain)
│   │   ├── editor/         # 编辑器核心逻辑
│   │   ├── fileSystem/     # 文件系统管理逻辑
│   │   └── webContainer/   # WebContainer 核心逻辑
│   ├── hooks/              # 自定义 React Hooks
│   ├── lib/                # 工具函数库
│   ├── template/           # 模板管理逻辑
│   ├── tests/              # 测试文件
│   └── utils/              # 通用工具函数
├── package.json            # 项目依赖和脚本
├── vite.config.ts          # Vite 配置
├── tailwind.config.js      # Tailwind CSS 配置
├── postcss.config.js       # PostCSS 配置
├── eslint.config.js        # ESLint 配置
├── tsconfig.json           # TypeScript 配置
└── README.md               # 项目说明
```

## 许可证

本项目采用 MIT 许可证。
