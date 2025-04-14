/**
 * LangChain模型管理钩子
 */
import { useState, useCallback, useEffect, useRef } from "react";
import { useAtom } from "jotai";
import { BaseChatModel } from "@langchain/core/language_models/chat_models";
import { serviceStatusAtom, errorMessageAtom, selectedModelTypeAtom, apiKeysAtom, modelSettingsAtom } from "../atoms/modelAtoms";
import { ModelType, ModelProvider, ServiceStatus } from "../types";
import { ModelManager, ModelFactory } from "../langchain/models";
import { DEFAULT_MODEL_CONFIG, AI_MODELS } from "../constants";

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

  // 模型管理器实例
  const modelManagerRef = useRef<ModelManager | null>(null);

  // 初始化模型管理器
  useEffect(() => {
    modelManagerRef.current = ModelManager.getInstance();
  }, []);

  /**
   * 获取当前模型的API密钥
   */
  const getCurrentApiKey = useCallback(() => {
    const provider = modelManagerRef.current?.getModelProvider(selectedModelType) as ModelProvider;
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

      // 首次加载时，如果没有任何API密钥配置，确保默认模型的API密钥被设置
      const hasAnyApiKey = Object.values(apiKeys).some((key) => key && key.trim() !== "");
      if (!hasAnyApiKey) {
        // 设置默认模型的API密钥
        setApiKey(DEFAULT_MODEL_CONFIG.provider, DEFAULT_MODEL_CONFIG.apiKey!);
        console.log("已设置默认API密钥到浏览器缓存", DEFAULT_MODEL_CONFIG.provider, DEFAULT_MODEL_CONFIG.apiKey);
      }

      // 检查所有在AI_MODELS中配置了apiKey的模型，确保它们的API密钥被设置到本地存储中
      Object.entries(AI_MODELS).forEach(([modelType, config]) => {
        if (config.apiKey && config.apiKey.trim() !== "" && (!apiKeys[config.provider] || apiKeys[config.provider].trim() === "")) {
          setApiKey(config.provider, config.apiKey);
          console.log(`已将${modelType}的API密钥从constants.ts设置到浏览器缓存`, config.provider, config.apiKey);
        }
      });

      // 使用ModelFactory创建模型配置
      const configs = ModelFactory.createModelConfigs({
        apiKeys,
        temperature: modelSettings.temperature,
        maxTokens: modelSettings.maxTokens,
        useDefaultConfig: true,
      });

      // 如果没有可用的模型配置，抛出错误
      if (configs.length === 0) {
        throw new Error("没有可用的模型配置，请配置API密钥");
      }

      // 检查是否使用了默认配置
      const defaultConfigUsed = configs.some((config) => config.provider === DEFAULT_MODEL_CONFIG.provider && config.apiKey === DEFAULT_MODEL_CONFIG.apiKey);

      // 如果使用了默认配置，确保API密钥已更新到持久化存储
      if (defaultConfigUsed && !apiKeys[DEFAULT_MODEL_CONFIG.provider]) {
        setApiKey(DEFAULT_MODEL_CONFIG.provider, DEFAULT_MODEL_CONFIG.apiKey!);
      }

      // 使用模型管理器初始化模型
      if (modelManagerRef.current) {
        // 找到选中模型类型的配置
        const selectedConfig = configs.find((config) => config.modelType === selectedModelType);
        const defaultModelKey = selectedConfig ? `${selectedConfig.provider}:${selectedConfig.modelType}` : `${configs[0].provider}:${configs[0].modelType}`;

        // 初始化模型管理器
        const success = modelManagerRef.current.initialize(configs, defaultModelKey);

        if (success) {
          // 获取初始化后的模型
          const newModel = modelManagerRef.current.getCurrentModel();
          if (newModel) {
            setModel(newModel);
            setServiceStatus(ServiceStatus.READY);
            return newModel;
          }
        }

        throw new Error("模型初始化失败");
      } else {
        // 如果模型管理器未初始化，使用ModelFactory直接创建模型
        // 选择选中的模型类型或默认第一个
        const selectedConfig = configs.find((config) => config.modelType === selectedModelType) || configs[0];
        const newModel = ModelFactory.createModel(selectedConfig);

        if (newModel) {
          setModel(newModel);
          setServiceStatus(ServiceStatus.READY);
          return newModel;
        }

        throw new Error("模型初始化失败");
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "初始化模型失败";
      setErrorMessage(errorMsg);
      setServiceStatus(ServiceStatus.ERROR);
      return null;
    }
  }, [selectedModelType, apiKeys, modelSettings, setServiceStatus, setErrorMessage, setApiKey]);

  /**
   * 重置模型
   */
  const resetModel = useCallback(() => {
    setModel(null);
    setServiceStatus(ServiceStatus.UNINITIALIZED);
    setErrorMessage(null);

    // 重置模型管理器
    if (modelManagerRef.current) {
      modelManagerRef.current.reset();
    }
  }, [setServiceStatus, setErrorMessage]);

  /**
   * 切换模型类型
   * @param modelType 新的模型类型
   */
  const switchModelType = useCallback(
    async (modelType: ModelType) => {
      try {
        // 检查是否有对应的API密钥
        const provider = AI_MODELS[modelType]?.provider;
        if (!provider) {
          throw new Error(`不支持的模型类型: ${modelType}`);
        }

        let apiKey = apiKeys[provider];
        const isDefaultModel = provider === DEFAULT_MODEL_CONFIG.provider && modelType === DEFAULT_MODEL_CONFIG.modelType;

        // 检查AI_MODELS中是否有该模型的API密钥
        const modelConfig = AI_MODELS[modelType];
        const hasConfigApiKey = modelConfig && modelConfig.apiKey && modelConfig.apiKey.trim() !== "";

        // 如果本地存储中没有API密钥，但constants.ts中有，则使用constants.ts中的密钥
        if (!apiKey && hasConfigApiKey) {
          apiKey = modelConfig.apiKey!;
          setApiKey(provider, apiKey);
          console.log(`已将${modelType}的API密钥从constants.ts设置到浏览器缓存`, provider, apiKey);
        }

        // 如果没有API密钥且不是默认模型，则无法切换
        if (!apiKey && !isDefaultModel) {
          throw new Error(`无法切换到${modelType}，请先配置${provider}的API密钥`);
        }

        // 更新选中的模型类型
        setSelectedModelType(modelType);

        // 如果是默认模型且没有API密钥，使用默认API密钥
        if (isDefaultModel && !apiKey) {
          setApiKey(provider, DEFAULT_MODEL_CONFIG.apiKey!);
        }

        // 如果模型管理器实例已初始化，尝试切换模型
        if (modelManagerRef.current && model) {
          const success = modelManagerRef.current.switchModel(modelType);

          if (success) {
            // 获取新的模型实例
            const newModel = modelManagerRef.current.getCurrentModel();
            if (newModel) {
              setModel(newModel);
            }
          } else {
            // 如果切换失败，可能需要重新初始化
            await initializeModel();
          }
        }

        return true;
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : "切换模型失败";
        setErrorMessage(errorMsg);
        return false;
      }
    },
    [setSelectedModelType, setErrorMessage, model, apiKeys, setApiKey, initializeModel]
  );

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
