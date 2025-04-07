/**
 * AI服务类型定义
 */

import { FileItem } from "../fileSystem/types";
import { Template } from "@/template/types";

/**
 * AI服务配置
 */
export interface AIServiceConfig {
  /** API密钥 */
  apiKey: string;
  /** API基础URL */
  baseUrl: string;
  /** 模型名称 */
  modelName: string;
  /** 请求超时时间(毫秒) */
  timeout?: number;
  /** 代理URL(可选) */
  proxyUrl?: string;
}

/**
 * AI请求选项
 */
export interface AIRequestOptions {
  /** 提示词 */
  prompt: string;
  /** 温度参数(0-1) */
  temperature?: number;
  /** 最大生成token数 */
  maxTokens?: number;
  /** 停止序列 */
  stopSequences?: string[];
  /** 系统提示词 */
  systemPrompt?: string;
}

/**
 * AI响应接口
 */
export interface AIResponse {
  /** 请求是否成功 */
  success: boolean;
  /** 响应内容 */
  content?: string;
  /** 错误信息 */
  error?: string;
  /** 使用统计 */
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

/**
 * 代码生成结果
 */
export interface CodeGenerationResult {
  /** 是否成功 */
  success: boolean;
  /** 生成的文件列表 */
  files?: Array<{
    /** 文件路径 */
    path: string;
    /** 文件内容 */
    content: string;
    /** 文件语言 */
    language?: string;
  }>;
  /** 错误信息 */
  error?: string;
}

/**
 * 图像生成结果
 */
export interface ImageGenerationResult {
  /** 是否成功 */
  success: boolean;
  /** 生成的图像列表 */
  images?: Array<{
    /** 图像URL或Base64 */
    url: string;
    /** 替代文本 */
    alt?: string;
    /** 图像宽度 */
    width: number;
    /** 图像高度 */
    height: number;
  }>;
  /** 错误信息 */
  error?: string;
}

/**
 * AI服务状态
 */
export enum AIServiceStatus {
  /** 未初始化 */
  UNINITIALIZED = 'uninitialized',
  /** 初始化中 */
  INITIALIZING = 'initializing',
  /** 就绪 */
  READY = 'ready',
  /** 处理中 */
  PROCESSING = 'processing',
  /** 错误 */
  ERROR = 'error'
}

/**
 * AI生成类型
 */
export enum AIGenerationType {
  /** 代码生成 */
  CODE = 'code',
  /** 图像生成 */
  IMAGE = 'image',
  /** 混合生成 */
  MIXED = 'mixed'
}

/**
 * 提示词模板
 */
export interface PromptTemplate {
  /** 模板ID */
  id: string;
  /** 模板名称 */
  name: string;
  /** 模板内容 */
  template: string;
  /** 变量列表 */
  variables: string[];
  /** 描述 */
  description?: string;
  /** 分类 */
  category?: string;
  /** 适用模型类型 */
  modelType?: string;
}

/**
 * 模板处理选项
 */
export interface TemplateProcessOptions {
  /** 模板对象 */
  template: Template;
  /** 表单数据 */
  formData: Record<string, any>;
  /** 生成类型 */
  generationType?: AIGenerationType;
  /** 自定义提示词 */
  customPrompt?: string;
  /** 是否自动同步到WebContainer */
  autoSync?: boolean;
}

/**
 * 模板处理结果
 */
export interface TemplateProcessResult {
  /** 是否成功 */
  success: boolean;
  /** 生成的文件 */
  files?: FileItem[];
  /** 错误信息 */
  error?: string;
}

/**
 * AI消息类型
 */
export enum AIMessageType {
  /** 文本 */
  TEXT = 'text',
  /** 代码 */
  CODE = 'code',
  /** 图像 */
  IMAGE = 'image',
  /** 文件 */
  FILE = 'file',
  /** 错误 */
  ERROR = 'error'
}

/**
 * AI消息内容
 */
export interface AIMessageContent {
  /** 消息类型 */
  type: AIMessageType;
  /** 消息内容 */
  content: string;
  /** 语言(代码类型) */
  language?: string;
  /** 元数据 */
  metadata?: Record<string, any>;
}

/**
 * AI增强消息
 */
export interface AIEnhancedMessage {
  /** 消息ID */
  id: string;
  /** 发送者 */
  sender: 'user' | 'ai';
  /** 时间戳 */
  timestamp: number;
  /** 原始文本 */
  text: string;
  /** 解析后的内容 */
  contents?: AIMessageContent[];
  /** 关联文件 */
  files?: Array<{
    path: string;
    content: string;
    language?: string;
  }>;
}
