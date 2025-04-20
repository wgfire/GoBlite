/**
 * 模型相关的原子状态
 */
import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { ModelProvider, ServiceStatus, ModelConfig } from "../types";
import { STORAGE_KEYS } from "../constants";

// 默认模型配置
const DEFAULT_TEMPERATURE = 0.7;
const DEFAULT_MAX_TOKENS = 20000;

// 服务状态原子 - 非持久化，每次初始化
export const serviceStatusAtom = atom<ServiceStatus>(ServiceStatus.UNINITIALIZED);

// 错误信息原子 - 非持久化
export const errorMessageAtom = atom<string | null>(null);

// 已移除选中的模型类型原子，现在使用currentModelConfigAtom

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

// 已移除可用模型列表原子，现在通过apiKeys和AI_MODELS动态计算

// 当前模型配置 - 持久化存储
export const currentModelConfigAtom = atomWithStorage<ModelConfig | null>(STORAGE_KEYS.CURRENT_MODEL, null);

// 已移除计算可用模型列表原子，现在在useModelConfig中直接计算

// 是否正在发送消息
export const isSendingAtom = atom<boolean>(false);

// 是否正在流式接收
export const isStreamingAtom = atom<boolean>(false);

// 流式内容
export const streamContentAtom = atom<string>("");
