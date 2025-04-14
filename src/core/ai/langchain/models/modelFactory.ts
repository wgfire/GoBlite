/**
 * 模型工厂
 * 负责创建不同提供商的模型实例
 */

import { ChatDeepSeek } from "@langchain/deepseek";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatOpenAI } from "@langchain/openai";
import { BaseChatModel } from "@langchain/core/language_models/chat_models";
import { ModelConfig, ModelProvider, ModelType } from "../../types";
import { DEFAULT_MODEL_PARAMS, DEFAULT_MODEL_CONFIG, AI_MODELS } from "../../constants";

/**
 * 模型工厂类
 * 负责创建不同提供商的模型实例
 */
export class ModelFactory {
  /**
   * 创建模型实例
   * @param config 模型配置
   * @returns 模型实例或null
   */
  public static createModel(config: ModelConfig): BaseChatModel | null {
    try {
      // 如果没有API密钥，则返回null，但记录更详细的警告
      if (!config.apiKey) {
        console.warn(`创建模型失败: 缺少API密钥 (${config.provider}:${config.modelType})。请在设置中配置API密钥。`);
        return null;
      }

      // 通用选项
      const commonOptions = {
        temperature: config.temperature ?? DEFAULT_MODEL_PARAMS.temperature,
        maxTokens: config.maxTokens ?? DEFAULT_MODEL_PARAMS.maxTokens,
      };

      // 根据提供商创建不同的模型
      switch (config.provider) {
        case ModelProvider.DEEPSEEK:
          return new ChatDeepSeek({
            model: config.modelType,
            apiKey: config.apiKey,
            ...(config.baseUrl && { baseUrl: config.baseUrl }),
            ...commonOptions,
          });

        case ModelProvider.GEMINI:
          return new ChatGoogleGenerativeAI({
            model: config.modelType,
            apiKey: config.apiKey,
            ...commonOptions,
          });

        case ModelProvider.OPENAI:
          return new ChatOpenAI({
            modelName: config.modelType,
            openAIApiKey: config.apiKey,
            ...(config.baseUrl && { configuration: { baseURL: config.baseUrl } }),
            temperature: config.temperature,
            maxTokens: config.maxTokens,
          });

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
   * 创建模型配置数组
   * 根据可用的API密钥创建模型配置
   * @param options 配置选项
   * @returns 模型配置数组
   */
  public static createModelConfigs(options: {
    apiKeys: Record<ModelProvider, string>;
    temperature?: number;
    maxTokens?: number;
    useDefaultConfig?: boolean;
  }): ModelConfig[] {
    const configs: ModelConfig[] = [];
    const { apiKeys, temperature, maxTokens, useDefaultConfig = true } = options;

    // 遍历AI_MODELS中的所有模型
    Object.values(ModelType).forEach((modelType) => {
      // 获取模型信息
      const modelInfo = AI_MODELS[modelType];
      if (!modelInfo) return;

      const provider = modelInfo.provider;
      let apiKey = apiKeys[provider];

      // 如果没有API密钥但需要使用默认配置，并且当前模型是默认模型
      if (!apiKey && useDefaultConfig && provider === DEFAULT_MODEL_CONFIG.provider && modelType === DEFAULT_MODEL_CONFIG.modelType) {
        apiKey = DEFAULT_MODEL_CONFIG.apiKey!;
      }

      // 如果有API密钥，创建配置
      if (apiKey) {
        configs.push({
          provider,
          modelType,
          apiKey,
          temperature: temperature ?? DEFAULT_MODEL_PARAMS.temperature,
          maxTokens: maxTokens ?? DEFAULT_MODEL_PARAMS.maxTokens,
        });
      }
    });

    // 如果没有任何模型配置但需要使用默认配置
    if (configs.length === 0 && useDefaultConfig) {
      console.warn("没有找到有效的API密钥，将使用默认模型。请在设置中配置API密钥以启用完整功能。");

      // 添加默认模型配置
      configs.push({
        provider: DEFAULT_MODEL_CONFIG.provider,
        modelType: DEFAULT_MODEL_CONFIG.modelType,
        apiKey: DEFAULT_MODEL_CONFIG.apiKey,
        temperature: temperature ?? DEFAULT_MODEL_CONFIG.temperature,
        maxTokens: maxTokens ?? DEFAULT_MODEL_CONFIG.maxTokens,
      });
    }

    return configs;
  }
}

export default ModelFactory;
