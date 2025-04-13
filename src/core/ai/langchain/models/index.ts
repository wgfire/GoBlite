/**
 * LangChain模型集成
 */
import { ChatOpenAI } from "@langchain/openai";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatDeepSeek } from "@langchain/deepseek";
import { BaseChatModel } from "@langchain/core/language_models/chat_models";
import { ModelType, ModelProvider, ModelConfig } from "../../types";

/**
 * 创建LangChain模型实例
 * @param config 模型配置
 * @returns LangChain模型实例
 */
export async function createModel(config: ModelConfig): Promise<BaseChatModel> {
  // 通用选项
  const commonOptions = {
    temperature: config.temperature ?? 0.7,
    maxTokens: config.maxTokens ?? 2000,
  };

  try {
    // 根据提供商创建不同的模型
    switch (config.provider) {
      case ModelProvider.OPENAI:
        if (!config.apiKey) {
          throw new Error("OpenAI API密钥未配置");
        }
        // 使用正确的 OpenAI 模型名称
        return new ChatOpenAI({
          model: "gpt-4o", // 使用固定的模型名称
          openAIApiKey: config.apiKey,
          ...(config.baseUrl && { configuration: { baseURL: config.baseUrl } }),
          ...commonOptions,
        });

      case ModelProvider.GEMINI:
        if (!config.apiKey) {
          throw new Error("Gemini API密钥未配置");
        }
        // 使用正确的 Gemini 模型名称
        // 注意: ChatGoogleGenerativeAI 需要的是原始模型名称，不是枚举值
        return new ChatGoogleGenerativeAI({
          model: "gemini-2.0-flash", // 使用固定的模型名称
          apiKey: config.apiKey,
          ...commonOptions,
        });

      case ModelProvider.DEEPSEEK:
        if (!config.apiKey) {
          throw new Error("DeepSeek API密钥未配置");
        }
        // 使用正确的 DeepSeek 模型名称
        return new ChatDeepSeek({
          model: "deepseek-chat", // 使用固定的模型名称
          apiKey: config.apiKey,
          ...(config.baseUrl && { baseUrl: config.baseUrl }),
          ...commonOptions,
        });

      default:
        throw new Error(`不支持的模型提供商: ${config.provider}`);
    }
  } catch (error) {
    console.error("创建模型实例失败:", error);
    throw error;
  }
}

/**
 * 获取模型提供商
 * @param modelType 模型类型
 * @returns 模型提供商
 */
export function getModelProvider(modelType: ModelType): ModelProvider {
  if (!modelType) {
    // 默认使用 OpenAI
    return ModelProvider.OPENAI;
  }

  if (modelType.startsWith("gpt")) {
    return ModelProvider.OPENAI;
  } else if (modelType.startsWith("gemini")) {
    return ModelProvider.GEMINI;
  } else if (modelType.startsWith("deepseek")) {
    return ModelProvider.DEEPSEEK;
  }
  throw new Error(`无法确定模型类型 ${modelType} 的提供商`);
}
