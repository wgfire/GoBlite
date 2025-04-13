/**
 * LangChain代码生成钩子
 */
import { useCallback } from "react";
import { BaseChatModel } from "@langchain/core/language_models/chat_models";
import { CodeGenerationParams, CodeGenerationResult, CodeFile } from "../types";
import { createCodeGenerationChain } from "../langchain/chains";
import { parseCodeResponse, mapToCodeFiles } from "../utils/responseParser";

/**
 * LangChain代码生成钩子
 * 提供代码生成功能
 */
export function useLangChainCode() {
  /**
   * 生成代码
   * @param model 语言模型
   * @param params 代码生成参数
   */
  const generateCode = useCallback(async (
    model: BaseChatModel,
    params: CodeGenerationParams
  ): Promise<CodeGenerationResult> => {
    try {
      // 创建代码生成链
      const chain = createCodeGenerationChain(
        model,
        params.language,
        params.framework,
        params.includeTests,
        params.includeComments
      );
      
      // 调用链
      const response = await chain.call({ input: params.prompt });
      
      // 解析响应
      const files = parseCodeResponse(response.text);
      const codeFiles = mapToCodeFiles(files);
      
      return {
        success: true,
        files: codeFiles,
      };
    } catch (error) {
      console.error("生成代码失败:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "生成代码失败",
      };
    }
  }, []);
  
  return {
    generateCode,
  };
}
