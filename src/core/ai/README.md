# LangChain AI 服务

基于 LangChain 的 AI 服务模块，提供多模型支持、对话管理、代码生成、文档检索等功能。

## 架构设计

本模块采用了以下架构设计原则：

1. **简单的原子状态**：使用 Jotai 原子仅存储基础状态，不包含复杂业务逻辑
2. **业务逻辑在钩子中**：所有业务逻辑都放在钩子函数中，而不是原子中
3. **模块化设计**：将功能分解为多个独立的模块，便于维护和扩展
4. **类型安全**：全面使用 TypeScript 类型定义，提供良好的类型推断和错误检查
5. **LangChain 集成**：充分利用 LangChain 的功能，包括模型、记忆、链、文档处理等

## 目录结构

```
src/core/ai/
├── atoms/                  # Jotai 原子状态
│   ├── modelAtoms.ts       # 模型相关原子
│   ├── conversationAtoms.ts # 对话相关原子
│   └── memoryAtoms.ts      # 记忆相关原子
├── hooks/                  # React 钩子
│   ├── useLangChainModel.ts # 模型管理钩子
│   ├── useLangChainMemory.ts # 记忆管理钩子
│   ├── useLangChainConversation.ts # 对话管理钩子
│   ├── useLangChainChat.ts # 聊天功能钩子
│   ├── useLangChainCode.ts # 代码生成钩子
│   ├── useLangChainTemplate.ts # 模板处理钩子
│   ├── useLangChainRetrieval.ts # 文档检索钩子
│   └── useLangChainAI.ts   # 主钩子，整合所有功能
├── langchain/              # LangChain 集成
│   ├── models/             # 模型集成
│   ├── memory/             # 记忆集成
│   ├── chains/             # 链集成
│   ├── documents/          # 文档处理集成
│   └── retrievers/         # 检索集成
├── types/                  # 类型定义
│   └── index.ts            # 所有类型定义
├── utils/                  # 工具函数
│   ├── messageFormatter.ts # 消息格式化工具
│   └── responseParser.ts   # 响应解析工具
└── docs/                   # 文档
    └── usage.md            # 使用指南
```

## 主要功能

### 模型管理

- 支持多种模型（OpenAI、Gemini、DeepSeek）
- 模型切换和配置
- API 密钥管理

### 对话管理

- 创建、切换、删除对话
- 对话历史记录
- 系统提示词设置

### 记忆管理

- 多种记忆类型（缓冲、摘要、对话、向量）
- 记忆配置（窗口大小、摘要阈值）

### 聊天功能

- 发送和接收消息
- 流式响应
- 取消请求

### 代码生成

- 根据描述生成代码
- 支持多种编程语言和框架
- 可选测试和注释

### 模板处理

- 根据模板和表单数据生成代码
- 业务上下文支持

### 文档检索

- 加载和处理文档
- 向量存储和检索
- 相似度搜索


## 扩展方向

1. **代理功能**：实现基于 LangChain 的代理，可以自主决策使用哪些工具
2. **向量记忆**：实现基于向量数据库的记忆系统，支持语义搜索
3. **多模态支持**：添加图像生成和处理功能
4. **工具集成**：集成更多工具，如网络搜索、计算器等
5. **文档加载器**：支持从各种来源加载文档，如文件、网页等
