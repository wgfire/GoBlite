/**
 * 增强的响应验证和修复工具
 * 用于验证AI响应的结构并提供自动修复功能
 */

import { z } from "zod";

/**
 * 统一响应结构
 */
export interface UnifiedResponse {
  intent: {
    isInfoRequest: boolean;
    isCodeRequest: boolean;
    isTemplateRequest: boolean;
  };
  fileOperations: Array<{
    path: string;
    content: string;
    action: "create" | "update" | "delete";
    language?: string;
    content_base64?: string;
  }>;
  preview: {
    shouldStartPreview: boolean;
  };
  response: {
    text: string;
  };
}

/**
 * 响应类型枚举
 */
export enum ResponseType {
  TEMPLATE_INFO = "TEMPLATE_INFO",
  CODE_GENERATION = "CODE_GENERATION",
  CLARIFY = "CLARIFY",
  GENERAL_CHAT = "GENERAL_CHAT",
}

/**
 * 增强的响应Schema，支持多种格式
 */
export const enhancedResponseSchema = z.object({
  responseType: z.nativeEnum(ResponseType).describe("响应类型"),
  explanation: z.string().describe("原因说明"),
  content: z.string().describe("自然语言回复"),
  fileOperations: z
    .array(
      z.object({
        path: z.string().describe("文件路径"),
        action: z.enum(["create", "update", "delete"]).describe("操作类型"),
        content: z.string().optional().describe("文件内容（plain）"),
        content_base64: z.string().optional().describe("文件内容（base64 编码）"),
        language: z.string().optional().describe("文件语言"),
      })
    )
    .optional()
    .describe("文件操作列表，仅在 CODE_GENERATION 时使用"),
});

/**
 * 验证统一响应结构
 * @param response 响应对象
 * @returns 是否有效
 */
export function validateUnifiedResponse(response: any): boolean {
  try {
    // 检查基本结构
    if (!response || typeof response !== "object") return false;

    // 检查intent字段
    if (!response.intent || typeof response.intent !== "object") return false;
    if (typeof response.intent.isInfoRequest !== "boolean") return false;
    if (typeof response.intent.isCodeRequest !== "boolean") return false;
    if (typeof response.intent.isTemplateRequest !== "boolean") return false;

    // 检查fileOperations字段
    if (!Array.isArray(response.fileOperations)) return false;
    for (const op of response.fileOperations) {
      if (!op.path || typeof op.path !== "string") return false;
      if (typeof op.content !== "string") return false;
      if (!["create", "update", "delete"].includes(op.action)) return false;
    }

    // 检查preview字段
    if (!response.preview || typeof response.preview !== "object") return false;
    if (typeof response.preview.shouldStartPreview !== "boolean") return false;

    // 检查response字段
    if (!response.response || typeof response.response !== "object") return false;
    if (!response.response.text || typeof response.response.text !== "string") return false;

    return true;
  } catch (error) {
    console.error("验证响应结构时出错:", error);
    return false;
  }
}

/**
 * 创建默认的统一响应
 * @param text 响应文本
 * @returns 默认响应
 */
export function createDefaultUnifiedResponse(text: string): UnifiedResponse {
  return {
    intent: {
      isInfoRequest: true,
      isCodeRequest: false,
      isTemplateRequest: false,
    },
    fileOperations: [],
    preview: {
      shouldStartPreview: false,
    },
    response: {
      text,
    },
  };
}

/**
 * 从文本中提取JSON
 * @param text 包含JSON的文本
 * @returns 提取的JSON对象或null
 */
export function extractJsonFromText(text: string): any | null {
  try {
    // 尝试直接解析整个文本
    try {
      return JSON.parse(text);
    } catch {
      // 如果直接解析失败，尝试提取JSON部分
    }

    // 尝试从代码块中提取JSON
    const jsonBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (jsonBlockMatch && jsonBlockMatch[1]) {
      return JSON.parse(jsonBlockMatch[1]);
    }

    // 尝试从文本中提取JSON对象
    const jsonMatch = text.match(/(\{[\s\S]*\})/);
    if (jsonMatch && jsonMatch[1]) {
      return JSON.parse(jsonMatch[1]);
    }

    return null;
  } catch (error) {
    console.error("从文本中提取JSON时出错:", error);
    return null;
  }
}

/**
 * 增强的响应解析器，支持多种容错机制
 */
export class EnhancedResponseParser {
  /**
   * 智能解析AI响应，支持多种格式和容错机制
   * @param rawResponse 原始响应文本
   * @param schema Zod schema用于验证
   * @returns 解析后的响应对象
   */
  static parseResponse<T>(rawResponse: string, schema: z.ZodType<T>): T | null {
    const attempts = [
      // 1. 直接解析
      () => this.directParse(rawResponse, schema),
      // 2. 去除代码块包装后解析
      () => this.parseWithoutCodeBlocks(rawResponse, schema),
      // 3. 提取JSON对象后解析
      () => this.extractAndParse(rawResponse, schema),
      // 4. 修复常见格式问题后解析
      () => this.fixAndParse(rawResponse, schema),
    ];

    for (const attempt of attempts) {
      try {
        const result = attempt();
        if (result) {
          console.log("✅ 响应解析成功");
          return result;
        }
      } catch (error) {
        console.warn("⚠️ 解析尝试失败:", error);
        continue;
      }
    }

    console.error("❌ 所有解析尝试都失败了，原始响应:", rawResponse);
    return null;
  }

  /**
   * 直接解析JSON
   */
  private static directParse<T>(text: string, schema: z.ZodType<T>): T | null {
    try {
      const parsed = JSON.parse(text);
      return schema.parse(parsed);
    } catch {
      return null;
    }
  }

  /**
   * 去除代码块包装后解析
   */
  private static parseWithoutCodeBlocks<T>(text: string, schema: z.ZodType<T>): T | null {
    try {
      // 去除 ```json``` 包装
      const cleaned = text
        .trim()
        .replace(/^```(?:json)?/i, "")
        .replace(/```$/i, "")
        .trim();
      const parsed = JSON.parse(cleaned);
      return schema.parse(parsed);
    } catch {
      return null;
    }
  }

  /**
   * 提取JSON对象后解析
   */
  private static extractAndParse<T>(text: string, schema: z.ZodType<T>): T | null {
    try {
      // 查找第一个完整的JSON对象
      const firstBrace = text.indexOf("{");
      const lastBrace = text.lastIndexOf("}");

      if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
        const jsonStr = text.slice(firstBrace, lastBrace + 1);
        const parsed = JSON.parse(jsonStr);
        return schema.parse(parsed);
      }
      return null;
    } catch {
      return null;
    }
  }

  /**
   * 修复常见格式问题后解析
   */
  private static fixAndParse<T>(text: string, schema: z.ZodType<T>): T | null {
    try {
      let fixed = text.trim();

      // 修复常见的JSON格式问题
      fixed = fixed
        .replace(/,\s*}/g, "}") // 移除尾随逗号
        .replace(/,\s*]/g, "]") // 移除数组尾随逗号
        .replace(/'/g, '"') // 单引号转双引号
        .replace(/(\w+):/g, '"$1":'); // 为属性名添加引号

      const parsed = JSON.parse(fixed);
      return schema.parse(parsed);
    } catch {
      return null;
    }
  }
}
