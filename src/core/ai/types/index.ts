/**
 * AI服务模块类型定义
 */

// 模型提供商枚举
export enum ModelProvider {
  /** OpenAI */
  OPENAI = "openai",
  /** Google Gemini */
  GEMINI = "gemini",
  /** DeepSeek */
  DEEPSEEK = "deepseek",
}

// 模型类型枚举
export enum ModelType {
  /** OpenAI GPT-4o 使用deepseek-v3 兼容gpt4o */
  GPT4O = "deepseek-v3",
  /** Google Gemini 2.0 flash */
  GEMINI_PRO = "gemini-2.0-flash",
  /** DeepSeek Chat */
  DEEPSEEK = "deepseek-chat",
}

// 服务状态枚举
export enum ServiceStatus {
  /** 未初始化 */
  UNINITIALIZED = "uninitialized",
  /** 初始化中 */
  INITIALIZING = "initializing",
  /** 就绪 */
  READY = "ready",
  /** 处理中 */
  PROCESSING = "processing",
  /** 错误 */
  ERROR = "error",
}

// 记忆类型枚举
export enum MemoryType {
  /** 缓冲记忆 */
  BUFFER = "buffer",
  /** 摘要记忆 */
  SUMMARY = "summary",
  /** 对话记忆 */
  CONVERSATION = "conversation",
  /** 向量记忆 */
  VECTOR = "vector",
}

// 存储提供商枚举
export enum StorageProvider {
  /** 本地存储 */
  LOCAL_STORAGE = "localStorage",
  /** IndexedDB */
  INDEXED_DB = "indexedDB",
  /** 自定义 */
  CUSTOM = "custom",
}

// 消息角色枚举
export enum MessageRole {
  /** 系统消息 */
  SYSTEM = "system",
  /** 用户消息 */
  USER = "user",
  /** 助手消息 */
  ASSISTANT = "assistant",
}

// AI消息类型枚举
export enum AIMessageType {
  /** 文本 */
  TEXT = "text",
  /** 代码 */
  CODE = "code",
  /** 图像 */
  IMAGE = "image",
  /** 文件 */
  FILE = "file",
}

// 模型信息接口
export interface ModelInfo {
  /** 模型ID */
  id: string;
  /** 模型名称 */
  name: string;
  /** 提供商 */
  provider: ModelProvider;
  /** 描述 */
  description?: string;
  /** 上下文窗口大小 */
  contextWindow?: number;
  /** 最大token数 */
  maxTokens?: number;
}

// AI模型映射接口
export interface AIModelsMap {
  [key: string]: ModelConfig;
}

// 模型配置接口
export interface ModelConfig {
  /** 模型类型 */
  modelType: ModelType;
  /** 提供商 */
  provider: ModelProvider;
  /** 温度参数 */
  temperature?: number;
  /** 最大token数 */
  maxTokens?: number;
  /** API密钥 */
  apiKey?: string;
  /** 基础URL */
  baseUrl?: string;
}
// 添加元数据类型
export interface MessageMetadata {
  // 如果消息包含生成的代码
  generatedCode?: {
    files: GeneratedFile[];
    appliedToFileSystem?: boolean;
    appliedAt?: number;
  };
  // 如果消息是模板选择
  templateSelection?: {
    templateId: string;
    templateName: string;
    document: any;
  };
  /** 时间戳 */
  timestamp: number;
  // 其他元数据...
  isError?: boolean;
}

// 消息接口
export interface Message {
  /** 消息ID */
  id: string;
  /** 角色 */
  role: MessageRole;
  /** 内容 */
  content: string;
  /** 元数据 */
  metadata: MessageMetadata;
}

// 对话接口
export interface Conversation {
  /** 对话ID */
  id: string;
  /** 对话标题 */
  title: string;
  /** 系统提示词 */
  systemPrompt?: string;
  /** 消息数组 */
  messages: Message[];
  /** 创建时间 */
  createdAt: number;
  /** 更新时间 */
  updatedAt: number;
  /** 元数据 */
  metadata: MessageMetadata;
}

// 对话信息接口
export interface ConversationInfo {
  /** 对话ID */
  id: string;
  /** 对话名称 */
  name: string;
  /** 最后一条消息 */
  lastMessage?: string;
  /** 消息数量 */
  messageCount: number;
  /** 创建时间 */
  createdAt: number;
  /** 更新时间 */
  updatedAt: number;
}

// 创建对话选项
export interface CreateConversationOptions {
  /** 对话名称 */
  name: string;
  /** 系统提示词 */
  systemPrompt?: string;
}

// 记忆配置接口
export interface MemoryConfig {
  /** 记忆类型 */
  type: MemoryType;
  /** 最大消息数 */
  maxMessages?: number;
  /** 摘要阈值 */
  summarizeThreshold?: number;
}

// AI服务配置接口
export interface AIServiceConfig {
  /** 默认模型类型 */
  defaultModelType?: ModelType;
  /** 默认提供商 */
  defaultProvider?: ModelProvider;
  /** 默认温度参数 */
  defaultTemperature?: number;
  /** 默认最大token数 */
  defaultMaxTokens?: number;
  /** 记忆配置 */
  memoryConfig?: MemoryConfig;
}

// 发送消息选项接口
export interface SendMessageOptions {
  /** 系统提示词 */
  systemPrompt?: string;
  /** 温度参数 */
  temperature?: number;
  /** 最大token数 */
  maxTokens?: number;
  /** 是否流式响应 */
  streaming?: boolean;
  /** 流式更新回调 */
  onStreamUpdate?: (content: string) => void;
  /** 模板信息 */
  templateInfo?: string;
}

// AI消息内容接口
export interface AIMessageContent {
  /** 内容类型 */
  type: AIMessageType;
  /** 内容 */
  content: string;
  /** 语言（代码类型时） */
  language?: string;
  /** 文件路径（文件类型时） */
  filePath?: string;
  /** 图像URL（图像类型时） */
  imageUrl?: string;
}

// 使用情况元数据
export interface UsageMetadata {
  /** 输入token数 */
  inputTokens?: number;
  /** 输出token数 */
  outputTokens?: number;
  /** 总token数 */
  totalTokens?: number;
}

// AI请求选项
export interface AIRequestOptions {
  /** 系统提示词 */
  systemPrompt?: string;
  /** 对话ID */
  conversationId?: string;
  /** 是否流式响应 */
  streaming?: boolean;
  /** 流式更新回调 */
  onStreamingUpdate?: (content: string) => void;
  /** 温度参数 */
  temperature?: number;
  /** 最大token数 */
  maxTokens?: number;
}

// AI响应接口
export interface AIResponse {
  /** 是否成功 */
  success: boolean;
  /** 内容 */
  content?: string;
  /** 解析后的内容 */
  parsedContent?: AIMessageContent[];
  /** 错误信息 */
  error?: string;
  /** 使用情况元数据 */
  usage?: UsageMetadata;
}

// 代码生成参数接口
export interface CodeGenerationParams {
  /** 提示词 */
  prompt: string;
  /** 编程语言 */
  language?: string;
  /** 框架 */
  framework?: string;
  /** 是否包含测试 */
  includeTests?: boolean;
  /** 是否包含注释 */
  includeComments?: boolean;
}

// 代码生成选项
export interface CodeGenerationOptions extends AIRequestOptions {
  /** 目标语言 */
  language?: string;
  /** 框架 */
  framework?: string;
  /** 是否包含测试 */
  includeTests?: boolean;
}

// 代码文件接口
export interface CodeFile {
  /** 文件路径 */
  path: string;
  /** 文件内容 */
  content: string;
  /** 编程语言 */
  language?: string;
}

// 生成的文件接口
export interface GeneratedFile {
  /** 文件路径 */
  path: string;
  /** 文件内容 */
  content: string;
  /** 语言 */
  language: string;
}

// 代码生成结果接口
export interface CodeGenerationResult {
  /** 是否成功 */
  success: boolean;
  /** 生成的文件 */
  files?: CodeFile[];
  /** 错误信息 */
  error?: string;
}

// 图像生成选项
export interface ImageGenerationOptions extends AIRequestOptions {
  /** 图像宽度 */
  width?: number;
  /** 图像高度 */
  height?: number;
  /** 图像风格 */
  style?: string;
}

// 图像生成结果
export interface ImageGenerationResult extends AIResponse {
  /** 图像URL */
  imageUrl?: string;
}

// 模板处理结果接口
export interface TemplateProcessingResult {
  /** 是否成功 */
  success: boolean;
  /** 生成的文件 */
  files?: CodeFile[];
  /** 错误信息 */
  error?: string;
}

// 模板处理结果
export interface TemplateProcessResult extends CodeGenerationResult {
  /** 模板ID */
  templateId?: string;
}

// 模板优化参数接口
export interface TemplateOptimizationParams {
  /** 优化请求 */
  optimizationRequest: string;
  /** 需求说明 */
  requirements?: string;
}

// 模板优化结果接口
export interface TemplateOptimizationResult {
  /** 是否成功 */
  success: boolean;
  /** 生成的文件 */
  files?: CodeFile[];
  /** 模板信息 */
  template?: any;
  /** 错误信息 */
  error?: string;
}

// 文档加载结果接口
export interface DocumentLoadResult {
  /** 是否成功 */
  success: boolean;
  /** 文档数组 */
  documents?: any[];
  /** 错误信息 */
  error?: string;
}

// 检索结果接口
export interface RetrievalResult {
  /** 是否成功 */
  success: boolean;
  /** 文档数组 */
  documents?: any[];
  /** 错误信息 */
  error?: string;
}

// 业务上下文
export interface BusinessContext {
  /** 行业 */
  industry: string;
  /** 业务目标 */
  businessGoal: string;
  /** 目标受众 */
  targetAudience: string;
  /** 设计风格 */
  designStyle: string;
}

// 业务上下文匹配
export interface BusinessContextMatch {
  /** 行业 */
  industry: string;
  /** 业务目标 */
  businessGoal: string;
  /** 目标受众 */
  targetAudience: string;
  /** 设计风格 */
  designStyle: string;
}

// 组件信息
export interface ComponentInfo {
  /** 组件ID */
  id: string;
  /** 组件名称 */
  name: string;
  /** 组件类型 */
  type: string;
  /** 组件描述 */
  description: string;
  /** 是否可编辑 */
  editable: boolean;
  /** 属性 */
  properties?: Record<string, any>;
}

// 组件推荐
export interface ComponentRecommendation {
  /** 组件ID */
  componentId: string;
  /** 组件名称 */
  componentName: string;
  /** 描述 */
  description: string;
  /** 匹配分数 */
  matchScore: number;
}

// 模板元素
export interface TemplateElement {
  /** 元素ID */
  id: string;
  /** 元素类型 */
  type: string;
  /** 元素名称 */
  name: string;
  /** 子元素 */
  children?: TemplateElement[];
  /** 属性 */
  properties?: Record<string, any>;
}

// 模板结构
export interface TemplateStructure {
  /** 根组件 */
  root: string;
  /** 组件树 */
  tree: Record<string, string[]>;
  /** 元素 */
  elements?: TemplateElement[];
}

// 模板分析结果
export interface TemplateAnalysisResult {
  /** 模板ID */
  templateId: string;
  /** 模板路径 */
  templatePath: string;
  /** 业务上下文 */
  businessContext: BusinessContext;
  /** 组件 */
  components: ComponentInfo[];
  /** 结构 */
  structure: TemplateStructure;
  /** 元数据 */
  metadata: Record<string, any>;
  /** 相似模板 */
  similarTemplates?: string[];
}

// 模板推荐
export interface TemplateRecommendation {
  /** 模板ID */
  templateId: string;
  /** 模板路径 */
  templatePath: string;
  /** 模板名称 */
  templateName: string;
  /** 描述 */
  description: string;
  /** 匹配分数 */
  matchScore: number;
  /** 业务上下文匹配 */
  businessContextMatch: BusinessContextMatch;
  /** 预览URL */
  previewUrl?: string;
  /** 推荐组件 */
  recommendedComponents?: ComponentRecommendation[];
}
