/**
 * 文件操作工具
 * 提供文件系统操作的工具函数
 */

import { FileOperation, FileOperationType } from "../types/templateResponse";
import { Document } from "langchain/document";

/**
 * 文件系统接口
 */
export interface FileSystemInterface {
  writeFile: (path: string, content: string) => Promise<boolean>;
  fileExists: (path: string) => boolean;
  createDirectory: (path: string) => Promise<boolean>;
}

/**
 * 执行文件操作
 * @param fileOperations 文件操作数组
 * @param fileSystem 文件系统接口
 * @returns 操作结果
 */
export async function executeFileOperations(
  fileOperations: FileOperation[],
  fileSystem: FileSystemInterface
): Promise<{ success: boolean; results: Array<{ path: string; success: boolean; error?: string }> }> {
  const results: Array<{ path: string; success: boolean; error?: string }> = [];

  try {
    for (const operation of fileOperations) {
      try {
        switch (operation.action) {
          case FileOperationType.CREATE:
          case FileOperationType.UPDATE:
            // 创建或更新文件
            const success = await fileSystem.writeFile(operation.path, operation.content);
            results.push({
              path: operation.path,
              success
            });
            break;
          
          case FileOperationType.DELETE:
            // 删除文件 - 这里假设文件系统接口有删除方法
            // 如果没有，可以通过写入空内容模拟删除
            const deleteSuccess = await fileSystem.writeFile(operation.path, "");
            results.push({
              path: operation.path,
              success: deleteSuccess
            });
            break;
          
          default:
            results.push({
              path: operation.path,
              success: false,
              error: `不支持的操作类型: ${operation.action}`
            });
        }
      } catch (error) {
        results.push({
          path: operation.path,
          success: false,
          error: error instanceof Error ? error.message : String(error)
        });
      }
    }

    // 如果所有操作都成功，返回成功
    const allSuccess = results.every(result => result.success);
    return {
      success: allSuccess,
      results
    };
  } catch (error) {
    return {
      success: false,
      results
    };
  }
}

/**
 * 从代码块提取文件操作
 * @param content 包含代码块的内容
 * @returns 文件操作数组
 */
export function extractFileOperationsFromCodeBlocks(content: string): FileOperation[] {
  const fileOperations: FileOperation[] = [];
  
  // 匹配文件路径和代码块
  // 支持两种格式:
  // 1. ```filepath:path/to/file.js\ncontent```
  // 2. 文件路径: path/to/file.js\n```js\ncontent```
  const filePathCodeBlockRegex = /```filepath:([^\n]+)\n([\s\S]*?)```|文件(?:路径)?[:：]\s*([^\n]+)\n```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g;

  let match;
  while ((match = filePathCodeBlockRegex.exec(content)) !== null) {
    if (match[1] && match[2]) {
      // 第一种格式
      const path = match[1].trim();
      const content = match[2].trim();
      const language = getLanguageFromPath(path);
      fileOperations.push({
        path,
        content,
        action: FileOperationType.CREATE,
        language
      });
    } else if (match[3] && match[5]) {
      // 第二种格式
      const path = match[3].trim();
      const language = match[4].trim() || getLanguageFromPath(path);
      const content = match[5].trim();
      fileOperations.push({
        path,
        content,
        action: FileOperationType.CREATE,
        language
      });
    }
  }

  return fileOperations;
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

/**
 * 将LangChain文档转换为文件操作
 * @param documents LangChain文档数组
 * @returns 文件操作数组
 */
export function convertDocumentsToFileOperations(documents: Document[]): FileOperation[] {
  return documents.map(doc => ({
    path: doc.metadata.path || `file_${Date.now()}.txt`,
    content: doc.pageContent,
    action: FileOperationType.CREATE,
    language: getLanguageFromPath(doc.metadata.path || '')
  }));
}
