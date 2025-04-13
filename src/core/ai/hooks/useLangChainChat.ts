/**
 * LangChain聊天功能钩子
 */
import { useCallback } from "react";
import { useAtom } from "jotai";
import { BaseChatModel } from "@langchain/core/language_models/chat_models";
import { BaseChatMemory } from "langchain/memory";
import { isSendingAtom, isStreamingAtom, streamContentAtom } from "../atoms/modelAtoms";
import { MessageRole, SendMessageOptions } from "../types";
import { createConversationChain } from "../langchain/chains";
import { useLangChainConversation } from "./useLangChainConversation";

/**
 * LangChain聊天功能钩子
 * 提供消息发送和流式接收功能
 */
export function useLangChainChat() {
  // 状态原子
  const [isSending, setIsSending] = useAtom(isSendingAtom);
  const [isStreaming, setIsStreaming] = useAtom(isStreamingAtom);
  const [streamContent, setStreamContent] = useAtom(streamContentAtom);

  // 对话管理
  const conversation = useLangChainConversation();

  /**
   * 发送消息
   * @param model 语言模型
   * @param memory 记忆实例
   * @param content 消息内容
   * @param options 发送选项
   */
  /**
   * 从链的响应中提取内容
   * @param response 链的响应
   * @returns 响应内容
   */
  const getResponseContent = (response: Record<string, unknown>): string => {
    // 如果有 response 属性，使用它
    if ("response" in response && typeof response.response === "string") {
      return response.response;
    }

    // 如果有 text 属性，使用它
    if ("text" in response && typeof response.text === "string") {
      return response.text;
    }

    // 如果有 output 属性，使用它
    if ("output" in response && typeof response.output === "string") {
      return response.output;
    }

    // 如果只有一个键，使用它的值
    const keys = Object.keys(response);
    if (keys.length === 1) {
      return String(response[keys[0]]);
    }

    // 如果没有可用的内容，返回空字符串
    console.warn("无法从响应中提取内容，响应对象:", response);
    return "";
  };

  const sendMessage = useCallback(
    async (model: BaseChatModel, memory: BaseChatMemory, content: string, options: SendMessageOptions = {}) => {
      try {
        if (!conversation.currentConversationId) {
          throw new Error("没有选中的对话");
        }

        setIsSending(true);
        setIsStreaming(false);
        setStreamContent("");

        // 创建对话链
        const chain = createConversationChain(model, memory, options.systemPrompt || conversation.currentConversation?.systemPrompt);

        // 添加用户消息
        const userMessageId = conversation.addMessage(conversation.currentConversationId, {
          role: MessageRole.USER,
          content,
        });

        if (!userMessageId) {
          throw new Error("添加用户消息失败");
        }

        // 清空用户输入
        conversation.updateUserInput("");

        // 处理流式响应
        if (options.streaming && options.onStreamUpdate) {
          setIsStreaming(true);

          // 流式调用
          const response = await chain.call(
            { input: content },
            {
              callbacks: [
                {
                  handleLLMNewToken(token: string) {
                    setStreamContent((prev) => prev + token);
                    options.onStreamUpdate?.(token);
                  },
                },
              ],
            }
          );

          // 获取响应内容
          const responseContent = getResponseContent(response) || streamContent;

          // 添加助手消息
          conversation.addMessage(conversation.currentConversationId, {
            role: MessageRole.ASSISTANT,
            content: responseContent,
          });

          setIsStreaming(false);
          return responseContent;
        } else {
          // 非流式调用
          const response = await chain.call({ input: content });

          // 获取响应内容
          const responseContent = getResponseContent(response);

          // 添加助手消息
          conversation.addMessage(conversation.currentConversationId, {
            role: MessageRole.ASSISTANT,
            content: responseContent,
          });

          return responseContent;
        }
      } catch (error) {
        console.error("发送消息失败:", error);
        throw error;
      } finally {
        setIsSending(false);
        setIsStreaming(false);
      }
    },
    [conversation, setIsSending, setIsStreaming, setStreamContent, streamContent]
  );

  /**
   * 取消请求
   */
  const cancelRequest = useCallback(() => {
    // 目前LangChain没有直接支持取消请求的API
    // 这里只能重置状态
    setIsSending(false);
    setIsStreaming(false);

    return true;
  }, [setIsSending, setIsStreaming]);

  return {
    // 状态
    isSending,
    isStreaming,
    streamContent,

    // 方法
    sendMessage,
    cancelRequest,
  };
}
