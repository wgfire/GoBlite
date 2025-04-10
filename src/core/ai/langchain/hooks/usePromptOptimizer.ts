/**
 * 提示词优化钩子
 * 提供提示词优化功能
 */

import { useState, useCallback } from "react";
import { useMessageHandler } from "./useMessageHandler";
import { AIRequestOptions, AIResponse, AIServiceStatus } from "../../types";
import { ERROR_MESSAGES } from "../../constants";

/**
 * 提示词优化钩子选项
 */
export interface UsePromptOptimizerOptions {
  /** 消息处理钩子 */
  messageHandler: ReturnType<typeof useMessageHandler>;
  /** 服务状态 */
  status: AIServiceStatus;
}

/**
 * 提示词优化钩子
 * 提供提示词优化功能
 */
export const usePromptOptimizer = (options: UsePromptOptimizerOptions) => {
  // 状态
  const [error, setError] = useState<string | null>(null);

  /**
   * 优化提示词
   * @param prompt 原始提示词
   * @param requestOptions 请求选项
   * @returns 优化后的提示词
   */
  const optimizePrompt = useCallback(
    async (prompt: string, requestOptions?: AIRequestOptions): Promise<AIResponse> => {
      try {
        // 检查服务状态
        if (options.status !== AIServiceStatus.READY) {
          throw new Error(ERROR_MESSAGES.SERVICE_NOT_READY);
        }

        // 构建优化提示词
        const optimizationPrompt = `
          请帮我优化以下提示词，使其更加清晰、具体和有效：
          
          原始提示词：
          "${prompt}"
          
          请提供优化后的提示词，并解释你做了哪些改进。
        `;

        // 发送消息
        const response = await options.messageHandler.sendMessage(optimizationPrompt, {
          ...requestOptions,
          systemPrompt:
            requestOptions?.systemPrompt ||
            "你是一个专业的提示词优化专家。你的任务是帮助用户优化他们的提示词，使其更加清晰、具体和有效。请分析原始提示词，并提供优化后的版本，同时解释你做了哪些改进。",
        });

        return response;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "优化提示词失败";
        setError(errorMessage);
        return {
          success: false,
          error: errorMessage,
        };
      }
    },
    [options.status, options.messageHandler]
  );

  return {
    // 状态
    error,

    // 方法
    optimizePrompt,
  };
};

export default usePromptOptimizer;
