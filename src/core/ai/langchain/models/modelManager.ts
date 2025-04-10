/**
 * 模型管理器
 * 统一管理不同AI模型提供商的模型
 */

import { BaseChatModel } from "@langchain/core/language_models/chat_models";
import { AIMessage, HumanMessage, SystemMessage } from "@langchain/core/messages";
import { ModelFactory } from "./modelFactory";
import { ModelConfig, MessageRole, UsageMetadata, AIModelType, ModelProvider } from "../../types";
import { MODEL_PROVIDER_MAP } from "../../constants";

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

      // 初始化所有配置的模型
      for (const config of configs) {
        const modelKey = `${config.provider}:${config.modelName}`;
        const model = ModelFactory.createModel(config);
        if (model) {
          this.models.set(modelKey, model);

          // 如果是默认模型或第一个模型，设置为当前模型
          if ((defaultModel && modelKey === defaultModel) || (!defaultModel && !this.currentModel)) {
            this.currentModel = model;
            this.currentModelKey = modelKey;
          }
        }
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
    if (Object.values(AIModelType).includes(modelKey as AIModelType)) {
      const provider = MODEL_PROVIDER_MAP[modelKey as AIModelType];
      modelKey = `${provider}:${modelKey}`;
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
    messages: Array<[MessageRole, string]>,
    options?: {
      streaming?: boolean;
      onStreamingUpdate?: (content: string) => void;
    }
  ): Promise<AIMessage & { usage_metadata?: UsageMetadata }> {
    if (!this.currentModel) {
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

      // @ts-expect-error - 不同模型可能有不同的属性
      if (response.usage || response.usage_metadata || response.tokenUsage) {
        // @ts-expect-error - 不同模型可能有不同的属性
        const usage = response.usage || response.usage_metadata || response.tokenUsage;

        usage_metadata = {
          // 尝试不同的属性名称
          inputTokens: usage.prompt_tokens || usage.inputTokens || usage.input_tokens,
          outputTokens: usage.completion_tokens || usage.outputTokens || usage.output_tokens,
          totalTokens: usage.total_tokens || usage.totalTokens,
        };
      }

      // 添加使用情况元数据
      return { ...response, usage_metadata } as AIMessage & { usage_metadata?: UsageMetadata };
    } catch (error) {
      console.error(`模型调用失败: ${error}`);
      throw error;
    }
  }

  /**
   * 获取当前模型实例
   * @returns 当前模型实例
   */
  public getCurrentModel(): BaseChatModel | null {
    return this.currentModel;
  }

  /**
   * 重置模型管理器
   */
  public reset(): void {
    this.models.clear();
    this.currentModel = null;
    this.currentModelKey = "";
  }
}

export default ModelManager;
