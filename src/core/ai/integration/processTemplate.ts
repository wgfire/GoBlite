/**
 * 模板处理函数
 * 使用LangChain服务处理模板
 */

import { useLangChainService } from "../hooks/useLangChainService";
import { Template } from "@/template/types";
import { FileItem } from "@/core/fileSystem/types";

/**
 * 模板处理选项
 */
export interface TemplateProcessOptions {
  /** 模板 */
  template: Template;
  /** 表单数据 */
  formData: Record<string, any>;
  /** 是否自动同步到文件系统 */
  autoSync?: boolean;
}

/**
 * 模板处理结果
 */
export interface TemplateProcessResult {
  /** 是否成功 */
  success: boolean;
  /** 生成的文件 */
  files?: Array<{
    path: string;
    content: string;
    language?: string;
  }>;
  /** 错误信息 */
  error?: string;
  /** 响应内容 */
  content?: string;
}

/**
 * 处理模板
 * @param options 选项
 * @returns 处理结果
 */
export async function processTemplate(options: TemplateProcessOptions): Promise<TemplateProcessResult> {
  try {
    // 使用LangChain服务
    const { processTemplate } = useLangChainService();
    
    // 构建提示词
    const prompt = `请根据以下模板和表单数据生成代码\n\n模板名称: ${options.template?.name}\n表单数据: ${JSON.stringify(options.formData, null, 2)}`;
    
    // 发送请求
    const result = await processTemplate(
      prompt,
      `/templates/${options.template?.id || 'default'}`,
      {
        systemPrompt: "你是一个专业的前端开发工程师，帮助用户根据模板和表单数据生成代码。",
      }
    );
    
    return result;
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "处理模板失败",
    };
  }
}
