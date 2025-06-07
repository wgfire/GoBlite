/**
 * 模板代理响应类型定义
 */

import { Document } from "langchain/document";

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
 * 文件操作类型枚举
 */
export enum FileOperationType {
  /** 创建文件 */
  CREATE = "create",
  /** 更新文件 */
  UPDATE = "update",
  /** 删除文件 */
  DELETE = "delete"
}

/**
 * 文件操作接口
 */
export interface FileOperation {
  /** 文件路径 */
  path: string;
  /** 文件内容 */
  content: string;
  /** 操作类型 */
  action: FileOperationType;
  /** 文件语言（可选） */
  language?: string;
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
    action: FileOperationType.CREATE,
    language: getLanguageFromPath(doc.metadata.path || '')
  }));
}

/**
 * 从文件路径获取语言
 * @param path 文件路径
 * @returns 语言
 */
function getLanguageFromPath(path: string): string {
  const extension = path.split('.').pop()?.toLowerCase() || '';
  
  const extensionMap: Record<string, string> = {
    'js': 'javascript',
    'ts': 'typescript',
    'jsx': 'jsx',
    'tsx': 'tsx',
    'html': 'html',
    'css': 'css',
    'scss': 'scss',
    'json': 'json',
    'md': 'markdown',
    'py': 'python',
    'java': 'java',
    'c': 'c',
    'cpp': 'cpp',
    'go': 'go',
    'rs': 'rust',
    'rb': 'ruby',
    'php': 'php',
    'sh': 'bash'
  };
  
  return extensionMap[extension] || 'plaintext';
}
