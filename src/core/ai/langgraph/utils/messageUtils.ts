/**
 * 消息处理相关工具函数
 */
import { BaseMessage, AIMessage } from "@langchain/core/messages";

// 定义错误消息元数据类型
export interface ErrorMetadata {
  isError: boolean;
}

/**
 * 过滤消息历史，移除错误消息
 * @param messages 消息历史
 * @returns 过滤后的消息历史
 */
export const filterMessages = (messages: BaseMessage[]): BaseMessage[] => {
  // 过滤掉带有 isError 元数据的消息
  return messages.filter((message) => {
    // 检查消息是否有元数据，以及元数据中是否标记为错误消息
    const metadata = message.additional_kwargs?.metadata as ErrorMetadata | undefined;
    return !metadata?.isError;
  });
};

/**
 * 限制消息历史长度
 * @param messages 消息历史
 * @param maxCount 最大消息数量
 * @returns 限制长度后的消息历史
 */
export const limitMessagesCount = (messages: BaseMessage[], maxCount: number = 10): BaseMessage[] => {
  if (messages.length <= maxCount) {
    return messages;
  }
  return messages.slice(-maxCount);
};

/**
 * 创建错误消息
 * @param errorMessage 错误信息
 * @returns AI错误消息对象
 */
export const createErrorMessage = (errorMessage: string): AIMessage => {
  const message = new AIMessage({
    content: errorMessage,
  });
  message.additional_kwargs = {
    metadata: { isError: true },
  };
  return message;
};
