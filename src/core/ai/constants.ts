/**
 * LangChain AI服务常量定义
 */

import { ModelType, ModelProvider, AIModelsMap, ModelConfig } from "./types/index";

/**
 * 默认系统提示词
 */
export const DEFAULT_SYSTEM_PROMPT = "你是一个专业的AI助手，擅长帮助用户解决各种问题。" + "请提供清晰、准确、有用的回答。";

/**
 * 代码生成系统提示词
 */
export const CODE_GENERATION_SYSTEM_PROMPT =
  "你是一个专业的代码生成助手。请根据用户的需求生成代码。" +
  "返回格式应为markdown代码块，每个文件使用单独的代码块，并在代码块前注明文件路径。" +
  "例如: ```filepath:src/index.js\nconsole.log('Hello');\n```";

/**
 * 图像生成系统提示词
 */
export const IMAGE_GENERATION_SYSTEM_PROMPT =
  "你是一个专业的图像生成助手。请根据用户的需求生成详细的图像描述，" +
  "这些描述将被用于生成图像。描述应该详细、具体，包括图像的主题、风格、颜色、构图等。" +
  "每个描述应该是一个独立的段落。";

/**
 * 模板处理系统提示词
 */
export const TEMPLATE_PROCESSING_SYSTEM_PROMPT =
  "你是一个专业的前端开发工程师，帮助用户根据模板创建落地页。" +
  "请根据用户的需求和提供的模板，生成相应的代码。" +
  "返回格式应为markdown代码块，每个文件使用单独的代码块，并在代码块前注明文件路径。" +
  "例如: ```filepath:src/index.js\nconsole.log('Hello');\n```";

/**
 * 默认模型参数
 */
export const DEFAULT_MODEL_PARAMS = {
  temperature: 0.7,
  maxTokens: 20000,
};

/**
 * AI模型配置
 * 统一的模型配置，包含模型类型、名称和提供商信息
 */
export const AI_MODELS: AIModelsMap = {
  [ModelType.GPT4O]: {
    modelType: ModelType.GPT4O,
    provider: ModelProvider.OPENAI,
  },
  [ModelType.GEMINI_PRO]: {
    modelType: ModelType.GEMINI_PRO,
    provider: ModelProvider.GEMINI,
    apiKey: "AIzaSyA3CN1Yj65hiDuH0onPeR5Q5hcly7s-5vI",
  },
  [ModelType.DEEPSEEK]: {
    modelType: ModelType.DEEPSEEK,
    provider: ModelProvider.DEEPSEEK,
    apiKey: "sk-58b58e33b4d64358836ff816fa918aa8",
  },
};

/**
 * 错误消息
 */
export const ERROR_MESSAGES = {
  INITIALIZATION_FAILED: "初始化失败",
  SERVICE_NOT_READY: "服务未就绪",
  MODEL_MANAGER_NOT_INITIALIZED: "模型管理器未初始化",
  MODEL_NOT_AVAILABLE: "模型不可用",
  REQUEST_FAILED: "请求失败",
  RESPONSE_PARSING_FAILED: "响应解析失败",
  CODE_GENERATION_FAILED: "代码生成失败",
  IMAGE_GENERATION_FAILED: "图像生成失败",
  TEMPLATE_PROCESSING_FAILED: "模板处理失败",
};

/**
 * 本地存储键
 */
export const STORAGE_KEYS = {
  CONVERSATIONS: "ai_conversations",
  CURRENT_CONVERSATION: "ai_current_conversation",
  MODEL_CONFIG: "ai_model_config",
};

/**
 * 默认模型配置
 */
export const DEFAULT_MODEL_CONFIG: ModelConfig = {
  provider: ModelProvider.GEMINI,
  modelType: ModelType.GEMINI_PRO,
  apiKey: "AIzaSyA3CN1Yj65hiDuH0onPeR5Q5hcly7s-5vI",
  temperature: 0.7,
  maxTokens: 20000,
};
