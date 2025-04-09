/**
 * AI服务钩子
 * 提供React组件使用的AI功能
 */

import { useState, useCallback, useRef, useEffect } from "react";
import { AIService } from "../service";
import { LangChainService } from "../langchain/service";
import { ConversationInfo } from "../langchain/types";
import { ModelSwitcher, ModelProvider, ModelConfig } from "../langchain/modelSwitcher";
import { PromptManager } from "../prompts/promptManager";
import {
  AIServiceStatus,
  AIRequestOptions,
  CodeGenerationResult,
  ImageGenerationResult,
  ImageGenerationOptions,
  TemplateProcessOptions,
  TemplateProcessResult,
  AIGenerationType,
  AIResponse,
} from "../types";
import { useFileSystem } from "@/core/fileSystem";
import { useWebContainer } from "@/core/webContainer";
import { FileItem, FileItemType } from "@/core/fileSystem/types";

/**
 * AI模型类型
 */
export enum AIModelType {
  /** OpenAI GPT-4o */
  GPT4O = "gpt-4o",
  /** Google Gemini 2.5 */
  GEMINI25 = "gemini2.5",
  /** DeepSeek */
  DEEPSEEK = "deepseek",
}

/**
 * AI模型配置
 */
export interface AIModelConfig {
  /** 模型类型 */
  type: AIModelType;
  /** 模型名称 */
  name: string;
  /** 基础URL */
  baseUrl: string;
  /** API密钥 */
  apiKey?: string;
  /** 是否需要代理 */
  needsProxy?: boolean;
}

/**
 * 默认模型配置
 */
export const DEFAULT_MODEL_CONFIGS: Record<AIModelType, AIModelConfig> = {
  [AIModelType.GPT4O]: {
    type: AIModelType.GPT4O,
    name: "GPT-4o",
    baseUrl: "https://api.openai.com",
    needsProxy: true,
  },
  [AIModelType.GEMINI25]: {
    type: AIModelType.GEMINI25,
    name: "Gemini 2.5",
    baseUrl: "https://generativelanguage.googleapis.com",
    needsProxy: true,
  },
  [AIModelType.DEEPSEEK]: {
    type: AIModelType.DEEPSEEK,
    name: "DeepSeek",
    baseUrl: "https://api.deepseek.com/chat/completions",
    needsProxy: true,
    apiKey: "sk-58b58e33b4d64358836ff816fa918aa8", // 默认API密钥
  },
};

/**
 * AI服务钩子选项
 */
interface UseAIServiceOptions {
  /** 是否自动初始化 */
  autoInit?: boolean;
  /** API密钥 */
  apiKey?: string;
  /** 基础URL */
  baseUrl?: string;
  /** 模型名称 */
  modelName?: string;
  /** 模型类型 */
  modelType?: AIModelType;
  /** 最大token数 */
  maxTokens?: number;
  /** 温度参数 */
  temperature?: number;
}

/**
 * AI服务钩子
 * @param options 钩子选项
 * @returns AI服务状态和方法
 */
export const useAIService = (options: UseAIServiceOptions = {}) => {
  // 获取服务实例
  const aiService = useRef(AIService.getInstance());
  const langChainService = useRef(LangChainService.getInstance());
  const promptManager = useRef(PromptManager.getInstance());
  const modelSwitcher = useRef<ModelSwitcher | null>(null);

  // 对话状态
  const [currentConversationId, setCurrentConversationId] = useState<string>("default");
  const [conversations, setConversations] = useState<ConversationInfo[]>([]);

  // 模型切换器状态
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [currentLangChainModel, setCurrentLangChainModel] = useState<string>("");

  // 状态
  const [status, setStatus] = useState<AIServiceStatus>(AIServiceStatus.UNINITIALIZED);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentModelType, setCurrentModelType] = useState<AIModelType>(options.modelType || AIModelType.DEEPSEEK);

  // 获取其他钩子
  const fileSystem = useFileSystem();
  const webContainer = useWebContainer();

  // 获取当前模型配置
  const getCurrentModelConfig = useCallback(() => {
    return DEFAULT_MODEL_CONFIGS[currentModelType];
  }, [currentModelType]);

  // 切换模型
  const switchModel = useCallback(
    async (modelType: AIModelType, apiKey?: string): Promise<boolean> => {
      try {
        // 如果当前正在处理请求，不允许切换模型
        if (isProcessing) {
          setError("正在处理请求，无法切换模型");
          return false;
        }

        // 获取模型配置
        const modelConfig = DEFAULT_MODEL_CONFIGS[modelType];
        if (!modelConfig) {
          setError(`未找到模型配置: ${modelType}`);
          return false;
        }

        // 更新当前模型类型
        setCurrentModelType(modelType);
        setStatus(AIServiceStatus.INITIALIZING);

        // 初始化AI服务
        const success = await aiService.current.initialize({
          apiKey: apiKey || modelConfig.apiKey || options.apiKey || "",
          baseUrl: modelConfig.baseUrl || options.baseUrl || "https://api.openai.com",
          modelName: modelType || options.modelName || "gpt-4o",
        });

        if (success) {
          // 初始化提示词管理器
          await promptManager.current.initialize();

          setStatus(AIServiceStatus.READY);
          setError(null);
          return true;
        } else {
          setStatus(AIServiceStatus.ERROR);
          setError(aiService.current.getError() || "初始化失败");
          return false;
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "切换模型失败");
        return false;
      }
    },
    [isProcessing, options.apiKey, options.baseUrl, options.modelName]
  );

  // 初始化服务
  const initialize = useCallback(
    async (apiKey?: string, baseUrl?: string, modelName?: string): Promise<boolean> => {
      try {
        setStatus(AIServiceStatus.INITIALIZING);

        // 获取当前模型配置
        const modelConfig = getCurrentModelConfig();

        // 初始化AI服务
        const success = await aiService.current.initialize({
          apiKey: apiKey || options.apiKey || modelConfig.apiKey || "",
          baseUrl: baseUrl || modelConfig.baseUrl || options.baseUrl || "https://api.openai.com",
          modelName: modelName || currentModelType || options.modelName || "gpt-4o",
        });

        if (!success) {
          setStatus(AIServiceStatus.ERROR);
          setError(aiService.current.getError() || "初始化失败");
          return false;
        }

        // 初始化LangChain服务
        const lcSuccess = await langChainService.current.initialize({
          defaultModelName: modelName || currentModelType || options.modelName || "gpt-4o",
          apiKey: apiKey || options.apiKey || modelConfig.apiKey || "",
          baseUrl: baseUrl || modelConfig.baseUrl || options.baseUrl || "https://api.openai.com",
          memoryType: "buffer",
          persistenceProvider: "localStorage",
          maxTokens: options.maxTokens || 2000,
          temperature: options.temperature || 0.7,
        });

        if (!lcSuccess) {
          setStatus(AIServiceStatus.ERROR);
          setError("LangChain服务初始化失败");
          return false;
        }

        // 初始化模型切换器
        try {
          // 创建模型配置
          const modelConfigs: ModelConfig[] = [
            {
              provider: ModelProvider.DEEPSEEK,
              modelName: "deepseek-chat",
              temperature: options.temperature || 0.7,
              apiKey: apiKey || options.apiKey || "",
              maxTokens: options.maxTokens || 2000,
            },
            {
              provider: ModelProvider.GEMINI,
              modelName: "gemini-1.5-pro",
              temperature: options.temperature || 0.7,
              apiKey: apiKey || options.apiKey || "",
              maxTokens: options.maxTokens || 2000,
            },
          ];

          // 根据当前模型类型选择默认模型
          let defaultModel = "";
          if (currentModelType === AIModelType.DEEPSEEK) {
            defaultModel = `${ModelProvider.DEEPSEEK}:deepseek-chat`;
          } else if (currentModelType === AIModelType.GEMINI25) {
            defaultModel = `${ModelProvider.GEMINI}:gemini-1.5-pro`;
          } else {
            // 默认使用Gemini
            defaultModel = `${ModelProvider.GEMINI}:gemini-1.5-pro`;
          }

          // 创建模型切换器
          modelSwitcher.current = new ModelSwitcher(modelConfigs, defaultModel);

          // 更新状态
          setAvailableModels(modelSwitcher.current.getAvailableModels());
          setCurrentLangChainModel(modelSwitcher.current.getCurrentModelKey());
        } catch (error) {
          console.error("初始化模型切换器失败:", error);
          // 不阻止继续初始化其他服务
        }

        // 初始化提示词管理器
        await promptManager.current.initialize();

        // 创建默认对话
        await langChainService.current.createConversation("default");

        // 加载对话列表
        const convList = await langChainService.current.listConversations();
        setConversations(convList);

        setStatus(AIServiceStatus.READY);
        setError(null);
        return true;
      } catch (err) {
        setStatus(AIServiceStatus.ERROR);
        setError(err instanceof Error ? err.message : "初始化失败");
        return false;
      }
    },
    [options.apiKey, options.baseUrl, options.modelName, options.maxTokens, options.temperature, currentModelType, getCurrentModelConfig]
  );

  // 自动初始化
  useEffect(() => {
    if (options.autoInit && status === AIServiceStatus.UNINITIALIZED) {
      initialize();
    }
  }, [options.autoInit, status, initialize]);

  // 生成代码
  const generateCode = useCallback(
    async (prompt: string, options?: Partial<AIRequestOptions>): Promise<CodeGenerationResult> => {
      try {
        setIsProcessing(true);
        setError(null);

        // 检查服务状态
        if (status !== AIServiceStatus.READY) {
          throw new Error(`服务未就绪，当前状态: ${status}`);
        }

        // 发送代码生成请求
        const result = await aiService.current.generateCode({
          prompt,
          ...options,
        });

        setIsProcessing(false);

        if (!result.success) {
          setError(result.error || "代码生成失败");
        }

        return result;
      } catch (err) {
        setIsProcessing(false);
        const errorMessage = err instanceof Error ? err.message : "代码生成失败";
        setError(errorMessage);

        return {
          success: false,
          error: errorMessage,
        };
      }
    },
    [status]
  );

  // 发送聊天请求
  const sendChatRequest = useCallback(
    async (prompt: string, options?: Partial<AIRequestOptions>): Promise<AIResponse> => {
      try {
        setIsProcessing(true);
        setError(null);

        // 检查服务状态
        if (status !== AIServiceStatus.READY) {
          throw new Error(`服务未就绪，当前状态: ${status}`);
        }

        // 尝试使用模型切换器
        if (modelSwitcher.current) {
          try {
            // 准备消息
            const messages: Array<[string, string]> = [
              ["system", options?.systemPrompt || "你是一个专业的前端开发工程师，帮助用户根据他的需求创建完美的落地页界面。"],
              ["human", prompt],
            ];

            // 发送消息
            const aiMessage = await modelSwitcher.current.sendMessage(messages);

            setIsProcessing(false);

            return {
              success: true,
              content: aiMessage.content as string,
            };
          } catch (error) {
            console.warn("模型切换器请求失败，尝试其他方法", error);
            // 如果模型切换器失败，尝试使用LangChain服务
          }
        }

        // 使用LangChain发送请求
        let response;
        try {
          response = await langChainService.current.sendMessage(currentConversationId, prompt);
        } catch (error) {
          // 如果LangChain失败，回退到原始的AI服务
          console.warn("LangChain请求失败，回退到原始服务", error);
          const result = await aiService.current.sendRequest({
            prompt,
            systemPrompt: options?.systemPrompt || "你是一个专业的前端开发工程师，帮助用户根据他的需求创建完美的落地页界面。",
            ...options,
          });

          setIsProcessing(false);

          if (!result.success) {
            setError(result.error || "聊天请求失败");
          }

          return result;
        }

        setIsProcessing(false);

        return {
          success: true,
          content: response,
        };
      } catch (err) {
        setIsProcessing(false);
        const errorMessage = err instanceof Error ? err.message : "聊天请求失败";
        setError(errorMessage);

        return {
          success: false,
          error: errorMessage,
        };
      }
    },
    [status, currentConversationId]
  );

  // 切换LangChain模型
  const switchLangChainModel = useCallback((modelKey: string): boolean => {
    if (!modelSwitcher.current) {
      console.error("模型切换器未初始化");
      return false;
    }

    const success = modelSwitcher.current.switchModel(modelKey);
    if (success) {
      setCurrentLangChainModel(modelSwitcher.current.getCurrentModelKey());
    }
    return success;
  }, []);

  // 生成图像
  const generateImage = useCallback(
    async (prompt: string, options?: ImageGenerationOptions): Promise<ImageGenerationResult> => {
      try {
        setIsProcessing(true);
        setError(null);

        // 检查服务状态
        if (status !== AIServiceStatus.READY) {
          throw new Error(`服务未就绪，当前状态: ${status}`);
        }

        // 发送图像生成请求
        const result = await aiService.current.generateImage(prompt, options);

        setIsProcessing(false);

        if (!result.success) {
          setError(result.error || "图像生成失败");
        }

        return result;
      } catch (err) {
        setIsProcessing(false);
        const errorMessage = err instanceof Error ? err.message : "图像生成失败";
        setError(errorMessage);

        return {
          success: false,
          error: errorMessage,
        };
      }
    },
    [status]
  );

  // 优化提示词
  const optimizePrompt = useCallback(
    async (prompt: string): Promise<string> => {
      try {
        // 检查服务状态
        if (status !== AIServiceStatus.READY) {
          return prompt; // 如果服务未就绪，返回原始提示词
        }

        return await promptManager.current.optimizePrompt(prompt);
      } catch (err) {
        console.error("优化提示词失败:", err);
        return prompt; // 出错时返回原始提示词
      }
    },
    [status]
  );

  // 处理模板
  const processTemplate = useCallback(
    async (options: TemplateProcessOptions): Promise<TemplateProcessResult> => {
      try {
        setIsProcessing(true);
        setError(null);

        // 检查服务状态
        if (status !== AIServiceStatus.READY) {
          throw new Error(`服务未就绪，当前状态: ${status}`);
        }

        const { template, formData, generationType = AIGenerationType.CODE, customPrompt, autoSync = false } = options;

        // 构建提示词
        let prompt = customPrompt || "";

        if (!customPrompt) {
          // 根据模板和表单数据构建提示词
          prompt = `请为我创建一个${template.name}，具有以下特点：\n\n`;

          // 添加表单数据
          if (template.fields && template.fields.length > 0) {
            for (const field of template.fields) {
              const value = formData[field.id];
              if (value) {
                prompt += `- ${field.name}: ${value}\n`;
              }
            }
          }

          // 根据生成类型添加特定指令
          if (generationType === AIGenerationType.CODE || generationType === AIGenerationType.MIXED) {
            prompt += "\n请生成所有必要的HTML、CSS和JavaScript代码。";
          }

          if (generationType === AIGenerationType.IMAGE || generationType === AIGenerationType.MIXED) {
            prompt += "\n请描述需要生成的图像，包括风格、内容和布局。";
          }
        }

        // 生成代码
        let codeResult: CodeGenerationResult = { success: true, files: [] };
        if (generationType === AIGenerationType.CODE || generationType === AIGenerationType.MIXED) {
          codeResult = await generateCode(prompt);
          if (!codeResult.success) {
            throw new Error(codeResult.error || "代码生成失败");
          }
        }

        // 生成图像
        let imageResult: ImageGenerationResult = { success: true, images: [] };
        if (generationType === AIGenerationType.IMAGE || generationType === AIGenerationType.MIXED) {
          // 从代码生成结果中提取图像描述
          let imagePrompt = prompt;
          if (generationType === AIGenerationType.MIXED && codeResult.success) {
            // 生成图像描述的提示词
            const imageDescPrompt = `基于以下项目需求，请提供详细的图像描述，用于AI图像生成：\n\n${prompt}`;
            const imageDescResult = await aiService.current.sendRequest({
              prompt: imageDescPrompt,
              systemPrompt: "你是一个专业的图像描述生成器。请根据用户的项目需求，生成详细的图像描述，用于AI图像生成。只返回图像描述，不要包含任何解释或其他内容。",
            });

            if (imageDescResult.success && imageDescResult.content) {
              imagePrompt = imageDescResult.content;
            }
          }

          imageResult = await generateImage(imagePrompt);
          if (!imageResult.success) {
            console.error("图像生成失败:", imageResult.error);
            // 图像生成失败不阻止整个流程
          }
        }

        // 将生成的文件转换为FileItem格式
        const files: FileItem[] = [];

        // 添加代码文件
        if (codeResult.files && codeResult.files.length > 0) {
          for (const file of codeResult.files) {
            files.push({
              name: file.path.split("/").pop() || "unnamed",
              path: file.path,
              type: FileItemType.FILE,
              content: file.content,
              metadata: {
                createdAt: Date.now(),
                updatedAt: Date.now(),
                size: new Blob([file.content]).size,
              },
            });
          }
        }

        // 添加图像文件
        if (imageResult.images && imageResult.images.length > 0) {
          // 处理图像文件
          for (let i = 0; i < imageResult.images.length; i++) {
            const image = imageResult.images[i];

            try {
              // 下载图像
              const response = await fetch(image.url);
              const blob = await response.blob();
              const content = await new Promise<string>((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result as string);
                reader.readAsDataURL(blob);
              });

              // 创建图像文件
              files.push({
                name: `image-${i + 1}.png`,
                path: `assets/images/image-${i + 1}.png`,
                type: FileItemType.FILE,
                content,
                metadata: {
                  createdAt: Date.now(),
                  updatedAt: Date.now(),
                  size: blob.size,
                },
              });
            } catch (err) {
              console.error("处理图像文件失败:", err);
            }
          }
        }

        // 如果没有生成任何文件，返回错误
        if (files.length === 0) {
          throw new Error("未生成任何文件");
        }

        // 将文件添加到文件系统
        for (const file of files) {
          // 确保文件路径的目录存在
          const dirPath = file.path.split("/").slice(0, -1).join("/");
          if (dirPath) {
            // 检查目录是否存在，不存在则创建
            const dirExists = fileSystem.findItem(fileSystem.files, dirPath);
            if (!dirExists) {
              // 创建目录
              const dirs = dirPath.split("/");
              let currentPath = "";
              for (const dir of dirs) {
                const newPath = currentPath ? `${currentPath}/${dir}` : dir;
                const exists = fileSystem.findItem(fileSystem.files, newPath);
                if (!exists) {
                  fileSystem.createFolder(currentPath, {
                    name: dir,
                    path: newPath,
                    type: FileItemType.FOLDER,
                    children: [],
                  });
                }
                currentPath = newPath;
              }
            }
          }

          // 创建文件
          fileSystem.createFile(dirPath, file);
        }

        // 如果需要自动同步到WebContainer
        if (autoSync && webContainer && files.length > 0) {
          webContainer.startApp(fileSystem.files);
        }

        setIsProcessing(false);

        return {
          success: true,
          files,
        };
      } catch (err) {
        setIsProcessing(false);
        const errorMessage = err instanceof Error ? err.message : "处理模板失败";
        setError(errorMessage);

        return {
          success: false,
          error: errorMessage,
        };
      }
    },
    [status, generateCode, generateImage, fileSystem, webContainer]
  );

  // 取消请求
  const cancelRequest = useCallback(() => {
    aiService.current.cancelRequest();
    setIsProcessing(false);
  }, []);

  // 重置状态
  const reset = useCallback(() => {
    aiService.current.reset();
    setStatus(aiService.current.getStatus());
    setError(null);
    setIsProcessing(false);
  }, []);

  // 创建新对话
  const createConversation = useCallback(
    async (name: string): Promise<string> => {
      const id = `conv_${Date.now()}`;
      await langChainService.current.createConversation(id, {
        name,
        modelName: currentModelType,
      });

      // 更新对话列表
      const convList = await langChainService.current.listConversations();
      setConversations(convList);

      // 设置当前对话
      setCurrentConversationId(id);

      return id;
    },
    [currentModelType]
  );

  // 切换对话
  const switchConversation = useCallback((conversationId: string) => {
    setCurrentConversationId(conversationId);
  }, []);

  // 删除对话
  const deleteConversation = useCallback(
    async (conversationId: string): Promise<boolean> => {
      const success = await langChainService.current.deleteConversation(conversationId);

      if (success) {
        // 更新对话列表
        const convList = await langChainService.current.listConversations();
        setConversations(convList);

        // 如果删除的是当前对话，切换到默认对话
        if (conversationId === currentConversationId) {
          setCurrentConversationId("default");
        }
      }

      return success;
    },
    [currentConversationId]
  );

  return {
    // 状态
    status,
    error,
    isProcessing,
    currentModelType,
    currentConversationId,
    conversations,
    availableModels,
    currentLangChainModel,

    // 方法
    initialize,
    generateCode,
    generateImage,
    sendChatRequest,
    optimizePrompt,
    processTemplate,
    cancelRequest,
    reset,
    switchModel,
    getCurrentModelConfig,

    // LangChain特定方法
    createConversation,
    switchConversation,
    deleteConversation,
    switchLangChainModel,
  };
};

export default useAIService;
