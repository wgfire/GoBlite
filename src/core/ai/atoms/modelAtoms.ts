/**
 * 模型相关的原子状态
 */
import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { ModelType, ModelProvider, ServiceStatus } from "../types";

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

// 是否正在发送消息
export const isSendingAtom = atom<boolean>(false);

// 是否正在流式接收
export const isStreamingAtom = atom<boolean>(false);

// 流式内容
export const streamContentAtom = atom<string>("");
