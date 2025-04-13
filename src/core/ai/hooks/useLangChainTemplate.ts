/**
 * LangChain模板处理钩子
 */
import { useCallback } from "react";
import { BaseChatModel } from "@langchain/core/language_models/chat_models";
import { TemplateProcessingParams, TemplateProcessingResult } from "../types";
import { createTemplateProcessingChain } from "../langchain/chains";
import { parseCodeResponse, mapToCodeFiles } from "../utils/responseParser";

/**
 * LangChain模板处理钩子
 * 提供模板处理功能
 */
export function useLangChainTemplate() {
  /**
   * 处理模板
   * @param model 语言模型
   * @param params 模板处理参数
   */
  const processTemplate = useCallback(async (
    model: BaseChatModel,
    params: TemplateProcessingParams
  ): Promise<TemplateProcessingResult> => {
    try {
      // 创建模板处理链
      const chain = createTemplateProcessingChain(model);
      
      // 准备模板信息
      // 实际应用中，这里应该从模板系统获取模板信息
      const templateInfo = `模板ID: ${params.templateId}`;
      
      // 准备表单数据
      const formData = JSON.stringify(params.formData, null, 2);
      
      // 调用链
      const response = await chain.call({
        templateInfo,
        formData,
        businessContext: params.businessContext || "",
      });
      
      // 解析响应
      const files = parseCodeResponse(response.text);
      const codeFiles = mapToCodeFiles(files);
      
      return {
        success: true,
        files: codeFiles,
      };
    } catch (error) {
      console.error("处理模板失败:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "处理模板失败",
      };
    }
  }, []);
  
  return {
    processTemplate,
  };
}
