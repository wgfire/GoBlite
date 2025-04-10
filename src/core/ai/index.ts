/**
 * AI核心模块入口
 */

// 导出类型
export * from "./types";
export * from "./constants";

// 导出钩子
export { default as useLangChainAI, AIModelType, AIServiceStatus } from "./hooks/useLangChainAI";
export { default as useModelManager } from "./langchain/hooks/useModelManager";
export { default as useConversationManager } from "./langchain/hooks/useConversationManager";
export { default as useMessageHandler } from "./langchain/hooks/useMessageHandler";
export { default as useCodeGenerator } from "./langchain/hooks/useCodeGenerator";
export { default as useImageGenerator } from "./langchain/hooks/useImageGenerator";
export { default as useTemplateProcessor } from "./langchain/hooks/useTemplateProcessor";
export { default as usePromptOptimizer } from "./langchain/hooks/usePromptOptimizer";
export { default as useAIAgent } from "./langchain/hooks/useAIAgent";

// 导出模型相关
export { default as ModelManager } from "./langchain/models/modelManager";
export { default as ModelFactory } from "./langchain/models/modelFactory";

// 导出记忆相关
export { default as MemoryManager } from "./langchain/memory/memoryManager";
export { default as createStorageAdapter } from "./langchain/memory/storageAdapter";

// 导出提示词相关
export { default as promptTemplates } from "./langchain/prompts/promptTemplates";

// 导出工具
export { default as responseParser } from "./utils/responseParser";
