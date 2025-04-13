/**
 * 消息格式化工具
 */
import { Message, MessageRole } from "../types";
import { HumanMessage, AIMessage, SystemMessage } from "@langchain/core/messages";

/**
 * 将应用消息转换为LangChain消息
 * @param messages 应用消息数组
 * @returns LangChain消息数组
 */
export function formatMessagesToLangChain(messages: Message[]): (HumanMessage | AIMessage | SystemMessage)[] {
  return messages.map((message) => {
    switch (message.role) {
      case MessageRole.USER:
        return new HumanMessage(message.content);
      case MessageRole.ASSISTANT:
        return new AIMessage(message.content);
      case MessageRole.SYSTEM:
        return new SystemMessage(message.content);
      default:
        // 默认作为用户消息处理
        return new HumanMessage(message.content);
    }
  });
}

/**
 * 将LangChain消息转换为应用消息
 * @param langChainMessages LangChain消息数组
 * @returns 应用消息数组
 */
export function formatMessagesFromLangChain(langChainMessages: any[]): Message[] {
  return langChainMessages.map((message, index) => {
    let role: MessageRole;

    if (message._getType() === "human") {
      role = MessageRole.USER;
    } else if (message._getType() === "ai") {
      role = MessageRole.ASSISTANT;
    } else if (message._getType() === "system") {
      role = MessageRole.SYSTEM;
    } else {
      // 默认作为用户消息处理
      role = MessageRole.USER;
    }

    return {
      id: `msg_${Date.now()}_${index}`,
      role,
      content: message.content,
      timestamp: Date.now(),
    };
  });
}

/**
 * 创建系统消息
 * @param content 消息内容
 * @returns 系统消息
 */
export function createSystemMessage(content: string): Message {
  return {
    id: `system_${Date.now()}`,
    role: MessageRole.SYSTEM,
    content,
    timestamp: Date.now(),
  };
}

/**
 * 创建用户消息
 * @param content 消息内容
 * @returns 用户消息
 */
export function createUserMessage(content: string): Message {
  return {
    id: `user_${Date.now()}`,
    role: MessageRole.USER,
    content,
    timestamp: Date.now(),
  };
}

/**
 * 创建助手消息
 * @param content 消息内容
 * @returns 助手消息
 */
export function createAssistantMessage(content: string): Message {
  return {
    id: `assistant_${Date.now()}`,
    role: MessageRole.ASSISTANT,
    content,
    timestamp: Date.now(),
  };
}
