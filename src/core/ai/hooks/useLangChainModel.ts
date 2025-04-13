/**
 * LangChain模型管理钩子
 */
import { useState, useCallback } from "react";
import { useAtom } from "jotai";
import { BaseChatModel } from "@langchain/core/language_models/chat_models";
import { serviceStatusAtom, errorMessageAtom, selectedModelTypeAtom, apiKeysAtom, modelSettingsAtom } from "../atoms/modelAtoms";
import { ModelType, ModelProvider, ServiceStatus, ModelConfig } from "../types";
import { createModel, getModelProvider } from "../langchain/models";

/**
 * LangChain模型管理钩子
 * 提供模型初始化、切换和配置功能
 */
export function useLangChainModel() {
  // 状态原子
  const [serviceStatus, setServiceStatus] = useAtom(serviceStatusAtom);
  const [errorMessage, setErrorMessage] = useAtom(errorMessageAtom);
  const [selectedModelType, setSelectedModelType] = useAtom(selectedModelTypeAtom);
  const [apiKeys, setApiKeys] = useAtom(apiKeysAtom);
  const [modelSettings, setModelSettings] = useAtom(modelSettingsAtom);

  // 本地状态
  const [model, setModel] = useState<BaseChatModel | null>(null);

  /**
   * 获取当前模型的API密钥
   */
  const getCurrentApiKey = useCallback(() => {
    const provider = getModelProvider(selectedModelType);
    return apiKeys[provider] || "";
  }, [selectedModelType, apiKeys]);

  /**
   * 设置API密钥
   * @param provider 提供商
   * @param apiKey API密钥
   */
  const setApiKey = useCallback(
    (provider: ModelProvider, apiKey: string) => {
      setApiKeys((prev) => ({
        ...prev,
        [provider]: apiKey,
      }));
    },
    [setApiKeys]
  );

  /**
   * 更新模型设置
   * @param settings 新的设置
   */
  const updateModelSettings = useCallback(
    (settings: Partial<typeof modelSettings>) => {
      setModelSettings((prev) => ({
        ...prev,
        ...settings,
      }));
    },
    [setModelSettings]
  );

  /**
   * 切换模型类型
   * @param modelType 新的模型类型
   */
  const switchModelType = useCallback(
    async (modelType: ModelType) => {
      try {
        setSelectedModelType(modelType);

        // 如果需要立即初始化新模型，可以在这里调用initializeModel
        return true;
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : "切换模型失败";
        setErrorMessage(errorMsg);
        return false;
      }
    },
    [setSelectedModelType, setErrorMessage]
  );

  /**
   * 初始化模型
   */
  const initializeModel = useCallback(async () => {
    try {
      setServiceStatus(ServiceStatus.INITIALIZING);
      setErrorMessage(null);

      // 确保 selectedModelType 不为空
      if (!selectedModelType) {
        throw new Error("未选择模型类型");
      }

      const provider = getModelProvider(selectedModelType);
      const apiKey = apiKeys[provider];

      if (!apiKey) {
        throw new Error(`未配置${provider}的API密钥`);
      }

      const modelConfig: ModelConfig = {
        modelType: selectedModelType,
        provider,
        apiKey,
        temperature: modelSettings.temperature,
        maxTokens: modelSettings.maxTokens,
      };

      const newModel = await createModel(modelConfig);
      setModel(newModel);
      setServiceStatus(ServiceStatus.READY);

      return newModel;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "初始化模型失败";
      setErrorMessage(errorMsg);
      setServiceStatus(ServiceStatus.ERROR);
      return null;
    }
  }, [selectedModelType, apiKeys, modelSettings, setServiceStatus, setErrorMessage]);

  /**
   * 重置模型
   */
  const resetModel = useCallback(() => {
    setModel(null);
    setServiceStatus(ServiceStatus.UNINITIALIZED);
    setErrorMessage(null);
  }, [setServiceStatus, setErrorMessage]);

  return {
    // 状态
    serviceStatus,
    errorMessage,
    selectedModelType,
    apiKeys,
    modelSettings,
    model,

    // 方法
    getCurrentApiKey,
    setApiKey,
    updateModelSettings,
    switchModelType,
    initializeModel,
    resetModel,
  };
}
