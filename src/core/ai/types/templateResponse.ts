/**
 * 模板代理响应类型定义
 */

import { Document } from "langchain/document";
import { FileOperation, FileOperationType } from "@/core/fileSystem/types"; // 从文件系统类型中导入

/**
 * 模板响应类型枚举
 */
export enum TemplateResponseType {
  /** 模板信息查询 */
  TEMPLATE_INFO = "TEMPLATE_INFO",
  /** 代码生成 */
  CODE_GENERATION = "CODE_GENERATION"
}

/**
 * 模板响应基础接口
 */
export interface TemplateResponseBase {
  /** 响应类型 */
  responseType: TemplateResponseType;
  /** 解释说明 */
  explanation: string;
  /** 响应内容 */
  content: string;
}

/**
 * 模板信息响应接口
 */
export interface TemplateInfoResponse extends TemplateResponseBase {
  responseType: TemplateResponseType.TEMPLATE_INFO;
}

/**
 * 代码生成响应接口
 */
export interface CodeGenerationResponse extends TemplateResponseBase {
  responseType: TemplateResponseType.CODE_GENERATION;
  /** 文件操作列表 */
  fileOperations: FileOperation[];
}

/**
 * 模板响应类型
 */
export type TemplateResponse = TemplateInfoResponse | CodeGenerationResponse;

/**
 * 从LangChain文档创建文件操作
 * @param documents LangChain文档数组
 * @returns 文件操作数组
 */
export function createFileOperationsFromDocuments(documents: Document[]): FileOperation[] {
  return documents.map(doc => ({
    path: doc.metadata.path || `file_${Date.now()}.txt`,
    content: doc.pageContent,
    type: FileOperationType.CREATE,
  }));
}
