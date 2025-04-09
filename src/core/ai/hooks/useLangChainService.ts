/**
 * LangChain服务钩子
 * 提供基于LangChain的AI功能，支持多模型切换、对话管理等功能
 */

import { useState, useCallback, useRef, useEffect } from "react";
import { ModelSwitcher, ModelProvider, ModelConfig } from "../langchain/modelSwitcher";
import { AIServiceStatus } from "../types";
export { AIServiceStatus };
import { ConversationInfo } from "../langchain/types";

/**
 * AI模型类型
 * 定义支持的AI模型类型
 */
export enum AIModelType {
  /** OpenAI GPT-4o */
  GPT4O = "gpt-4o",
  /** Google Gemini 1.5 Pro */
  GEMINI_PRO = "gemini-1.5-pro",
  /** DeepSeek Chat */
  DEEPSEEK = "deepseek-chat",
}

/**
 * 服务钩子选项
 */
export interface UseLangChainServiceOptions {
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
}

/**
 * 请求选项
 */
export interface RequestOptions {
  /** 系统提示词 */
  systemPrompt?: string;
  /** 默认系统提示词 */
  defaultSystemPrompt?: string;
  /** 温度参数 (0-1) */
  temperature?: number;
  /** 最大token数 */
  maxTokens?: number;
  /** 停止序列 */
  stopSequences?: string[];
  /** 是否流式响应 */
  streaming?: boolean;
  /** 流式响应回调 */
  onStreamingUpdate?: (content: string) => void;
}

/**
 * 响应结果
 */
export interface ResponseResult {
  /** 是否成功 */
  success: boolean;
  /** 内容 */
  content?: string;
  /** 错误信息 */
  error?: string;
  /** 使用情况 */
  usage?: {
    promptTokens?: number;
    completionTokens?: number;
    totalTokens?: number;
  };
}

/**
 * 代码生成结果
 */
export interface CodeGenerationResult extends ResponseResult {
  /** 生成的文件 */
  files?: Array<{
    path: string;
    content: string;
    language?: string;
  }>;
}

/**
 * 图像生成选项
 */
export interface ImageGenerationOptions {
  /** 生成图像数量 */
  count?: number;
  /** 图像尺寸 */
  size?: string;
  /** 图像风格 */
  style?: string;
  /** 图像质量 */
  quality?: string;
}

/**
 * 图像生成结果
 */
export interface ImageGenerationResult extends ResponseResult {
  /** 生成的图像 */
  images?: Array<{
    url: string;
    width: number;
    height: number;
  }>;
}

/**
 * 对话创建选项
 */
export interface ConversationCreateOptions {
  /** 对话名称 */
  name: string;
  /** 对话描述 */
  description?: string;
  /** 系统提示词 */
  systemPrompt?: string;
  /** 模型类型 */
  modelType?: AIModelType;
}

/**
 * 默认系统提示词
 */
const DEFAULT_SYSTEM_PROMPT = "你是一个专业的前端开发工程师，帮助用户根据他的需求创建完美的落地页界面。";

/**
 * 模型提供商映射
 */
const MODEL_PROVIDER_MAP: Record<AIModelType, ModelProvider> = {
  [AIModelType.GPT4O]: ModelProvider.OPENAI,
  [AIModelType.GEMINI_PRO]: ModelProvider.GEMINI,
  [AIModelType.DEEPSEEK]: ModelProvider.DEEPSEEK,
};

/**
 * LangChain服务钩子
 * 提供基于LangChain的AI功能
 */
export const useLangChainService = (options: UseLangChainServiceOptions = { apiKey: "sk-58b58e33b4d64358836ff816fa918aa8", defaultModelType: AIModelType.DEEPSEEK }) => {
  // 模型切换器
  const modelSwitcher = useRef<ModelSwitcher | null>(null);

  // 状态
  const [status, setStatus] = useState<AIServiceStatus>(AIServiceStatus.UNINITIALIZED);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentModelType, setCurrentModelType] = useState<AIModelType>(options.defaultModelType || AIModelType.GEMINI_PRO);

  // 对话状态
  const [currentConversationId, setCurrentConversationId] = useState<string>("default");
  const [conversations, setConversations] = useState<ConversationInfo[]>([]);

  // 模型状态
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [currentModel, setCurrentModel] = useState<string>("");

  /**
   * 获取模型配置
   * 根据当前环境和设置创建模型配置
   * 只返回有API密钥的模型
   */
  const getModelConfigs = useCallback((): ModelConfig[] => {
    const configs: ModelConfig[] = [];

    // 首先添加DeepSeek模型（默认模型）
    const deepseekApiKey = options.apiKey || process.env.DEEPSEEK_API_KEY || "";
    if (deepseekApiKey) {
      configs.push({
        provider: ModelProvider.DEEPSEEK,
        modelName: AIModelType.DEEPSEEK,
        temperature: options.temperature ?? 0.7,
        apiKey: deepseekApiKey,
        maxTokens: options.maxTokens || 2000,
      });
    }

    // 如果有API密钥，添加Gemini模型
    const geminiApiKey = options.apiKey || process.env.GOOGLE_API_KEY || "";
    if (geminiApiKey) {
      configs.push({
        provider: ModelProvider.GEMINI,
        modelName: AIModelType.GEMINI_PRO,
        temperature: options.temperature ?? 0.7,
        apiKey: geminiApiKey,
        maxTokens: options.maxTokens || 2000,
      });
    }

    // 如果有API密钥，添加OpenAI模型
    const openaiApiKey = options.apiKey || process.env.OPENAI_API_KEY || "";
    if (openaiApiKey) {
      configs.push({
        provider: ModelProvider.OPENAI,
        modelName: AIModelType.GPT4O,
        temperature: options.temperature ?? 0.7,
        apiKey: openaiApiKey,
        maxTokens: options.maxTokens || 2000,
      });
    }

    // 如果没有任何模型配置，添加一个默认的DeepSeek模型
    if (configs.length === 0) {
      configs.push({
        provider: ModelProvider.DEEPSEEK,
        modelName: AIModelType.DEEPSEEK,
        temperature: options.temperature ?? 0.7,
        apiKey: options.apiKey || "", // 即使没有API密钥也添加默认模型
        maxTokens: options.maxTokens || 2000,
      });
    }

    return configs;
  }, [options.apiKey, options.temperature, options.maxTokens]);

  /**
   * 初始化服务
   * @param apiKey API密钥（可选，如果不提供则使用选项中的密钥）
   * @returns 是否初始化成功
   */
  const initialize = useCallback(
    async (apiKey?: string): Promise<boolean> => {
      try {
        setStatus(AIServiceStatus.INITIALIZING);

        // 创建模型配置
        const modelConfigs = getModelConfigs();

        // 如果提供了apiKey，更新所有模型的apiKey
        if (apiKey) {
          modelConfigs.forEach((config) => {
            config.apiKey = apiKey;
          });
        }

        // 根据当前模型类型选择默认模型
        const provider = MODEL_PROVIDER_MAP[currentModelType];
        const defaultModel = `${provider}:${currentModelType}`;

        // 创建模型切换器
        modelSwitcher.current = new ModelSwitcher(modelConfigs, defaultModel);

        // 更新状态
        setAvailableModels(modelSwitcher.current.getAvailableModels());
        setCurrentModel(modelSwitcher.current.getCurrentModelKey());

        // 创建默认对话
        await createConversation({
          name: "默认对话",
          systemPrompt: options.defaultSystemPrompt || DEFAULT_SYSTEM_PROMPT,
        });

        setStatus(AIServiceStatus.READY);
        setError(null);
        return true;
      } catch (err) {
        setStatus(AIServiceStatus.ERROR);
        const errorMessage = err instanceof Error ? err.message : "初始化失败";
        setError(errorMessage);
        return false;
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentModelType, getModelConfigs, options.defaultSystemPrompt]
  );

  /**
   * 自动初始化
   */
  useEffect(() => {
    if (options.autoInit && status === AIServiceStatus.UNINITIALIZED) {
      initialize();
    }
  }, [options.autoInit, status, initialize]);

  /**
   * 发送消息
   * @param message 消息内容
   * @param options 请求选项
   * @returns 响应结果
   */
  const sendMessage = useCallback(
    async (message: string, options?: RequestOptions): Promise<ResponseResult> => {
      try {
        setIsProcessing(true);
        setError(null);

        // 检查服务状态
        if (status !== AIServiceStatus.READY) {
          throw new Error(`服务未就绪，当前状态: ${status}`);
        }

        // 检查模型切换器
        if (!modelSwitcher.current) {
          throw new Error("模型切换器未初始化");
        }

        // 准备消息
        const messages: Array<[string, string]> = [
          ["system", options?.systemPrompt || options?.defaultSystemPrompt || DEFAULT_SYSTEM_PROMPT],
          ["human", message],
        ];

        // 发送消息
        const aiMessage = await modelSwitcher.current.sendMessage(messages);

        setIsProcessing(false);

        return {
          success: true,
          content: aiMessage.content as string,
          usage: aiMessage.usage_metadata
            ? {
                promptTokens: aiMessage.usage_metadata.input_tokens,
                completionTokens: aiMessage.usage_metadata.output_tokens,
                totalTokens: aiMessage.usage_metadata.total_tokens,
              }
            : undefined,
        };
      } catch (err) {
        setIsProcessing(false);
        const errorMessage = err instanceof Error ? err.message : "发送消息失败";
        setError(errorMessage);

        return {
          success: false,
          error: errorMessage,
        };
      }
    },
    [status]
  );

  /**
   * 切换模型
   * @param modelType 模型类型
   * @returns 是否切换成功
   */
  const switchModel = useCallback((modelType: AIModelType): boolean => {
    if (!modelSwitcher.current) {
      setError("模型切换器未初始化");
      return false;
    }

    const provider = MODEL_PROVIDER_MAP[modelType];
    const modelKey = `${provider}:${modelType}`;

    const success = modelSwitcher.current.switchModel(modelKey);
    if (success) {
      setCurrentModel(modelSwitcher.current.getCurrentModelKey());
      setCurrentModelType(modelType);
      return true;
    }

    setError(`切换到模型 ${modelType} 失败`);
    return false;
  }, []);

  /**
   * 创建对话
   * @param options 对话创建选项
   * @returns 对话ID
   */
  const createConversation = useCallback(
    async (options: ConversationCreateOptions): Promise<string> => {
      try {
        const id = `conv_${Date.now()}`;

        // 创建对话信息
        const conversationInfo: ConversationInfo = {
          id,
          name: options.name,
          lastMessage: options.description,
          messageCount: 0,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };

        // 如果指定了模型类型，切换到该模型
        if (options.modelType && options.modelType !== currentModelType) {
          switchModel(options.modelType);
        }

        // 更新对话列表
        setConversations((prev) => [...prev, conversationInfo]);

        // 设置为当前对话
        setCurrentConversationId(id);

        return id;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "创建对话失败";
        setError(errorMessage);
        throw error;
      }
    },
    [currentModelType, switchModel]
  );

  /**
   * 切换对话
   * @param conversationId 对话ID
   */
  const switchConversation = useCallback(
    (conversationId: string) => {
      const conversation = conversations.find((conv) => conv.id === conversationId);
      if (!conversation) {
        setError(`对话 ${conversationId} 不存在`);
        return false;
      }

      setCurrentConversationId(conversationId);
      return true;
    },
    [conversations]
  );

  /**
   * 删除对话
   * @param conversationId 对话ID
   * @returns 是否删除成功
   */
  const deleteConversation = useCallback(
    (conversationId: string): boolean => {
      try {
        // 不允许删除默认对话
        if (conversationId === "default") {
          setError("不能删除默认对话");
          return false;
        }

        setConversations((prev) => prev.filter((conv) => conv.id !== conversationId));

        // 如果删除的是当前对话，切换到默认对话
        if (conversationId === currentConversationId) {
          setCurrentConversationId("default");
        }

        return true;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "删除对话失败";
        setError(errorMessage);
        return false;
      }
    },
    [currentConversationId]
  );

  /**
   * 生成代码
   * @param prompt 提示词
   * @param options 请求选项
   * @returns 代码生成结果
   */
  const generateCode = useCallback(
    async (prompt: string, options?: RequestOptions): Promise<CodeGenerationResult> => {
      try {
        // 添加代码生成相关的系统提示词
        const systemPrompt =
          options?.systemPrompt ||
          "你是一个专业的代码生成助手。请根据用户的需求生成代码。" +
            "返回格式应为markdown代码块，每个文件使用单独的代码块，并在代码块前注明文件路径。" +
            "例如: ```filepath:src/index.js\nconsole.log('Hello');\n```";

        const result = await sendMessage(prompt, {
          ...options,
          systemPrompt,
        });

        if (!result.success) {
          return result;
        }

        // 解析代码文件
        const files = parseCodeFromResponse(result.content || "");

        return {
          ...result,
          files,
        };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "代码生成失败";
        setError(errorMessage);
        return {
          success: false,
          error: errorMessage,
        };
      }
    },
    [sendMessage]
  );

  /**
   * 从响应中解析代码文件
   * @param content 响应内容
   * @returns 解析出的文件列表
   */
  const parseCodeFromResponse = (content: string): Array<{ path: string; content: string; language?: string }> => {
    const files: Array<{ path: string; content: string; language?: string }> = [];

    // 匹配markdown代码块: ```language:filepath ... ```
    const codeBlockRegex = /```(?:([\w-]+):)?([^\n]+)?\n([\s\S]*?)```/g;
    let match;

    while ((match = codeBlockRegex.exec(content)) !== null) {
      const language = match[1];
      const filepath = match[2] || "";
      const code = match[3];

      // 如果找到了文件路径和代码内容
      if (filepath && code) {
        // 清理文件路径
        const cleanPath = filepath.replace(/^filepath:/, "").trim();

        files.push({
          path: cleanPath,
          content: code,
          language,
        });
      }
    }

    return files;
  };

  /**
   * 生成图像
   * @param prompt 提示词
   * @param options 图像生成选项
   * @returns 图像生成结果
   */
  const generateImage = useCallback(
    async (prompt: string): Promise<ImageGenerationResult> => {
      try {
        setIsProcessing(true);
        setError(null);

        // 检查服务状态
        if (status !== AIServiceStatus.READY) {
          throw new Error(`服务未就绪，当前状态: ${status}`);
        }

        // 这里我们使用系统提示词来指导模型生成图像描述
        // 然后在实际项目中，你可以集成DALL-E或其他图像生成API
        const systemPrompt =
          "你是一个专业的图像生成助手。请根据用户的需求生成详细的图像描述，" +
          "这些描述将被用于生成图像。描述应该详细、具体，包括图像的主题、风格、颜色、构图等。" +
          "每个描述应该是一个独立的段落。";

        const result = await sendMessage(prompt, { systemPrompt });

        if (!result.success) {
          setIsProcessing(false);
          return result;
        }

        // 在实际项目中，这里应该调用图像生成API
        // 这里我们只是模拟返回结果
        const mockImages = [
          {
            url: "https://example.com/image1.png",
            width: 1024,
            height: 1024,
          },
        ];

        setIsProcessing(false);

        return {
          success: true,
          content: result.content,
          images: mockImages,
        };
      } catch (error) {
        setIsProcessing(false);
        const errorMessage = error instanceof Error ? error.message : "图像生成失败";
        setError(errorMessage);
        return {
          success: false,
          error: errorMessage,
        };
      }
    },
    [status, sendMessage]
  );

  /**
   * 处理模板
   * 根据用户需求和模板生成代码
   * @param prompt 用户需求
   * @param templatePath 模板路径
   * @param options 请求选项
   * @returns 代码生成结果
   */
  const processTemplate = useCallback(
    async (prompt: string, templatePath: string, options?: RequestOptions): Promise<CodeGenerationResult> => {
      try {
        setIsProcessing(true);
        setError(null);

        // 检查服务状态
        if (status !== AIServiceStatus.READY) {
          throw new Error(`服务未就绪，当前状态: ${status}`);
        }

        // 构建模板描述
        const templateDescription = `模板路径: ${templatePath}\n`;

        // 构建系统提示词
        const systemPrompt =
          options?.systemPrompt ||
          "你是一个专业的前端开发工程师，帮助用户根据模板创建落地页。" +
            "请根据用户的需求和提供的模板，生成相应的代码。" +
            "返回格式应为markdown代码块，每个文件使用单独的代码块，并在代码块前注明文件路径。" +
            "例如: ```filepath:src/index.js\nconsole.log('Hello');\n```";

        // 发送请求
        const result = await sendMessage(`请根据以下模板和需求生成代码：\n\n${templateDescription}\n\n用户需求: ${prompt}`, { systemPrompt });

        if (!result.success) {
          setIsProcessing(false);
          return result;
        }

        // 解析代码文件
        const files = parseCodeFromResponse(result.content || "");

        setIsProcessing(false);

        return {
          success: true,
          content: result.content,
          files,
        };
      } catch (error) {
        setIsProcessing(false);
        const errorMessage = error instanceof Error ? error.message : "模板处理失败";
        setError(errorMessage);
        return {
          success: false,
          error: errorMessage,
        };
      }
    },
    [status, sendMessage]
  );

  /**
   * 优化提示词
   * @param prompt 原始提示词
   * @returns 优化后的提示词
   */
  const optimizePrompt = useCallback(
    async (prompt: string): Promise<string> => {
      try {
        const systemPrompt = "你是一个专业的提示词优化助手。请帮助用户优化他们的提示词，" + "使其更加清晰、具体和有效。只返回优化后的提示词，不要包含任何解释或其他内容。";

        const result = await sendMessage(`请优化以下提示词，使其更清晰、更具体，以便AI能更好地理解和执行：\n\n${prompt}`, { systemPrompt });

        if (!result.success || !result.content) {
          return prompt; // 如果优化失败，返回原始提示词
        }

        return result.content.trim();
      } catch (error) {
        console.error("提示词优化失败:", error);
        return prompt; // 出错时返回原始提示词
      }
    },
    [sendMessage]
  );

  /**
   * 取消请求
   */
  const cancelRequest = useCallback(() => {
    setIsProcessing(false);
  }, []);

  /**
   * 重置服务
   */
  const reset = useCallback(() => {
    setStatus(AIServiceStatus.UNINITIALIZED);
    setError(null);
    setIsProcessing(false);
    setConversations([]);
    setCurrentConversationId("default");
    modelSwitcher.current = null;
  }, []);

  return {
    // 状态
    status,
    error,
    isProcessing,
    currentModelType,
    currentConversationId,
    conversations,
    availableModels,
    currentModel,

    // 方法
    initialize,
    sendMessage,
    generateCode,
    generateImage,
    processTemplate,
    optimizePrompt,
    switchModel,
    cancelRequest,
    reset,

    // 对话管理
    createConversation,
    switchConversation,
    deleteConversation,
  };
};

export default useLangChainService;
