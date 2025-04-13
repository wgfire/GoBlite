/**
 * 模型管理器
 * 统一管理不同AI模型提供商的模型
 */

import { BaseChatModel } from "@langchain/core/language_models/chat_models";
import { AIMessage, HumanMessage, SystemMessage } from "@langchain/core/messages";
import { ModelFactory } from "./modelFactory";
import { ModelConfig, UsageMetadata, ModelType } from "../../types";
import { AI_MODELS } from "../../constants";

/**
 * 模型管理器类
 * 统一管理不同AI模型提供商的模型
 */
export class ModelManager {
  /** 模型映射 */
  private models: Map<string, BaseChatModel> = new Map();
  /** 当前模型 */
  private currentModel: BaseChatModel | null = null;
  /** 当前模型键 */
  private currentModelKey: string = "";
  /** 单例实例 */
  private static instance: ModelManager | null = null;

  /**
   * 获取单例实例
   * @returns 模型管理器实例
   */
  public static getInstance(): ModelManager {
    if (!ModelManager.instance) {
      ModelManager.instance = new ModelManager();
    }
    return ModelManager.instance;
  }

  /**
   * 私有构造函数
   */
  private constructor() {}

  /**
   * 初始化模型
   * @param configs 模型配置数组
   * @param defaultModel 默认模型键 (provider:modelName)
   * @returns 是否初始化成功
   */
  public initialize(configs: ModelConfig[], defaultModel?: string): boolean {
    try {
      // 清空现有模型
      this.models.clear();
      this.currentModel = null;
      this.currentModelKey = "";

      // 记录初始化的模型数量
      let initializedModels = 0;
      const totalModels = configs.length;

      // 初始化所有配置的模型
      for (const config of configs) {
        const modelKey = `${config.provider}:${config.modelType}`;
        try {
          const model = ModelFactory.createModel(config);
          if (model) {
            this.models.set(modelKey, model);
            initializedModels++;

            // 如果是默认模型或第一个模型，设置为当前模型
            if ((defaultModel && modelKey === defaultModel) || (!defaultModel && !this.currentModel)) {
              this.currentModel = model;
              this.currentModelKey = modelKey;
            }
          }
        } catch (modelError) {
          // 单个模型初始化失败，记录错误但继续处理其他模型
          console.error(`初始化模型 ${modelKey} 失败:`, modelError);
        }
      }

      // 记录初始化结果
      if (initializedModels === 0) {
        console.error(`所有模型初始化失败。共尝试了 ${totalModels} 个模型。`);
      } else if (initializedModels < totalModels) {
        console.warn(`部分模型初始化失败。成功: ${initializedModels}/${totalModels}。`);
      }

      return this.models.size > 0;
    } catch (error) {
      console.error("初始化模型失败:", error);
      return false;
    }
  }

  /**
   * 获取所有可用模型的键
   * @returns 模型键数组
   */
  public getAvailableModels(): string[] {
    return Array.from(this.models.keys());
  }

  /**
   * 切换到指定的模型
   * @param modelKey 模型键 (provider:modelName) 或 模型类型
   * @returns 是否切换成功
   */
  public switchModel(modelKey: string): boolean {
    // 如果是模型类型，转换为模型键
    // 检查是否是有效的模型类型
    const modelTypes = Object.values(ModelType);
    const isModelType = modelTypes.includes(modelKey as ModelType);

    if (isModelType) {
      // 安全地访问 AI_MODELS
      // 将 AIModelType 转换为字符串索引
      const modelType = modelKey;
      // 使用类型断言来安全地访问 AI_MODELS
      const modelInfo = (AI_MODELS as any)[modelType];

      if (modelInfo && modelInfo.provider) {
        modelKey = `${modelInfo.provider}:${modelKey}`;
      }
    }

    const model = this.models.get(modelKey);
    if (model) {
      this.currentModel = model;
      this.currentModelKey = modelKey;
      return true;
    }
    return false;
  }

  /**
   * 获取当前模型键
   * @returns 当前模型键
   */
  public getCurrentModelKey(): string {
    return this.currentModelKey;
  }

  /**
   * 获取当前模型类型
   * @returns 当前模型类型
   */
  public getCurrentModelType(): string {
    const [_, modelName] = this.currentModelKey.split(":");
    return modelName;
  }

  /**
   * 获取当前模型
   * @returns 当前模型实例
   */
  public getCurrentModel(): BaseChatModel | null {
    return this.currentModel;
  }

  /**
   * 检查模型是否可用
   * @param modelKey 模型键
   * @returns 是否可用
   */
  public hasModel(modelKey: string): boolean {
    return this.models.has(modelKey);
  }

  /**
   * 发送消息到当前模型
   * @param messages 消息数组
   * @param options 请求选项
   * @returns 模型响应
   */
  public async sendMessage(
    messages: Array<[string, string]>,
    options?: {
      streaming?: boolean;
      onStreamingUpdate?: (content: string) => void;
    }
  ): Promise<AIMessage & { usage_metadata?: UsageMetadata }> {
    if (!this.currentModel) {
      console.error("没有设置当前模型", {
        currentModelKey: this.currentModelKey,
        modelsCount: this.models.size,
        availableModels: Array.from(this.models.keys()),
      });
      throw new Error("没有设置当前模型");
    }

    // 转换消息格式
    const formattedMessages = messages.map(([role, content]) => {
      if (role === "system") {
        return new SystemMessage({ content });
      } else if (role === "human" || role === "user") {
        return new HumanMessage({ content });
      } else if (role === "ai" || role === "assistant") {
        return new AIMessage({ content });
      } else {
        // 默认为人类消息
        return new HumanMessage({ content });
      }
    });

    try {
      // 如果是流式响应
      if (options?.streaming && options.onStreamingUpdate) {
        let fullContent = "";

        // 使用流式调用
        const stream = await this.currentModel.stream(formattedMessages);

        for await (const chunk of stream) {
          if (chunk.content) {
            fullContent += chunk.content;
            options.onStreamingUpdate(fullContent);
          }
        }

        // 创建带有完整内容的消息
        const message = new AIMessage({ content: fullContent });
        return message as AIMessage & { usage_metadata?: UsageMetadata };
      }

      // 非流式调用
      const response = await this.currentModel.invoke(formattedMessages);

      // 尝试获取使用情况
      let usage_metadata: UsageMetadata | undefined;

      // 定义模型响应类型
      type OpenAIUsage = {
        prompt_tokens?: number;
        completion_tokens?: number;
        total_tokens?: number;
      };

      type GeminiUsage = {
        inputTokens?: number;
        outputTokens?: number;
        totalTokens?: number;
      };

      type DeepSeekUsage = {
        input_tokens?: number;
        output_tokens?: number;
        total_tokens?: number;
      };

      // 将响应转换为包含可能的使用情况属性的类型
      const responseWithMetadata = response as AIMessage & {
        usage?: OpenAIUsage;
        usage_metadata?: GeminiUsage;
        tokenUsage?: DeepSeekUsage;
      };

      if (responseWithMetadata.usage || responseWithMetadata.usage_metadata || responseWithMetadata.tokenUsage) {
        // 处理 OpenAI 的使用情况
        if (responseWithMetadata.usage) {
          const usage = responseWithMetadata.usage;
          usage_metadata = {
            inputTokens: usage.prompt_tokens || 0,
            outputTokens: usage.completion_tokens || 0,
            totalTokens: usage.total_tokens || 0,
          };
        }
        // 处理 Gemini 的使用情况
        else if (responseWithMetadata.usage_metadata) {
          const usage = responseWithMetadata.usage_metadata;
          usage_metadata = {
            inputTokens: usage.inputTokens || 0,
            outputTokens: usage.outputTokens || 0,
            totalTokens: usage.totalTokens || 0,
          };
        }
        // 处理 DeepSeek 的使用情况
        else if (responseWithMetadata.tokenUsage) {
          const usage = responseWithMetadata.tokenUsage;
          usage_metadata = {
            inputTokens: usage.input_tokens || 0,
            outputTokens: usage.output_tokens || 0,
            totalTokens: usage.total_tokens || 0,
          };
        }
      }

      // 添加使用情况元数据
      return { ...response, usage_metadata } as AIMessage & { usage_metadata?: UsageMetadata };
    } catch (error) {
      console.error(`模型调用失败: ${error}`);
      throw error;
    }
  }

  // 已在上面定义了getCurrentModel方法

  /**
   * 重置模型管理器
   */
  public reset(): void {
    this.models.clear();
    this.currentModel = null;
    this.currentModelKey = "";
  }

  /**
   * 获取当前模型
   * @returns 当前模型实例
   */
  public getModel(): BaseChatModel {
    if (!this.currentModel) {
      throw new Error("模型未初始化");
    }
    return this.currentModel;
  }
}

export default ModelManager;
