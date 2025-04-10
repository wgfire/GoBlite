/**
 * 消息处理钩子
 * 提供消息发送、解析和处理功能
 */

import { useState, useCallback } from "react";
import { AIMessage } from "@langchain/core/messages";
import { useModelManager } from "./useModelManager";
import { useConversationManager } from "./useConversationManager";
import { parseAIResponse, parseCodeFromResponse } from "../../utils/responseParser";
import { AIRequestOptions, AIResponse, AIMessageContent, AIServiceStatus, UsageMetadata, CodeGenerationResult, GeneratedFile } from "../../types";
import { ERROR_MESSAGES } from "../../constants";

/**
 * 消息处理钩子选项
 */
export interface UseMessageHandlerOptions {
  /** 模型管理器钩子 */
  modelManager: ReturnType<typeof useModelManager>;
  /** 对话管理器钩子 */
  conversationManager: ReturnType<typeof useConversationManager>;
}

/**
 * 消息处理钩子
 * 提供消息发送、解析和处理功能
 */
export const useMessageHandler = (options: UseMessageHandlerOptions) => {
  // 状态
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [abortController, setAbortController] = useState<AbortController | null>(null);

  /**
   * 发送消息
   * @param prompt 提示词
   * @param requestOptions 请求选项
   * @returns AI响应
   */
  const sendMessage = useCallback(
    async (prompt: string, requestOptions?: AIRequestOptions): Promise<AIResponse> => {
      try {
        // 检查服务状态
        if (options.modelManager.status !== AIServiceStatus.READY) {
          throw new Error(ERROR_MESSAGES.SERVICE_NOT_READY);
        }

        // 检查模型管理器
        if (!options.modelManager.modelManager) {
          throw new Error(ERROR_MESSAGES.MODEL_MANAGER_NOT_INITIALIZED);
        }

        // 设置处理中状态
        setIsProcessing(true);
        setError(null);

        // 创建中止控制器
        const controller = new AbortController();
        setAbortController(controller);

        // 获取对话ID
        const conversationId = requestOptions?.conversationId || options.conversationManager.currentConversationId;

        // 获取系统提示词
        const systemPrompt = requestOptions?.systemPrompt || options.conversationManager.getSystemPrompt(conversationId);

        // 添加用户消息到对话
        options.conversationManager.addMessage("user", prompt);

        // 准备消息数组
        const messages: Array<[string, string]> = [
          ["system", systemPrompt],
          ...options.conversationManager.getMessages(conversationId).map((msg) => [msg.role, msg.content] as [string, string]),
        ];

        // 发送消息到模型
        let content = "";
        const response = await options.modelManager.modelManager.sendMessage(messages, {
          streaming: requestOptions?.streaming,
          onStreamingUpdate: (streamContent) => {
            content = streamContent;
            requestOptions?.onStreamingUpdate?.(streamContent);
          },
        });

        // 提取内容
        content = content || response.content;

        // 添加助手消息到对话
        options.conversationManager.addMessage("assistant", content);

        // 解析响应内容
        const parsedContent = parseAIResponse(content);

        // 提取使用情况元数据
        const usage: UsageMetadata | undefined = response.usage_metadata;

        // 创建响应对象
        const aiResponse: AIResponse = {
          success: true,
          content,
          parsedContent,
          usage,
        };

        return aiResponse;
      } catch (err) {
        // 处理错误
        const errorMessage = err instanceof Error ? err.message : ERROR_MESSAGES.REQUEST_FAILED;
        setError(errorMessage);

        return {
          success: false,
          error: errorMessage,
        };
      } finally {
        // 清理状态
        setIsProcessing(false);
        setAbortController(null);
      }
    },
    [options.modelManager, options.conversationManager]
  );

  /**
   * 解析响应
   * @param text 文本内容
   * @returns 解析后的内容
   */
  const parseResponse = useCallback((text: string): AIMessageContent[] => {
    try {
      return parseAIResponse(text);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : ERROR_MESSAGES.RESPONSE_PARSING_FAILED;
      setError(errorMessage);
      return [
        {
          type: "text",
          content: text,
        },
      ];
    }
  }, []);

  /**
   * 取消请求
   */
  const cancelRequest = useCallback(() => {
    if (abortController) {
      abortController.abort();
      setAbortController(null);
      setIsProcessing(false);
    }
  }, [abortController]);

  return {
    // 状态
    isProcessing,
    error,

    // 方法
    sendMessage,
    parseResponse,
    cancelRequest,
  };
};

export default useMessageHandler;
