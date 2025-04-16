/**
 * LangChain AI服务钩子
 * 整合所有LangChain功能
 */
import { useState, useCallback, useEffect } from "react";
import { useLangChainModel } from "./useLangChainModel";
import { useLangChainMemory } from "./useLangChainMemory";
import { useLangChainConversation } from "./useLangChainConversation";
import { useLangChainChat } from "./useLangChainChat";
import { useLangChainCode } from "./useLangChainCode";
import { useLangChainTemplate } from "./useLangChainTemplate";
import { useLangChainRetrieval } from "./useLangChainRetrieval";

import {
  AIServiceConfig,
  ModelType,
  ModelProvider,
  ServiceStatus,
  CodeGenerationParams,
  TemplateProcessingParams,
  TemplateOptimizationParams,
  MemoryType,
  StorageProvider,
} from "../types/index";
import useMemoizedFn from "@/hooks/useMemoizedFn";
// 导入常量

/**
 * LangChain AI服务钩子选项
 */
export interface UseLangChainAIOptions {
  /** 是否自动初始化 */
  autoInit?: boolean;
  /** API密钥 */
  apiKey?: string;
  /** 默认模型类型 */
  defaultModelType?: ModelType;
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
  /** 服务配置 */
  config?: AIServiceConfig;
}
/**
 * LangChain AI服务钩子
 * 整合所有LangChain功能
 */
export function useLangChainAI(options: UseLangChainAIOptions = {}) {
  // 初始化子钩子
  const modelManager = useLangChainModel();
  const memoryManager = useLangChainMemory();
  const conversationManager = useLangChainConversation();
  const chatManager = useLangChainChat();
  const codeManager = useLangChainCode();
  const templateManager = useLangChainTemplate();
  const retrievalManager = useLangChainRetrieval();

  // 本地状态
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  /**
   * 初始化服务
   * @param apiKey API密钥（可选）
   * @returns 是否初始化成功
   */
  const initialize = useMemoizedFn(async (apiKey?: string): Promise<boolean> => {
    try {
      // 应用配置
      if (apiKey) {
        // 确保 selectedModelType 不为空
        const modelType = modelManager.selectedModelType || ModelType.GPT4O;
        const provider = modelType.includes("gpt")
          ? ModelProvider.OPENAI
          : modelType.includes("gemini")
          ? ModelProvider.GEMINI
          : ModelProvider.DEEPSEEK;
        modelManager.setApiKey(provider, apiKey);
      }

      if (options.defaultModelType) {
        await modelManager.switchModelType(options.defaultModelType);
      }

      if (options.temperature || options.maxTokens) {
        modelManager.updateModelSettings({
          temperature: options.temperature,
          maxTokens: options.maxTokens,
        });
      }

      if (options.memoryType) {
        await memoryManager.updateMemoryType(options.memoryType);
      }

      // 初始化模型
      const model = await modelManager.initializeModel();
      if (!model) {
        throw new Error("初始化模型失败");
      }

      // 初始化记忆
      const memory = await memoryManager.initializeMemory(model);
      if (!memory) {
        throw new Error("初始化记忆失败");
      }

      // 创建默认对话（如果没有）
      if (conversationManager.conversationIds.length === 0) {
        await conversationManager.createConversation("新对话");
      } else if (!conversationManager.currentConversationId) {
        conversationManager.switchConversation(conversationManager.conversationIds[0]);
      }

      setIsInitialized(true);
      setErrorMessage(null);
      return true;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "初始化服务失败";
      setErrorMessage(errorMsg);
      return false;
    }
  });

  /**
   * 重置服务
   * @returns 是否重置成功
   */
  const reset = useCallback((): boolean => {
    try {
      modelManager.resetModel();
      memoryManager.resetMemory();
      setIsInitialized(false);
      setErrorMessage(null);
      return true;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "重置服务失败";
      setErrorMessage(errorMsg);
      return false;
    }
  }, [modelManager, memoryManager]);

  /**
   * 生成代码
   * @param params 代码生成参数
   * @returns 代码生成结果
   */
  const generateCode = useMemoizedFn(async (params: CodeGenerationParams) => {
    try {
      if (!isInitialized || !modelManager.model || modelManager.serviceStatus !== ServiceStatus.READY) {
        throw new Error("服务未就绪");
      }

      return await codeManager.generateCode(modelManager.model, params);
    } catch (error) {
      console.error("生成代码失败:", error);
      throw error;
    }
  });

  /**
   * 处理模板
   * @param params 模板处理参数
   * @returns 模板处理结果
   */
  const processTemplate = useMemoizedFn(async (params: TemplateProcessingParams) => {
    try {
      if (!isInitialized || !modelManager.model || modelManager.serviceStatus !== ServiceStatus.READY) {
        throw new Error("服务未就绪");
      }

      return await templateManager.processTemplate(modelManager.model, params);
    } catch (error) {
      console.error("处理模板失败:", error);
      throw error;
    }
  });

  /**
   * 优化模板
   * @param params 模板优化参数
   * @returns 模板优化结果
   */
  const optimizeTemplate = useMemoizedFn(async (params: TemplateOptimizationParams) => {
    try {
      if (!isInitialized || !modelManager.model || modelManager.serviceStatus !== ServiceStatus.READY) {
        throw new Error("服务未就绪");
      }

      return await templateManager.optimizeTemplate(modelManager.model, params);
    } catch (error) {
      console.error("优化模板失败:", error);
      throw error;
    }
  });

  /**
   * 加载模板文档
   * @param template 模板对象
   * @param files 模板文件
   * @returns 文档加载结果
   */
  const loadTemplateDocuments = useMemoizedFn(async (template, files) => {
    try {
      if (!isInitialized || !modelManager.model || modelManager.serviceStatus !== ServiceStatus.READY) {
        throw new Error("服务未就绪");
      }

      return await templateManager.loadTemplateDocuments(template, files);
    } catch (error) {
      console.error("加载模板文档失败:", error);
      throw error;
    }
  });

  /**
   * 自动初始化
   */
  useEffect(() => {
    if (options.autoInit) {
      // 应用配置
      if (options.config) {
        if (options.config.defaultModelType) {
          modelManager.switchModelType(options.config.defaultModelType);
        }

        if (options.config.defaultTemperature || options.config.defaultMaxTokens) {
          modelManager.updateModelSettings({
            temperature: options.config.defaultTemperature,
            maxTokens: options.config.defaultMaxTokens,
          });
        }

        if (options.config.memoryConfig) {
          if (options.config.memoryConfig.type) {
            memoryManager.updateMemoryType(options.config.memoryConfig.type);
          }
          if (options.config.memoryConfig.maxMessages) {
            memoryManager.updateMemoryWindowSize(options.config.memoryConfig.maxMessages);
          }
          if (options.config.memoryConfig.summarizeThreshold) {
            memoryManager.updateMemorySummaryThreshold(options.config.memoryConfig.summarizeThreshold);
          }
        }
      }

      // 初始化
      initialize(options.apiKey).catch(console.error);
    }
    // 仅在组件挂载时运行一次
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    // 状态
    isInitialized,
    status: modelManager.serviceStatus,
    error: errorMessage || modelManager.errorMessage,
    isSending: chatManager.isSending,
    isStreaming: chatManager.isStreaming,
    streamContent: chatManager.streamContent,

    // 模型管理
    selectedModelType: modelManager.selectedModelType,
    modelSettings: modelManager.modelSettings,
    model: modelManager.model,

    // 对话管理
    conversations: conversationManager.allConversations,
    currentConversation: conversationManager.currentConversation,
    userInput: conversationManager.userInput,

    // 记忆管理
    memoryType: memoryManager.memoryType,
    memoryWindowSize: memoryManager.memoryWindowSize,
    memory: memoryManager.memory,

    // 检索管理
    documents: retrievalManager.documents,

    // 模型管理方法
    setApiKey: modelManager.setApiKey,
    updateModelSettings: modelManager.updateModelSettings,
    switchModelType: modelManager.switchModelType,

    // 对话管理方法
    createConversation: conversationManager.createConversation,
    switchConversation: conversationManager.switchConversation,
    deleteConversation: conversationManager.deleteConversation,
    updateConversationTitle: conversationManager.updateConversationTitle,
    updateSystemPrompt: conversationManager.updateSystemPrompt,
    clearMessages: conversationManager.clearMessages,
    updateUserInput: conversationManager.updateUserInput,

    // 记忆管理方法
    updateMemoryType: memoryManager.updateMemoryType,
    updateMemoryWindowSize: memoryManager.updateMemoryWindowSize,

    // 聊天方法
    sendMessage: chatManager.sendUnifiedRequest,
    cancelRequest: chatManager.cancelRequest,

    // 代码生成方法
    generateCode,

    // 模板处理方法
    processTemplate,
    optimizeTemplate,
    loadTemplateDocuments,
    clearTemplateContext: templateManager.clearTemplateContext,
    templateContext: templateManager.templateContext,

    // 检索方法
    loadDocument: retrievalManager.loadTextDocument,
    loadFileDocument: retrievalManager.loadFileDocument,
    initializeVectorStore: retrievalManager.initializeVectorStore,
    retrieveDocuments: retrievalManager.retrieveDocuments,
    clearDocuments: retrievalManager.clearDocuments,

    // 服务管理方法
    initialize,
    reset,
  };
}
