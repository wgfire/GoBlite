/**
 * 多模态输入处理器
 * 支持文本、图片、PDF、文档等多种输入类型的统一处理
 */

import { z } from "zod";

/**
 * 输入类型枚举
 */
export enum InputType {
  TEXT = "text",
  IMAGE = "image", 
  PDF = "pdf",
  DOCUMENT = "document",
  CODE = "code",
  AUDIO = "audio",
  VIDEO = "video"
}

/**
 * 处理状态枚举
 */
export enum ProcessingStatus {
  PENDING = "pending",
  PROCESSING = "processing",
  COMPLETED = "completed",
  FAILED = "failed"
}

/**
 * 多模态输入接口
 */
export interface MultiModalInput {
  id: string;
  type: InputType;
  content: string | File | Blob;
  metadata?: {
    filename?: string;
    mimeType?: string;
    size?: number;
    timestamp?: number;
    [key: string]: any;
  };
}

/**
 * 处理结果接口
 */
export interface ProcessingResult {
  id: string;
  status: ProcessingStatus;
  processedContent: string;
  extractedText?: string;
  metadata?: {
    originalType: InputType;
    processingTime?: number;
    confidence?: number;
    [key: string]: any;
  };
  error?: string;
}

/**
 * 多模态处理器配置
 */
export interface MultiModalProcessorConfig {
  maxFileSize: number; // 最大文件大小（字节）
  supportedImageTypes: string[];
  supportedDocumentTypes: string[];
  enableOCR: boolean;
  enableImageAnalysis: boolean;
}

/**
 * 默认配置
 */
const DEFAULT_CONFIG: MultiModalProcessorConfig = {
  maxFileSize: 10 * 1024 * 1024, // 10MB
  supportedImageTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  supportedDocumentTypes: ['application/pdf', 'text/plain', 'application/msword'],
  enableOCR: true,
  enableImageAnalysis: true,
};

/**
 * 多模态输入处理器
 */
export class MultiModalProcessor {
  private config: MultiModalProcessorConfig;

  constructor(config: Partial<MultiModalProcessorConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * 处理多模态输入
   * @param input 多模态输入
   * @returns 处理结果
   */
  async processInput(input: MultiModalInput): Promise<ProcessingResult> {
    const startTime = Date.now();
    
    try {
      // 验证输入
      this.validateInput(input);

      // 根据类型处理输入
      let processedContent: string;
      let extractedText: string | undefined;

      switch (input.type) {
        case InputType.TEXT:
          processedContent = await this.processText(input);
          break;
        case InputType.IMAGE:
          const imageResult = await this.processImage(input);
          processedContent = imageResult.description;
          extractedText = imageResult.extractedText;
          break;
        case InputType.PDF:
          const pdfResult = await this.processPDF(input);
          processedContent = pdfResult.content;
          extractedText = pdfResult.extractedText;
          break;
        case InputType.DOCUMENT:
          processedContent = await this.processDocument(input);
          extractedText = processedContent;
          break;
        default:
          throw new Error(`不支持的输入类型: ${input.type}`);
      }

      const processingTime = Date.now() - startTime;

      return {
        id: input.id,
        status: ProcessingStatus.COMPLETED,
        processedContent,
        extractedText,
        metadata: {
          originalType: input.type,
          processingTime,
          confidence: 0.95, // 默认置信度
        }
      };

    } catch (error) {
      console.error("多模态输入处理失败:", error);
      return {
        id: input.id,
        status: ProcessingStatus.FAILED,
        processedContent: "",
        error: error instanceof Error ? error.message : String(error),
        metadata: {
          originalType: input.type,
          processingTime: Date.now() - startTime,
        }
      };
    }
  }

  /**
   * 验证输入
   */
  private validateInput(input: MultiModalInput): void {
    if (!input.id) {
      throw new Error("输入ID不能为空");
    }

    if (!Object.values(InputType).includes(input.type)) {
      throw new Error(`无效的输入类型: ${input.type}`);
    }

    // 验证文件大小
    if (input.content instanceof File || input.content instanceof Blob) {
      if (input.content.size > this.config.maxFileSize) {
        throw new Error(`文件大小超过限制: ${input.content.size} > ${this.config.maxFileSize}`);
      }
    }
  }

  /**
   * 处理文本输入
   */
  private async processText(input: MultiModalInput): Promise<string> {
    if (typeof input.content === 'string') {
      return input.content;
    }
    throw new Error("文本输入内容必须是字符串");
  }

  /**
   * 处理图片输入
   */
  private async processImage(input: MultiModalInput): Promise<{
    description: string;
    extractedText?: string;
  }> {
    if (!(input.content instanceof File || input.content instanceof Blob)) {
      throw new Error("图片输入内容必须是File或Blob");
    }

    // 验证图片类型
    const mimeType = input.content instanceof File ? input.content.type : input.metadata?.mimeType;
    if (!mimeType || !this.config.supportedImageTypes.includes(mimeType)) {
      throw new Error(`不支持的图片类型: ${mimeType}`);
    }

    // 转换为base64用于AI分析
    const base64 = await this.fileToBase64(input.content);
    
    // 这里可以调用图像分析API
    // 暂时返回模拟结果
    return {
      description: `这是一张${mimeType}格式的图片，包含了用户上传的内容。`,
      extractedText: this.config.enableOCR ? "从图片中提取的文本内容" : undefined
    };
  }

  /**
   * 处理PDF输入
   */
  private async processPDF(input: MultiModalInput): Promise<{
    content: string;
    extractedText: string;
  }> {
    if (!(input.content instanceof File || input.content instanceof Blob)) {
      throw new Error("PDF输入内容必须是File或Blob");
    }

    // 这里可以使用PDF解析库
    // 暂时返回模拟结果
    const extractedText = "从PDF中提取的文本内容";
    
    return {
      content: `这是一个PDF文档，包含${extractedText.length}个字符的内容。`,
      extractedText
    };
  }

  /**
   * 处理文档输入
   */
  private async processDocument(input: MultiModalInput): Promise<string> {
    if (input.content instanceof File) {
      return await this.fileToText(input.content);
    } else if (typeof input.content === 'string') {
      return input.content;
    }
    throw new Error("文档输入内容必须是File或字符串");
  }

  /**
   * 将文件转换为base64
   */
  private async fileToBase64(file: File | Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result.split(',')[1]); // 移除data:image/...;base64,前缀
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  /**
   * 将文件转换为文本
   */
  private async fileToText(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsText(file);
    });
  }

  /**
   * 批量处理多个输入
   */
  async processBatch(inputs: MultiModalInput[]): Promise<ProcessingResult[]> {
    const results = await Promise.allSettled(
      inputs.map(input => this.processInput(input))
    );

    return results.map((result, index) => {
      if (result.status === 'fulfilled') {
        return result.value;
      } else {
        return {
          id: inputs[index].id,
          status: ProcessingStatus.FAILED,
          processedContent: "",
          error: result.reason?.message || "处理失败",
          metadata: {
            originalType: inputs[index].type,
          }
        };
      }
    });
  }
}

/**
 * 创建多模态输入对象的工厂函数
 */
export function createMultiModalInput(
  type: InputType,
  content: string | File | Blob,
  metadata?: MultiModalInput['metadata']
): MultiModalInput {
  return {
    id: `input_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type,
    content,
    metadata: {
      timestamp: Date.now(),
      ...metadata
    }
  };
}

export default MultiModalProcessor;
