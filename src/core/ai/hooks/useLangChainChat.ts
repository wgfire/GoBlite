/**
 * LangChain聊天功能钩子
 */
import { useCallback } from "react";
import { useAtom } from "jotai";
import { BaseChatModel } from "@langchain/core/language_models/chat_models";
import { BaseChatMemory } from "langchain/memory";
import { isSendingAtom, isStreamingAtom, streamContentAtom } from "../atoms/modelAtoms";
import { MessageRole, SendMessageOptions } from "../types";
import { createUnifiedResponseChain, createStrictUnifiedResponseChain } from "../langchain/chains/unifiedResponseChain";
import { useLangChainConversation } from "./useLangChainConversation";
import { validateUnifiedResponse, createDefaultUnifiedResponse, UnifiedResponse } from "../utils/responseValidator";
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
   * 从链的响应中提取内容
   * @param response 链的响应
   * @returns 响应内容
   */
  const getResponseContent = (response: Record<string, unknown> | unknown): string => {
    try {
      // 如果响应不是对象，直接转换为字符串
      if (!response || typeof response !== "object") {
        return String(response || "");
      }

      // 将响应转换为记录类型
      const responseObj = response as Record<string, unknown>;

      // 检查常见的输出键
      const commonKeys = ["response", "text", "output", "content", "answer", "result", "message"];
      for (const key of commonKeys) {
        if (key in responseObj && responseObj[key] != null) {
          return String(responseObj[key]);
        }
      }

      // 如果只有一个键，使用它的值
      const keys = Object.keys(responseObj);
      if (keys.length === 1) {
        return String(responseObj[keys[0]] || "");
      }

      // 如果有多个键，尝试找到一个包含字符串值的键
      for (const key of keys) {
        const value = responseObj[key];
        if (typeof value === "string" && value.length > 0) {
          return value;
        }
      }

      // 如果没有找到字符串值，尝试将整个对象转换为 JSON
      return JSON.stringify(responseObj);
    } catch (error) {
      console.warn("在提取响应内容时出错:", error);
      // 尝试直接将响应转换为字符串
      return String(response || "");
    }
  };
  const sendMessage = useCallback(
    async (model: BaseChatModel, memory: BaseChatMemory, content: string, options: SendMessageOptions = { streaming: true }) => {
      try {
        if (!conversation.currentConversationId) {
          throw new Error("没有选中的对话");
        }

        setIsSending(true);
        setIsStreaming(false);
        setStreamContent("");

        // 创建对话链
        const chain = createUnifiedResponseChain(model, memory);

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
          console.log("开始流式调用链...");
          let response;
          try {
            // 尝试使用 invoke 方法，这是 LCEL 推荐的方式
            response = await chain.invoke(
              {
                userInput: content,
                templateInfo: options.templateInfo || "",
              },
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
            console.log("链调用响应 (invoke):", response);
          } catch (invokeError) {
            console.error("使用 invoke 方法失败:", invokeError);
          }

          // 获取响应内容
          let responseContent = "";

          try {
            responseContent = getResponseContent(response);

            // 如果响应内容仍然为空，尝试将整个响应转换为字符串
            if (!responseContent && response) {
              responseContent = typeof response === "string" ? response : JSON.stringify(response);
            }
          } catch (error) {
            console.error("解析流式响应内容时出错:", error);
            // 尝试直接将响应转换为字符串作为后备方案
            responseContent = String(response?.text || response?.output || response?.response || response?.content || JSON.stringify(response));
          }

          // 添加助手消息
          conversation.addMessage(conversation.currentConversationId, {
            role: MessageRole.ASSISTANT,
            content: responseContent,
          });

          setIsStreaming(false);
          return responseContent;
        } else {
          // 非流式调用
          // 尝试使用 invoke 方法，这是 LCEL 推荐的方式
          console.log("开始非流式调用链...");
          let response;
          try {
            response = await chain.invoke({
              userInput: content,
              templateInfo: options.templateInfo || "",
            });
            console.log("链调用响应 (invoke):", response);
          } catch (invokeError) {
            console.error("使用 invoke 方法失败，尝试使用 call 方法:", invokeError);
            // 如果 invoke 失败，再次尝试 invoke 方法
            response = await chain.invoke({
              userInput: content,
              templateInfo: options.templateInfo || "",
            });
            console.log("链调用响应 (call):", response);
          }

          // 获取响应内容
          let responseContent = "";

          try {
            // 先检查是否有 response 键

            responseContent = getResponseContent(response);

            // 如果响应内容仍然为空，尝试将整个响应转换为字符串
            if (!responseContent && response) {
              responseContent = typeof response === "string" ? response : JSON.stringify(response);
            }
          } catch (error) {
            console.error("解析响应内容时出错:", error);
            // 尝试直接将响应转换为字符串作为后备方案
            responseContent = String(response?.text || response?.output || response?.response || response?.content || JSON.stringify(response));
          }

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
    [conversation, setIsSending, setIsStreaming, setStreamContent]
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

  /**
   * 发送统一请求
   * @param userInput 用户输入
   * @param model 语言模型
   * @param memory 记忆实例
   * @param templateInfo 模板信息（可选）
   * @returns 结构化响应
   */
  const sendUnifiedRequest = useCallback(
    async (
      userInput: string,
      model?: BaseChatModel,
      memory?: BaseChatMemory,
      templateInfo?: string
    ): Promise<{
      success: boolean;
      data?: UnifiedResponse;
      error?: string;
      rawResponse?: string;
    }> => {
      const MAX_RETRIES = 3;
      let retryCount = 0;

      while (retryCount < MAX_RETRIES) {
        try {
          // 使用提供的模型和记忆
          const activeModel = model;
          const activeMemory = memory;

          if (!activeModel) {
            throw new Error("模型未初始化");
          }

          if (!activeMemory) {
            throw new Error("记忆未初始化");
          }

          // 创建统一响应链
          let chain = createUnifiedResponseChain(activeModel, activeMemory);

          // 准备上下文数据
          const context = {
            userInput,
            templateInfo: templateInfo || "",
          };

          // 调用链
          const parsedResponse = await chain.invoke(context);
          console.log("原始响应:", parsedResponse, context);

          // 解析JSON响应
          try {
            // 验证响应结构
            if (parsedResponse && validateUnifiedResponse(parsedResponse)) {
              // 将对话添加到记忆中
              if (activeMemory) {
                // 使用 LangChain 的消息历史功能
                await activeMemory.saveContext({ input: userInput }, { response: parsedResponse.response.text });
                console.log("已将对话保存到记忆中");
              }

              return {
                success: true,
                data: parsedResponse as UnifiedResponse,
              };
            } else {
              console.warn("响应结构验证失败，重试中...", parsedResponse);
              retryCount++;

              // 如果是最后一次重试，使用更严格的提示词
              if (retryCount === MAX_RETRIES - 1) {
                // 创建更严格的提示词，强调结构的重要性
                chain = createStrictUnifiedResponseChain(activeModel, activeMemory);
                // 重新调用链时使用相同的上下文
                const parsedResponse = await chain.invoke(context);
                try {
                  // 验证响应结构
                  if (parsedResponse && validateUnifiedResponse(parsedResponse)) {
                    // 将对话添加到记忆中
                    if (activeMemory) {
                      // 使用 LangChain 的消息历史功能
                      await activeMemory.saveContext({ input: userInput }, { response: parsedResponse.response.text });
                      console.log("已将对话保存到记忆中(严格模式)");
                    }

                    return {
                      success: true,
                      data: parsedResponse as UnifiedResponse,
                    };
                  }
                } catch (parseError) {
                  console.error("严格模式下解析响应失败:", parseError);
                }
              }

              continue;
            }
          } catch (parseError) {
            console.error("解析响应失败，重试中...", parseError);
            retryCount++;
            continue;
          }
        } catch (error) {
          console.error("发送统一请求失败:", error);
          return {
            success: false,
            error: error instanceof Error ? error.message : "发送请求失败",
          };
        }
      }

      // 所有重试都失败，返回默认响应
      console.error(`在 ${MAX_RETRIES} 次尝试后仍未获得有效响应`);
      return {
        success: false,
        error: "无法获取有效的结构化响应",
        data: createDefaultUnifiedResponse("抱歉，我无法正确处理您的请求。请尝试重新表述您的问题或需求。"),
      };
    },
    []
  );

  return {
    // 状态
    isSending,
    isStreaming,
    streamContent,

    // 方法
    sendMessage,
    sendUnifiedRequest,
    cancelRequest,
  };
}
