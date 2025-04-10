/**
 * 模型工厂
 * 负责创建不同提供商的模型实例
 */

import { ChatDeepSeek } from "@langchain/deepseek";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatOpenAI } from "@langchain/openai";
import { BaseChatModel } from "@langchain/core/language_models/chat_models";
import { ModelConfig, ModelProvider } from "@core/ai/types";
import { DEFAULT_MODEL_PARAMS } from "../../constants";

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
      // 如果没有API密钥，则返回null
      if (!config.apiKey) {
        console.warn(`创建模型失败: 缺少API密钥 (${config.provider}:${config.modelName})`);
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
            model: config.modelName,
            apiKey: config.apiKey,
            ...(config.baseUrl && { baseUrl: config.baseUrl }),
            ...commonOptions,
          }) as unknown as BaseChatModel;

        case ModelProvider.GEMINI:
          return new ChatGoogleGenerativeAI({
            model: config.modelName,
            apiKey: config.apiKey,
            ...commonOptions,
          }) as unknown as BaseChatModel;

        case ModelProvider.OPENAI:
          return new ChatOpenAI({
            modelName: config.modelName,
            openAIApiKey: config.apiKey,
            ...(config.baseUrl && { configuration: { baseURL: config.baseUrl } }),
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
   * 创建模型配置数组
   * 根据环境和设置创建模型配置
   * @param apiKey API密钥
   * @param temperature 温度参数
   * @param maxTokens 最大token数
   * @returns 模型配置数组
   */
  public static createModelConfigs(apiKey?: string, temperature?: number, maxTokens?: number): ModelConfig[] {
    const configs: ModelConfig[] = [];

    // 获取环境变量（如果可用）
    const getEnvVar = (key: string): string => {
      // 检查是否在Node.js环境中（有process对象）
      if (typeof window === "undefined" && typeof process !== "undefined" && process.env) {
        return process.env[key] || "";
      }
      // 检查Vite环境变量
      if (typeof import.meta !== "undefined" && import.meta.env && import.meta.env[`VITE_${key}`]) {
        return import.meta.env[`VITE_${key}`];
      }
      // 浏览器环境中没有process.env
      return "";
    };

    // 首先添加DeepSeek模型（默认模型）
    const deepseekApiKey = apiKey || getEnvVar("DEEPSEEK_API_KEY") || "";
    if (deepseekApiKey) {
      configs.push({
        provider: ModelProvider.DEEPSEEK,
        modelName: "deepseek-chat",
        temperature: temperature ?? DEFAULT_MODEL_PARAMS.temperature,
        apiKey: deepseekApiKey,
        maxTokens: maxTokens || DEFAULT_MODEL_PARAMS.maxTokens,
      });
    }

    // 如果有API密钥，添加Gemini模型
    const geminiApiKey = apiKey || getEnvVar("GOOGLE_API_KEY") || "";
    if (geminiApiKey) {
      configs.push({
        provider: ModelProvider.GEMINI,
        modelName: "gemini-1.5-pro",
        temperature: temperature ?? DEFAULT_MODEL_PARAMS.temperature,
        apiKey: geminiApiKey,
        maxTokens: maxTokens || DEFAULT_MODEL_PARAMS.maxTokens,
      });
    }

    // 如果有API密钥，添加OpenAI模型
    const openaiApiKey = apiKey || getEnvVar("OPENAI_API_KEY") || "";
    if (openaiApiKey) {
      configs.push({
        provider: ModelProvider.OPENAI,
        modelName: "gpt-4o",
        temperature: temperature ?? DEFAULT_MODEL_PARAMS.temperature,
        apiKey: openaiApiKey,
        maxTokens: maxTokens || DEFAULT_MODEL_PARAMS.maxTokens,
      });
    }

    // 如果没有任何模型配置，添加一个默认的DeepSeek模型
    if (configs.length === 0) {
      configs.push({
        provider: ModelProvider.DEEPSEEK,
        modelName: "deepseek-chat",
        temperature: temperature ?? DEFAULT_MODEL_PARAMS.temperature,
        apiKey: apiKey || "", // 即使没有API密钥也添加默认模型
        maxTokens: maxTokens || DEFAULT_MODEL_PARAMS.maxTokens,
      });
    }

    return configs;
  }
}

export default ModelFactory;
