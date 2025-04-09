/**
 * LangChain Model Switcher
 * 提供在不同AI模型之间切换的能力
 */

import { ChatDeepSeek } from "@langchain/deepseek";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatOpenAI } from "@langchain/openai";
import { BaseChatModel } from "@langchain/core/language_models/chat_models";
import { AIMessage, HumanMessage, SystemMessage } from "@langchain/core/messages";

export enum ModelProvider {
  DEEPSEEK = "deepseek",
  GEMINI = "gemini",
  OPENAI = "openai",
}

export interface ModelConfig {
  provider: ModelProvider;
  modelName: string;
  temperature?: number;
  apiKey?: string;
  maxTokens?: number;
}

/**
 * 模型切换器类
 * 允许在不同的AI模型之间无缝切换
 */
export class ModelSwitcher {
  private models: Map<string, BaseChatModel> = new Map();
  private currentModel: BaseChatModel | null = null;
  private currentModelKey: string = "";

  /**
   * 初始化模型切换器
   * @param configs 模型配置数组
   * @param defaultModel 默认模型的键 (provider:modelName)
   */
  constructor(configs: ModelConfig[], defaultModel?: string) {
    // 初始化所有配置的模型
    for (const config of configs) {
      const modelKey = `${config.provider}:${config.modelName}`;
      const model = this.createModel(config);
      if (model) {
        this.models.set(modelKey, model);

        // 如果是默认模型或第一个模型，设置为当前模型
        if ((defaultModel && modelKey === defaultModel) || (!defaultModel && !this.currentModel)) {
          this.currentModel = model;
          this.currentModelKey = modelKey;
        }
      }
    }
  }

  /**
   * 根据配置创建模型实例
   * @param config 模型配置
   * @returns 模型实例
   */
  private createModel(config: ModelConfig): BaseChatModel | null {
    try {
      const commonOptions = {
        temperature: config.temperature ?? 0,
        maxTokens: config.maxTokens,
      };

      switch (config.provider) {
        case ModelProvider.DEEPSEEK:
          // 使用类型断言解决类型问题
          return new ChatDeepSeek({
            model: config.modelName,
            apiKey: config.apiKey,
            ...commonOptions,
          }) as unknown as BaseChatModel;

        case ModelProvider.GEMINI:
          // 使用类型断言解决类型问题
          return new ChatGoogleGenerativeAI({
            model: config.modelName,
            apiKey: config.apiKey,
            ...commonOptions,
          }) as unknown as BaseChatModel;

        case ModelProvider.OPENAI:
          // 使用类型断言解决类型问题
          return new ChatOpenAI({
            modelName: config.modelName,
            openAIApiKey: config.apiKey,
            temperature: config.temperature,
            maxTokens: config.maxTokens,
          }) as unknown as BaseChatModel;

        default:
          console.error(`不支持的模型提供商: ${config.provider}`);
          return null;
      }
    } catch (error) {
      console.error(`创建模型失败: ${error}`);
      return null;
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
   * @param modelKey 模型键 (provider:modelName)
   * @returns 是否切换成功
   */
  public switchModel(modelKey: string): boolean {
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
  ): Promise<AIMessage & { usage_metadata?: { input_tokens?: number; output_tokens?: number; total_tokens?: number } }> {
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
        return message as AIMessage & { usage_metadata?: { input_tokens?: number; output_tokens?: number; total_tokens?: number } };
      }

      // 非流式调用
      const response = await this.currentModel.invoke(formattedMessages);

      // 尝试获取使用情况
      let usage_metadata;

      // @ts-expect-error - 不同模型可能有不同的属性
      if (response.usage || response.usage_metadata || response.tokenUsage) {
        // @ts-expect-error - 不同模型可能有不同的属性
        const usage = response.usage || response.usage_metadata || response.tokenUsage;

        usage_metadata = {
          // 尝试不同的属性名称
          input_tokens: usage.prompt_tokens || usage.inputTokens || usage.input_tokens,
          output_tokens: usage.completion_tokens || usage.outputTokens || usage.output_tokens,
          total_tokens: usage.total_tokens || usage.totalTokens,
        };
      }

      // 添加使用情况元数据
      return { ...response, usage_metadata } as AIMessage & { usage_metadata?: { input_tokens?: number; output_tokens?: number; total_tokens?: number } };
    } catch (error) {
      console.error(`模型调用失败: ${error}`);
      throw error;
    }
  }
}
