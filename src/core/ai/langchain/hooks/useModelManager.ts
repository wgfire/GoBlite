/**
 * 模型管理钩子
 * 提供模型初始化、切换和管理功能
 */

import { useState, useEffect } from "react";
import useMemoizedFn from "@/hooks/useMemoizedFn";
import { ModelManager } from "../models/modelManager";
import { ModelFactory } from "../models/modelFactory";
import { AIModelType, AIServiceStatus } from "../../types";
import { ERROR_MESSAGES } from "../../constants";

/**
 * 模型管理钩子选项
 */
export interface UseModelManagerOptions {
  /** 是否自动初始化 */
  autoInit?: boolean;
  /** API密钥 */
  apiKey?: string;
  /** 默认模型类型 */
  defaultModelType?: AIModelType;
  /** 最大token数 */
  maxTokens?: number;
  /** 温度参数 (0-1) */
  temperature?: number;
}

/**
 * 模型管理钩子
 * 提供模型初始化、切换和管理功能
 */
export const useModelManager = (options: UseModelManagerOptions = {}) => {
  // 获取模型管理器实例
  const modelManager = ModelManager.getInstance();

  // 状态
  const [status, setStatus] = useState<AIServiceStatus>(AIServiceStatus.UNINITIALIZED);
  const [error, setError] = useState<string | null>(null);
  const [currentModelType, setCurrentModelType] = useState<AIModelType>(options.defaultModelType || AIModelType.DEEPSEEK);
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [currentModel, setCurrentModel] = useState<string>("");

  /**
   * 初始化模型管理器
   * @param apiKey API密钥（可选，如果不提供则使用选项中的密钥）
   * @returns 是否初始化成功
   */
  const initialize = useMemoizedFn(async (apiKey?: string): Promise<boolean> => {
    try {
      setStatus(AIServiceStatus.INITIALIZING);

      // 创建模型配置
      const modelConfigs = ModelFactory.createModelConfigs(apiKey || options.apiKey, options.temperature, options.maxTokens);

      // 检查是否有有效的模型配置
      if (modelConfigs.length === 0) {
        console.warn("没有找到有效的模型配置。请检查API密钥设置。");
        // 即使没有有效配置，ModelFactory也会返回一个默认的模拟模型
      }

      // 初始化模型管理器
      const provider = currentModelType.includes("deepseek") ? "deepseek" : currentModelType.includes("gemini") ? "gemini" : "openai";
      const defaultModel = `${provider}:${currentModelType}`;
      const modelInitSuccess = modelManager.initialize(modelConfigs, defaultModel);

      if (!modelInitSuccess) {
        // 将错误设置为警告，而不是抛出异常，允许应用继续运行
        console.warn("初始化模型失败，将使用有限功能模式。请在设置中配置API密钥。");
        setError("初始化模型失败，将使用有限功能模式。请在设置中配置API密钥。");
        // 即使初始化失败，也将状态设置为就绪，但保留错误信息
        setStatus(AIServiceStatus.READY);
        return true;
      }

      // 更新状态
      setAvailableModels(modelManager.getAvailableModels());
      setCurrentModel(modelManager.getCurrentModelKey());

      setStatus(AIServiceStatus.READY);
      setError(null);
      return true;
    } catch (err) {
      setStatus(AIServiceStatus.ERROR);
      const errorMessage = err instanceof Error ? err.message : ERROR_MESSAGES.INITIALIZATION_FAILED;
      setError(errorMessage);
      return false;
    }
  });

  /**
   * 切换模型
   * @param modelType 模型类型
   * @returns 是否切换成功
   */
  const switchModel = useMemoizedFn((modelType: AIModelType): boolean => {
    try {
      const success = modelManager.switchModel(modelType);
      if (success) {
        setCurrentModelType(modelType);
        setCurrentModel(modelManager.getCurrentModelKey());
        return true;
      }
      return false;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "切换模型失败";
      setError(errorMessage);
      return false;
    }
  });

  /**
   * 获取当前模型类型
   * @returns 当前模型类型
   */
  const getCurrentModelType = useMemoizedFn((): AIModelType => {
    return currentModelType as AIModelType;
  });

  /**
   * 获取可用模型列表
   * @returns 可用模型列表
   */
  const getAvailableModels = useMemoizedFn((): string[] => {
    return availableModels;
  });

  /**
   * 重置模型管理器
   */
  const reset = useMemoizedFn(() => {
    modelManager.reset();
    setStatus(AIServiceStatus.UNINITIALIZED);
    setError(null);
    setAvailableModels([]);
    setCurrentModel("");
  });

  // 自动初始化
  useEffect(() => {
    if (options.autoInit) {
      initialize();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options.autoInit]);

  return {
    // 状态
    status,
    error,
    currentModelType,
    availableModels,
    currentModel,

    // 方法
    initialize,
    switchModel,
    getCurrentModelType,
    getAvailableModels,
    reset,

    // 直接访问模型管理器（用于高级操作）
    modelManager,
  };
};

export default useModelManager;
