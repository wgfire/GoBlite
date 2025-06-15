/**
 * 简化的模型配置钩子
 * 提供模型配置的管理和持久化功能
 */
import { useCallback } from "react";
import { useAtom } from "jotai";
import { ChatDeepSeek } from "@langchain/deepseek";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatOpenAI } from "@langchain/openai";
import { BaseChatModel } from "@langchain/core/language_models/chat_models";
import { apiKeysAtom, modelSettingsAtom, currentModelConfigAtom, serviceStatusAtom, errorMessageAtom } from "../atoms/modelAtoms";
import { ModelType, ModelProvider, ServiceStatus, ModelConfig } from "../types";
import { DEFAULT_MODEL_CONFIG, AI_MODELS, DEFAULT_MODEL_PARAMS, STORAGE_KEYS } from "../constants";
import useMemoizedFn from "@/hooks/useMemoizedFn";

/**
 * 简化的模型配置钩子
 * 提供模型配置的管理和持久化功能
 */
export function useModelConfig() {
  // 状态原子
  const [apiKeys, setApiKeys] = useAtom(apiKeysAtom);
  const [modelSettings, setModelSettings] = useAtom(modelSettingsAtom);
  const [currentModelConfig, setCurrentModelConfig] = useAtom(currentModelConfigAtom);
  const [serviceStatus, setServiceStatus] = useAtom(serviceStatusAtom);
  const [errorMessage, setErrorMessage] = useAtom(errorMessageAtom);

  /**
   * 设置API密钥
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
   * 创建模型实例
   */
  const createModel = useCallback((config: ModelConfig): BaseChatModel | null => {
    try {
      if (!config.apiKey) {
        console.warn(`创建模型失败: 缺少API密钥 (${config.provider}:${config.modelType})`);
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
            ...commonOptions,
          });

        default:
          console.error(`不支持的模型提供商: ${config.provider}`);
          return null;
      }
    } catch (error) {
      console.error(`创建模型失败: ${error}`);
      return null;
    }
  }, []);

  /**
   * 初始化模型配置
   * 简化版：优先使用本地存储的配置，否则使用默认配置
   *
   * 简化思路：
   * 1. 优先从本地存储读取配置 - 满足需求2：用户切换模型后下次进来优先使用
   * 2. 如果本地没有配置，检查是否有API密钥 - 满足需求3：用户在APIKeyConfig中设置的密钥优先使用
   * 3. 如果没有任何配置，使用默认配置 - 满足需求1：首次进入使用默认配置
   *
   */
  const initializeModelConfig = useMemoizedFn(async () => {
    try {
      setServiceStatus(ServiceStatus.INITIALIZING);
      setErrorMessage(null);

      // 步骤1: 尝试从本地存储获取配置
      const savedModelConfig = localStorage.getItem(STORAGE_KEYS.CURRENT_MODEL);
      let configToUse: ModelConfig | null = null;

      if (savedModelConfig) {
        try {
          configToUse = JSON.parse(savedModelConfig);
          console.log("使用本地存储的模型配置");
        } catch (_) {
          // 解析失败时不使用该配置
          console.error("解析本地存储的模型配置失败", _);
        }
      }

      // 步骤2: 如果本地存储没有有效配置，检查是否有API密钥
      if (!configToUse || !configToUse.apiKey) {
        // 检查是否有已保存的API密钥
        const modelType = configToUse?.modelType || DEFAULT_MODEL_CONFIG.modelType;
        const modelInfo = AI_MODELS[modelType];

        if (modelInfo) {
          const provider = modelInfo.provider;
          let apiKey = apiKeys[provider];

          // 如果没有保存的API密钥，使用默认API密钥
          if (!apiKey && modelInfo.apiKey) {
            apiKey = modelInfo.apiKey;
            setApiKey(provider, apiKey);
          }

          // 如果有API密钥，创建配置
          if (apiKey) {
            configToUse = {
              provider,
              modelType,
              apiKey,
              temperature: modelSettings.temperature,
              maxTokens: modelSettings.maxTokens,
              ...(modelInfo.baseUrl && { baseUrl: modelInfo.baseUrl }),
            };
          }
        }
      }

      // 步骤3: 如果仍然没有配置，使用默认配置
      if (!configToUse) {
        configToUse = {
          ...DEFAULT_MODEL_CONFIG,
          temperature: modelSettings.temperature,
          maxTokens: modelSettings.maxTokens,
        };

        // 确保默认API密钥已设置
        setApiKey(DEFAULT_MODEL_CONFIG.provider, DEFAULT_MODEL_CONFIG.apiKey!);
      }

      // 步骤4: 创建模型
      const model = createModel(configToUse);
      if (!model) {
        throw new Error("创建模型失败");
      }

      // 步骤5: 更新状态
      setCurrentModelConfig(configToUse);
      setServiceStatus(ServiceStatus.READY);

      return { model, config: configToUse };
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "初始化模型失败";
      setErrorMessage(errorMsg);
      setServiceStatus(ServiceStatus.ERROR);
      return { model: null, config: null };
    }
  });

  /**
   * 切换模型类型
   */
  const switchModelType = useCallback(
    async (modelType: ModelType) => {
      try {
        // 检查是否有对应的API密钥
        const modelInfo = AI_MODELS[modelType];
        if (!modelInfo) {
          throw new Error(`不支持的模型类型: ${modelType}`);
        }

        const provider = modelInfo.provider;
        let apiKey = apiKeys[provider];

        // 如果没有API密钥，检查AI_MODELS中是否有该模型的API密钥
        if (!apiKey && modelInfo.apiKey && modelInfo.apiKey.trim() !== "") {
          apiKey = modelInfo.apiKey;
          setApiKey(provider, apiKey);
          console.log(`已将${modelType}的API密钥从constants.ts设置到浏览器缓存`, provider, apiKey);
        }

        // 如果没有API密钥，无法切换
        if (!apiKey) {
          throw new Error(`无法切换到${modelType}，请先配置${provider}的API密钥`);
        }

        // 记录正在切换的模型类型
        console.log(`正在切换到模型: ${modelType}`);

        // 创建新的模型配置
        const newConfig: ModelConfig = {
          provider,
          modelType,
          apiKey,
          temperature: modelSettings.temperature,
          maxTokens: modelSettings.maxTokens,
          ...(modelInfo.baseUrl && { baseUrl: modelInfo.baseUrl }),
        };

        // 创建新的模型实例
        const newModel = createModel(newConfig);
        if (!newModel) {
          throw new Error(`创建${modelType}模型失败`);
        }

        // 更新当前模型配置
        setCurrentModelConfig(newConfig);
        console.log("已更新当前模型配置到浏览器存储", newConfig);

        setServiceStatus(ServiceStatus.READY);
        return { model: newModel, config: newConfig };
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : "切换模型失败";
        setErrorMessage(errorMsg);
        return { model: null, config: null };
      }
    },
    [apiKeys, modelSettings, createModel, setApiKey, setCurrentModelConfig, setServiceStatus, setErrorMessage]
  );

  /**
   * 重置模型配置
   *
   */
  const resetModelConfig = useCallback(() => {
    setCurrentModelConfig(null);
    setServiceStatus(ServiceStatus.UNINITIALIZED);
    setErrorMessage(null);
  }, [setCurrentModelConfig, setServiceStatus, setErrorMessage]);

  /**
   * 更新某一个模型对应的apikey
   * @param model 模型类型
   * @param apiKey API密钥
   * @returns 是否成功更新
   */
  const setModelKey = (model: ModelType, apiKey: string) => {
    try {
      console.log(`正在更新模型 ${model} 的API密钥`);

      // 获取模型信息
      const modelInfo = AI_MODELS[model];
      if (!modelInfo) {
        console.error(`不支持的模型类型: ${model}`);
        return false;
      }

      // 获取提供商
      const provider = modelInfo.provider;

      // 更新API密钥
      setApiKey(provider, apiKey);

      // 如果当前使用的就是这个模型，更新当前模型配置
      if (currentModelConfig && currentModelConfig.modelType === model) {
        const updatedConfig: ModelConfig = {
          ...currentModelConfig,
          apiKey: apiKey,
        };

        setCurrentModelConfig(updatedConfig);
        console.log(`已更新当前模型配置的API密钥`, updatedConfig);
      }

      return true;
    } catch (error) {
      console.error(`更新模型API密钥失败:`, error);
      return false;
    }
  };

  return {
    // 状态
    apiKeys,
    modelSettings,
    currentModelConfig,
    serviceStatus,
    errorMessage,

    // 方法
    setApiKey,
    updateModelSettings,
    initializeModelConfig,
    switchModelType,
    setModelKey,
    resetModelConfig,
  };
}
