import { ChatDeepSeek } from "@langchain/deepseek";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatOpenAI } from "@langchain/openai";
import { BaseChatModel } from "@langchain/core/language_models/chat_models";
import { ModelConfig, ModelProvider } from "../types";
import { DEFAULT_MODEL_PARAMS } from "../constants";

/**
 * 创建模型实例
 */
export async function createModelInstance(config: ModelConfig): Promise<BaseChatModel | null> {
  try {
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
          ...commonOptions,
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
