/**
 * 模板处理钩子
 * 提供模板处理功能
 */

import { useState, useCallback } from "react";
import { useCodeGenerator } from "./useCodeGenerator";
import { AIServiceStatus, TemplateProcessOptions, TemplateProcessResult } from "../../types";
import { TEMPLATE_PROCESSING_SYSTEM_PROMPT, ERROR_MESSAGES } from "../../constants";

/**
 * 模板处理钩子选项
 */
export interface UseTemplateProcessorOptions {
  /** 代码生成钩子 */
  codeGenerator: ReturnType<typeof useCodeGenerator>;
  /** 服务状态 */
  status: AIServiceStatus;
}

/**
 * 模板处理钩子
 * 提供模板处理功能
 */
export const useTemplateProcessor = (options: UseTemplateProcessorOptions) => {
  // 状态
  const [error, setError] = useState<string | null>(null);

  /**
   * 处理模板
   * @param templateOptions 模板处理选项
   * @returns 模板处理结果
   */
  const processTemplate = useCallback(
    async (templateOptions: TemplateProcessOptions): Promise<TemplateProcessResult> => {
      try {
        // 检查服务状态
        if (options.status !== AIServiceStatus.READY) {
          throw new Error(ERROR_MESSAGES.SERVICE_NOT_READY);
        }

        // 构建提示词
        const prompt = `
          请根据以下模板和数据生成代码：
          
          模板ID: ${templateOptions.templateId}
          
          模板数据:
          ${JSON.stringify(templateOptions.templateData, null, 2)}
          
          ${
            templateOptions.businessContext
              ? `
          业务上下文:
          行业: ${templateOptions.businessContext.industry || "未指定"}
          业务目标: ${templateOptions.businessContext.businessGoal || "未指定"}
          目标受众: ${templateOptions.businessContext.targetAudience || "未指定"}
          设计风格: ${templateOptions.businessContext.designStyle || "未指定"}
          `
              : ""
          }
          
          请生成完整的代码文件，每个文件使用单独的代码块，并在代码块前注明文件路径。
        `;

        // 生成代码
        const result = await options.codeGenerator.generateCode(prompt, {
          ...templateOptions,
          systemPrompt: templateOptions.systemPrompt || TEMPLATE_PROCESSING_SYSTEM_PROMPT,
        });

        if (!result.success) {
          throw new Error(result.error || ERROR_MESSAGES.TEMPLATE_PROCESSING_FAILED);
        }

        return {
          ...result,
          templateId: templateOptions.templateId,
        };
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : ERROR_MESSAGES.TEMPLATE_PROCESSING_FAILED;
        setError(errorMessage);
        return {
          success: false,
          error: errorMessage,
          templateId: templateOptions.templateId,
        };
      }
    },
    [options.status, options.codeGenerator]
  );

  return {
    // 状态
    error,

    // 方法
    processTemplate,
  };
};

export default useTemplateProcessor;
