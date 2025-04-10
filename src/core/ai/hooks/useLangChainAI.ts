/**
 * LangChain AI服务钩子
 * 提供基于LangChain的AI功能，支持多模型切换、对话管理、代理功能等
 */

import { useState, useCallback, useEffect } from "react";
import { useModelManager } from "../langchain/hooks/useModelManager";
import { useConversationManager } from "../langchain/hooks/useConversationManager";
import { useMessageHandler } from "../langchain/hooks/useMessageHandler";
import { useCodeGenerator } from "../langchain/hooks/useCodeGenerator";
import { useImageGenerator } from "../langchain/hooks/useImageGenerator";
import { useTemplateProcessor } from "../langchain/hooks/useTemplateProcessor";
import { usePromptOptimizer } from "../langchain/hooks/usePromptOptimizer";
import { useAIAgent } from "../langchain/hooks/useAIAgent";
import {
  AIServiceStatus,
  AIModelType,
  MemoryType,
  StorageProvider,
} from "../types";
import { DEFAULT_SYSTEM_PROMPT } from "../constants";

/**
 * LangChain AI服务钩子选项
 */
export interface UseLangChainAIOptions {
  /** 是否自动初始化 */
  autoInit?: boolean;
  /** API密钥 */
  apiKey?: string;
  /** 默认模型类型 */
  defaultModelType?: AIModelType;
  /** 最大token数 */
  maxTokens?: number;
  /** 温度参数 (0-1) */
  temperature?: number;
  /** 系统提示词 */
  defaultSystemPrompt?: string;
  /** 记忆类型 */
  memoryType?: MemoryType;
  /** 存储提供商 */
  storageProvider?: StorageProvider;
}

/**
 * LangChain AI服务钩子
 * 提供基于LangChain的AI功能
 */
export const useLangChainAI = (options: UseLangChainAIOptions = {}) => {
  // 初始化子钩子
  const modelManager = useModelManager({
    autoInit: false,
    apiKey: options.apiKey,
    defaultModelType: options.defaultModelType,
    maxTokens: options.maxTokens,
    temperature: options.temperature,
  });

  const conversationManager = useConversationManager({
    autoInit: false,
    memoryType: options.memoryType,
    storageProvider: options.storageProvider,
    defaultSystemPrompt: options.defaultSystemPrompt || DEFAULT_SYSTEM_PROMPT,
  });

  // 创建消息处理钩子
  const messageHandler = useMessageHandler({
    modelManager,
    conversationManager,
  });

  // 创建代码生成钩子
  const codeGenerator = useCodeGenerator({
    messageHandler,
    status: modelManager.status,
  });

  // 创建图像生成钩子
  const imageGenerator = useImageGenerator({
    messageHandler,
    status: modelManager.status,
  });

  // 创建模板处理钩子
  const templateProcessor = useTemplateProcessor({
    codeGenerator,
    status: modelManager.status,
  });

  // 创建提示词优化钩子
  const promptOptimizer = usePromptOptimizer({
    messageHandler,
    status: modelManager.status,
  });

  // 创建AI代理钩子
  const aiAgent = useAIAgent({
    model: modelManager.modelManager?.getCurrentModel(),
    status: modelManager.status,
  });

  // 状态
  const [error, setError] = useState<string | null>(null);

  /**
   * 初始化服务
   * @param apiKey API密钥（可选，如果不提供则使用选项中的密钥）
   * @returns 是否初始化成功
   */
  const initialize = useCallback(
    async (apiKey?: string): Promise<boolean> => {
      try {
        // 初始化模型管理器
        const modelInitSuccess = await modelManager.initialize(apiKey);
        if (!modelInitSuccess) {
          throw new Error("初始化模型管理器失败");
        }

        // 初始化对话管理器
        const conversationInitSuccess = conversationManager.initialize();
        if (!conversationInitSuccess) {
          throw new Error("初始化对话管理器失败");
        }

        setError(null);
        return true;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "初始化失败";
        setError(errorMessage);
        return false;
      }
    },
    [modelManager, conversationManager]
  );

  /**
   * 重置服务
   */
  const reset = useCallback(() => {
    try {
      modelManager.reset();
      conversationManager.reset();
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "重置失败";
      setError(errorMessage);
    }
  }, [modelManager, conversationManager]);

  // 自动初始化
  useEffect(() => {
    if (options.autoInit) {
      initialize();
    }
  }, [options.autoInit, initialize]);

  return {
    // 状态
    status: modelManager.status,
    error: error || modelManager.error || conversationManager.error || messageHandler.error,
    isProcessing: messageHandler.isProcessing,

    // 模型管理
    currentModelType: modelManager.currentModelType,
    availableModels: modelManager.availableModels,
    currentModel: modelManager.currentModel,
    switchModel: modelManager.switchModel,

    // 对话管理
    conversations: conversationManager.conversations,
    currentConversationId: conversationManager.currentConversationId,
    createConversation: conversationManager.createConversation,
    switchConversation: conversationManager.switchConversation,
    deleteConversation: conversationManager.deleteConversation,
    getMessages: conversationManager.getMessages,
    getSystemPrompt: conversationManager.getSystemPrompt,
    setSystemPrompt: conversationManager.setSystemPrompt,
    clearMessages: conversationManager.clearMessages,

    // 消息处理
    sendMessage: messageHandler.sendMessage,
    parseResponse: messageHandler.parseResponse,
    cancelRequest: messageHandler.cancelRequest,

    // 代码生成
    generateCode: codeGenerator.generateCode,
    syncCodeToFileSystem: codeGenerator.syncCodeToFileSystem,
    previewGeneratedCode: codeGenerator.previewGeneratedCode,

    // 图像生成
    generateImage: imageGenerator.generateImage,

    // 模板处理
    processTemplate: templateProcessor.processTemplate,

    // 提示词优化
    optimizePrompt: promptOptimizer.optimizePrompt,

    // AI代理
    executeAgent: aiAgent.executeAgent,

    // 服务管理
    initialize,
    reset,
  };
};

// 为了保持向后兼容，导出AIModelType和AIServiceStatus
export { AIModelType, AIServiceStatus };

export default useLangChainAI;
