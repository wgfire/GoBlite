/**
 * 模型相关的原子状态
 */
import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { ModelType, ModelProvider, ServiceStatus } from "../types";
import { AI_MODELS } from "../constants";

// 默认模型配置
const DEFAULT_TEMPERATURE = 0.7;
const DEFAULT_MAX_TOKENS = 2000;

// 服务状态原子 - 非持久化，每次初始化
export const serviceStatusAtom = atom<ServiceStatus>(ServiceStatus.UNINITIALIZED);

// 错误信息原子 - 非持久化
export const errorMessageAtom = atom<string | null>(null);

// 选中的模型类型 - 持久化
export const selectedModelTypeAtom = atomWithStorage<ModelType>("ai_selected_model_type", ModelType.GEMINI_PRO);

// API密钥映射 - 持久化，按提供商存储
export const apiKeysAtom = atomWithStorage<Record<ModelProvider, string>>("ai_api_keys", {
  [ModelProvider.OPENAI]: "",
  [ModelProvider.GEMINI]: "",
  [ModelProvider.DEEPSEEK]: "",
});

// 模型设置 - 持久化
export const modelSettingsAtom = atomWithStorage("ai_model_settings", {
  temperature: DEFAULT_TEMPERATURE,
  maxTokens: DEFAULT_MAX_TOKENS,
});

// 可用模型列表 - 根据API密钥动态计算
export const availableModelsAtom = atom<ModelType[]>((get) => {
  const apiKeys = get(apiKeysAtom);

  console.log("当前存储的API密钥:", apiKeys);
  console.log("AI_MODELS中的配置:", AI_MODELS);

  // 过滤出有API密钥的模型
  const availableModels = Object.entries(AI_MODELS)
    .filter(([, config]) => {
      // 如果模型有默认API密钥，或者用户配置了API密钥，则可用
      const hasConfigApiKey = config.apiKey && config.apiKey.trim() !== "";
      const hasStoredApiKey = apiKeys[config.provider] && apiKeys[config.provider].trim() !== "";
      const isAvailable = hasConfigApiKey || hasStoredApiKey;
      return isAvailable;
    })
    .map(([modelType]) => modelType as ModelType);

  console.log("可用模型列表:", availableModels);
  return availableModels;
});

// 是否正在发送消息
export const isSendingAtom = atom<boolean>(false);

// 是否正在流式接收
export const isStreamingAtom = atom<boolean>(false);

// 流式内容
export const streamContentAtom = atom<string>("");
