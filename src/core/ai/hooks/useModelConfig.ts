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
import { DEFAULT_MODEL_CONFIG, AI_MODELS, DEFAULT_MODEL_PARAMS } from "../constants";
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
   * 首次使用默认配置，之后使用浏览器保存的配置
   */
  const initializeModelConfig = useMemoizedFn(async () => {
    try {
      setServiceStatus(ServiceStatus.INITIALIZING);
      setErrorMessage(null);

      // 如果已有当前模型配置，使用它
      if (currentModelConfig) {
        const model = createModel(currentModelConfig);
        if (model) {
          setServiceStatus(ServiceStatus.READY);
          return { model, config: currentModelConfig };
        }
      }

      // 首次加载或之前的配置无效，使用默认配置
      // 检查是否有API密钥
      const hasAnyApiKey = Object.values(apiKeys).some((key) => key && key.trim() !== "");

      // 如果没有任何API密钥，使用默认API密钥
      if (!hasAnyApiKey) {
        setApiKey(DEFAULT_MODEL_CONFIG.provider, DEFAULT_MODEL_CONFIG.apiKey!);
        console.log("已设置默认API密钥到浏览器缓存", DEFAULT_MODEL_CONFIG.provider, DEFAULT_MODEL_CONFIG.apiKey);
      }

      // 获取所有可用的模型配置
      const availableConfigs: ModelConfig[] = [];

      // 遍历所有模型类型
      Object.values(ModelType).forEach((modelType) => {
        const modelInfo = AI_MODELS[modelType];
        if (!modelInfo) return;

        const provider = modelInfo.provider;
        let apiKey = apiKeys[provider];

        // 如果没有API密钥，检查AI_MODELS中是否有该模型的API密钥
        if (!apiKey && modelInfo.apiKey && modelInfo.apiKey.trim() !== "") {
          apiKey = modelInfo.apiKey;
          setApiKey(provider, apiKey);
          console.log(`已将${modelType}的API密钥从constants.ts设置到浏览器缓存`, provider, apiKey);
        }

        // 如果有API密钥，添加到可用配置中
        if (apiKey) {
          availableConfigs.push({
            provider,
            modelType,
            apiKey,
            temperature: modelSettings.temperature,
            maxTokens: modelSettings.maxTokens,
            ...(modelInfo.baseUrl && { baseUrl: modelInfo.baseUrl }),
          });
        }
      });

      // 如果没有可用配置，使用默认配置
      if (availableConfigs.length === 0) {
        const defaultConfig = {
          ...DEFAULT_MODEL_CONFIG,
          temperature: modelSettings.temperature,
          maxTokens: modelSettings.maxTokens,
        };
        availableConfigs.push(defaultConfig);

        // 确保默认API密钥已设置
        setApiKey(DEFAULT_MODEL_CONFIG.provider, DEFAULT_MODEL_CONFIG.apiKey!);
      }

      // 记录可用模型列表（仅用于日志）
      const availableModelTypes = availableConfigs.map((config) => config.modelType);
      console.log("可用模型列表", availableModelTypes);

      // 选择当前模型配置
      // 优先使用DEFAULT_MODEL_CONFIG对应的配置，而不是第一个可用的配置
      const defaultModelConfig = availableConfigs.find((config) => config.provider === DEFAULT_MODEL_CONFIG.provider && config.modelType === DEFAULT_MODEL_CONFIG.modelType);
      const configToUse = defaultModelConfig || availableConfigs[0];

      // 创建模型
      const model = createModel(configToUse);
      if (!model) {
        throw new Error("创建模型失败");
      }

      // 保存当前模型配置
      setCurrentModelConfig(configToUse);
      console.log("已更新当前模型配置到浏览器存储", configToUse);

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
   */
  const resetModelConfig = useCallback(() => {
    setCurrentModelConfig(null);
    setServiceStatus(ServiceStatus.UNINITIALIZED);
    setErrorMessage(null);
  }, [setCurrentModelConfig, setServiceStatus, setErrorMessage]);

  // 不再需要初始化effect，因为我们不再使用selectedModelType

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
    resetModelConfig,
    createModel,
  };
}
