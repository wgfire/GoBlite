/**
 * 代码生成钩子
 * 提供代码生成、同步到文件系统和预览功能
 */

import { useState, useCallback } from "react";
import useMemoizedFn from "@/hooks/useMemoizedFn";
import { useFileSystem } from "@/core/fileSystem";
import { useWebContainer } from "@/core/webContainer";
import { useMessageHandler } from "./useMessageHandler";
import { parseCodeFromResponse } from "../../utils/responseParser";
import { AIServiceStatus, CodeGenerationOptions, CodeGenerationResult, GeneratedFile } from "../../types";
import { CODE_GENERATION_SYSTEM_PROMPT, ERROR_MESSAGES } from "../../constants";

/**
 * 代码生成钩子选项
 */
export interface UseCodeGeneratorOptions {
  /** 消息处理钩子 */
  messageHandler: ReturnType<typeof useMessageHandler>;
  /** 服务状态 */
  status: AIServiceStatus;
}

/**
 * 代码生成钩子
 * 提供代码生成、同步到文件系统和预览功能
 */
export const useCodeGenerator = (options: UseCodeGeneratorOptions) => {
  // 获取文件系统和WebContainer钩子
  const fileSystem = useFileSystem();
  const webContainer = useWebContainer();

  // 状态
  const [generatedFiles, setGeneratedFiles] = useState<GeneratedFile[]>([]);
  const [error, setError] = useState<string | null>(null);

  /**
   * 生成代码
   * @param prompt 提示词
   * @param codeOptions 代码生成选项
   * @returns 代码生成结果
   */
  const generateCode = useMemoizedFn(async (prompt: string, codeOptions?: CodeGenerationOptions): Promise<CodeGenerationResult> => {
    try {
      // 检查服务状态
      if (options.status !== AIServiceStatus.READY) {
        throw new Error(ERROR_MESSAGES.SERVICE_NOT_READY);
      }

      // 构建提示词
      let fullPrompt = prompt;
      if (codeOptions?.language) {
        fullPrompt += `\n使用 ${codeOptions.language} 语言`;
      }
      if (codeOptions?.framework) {
        fullPrompt += `\n使用 ${codeOptions.framework} 框架`;
      }
      if (codeOptions?.includeTests) {
        fullPrompt += "\n请包含测试代码";
      }

      // 发送消息
      const response = await options.messageHandler.sendMessage(fullPrompt, {
        ...codeOptions,
        systemPrompt: codeOptions?.systemPrompt || CODE_GENERATION_SYSTEM_PROMPT,
      });

      if (!response.success) {
        throw new Error(response.error || ERROR_MESSAGES.CODE_GENERATION_FAILED);
      }

      // 解析代码文件
      const files = parseCodeFromResponse(response.content || "");
      setGeneratedFiles(files);

      return {
        ...response,
        files,
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : ERROR_MESSAGES.CODE_GENERATION_FAILED;
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage,
      };
    }
  });

  /**
   * 同步生成的代码到文件系统
   * @param files 文件数组
   * @param overwrite 是否覆盖现有文件
   * @returns 是否同步成功
   */
  const syncCodeToFileSystem = useMemoizedFn(async (files: GeneratedFile[] = generatedFiles, overwrite: boolean = false): Promise<boolean> => {
    try {
      // 检查文件系统
      if (!fileSystem) {
        throw new Error("文件系统未初始化");
      }

      // 同步文件
      for (const file of files) {
        const exists = fileSystem.fileExists(file.path);
        if (exists && !overwrite) {
          console.warn(`文件已存在，跳过: ${file.path}`);
          continue;
        }

        // 确保目录存在
        const dirPath = file.path.split("/").slice(0, -1).join("/");
        if (dirPath) {
          await fileSystem.createDirectory(dirPath);
        }

        // 写入文件
        await fileSystem.writeFile(file.path, file.content);
      }

      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "同步代码到文件系统失败";
      setError(errorMessage);
      return false;
    }
  });

  /**
   * 预览生成的代码
   * @param files 文件数组
   * @returns 是否预览成功
   */
  const previewGeneratedCode = useMemoizedFn(async (files: GeneratedFile[] = generatedFiles): Promise<boolean> => {
    try {
      // 检查WebContainer
      if (!webContainer) {
        throw new Error("WebContainer未初始化");
      }

      // 创建临时文件系统
      const tempFiles = files.reduce((acc, file) => {
        acc[file.path] = {
          file: { contents: file.content },
        };
        return acc;
      }, {} as Record<string, { file: { contents: string } }>);

      // 启动预览
      await webContainer.startApp(tempFiles);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "预览生成的代码失败";
      setError(errorMessage);
      return false;
    }
  });

  return {
    // 状态
    generatedFiles,
    error,

    // 方法
    generateCode,
    syncCodeToFileSystem,
    previewGeneratedCode,
  };
};

export default useCodeGenerator;
